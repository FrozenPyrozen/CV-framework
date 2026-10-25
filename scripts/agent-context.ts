// npm run agent-context -- composer [--entry <id>[,<id>…]] [--all]
// npm run agent-context -- tailor <cv-dir | cv.md | profile-id> [--entry <id>[,<id>…]] [--all]
// npm run agent-context -- cover-letter <cv/tailored/<company-role>>
// npm run agent-context -- portfolio [--entry <page-id>[,…]] [--all]
// npm run agent-context -- advisor [<reports/<run>>[,<reports/<run>>…]]
// Writes one Markdown bundle for a writing agent to .cv-runs/agent-context/<agent>-<target>.md, like review-context
// does for reviewers: the rules for every agent, the spec sections the agent's *Read first* list names (parsed from
// agents/<agent>.md, so the bundle follows that list), and only the entries that need work, each with its CV lines,
// summary text, cited facts and open items, plus the decisions that fit. Entries in scope: --entry, else the ones the
// agent's own steps would pick (status, entries missing from the CV, a changed selection); --all takes every entry.
// Deterministic: no AI calls.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { calculate, parseCv, profileIdForFile, tailoredSettings } from "./lib/cvmd.ts";
import { masterCvPath } from "./lib/paths.ts";
import {
  type Summary, cliPath, isMain, loadConfig, loadConfirmed, loadDecisions, loadEntries, loadSummaries, readYaml, rootPath, unconfirmedFields,
} from "./lib/repo.ts";
import { loadSources } from "./lib/sources.ts";
import { markdownVisibleText } from "./lib/text.ts";
import { parseArgs } from "./refresh.ts";
import { agentRules, esc, has, numberedCv, UsageError, yamlBlock } from "./review-context.ts";
import { cvStatuses } from "./status.ts";
import { buildBlocklist } from "./lint.ts";
import { loadContext } from "./lib/cvmd.ts";
import { pageItems, parsePortfolio, portfolioPages, portfolioPath, portfolioStatus } from "./portfolio.ts";

export const AGENTS = ["composer", "tailor", "cover-letter", "portfolio", "advisor"] as const;
export type Agent = (typeof AGENTS)[number];
interface Options { agent: string; target?: string; entries?: string[]; all?: boolean }
interface Decision { id: string; decision: string; date?: string; why?: string; matches?: string[] }

const rel = (p: string) => relative(rootPath(), p);
const read = (p: string) => readFileSync(p, "utf8");

// ---------- spec sections from the agent's Read first list ----------

// One section of a spec: "Rules at a glance", a top-level "3" (## 3. …) or a subsection "1.1" (### 1.1 …), up to the
// next heading of the same or a higher level outside fenced code (a gap-report template's "## …" lines don't end it).
export function specSection(text: string, id: string): string | undefined {
  const lines = text.split("\n");
  const top = /^\d+$/.test(id);
  // The start heading outside fenced code: an example "## 8. Portfolio material" inside a code block isn't section 8.
  let inFence = false, start = -1;
  for (let i = 0; i < lines.length && start < 0; i++) {
    if (/^(```|~~~)/.test(lines[i].trim())) { inFence = !inFence; continue; }
    const l = lines[i];
    if (!inFence && (id === "Rules at a glance" ? l === "## Rules at a glance" : top ? l.startsWith(`## ${id}. `) : l.startsWith(`### ${id} `))) start = i;
  }
  if (start < 0) return undefined;
  const level = top || id === "Rules at a glance" ? 2 : 3;
  let fence = false, end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^(```|~~~)/.test(lines[i].trim())) fence = !fence;
    const h = !fence && lines[i].match(/^(#{1,6}) /);
    if (h && h[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join("\n").trim();
}

// The spec sections a *Read first* list names: "- `specs/cv-spec.md` 3–7 (…) and 9–11 (…), after its *Rules at a
// glance*" gives Rules at a glance, 3 to 7 and 9 to 11. Parenthesized notes are dropped before reading the numbers.
export function readFirstSections(agent: string): { file: string; ids: string[] }[] {
  const def = read(rootPath("agents", `${agent}.md`));
  // The list: the "- " lines (and their indented continuations) right after the heading.
  const list = def.match(/^## Read first\n((?:[-\s].*\n)*)/m)?.[1] ?? "";
  const out: { file: string; ids: string[] }[] = [];
  for (const line of list.split("\n")) {
    // "- *Rules at a glance* of `specs/a.md` and of `specs/b.md`": the Rules at a glance of each.
    if (/^- \*Rules at a glance\* of /.test(line)) {
      for (const f of line.matchAll(/`(specs\/[\w/.-]+\.md)`/g)) out.push({ file: f[1], ids: ["Rules at a glance"] });
      continue;
    }
    const m = line.match(/^- `(specs\/[\w/.-]+\.md)`(.*)$/);
    if (!m) continue;
    const rest = m[2].replace(/\([^)]*\)/g, "");
    const ids: string[] = /Rules at a glance/.test(rest) ? ["Rules at a glance"] : [];
    for (const r of rest.matchAll(/(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+))?/g)) {
      if (r[2]) for (let n = Number(r[1]); n <= Number(r[2]); n++) ids.push(String(n));
      else ids.push(r[1]);
    }
    out.push({ file: m[1], ids });
  }
  return out;
}

// Headings one level down, outside fenced code (a template's "## Strong evidence" stays as the spec writes it).
function demote(text: string): string {
  let fence = false;
  return text.split("\n").map((l) => {
    if (/^(```|~~~)/.test(l.trim())) fence = !fence;
    return !fence && /^#{2,5} /.test(l) ? "#" + l : l;
  }).join("\n");
}

function specText(agent: Agent): string {
  return readFirstSections(agent).map(({ file, ids }) => {
    const text = read(rootPath(file));
    const parts = ids.map((id) => { const t = specSection(text, id); return t ? demote(t) : `(section ${id} not found: open \`${file}\`)`; });
    return [`### \`${file}\` (${ids.join(", ")})`, "", ...parts.flatMap((p) => [p, ""])].join("\n");
  }).join("\n");
}

// ---------- entries ----------

// Lines of one CV entry (1-based, inclusive): from its entry marker to its last bullet or detail line.
function entryRanges(cvText: string): Map<string, { from: number; to: number }> {
  const out = new Map<string, { from: number; to: number }>();
  for (const s of parseCv(cvText).sections) for (const e of s.entries) {
    if (!e.id) continue;
    const last = Math.max(e.titleLine + 1, ...e.bullets.map((b) => b.line));
    out.set(e.id, { from: e.titleLine, to: last + 1 });
  }
  return out;
}

const numberedLines = (cvText: string, r: { from: number; to: number }) =>
  numberedCv(cvText, true).split("\n").filter((l) => { const n = Number(l.split("|")[0]); return n >= r.from && n <= r.to; }).join("\n");

// The summary paragraph (lines between the SUMMARY heading and the next section), numbered with its src comments.
function summaryParagraph(cvText: string): string {
  const s = parseCv(cvText).sections.find((x) => /^SUMMARY$/i.test(x.heading));
  if (!s) return "No SUMMARY section.";
  const next = parseCv(cvText).sections.find((x) => x.line > s.line)?.line ?? s.line + 1;
  return numberedLines(cvText, { from: s.line + 1, to: next });
}

// Entries the status lists for this CV ("entries to update", "entries to rewrite in …").
function statusEntries(file: string): string[] {
  const st = cvStatuses().find((s) => s.cv === rel(file));
  const reason = st?.reasons.find((r) => /^entries to (update|rewrite)/.test(r));
  return reason ? reason.replace(/^[^:]+:\s*/, "").split(",").map((x) => x.trim()).filter(Boolean) : [];
}

// Rows of docs/open-items.md that name the entry (its "Where it goes" column, usually).
function openItemsFor(id: string): string[] {
  const file = rootPath("docs", "open-items.md");
  if (!existsSync(file)) return [];
  return read(file).split("\n").filter((l) => l.startsWith("|") && has(l, id)).map((l) => {
    const cells = l.split("|").slice(1, -1).map((c) => c.trim());
    return `- ${cells[0]}: ${cells[1]}`;
  });
}

// A summary section's text, its headings moved below the bundle's "### 5. …" heading.
const summarySection = (s: Summary, n: number) =>
  s.sections.find((x) => x.number === n)?.text.trim().replace(/^(#{1,4}) /gm, "####$1 ").replace(/^#{5,} /gm, "##### ") || "(empty)";

// ---------- decisions ----------

// Words in a decision's text that make it relevant to writing CV text even when no entry or keyword matches it.
const WRITING = /\b(wording|bullets?|stack line|describe[ds]?|claims?|summary|full-time|contract|first|order|variants?|numbers?|figures?|metrics?|acronyms?|skills list)\b/i;

// Decisions that fit the entries in scope: named entry ids, clients or labels; keywords found in the entries' text;
// or a decision on how CV text is written. Portfolio decisions never count; the rest are listed by id.
export function writingDecisions(ids: string[], names: string[], text: string) {
  const all: Decision[] = loadDecisions()?.decisions ?? [];
  const keep: { d: Decision; why: string }[] = [];
  const rest: string[] = [];
  const visible = markdownVisibleText(text);
  for (const d of all) {
    const body = `${d.decision} ${d.why ?? ""} ${(d.matches ?? []).join(" ")}`;
    let why = "";
    if (d.id.startsWith("portfolio-") || (/\bportfolio\b/i.test(d.decision) && !/\bCV\b/.test(d.decision))) why = "";
    else if (ids.find((i) => body.includes(i) || d.id.startsWith(i.split("-")[0] + "-"))) why = "names an entry in scope";
    else if (names.find((n) => has(d.decision, n))) why = `names "${names.find((n) => has(d.decision, n))}"`;
    else if ((d.matches ?? []).find((k) => has(visible, k))) why = `"${(d.matches ?? []).find((k) => has(visible, k))}" is in the text`;
    else if (WRITING.test(d.decision)) why = `about "${d.decision.match(WRITING)![0].toLowerCase()}"`;
    if (why) keep.push({ d, why }); else rest.push(d.id);
  }
  return { keep, rest, total: all.length };
}

function decisionsSection(ids: string[], names: string[], text: string): string {
  const { keep, rest, total } = writingDecisions(ids, names, text);
  return [
    `${keep.length} of ${total} decisions in \`facts/decisions.yaml\` fit this work; follow them.`, "",
    ...keep.map(({ d, why }) => `- **${d.id}** (${why}): ${d.decision}`), "",
    rest.length ? `Not relevant here: ${rest.join(", ")} (open \`facts/decisions.yaml\` if your change touches one).` : "Every decision is listed above.",
  ].join("\n");
}

// ---------- the bundle ----------

export function agentContext(opts: Options): { file: string; text: string; scope: string[] } {
  if (!(AGENTS as readonly string[]).includes(opts.agent)) throw new UsageError(`unknown agent "${opts.agent}" (one of: ${AGENTS.join(", ")})`);
  if (opts.agent === "cover-letter") return coverLetterContext(opts);
  if (opts.agent === "portfolio") return portfolioContext(opts);
  if (opts.agent === "advisor") return advisorContext(opts);
  const agent = opts.agent as Agent;
  const cfg = loadConfig();
  const summaries = loadSummaries(cfg);
  const confirmed = loadConfirmed(cfg);
  const entries = loadEntries(cfg, summaries, confirmed);
  const master = masterCvPath();
  const masterText = read(master);

  // The CV the agent edits, and for the tailor its folder, role profile and selection.
  let file = master, folder = "", profileId: string | undefined, selection: any;
  if (agent === "tailor") {
    if (!opts.target) throw new UsageError("tailor needs a CV folder, cv.md or role profile id");
    const t = opts.target;
    folder = existsSync(rootPath(cfg.paths.profiles, `${t}.yaml`)) && !existsSync(cliPath(t)) ? rootPath(cfg.output.variants_dir, t) : cliPath(t).replace(/\/cv\.md$/, "");
    file = join(folder, "cv.md");
    profileId = profileIdForFile(file, cfg) ?? tailoredSettings(file, cfg).profile;
    const sel = join(folder, "selection.json");
    if (!existsSync(sel)) throw new UsageError(`${rel(sel)} not found: run npm run select first (agents/tailor.md step 3)`);
    selection = JSON.parse(read(sel));
    profileId ??= selection.profile;
  }
  const exists = existsSync(file);
  const cvText = exists ? read(file) : "";
  const ranges = entryRanges(cvText);
  const masterRanges = entryRanges(masterText);

  // ---------- scope ----------
  // The tailor's entries in selection order; the composer's in CV order, entries not in the CV yet last.
  const at = (id: string) => masterRanges.get(id)?.from ?? Infinity;
  const known = agent === "tailor" ? (selection.entries as any[]).map((e) => e.id) : entries.map((e) => e.id).sort((a, b) => at(a) - at(b));
  const reasons = new Map<string, string[]>();
  const add = (id: string, why: string) => reasons.set(id, [...(reasons.get(id) ?? []), why]);
  if (opts.entries?.length) {
    for (const id of opts.entries) {
      if (!known.includes(id)) throw new UsageError(`unknown entry "${id}" (${agent === "tailor" ? "not in selection.json" : "no summary or cv_entry fact"})`);
      add(id, "--entry");
    }
  } else if (opts.all || !exists) {
    for (const id of known) add(id, opts.all ? "--all" : "new CV");
  } else {
    for (const id of statusEntries(file)) if (known.includes(id)) add(id, "status: sources changed");
    for (const id of known) if (!ranges.has(id)) add(id, "not in the CV yet");
    // Compared by the entry's contributions (<id>#4.N) and its Stack line (<id>#5 on a "Stack:" bullet only): a bullet
    // may keep facts and summary sections merged from the master wording, and a contribution of the same entry that the
    // master bullet of a selected one merges (tailoring-spec 3, "Master bullets with several sources").
    const masterEntries = parseCv(masterText).sections.flatMap((s) => s.entries);
    if (agent === "tailor") for (const e of selection.entries as any[]) {
      const contrib = (s: string) => s.startsWith(`${e.id}#4.`);
      const ids = (bs: { text: string; src: string[] }[]) => bs.flatMap((b) => b.src.filter((s) => contrib(s) || (s === `${e.id}#5` && /^Stack:/.test(b.text))));
      const want = new Set<string>(e.bullets.flatMap((b: any) => b.src.split(",").map((x: string) => x.trim())).filter(contrib));
      if (e.stack) want.add(e.stack);
      const r = ranges.get(e.id);
      if (!r) continue;
      const have = new Set(ids(parseCv(cvText).sections.flatMap((s) => s.entries).find((x) => x.id === e.id)!.bullets));
      const merged = new Set(ids((masterEntries.find((x) => x.id === e.id)?.bullets ?? []).filter((b) => b.src.some((s) => want.has(s)))));
      if ([...want].some((s) => !have.has(s)) || [...have].some((s) => !want.has(s) && !merged.has(s))) add(e.id, "selection changed");
    }
  }
  const scope = known.filter((id) => reasons.has(id));

  // ---------- header ----------
  const out: string[] = [];
  const section = (title: string, ...body: string[]) => out.push(`## ${title}`, "", ...body, "");
  out.push(
    `# Agent context: ${agent} · \`${rel(file)}\``, "",
    `Generated by \`npm run agent-context\` from the files on disk; read this instead of the files it replaces (the *Read first* sections, digests, facts, decisions) and open a full file only where it points. To edit, read only the line ranges given for the entries below (\`Read\` with offset and limit). Never commit.`, "",
    `- File: \`${rel(file)}\`${exists ? "" : " (doesn't exist yet: start from a copy of the master CV)"}${profileId ? ` · Role profile: \`${profileId}\`` : ""}`,
    `- Entries in scope: ${scope.length ? scope.map((id) => `${id} (${reasons.get(id)!.join("; ")})`).join(", ") : "none: nothing changed since the last build. Pass `--entry <id>` for a requested change"}`,
    `- Unchanged (copy as they are): ${known.filter((id) => !reasons.has(id)).map((id) => ranges.get(id) ? `${id} (lines ${ranges.get(id)!.from}–${ranges.get(id)!.to})` : id).join(", ") || "none"}`,
    "",
  );
  section("Rules for every agent (`AGENTS.md`)", agentRules());
  section(`Spec sections (\`agents/${agent}.md\` *Read first*)`, specText(agent));

  // ---------- role profile, job ad, selection (tailor) ----------
  if (agent === "tailor") {
    const pf = rootPath(cfg.paths.profiles, `${profileId}.yaml`);
    section(`Role profile (\`${rel(pf)}\`)`, existsSync(pf) ? "```yaml\n" + read(pf).trim() + "\n```" : "Not found.");
    for (const f of ["jd-tags.yaml", "job-description.md"]) {
      const p = join(folder, f);
      if (existsSync(p)) section(`\`${rel(p)}\``, f.endsWith(".yaml") ? "```yaml\n" + read(p).trim() + "\n```" : read(p).trim());
    }
    section("Selection (`selection.json`, don't change it)", (selection.entries as any[]).map((e) =>
      `- **${e.id}**${e.stack ? ` (Stack line: ${e.stack})` : ""}: ${e.bullets.map((b: any) => `${b.src}${b.pinned ? " (pinned)" : ""}${b.text ? " (override text)" : ""}`).join(", ") || "no bullets"}`).join("\n"),
      "", `Skills order: ${(selection.skills_order ?? []).join(", ")} (\`refresh\` writes the skills)`);
  }

  // ---------- summary paragraph ----------
  const calc = calculate(entries, confirmed.facts, new Date());
  section("Summary paragraph",
    exists ? summaryParagraph(cvText) : summaryParagraph(masterText) + `\n\n(from the master CV: \`${rel(master)}\`)`, "",
    `Calculated values (\`calc:\` sources, \`specs/cv-spec.md\` 7):`, yamlBlock(calc));

  // ---------- entries in scope ----------
  const factsById = new Map((confirmed.raw?.facts ?? []).map((f: any) => [f.id, f]));
  const names: string[] = [];
  let entryText = "";
  for (const id of scope) {
    const s = summaries.find((x) => x.id === id);
    const e = entries.find((x) => x.id === id);
    const sel = agent === "tailor" ? (selection.entries as any[]).find((x) => x.id === id) : undefined;
    const body: string[] = [];
    if (e) names.push(...new Set([e.client, e.label].filter(Boolean)));
    const r = ranges.get(id);
    if (r) { const t = numberedLines(cvText, r); entryText += t + "\n"; body.push(`### In \`${rel(file)}\` (lines ${r.from}–${r.to})`, t, ""); }
    else body.push(`Not in \`${rel(file)}\` yet.`, "");
    const mr = masterRanges.get(id);
    if (agent === "tailor" && mr) body.push(`### Master CV wording (\`${rel(master)}\` lines ${mr.from}–${mr.to}; start from the bullet with the same src)`, numberedLines(masterText, mr), "");

    // Which contributions and facts this entry draws on.
    const selected = new Set<string>(sel ? sel.bullets.flatMap((b: any) => b.src.split(",").map((x: string) => x.trim())) : []);
    const srcs = new Set<string>(selected);
    for (const t of [r && numberedLines(cvText, r), agent === "tailor" && mr && numberedLines(masterText, mr)]) {
      if (t) for (const m of t.matchAll(/<!--\s*src:\s*([^>]*?)\s*-->/g)) for (const x of m[1].split(",")) srcs.add(x.trim());
    }
    if (s) {
      const fm = s.frontMatter;
      const keys = ["client", "role", "engagement", "period", "team_size_led", "cv_client_label", "cv_section", "cv_order", "cv_max_bullets", "cv_emphasis", "show_dates_in_cv", "cv_title_suffix"];
      body.push(`### Summary \`${s.file}\` (front matter)`, yamlBlock(Object.fromEntries(keys.filter((k) => fm[k] !== undefined).map((k) => [k, fm[k]]))), "");
      // The composer chooses among all contributions; the tailor needs the selected ones (full text only where the
      // master CV has no bullet to start from).
      const contribs = s.contributions.filter((c) => agent === "composer" || selected.has(`${id}#${c.number}`));
      const inMaster = new Set([...(mr ? numberedLines(masterText, mr) : "").matchAll(/<!--\s*src:\s*([^>]*?)\s*-->/g)].flatMap((m) => m[1].split(",").map((x) => x.trim())));
      body.push(`### Contributions (section 4${agent === "tailor" ? ", the selected ones" : ""})`, "");
      for (const c of contribs) {
        const sid = `${id}#${c.number}`;
        const short = agent === "tailor" && inMaster.has(sid);
        body.push(`#### ${sid} ${c.title}${c.removed ? " (removed)" : ""}`,
          ...(short ? ["(The master CV has a bullet for it; full text in the summary.)"] : [c.body]),
          ...(c.result ? [`Result: ${c.result}`] : []), `Tags: ${c.tags.join(", ")}${c.source ? ` · Source: ${c.source}` : ""}`, "");
      }
      body.push("### 5. Technologies and frameworks", summarySection(s, 5), "", "### 7. Metrics and outcomes", summarySection(s, 7), "");
      const terms = s.confidentiality.map((c) => c.term ? `"${c.term}"${c.allow_in ? ` (allowed in ${c.allow_in.join(", ")})` : ""}` : c.prefix ? `prefix "${c.prefix}"` : `url "${c.url_pattern}"`);
      body.push(`### 9. Confidentiality notes`, `Never in the CV (lint blocks them; paraphrase): ${terms.length ? terms.join("; ") : s.confidentialityNone ? "none known" : "section empty"}`, "");
    } else if (e) {
      body.push(`### cv_entry fact (\`facts/confirmed.yaml\`)`, yamlBlock(confirmed.entries.find((x) => x.id === id)), "");
    }
    const facts = (confirmed.raw?.facts ?? []).filter((f: any) => f.type !== "cv_entry" && (f.entry === id || srcs.has(f.id)));
    for (const x of srcs) if (factsById.has(x) && !facts.includes(factsById.get(x))) facts.push(factsById.get(x));
    body.push(`### Confirmed facts (this entry's, and the ones its bullets cite)`, facts.length ? yamlBlock(facts) : "None.", "");
    const items = openItemsFor(id);
    if (items.length) body.push("### Open items (not facts yet: don't claim them)", ...items, "");
    section(`Entry: ${id}`, ...body);
  }

  section("Decisions (`facts/decisions.yaml`)", decisionsSection(scope, names, entryText + (exists ? "" : masterText)));

  const slug = agent === "tailor" ? `tailor-${basename(folder)}` : `composer-${basename(file, ".md").toLowerCase()}`;
  const outFile = rootPath(cfg.paths.runs, "agent-context", `${slug}.md`);
  const text = out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, text);
  return { file: outFile, text, scope };
}

// ---------- cover-letter, portfolio, advisor ----------

const save = (slug: string, out: string[]) => {
  const file = rootPath(loadConfig().paths.runs, "agent-context", `${slug}.md`);
  const text = out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
  return { file, text };
};
const fenced = (p: string, lang = "") => "```" + lang + "\n" + read(p).trim() + "\n```";
const termLine = (s: Summary, scope: string) => s.confidentiality.map((c) => c.term ? `"${c.term}"${c.allow_in?.includes(scope) ? ` (allowed in ${scope})` : ""}` : c.prefix ? `prefix "${c.prefix}"` : `url "${c.url_pattern}"`).join("; ") || (s.confidentialityNone ? "none known" : "section empty");

// Cover letter (specs/outputs/cover-letter.md): the job folder's inputs, the tailored CV with what its sources say,
// the terms to keep out and the screening rules, in one file.
function coverLetterContext(opts: Options) {
  if (!opts.target) throw new UsageError("cover-letter needs a job folder (cv/tailored/<company-role>)");
  const cfg = loadConfig();
  const dir = cliPath(opts.target).replace(/\/(cv|cover-letter)\.md$/, "");
  const cvFile = join(dir, "cv.md");
  if (!existsSync(cvFile)) throw new UsageError(`${rel(cvFile)} not found: run /tailor --jd for this job first`);
  const cvText = read(cvFile);
  const summaries = loadSummaries(cfg);
  const { raw } = loadConfirmed(cfg);
  const shown = parseCv(cvText).sections.flatMap((s) => s.entries.map((e) => e.id)).filter(Boolean) as string[];
  const out: string[] = [];
  const section = (t: string, ...b: string[]) => out.push(`## ${t}`, "", ...b, "");
  out.push(`# Agent context: cover-letter · \`${rel(dir)}\``, "", "Generated by `npm run agent-context`; read this instead of the files it replaces and open a full file only where it points. Never commit.", "");
  section("Rules for every agent (`AGENTS.md`)", agentRules());
  section("Spec sections (`agents/cover-letter.md` *Read first*)", specText("cover-letter" as Agent));
  for (const f of ["job-description.md", "jd-tags.yaml", "why.md", "gap-report.md"]) {
    const p = join(dir, f);
    section(`\`${rel(p)}\``, existsSync(p) ? (f.endsWith(".yaml") ? fenced(p, "yaml") : read(p).trim().replace(/^#{1,3} /gm, (h) => "###" + h.slice(h.indexOf(" ")))) : f === "why.md" ? "Not there yet: ask the user (agent step 2) and save the answer verbatim." : "Not found.");
  }
  section(`Tailored CV (\`${rel(cvFile)}\`, numbered, with sources)`, numberedCv(cvText, true));
  // What each cited source says, so a sentence can be checked without opening the summaries.
  const ids = new Set([...cvText.matchAll(/<!--\s*src:\s*([^>]*?)\s*-->/g)].flatMap((m) => m[1].split(",").map((x) => x.trim())));
  const lines: string[] = [];
  for (const id of [...ids].sort()) {
    const m = id.match(/^([\w-]+)#(4\.\d+)$/);
    const sm = m && summaries.find((x) => x.id === m[1]);
    const c = sm && sm.contributions.find((x) => x.number === m![2]);
    if (c) { lines.push(`- **${id}** ${c.title}${c.result ? `. Result: ${c.result}` : ""}`); continue; }
    const fact = (raw?.facts ?? []).find((f: any) => f.id === id);
    if (fact) lines.push(`- **${id}** (fact): ${fact.fact}`);
  }
  section("What the CV's sources say (titles and results; open the summary's `### 4.N` for the full text)", lines.join("\n") || "None.");
  const prof = loadContext({ cvFile }).profile;
  section("Profile (availability and location, for the last paragraph)", yamlBlock({ location: prof.location, work: prof.work }));
  section("Keep out of the letter (section 9 of the shown entries, hidden clients; `cover-letter check` also blocks every other summary's terms)",
    summaries.filter((s) => shown.includes(s.id)).map((s) => `- ${s.id}: ${termLine(s, "cover-letter")}`).join("\n"),
    "", `Hidden clients: ${buildBlocklist(summaries, loadContext({ cvFile })).terms.filter((t) => /hidden client/.test(t.from)).map((t) => t.term).join(", ") || "none"}`);
  section("Screening rules (`npm run cover-letter -- check` enforces them)",
    `Body at most ${cfg.checks.cover_letter_max_words} words (\`checks.cover_letter_max_words\`), one page.`,
    `Errors: ${(cfg.checks.ai_tell_phrases ?? []).map((x: string) => `"${x}"`).join(", ")} (\`checks.ai_tell_phrases\`).`,
    `Warnings: ${(cfg.checks.filler_words ?? []).join(", ")} (\`checks.filler_words\`); a sentence over 35 words; no short sentence; most sentences starting with "I".`);
  const letter = join(dir, "cover-letter.md");
  section(`Current letter (\`${rel(letter)}\`)`, existsSync(letter) ? numberedCv(read(letter), true) : "Not created yet: `npm run cover-letter -- refresh`.");
  section("Decisions (`facts/decisions.yaml`)", decisionsSection(shown, [], cvText));
  return { ...save(`cover-letter-${basename(dir)}`, out), scope: shown };
}

// Portfolio (specs/outputs/portfolio.md): only the pages that need writing, each with its summary text, public
// items, terms and current text; the other pages listed by id.
function portfolioContext(opts: Options) {
  const pages = portfolioPages();
  const st = portfolioStatus();
  const want = opts.entries?.length ? opts.entries : opts.all ? pages.map((p) => p.id) : [...new Set([...st.toWrite, ...st.toRewrite, ...st.notInFile])];
  for (const id of want) if (!pages.some((p) => p.id === id)) throw new UsageError(`unknown portfolio page "${id}" (one of: ${pages.map((p) => p.id).join(", ")})`);
  const current = existsSync(portfolioPath()) ? parsePortfolio(read(portfolioPath())).projects : new Map<string, string>();
  // The newest imported portfolio is the published one whose pages the agent keeps (specs/outputs/portfolio.md 4).
  const published = loadSources().documents.filter((d) => d.kind === "portfolio").sort((a, b) => b.date.localeCompare(a.date))[0];
  const out: string[] = [];
  const section = (t: string, ...b: string[]) => out.push(`## ${t}`, "", ...b, "");
  out.push("# Agent context: portfolio", "", "Generated by `npm run agent-context`; read this instead of the files it replaces and open a full file only where it points. Never commit.", "",
    `- Pages in scope: ${want.join(", ") || "none: nothing to write. Pass `--entry <page-id>` for a requested change"}`,
    `- Other pages (leave as they are): ${pages.filter((p) => !want.includes(p.id)).map((p) => p.id).join(", ") || "none"}`, "");
  section("Rules for every agent (`AGENTS.md`)", agentRules());
  section("Spec sections (`agents/portfolio.md` *Read first*)", specText("portfolio" as Agent));
  for (const page of pages.filter((p) => want.includes(p.id))) {
    const s = page.summary;
    const body = [`Title: ${page.title} · Label: ${page.label} · Role: ${page.role}`, "",
      ...[1, 2, 3].flatMap((n) => [`### ${n}. ${s.sections.find((x) => x.number === n)?.title ?? ""}`, summarySection(s, n), ""]),
      "### 4. Contributions", "", ...s.contributions.filter((c) => !c.removed).flatMap((c) => [`#### ${s.id}#${c.number} ${c.title}`, c.body, ...(c.result ? [`Result: ${c.result}`] : []), ""]),
      "### 5. Technologies and frameworks", summarySection(s, 5), "", "### 7. Metrics and outcomes", summarySection(s, 7), "",
      "### Public items for this page (section 8)", yamlBlock(pageItems(page)), "",
      `### 9. Keep out unless allowed in the portfolio`, termLine(s, "portfolio"), "",
      "### Current page text", current.get(page.id)?.trim() || "Not written yet.", "",
      "### Published portfolio text", published ? `\`${published.text}\` (\`doc:${published.id}\`): open it at this page's title; keep its content (step 3).` : "No published portfolio is imported."];
    section(`Page: ${page.id}`, ...body);
  }
  const all: Decision[] = loadDecisions()?.decisions ?? [];
  const ids = want.map((w) => w.split("/")[0]);
  const keep = all.filter((d) => d.id.startsWith("portfolio-") || /\bportfolio\b/i.test(d.decision) || ids.some((i) => `${d.decision} ${d.why ?? ""}`.includes(i)));
  section("Decisions (`facts/decisions.yaml`)", `${keep.length} of ${all.length} decisions are about the portfolio or these pages; follow them.`, "", ...keep.map((d) => `- **${d.id}**: ${d.decision}`), "",
    `Not listed: ${all.filter((d) => !keep.includes(d)).map((d) => d.id).join(", ")}.`);
  return { ...save("portfolio", out), scope: want };
}

// Advisor (agents/advisor.md): open items, the decisions and facts already recorded (by id, one line each), the
// entries, and the findings of the reports to go through.
function advisorContext(opts: Options) {
  const cfg = loadConfig();
  const out: string[] = [];
  const section = (t: string, ...b: string[]) => out.push(`## ${t}`, "", ...b, "");
  out.push("# Agent context: advisor", "", "Generated by `npm run agent-context`; read this instead of the files it replaces and open a full file only where it points. Never commit.", "");
  section("Rules for every agent (`AGENTS.md`)", agentRules());
  section("Spec sections (`agents/advisor.md` *Read first*)", specText("advisor" as Agent));
  const oi = rootPath("docs", "open-items.md");
  section("Open items (`docs/open-items.md`)", existsSync(oi) ? read(oi).replace(/^# .*\n+/, "").replace(/^## /gm, "### ").trim() : "Not found.");
  // Front-matter values still to confirm (work-summary-spec 3; status prints them as CONFIRM lines): ask about each.
  const toConfirm = loadSummaries().map((s) => ({ s, f: unconfirmedFields(read(rootPath(s.file))) })).filter((x) => x.f.length);
  section("Front-matter values to confirm (`# TODO (needs user input): confirm`)", toConfirm.length
    ? toConfirm.map(({ s, f }) => `- ${s.file}: ${f.map((k) => `\`${k}: ${typeof s.frontMatter[k] === "object" ? JSON.stringify(s.frontMatter[k]) : s.frontMatter[k]}\``).join(", ")} (show_in_cv: ${s.frontMatter.show_in_cv ?? true})`).join("\n")
    : "None.");
  // Default: the latest report run (reports/<YYYY-MM-DD-HHmm>/), as agents/advisor.md /improve says.
  const runs = existsSync(rootPath("reports")) ? readdirSync(rootPath("reports")).filter((d) => /^\d{4}-\d{2}-\d{2}-\d{4}$/.test(d)).sort() : [];
  const reports = opts.target ? opts.target.split(",").map((x) => x.trim()).filter(Boolean) : runs.length ? [`reports/${runs[runs.length - 1]}`] : [];
  if (!reports.length) section("Reports", "No report run found under `reports/`; nothing to go through for /improve.");
  for (const r of reports) {
    const dir = cliPath(r);
    if (!existsSync(dir)) throw new UsageError(`${rel(dir)} not found`);
    const files = existsSync(join(dir)) && !dir.endsWith(".md") ? readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => join(dir, f)) : [dir];
    for (const f of files) {
      const t = read(f);
      const verdict = t.match(/^verdict: (.+)$/m)?.[1] ?? "?", score = t.match(/^score: (.+)$/m)?.[1] ?? "?";
      const rows = (t.match(/^## Findings\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1] ?? "").split("\n").filter((l) => /^\| [a-z][\w-]*-\d+ /i.test(l)); // ats-1, fact-check-1
      section(`Findings: \`${rel(f)}\` (${verdict}, ${score})`, rows.length ? ["| id | severity | location | issue | suggestion | needs_user_input |", "|---|---|---|---|---|---|", ...rows].join("\n") : "No findings.");
    }
  }
  const decisions: Decision[] = loadDecisions()?.decisions ?? [];
  section("Decisions already recorded (`facts/decisions.yaml`; a finding that matches one is settled)", decisions.map((d) => `- **${d.id}**: ${d.decision}`).join("\n"));
  const { raw } = loadConfirmed(cfg);
  section("Confirmed facts (`facts/confirmed.yaml`, by id)", (raw?.facts ?? []).map((f: any) => `- ${f.id}${f.entry ? ` (${f.entry})` : ""}: ${String(f.fact ?? f.cv_client_label ?? "").slice(0, 140)}`).join("\n"));
  const entries = loadEntries(cfg);
  section("CV entries", entries.map((e) => `- ${e.id}: ${e.role}, ${e.label}${e.label !== e.client ? ` (client ${e.client}, hidden)` : ""}, ${e.period?.start} to ${e.period?.end}, ${e.section}`).join("\n"));
  return { ...save("advisor", out), scope: reports };
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const [agent, target] = positional;
  if (!agent) {
    console.error("usage: npm run agent-context -- composer [--entry <id>[,<id>…]] [--all] | -- tailor <cv-dir | cv.md | profile-id> [--entry <id>[,<id>…]] [--all] | -- cover-letter <job dir> | -- portfolio [--entry <page>[,…]] [--all] | -- advisor [<reports dir>[,…]]");
    process.exit(2);
  }
  try {
    const entries = typeof args.entry === "string" ? args.entry.split(",").map((x) => x.trim()).filter(Boolean) : undefined;
    const { file, text, scope } = agentContext({ agent, target, entries, all: !!args.all });
    const bytes = Buffer.byteLength(text);
    console.log(`agent-context: ${rel(file)} (${(bytes / 1024).toFixed(1)} KB, about ${Math.round(bytes / 4)} tokens; ${scope.length} ${scope.length === 1 ? "entry" : "entries"} in scope)`);
  } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    console.error(`agent-context: ${e.message}`);
    process.exit(2);
  }
}
