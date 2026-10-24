// npm run review-context: one bundle per CV and rubric for the reviewer (agents/reviewer.md step 1).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { run, tempRepo } from "./helpers.ts";

const bundle = (dir: string, out: string) => {
  const path = out.match(/review-context: (\S+\.md)/)?.[1];
  assert.ok(path, out);
  return readFileSync(join(dir, path), "utf8");
};

test("master CV + ats: the CV, the market header settings, and only the relevant decisions (the rest by id)", () => {
  const dir = tempRepo();
  const r = run("review-context.ts", dir, ["cv/Kirill_Kohan_CV.md", "ats"]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /\.cv-runs\/review-context\/kirill_kohan_cv-ats\.md \([\d.]+ KB/);
  const b = bundle(dir, r.out);
  assert.match(b, /# Rubric: AI ATS screener/);
  assert.match(b, /schema_version: 1\nrubric: ats/); // report format
  assert.match(b, /^\s+\d+\| # \*\*EXPERIENCE\*\*$/m); // the CV, with line numbers
  assert.doesNotMatch(b, /<!-- src:/); // ats doesn't need sources
  assert.match(b, /Market settings \(`markets\/worldwide\.yaml`\)[\s\S]*show_phone: true/);
  assert.match(b, /cv\/pdf-check\.md/);
  const cvLines = b.split("\n").filter((l) => /^\s+\d+\| /.test(l)).map((l) => l.replace(/^\s+\d+\| /, ""));
  assert.ok(cvLines.length > 50 && !cvLines.some((l) => /\S {2,}\S/.test(l))); // removed comments leave no double spaces

  const all: { id: string }[] = parse(readFileSync(join(dir, "facts/decisions.yaml"), "utf8")).decisions;
  const listed = [...b.matchAll(/^- \*\*([\w-]+)\*\* \(/gm)].map((m) => m[1]);
  const rest = b.match(/^Not relevant here: (.+?) \(open/m)?.[1].split(", ") ?? [];
  assert.ok(listed.length > 0 && listed.length < all.length, `${listed.length} of ${all.length}`);
  assert.deepEqual([...listed, ...rest].sort(), all.map((d) => d.id).sort()); // every decision is either shown or listed
  assert.ok(listed.includes("keep-length")); // its topic is length
  assert.ok(rest.includes("portfolio-wink-mockups")); // a portfolio decision, not for the CV
});

test("fact-check bundle keeps the src comments and holds the digests and cited facts", () => {
  const dir = tempRepo();
  run("validate.ts", dir); // writes the digests (git-ignored)
  const r = run("review-context.ts", dir, ["cv/Kirill_Kohan_CV.md", "fact-check"]);
  assert.equal(r.code, 0, r.out);
  const b = bundle(dir, r.out);
  assert.match(b, /<!-- src: syspro-saas-erp#4\.1/);
  assert.match(b, /### `summaries\/\.digests\/syspro-saas-erp\.yaml`[\s\S]*contributions_cited:/);
  assert.match(b, /Confirmed facts cited[\s\S]*id: syspro-team-size/);
  assert.match(b, /Full summaries: [^\n]*`summaries\/syspro-saas-erp\.md`/);
});

test("an unknown rubric, or ats on the portfolio, is a one-line error (exit 2)", () => {
  const dir = tempRepo();
  const r = run("review-context.ts", dir, ["cv/Kirill_Kohan_CV.md", "spelling"]);
  assert.equal(r.code, 2);
  assert.equal(r.out.trim(), 'review-context: unknown rubric "spelling" (one of: ats, hr, proofreading, fact-check, confidentiality, layout)');
  const p = run("review-context.ts", dir, ["--portfolio", "ats"]);
  assert.equal(p.code, 2);
  assert.match(p.out.trim(), /^review-context: rubric "ats" doesn't apply to the portfolio/);
});
