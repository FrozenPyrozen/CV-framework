// npm run doc-check: deterministic drift check between the docs and the code and config.
import { test } from "node:test";
import assert from "node:assert/strict";
import { constants, cpSync, existsSync } from "node:fs";
import { join } from "node:path";
import { edit, REPO, run, tempRepo } from "./helpers.ts";

// A temp repo with everything doc-check reads: the docs, the scripts they describe and the paths they name.
function docRepo(): string {
  const dir = tempRepo();
  for (const p of ["AGENTS.md", "CLAUDE.md", "README.md", "package.json", "docs", "agents", ".claude", "scripts", "tests"]) {
    if (existsSync(join(REPO, p))) cpSync(join(REPO, p), join(dir, p), { recursive: true, mode: constants.COPYFILE_FICLONE });
  }
  return dir;
}

test("the real repo has no doc drift (run npm run doc-check)", () => {
  const r = run("doc-check.ts", REPO);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /doc-check: \d+ file\(s\), 0 error\(s\)/);
});

test("a clean copy passes with 0 errors", () => {
  const r = run("doc-check.ts", docRepo());
  assert.equal(r.code, 0, r.out);
});

test("a number copied next to a config key must equal the config value", () => {
  const dir = docRepo();
  edit(dir, "specs/outputs/portfolio.md", "`checks.portfolio_max_project_words`", "`checks.portfolio_max_project_words` (300)");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR  specs\/outputs\/portfolio\.md:\d+: `checks\.portfolio_max_project_words` is 420 in framework\.config\.yaml, but the text says 300/);
});

test("an unknown config key is an error; an optional key from the schema passes", () => {
  const dir = docRepo();
  edit(dir, "specs/cv-spec.md", "`checks.max_pages`", "`checks.max_pagez`");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR  specs\/cv-spec\.md:\d+: `checks\.max_pagez` is not in framework\.config\.yaml/);
  assert.doesNotMatch(r.out, /portfolio\.name/); // optional, in schemas/config.schema.json
});

test("a missing repo path is an error; placeholders and generated outputs are skipped", () => {
  const dir = docRepo();
  edit(dir, "docs/workflows.md", /^/, "See `specs/no-such-spec.md`, `summaries/<id>.md`, `cv/variants/react/cv.md` and `facts/applications.yaml`.\n\n");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR  docs\/workflows\.md:1: `specs\/no-such-spec\.md` doesn't exist/);
  assert.equal((r.out.match(/^ERROR/gm) ?? []).length, 1, r.out);
});

test("an unknown npm script is an error, in any doc and as a scripts.md row", () => {
  const dir = docRepo();
  edit(dir, "agents/composer.md", /^/, "Run `npm run no-such-script` first.\n");
  edit(dir, "docs/scripts.md", /^\| `typecheck` \|/m, "| `bogus [--x]` | nothing |\n| `typecheck` |");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR  agents\/composer\.md:1: npm run no-such-script: no such script in package\.json/);
  assert.match(r.out, /ERROR  docs\/scripts\.md:\d+: row "bogus": no such script in package\.json/);
});

test("a package.json script without a row is an error", () => {
  const dir = docRepo();
  edit(dir, "docs/scripts.md", /^\| `typecheck` \|.*\n/m, "");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR  docs\/scripts\.md: npm script "typecheck" has no row/);
});

test("a flag the script doesn't handle is an error; a parsed flag the row omits is a warning", () => {
  const dir = docRepo();
  edit(dir, "docs/scripts.md", "`trace [file] [--warn-only]`", "`trace [file] [--strict]`");
  edit(dir, "docs/scripts.md", "`preview <file.pdf> [--out <dir>] [--scale <n>]`", "`preview <file.pdf> [--out <dir>]`");
  edit(dir, "docs/scripts.md", "rendered at `--scale` (default 1.5)", "rendered at a fixed scale");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR  docs\/scripts\.md:\d+: trace: --strict is listed but scripts\/trace\.ts doesn't handle it/);
  assert.match(r.out, /warn   docs\/scripts\.md:\d+: preview: scripts\/preview\.ts parses --scale, which its row doesn't mention/);
  assert.doesNotMatch(r.out, /warn-only/); // still mentioned in the row's description
});

test("a section reference must point to a numbered heading", () => {
  const dir = docRepo();
  edit(dir, "agents/tailor.md", /^/, "Scoring is in `specs/tailoring-spec.md` 42 and cv-spec.md section 4.9.\n");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /ERROR  agents\/tailor\.md:1: specs\/tailoring-spec\.md has no section 42/);
  assert.match(r.out, /ERROR  agents\/tailor\.md:1: specs\/cv-spec\.md has no section 4\.9/);
});

test("an unknown snake_case field name is a warning only", () => {
  const dir = docRepo();
  edit(dir, "docs/workflows.md", /^/, "The `portfolio_titel` field sets the title.\n");
  const r = run("doc-check.ts", dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /warn   docs\/workflows\.md:1: field `portfolio_titel` is not a property in any schemas\/\*\.json/);
});
