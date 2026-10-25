// npm run verify [--fast]
// One command for agents after a change: runs validate, doc-check, index --check, impact, check, status and the tests (in that
// order, each as its own npm script) and prints one line per step ("ok  validate (0.8 s)" or "FAIL validate"), followed
// only by that step's ERROR / warn / ✖ lines (at most 40) and the failing tests' details, then a summary line. status STALE, NEW,
// SENT, SHARED and CONFIRM lines are warnings, not failures. --fast runs test:changed (only the tests the change can affect, without the Pages, PDF and full-backup tests) instead of test.
// Exits 1 if any step fails.
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isMain } from "./lib/repo.ts";

interface Step { name: string; script: string; args?: string[]; filter: (out: string) => string[] }

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_LINE = 300;
const MAX_LINES = 40;
const clip = (l: string) => (l.length > MAX_LINE ? l.slice(0, MAX_LINE) + " …" : l);

// ERROR / warn / FAIL / ✖ lines; a script that failed without such a line shows its last lines instead.
const issues = (out: string) => out.split("\n").filter((l) => /(^|\s)(ERROR|WARN|warn|FAIL)\b|✖/.test(l));

// status: STALE / NEW / SENT / SHARED / CONFIRM lines with their indented reasons, and the closing advice line.
export function statusLines(out: string): string[] {
  const lines: string[] = [];
  let inBlock = false;
  for (const l of out.split("\n")) {
    if (/^(STALE|NEW|SENT|SHARED|CONFIRM)\b/.test(l)) { inBlock = true; lines.push(l); }
    else if (inBlock && /^\s{4,}\S/.test(l)) lines.push(l);
    else { inBlock = false; if (/^status: /.test(l) && !/everything is up to date/.test(l)) lines.push(l); }
  }
  return lines;
}

// node --test with the dot reporter: everything after "Failed tests:", without stack frames.
function testLines(out: string): string[] {
  const at = out.indexOf("Failed tests:");
  const tail = at >= 0 ? out.slice(at) : "";
  return tail.split("\n").filter((l) => l.trim() && !/^\s+at /.test(l) && !/^\s+(generatedMessage|code|operator|diff):/.test(l) && !/^\s*[{}]\s*$/.test(l));
}

function steps(fast: boolean): Step[] {
  return [
    { name: "validate", script: "validate", filter: issues },
    { name: "doc-check", script: "doc-check", filter: issues },
    { name: "index --check", script: "index", args: ["--check"], filter: (o) => o.split("\n").filter((l) => /out of date|ERROR/.test(l)) },
    { name: "impact", script: "impact", filter: issues },
    { name: "check", script: "check", filter: issues },
    { name: "status", script: "status", filter: statusLines },
    { name: fast ? "test:changed" : "test", script: fast ? "test:changed" : "test", filter: testLines },
  ];
}

function main(): void {
  const fast = process.argv.includes("--fast");
  const start = Date.now();
  let failed = 0, warned = 0;
  for (const s of steps(fast)) {
    const t0 = Date.now();
    const r = spawnSync("npm", ["run", "-s", s.script, ...(s.args?.length ? ["--", ...s.args] : [])], { cwd: PKG, env: process.env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const out = (r.stdout ?? "") + (r.stderr ?? "");
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    let lines = s.filter(out);
    if (r.status !== 0) {
      failed++;
      if (!lines.length) lines = out.trimEnd().split("\n").slice(-15);
      console.log(`FAIL ${s.name} (${secs} s)`);
    } else {
      if (lines.length) warned++;
      console.log(`ok   ${s.name} (${secs} s)${lines.length ? " with warnings" : ""}`);
    }
    for (const l of lines.slice(0, MAX_LINES)) console.log(`     ${clip(l)}`);
    if (lines.length > MAX_LINES) console.log(`     … ${lines.length - MAX_LINES} more (run npm run ${s.script} for all)`);
  }
  const total = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nverify: ${failed ? `${failed} step(s) failed` : "all steps passed"}${warned ? `, ${warned} with warnings` : ""} (${total} s${fast ? ", fast tests" : ""})`);
  process.exit(failed ? 1 : 0);
}

if (isMain(import.meta.url)) main();
