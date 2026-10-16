// Test helpers: copy the repo's inputs into a temp folder and run a script there via CV_ROOT.
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

export const REPO = resolve(import.meta.dirname, "..");

export function tempRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), "cv-test-"));
  for (const p of ["framework.config.yaml", "facts", "summaries", "schemas", "markets", "specs", "cv", "templates", "profiles"]) {
    cpSync(join(REPO, p), join(dir, p), { recursive: true });
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
