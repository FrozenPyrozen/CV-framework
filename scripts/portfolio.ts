// npm run portfolio -- refresh | check [--projects-reviewed]
// The public portfolio's Markdown, portfolio/portfolio.md (specs/outputs/portfolio.md 4, plan 9e P3).
//   refresh  writes the generated parts: the cover, each opted-in project's title lines and its public images and
//            links (only section 8 items with public: yes, confirmed by user), the skills overview and the contact
//            line. It keeps the text the portfolio agent wrote, adds a placeholder for a newly opted-in project and
//            drops projects that are no longer opted in.
//   check    every sentence and bullet the agent wrote has a source that resolves and belongs to its project (or,
//            in the intro, to an opted-in project or the profile); no placeholder is left; no confidentiality term
//            (only `allow_in: [portfolio]` lets one through), hidden client name, ticket id, internal address,
//            secret or foreign URL; spelling. When it passes, it records the state `status` uses (stale projects).
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { readState, writeRecord } from "./lib/buildstate.ts";
import { formatPeriod, headerBlock, loadContext, skillsBlock, stripComments, wrapBlock, type Context } from "./lib/cvmd.ts";
import { isMain, loadConfig, loadDecisions, loadSummaries, rootPath, type Summary } from "./lib/repo.ts";
import { buildBlocklist, printFindings, secretFindings, type Finding } from "./lint.ts";
import { parseArgs } from "./refresh.ts";
import { spellcheckText } from "./spellcheck.ts";
import { buildSourceIndex, sentencePieces } from "./trace.ts";

export const PORTFOLIO_TITLE = "My Portfolio";
export const PLACEHOLDER = "<!-- TODO(/portfolio): write this project -->";
export const INTRO_PLACEHOLDER = "<!-- TODO(/portfolio): write the intro paragraph -->";

export const portfolioPath = () => rootPath(loadConfig().paths.portfolio ?? "portfolio", "portfolio.md");
const rel = (p: string) => relative(rootPath(), p);
const hash = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 16);

// Opted-in projects in portfolio order: portfolio_order first, then newest first.
export function portfolioProjects(summaries = loadSummaries()): Summary[] {
  return summaries
    .filter((s) => s.frontMatter.show_in_portfolio === true)
    .sort((a, b) => (a.frontMatter.portfolio_order ?? 999) - (b.frontMatter.portfolio_order ?? 999) || String(b.frontMatter.period?.start).localeCompare(String(a.frontMatter.period?.start)));
}

// What a project page is written from: sections 1–5 and 7, the public section 8 items and the portfolio fields.
export function projectSourceHash(s: Summary): string {
  const used = s.sections.filter((x) => [1, 2, 3, 4, 5, 7].includes(x.number)).map((x) => x.text).join("\n");
  const fm = s.frontMatter;
  return hash(JSON.stringify([used, s.portfolio.filter((i) => i.isPublic), fm.role, fm.portfolio_label ?? fm.cv_client_label, fm.period, fm.portfolio_max_items]));
}

const showPhone = () => (loadDecisions()?.decisions ?? []).some((d: any) => d.id === "portfolio-show-phone");

function coverBlock(ctx: Context): string {
  // The CV header without the location line, and without the phone unless decision portfolio-show-phone exists (public link).
  const cv = headerBlock({ ...ctx, market: { ...ctx.market, header: { ...ctx.market.header, show_phone: showPhone() && ctx.market.header.show_phone } } });
  const [name, headline, , contacts] = cv.split("\n\n");
  // The portfolio doesn't link to itself: a profile link labeled "Portfolio" is left out here.
  const own = (ctx.profile.contacts.links ?? []).filter((l: any) => /portfolio/i.test(l.label)).map((l: any) => ctx.cfg.header.link_format.replace("{label}", l.label).replace("{url}", l.url));
  const sep = ctx.cfg.display.field_separator;
  const kept = contacts.split(sep).filter((c) => !own.includes(c)).join(sep);
  return [`# **${PORTFOLIO_TITLE}**`, name.replace(/^# /, "## "), headline, kept].join("\n\n");
}

function projectTitleBlock(s: Summary, ctx: Context): string {
  const fm = s.frontMatter;
  return [`## **${fm.role}**`, `### **${fm.portfolio_label ?? fm.cv_client_label}${ctx.cfg.display.field_separator}${formatPeriod(fm.period, ctx.cfg)}**`].join("\n\n");
}

function mediaBlock(s: Summary): string {
  const out: string[] = [];
  for (const it of s.portfolio.filter((i) => i.isPublic)) {
    if (it.kind === "image") out.push(`![${it.caption}](${it.value})`, `*${it.caption}*`);
    if (it.kind === "link") out.push(`[${it.label}](${it.value})`);
    if (it.kind === "demo") out.push(`Demo: ${it.value}`);
  }
  return out.join("\n\n");
}

function contactBlock(ctx: Context): string {
  return ["## **Contact**", coverBlock(ctx).split("\n\n")[3]].join("\n\n");
}

const BLOCK = (name: string) => new RegExp(`<!-- generated:${name} -->[\\s\\S]*?<!-- /generated:${name} -->\\n?`, "g");

// Splits an existing portfolio.md into the intro text and each project's agent-written text.
export function parsePortfolio(text: string): { intro: string; projects: Map<string, string> } {
  const projects = new Map<string, string>();
  const body = text.replace(BLOCK("portfolio-cover"), "").replace(BLOCK("skills"), "").replace(BLOCK("contact"), "");
  const parts = body.split(/^<!-- project: ([\w-]+) -->$/m);
  const intro = parts[0].trim();
  for (let i = 1; i < parts.length; i += 2) projects.set(parts[i], parts[i + 1].replace(BLOCK(`project-${parts[i]}`), "").replace(BLOCK(`media-${parts[i]}`), "").trim());
  return { intro, projects };
}

export function refreshPortfolio(): { text: string; added: string[]; removed: string[] } {
  const ctx = loadContext();
  const file = portfolioPath();
  const old = existsSync(file) ? parsePortfolio(readFileSync(file, "utf8")) : { intro: "", projects: new Map<string, string>() };
  const projects = portfolioProjects();
  const ids = projects.map((p) => p.id);
  const added = ids.filter((id) => !old.projects.has(id));
  const removed = [...old.projects.keys()].filter((id) => !ids.includes(id));
  const parts = [wrapBlock("portfolio-cover", coverBlock(ctx)), old.intro || INTRO_PLACEHOLDER];
  for (const p of projects) {
    parts.push(`<!-- project: ${p.id} -->`, wrapBlock(`project-${p.id}`, projectTitleBlock(p, ctx)), wrapBlock(`media-${p.id}`, mediaBlock(p)), old.projects.get(p.id) || PLACEHOLDER);
  }
  parts.push(wrapBlock("skills", ["## **Skills**", skillsBlock(ctx)].join("\n\n")), wrapBlock("contact", contactBlock(ctx)));
  return { text: parts.join("\n\n") + "\n", added, removed };
}

export async function checkPortfolio(file = portfolioPath()): Promise<Finding[]> {
  const f: Finding[] = [];
  const r = rel(file);
  const add = (level: Finding["level"], message: string, line?: number) => f.push({ level, file: r, line, message });
  if (!existsSync(file)) { add("error", "portfolio/portfolio.md doesn't exist: run npm run portfolio -- refresh, then /portfolio"); return f; }
  const text = readFileSync(file, "utf8");
  const ctx = loadContext();
  const summaries = loadSummaries();
  const opted = new Set(portfolioProjects(summaries).map((s) => s.id));
  const idx = buildSourceIndex();
  const lines = text.split("\n");
  const bl = buildBlocklist(summaries, ctx);
  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Images: each one shown must be a public item of its own project (refresh writes only those; this catches hand edits).
  let owner = "";
  lines.forEach((raw, i) => {
    const pm = raw.match(/^<!-- project: ([\w-]+) -->$/);
    if (pm) owner = pm[1];
    const im = raw.match(/^!\[[^\]]*\]\(([^)]+)\)$/);
    if (!im) return;
    const s = summaries.find((x) => x.id === owner);
    if (!s?.portfolio.some((it) => it.kind === "image" && it.isPublic && it.value === im[1])) add("error", `image ${im[1]} isn't a public item of ${owner || "any project"}'s section 8`, i + 1);
  });
  // Files in portfolio/assets/ that no summary's section 8 lists (kept in git for nothing).
  const assets = rootPath(loadConfig().paths.portfolio ?? "portfolio", "assets");
  if (existsSync(assets)) {
    const listed = new Set(summaries.flatMap((s) => s.portfolio.filter((it) => it.kind === "image").map((it) => resolve(rootPath(loadConfig().paths.portfolio ?? "portfolio"), it.value))));
    const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
    for (const f of walk(assets)) if (!listed.has(f) && !f.endsWith(".DS_Store")) add("warning", `${rel(f)} isn't used by any summary's section 8`);
  }

  let inBlock = false;
  let project = ""; // "" = the intro
  let para: { text: string; line: number; bullet?: boolean } | null = null;
  const flush = () => {
    if (!para) return;
    for (const piece of sentencePieces(para.text)) {
      if (!piece.src.length) { if (piece.text) add("error", `${para.bullet ? "bullet" : "sentence"} without a source: "${piece.text.slice(0, 70)}"`, para.line); continue; }
      for (const id of piece.src) {
        const res = idx.resolve(id);
        const owner = id.split("#")[0];
        if (!res.ok) add("error", `source "${id}" doesn't resolve`, para.line);
        else if (id === "profile" || id.startsWith("calc:")) { if (project) add("error", `source "${id}" belongs in the intro, not in a project`, para.line); }
        else if (!opted.has(res.entry ?? owner)) add("error", `source "${id}" is from a project that isn't in the portfolio (show_in_portfolio)`, para.line);
        else if (project && (res.entry ?? owner) !== project) add("error", `source "${id}" belongs to ${res.entry ?? owner}, not to this project (${project})`, para.line);
      }
    }
    para = null;
  };
  lines.forEach((raw, i) => {
    const ln = i + 1;
    if (/^<!-- generated:/.test(raw)) { flush(); inBlock = true; return; }
    if (/^<!-- \/generated:/.test(raw)) { inBlock = false; return; }
    if (inBlock) return;
    const pm = raw.match(/^<!-- project: ([\w-]+) -->$/);
    if (pm) { flush(); project = pm[1]; if (!opted.has(project)) add("error", `project ${project} isn't opted in (show_in_portfolio): run npm run portfolio -- refresh`, ln); return; }
    if (raw.includes("TODO(/portfolio)")) { add("error", `${project || "intro"}: not written yet (run /portfolio)`, ln); return; }
    const visible = stripComments(raw);
    // Confidentiality: the portfolio is public. Only allow_in: [portfolio] lets a section 9 term through.
    for (const t of bl.terms) {
      if (t.allowIn.includes("portfolio")) continue;
      if (new RegExp(`(?<![\\w-])${escapeRe(t.term)}(?![\\w-])`, t.anyCase ? "i" : "").test(visible)) add("error", `confidential term "${t.term}" (from ${t.from})`, ln);
    }
    for (const p of bl.prefixes) if (new RegExp(`(?<![\\w-])${escapeRe(p)}\\d`).test(visible)) add("error", `ticket id with prefix "${p}"`, ln);
    for (const re of bl.urlPatterns) if (re.test(visible)) add("error", `internal address matching ${re.source}`, ln);
    if (!raw.trim()) { flush(); return; }
    if (/^\*\*[^*]+\*\*$/.test(raw.trim()) || /^#{1,3} /.test(raw)) { flush(); return; } // section labels and headings
    if (/^\* /.test(raw)) {
      flush();
      para = { text: raw.replace(/^\* /, ""), line: ln, bullet: true };
      flush();
      return;
    }
    if (para) para.text += " " + raw; else para = { text: raw, line: ln };
  });
  flush();
  // Generated parts are refresh's: compare with what refresh would write now.
  if (refreshPortfolio().text !== text) add("warning", "generated parts or the project list are out of date: run npm run portfolio -- refresh");
  // Secrets and foreign URLs: only profile links and public link items may appear.
  const allowed = [...(ctx.profile.contacts.links ?? []).map((l: any) => l.url), ...summaries.flatMap((s) => s.portfolio.filter((i) => i.isPublic && i.kind === "link").map((i) => i.value))];
  for (const s of secretFindings(stripComments(text), ctx, allowed, { checkUrls: true })) add("error", `secret scan: ${s}`);
  for (const sp of await spellcheckText(text, r)) add("error", `unknown word "${sp.word}" (fix it, or add it to facts/dictionary.txt if it's right)`, sp.line);
  return f;
}

// Project text per project id, to see which projects the agent rewrote.
function projectTexts(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, t] of parsePortfolio(text).projects) out[id] = hash(t);
  return out;
}

// Records, after a passing check, which summary state each project was written from (status: stale projects).
// A project whose sources changed keeps its old record until its text changes or --projects-reviewed is given.
export function recordPortfolio(file: string, reviewed = false): void {
  const key = rel(file);
  const prev = readState()[key];
  const text = readFileSync(file, "utf8");
  const texts = projectTexts(text);
  const entries: Record<string, string> = {};
  for (const s of portfolioProjects()) {
    const now = projectSourceHash(s);
    const was = prev?.entries?.[s.id];
    const rewritten = prev?.entry_text?.[s.id] !== texts[s.id];
    entries[s.id] = !was || was === now || rewritten || reviewed ? now : was;
  }
  writeRecord(file, { built_at: new Date().toISOString(), template: "", md_sha: hash(text), sources: {}, outputs: prev?.outputs ?? {}, entries, entry_text: texts });
}

export interface PortfolioStatus { exists: boolean; toWrite: string[]; toRewrite: string[]; notInFile: string[]; changedSinceCheck: boolean; neverChecked: boolean; generatedStale: boolean; neverBuilt: boolean; builtOutdated: boolean }

export function portfolioStatus(): PortfolioStatus {
  const file = portfolioPath();
  const projects = portfolioProjects();
  if (!existsSync(file)) return { exists: false, toWrite: [], toRewrite: [], notInFile: projects.map((p) => p.id), changedSinceCheck: false, neverChecked: true, generatedStale: false, neverBuilt: true, builtOutdated: false };
  const text = readFileSync(file, "utf8");
  const parsed = parsePortfolio(text);
  const rec = readState()[rel(file)];
  return {
    exists: true,
    toWrite: [...parsed.projects].filter(([, t]) => t.includes("TODO(/portfolio)")).map(([id]) => id),
    toRewrite: projects.filter((p) => rec?.entries?.[p.id] && rec.entries[p.id] !== projectSourceHash(p)).map((p) => p.id),
    notInFile: projects.filter((p) => !parsed.projects.has(p.id)).map((p) => p.id),
    changedSinceCheck: !!rec && rec.md_sha !== hash(text),
    neverChecked: !rec,
    // profile.yaml, skills.yaml, section 8 items or titles changed: the generated parts differ from what refresh writes
    generatedStale: refreshPortfolio().text !== text,
    // build:portfolio records the Markdown it was built from (outputs["portfolio/portfolio.md#built"]).
    neverBuilt: !rec?.outputs?.[`${rel(file)}#built`],
    builtOutdated: !!rec?.outputs?.[`${rel(file)}#built`] && rec.outputs[`${rel(file)}#built`] !== hash(text),
  };
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const cmd = positional[0];
  const file = portfolioPath();
  if (cmd === "refresh") {
    const r = refreshPortfolio();
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, r.text);
    const n = portfolioProjects().length;
    console.log(`portfolio: ${rel(file)} refreshed (${n} project(s) opted in${r.added.length ? `; to write: ${r.added.join(", ")}` : ""}${r.removed.length ? `; removed: ${r.removed.join(", ")}` : ""})`);
    if (!n) console.log("  no project has show_in_portfolio: true yet: run /portfolio-material");
  } else if (cmd === "check") {
    const findings = await checkPortfolio(file);
    printFindings(findings);
    const errors = findings.filter((x) => x.level === "error").length;
    console.log(`\nportfolio check: ${errors} error(s), ${findings.length - errors} warning(s)`);
    if (errors) process.exit(1);
    recordPortfolio(file, !!args["projects-reviewed"]);
  } else {
    console.error("usage: npm run portfolio -- refresh | check [--projects-reviewed]");
    process.exit(2);
  }
}
