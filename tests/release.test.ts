// npm run release: the accepted and shared PDFs in facts/releases.yaml, and status saying when their text changed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { CV, edit, run, tempRepo } from "./helpers.ts";
import { sha } from "../scripts/lib/buildstate.ts";

const sh = (dir: string, ...args: string[]) => spawnSync("git", args, { cwd: dir, encoding: "utf8" });

test("release refuses without a commit, records the master CV's PDF, and status reports a text change", () => {
  const dir = tempRepo();
  assert.equal(run("build.ts", dir, [CV, "--no-pdf", "--entries-reviewed"]).code, 0);
  // A built PDF without an exporter: a fake one, recorded as the build's output.
  const pdf = "cv/Kirill_Kohan_CV.pdf";
  writeFileSync(join(dir, pdf), "%PDF-1.4 fake");
  const statePath = join(dir, "cv/.build-state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  state[CV].outputs[pdf] = sha(join(dir, pdf));
  writeFileSync(statePath, JSON.stringify(state, null, 2));

  const noGit = run("release.ts", dir);
  assert.equal(noGit.code, 1, noGit.out);
  assert.match(noGit.out, /not a git repository/);

  writeFileSync(join(dir, ".gitignore"), "cv/*.pdf\ncv/*.docx\ncv/.build-state.json\ncv/preview/\ncv/markets/*/*.pdf\ncv/markets/*/*.docx\ncv/markets/*/preview/\nsources/files/\n");
  for (const a of [["init", "-q"], ["config", "user.email", "t@t"], ["config", "user.name", "t"], ["add", "-A"], ["commit", "-qm", "base"]]) sh(dir, ...a);
  const ok = run("release.ts", dir, ["--note", "Drive upload"]);
  assert.equal(ok.code, 0, ok.out);
  const y = readFileSync(join(dir, "facts/releases.yaml"), "utf8");
  assert.match(y, /note: Drive upload/);
  assert.match(y, /path: cv\/Kirill_Kohan_CV\.pdf\n\s+sha256: "?[0-9a-f]{16}"?\n\s+source: cv\/Kirill_Kohan_CV\.md/);
  assert.match(y, /commit: "?[0-9a-f]{7,}"?\n/); // an all-digit id is quoted, so it stays a string
  assert.doesNotMatch(run("status.ts", dir).out, /SHARED/);

  // New text in the master CV: status says the shared copy is old; release refuses until it's rebuilt and committed.
  edit(dir, CV, "# **SUMMARY**", "# **SUMMARY**\n\nOne more line.");
  assert.match(run("status.ts", dir).out, /SHARED text changed since the release of \d{4}-\d{2}-\d{2}: cv\/Kirill_Kohan_CV\.pdf/);
  const stale = run("release.ts", dir);
  assert.equal(stale.code, 1, stale.out);
  assert.match(stale.out, /Kirill_Kohan_CV\.md is stale.*uncommitted changes/);
});
