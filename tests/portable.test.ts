// Portable harvest (specs/work-summary-spec.md 9, plan 9c): harvest-prompt and import-summary.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { run, sample, tempRepo } from "./helpers.ts";

test("harvest-prompt holds the spec, tags and identities, but no other summaries", () => {
  const dir = tempRepo();
  const out = join(dir, "prompt.md");
  const r = run("harvest-prompt.ts", dir, ["--out", out]);
  assert.equal(r.code, 0, r.out);
  const p = readFileSync(out, "utf8");
  assert.match(p, /# Work Summary Spec/);
  assert.match(p, /harvest_mode: portable/);
  assert.match(p, /react/);
  assert.doesNotMatch(p, /Existing summary to extend/);
  assert.doesNotMatch(p, /### 4\.1 /);
  // Git commands: branches and remotes only (no stash entries), identities as a shell array.
  assert.doesNotMatch(p, /git (log|shortlog)[^\n]*--all/);
  assert.match(p, /git log --branches --remotes --tags --no-merges/); // tags too, as git-digest
  assert.doesNotMatch(p, /--tags --tags/);
  assert.match(p, /^ME=\(--author="[^"]+"/m);
  assert.match(p, /--no-merges "\$\{ME\[@\]\}"/);
});

test("harvest-prompt --merge includes the existing summary; an unknown id fails", () => {
  const dir = tempRepo();
  const out = join(dir, "prompt.md");
  assert.equal(run("harvest-prompt.ts", dir, ["--merge", "velas-wallet", "--out", out]).code, 0);
  assert.match(readFileSync(out, "utf8"), /Existing summary to extend[\s\S]*id: velas-wallet/);
  const bad = run("harvest-prompt.ts", dir, ["--merge", "no-such-job", "--out", out]);
  assert.notEqual(bad.code, 0);
  assert.match(bad.out, /no summary "no-such-job"/);
});

test("import-summary checks without touching summaries/, and --apply adds a new summary", () => {
  const dir = tempRepo();
  const f = sample(dir, "acme-portal");
  const before = readdirSync(join(dir, "summaries")).length;
  const r = run("import-summary.ts", dir, [f]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /a new summary/);
  assert.equal(readdirSync(join(dir, "summaries")).length, before);
  assert.equal(run("import-summary.ts", dir, [f, "--apply"]).code, 0);
  assert.ok(existsSync(join(dir, "summaries/acme-portal.md")));
  assert.equal(run("validate.ts", dir).code, 0);
});

test("import-summary sends an existing id to .cv-runs/import for the merge", () => {
  const dir = tempRepo();
  const f = sample(dir, "velas-wallet");
  const r = run("import-summary.ts", dir, [f, "--apply"]);
  assert.equal(r.code, 0, r.out);
  assert.ok(existsSync(join(dir, ".cv-runs/import/velas-wallet.md")));
});

test("proposed tags are reported and stripped on apply", () => {
  const dir = tempRepo();
  const f = sample(dir, "acme-portal", (t) => t.replace(/\n---\n/, "\n---\n<!-- proposed-tags: htmx -->\n"));
  const r = run("import-summary.ts", dir, [f, "--apply"]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /proposed new tags.*htmx/);
  assert.doesNotMatch(readFileSync(join(dir, "summaries/acme-portal.md"), "utf8"), /proposed-tags/);
});

test("harvest-prompt refuses to carry another summary's confidential term, except the one being extended", () => {
  const dir = tempRepo();
  const out = join(dir, "prompt.md");
  const sec9 = (t: string) => t.replace("## 9. Confidentiality notes\n", "## 9. Confidentiality notes\n\n- term: Zebracorn Suite\n");
  writeFileSync(join(dir, "summaries/velas-wallet.md"), sec9(readFileSync(join(dir, "summaries/velas-wallet.md"), "utf8")));
  writeFileSync(join(dir, "specs/work-summary-spec.md"), readFileSync(join(dir, "specs/work-summary-spec.md"), "utf8") + "\nExample: Zebracorn Suite.\n");
  const r = run("harvest-prompt.ts", dir, ["--out", out]);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /confidential names.*"Zebracorn Suite" \(velas-wallet\)/);
  assert.equal(run("harvest-prompt.ts", dir, ["--merge", "velas-wallet", "--out", out]).code, 0);
});

test("harvest-prompt --merge allows a term the extended summary also lists; import-summary finds portfolio images", () => {
  const dir = tempRepo();
  const out = join(dir, "prompt.md");
  const sec9 = (t: string) => t.replace("## 9. Confidentiality notes\n", "## 9. Confidentiality notes\n\n- term: Zebracorn Suite\n");
  for (const id of ["velas-wallet", "omo-systems-smart-home"]) writeFileSync(join(dir, `summaries/${id}.md`), sec9(readFileSync(join(dir, `summaries/${id}.md`), "utf8")));
  const r = run("harvest-prompt.ts", dir, ["--merge", "velas-wallet", "--out", out]);
  assert.equal(r.code, 0, r.out); // the term is in velas-wallet's prompt and shared with omo-systems-smart-home
  // A summary that links portfolio/assets images passes the check (the check copies the repo with them).
  const s = sample(dir, "syspro-saas-erp");
  const c = run("import-summary.ts", dir, [s]);
  assert.equal(c.code, 0, c.out);
  assert.doesNotMatch(c.out, /no such file|doesn't exist|not found/i);
});
