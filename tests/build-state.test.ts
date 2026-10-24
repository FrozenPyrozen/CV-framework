// build state: sent CVs, per-entry hashes and what makes status stale (split from the build tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { CV, edit, REPO, run, tempRepo } from "./helpers.ts";

test("status warns once about a sent CV that changed, until acknowledged", () => {
  const dir = tempRepo();
  run("build.ts", dir, ["--no-pdf"]);
  writeFileSync(join(dir, "facts/applications.yaml"), '- company: Acme\n  role: Senior RN\n  date: 2026-10-20\n  pdf: cv/Kirill_Kohan_CV.docx\n  pdf_sha256: "0000000000000000"\n  status: applied\n- company: Beta\n  pdf: cv/Kirill_Kohan_CV.docx\n  pdf_sha256: 0000000000000000\n');
  assert.match(run("status.ts", dir).out, /SENT\s+Acme \(Senior RN\) received an older version/);
  run("status.ts", dir, ["--ack", "Acme"]);
  const after = run("status.ts", dir).out;
  assert.doesNotMatch(after, /SENT\s+Acme/);
  assert.match(after, /SENT\s+Beta: quote pdf_sha256/);
});

test("build records per-entry hashes; status names only the entries that changed", () => {
  const dir = tempRepo();
  run("build.ts", dir, ["cv/Kirill_Kohan_CV.md", "--no-pdf", "--entries-reviewed"]); // a clean record, whatever the live repo has pending
  const state = JSON.parse(readFileSync(join(dir, "cv/.build-state.json"), "utf8"));
  assert.ok(state["cv/Kirill_Kohan_CV.md"].entries["various-clients"]);
  edit(dir, "facts/confirmed.yaml", "giving technical consulting and educational webinars.", "giving technical consulting, workshops and educational webinars.");
  edit(dir, "summaries/designai-jira-plugin.md", /^cv_order: \d+$/m, "cv_order: 9"); // moves the entry; its text needs no rewrite
  const st = run("status.ts", dir).out;
  assert.match(st, /entries to update: various-clients$/m); // the master CV (composer); not designai-jira-plugin
  assert.match(st, /run \/compose for the master CV and \/variants for role variants first/);
  edit(dir, "summaries/designai-jira-plugin.md", /^cv_order: 9$/m, "cv_order: 4"); // back, so the builds below pass lint's order check
  edit(dir, "facts/decisions.yaml", "decision: Keep the master CV's current length", "decision: Keep the master CV's present length");
  assert.doesNotMatch(run("status.ts", dir).out, /decisions\.yaml/);
  // A rebuild without rewriting the CV keeps the entry listed; --entries-reviewed (or an edited CV) clears it.
  run("build.ts", dir, ["--no-pdf"]);
  assert.match(run("status.ts", dir).out, /entries to update: various-clients$/m);
  run("build.ts", dir, ["--no-pdf", "--entries-reviewed"]);
  assert.doesNotMatch(run("status.ts", dir).out, /entries to update/);
});

test("build --no-pdf removes an outdated PDF so status and log-application never use it", () => {
  const dir = tempRepo();
  writeFileSync(join(dir, "cv/Kirill_Kohan_CV.pdf"), "%PDF-1.4 old");
  const r = run("build.ts", dir, ["--no-pdf"]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /removed the outdated PDF/);
  assert.ok(!existsSync(join(dir, "cv/Kirill_Kohan_CV.pdf")));
});

test("portfolio-only summary fields don't make CV entries stale", () => {
  const dir = tempRepo();
  const before = spawnHashes(dir);
  edit(dir, "summaries/velas-wallet.md", /^portfolio_title: .*$/m, 'portfolio_title: "Another title"');
  assert.equal(spawnHashes(dir)["velas-wallet"], before["velas-wallet"]);
  edit(dir, "summaries/velas-wallet.md", "role: Technical Leader", "role: Technical Lead");
  assert.notEqual(spawnHashes(dir)["velas-wallet"], before["velas-wallet"]);
});

function spawnHashes(dir: string): Record<string, string> {
  const r = spawnSync(process.execPath, ["--import", "tsx", "-e", "import('./scripts/lib/buildstate.ts').then(m => console.log(JSON.stringify(m.entryHashes())))"], { cwd: REPO, env: { ...process.env, CV_ROOT: dir }, encoding: "utf8" });
  return JSON.parse(r.stdout.trim().split("\n").pop()!);
}
