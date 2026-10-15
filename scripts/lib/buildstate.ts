// Build records (cv/.build-state.json, git-ignored): for each built CV, the hashes of its sources and
// outputs at build time. Used by `status` (what is stale and why), by `lint` (a variant edited by hand
// since its last build) and by the tailor agent (only entries whose sources changed are rewritten, R8).
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { loadConfig, loadConfirmed, loadSummaries, rootPath } from "./repo.ts";

export interface BuildRecord {
  built_at: string;
  template: string;
  md_sha: string; // the CV Markdown right after the build (refresh included)
  sources: Record<string, string>; // repo-relative path -> sha256
  outputs: Record<string, string>; // repo-relative path -> sha256 (docx, pdf, per market)
  entries?: Record<string, string>; // CV entry id -> hash of everything that entry is built from (R8, tailoring-spec 2.6)
  exporters?: Record<string, string>; // repo-relative PDF path -> exporter that built it
}
export type BuildState = Record<string, BuildRecord>; // key: repo-relative CV Markdown path

export const sha = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 16);
const rel = (p: string) => relative(rootPath(), p);

function statePath(): string {
  return rootPath(loadConfig().output.master_dir, ".build-state.json");
}

export function readState(): BuildState {
  const p = statePath();
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
}

export function writeRecord(cvFile: string, record: BuildRecord): void {
  const state = readState();
  state[rel(cvFile)] = record;
  writeFileSync(statePath(), JSON.stringify(state, null, 2) + "\n");
}

// Every input a CV is built from. Applications and per-laptop files are not sources.
export function sourceFiles(template: string, profileId?: string): string[] {
  const cfg = loadConfig();
  const files: string[] = [rootPath("framework.config.yaml")];
  const addDir = (dir: string, ext: string) => {
    const d = rootPath(dir);
    if (existsSync(d)) for (const f of readdirSync(d).sort()) if (f.endsWith(ext) && statSync(join(d, f)).isFile()) files.push(join(d, f));
  };
  addDir(cfg.paths.summaries, ".md");
  for (const f of ["profile.yaml", "confirmed.yaml", "skills.yaml"]) { // decisions.yaml only affects reviewers
    const p = rootPath(cfg.paths.facts, f);
    if (existsSync(p)) files.push(p);
  }
  addDir(cfg.paths.markets, ".yaml");
  for (const f of ["template.docx", "style-map.yaml", "fixes.yaml"]) {
    const p = rootPath(cfg.paths.templates, template, f);
    if (existsSync(p)) files.push(p);
  }
  if (profileId) {
    const p = rootPath(cfg.paths.profiles, `${profileId}.yaml`);
    if (existsSync(p)) files.push(p);
  }
  return files;
}

// Per-entry hashes: an entry's summary data (front matter, contributions, its facts, metrics) or, for a
// cv_entry defined in facts, that entry and its facts. The tailor agent rewrites only entries whose hash changed.
export function entryHashes(): Record<string, string> {
  const cfg = loadConfig();
  const out: Record<string, string> = {};
  const { facts, entries } = loadConfirmed(cfg);
  const h = (x: unknown) => createHash("sha256").update(JSON.stringify(x)).digest("hex").slice(0, 16);
  // Computed from the parsed data (not the digest files), so the result never depends on stale digests.
  for (const s of loadSummaries(cfg)) {
    const metrics = s.sections.find((x) => x.number === 7)?.text.trim() ?? "";
    out[s.id] = h([s.frontMatter, s.contributions, facts.filter((f) => f.entry === s.id), metrics]);
  }
  for (const e of entries) out[e.id] = h([e, facts.filter((f) => f.entry === e.id)]);
  return out;
}

export function hashSources(template: string, profileId?: string): Record<string, string> {
  return Object.fromEntries(sourceFiles(template, profileId).map((f) => [rel(f), sha(f)]));
}
