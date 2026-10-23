// Markdown tools: select and the profile and job-ad checks in validate (split from the Markdown tools tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CV, edit, refreshed, run, tempRepo } from "./helpers.ts";

test("select scores by tags, applies limits, pins and drops", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/test-rn.yaml"), [
    "id: test-rn",
    "emphasize_tags: [react-native, android]",
    "deemphasize_tags: [kendo]",
    "summary_focus: [testing]",
    "max_bullets_per_entry: 3",
    "min_bullets_per_entry: 2",
    "overrides:",
    "  velas-wallet#4.5: { pin: true }",
    "  orion-mobile-clinical-ink#4.1: { drop: true }",
    "  itjet-fintech#4.7: { pin: true }",
    "  itjet-fintech#4.1: { pin: true }",
  ].join("\n"));
  const r = run("select.ts", dir, ["cv/variants/test-rn", "--profile", "test-rn"]);
  assert.equal(r.code, 0, r.out);
  const sel = JSON.parse(readFileSync(join(dir, "cv/variants/test-rn/selection.json"), "utf8"));
  const byId = (id: string) => sel.entries.find((e: any) => e.id === id).bullets.map((b: any) => b.src);
  for (const e of sel.entries) assert.ok(e.bullets.length >= 2 && e.bullets.length <= 3, `${e.id}: ${e.bullets.length}`);
  assert.equal(byId("velas-wallet")[0], "velas-wallet#4.5"); // pinned first
  assert.deepEqual(byId("itjet-fintech").slice(0, 2), ["itjet-fintech#4.7", "itjet-fintech#4.1"]); // pins keep the overrides order
  assert.ok(!byId("orion-mobile-clinical-ink").includes("orion-mobile-clinical-ink#4.1")); // dropped
  // Orion with 4.1 dropped: 4.3 (react-native+android = 4) and 4.6 (4) beat 4.2 (react-native+testing = 3);
  // 4.4 and 4.5 (android only = 2) don't make the limit of 3. Ties keep the summary's order.
  assert.deepEqual(byId("orion-mobile-clinical-ink"), ["orion-mobile-clinical-ink#4.3", "orion-mobile-clinical-ink#4.6", "orion-mobile-clinical-ink#4.2"]);
  // Deterministic: same input, same output.
  run("select.ts", dir, ["cv/variants/test-rn", "--profile", "test-rn"]);
  const again = JSON.parse(readFileSync(join(dir, "cv/variants/test-rn/selection.json"), "utf8"));
  assert.deepEqual(again.entries, sel.entries);
});

test("select reads --tags from the CV folder", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: react-native\nrequired: [react-native]\nnice_to_have: [graphql]\n");
  const r = run("select.ts", dir, ["cv/tailored/acme", "--tags", "jd-tags.yaml"]);
  assert.equal(r.code, 0, r.out);
  // Outside cv/variants/ and cv/tailored/, select refuses (no stray folders from typos).
  assert.match(run("select.ts", dir, ["cv/acme-typo", "--profile", "react"]).out, /is not under cv\/variants\/ or cv\/tailored\//);
});

test("validate warns about a skill nothing supports", () => {
  const dir = tempRepo();
  edit(dir, "facts/skills.yaml", "      - { name: TypeScript, tags: [typescript] }", "      - { name: TypeScript, tags: [typescript] }\n      - { name: Haskell, tags: [testing-unused-xyz] }");
  edit(dir, "framework.config.yaml", "  - typescript\n", "  - typescript\n  - testing-unused-xyz\n");
  const r = run("validate.ts", dir);
  assert.match(r.out, /skill "Haskell" isn't supported/);
});

test("select: entry_max_bullets sets one entry's limit; a pinned Stack line is listed apart and doesn't count", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/t.yaml"), [
    "schema_version: 1", "id: t", "headline: Test", "summary_focus: [react]", "emphasize_tags: [react, typescript, testing]", "skills_order: [frontend]",
    "max_bullets_per_entry: 2", "min_bullets_per_entry: 1",
    "entry_max_bullets:", "  syspro-saas-erp: 4",
    "overrides:", "  general-motors-navigation#5: { pin: true }",
  ].join("\n"));
  assert.equal(run("validate.ts", dir).code, 0);
  const r = run("select.ts", dir, ["cv/variants/t", "--profile", "t"]);
  assert.equal(r.code, 0, r.out);
  const sel = JSON.parse(readFileSync(join(dir, "cv/variants/t/selection.json"), "utf8"));
  const e = (id: string) => sel.entries.find((x: any) => x.id === id);
  assert.equal(e("syspro-saas-erp").bullets.length, 4);
  assert.ok(e("velas-wallet").bullets.length <= 2);
  assert.equal(e("general-motors-navigation").stack, "general-motors-navigation#5");
  assert.ok(e("general-motors-navigation").bullets.length <= 2);
  assert.equal(e("velas-wallet").stack, undefined);
  // A Stack override with text, or an unknown entry limit, is rejected.
  writeFileSync(join(dir, "profiles/t.yaml"), readFileSync(join(dir, "profiles/t.yaml"), "utf8")
    .replace("{ pin: true }", "{ pin: true, text: x }").replace("syspro-saas-erp: 4", "no-such-job: 4"));
  const v = run("validate.ts", dir);
  assert.equal(v.code, 1);
  assert.match(v.out, /\(a Stack line\) needs an existing summary and only \{ pin: true \}/);
  assert.match(v.out, /entry_max_bullets: "no-such-job" isn't a summary or cv_entry/);
});

test("a profile's <id>#5: { drop: true } removes the current job's Stack line; lint then doesn't warn; validate refuses pin and drop together", () => {
  const dir = refreshed();
  const profile = (o: string) => writeFileSync(join(dir, "profiles/t.yaml"), [
    "schema_version: 1", "id: t", "headline: Test", "summary_focus: [react]", "emphasize_tags: [react, typescript]", "skills_order: [frontend]",
    "max_bullets_per_entry: 4", "min_bullets_per_entry: 1", "overrides:", `  syspro-saas-erp#5: ${o}`,
  ].join("\n"));
  profile("{ drop: true }");
  assert.equal(run("validate.ts", dir).code, 0);
  assert.equal(run("select.ts", dir, ["cv/variants/t", "--profile", "t"]).code, 0);
  const sel = JSON.parse(readFileSync(join(dir, "cv/variants/t/selection.json"), "utf8"));
  assert.equal(sel.entries.find((x: any) => x.id === "syspro-saas-erp").stack, undefined);
  // The same CV without its SYSPRO Stack line: a warning for the master, none for the profile that drops it.
  writeFileSync(join(dir, "cv/variants/t/cv.md"), readFileSync(join(dir, CV), "utf8").replace(/\n\* Stack: \*\*React 19[^\n]*\n/, "\n"));
  assert.doesNotMatch(run("lint.ts", dir, ["cv/variants/t/cv.md"]).out, /current job syspro-saas-erp has no "Stack:" bullet/);
  edit(dir, CV, /\n\* Stack: \*\*React 19[^\n]*\n/, "\n");
  assert.match(run("lint.ts", dir, [CV]).out, /current job syspro-saas-erp has no "Stack:" bullet/);
  profile("{ pin: true, drop: true }");
  const v = run("validate.ts", dir);
  assert.equal(v.code, 1);
  assert.match(v.out, /"syspro-saas-erp#5" \(a Stack line\) needs an existing summary and only \{ pin: true \} or \{ drop: true \}/);
});

test("select: a job ad's jd-tags.yaml overrides apply on top of the profile", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react-native]\noverrides:\n  velas-wallet#4.7: { pin: true }\n  general-motors-navigation#4.1: { drop: true }\n");
  const r = run("select.ts", dir, ["cv/tailored/acme", "--profile", "react-native", "--tags", "jd-tags.yaml"]);
  assert.equal(r.code, 0, r.out);
  const sel = JSON.parse(readFileSync(join(dir, "cv/tailored/acme/selection.json"), "utf8"));
  const srcs = (id: string) => sel.entries.find((e: any) => e.id === id).bullets.map((b: any) => b.src);
  assert.ok(srcs("velas-wallet").includes("velas-wallet#4.7"));
  assert.ok(!srcs("general-motors-navigation").includes("general-motors-navigation#4.1"));
});

test("select: a job ad must name its profile; jd-tags.yaml can name it instead of --profile", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react, typescript, architecture, testing, sdd]\nnice_to_have: [oidc, observability]\n");
  const none = run("select.ts", dir, ["cv/tailored/acme", "--tags", "jd-tags.yaml"]);
  assert.equal(none.code, 2);
  assert.match(none.out, /the job ad names no role profile/);
  let sel: any;
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: react-native\nrequired: [react-native]\n");
  assert.equal(run("select.ts", dir, ["cv/tailored/acme", "--tags", "jd-tags.yaml"]).code, 0);
  sel = JSON.parse(readFileSync(join(dir, "cv/tailored/acme/selection.json"), "utf8"));
  assert.equal(sel.profile, "react-native");
  assert.ok(sel.entries.every((e: any) => e.bullets.length <= 6), "the react-native profile's limit of 6 applies");
});

test("validate checks a job ad's jd-tags.yaml (profile, tags, overrides) and the exporter list", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: no-such\nrequired: [react-nativ]\noverrides:\n  velas-wallet#4.99: { pin: true }\n");
  edit(dir, "framework.config.yaml", "pdf_exporters: [", "pdf_exporters: [keynote, ");
  const r = run("validate.ts", dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /jd-tags\.yaml: profile "no-such" doesn't exist/);
  assert.match(r.out, /jd-tags\.yaml: .*react-nativ/);
  assert.match(r.out, /overrides: "velas-wallet#4\.99" doesn't resolve/);
  assert.match(r.out, /pdf_exporters: "keynote" isn't registered/);
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react-native]\noverrides:\n  velas-wallet#5: { text: x }\n");
  assert.match(run("validate.ts", dir).out, /overrides: "velas-wallet#5" \(a Stack line\) needs an existing summary and only \{ pin: true \}/);
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react-native]\nnew_tags_proposed: [mentoring]\n");
  assert.match(run("validate.ts", dir).out, /new_tags_proposed: "mentoring" is already in the tag list/);
});
