// npm run status [--ack <company>]
// Lists which CVs are out of date and why (plan 6, R14), by comparing cv/.build-state.json with the current
// sources, the CV Markdown and the outputs. Also warns, once per application, when a CV you already sent
// has changed since (facts/applications.yaml); --ack <company> records that you know.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml, stringify } from "yaml";
import { allTargets } from "./build.ts";
import { entryHashes, hashSources, readState, sha } from "./lib/buildstate.ts";
import { profileIdForFile } from "./lib/cvmd.ts";
import { masterCvPath } from "./lib/paths.ts";
import { isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

export interface CvStatus { cv: string; state: "up to date" | "stale" | "never built"; reasons: string[] }

const rel = (p: string) => relative(rootPath(), p);

export function cvStatuses(): CvStatus[] {
  const cfg = loadConfig();
  const targets = allTargets();
  const tdir = rootPath(cfg.output.tailored_dir);
  if (existsSync(tdir)) for (const d of readdirSync(tdir).sort()) if (existsSync(join(tdir, d, "cv.md"))) targets.push(join(tdir, d, "cv.md"));
  const state = readState();
  return targets.map((file) => {
    const rec = state[rel(file)];
    if (!rec) return { cv: rel(file), state: "never built", reasons: [] };
    const reasons: string[] = [];
    if (sha(file) !== rec.md_sha) reasons.push("the CV Markdown changed since the last build");
    const now = hashSources(rec.template, profileIdForFile(file));
    for (const [p, h] of Object.entries(now)) {
      if (!(p in rec.sources)) reasons.push(`${p} was added`);
      else if (rec.sources[p] !== h) reasons.push(`${p} changed`);
    }
    for (const p of Object.keys(rec.sources)) if (!(p in now)) reasons.push(`${p} was removed`);
    if (rec.entries) {
      const cur = entryHashes();
      const changed = Object.keys(cur).filter((id) => rec.entries![id] !== cur[id]);
      // Listed first: build keeps these hashes until an agent rewrites the CV (/variants, /compose).
      if (changed.length) reasons.unshift(`${file === masterCvPath() ? "entries to update" : "entries to rewrite in variants"}: ${changed.join(", ")}`);
    }
    for (const [p, h] of Object.entries(rec.outputs)) {
      const abs = rootPath(p);
      if (!existsSync(abs)) reasons.push(`output ${p} is missing`);
      else if (sha(abs) !== h) reasons.push(`output ${p} was changed after the build`);
    }
    return { cv: rel(file), state: reasons.length ? "stale" : "up to date", reasons };
  });
}

interface Application { company: string; role?: string; pdf?: string; pdf_sha256?: string; acknowledged_sha256?: string; status?: string; date?: string }

export function applicationWarnings(ack?: string): string[] {
  const p = rootPath(loadConfig().paths.facts, "applications.yaml");
  if (!existsSync(p)) return [];
  const doc = parseYaml(readFileSync(p, "utf8")) ?? [];
  const apps: Application[] = Array.isArray(doc) ? doc : doc.applications ?? [];
  const out: string[] = [];
  let changed = false;
  for (const a of apps) {
    // An unquoted all-digit hash is read by YAML as a number, losing leading zeros: it can't be compared.
    if (typeof (a as any).pdf_sha256 === "number" || typeof (a as any).acknowledged_sha256 === "number") {
      out.push(`${a.company}: quote pdf_sha256 and acknowledged_sha256 in applications.yaml (e.g. pdf_sha256: "0123…"); skipped`);
      continue;
    }
    if (!a.pdf || !a.pdf_sha256 || ["rejected", "withdrawn"].includes(a.status ?? "")) continue;
    const abs = rootPath(a.pdf);
    const current = existsSync(abs) ? sha(abs) : undefined;
    if (!current || current === a.pdf_sha256) continue;
    if (ack && a.company.toLowerCase() === ack.toLowerCase()) { a.acknowledged_sha256 = current; changed = true; continue; }
    if (a.acknowledged_sha256 === current) continue;
    out.push(`${a.company}${a.role ? ` (${a.role})` : ""} received an older version of ${a.pdf} on ${a.date ?? "?"}; acknowledge with npm run status -- --ack "${a.company}"`);
  }
  if (changed) writeFileSync(p, stringify(Array.isArray(doc) ? apps : { ...doc, applications: apps }));
  return out;
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const list = cvStatuses();
  for (const s of list) {
    console.log(`${s.state === "up to date" ? "ok   " : s.state === "stale" ? "STALE" : "NEW  "}  ${s.cv}${s.state === "never built" ? " (never built)" : ""}`);
    for (const r of s.reasons.slice(0, 8)) console.log(`         ${r}`);
    if (s.reasons.length > 8) console.log(`         … ${s.reasons.length - 8} more`);
  }
  const warnings = applicationWarnings(args.ack as string | undefined);
  for (const w of warnings) console.log(`SENT   ${w}`);
  const todo = list.filter((s) => s.state !== "up to date");
  const rewrite = todo.some((s) => s.reasons.some((r) => r.startsWith("entries to rewrite") || r.startsWith("entries to update")));
  if (rewrite) console.log(`\nstatus: sources changed: run /compose for the master CV and /variants for role variants first (they rewrite the listed entries), then npm run build:all`);
  else if (todo.length) console.log(`\nstatus: ${todo.length} CV(s) to rebuild: run npm run build:all (or npm run build -- <file>)`);
  else console.log("\nstatus: everything is up to date");
}
