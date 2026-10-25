// Test helpers: copy the repo's inputs into a temp folder and run a script there via CV_ROOT.
import { constants, cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";

export const REPO = resolve(import.meta.dirname, "..");

// Every temp repo is removed when the test process ends: with sources/ (imported documents and their images)
// each copy is tens of MB, and a full run makes over a hundred of them.
const made: string[] = [];
process.on("exit", () => { for (const d of made) rmSync(d, { recursive: true, force: true }); });

// Your git-ignored personal files (job-specific CVs, sent PDFs, the application log) never reach a test copy: they
// would change what a test sees once you start applying. A test that needs one writes its own.
const PERSONAL = ["cv/tailored", "cv/sent", "facts/applications.yaml"];

// `from` is the repo to copy (the real one; a test of this filter passes its own).
export function tempRepo(from = REPO): string {
  const dir = mkdtempSync(join(tmpdir(), "cv-test-"));
  made.push(dir);
  for (const p of ["framework.config.yaml", "facts", "summaries", "schemas", "markets", "specs", "cv", "templates", "profiles", "sources", "portfolio/assets"]) {
    // Copy-on-write clones where the file system supports them (APFS), plain copies elsewhere.
    if (existsSync(join(from, p))) cpSync(join(from, p), join(dir, p), { recursive: true, mode: constants.COPYFILE_FICLONE, filter: (src) => !PERSONAL.some((x) => src === join(from, x)) });
  }
  return dir;
}

export function edit(dir: string, file: string, from: string | RegExp, to: string): void {
  const p = join(dir, file);
  const before = readFileSync(p, "utf8");
  const after = before.replace(from, to);
  if (after === before) throw new Error(`edit had no effect on ${file}: ${from}`);
  writeFileSync(p, after);
}

export function run(script: string, dir: string, args: string[] = []) {
  const r = spawnSync(process.execPath, ["--import", "tsx", join(REPO, "scripts", script), ...args], {
    env: { ...process.env, CV_ROOT: dir },
    encoding: "utf8",
  });
  return { code: r.status, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

// The master CV and its Ukraine copy, as paths inside a temp repo.
export const CV = "cv/Kirill_Kohan_CV.md";
export const UA = "cv/markets/ukraine/Kirill_Kohan_CV_UA.md";

// A temp repo with the master CV refreshed.
export function refreshed(): string {
  const dir = tempRepo();
  const r = run("refresh.ts", dir);
  assert.equal(r.code, 0, r.out);
  return dir;
}

// Portable harvest: a copy of the velas-wallet summary under another id, as a file to import (optionally changed).
export const sample = (dir: string, id: string, change: (t: string) => string = (t) => t) => {
  const text = readFileSync(join(dir, "summaries/velas-wallet.md"), "utf8").replace(/^id: .*$/m, `id: ${id}`);
  const f = join(dir, `${id}-incoming.md`);
  writeFileSync(f, change(text));
  return f;
};

// Options for a slow test that drives Pages, LibreOffice or a full backup zip: `npm run test:fast` (CV_FAST=1) skips it.
export function slow(options: { skip?: string | false; timeout?: number } = {}) {
  return { ...options, skip: options.skip || (process.env.CV_FAST ? "fast mode (npm run test:fast)" : false) };
}
