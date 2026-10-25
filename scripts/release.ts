// npm run release [--note "<text>"]
// Records the CV and portfolio PDFs you accepted and shared (e.g. uploaded to the Drive link) in facts/releases.yaml
// (specs/facts-spec.md 6): date, git commit, and for each PDF its hash, the Markdown it was built from and that file's
// hash. Refuses when the master CV or the portfolio is out of date, or tracked files have uncommitted changes (the
// commit must name the sources). `status` then says when a released PDF's text changed and should be shared again.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { parse as parseYaml, stringify } from "yaml";
import { readState, sha } from "./lib/buildstate.ts";
import { masterCvPath } from "./lib/paths.ts";
import { isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";
import { portfolioStatus } from "./portfolio.ts";
import { cvStatuses } from "./status.ts";

export interface ReleasedFile { path: string; sha256: string; source: string; source_sha256: string; exporter?: string | null }
export interface Release { date: string; commit: string; note?: string; files: ReleasedFile[] }

export const releasesFile = () => rootPath(loadConfig().paths.facts, "releases.yaml");

export function readReleases(): Release[] {
  const f = releasesFile();
  return existsSync(f) ? ((parseYaml(readFileSync(f, "utf8")) as { releases?: Release[] })?.releases ?? []) : [];
}

const rel = (p: string) => relative(rootPath(), p);
const git = (...args: string[]) => execFileSync("git", ["-C", rootPath(), ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

// The shared PDFs: the master CV in every market (its build outputs) and the portfolio in every page size.
function sharedPdfs(): { pdf: string; source: string }[] {
  const master = rel(masterCvPath());
  const out = Object.keys(readState()[master]?.outputs ?? {}).filter((p) => p.endsWith(".pdf")).sort()
    .map((pdf) => { const md = join(dirname(pdf), `${basename(pdf, ".pdf")}.md`); return { pdf, source: existsSync(rootPath(md)) ? md : master }; });
  const pdir = rootPath("portfolio");
  if (existsSync(pdir)) for (const f of readdirSync(pdir).filter((x) => x.endsWith(".pdf")).sort()) out.push({ pdf: `portfolio/${f}`, source: "portfolio/portfolio.md" });
  return out;
}

export function release(note?: string): Release {
  const problems: string[] = [];
  const master = cvStatuses().find((s) => s.cv === rel(masterCvPath()));
  if (master?.state !== "up to date") problems.push(`${rel(masterCvPath())} is ${master?.state ?? "missing"}: npm run status`);
  const ps = portfolioStatus();
  if (ps.exists && (ps.generatedStale || ps.notInFile.length || ps.toWrite.length || ps.toRewrite.length || ps.builtOutdated || ps.neverChecked || ps.changedSinceCheck)) problems.push("the portfolio is out of date: npm run status");
  let commit = "";
  try {
    if (git("status", "--porcelain", "--untracked-files=no")) problems.push("tracked files have uncommitted changes: commit first, so the release names its sources");
    commit = git("rev-parse", "--short", "HEAD");
  } catch { problems.push("not a git repository"); }
  const pdfs = sharedPdfs();
  if (!pdfs.some((p) => !p.pdf.startsWith("portfolio/"))) problems.push("the master CV has no PDF: npm run build");
  if (problems.length) throw new Error(problems.join("; "));

  const state = readState();
  const files: ReleasedFile[] = pdfs.map(({ pdf, source }) => ({
    path: pdf,
    sha256: sha(rootPath(pdf)),
    source,
    source_sha256: sha(rootPath(source)),
    exporter: Object.values(state).map((r) => r.exporters?.[pdf]).find(Boolean) ?? null,
  }));
  const r: Release = { date: new Date().toISOString().slice(0, 10), commit, ...(note ? { note } : {}), files };
  const header = "# Accepted and shared CV and portfolio versions (specs/facts-spec.md 6). Written by npm run release; newest last.\n";
  writeFileSync(releasesFile(), header + stringify({ schema_version: 1, releases: [...readReleases(), r] }));
  return r;
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  try {
    const r = release(typeof args.note === "string" ? args.note : undefined);
    console.log(`release: recorded ${r.files.length} PDF(s) at ${r.commit} on ${r.date} in ${rel(releasesFile())}:`);
    for (const f of r.files) console.log(`  ${f.path}`);
    console.log("Commit facts/releases.yaml; `npm run status` says when a released PDF's text changes.");
  } catch (e) {
    console.error(`release: ${(e as Error).message}`);
    process.exit(1);
  }
}
