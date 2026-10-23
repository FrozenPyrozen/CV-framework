// Markdown tools: more lint checks (headings, sections, limits, team size, word count) (split from the Markdown tools tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CV, edit, refreshed, run } from "./helpers.ts";

const moreLint: [string, (d: string) => void, RegExp][] = [
  ["a #### heading", (d) => edit(d, CV, "# **SUMMARY**\n", "# **SUMMARY**\n\n#### Note\n"), /only #, ## and ### headings/],
  ["sections out of order", (d) => { const t = readFileSync(join(d, CV), "utf8"); const a = t.indexOf("# **EDUCATION**"), b = t.indexOf("# **SKILLS**"), c = t.indexOf("# **LANGUAGES**"); writeFileSync(join(d, CV), t.slice(0, a) + t.slice(b, c) + t.slice(a, b) + t.slice(c)); }, /sections must be, in order/],
  ["too many bullets", (d) => edit(d, "summaries/velas-wallet.md", "cv_section: experience", "cv_section: experience\ncv_max_bullets: 3"), /velas-wallet has 9 bullets \(limit 3\)/],
  ["a wrong team size", (d) => edit(d, CV, "Led a team of 8 engineers building", "Led teams of up to 6 engineers building"), /"up to 6 engineers" but the largest team led is 8/],
  ["an internal git remote", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered git@ssh.dev.azure.com:v3/SYSPRO-Product/x the core mobile app"), /internal address matching/],
];
for (const [name, breakIt, expected] of moreLint) {
  test(`lint catches ${name}`, () => {
    const dir = refreshed();
    breakIt(dir);
    const r = run("lint.ts", dir, [CV]);
    assert.match(r.out, expected);
  });
}

test("lint uses the role profile's max_words", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/short.yaml"), "id: short\nmax_words: 500\n");
  mkdirSync(join(dir, "cv/variants/short"), { recursive: true });
  writeFileSync(join(dir, "cv/variants/short/cv.md"), readFileSync(join(dir, CV), "utf8"));
  run("refresh.ts", dir, ["cv/variants/short/cv.md"]);
  assert.match(run("lint.ts", dir, ["cv/variants/short/cv.md"]).out, /\d+ words \(max 500\)/);
});

test("lint: team-size wording variants are checked; separators don't count as words", () => {
  const dir = refreshed();
  edit(dir, CV, "Led a team of 8 engineers building", "Managed a team of 9 senior frontend software engineers building");
  assert.match(run("lint.ts", dir, [CV]).out, /team of 9 senior frontend software engineers" exceeds the largest team led \(8\)/);
});

test("lint word count ignores separators; select reports a missing profile clearly; local exporters are checked", () => {
  const dir = refreshed();
  const count = () => Number(run("lint.ts", dir, [CV, "--profile", "react"]).out.match(/(\d+) words \(max/)?.[1] ?? 0);
  writeFileSync(join(dir, "profiles/react.yaml"), readFileSync(join(dir, "profiles/react.yaml"), "utf8").replace("max_words: 1800", "max_words: 100"));
  const before = count();
  edit(dir, CV, "# **EXPERIENCE**", "# **EXPERIENCE**\n\n| | | | / / - -");
  assert.equal(count(), before, "separators don't add words");
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: no-such\nrequired: [react]\n");
  const r = run("select.ts", dir, ["cv/tailored/acme", "--tags", "jd-tags.yaml"]);
  assert.equal(r.code, 2);
  assert.match(r.out, /role profile "no-such" not found/);
  writeFileSync(join(dir, "framework.local.yaml"), "pdf_exporters: [keynote]\n");
  assert.match(run("validate.ts", dir).out, /framework\.local\.yaml: pdf_exporters: "keynote" isn't registered/);
});

test("lint warns when the summary paragraph names a company (decision summary-no-company-names)", () => {
  const dir = refreshed();
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /summary names/);
  edit(dir, CV, "Core contributor to", "At SYSPRO, currently a core contributor to");
  const out = run("lint.ts", dir, [CV]).out;
  assert.match(out, /summary names "SYSPRO": describe the work instead/);
  assert.match(out, /summary says "currently": describe general experience without timing words/);
});
