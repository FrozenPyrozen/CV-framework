// npm run review-context -- <cv.md> <rubric> [--market <id>] [--jd <file>] [--portfolio]
// Writes one Markdown bundle per CV and rubric to .cv-runs/review-context/<cv-slug>-<rubric>.md with only what
// that reviewer needs (agents/reviewer.md inputs and the rubric's own text): the rubric, the report format, the CV
// with line numbers, its market and role-profile settings, the build checks, and only the decisions that fit the
// rubric and the CV (the rest listed by id). The reviewer reads the bundle instead of a dozen files and opens a full
// file only where the bundle points to it. Deterministic: no AI calls.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { stringify } from "yaml";
import { calculate, isMasterFile, parseCv, profileIdForFile } from "./lib/cvmd.ts";
import { masterCvPath, marketCvPath } from "./lib/paths.ts";
import {
  type Market, cliPath, isMain, loadConfig, loadConfirmed, loadDecisions, loadEntries, loadMarkets, loadProfile,
  loadSummaries, readYaml, rootPath,
} from "./lib/repo.ts";
import { markdownVisibleText } from "./lib/text.ts";
import { parseArgs } from "./refresh.ts";

export const RUBRICS = ["ats", "hr", "proofreading", "fact-check", "confidentiality", "layout"] as const;
export type Rubric = (typeof RUBRICS)[number];
const PORTFOLIO_RUBRICS: Rubric[] = ["proofreading", "fact-check", "confidentiality", "layout"];

// Words in a decision's text that make it relevant to a rubric even when none of its keywords is in the CV.
const TOPICS: Record<Rubric, RegExp> = {
  ats: /\b(keywords?|skills?|length|pages?|header|links?|contacts?|email|contract|full-time|dates?|titles?|acronyms?|stack|headline|claims?)\b/i,
  hr: /\b(name|legal|titles?|tenure|contract|full-time|employ\w*|interview|consulting|freelance|relocation|links?|summary|headline|length|describe)\b/i,
  proofreading: /\b(wording|words?|spelling|sentence|summary|tense|written|phrase|describe)\b/i,
  "fact-check": /\b(figures?|numbers?|metrics?|confirmed|wording|claims?|stack|hands-on|sources?)\b/i,
  confidentiality: /\b(hidden|clients?|confidential|NDA|public|internal|names?|details?|share)\b/i,
  layout: /\b(pages?|layout|break|screenshots?|images?|rows?|parenthes[ie]s)\b/i,
};

interface Decision { id: string; decision: string; date?: string; why?: string; matches?: string[] }
interface Options { cv?: string; rubric: string; market?: string; jd?: string; portfolio?: boolean }

const rel = (p: string) => relative(rootPath(), p);
const read = (p: string) => readFileSync(p, "utf8");
export const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const has = (text: string, phrase: string) => new RegExp(`(?<![\\w-])${esc(phrase)}(?![\\w-])`, "i").test(text);

// A rubric file without the parts that don't apply: its *Portfolio mode* section outside --portfolio.
function rubricText(rubric: Rubric, portfolio: boolean): string {
  const text = read(rootPath("specs", "rubrics", `${rubric}.md`)).trim();
  return portfolio ? text : text.replace(/^## Portfolio mode[\s\S]*?(?=^## )/m, "");
}

// The rules every agent follows (AGENTS.md), so a reviewer needn't read the whole entry point.
export function agentRules(): string {
  const file = rootPath("AGENTS.md");
  const rules = existsSync(file) ? read(file).match(/^## Rules for every agent\n([\s\S]*?)(?=^## )/m)?.[1].trim() : undefined;
  return rules ?? "Could not extract the rules: read `AGENTS.md` (rules for every agent) before reviewing.";
}

// The report format's essentials: the format block of specs/review-report-spec.md and its rules in one line.
function reportFormat(): string {
  const spec = read(rootPath("specs", "review-report-spec.md"));
  const block = spec.match(/```markdown\n[\s\S]*?```/)?.[0] ?? "(format block not found: open specs/review-report-spec.md)";
  return `${block}\n\nRules: severity high (rejection, false claim, leak, broken file) / medium / low; findings ranked high first; location is \`file:line\` plus a readable pointer; \`needs_user_input: yes\` only when the user alone can resolve it; a finding matching a decision goes under *Decided*; every finding quotes its text; never edit anything.`;
}

// The CV with its line numbers, so findings can cite file:line. Comments are dropped, except entry markers and,
// when `keepSrc`, the src comments. Lines left empty are skipped.
export function numberedCv(text: string, keepSrc: boolean): string {
  const out: string[] = [];
  text.split("\n").forEach((line, i) => {
    let l = line.replace(/<!--[\s\S]*?-->/g, (c) => (/^<!-- entry: /.test(c) || (keepSrc && /^<!--\s*(src|project):/.test(c)) ? c : ""));
    // A comment removed mid-line leaves two spaces ("sentence.  Next"): reviewers would flag them as typos.
    l = l.replace(/(\S) {2,}(?=\S)/g, "$1 ").replace(/\s+$/, "");
    if (l.trim()) out.push(`${String(i + 1).padStart(4)}| ${l}`);
  });
  return out.join("\n");
}

// Ids cited by the CV: entries (entry markers) and every src id.
function citedIds(text: string): { entries: Set<string>; src: Set<string> } {
  const entries = new Set([...text.matchAll(/<!-- (?:entry|project): ([\w-]+) -->/g)].map((m) => m[1]));
  const src = new Set<string>();
  for (const m of text.matchAll(/<!--\s*src:\s*([^>]*?)\s*-->/g)) for (const id of m[1].split(",")) if (id.trim()) src.add(id.trim());
  for (const id of src) { const s = id.match(/^([\w-]+)#/); if (s) entries.add(s[1]); }
  return { entries, src };
}

// Decisions that fit this rubric and CV: ids the rubric names, keywords found in the CV, or decision text on the
// rubric's topic. Portfolio decisions count only in --portfolio mode (unless the rubric's CV part names them).
export function selectDecisions(rubric: Rubric, cvText: string, rubricBody: string, portfolio: boolean) {
  const all: Decision[] = loadDecisions()?.decisions ?? [];
  const visible = markdownVisibleText(cvText);
  const keep: { d: Decision; why: string }[] = [];
  const rest: string[] = [];
  for (const d of all) {
    const named = new RegExp(`\`${esc(d.id)}\``).test(rubricBody);
    const portfolioOnly = d.id.startsWith("portfolio-");
    // Layout judges page images, not wording: a keyword in the text doesn't make a decision relevant there.
    const keyword = rubric === "layout" ? undefined : (d.matches ?? []).find((k) => has(visible, k));
    const topic = d.decision.match(TOPICS[rubric])?.[0];
    // An earlier review of this rubric raised it ("hr-1", "ATS review", "confidentiality-2" in `why`).
    const raised = new RegExp(`\\b${esc(rubric)}\\b`, "i").test(`${d.why ?? ""} ${d.decision}`);
    let why = "";
    if (named) why = "named by the rubric";
    else if (portfolioOnly && !portfolio) why = "";
    else if (portfolio && portfolioOnly) why = "portfolio decision";
    else if (keyword) why = `"${keyword}" is in the ${portfolio ? "portfolio" : "CV"}`;
    else if (raised) why = `from an earlier ${rubric} review`;
    else if (topic) why = `about "${topic.toLowerCase()}"`;
    if (why) keep.push({ d, why }); else rest.push(d.id);
  }
  return { keep, rest, total: all.length };
}

function decisionsSection(rubric: Rubric, cvText: string, rubricBody: string, portfolio: boolean): string {
  const { keep, rest, total } = selectDecisions(rubric, cvText, rubricBody, portfolio);
  const lines = keep.map(({ d, why }) => `- **${d.id}** (${d.date ?? "no date"}; ${why}): ${d.decision}${d.matches?.length ? ` *Matches:* ${d.matches.join("; ")}` : ""}`);
  return [
    `${keep.length} of ${total} decisions in \`facts/decisions.yaml\` fit this rubric and file. A finding that matches one (its keywords or meaning) goes under *Decided*, not *Findings*.`,
    "",
    ...lines,
    "",
    rest.length ? `Not relevant here: ${rest.join(", ")} (open \`facts/decisions.yaml\` if a finding touches one).` : "Every decision is listed above.",
  ].join("\n");
}

// Titles of the open items (docs/open-items.md): known gaps the user will answer later, not findings.
function openItems(): string {
  const file = rootPath("docs", "open-items.md");
  if (!existsSync(file)) return "`docs/open-items.md` not found.";
  const groups: string[] = [];
  let heading = "", items: string[] = [];
  const flush = () => { if (items.length) groups.push(`- ${heading}: ${items.join("; ")}`); items = []; };
  for (const line of read(file).split("\n")) {
    const h = line.match(/^## (.+)$/);
    if (h) { flush(); heading = h[1].replace(/\s*\(.*$/, ""); continue; }
    const row = line.match(/^\|\s*([^|]+?)\s*\|/);
    if (!row || /^-+$/.test(row[1]) || /^(Item|Topic)$/.test(row[1])) continue;
    items.push(row[1]);
  }
  flush();
  return `Known and open (\`docs/open-items.md\`): don't raise these as new findings; mention them only as already open.\n\n${groups.join("\n")}`;
}

// The CV folder's build checks and page images (a variant's market version keeps its own folder).
function buildFiles(dir: string, suffix = ""): string {
  const check = join(dir, `pdf-check${suffix}.md`);
  const previewDir = join(dir, "preview", suffix.replace(/^-/, ""));
  const pages = existsSync(previewDir)
    ? readdirSync(previewDir).filter((f) => /^page-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5))).map((f) => rel(join(previewDir, f)))
    : [];
  return [
    `### \`${rel(check)}\``,
    existsSync(check) ? read(check).replace(/^# .*\n+/, "").replace(/^## /gm, "#### ").trim() : "Not found: the CV is not built (say so in the report; skip *layout*).",
    "",
    `Preview pages: ${pages.length ? pages.map((p) => `\`${p}\``).join(", ") : "none (not built)"}`,
  ].join("\n");
}

// The market of the file reviewed: --market, else the folder (…/markets/<id>/…), else the default market.
function marketFor(file: string, wanted: string | undefined): Market {
  const markets = loadMarkets().map((m) => m.market);
  const fromPath = file.match(/\/markets\/([\w-]+)\/[^/]+$/)?.[1];
  const id = wanted ?? fromPath;
  const m = id ? markets.find((x) => x.id === id) : markets.find((x) => x.default);
  if (!m) throw new Error(`unknown market "${id}"`);
  return m;
}

export const yamlBlock = (v: unknown) => "```yaml\n" + stringify(v, { lineWidth: 0 }).trim() + "\n```";

// A digest cut to what fact-check compares: the entry line fields, the contributions the CV cites (title and
// result), and the metrics. Cited confirmed facts are listed once, in their own section.
const DIGEST_FIELDS = ["client", "role", "engagement", "period", "team_size_led", "counts_as_experience", "cv_client_label", "cv_location", "cv_title_suffix", "show_dates_in_cv", "cv_emphasis"];
function trimDigest(d: any, src: Set<string>) {
  const fm = d?.front_matter ?? {};
  const contributions = (d?.contributions ?? []).filter((c: any) => src.has(c.id)).map((c: any) => ({ id: c.id, title: c.title, ...(c.removed ? { removed: true } : {}), ...(c.result ? { result: c.result } : {}) }));
  const sections = [...src].filter((x) => x.startsWith(`${d?.id}#`) && !x.includes(".")).sort();
  return {
    front_matter: Object.fromEntries(DIGEST_FIELDS.filter((k) => fm[k] !== undefined).map((k) => [k, fm[k]])),
    contributions_cited: contributions,
    ...(sections.length ? { sections_cited: sections } : {}),
    metrics: d?.metrics ?? [],
  };
}
const fileYaml = (p: string) => "```yaml\n" + read(p).replace(/^#.*\n/gm, "").trim() + "\n```";

// The CV's own folder for a variant or tailored CV (a market version lives in <folder>/markets/<id>/).
function cvFolder(file: string): string {
  const d = dirname(file);
  return basename(dirname(d)) === loadConfig().output.markets_subdir ? dirname(dirname(d)) : d;
}

export function reviewContext(opts: Options): { file: string; text: string } {
  const cfg = loadConfig();
  if (!(RUBRICS as readonly string[]).includes(opts.rubric)) throw new UsageError(`unknown rubric "${opts.rubric}" (one of: ${RUBRICS.join(", ")})`);
  const rubric = opts.rubric as Rubric;
  const portfolio = !!opts.portfolio;
  if (portfolio && !PORTFOLIO_RUBRICS.includes(rubric)) throw new UsageError(`rubric "${rubric}" doesn't apply to the portfolio (one of: ${PORTFOLIO_RUBRICS.join(", ")})`);

  let file = portfolio ? rootPath(cfg.paths.portfolio, "portfolio.md") : opts.cv ? cliPath(opts.cv) : masterCvPath();
  const market = portfolio ? undefined : marketFor(file, opts.market);
  // `--market ukraine` on a default-market CV reviews that market's version (cv/markets/<id>/…).
  if (market && !market.default && !/\/markets\/[\w-]+\/[^/]+$/.test(file)) file = marketCvPath(file, market);
  if (!existsSync(file)) throw new UsageError(`file not found: ${rel(file)}`);
  const cvText = read(file);
  const rubricBody = rubricText(rubric, portfolio);
  const cited = citedIds(cvText);
  const summaries = loadSummaries(cfg);
  const confirmed = loadConfirmed(cfg);
  const profile = loadProfile(cfg);
  const profileId = portfolio ? undefined : profileIdForFile(file, cfg);
  const folder = cvFolder(file);
  const tailored = !portfolio && folder.startsWith(rootPath(cfg.output.tailored_dir) + "/");
  const master = !portfolio && isMasterFile(file, cfg);
  const words = (markdownVisibleText(cvText).match(/[\p{L}\p{N}][\p{L}\p{N}.+#/'-]*/gu) ?? []).length;

  const out: string[] = [];
  const section = (title: string, ...body: string[]) => out.push(`## ${title}`, "", ...body, "");
  // In a run over several CVs each report is <rubric>-<cv>.md (review-report-spec): master, the profile id or the job folder.
  const cvSlug = portfolio ? "portfolio" : master ? "master" : tailored ? basename(folder) : profileId ?? basename(folder);

  out.push(
    `# Review context: ${rubric} · \`${rel(file)}\``,
    "",
    `Generated by \`npm run review-context\` from the files on disk; read this instead of the individual files and open a full file only where this bundle points to it. Write the report to \`reports/<run>/${rubric}.md\` (\`reports/<run>/${rubric}-${cvSlug}.md\` when the run reviews several CVs). Never edit anything.`,
    "",
    `- File: \`${rel(file)}\` (${portfolio ? "the public portfolio" : master ? "master CV" : tailored ? "job-specific CV (job-ad mode)" : profileId ? `role variant \`${profileId}\`` : "CV"})`,
    `- Market: ${market ? `\`${market.id}\`` : "null (portfolio)"} · About ${words} visible words`,
    "",
  );

  section("Rules for every agent (`AGENTS.md`)", agentRules());
  section(`Rubric (\`specs/rubrics/${rubric}.md\`)`, rubricBody.replace(/^# /, "### ").replace(/^## /gm, "#### "));
  section("Report format (`specs/review-report-spec.md`)", reportFormat());

  const keepSrc = rubric === "fact-check" || (portfolio && rubric === "confidentiality");
  if (rubric === "layout") {
    // Layout judges the page images; the headings are enough to name a position ("page 2, Velas").
    section(`Headings of \`${rel(file)}\` (to name positions; the page images are what is reviewed)`,
      numberedCv(cvText, false).split("\n").filter((l) => /^\s*\d+\| #/.test(l)).join("\n"));
  } else {
    section(`${portfolio ? "Portfolio" : "CV"} (\`${rel(file)}\`, with line numbers${keepSrc ? " and source comments" : "; comments removed except entry markers"})`, numberedCv(cvText, keepSrc));
  }

  // ---------- market, personal profile, role profile ----------
  if (market && (rubric === "ats" || rubric === "hr")) {
    section(`Market settings (\`${cfg.paths.markets}/${market.id}.yaml\`)`, "A field the market hides is intended, not a finding.", "", yamlBlock({ header: market.header, entries: market.entries }));
    const { name, legal_name, show_legal_name, headline_default, contacts, location, work } = profile;
    section(`Personal profile (\`${cfg.paths.facts}/profile.yaml\`, education and languages left out: they are generated into the CV)`, yamlBlock({ name, legal_name, show_legal_name, headline_default, contacts, location, work }));
  }
  if (profileId && rubric !== "confidentiality") {
    const rp = readYaml(rootPath(cfg.paths.profiles, `${profileId}.yaml`)) ?? {};
    const pick = (keys: string[]) => Object.fromEntries(keys.filter((k) => rp[k] !== undefined).map((k) => [k, rp[k]]));
    section(`Role profile limits (\`${cfg.paths.profiles}/${profileId}.yaml\`)`,
      "Length and page count are judged against these (decision `keep-length` covers the master CV only); shorter older roles are by design.", "",
      yamlBlock(pick(["headline", "max_words", "max_pages", "include_sections", "max_bullets_per_entry", "min_bullets_per_entry", "entry_max_bullets"])));
  }
  if (master && (rubric === "ats" || rubric === "hr")) section("Length", `Master CV: decision \`keep-length\` applies (up to ${cfg.checks?.max_words} words, \`checks.max_words\`; 3 to 4 pages is intended).`);

  // ---------- job ad, gap report ----------
  if (!portfolio && (profileId || tailored) && ["ats", "hr", "fact-check"].includes(rubric)) {
    const gap = join(folder, "gap-report.md");
    section(`Gap report (\`${rel(gap)}\`)`, "Gaps listed here are known: don't raise them again as new findings.", "",
      existsSync(gap) ? read(gap).replace(/^# .*\n+/, "").replace(/^## /gm, "### ").trim() : "Not found.");
  }
  if (!portfolio && (rubric === "ats" || rubric === "hr")) {
    const jdFile = opts.jd ? cliPath(opts.jd) : tailored ? join(folder, "job-description.md") : undefined;
    if (jdFile) {
      const tags = join(dirname(jdFile), "jd-tags.yaml");
      section("Job ad (job-ad mode)", `### \`${rel(jdFile)}\``, existsSync(jdFile) ? read(jdFile).trim() : "Not found.", "",
        `### \`${rel(tags)}\``, existsSync(tags) ? fileYaml(tags) : "Not found.");
    }
  }

  // ---------- build checks ----------
  if (portfolio && (rubric === "layout" || rubric === "proofreading")) {
    const dir = rootPath(cfg.paths.portfolio);
    const sizes = existsSync(join(dir, "preview")) ? readdirSync(join(dir, "preview")).sort() : [];
    section("Build checks and previews", ...(sizes.length ? sizes.map((s) => buildFiles(dir, `-${s}`) + "\n") : ["Not built: suggest `npm run build:portfolio`; skip *layout* and say so."]));
  } else if (!portfolio && ["ats", "hr", "layout"].includes(rubric)) {
    section("Build checks and previews", buildFiles(dirname(file)), rubric === "ats" || rubric === "hr" ? "\nRun `npm run status` first: if the CV is stale, review the Markdown and say so." : "");
  }
  if (rubric === "layout") {
    const tpl = portfolio ? "portfolio-classic" : cfg.default_template;
    const tdir = rootPath(cfg.paths.templates, tpl);
    const sm = join(tdir, "style-map.yaml");
    section(`Template \`${tpl}\``,
      `Reference preview: \`${rel(join(tdir, "reference-preview.png"))}\`${existsSync(join(tdir, "reference-preview.png")) ? "" : " (not found)"} · Fixes: \`${rel(join(tdir, "fixes.yaml"))}\`${portfolio ? " · generator: `scripts/portfolio-template.ts`" : ""}`, "",
      `### \`${rel(sm)}\``, existsSync(sm) ? fileYaml(sm) : "Not found.");
  }

  // ---------- proofreading: style rules ----------
  if (rubric === "proofreading") {
    const spec = read(rootPath("specs", "cv-spec.md"));
    const part = (n: number) => spec.match(new RegExp(`^## ${n}\\. [\\s\\S]*?(?=^## )`, "m"))?.[0].replace(/^## /, "### ").trim() ?? "";
    section("Style rules (`specs/cv-spec.md` sections 3 and 4)", part(3), "", part(4), "",
      `Spelling: \`${cfg.spelling}\` · Filler words (\`checks.filler_words\`): ${(cfg.checks?.filler_words ?? []).join(", ")}`,
      ...(portfolio ? ["", "Portfolio section labels and structure: `specs/outputs/portfolio.md` section 4."] : []));
  }

  // ---------- fact-check: digests and cited facts ----------
  if (rubric === "fact-check") {
    const digests: string[] = [];
    for (const id of [...cited.entries].sort()) {
      const p = rootPath(cfg.paths.digests, `${id}.yaml`);
      if (existsSync(p)) digests.push(`### \`${rel(p)}\``, yamlBlock(trimDigest(readYaml(p), cited.src)), "");
    }
    const facts = confirmed.raw?.facts?.filter((f: any) => cited.src.has(f.id)) ?? [];
    const docs = [...cited.src].filter((s) => s.startsWith("doc:"));
    const ctxCalc = calculate(loadEntries(cfg, summaries, confirmed), confirmed.facts, new Date());
    section("Sources (fact-check)",
      "Digests hold titles, results, tags and metrics only. To compare a bullet's **meaning** with its source, open the summary contribution it cites (`### 4.N` in the summary file) or the cited section (`## N.`).", "",
      `Full summaries: ${summaries.filter((s) => cited.entries.has(s.id)).map((s) => `\`${s.file}\``).join(", ") || "none cited"}`,
      ...(docs.length ? [`Imported documents cited: ${docs.join(", ")} (\`${cfg.paths.sources}/\`; a number from one must say "confirmed by user")`] : []), "",
      `### Calculated values (\`specs/cv-spec.md\` 7)`, yamlBlock(ctxCalc), "",
      `### Confirmed facts cited (\`${cfg.paths.facts}/confirmed.yaml\`)`, facts.length ? yamlBlock(facts) : "None.", "",
      "### Summary digests", "", ...digests);
    if (!portfolio) section("Personal profile (`facts/profile.yaml`)", yamlBlock({ name: profile.name, headline_default: profile.headline_default, education: profile.education, languages: profile.languages }));
  }

  // ---------- confidentiality: section 9 and hidden clients ----------
  if (rubric === "confidentiality") {
    const inScope = summaries.filter((s) => (portfolio ? s.frontMatter.show_in_portfolio === true : cited.entries.has(s.id)));
    const rows = inScope.map((s) => {
      const fm = s.frontMatter;
      const label = portfolio ? fm.portfolio_label ?? fm.cv_client_label : fm.cv_client_label;
      const hidden = fm.client && label !== fm.client ? ` · **hidden client** "${fm.client}" shown as "${label}"` : ` · client "${fm.client}" named`;
      const terms = s.confidentiality.map((r) => r.term ? `term "${r.term}"${r.allow_in ? ` (allowed in ${r.allow_in.join(", ")})` : ""}` : r.prefix ? `prefix "${r.prefix}"` : `url "${r.url_pattern}"`);
      const images = portfolio ? s.portfolio.filter((i) => i.kind === "image").map((i) => `${i.value}: ${i.public ?? "no public line"}`) : [];
      return [`### ${s.id} (\`${s.file}\`)${hidden}`,
        `Section 9: ${terms.length ? terms.join("; ") : s.confidentialityNone ? "None known" : "empty"}`,
        ...(images.length ? [`Images: ${images.join("; ")}`] : []), ""].join("\n");
    });
    const factEntries = confirmed.entries.filter((e) => cited.entries.has(e.id) || cited.src.has(e.id))
      .map((e) => `- ${e.id}: client "${e.client}", label "${e.cv_client_label}"${e.client !== e.cv_client_label ? " (hidden)" : ""}`);
    const links = (profile.contacts?.links ?? []).map((l: any) => `${l.label}: ${l.url}${l.show ? "" : " (not shown)"}`);
    section(`Confidentiality notes (section 9) of the ${portfolio ? "opted-in summaries" : "summaries in this CV"}`,
      "Lint already blocks these terms; look for what a blocklist can't see (inference).", "", ...rows,
      ...(factEntries.length ? ["### Entries from confirmed facts", ...factEntries, ""] : []),
      `Profile's own links (others are findings): ${links.join("; ")}`);
  }

  if (!portfolio && (rubric === "ats" || rubric === "hr")) section("Open items", openItems());
  section("Decisions (`facts/decisions.yaml`)", decisionsSection(rubric, cvText, rubricBody, portfolio));

  const slug = rel(file).replace(/\.md$/, "").replace(/^cv\//, "").replace(/[^\w]+/g, "-").toLowerCase();
  const outFile = rootPath(cfg.paths.runs, "review-context", `${slug}-${rubric}.md`);
  const text = out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, text);
  return { file: outFile, text };
}

export class UsageError extends Error {}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const portfolio = !!args.portfolio;
  // "--portfolio <rubric>": the flag takes no value, so the word after it is the rubric.
  if (typeof args.portfolio === "string") positional.push(args.portfolio);
  const [cv, rubric] = portfolio && positional.length === 1 ? [undefined, positional[0]] : positional;
  if (!rubric) {
    console.error("usage: npm run review-context -- <cv.md> <rubric> [--market <id>] [--jd <file>] | -- --portfolio <rubric>");
    process.exit(2);
  }
  try {
    const { file, text } = reviewContext({ cv, rubric, market: args.market as string | undefined, jd: args.jd as string | undefined, portfolio });
    const bytes = Buffer.byteLength(text);
    console.log(`review-context: ${rel(file)} (${(bytes / 1024).toFixed(1)} KB, about ${Math.round(bytes / 4)} tokens)`);
  } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    console.error(`review-context: ${e.message}`);
    process.exit(2);
  }
}
