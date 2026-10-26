// npm run status [--ack <company>]
// Also the public portfolio (plan 9e P3): projects to write or rewrite, generated parts out of date, unchecked changes.
// Lists which CVs are out of date and why (docs/scripts.md, plan R14), by comparing cv/.build-state.json with the current
// sources, the CV Markdown and the outputs. Also warns, once per application, when a CV you already sent
// has changed since (facts/applications.yaml); --ack <company> records that you know. And says when a released PDF
// (facts/releases.yaml, npm run release) has new text, so the shared copy should be replaced.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml, stringify } from "yaml";
import { allTargets } from "./build.ts";
import { entryHashes, entryTextHashes, hashSources, readState, sha } from "./lib/buildstate.ts";
import { profileIdForFile } from "./lib/cvmd.ts";
import { masterCvPath } from "./lib/paths.ts";
import { isMain, loadConfig, rootPath, unconfirmedFields } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";
import { portfolioProjects, portfolioStatus } from "./portfolio.ts";

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
    const now = hashSources(rec.template, profileIdForFile(file), file);
    for (const [p, h] of Object.entries(now)) {
      if (!(p in rec.sources)) reasons.push(`${p} was added`);
      else if (rec.sources[p] !== h) reasons.push(`${p} changed`);
    }
    for (const p of Object.keys(rec.sources)) if (!(p in now)) reasons.push(`${p} was removed`);
    if (rec.entries) {
      const cur = entryHashes();
      const present = entryTextHashes(readFileSync(file, "utf8"));
      const changed = Object.keys(cur).filter((id) => id in present && rec.entries![id] !== cur[id]);
      // Listed first: build keeps these hashes until an agent rewrites the CV (/variants, /compose).
      if (changed.length) reasons.unshift(`${file === masterCvPath() ? "entries to update" : file.includes(`/${loadConfig().output.tailored_dir.split("/").pop()}/`) ? "entries to rewrite in this tailored CV" : "entries to rewrite in variants"}: ${changed.join(", ")}`);
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

export function readApplications(): Application[] {
  const p = rootPath(loadConfig().paths.facts, "applications.yaml");
  if (!existsSync(p)) return [];
  const doc = parseYaml(readFileSync(p, "utf8")) ?? [];
  return Array.isArray(doc) ? doc : doc.applications ?? [];
}

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
    if (!current) {
      // The sent PDF is gone (rebuilt or deleted). Fine when an exact copy was kept (sent_copy) or --ack was given.
      const keptCopy = (a as any).sent_copy && existsSync(rootPath((a as any).sent_copy));
      if (keptCopy || a.acknowledged_sha256 === "missing") continue;
      if (ack && (a.company ?? "").toLowerCase() === ack.toLowerCase()) { a.acknowledged_sha256 = "missing"; changed = true; console.log(`status: acknowledged that the PDF sent to ${a.company} is gone`); continue; }
      out.push(`${a.company ?? "?"}: the PDF you sent (${a.pdf}) is missing and no copy was kept (log-application --keep-copy keeps one); acknowledge with npm run status -- --ack "${a.company}"`);
      continue;
    }
    if (current === a.pdf_sha256) continue;
    if (ack && (a.company ?? "").toLowerCase() === ack.toLowerCase()) { a.acknowledged_sha256 = current; changed = true; console.log(`status: acknowledged the changed PDF for ${a.company}`); continue; }
    if (a.acknowledged_sha256 === current) continue;
    out.push(`${a.company}${a.role ? ` (${a.role})` : ""} received an older version of ${a.pdf} on ${a.date ?? "?"}; acknowledge with npm run status -- --ack "${a.company}"`);
  }
  if (changed) writeFileSync(p, stringify(Array.isArray(doc) ? apps : { ...doc, applications: apps }));
  return out;
}

// The latest release (specs/facts-spec.md 6): a PDF whose Markdown changed since is out of date where you shared it.
// A rebuild with the same text (a new PDF hash only) is not reported: exporters write slightly different files.
export function releaseWarnings(): string[] {
  const f = rootPath(loadConfig().paths.facts, "releases.yaml");
  if (!existsSync(f)) return [];
  const last = ((parseYaml(readFileSync(f, "utf8")) as { releases?: { date: string; files: { path: string; source: string; source_sha256: string }[] }[] })?.releases ?? []).at(-1);
  if (!last) return [];
  const changed = last.files.filter((x) => !existsSync(rootPath(x.source)) || sha(rootPath(x.source)) !== x.source_sha256).map((x) => x.path);
  return changed.length ? [`text changed since the release of ${last.date}: ${changed.join(", ")}; build, share the new PDF(s), then npm run release`] : [];
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const list = cvStatuses();
  for (const s of list) {
    const noPdf = s.state === "up to date" && !Object.keys(readState()[s.cv]?.outputs ?? {}).some((o) => o.endsWith(".pdf"));
    console.log(`${s.state === "up to date" ? "ok   " : s.state === "stale" ? "STALE" : "NEW  "}  ${s.cv}${s.state === "never built" ? " (never built)" : ""}${noPdf ? " (built without a PDF: --no-pdf)" : ""}`);
    for (const r of s.reasons.slice(0, 8)) console.log(`         ${r}`);
    if (s.reasons.length > 8) console.log(`         … ${s.reasons.length - 8} more`);
  }
  const warnings = applicationWarnings(args.ack as string | undefined);
  if (args.ack && !readApplications().some((x) => (x.company ?? "").toLowerCase() === String(args.ack).toLowerCase())) console.log(`status: no application to "${args.ack}" in facts/applications.yaml; nothing acknowledged`);
  for (const w of warnings) console.log(`SENT   ${w}`);
  const shared = releaseWarnings();
  for (const w of shared) console.log(`SHARED ${w}`);
  // Front-matter values still to confirm (work-summary-spec 3): the harvester or advisor asks about them.
  const cfg = loadConfig();
  let confirms = 0;
  for (const f of readdirSync(rootPath(cfg.paths.summaries)).filter((x) => x.endsWith(".md")).sort()) {
    const open = unconfirmedFields(readFileSync(rootPath(cfg.paths.summaries, f), "utf8"));
    if (open.length) confirms++;
    if (open.length) console.log(`CONFIRM ${cfg.paths.summaries}/${f}: ${open.join(", ")} (# TODO … confirm; /improve or /add-experience asks)`);
  }
  // The public portfolio (plan 9e P3): only once a project is opted in or the file exists.
  const ps = portfolioStatus();
  const portfolioTodo: string[] = [];
  if (!ps.exists && portfolioProjects().length) portfolioTodo.push(`not created yet: npm run portfolio -- refresh, then /portfolio (${ps.notInFile.join(", ")})`);
  if (ps.exists) {
    if (ps.generatedStale && !ps.notInFile.length) portfolioTodo.push("generated parts are out of date (the cover, project titles, public images or links changed, or a project left the portfolio): npm run portfolio -- refresh");
    if (ps.notInFile.length) portfolioTodo.push(`projects not in the file yet: ${ps.notInFile.join(", ")} (npm run portfolio -- refresh)`);
    if (ps.toWrite.length) portfolioTodo.push(`projects to write: ${ps.toWrite.join(", ")} (/portfolio)`);
    if (ps.toRewrite.length) portfolioTodo.push(`projects to rewrite (their summaries changed): ${ps.toRewrite.join(", ")} (/portfolio)`);
    if (!ps.neverChecked && !ps.toWrite.length && ps.builtOutdated) portfolioTodo.push("Word, Pages and PDF files are older than portfolio.md: npm run build:portfolio");
    if (ps.neverChecked) portfolioTodo.push("never checked: npm run portfolio -- check");
    else if (ps.changedSinceCheck) portfolioTodo.push("changed since the last check: npm run portfolio -- check");
  }
  if (ps.exists || portfolioTodo.length) {
    console.log(`${portfolioTodo.length ? "STALE" : "ok   "}  portfolio/portfolio.md`);
    for (const r of portfolioTodo) console.log(`         ${r}`);
  }
  const todo = list.filter((s) => s.state !== "up to date");
  const rewrite = todo.some((s) => s.reasons.some((r) => r.startsWith("entries to rewrite") || r.startsWith("entries to update")));
  const tailored = todo.filter((s) => s.cv.startsWith(`${loadConfig().output.tailored_dir}/`)).map((s) => s.cv);
  if (rewrite) console.log(`\nstatus: sources changed: run /compose for the master CV and /variants for role variants first (they rewrite the listed entries), then npm run build:all`);
  else if (todo.length > tailored.length) console.log(`\nstatus: ${todo.length - tailored.length} CV(s) to rebuild: run npm run build:all (or npm run build -- <file>)`);
  else if (todo.length) console.log(`\nstatus: ${todo.length} job-specific CV(s) to rebuild:`);
  else if (portfolioTodo.length) console.log("\nstatus: CVs are up to date; the portfolio needs work (above)");
  else if (warnings.length || shared.length || confirms) console.log(`\nstatus: CVs and portfolio are up to date; ${warnings.length + shared.length + confirms} warning(s) above (SENT, SHARED, CONFIRM)`);
  else console.log("\nstatus: everything is up to date");
  // build:all skips job-specific CVs: name them.
  for (const t of tailored) console.log(`        job-specific CV: /tailor to rewrite it if entries are listed, then npm run build -- ${t}`);
}
