// Test helpers: copy the repo's inputs into a temp folder and run a script there via CV_ROOT.
import { constants, cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

export const REPO = resolve(import.meta.dirname, "..");

// Every temp repo is removed when the test process ends: with sources/ (imported documents and their images)
// each copy is tens of MB, and a full run makes over a hundred of them.
const made: string[] = [];
process.on("exit", () => { for (const d of made) rmSync(d, { recursive: true, force: true }); });

export function tempRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "cv-test-"));
  made.push(dir);
  for (const p of ["framework.config.yaml", "facts", "summaries", "schemas", "markets", "specs", "cv", "templates", "profiles", "sources"]) {
    // Copy-on-write clones where the file system supports them (APFS), plain copies elsewhere.
    if (existsSync(join(REPO, p))) cpSync(join(REPO, p), join(dir, p), { recursive: true, mode: constants.COPYFILE_FICLONE });
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
