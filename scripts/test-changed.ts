// npm run test:changed [--since <ref>] [--list] [--all]
// Runs only the test files a change can affect (with CV_FAST=1, as test:fast): changed test files, the tests of a
// changed script and of every script that imports it (directly or not), the doc and agent tests for doc, spec and
// agent changes plus the tests of the scripts that read spec or agent files at run time, and every test when shared
// code, config, schemas, templates or CV content changed (most tests copy the real repo). `verify --fast` uses it while iterating; `verify` runs every test before handing back.
// --all: every test with CV_FAST=1 (`npm run test:fast`; set here, not in the shell, so it works on Windows too).
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { type Change, changedFiles } from "./impact.ts";
import { isMain, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

// Changes that can affect any test: shared code, test helpers, config, schemas, templates, CV content and sources.
const EVERYTHING = /^(scripts\/(lib|renderers|exporters)\/|tests\/[\w-]*helpers\.ts$|schemas\/|templates\/|framework\.config\.yaml$|package(-lock)?\.json$|summaries\/|facts\/|cv\/|profiles\/|markets\/|portfolio\/|sources\/)/;
// Docs, specs and agent definitions are read by these tests (doc-check, the registry, the context bundles).
const DOC_TESTS = ["doc-check", "index", "agent-context", "review-context", "impact"];
const DOCS = /^(docs\/|specs\/|agents\/|AGENTS\.md$|CLAUDE\.md$|\.claude\/)/;

export function selectTests(changes: Change[]): { all: boolean; files: string[]; why: string } {
  const tests = readdirSync(rootPath("tests")).filter((f) => f.endsWith(".test.ts")).sort();
  const live = changes.filter((c) => c.status !== "D" || c.path.startsWith("tests/"));
  const broad = live.find((c) => EVERYTHING.test(c.path));
  if (broad) return { all: true, files: tests.map((t) => `tests/${t}`), why: `${broad.path} changed (shared code, config or content)` };

  // Reverse imports among scripts: who imports X (directly or through others).
  const scripts = readdirSync(rootPath("scripts")).filter((f) => f.endsWith(".ts"));
  const importers = new Map<string, Set<string>>();
  for (const s of scripts) for (const m of readFileSync(rootPath("scripts", s), "utf8").matchAll(/from "\.\/([\w-]+)\.ts"/g)) {
    importers.set(m[1], (importers.get(m[1]) ?? new Set()).add(basename(s, ".ts")));
  }
  const affected = new Set<string>();
  const visit = (name: string) => { if (affected.has(name)) return; affected.add(name); for (const i of importers.get(name) ?? []) visit(i); };
  for (const c of live) { const m = c.path.match(/^scripts\/([\w-]+)\.ts$/); if (m) visit(m[1]); }
  if (live.some((c) => DOCS.test(c.path))) DOC_TESTS.forEach((n) => affected.add(n));
  // Scripts that read spec or agent files at run time (rootPath("specs", …); harvest-prompt embeds the summary spec):
  // their own tests only, not their importers' (what they read changed, not their code).
  // Each script's literal read paths: a rootPath call with "specs" and "x.md" reads that file; one with "specs",
  // "rubrics" and a computed name reads the folder specs/rubrics/.
  const reads = (text: string) => [...text.matchAll(/rootPath\(((?:"[^"]+"\s*,?\s*)+)/g)].map((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).join("/"))
    .filter((p) => /^(specs|agents)(\/|$)/.test(p)).map((p) => (p.endsWith(".md") ? p : `${p}/`));
  for (const s of scripts) {
    const paths = reads(readFileSync(rootPath("scripts", s), "utf8"));
    if (live.some((c) => paths.some((p) => (p.endsWith("/") ? c.path.startsWith(p) : c.path === p)))) affected.add(basename(s, ".ts"));
  }

  const files = new Set(live.filter((c) => /^tests\/.+\.test\.ts$/.test(c.path) && existsSync(rootPath(c.path))).map((c) => c.path));
  for (const t of tests) {
    const text = readFileSync(rootPath("tests", t), "utf8");
    // A test covers a script when it is named after it (build-core for build) or runs or imports it.
    if ([...affected].some((n) => t === `${n}.test.ts` || t.startsWith(`${n}-`) || text.includes(`"${n}.ts"`) || text.includes(`/${n}.ts"`))) files.add(`tests/${t}`);
  }
  return { all: false, files: [...files].sort(), why: files.size ? `${changes.length} changed file(s)` : "no test is affected" };
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const since = typeof args.since === "string" ? args.since : "HEAD";
  const sel = args.all
    ? { all: true, files: readdirSync(rootPath("tests")).filter((f) => f.endsWith(".test.ts")).sort().map((t) => `tests/${t}`), why: "--all" }
    : selectTests(changedFiles(since));
  console.log(`test:changed: ${sel.all ? "all tests" : `${sel.files.length} test file(s)`} (${sel.why})${sel.files.length && !sel.all ? `: ${sel.files.map((f) => basename(f, ".test.ts")).join(", ")}` : ""}`);
  if (args.list || !sel.files.length) process.exit(0);
  const r = spawnSync(process.execPath, ["--import", "tsx", "--test", "--test-reporter=dot", ...sel.files], { cwd: rootPath(), env: { ...process.env, CV_FAST: "1" }, stdio: "inherit" });
  process.exit(r.status ?? 1);
}
