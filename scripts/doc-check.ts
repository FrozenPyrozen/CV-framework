// npm run doc-check
// Deterministic drift check between the docs (AGENTS.md, CLAUDE.md, README.md, docs/, specs/, agents/, .claude/) and
// the code and config, so "are plan, specs, agents and code aligned?" needs no AI audit for the mechanical part:
//   1. scripts:  every `npm run <name>` and every docs/scripts.md row names a package.json script, and every
//                package.json script has a row;
//   2. flags:    every --flag in a row's first column is handled by that script (its file or the local modules it
//                imports); a flag the script parses that its row never mentions is a warning;
//   3. config:   a backticked `checks.max_pages`-style key whose first part is a top-level key of
//                framework.config.yaml exists there or in schemas/config.schema.json;
//   4. values:   a number copied next to a config key ("`checks.max_words` (2200)", "is 2200", "= 2200") equals the
//                config value;
//   5. paths:    backticked repo paths (scripts/, specs/, docs/ …) exist; placeholders, generated or git-ignored
//                outputs and per-laptop files (*.local.*) are skipped;
//   6. sections: "`specs/cv-spec.md` 14", "cv-spec.md section 2.1" point to a numbered heading in that file;
//   7. fields:   a backticked snake_case name next to "field" is a property in some schemas/*.json (warning only).
// docs/changelog.md is history and is not checked. Fenced code blocks are skipped.
// Prints one ERROR/warn line per finding; exits 1 on errors.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { isMain, loadConfig, rootPath, ROOT } from "./lib/repo.ts";

export interface DocIssue { level: "error" | "warning"; file: string; line: number; message: string }

// Repo paths that docs may name although they don't exist in a fresh checkout (git-ignored or written later).
const OPTIONAL_PATHS = ["facts/applications.yaml", "summaries/.digests", "framework.local.yaml"];
const PATH_PREFIXES = ["scripts/", "specs/", "agents/", "docs/", "schemas/", "templates/", "profiles/", "markets/", "facts/", "summaries/", "tests/", ".claude/"];
const ARRAY_METHODS = new Set(["join", "length", "slice", "map", "filter", "push", "includes", "indexOf", "some", "every", "find", "forEach", "concat"]);

function mdFiles(dir: string, recursive = false): string[] {
  const d = rootPath(dir);
  if (!existsSync(d)) return [];
  const out: string[] = [];
  for (const f of readdirSync(d).sort()) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (recursive) out.push(...mdFiles(join(dir, f), true)); }
    else if (f.endsWith(".md")) out.push(join(dir, f));
  }
  return out;
}

export function docFiles(): string[] {
  return [
    ...["AGENTS.md", "CLAUDE.md", "README.md"].filter((f) => existsSync(rootPath(f))),
    ...mdFiles("docs").filter((f) => f !== "docs/changelog.md"),
    ...mdFiles("specs", true),
    ...mdFiles("agents"),
    ...mdFiles(".claude/commands"),
    ...mdFiles(".claude/agents"),
  ];
}

// The text with fenced code blocks blanked (line numbers kept).
function stripFences(text: string): string {
  let fenced = false;
  return text.split("\n").map((l) => {
    if (/^\s*```/.test(l)) { fenced = !fenced; return ""; }
    return fenced ? "" : l;
  }).join("\n");
}

const lineOf = (text: string, index: number) => text.slice(0, index).split("\n").length;

// ---------- scripts and flags ----------

interface ScriptRow { name: string; usage: string; row: string; line: number }

// Rows of the first table whose header starts with "| Script |".
export function scriptRows(text: string): ScriptRow[] {
  const rows: ScriptRow[] = [];
  let inTable = false;
  text.split("\n").forEach((l, i) => {
    if (/^\| Script \|/.test(l)) { inTable = true; return; }
    if (!inTable) return;
    if (!l.startsWith("|")) { if (rows.length) inTable = false; return; }
    const m = l.match(/^\| `([^`]+)`[^|]*\|/);
    if (m) rows.push({ name: m[1].split(/\s+/)[0], usage: m[1], row: l, line: i + 1 });
  });
  return rows;
}

const flagsIn = (s: string) => new Set([...s.matchAll(/(?<![\w-])--([a-z][a-z0-9-]*)/g)].map((m) => m[1]));

// The script file and the local modules it imports (recursively).
function sourceClosure(file: string, seen = new Set<string>()): string[] {
  if (seen.has(file) || !existsSync(file)) return [];
  seen.add(file);
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/from\s+"(\.{1,2}\/[^"]+\.ts)"/g)) sourceClosure(resolve(dirname(file), m[1]), seen);
  return [...seen];
}

function handles(sources: string[], flag: string): boolean {
  const esc = flag.replace(/-/g, "\\-");
  const re = new RegExp(`args\\.${/^[a-z]\w*$/.test(flag) ? esc + "\\b" : "\\0"}|args\\[["']${esc}["']\\]|["'\`]--${esc}(?![\\w-])`);
  return sources.some((f) => re.test(readFileSync(f, "utf8")));
}

function parsedFlags(file: string): Set<string> {
  const text = readFileSync(file, "utf8");
  const out = new Set<string>();
  for (const m of text.matchAll(/\bargs\.([a-z]\w*)/g)) if (!ARRAY_METHODS.has(m[1])) out.add(m[1]);
  for (const m of text.matchAll(/\bargs\["([a-z][\w-]*)"\]/g)) out.add(m[1]);
  return out;
}

function checkScripts(docs: Map<string, string>, issues: DocIssue[]): void {
  const pkgPath = rootPath("package.json");
  if (!existsSync(pkgPath)) return;
  const scripts: Record<string, string> = JSON.parse(readFileSync(pkgPath, "utf8")).scripts ?? {};
  for (const [file, text] of docs) {
    for (const m of text.matchAll(/npm run ([a-z][a-z0-9:-]*)/g)) {
      if (!(m[1] in scripts)) issues.push({ level: "error", file, line: lineOf(text, m.index!), message: `npm run ${m[1]}: no such script in package.json` });
    }
  }
  const table = "docs/scripts.md";
  const text = docs.get(table);
  if (text === undefined) return;
  const rows = scriptRows(text);
  const byName = new Map(rows.map((r) => [r.name, r]));
  for (const name of Object.keys(scripts)) if (!byName.has(name)) issues.push({ level: "error", file: table, line: 0, message: `npm script "${name}" has no row` });
  // Flags listed anywhere in the rows of the npm scripts that run one file (build and build:all share build.ts).
  const mentioned = new Map<string, Set<string>>();
  const fileOf = (name: string) => scripts[name]?.match(/(scripts\/[\w/-]+\.ts)/)?.[1];
  for (const name of Object.keys(scripts)) {
    const f = fileOf(name);
    if (!f) continue;
    const set = mentioned.get(f) ?? new Set<string>();
    for (const x of flagsIn(scripts[name])) set.add(x);
    for (const x of flagsIn(byName.get(name)?.row ?? "")) set.add(x);
    mentioned.set(f, set);
  }
  for (const r of rows) {
    if (!(r.name in scripts)) { issues.push({ level: "error", file: table, line: r.line, message: `row "${r.name}": no such script in package.json` }); continue; }
    const f = fileOf(r.name);
    if (!f || !existsSync(rootPath(f))) continue; // test, typecheck: not our scripts
    const sources = sourceClosure(rootPath(f));
    for (const flag of flagsIn(r.usage)) {
      if (!handles(sources, flag) && !flagsIn(scripts[r.name]).has(flag)) issues.push({ level: "error", file: table, line: r.line, message: `${r.name}: --${flag} is listed but ${f} doesn't handle it` });
    }
    if (r === rows.find((x) => fileOf(x.name) === f)) {
      for (const flag of parsedFlags(rootPath(f))) {
        if (!mentioned.get(f)!.has(flag)) issues.push({ level: "warning", file: table, line: r.line, message: `${r.name}: ${f} parses --${flag}, which its row doesn't mention` });
      }
    }
  }
}

// ---------- config keys and copied values ----------

function schemaHas(schema: any, path: string[]): boolean {
  let s = schema;
  for (const seg of path) {
    if (!s || typeof s !== "object") return false;
    if (s.properties?.[seg] !== undefined) s = s.properties[seg];
    else if (s.additionalProperties && typeof s.additionalProperties === "object") s = s.additionalProperties;
    else if (s.additionalProperties === true) return true;
    else return false;
  }
  return true;
}

function configValue(cfg: any, path: string[]): { found: boolean; value?: unknown } {
  let v = cfg;
  for (const seg of path) {
    if (v === null || typeof v !== "object" || !(seg in v)) return { found: false };
    v = v[seg];
  }
  return { found: true, value: v };
}

function checkConfig(docs: Map<string, string>, issues: DocIssue[]): void {
  const cfg = loadConfig() as any;
  const schemaPath = rootPath("schemas/config.schema.json");
  const schema = existsSync(schemaPath) ? JSON.parse(readFileSync(schemaPath, "utf8")) : {};
  const top = new Set(Object.keys(cfg));
  // `checks.max_pages`, not `portfolio.md` or `profile.yaml` (file names) nor `profile.education` (other files' keys).
  const KEY = /`([a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+)`/g;
  for (const [file, text] of docs) {
    for (const m of text.matchAll(KEY)) {
      const path = m[1].split(".");
      if (!top.has(path[0]) || /^(md|ya?ml|json|ts|js|docx|pdf|pages|png|txt|zip|enc)$/.test(path[path.length - 1])) continue;
      const line = lineOf(text, m.index!);
      const { found, value } = configValue(cfg, path);
      if (!found) {
        if (!schemaHas(schema, path)) issues.push({ level: "error", file, line, message: `\`${m[1]}\` is not in framework.config.yaml or schemas/config.schema.json` });
        continue;
      }
      // A value copied next to the key: "(420)", "(default 420)", ", default 420", "is 420", "= 420", within 40 characters, before the next code span.
      const after = text.slice(m.index! + m[0].length, m.index! + m[0].length + 40).split("`")[0].split("\n")[0];
      const n = after.match(/^[^.;]*?(?:\(\s*(?:default\s+)?|,\s*default\s+|\bis\s+|=\s*)(\d+(?:\.\d+)?)(?![\d.]*\w)/)?.[1];
      if (n !== undefined && typeof value === "number" && Number(n) !== value) {
        issues.push({ level: "error", file, line, message: `\`${m[1]}\` is ${value} in framework.config.yaml, but the text says ${n}; name the key instead of copying its value` });
      }
      // A string copied right after the key: "`display.field_separator` (` | `)", "(\" (Contract)\")".
      const q = text.slice(m.index! + m[0].length).match(/^ \((?:`([^`\n]*)`|"([^"\n]*)")\)/);
      const s = q ? q[1] ?? q[2] : undefined;
      if (s !== undefined && typeof value === "string" && s !== value) {
        issues.push({ level: "error", file, line, message: `\`${m[1]}\` is "${value}" in framework.config.yaml, but the text says "${s}"; name the key instead of copying its value` });
      }
    }
  }
}

// ---------- paths, section references, schema fields ----------

const gitIgnored = (p: string) => spawnSync("git", ["check-ignore", "-q", "--", p], { cwd: rootPath() }).status === 0;

function checkPaths(docs: Map<string, string>, issues: DocIssue[]): void {
  for (const [file, text] of docs) {
    for (const m of text.matchAll(/`([^`\s]+)`/g)) {
      let p = m[1];
      if (!PATH_PREFIXES.some((x) => p.startsWith(x))) continue;
      if (/[<>*{}…]|YYYY|\.\.\./.test(p)) continue; // placeholders
      p = p.replace(/[:,]+$/, "").replace(/#.*$/, "");
      if (OPTIONAL_PATHS.some((o) => p === o || p.startsWith(o + "/"))) continue;
      // Per-laptop files (named *.local.*, or git-ignored) exist on some machines only: a fresh clone mustn't fail.
      if (/\.local\./.test(basename(p)) || (!existsSync(rootPath(p)) && gitIgnored(p))) continue;
      if (!existsSync(rootPath(p))) issues.push({ level: "error", file, line: lineOf(text, m.index!), message: `\`${p}\` doesn't exist` });
    }
  }
}

function headingNumbers(text: string): Set<string> {
  const out = new Set<string>();
  for (const m of stripFences(text).matchAll(/^#{1,6}\s+(\d+[a-z]?(?:\.\d+)*)\.?\s/gm)) out.add(m[1]);
  return out;
}

function checkSections(docs: Map<string, string>, issues: DocIssue[]): void {
  // Bare file names ("cv-spec.md section 4") resolve when only one Markdown file in specs/, docs/ or agents/ has that name.
  const all = [...mdFiles("specs", true), ...mdFiles("docs"), ...mdFiles("agents"), "AGENTS.md", "README.md"];
  const byBase = new Map<string, string[]>();
  for (const f of all) byBase.set(f.split("/").pop()!, [...(byBase.get(f.split("/").pop()!) ?? []), f]);
  const REF = /`?((?:[\w.-]+\/)*[\w-]+\.md)`?\s+(?:section\s+|§\s*)?(\d+[a-z]?(?:\.\d+)*)(?![\w.]*\w|\.\d)/g;
  for (const [file, text] of docs) {
    for (const m of text.matchAll(REF)) {
      const target = m[1].includes("/") ? m[1] : byBase.get(m[1])?.length === 1 ? byBase.get(m[1])![0] : undefined;
      if (!target || !existsSync(rootPath(target))) continue;
      // "`docs/plan.md` 9b" or "cv-spec.md section 2.1"; plain counts ("file.md 2 times") have no backtick or "section".
      if (!m[0].startsWith("`") && !/section|§/.test(m[0])) continue;
      if (!headingNumbers(readFileSync(rootPath(target), "utf8")).has(m[2])) {
        issues.push({ level: "error", file, line: lineOf(text, m.index!), message: `${target} has no section ${m[2]}` });
      }
    }
  }
}

function schemaProps(): Set<string> {
  const out = new Set<string>();
  const walk = (o: any) => {
    if (!o || typeof o !== "object") return;
    if (o.properties && typeof o.properties === "object") for (const k of Object.keys(o.properties)) out.add(k);
    if (Array.isArray(o.required)) for (const k of o.required) out.add(k);
    for (const v of Object.values(o)) walk(v);
  };
  const dir = rootPath("schemas");
  if (existsSync(dir)) for (const f of readdirSync(dir).filter((f) => f.endsWith(".json"))) walk(JSON.parse(readFileSync(join(dir, f), "utf8")));
  return out;
}

function checkFields(docs: Map<string, string>, issues: DocIssue[]): void {
  const props = schemaProps();
  // "the `show_in_portfolio` field", "fields `a`, `b` and `c`" (snake_case names only; `cv_*` patterns are skipped).
  const BEFORE = /`([a-z]+(?:_[a-z0-9]+)+)`:? (?:front-matter )?fields?\b/g;
  const AFTER = /\bfields?:?\s+((?:`[a-z][a-z0-9_]*`(?:,\s*|\s+and\s+|\s+or\s+)?)+)/g;
  for (const [file, text] of docs) {
    const found: { name: string; index: number }[] = [];
    for (const m of text.matchAll(BEFORE)) found.push({ name: m[1], index: m.index! });
    for (const m of text.matchAll(AFTER)) for (const n of m[1].matchAll(/`([a-z]+(?:_[a-z0-9]+)+)`/g)) found.push({ name: n[1], index: m.index! });
    for (const { name, index } of found) {
      if (!props.has(name)) issues.push({ level: "warning", file, line: lineOf(text, index), message: `field \`${name}\` is not a property in any schemas/*.json` });
    }
  }
}

export function docCheck(): DocIssue[] {
  const docs = new Map(docFiles().map((f) => [f, stripFences(readFileSync(rootPath(f), "utf8"))]));
  const issues: DocIssue[] = [];
  checkScripts(docs, issues);
  checkConfig(docs, issues);
  checkPaths(docs, issues);
  checkSections(docs, issues);
  checkFields(docs, issues);
  return issues;
}

if (isMain(import.meta.url)) {
  const issues = docCheck();
  for (const i of issues) console.log(`${i.level === "error" ? "ERROR" : "warn "}  ${relative(ROOT, rootPath(i.file))}${i.line ? `:${i.line}` : ""}: ${i.message}`);
  const errors = issues.filter((i) => i.level === "error").length;
  console.log(`\ndoc-check: ${docFiles().length} file(s), ${errors} error(s), ${issues.length - errors} warning(s)`);
  if (errors) process.exit(1);
}
