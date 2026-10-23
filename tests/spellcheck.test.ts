// Dictionary spell check (plan 9e P5, specs/cv-spec.md 4): CVs and the portfolio, with facts/dictionary.txt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { edit, run, tempRepo } from "./helpers.ts";

const CV = "cv/Kirill_Kohan_CV.md";

test("the repo's CVs spell-check clean", () => {
  const r = run("spellcheck.ts", tempRepo());
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 unknown word\(s\)/);
});

test("a typo and a UK spelling fail spellcheck and check; comments and URLs are ignored", () => {
  const dir = tempRepo();
  edit(dir, CV, "Fixed a **reverse tabnabbing** vulnerability", "Fixd a **reverse tabnabbing** vulnerabilty, with colour <!-- zzqx --> https://example.org/zzqy");
  const r = run("spellcheck.ts", dir, [CV]);
  assert.equal(r.code, 1, r.out);
  for (const w of ["Fixd", "vulnerabilty", "colour"]) assert.match(r.out, new RegExp(`unknown word "${w}"`));
  assert.doesNotMatch(r.out, /zzq/);
  const c = run("check.ts", dir);
  assert.equal(c.code, 1);
  assert.match(c.out, /unknown word "Fixd"/);
});

test("a word in facts/dictionary.txt is accepted", () => {
  const dir = tempRepo();
  edit(dir, CV, "Fixed a **reverse tabnabbing** vulnerability", "Fixed a **reverse tabnabbing** vulnerability in Zorbix");
  assert.equal(run("spellcheck.ts", dir, [CV]).code, 1);
  appendFileSync(join(dir, "facts/dictionary.txt"), "\nZorbix\n");
  const r = run("spellcheck.ts", dir, [CV]);
  assert.equal(r.code, 0, r.out);
  assert.ok(readFileSync(join(dir, "facts/dictionary.txt"), "utf8").includes("Zorbix"));
});
