import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { edit, run, tempRepo } from "./helpers.ts";
import { parseSummary } from "../scripts/lib/repo.ts";

test("the real repo validates and writes one digest per summary", () => {
  const dir = tempRepo();
  const r = run("validate.ts", dir);
  assert.equal(r.code, 0, r.out);
  assert.ok(existsSync(join(dir, "summaries/.digests/syspro-saas-erp.yaml")));
});

const broken: [string, (d: string) => void, RegExp][] = [
  ["unknown tag in a contribution", (d) => edit(d, "summaries/velas-wallet.md", /^Tags: /m, "Tags: not-a-real-tag, "), /tag "not-a-real-tag" is not in the config tag list/],
  ["contribution numbering gap", (d) => edit(d, "summaries/admasters-ecommerce.md", "### 4.2 ", "### 4.7 "), /numbered 4\.1, 4\.2 \.\.\. without gaps/],
  ["missing body section", (d) => edit(d, "summaries/itjet-fintech.md", "## 8. Portfolio material", "## 8. Portfolio"), /sections must be exactly/],
  ["role with (Contract) in it", (d) => edit(d, "summaries/omo-systems-smart-home.md", /^role: (.*)$/m, "role: $1 (Contract)"), /\/role must NOT be valid/],
  ["fact pointing to a missing entry", (d) => edit(d, "facts/confirmed.yaml", "entry: syspro-saas-erp\n    tags: [scale", "entry: no-such-job\n    tags: [scale"), /entry "no-such-job" is neither/],
  ["market adding an engagement type the profile lacks", (d) => edit(d, "markets/ukraine.yaml", "show_availability: false", "show_availability: false\n  engagement_types: [part-time]"), /isn't in profile\.yaml work\.engagement_types/],
  ["two default markets", (d) => edit(d, "markets/ukraine.yaml", "default: false", "default: true"), /exactly one market must have default: true/],
  ["phone not in international format", (d) => edit(d, "facts/profile.yaml", '"+380 97 891 9783"', '"097 891 9783"'), /\/contacts\/phone must match pattern/],
  ["unknown cv_section", (d) => edit(d, "summaries/velas-wallet.md", "cv_section: experience", "cv_section: hobbies"), /cv_section "hobbies" is not in cv_sections/],
  ["duplicate id across files", (d) => edit(d, "facts/confirmed.yaml", "- id: consulting-sme", "- id: velas-wallet"), /id "velas-wallet" is already used/],
];

for (const [name, breakIt, expected] of broken) {
  test(`validate catches: ${name}`, () => {
    const dir = tempRepo();
    breakIt(dir);
    const r = run("validate.ts", dir);
    assert.equal(r.code, 1, `expected failure, got:\n${r.out}`);
    assert.match(r.out, expected);
  });
}

test("parseSummary reads contributions, removed items, tags and confidentiality rules", () => {
  const s = parseSummary(`---
id: x
---
## 4. My contributions

### 4.1 First thing
Did it.

Result: it worked.
Tags: react, testing

### 4.2 Old thing (removed)
Not shown anymore.

## 9. Confidentiality notes

- term: Secret Project
  allow_in: [generic]
- prefix: ABC-   # tickets
- url_pattern: "*.internal"
`);
  assert.deepEqual(s.contributions.map((c) => [c.number, c.title, c.removed, c.result, c.tags]), [
    ["4.1", "First thing", false, "it worked.", ["react", "testing"]],
    ["4.2", "Old thing", true, undefined, []],
  ]);
  assert.deepEqual(s.confidentiality, [
    { term: "Secret Project", allow_in: ["generic"] },
    { prefix: "ABC-" },
    { url_pattern: "*.internal" },
  ]);
});

test("validate enforces source-dependent rules", () => {
  const dir = tempRepo();
  edit(dir, "summaries/velas-wallet.md", "harvested_at: null", 'harvested_at: "2026-01-01"');
  const r = run("validate.ts", dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /harvested_at must be null for source: cv/);
});

test("validate rejects a contract suffix on a full-time job", () => {
  const dir = tempRepo();
  edit(dir, "summaries/velas-wallet.md", "cv_section: experience", 'cv_section: experience\ncv_title_suffix: " (Contract)"');
  const r = run("validate.ts", dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /cv_title_suffix says contract but engagement is "full-time"/);
});

test("validate checks the config against its schema", () => {
  const dir = tempRepo();
  edit(dir, "framework.config.yaml", "spelling: en-US", "spelling: klingon");
  const r = run("validate.ts", dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /framework\.config\.yaml: \/spelling must be equal to one of the allowed values/);
});

test("validate checks templates (style map, fixes) and role profile tags", () => {
  const dir = tempRepo();
  edit(dir, "templates/classic/fixes.yaml", "keep_with_next: [section_heading,", "keep_with_next: [no_such_type, section_heading,");
  edit(dir, "templates/classic/style-map.yaml", "approved: true", "approved: maybe");
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/rn.yaml"), "id: rn\nemphasize_tags: [react-nativ]\n");
  const r = run("validate.ts", dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /paragraph type "no_such_type" isn't in the template's style map/);
  assert.match(r.out, /templates\/classic\/style-map\.yaml: \/approved must be boolean/);
  assert.match(r.out, /profiles\/rn\.yaml: emphasize_tags: tag "react-nativ" is not in the config tag list/);
});

test("summaries store repo names only: a remote URL is rejected", () => {
  const dir = tempRepo();
  edit(dir, "summaries/syspro-saas-erp.md", "  - { name: saas-frontend-repo }", "  - { name: saas-frontend-repo, remote: git@example.com:org/repo.git }");
  const r = run("validate.ts", dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /\/repos\/0 must NOT have additional properties \(remote\)/);
});

test("summaries store repo names only: a URL or local path as the name is rejected", () => {
  for (const name of ["git@example.com:org/repo.git", "~/Desktop/Work/saas-frontend-repo"]) {
    const dir = tempRepo();
    edit(dir, "summaries/syspro-saas-erp.md", "  - { name: saas-frontend-repo }", `  - { name: "${name}" }`);
    const r = run("validate.ts", dir);
    assert.equal(r.code, 1, name);
    assert.match(r.out, /\/repos\/0\/name must NOT be valid/);
  }
});
