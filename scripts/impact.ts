// npm run impact [--since <ref>]
// The deterministic half of an alignment check (specs/alignment-spec.md 2): from what changed in git (the working tree
// against HEAD, or everything since <ref>), it lists the other files the change requires and reports the ones that
// weren't updated, by the impact map of specs/alignment-spec.md 3. Errors for required updates, warnings for due work
// (the acceptance replay) and likely gaps (a changed script with no changed test). doc-check and index --check cover
// the rest (rows, flags, keys, paths, section numbers, the registry). No AI calls.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { parse } from "yaml";
import { isMain, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

export interface Change { status: "A" | "M" | "D"; path: string }
export interface ImpactFinding { level: "error" | "warning"; rule: string; message: string }

const git = (args: string[]) => {
  const r = spawnSync("git", args, { cwd: rootPath(), encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${(r.stderr || "").trim()}`);
  return r.stdout;
};

// Changed files: tracked changes against the base (HEAD by default) plus untracked files (not ignored) as added.
export function changedFiles(since = "HEAD"): Change[] {
  const out: Change[] = [];
  for (const line of git(["diff", "--name-status", "--no-renames", since]).split("\n")) {
    const m = line.match(/^([AMD])\t(.+)$/);
    if (m) out.push({ status: m[1] as Change["status"], path: m[2] });
  }
  for (const p of git(["ls-files", "--others", "--exclude-standard"]).split("\n")) if (p.trim()) out.push({ status: "A", path: p.trim() });
  return out;
}

const read = (p: string) => (existsSync(rootPath(p)) ? readFileSync(rootPath(p), "utf8") : "");
const oldText = (p: string, since: string) => { try { return git(["show", `${since}:${p}`]); } catch { return ""; } };

// A table row added to a Markdown file since the base: the file has more table rows, or a row whose first cell (its
// id: a changelog number, a scenario id) wasn't there before. Editing an old row's text is neither (a new file counts).
function addsRow(p: string, since: string): boolean {
  const rows = (t: string) => t.split("\n").filter((l) => l.startsWith("| ") && !/^\|[\s|:-]*$/.test(l));
  const first = (l: string) => l.split("|")[1]?.trim();
  const before = rows(oldText(p, since)), now = rows(read(p));
  const ids = new Set(before.map(first));
  return now.length > before.length || now.some((l) => !ids.has(first(l)));
}

// Data maps in the config: their entries are values (words, ids), not settings, so I7 doesn't ask for them in docs.
const DATA_MAPS = /^checks\.spelling_variants\./;

// Dotted keys of a YAML mapping, to tell added config keys (checks.cover_letter_max_words).
function keys(obj: unknown, prefix = ""): string[] {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => [prefix + k, ...keys(v, `${prefix}${k}.`)]);
}

// Framework files: everything a changelog row is for (docs/changelog.md: "one row per change to the framework").
export const FRAMEWORK = /^(scripts|specs|agents|schemas|templates|markets|profiles|\.claude\/(agents|commands))\/|^(framework\.config\.yaml|package\.json|AGENTS\.md|CLAUDE\.md|docs\/(plan|scripts|workflows|acceptance)\.md)$/;

export function impact(changes: Change[], since = "HEAD"): ImpactFinding[] {
  const f: ImpactFinding[] = [];
  const add = (level: ImpactFinding["level"], rule: string, message: string) => f.push({ level, rule, message });
  const changed = new Set(changes.map((c) => c.path));
  const added = changes.filter((c) => c.status === "A").map((c) => c.path);
  const pkg = JSON.parse(read("package.json") || "{}").scripts ?? {};
  const workflows = read("docs/workflows.md"), plan = read("docs/plan.md"), agentsMd = read("AGENTS.md");

  // I1. A framework change has its changelog row.
  const framework = changes.filter((c) => FRAMEWORK.test(c.path));
  if (framework.length && !addsRow("docs/changelog.md", since)) add("error", "I1", `framework files changed (${framework.slice(0, 3).map((c) => c.path).join(", ")}${framework.length > 3 ? " …" : ""}) but docs/changelog.md has no new row`);

  // I2. A new script: an npm script runs it, and a test covers it.
  for (const p of added.filter((x) => /^scripts\/[\w-]+\.ts$/.test(x))) {
    const name = basename(p, ".ts");
    if (!Object.values(pkg).some((cmd) => String(cmd).includes(p))) add("error", "I2", `${p} is new but no package.json script runs it`);
    if (!existsSync(rootPath("tests", `${name}.test.ts`)) && !changes.some((c) => c.path.startsWith(`tests/${name}`))) add("error", "I2", `${p} is new but has no tests/${name}.test.ts`);
  }
  // I3. A changed script with no changed test: a likely gap (a warning; refactors may need none).
  if (changes.some((c) => c.status === "M" && /^scripts\/.+\.ts$/.test(c.path)) && !changes.some((c) => c.path.startsWith("tests/"))) add("warning", "I3", "scripts changed but no test changed: add or update a test for the new behavior");

  // I4. A new agent: its Claude wrapper, a workflow and the plan's agents table name it, and it has a Read first list.
  for (const p of added.filter((x) => /^agents\/[\w-]+\.md$/.test(x))) {
    const name = basename(p, ".md");
    if (!existsSync(rootPath(".claude", "agents", `${name}.md`))) add("error", "I4", `${p} is new but .claude/agents/${name}.md (its Claude wrapper) is missing`);
    if (!workflows.includes(p)) add("error", "I4", `${p} is new but docs/workflows.md names no command that follows it`);
    // Section 5 only (up to the next "## " heading): a mention elsewhere in the plan isn't a row in the agents table.
    const agentsTable = plan.match(/^## 5\.[^\n]*\n([\s\S]*?)(?=^## )/m)?.[1] ?? "";
    if (!agentsTable.includes(p)) add("error", "I4", `${p} is new but docs/plan.md section 5 (agents) doesn't list it`);
    if (!/^## Read first$/m.test(read(p))) add("error", "I4", `${p} has no "## Read first" list (AGENTS.md rule 1)`);
  }
  // I5. A new command: docs/workflows.md has its row.
  for (const p of added.filter((x) => /^\.claude\/commands\/[\w-]+\.md$/.test(x))) {
    const name = basename(p, ".md");
    if (!new RegExp(`\`/${name}[\\s\`]`).test(workflows)) add("error", "I5", `${p} is new but docs/workflows.md has no /${name} row`);
  }
  // I6. A new spec: AGENTS.md rule 1 lists it, and the plan mentions it.
  for (const p of added.filter((x) => /^specs\/(?!rubrics\/).+\.md$/.test(x))) {
    const short = p.replace(/^specs\//, "");
    if (!agentsMd.includes(`\`${short}\``)) add("error", "I6", `${p} is new but AGENTS.md rule 1 doesn't list \`${short}\``);
    if (!plan.includes(p)) add("warning", "I6", `${p} is new but docs/plan.md doesn't mention it`);
  }
  // I7. A new config key: a spec or doc names it (the schema half is enforced by validate).
  if (changed.has("framework.config.yaml")) {
    const before = new Set(keys(parse(oldText("framework.config.yaml", since)) ?? {}));
    const docs = ["specs", "docs", "agents"].flatMap((d) => (existsSync(rootPath(d)) ? (git(["ls-files", "--cached", "--others", "--exclude-standard", d]).split("\n").filter((x) => x.endsWith(".md"))) : [])).map(read).join("\n");
    for (const k of keys(parse(read("framework.config.yaml")) ?? {}).filter((k) => !before.has(k) && !DATA_MAPS.test(k))) {
      if (!docs.includes(`\`${k}\``)) add("error", "I7", `config key ${k} is new but no spec or doc names it`);
    }
  }
  // I8. A spec, rubric, agent or command changed: the acceptance replay is due (docs/acceptance.md).
  const behavior = changes.filter((c) => /^(specs|agents|\.claude\/commands)\//.test(c.path));
  if (behavior.length && !addsRow("docs/acceptance.md", since)) add("warning", "I8", `specs, agents or commands changed (${behavior.length} file(s)): the acceptance replay is due; add a scenario or a run-log line to docs/acceptance.md`);
  // I9. A removed script, agent or spec: nothing still names it.
  for (const c of changes.filter((x) => x.status === "D" && /^(scripts|agents|specs)\//.test(x.path))) {
    // Specs are also named by their short path ("cv-spec.md" in AGENTS.md rule 1).
    const names = c.path.startsWith("specs/") ? ["-e", c.path, "-e", c.path.replace(/^specs\//, "")] : ["-e", c.path];
    const g = spawnSync("git", ["grep", "-l", "--fixed-strings", ...names], { cwd: rootPath(), encoding: "utf8" }); // exit 1: no match
    const hits = (g.stdout ?? "").split("\n").filter((x) => x && x !== "docs/changelog.md");
    if (hits.length) add("error", "I9", `${c.path} was removed but is still named in ${hits.slice(0, 3).join(", ")}`);
  }
  return f;
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const since = typeof args.since === "string" ? args.since : "HEAD";
  const changes = changedFiles(since);
  const f = impact(changes, since);
  for (const x of f) console.log(`${x.level === "error" ? "ERROR" : "warn "}  [${x.rule}] ${x.message}`);
  const errors = f.filter((x) => x.level === "error").length;
  console.log(`impact: ${changes.length} changed file(s) since ${since}; ${errors} error(s), ${f.length - errors} warning(s)`);
  process.exit(errors ? 1 : 0);
}
