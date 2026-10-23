// Tests for the Markdown tools: refresh, market, lint, trace, reattach-src, select (step 5, part 2).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { edit, run, tempRepo } from "./helpers.ts";
import { reattach, similarity } from "../scripts/reattach-src.ts";

const CV = "cv/Kirill_Kohan_CV.md";
const UA = "cv/markets/ukraine/Kirill_Kohan_CV_UA.md";

function refreshed(): string {
  const dir = tempRepo();
  const r = run("refresh.ts", dir);
  assert.equal(r.code, 0, r.out);
  return dir;
}

// ---------- refresh ----------

test("refresh generates header, entry lines and blocks, and keeps every bullet", () => {
  const dir = tempRepo();
  const before = readFileSync(join(dir, CV), "utf8");
  run("refresh.ts", dir);
  const after = readFileSync(join(dir, CV), "utf8");
  assert.match(after, /<!-- generated:header -->\n# \*\*Kirill Kohan\*\*/);
  assert.match(after, /<!-- entry: general-motors-navigation -->\n## \*\*Team Leader\*\*\n\n### \*\*General Motors \| Remote \| July 2023 - December 2025\*\*/);
  assert.match(after, /<!-- entry: syspro-saas-erp -->\n## \*\*Senior Software Engineer\*\*\n\n### \*\*SYSPRO \| Remote \| December 2025 - Present\*\*/);
  assert.match(after, /### \*\*Clinical Trials Patient App \| Remote\*\*/); // consulting: no dates
  assert.match(after, /## \*\*Senior React Native Engineer \(Contract\)\*\*/); // real contract keeps label (worldwide)
  assert.doesNotMatch(after, /Team Leader \(Contract\)/);
  assert.match(after, /<!-- generated:skills -->\n\*\*Languages:\*\*/);
  assert.match(after, /Team leadership \(up to 8 engineers\)/);
  assert.match(after, /English: C1 \(Advanced\) \| Ukrainian: Native/);
  const bullets = (t: string) => t.split("\n").filter((l) => l.startsWith("* "));
  assert.deepEqual(bullets(after), bullets(before));
});

test("refresh is idempotent and --check passes afterwards", () => {
  const dir = refreshed();
  const once = readFileSync(join(dir, CV), "utf8");
  run("refresh.ts", dir);
  assert.equal(readFileSync(join(dir, CV), "utf8"), once);
  assert.equal(run("refresh.ts", dir, ["--check"]).code, 0);
});

test("refresh follows summary changes (date, label, location)", () => {
  const dir = refreshed();
  edit(dir, "summaries/velas-wallet.md", "cv_client_label: Velas", "cv_client_label: Velas Network");
  edit(dir, "summaries/velas-wallet.md", "end: 2023-07", "end: 2023-08");
  assert.equal(run("refresh.ts", dir, ["--check"]).code, 1);
  run("refresh.ts", dir);
  assert.match(readFileSync(join(dir, CV), "utf8"), /### \*\*Velas Network \| Remote \| December 2021 - August 2023\*\*/);
});

// ---------- market ----------

test("market writes the Ukraine version: no phone, availability, time zones or contract labels", () => {
  const dir = refreshed();
  const r = run("market.ts", dir);
  assert.equal(r.code, 0, r.out);
  const ua = readFileSync(join(dir, UA), "utf8");
  const ww = readFileSync(join(dir, CV), "utf8");
  assert.doesNotMatch(ua, /\+380/);
  assert.doesNotMatch(ua, /Open to/);
  assert.doesNotMatch(ua, /time zones/);
  assert.doesNotMatch(ua, /\(Contract\)/);
  assert.match(ua, /Kyiv, Ukraine \(Remote\)\n\nkiril\.kohan@gmail\.com/);
  const bullets = (t: string) => t.split("\n").filter((l) => l.startsWith("* "));
  assert.deepEqual(bullets(ua), bullets(ww));
  assert.equal(run("lint.ts", dir, [UA]).code, 0);
});

// ---------- lint ----------

test("lint passes on the refreshed CV and fails on the unrefreshed one", () => {
  assert.equal(run("lint.ts", refreshed(), [CV]).code, 0);
  const dir = refreshed();
  edit(dir, CV, "July 2023 - December 2025", "07/2023 \u2013 12/2025"); // the old, hand-typed date format
  const raw = run("lint.ts", dir, [CV]);
  assert.equal(raw.code, 1);
  assert.match(raw.out, /generated parts are out of date/);
  assert.match(raw.out, /forbidden character "\u2013"/);
});

const lintCases: [string, (dir: string) => void, RegExp][] = [
  ["italics", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the *core* mobile app"), /italics are not supported/],
  ["a table", (d) => edit(d, CV, "# **SUMMARY**\n", "# **SUMMARY**\n\n| a | b |\n"), /tables are not supported/],
  ["unbalanced bold", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the **core mobile app"), /unbalanced \*\*/],
  ["a hidden client name", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered for Clinical Ink the core mobile app"), /confidential term "Clinical Ink"/],
  ["an internal code name", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the Studio Shell core mobile app"), /confidential term "Studio Shell"/],
  ["a ticket id", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered OR-22199 and the core mobile app"), /ticket id with prefix "OR-"/],
  ["a foreign URL", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered https://example.com/x the core mobile app"), /URL not from profile\.yaml/],
  ["a secret", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered token=abcDEF1234567890 the core mobile app"), /credential assignment/],
  ["a wrong years-of-experience number", (d) => edit(d, CV, "7+ years", "12+ years"), /"12\+ years" but the calculated value is/],
  ["a hand-edited job line", (d) => edit(d, CV, "| July 2023 - December 2025", "| July 2023 - January 2026"), /generated parts are out of date/],
];
for (const [name, breakIt, expected] of lintCases) {
  test(`lint catches ${name}`, () => {
    const dir = refreshed();
    breakIt(dir);
    const r = run("lint.ts", dir, [CV]);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, expected);
  });
}

test("lint warns (but doesn't fail) on filler words", () => {
  const dir = refreshed();
  edit(dir, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the cutting-edge core mobile app");
  const r = run("lint.ts", dir, [CV]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /warn .*filler word "cutting-edge"/);
});

test("lint catches a phone number in the Ukraine version", () => {
  const dir = refreshed();
  run("market.ts", dir);
  edit(dir, UA, "* Delivered the research and development (R&D) department's core **React Native** app", "* Call +380 97 891 9783. Delivered the core mobile app");
  const r = run("lint.ts", dir, [UA]);
  assert.match(r.out, /phone number appears although market "ukraine" hides it/);
});

test("lint scans summary bodies for secrets when run without a file", () => {
  const dir = refreshed();
  edit(dir, "summaries/velas-wallet.md", "## 2. Main features\n", "## 2. Main features\n\napi_key: sk_live_ABCdef1234567890\n");
  const r = run("lint.ts", dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /summaries\/velas-wallet\.md: secret scan: credential assignment/);
});

// ---------- trace ----------

test("trace reports unsourced and unresolved claims, and accepts valid sources", () => {
  const dir = refreshed();
  edit(dir, CV, / <!-- src: velas-wallet#4\.1 -->/, "");
  edit(dir, CV, /(development \(SDD\)\.) <!-- src: [^>]*-->/, "$1");
  const r1 = run("trace.ts", dir, [CV]);
  assert.equal(r1.code, 1);
  assert.match(r1.out, /bullet without a source/);
  assert.match(r1.out, /sentence without a source/);
  assert.equal(run("trace.ts", dir, [CV, "--warn-only"]).code, 0);

  // A tiny CV with good and bad sources.
  writeFileSync(join(dir, "cv/tiny.md"), [
    "# **SUMMARY**", "",
    "Builds things. <!-- src: syspro-saas-erp#4.1 --> Led people. <!-- src: syspro-team-size -->", "",
    "# **EXPERIENCE**", "",
    "<!-- entry: velas-wallet -->", "## **Technical Leader**", "", "### **Velas | Remote**", "",
    "* Good bullet. <!-- src: velas-wallet#4.2 -->", "",
    "* Wrong number. <!-- src: velas-wallet#4.99 -->", "",
    "* Other job's source. <!-- src: itjet-fintech#4.1 -->", "",
  ].join("\n"));
  const r2 = run("trace.ts", dir, ["cv/tiny.md"]);
  assert.match(r2.out, /source "velas-wallet#4\.99" doesn't resolve/);
  assert.match(r2.out, /belongs to itjet-fintech, but the bullet is under velas-wallet/);
  assert.match(r2.out, /trace: 1 unsourced or unresolved claim/);
});

// ---------- reattach-src ----------

test("reattach-src restores dropped source comments by similarity", () => {
  const old = [
    "# **SUMMARY**", "", "Builds schema-driven runtimes. <!-- src: syspro-saas-erp#4.1 -->", "",
    "# **EXPERIENCE**", "", "<!-- entry: velas-wallet -->", "## **Technical Leader**", "", "### **Velas | Remote**", "",
    "* Made the staking list load 12x faster by moving filtering to the server. <!-- src: velas-wallet#4.2 -->", "",
    "* Published the app on F-Droid and Snapcraft. <!-- src: velas-wallet#4.5 -->", "",
  ].join("\n");
  const agentEdited = old
    .replace(" <!-- src: syspro-saas-erp#4.1 -->", "")
    .replace("load 12x faster by moving filtering to the server. <!-- src: velas-wallet#4.2 -->", "load 12x faster by moving the filtering to the server side.")
    .replace("* Published the app on F-Droid and Snapcraft. <!-- src: velas-wallet#4.5 -->", "* Shipped a brand new unrelated feature.");
  const r = reattach(agentEdited, old);
  assert.equal(r.restored, 2);
  assert.match(r.text, /server side\. <!-- src: velas-wallet#4\.2 -->/);
  assert.match(r.text, /Builds schema-driven runtimes\. <!-- src: syspro-saas-erp#4\.1 -->/);
  assert.deepEqual(r.unmatched, ['bullet: "Shipped a brand new unrelated feature."']);
  assert.ok(similarity("a b c d", "a b c e") >= 0.5);
});

// ---------- select ----------

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

// ---------- alignment checks added after the plan review ----------

test("lint reports entries out of order and a missing Stack line on the current job", () => {
  const dir = refreshed();
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /out of order|no "Stack:" bullet/);
  edit(dir, "summaries/designai-jira-plugin.md", "cv_order: 2", "cv_order: 0");
  edit(dir, CV, /\n\* Stack: \*\*React 19[^\n]*\n/, "\n");
  const r = run("lint.ts", dir, [CV]);
  assert.match(r.out, /entries in CONSULTING AND FREELANCE PROJECTS are out of order: expected designai-jira-plugin, orion-mobile-clinical-ink, various-clients/);
  assert.match(r.out, /current job syspro-saas-erp has no "Stack:" bullet/);
});

test("trace accepts calc: and profile pseudo-sources", () => {
  const dir = refreshed();
  writeFileSync(join(dir, "cv/tiny.md"), [
    "# **SUMMARY**", "",
    "Engineer with 7+ years of experience. <!-- src: calc:years_experience --> Based in Kyiv. <!-- src: profile -->", "",
  ].join("\n"));
  const r = run("trace.ts", dir, ["cv/tiny.md"]);
  assert.equal(r.code, 0, r.out);
});

test("confidentiality allow_in permits a term only in the listed context", () => {
  const dir = refreshed();
  edit(dir, "summaries/syspro-saas-erp.md", "- term: Studio Shell\n", "- term: Studio Shell\n  allow_in: [summary]\n");
  edit(dir, CV, "renders 1,800+ ERP programs", "renders 1,800+ ERP programs in Studio Shell");
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /confidential term "Studio Shell"/); // in the summary paragraph: allowed
  edit(dir, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the Studio Shell core mobile app");
  assert.match(run("lint.ts", dir, [CV]).out, /confidential term "Studio Shell"/); // in a bullet: not allowed
});

test("check includes tailored CVs", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "cv/tailored/example-corp"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/example-corp/cv.md"), readFileSync(join(dir, CV), "utf8").replace("* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the *core* mobile app"));
  const r = run("check.ts", dir);
  assert.match(r.out, /cv\/tailored\/example-corp\/cv\.md:\d+: italics are not supported/);
});

// ---------- fixes from the bidirectional plan review ----------

test("reattach-src: --save snapshot, works on files not in git, clear error without a previous version", () => {
  const dir = refreshed();
  const f = "cv/tailored/acme/cv.md";
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, f), "# **SUMMARY**\n\nBuilds things. <!-- src: syspro-saas-erp#4.1 -->\n");
  const none = run("reattach-src.ts", dir, ["cv/tailored/nothing.md"]);
  assert.notEqual(none.code, 0);
  assert.equal(run("reattach-src.ts", dir, [f, "--save"]).code, 0);
  writeFileSync(join(dir, f), "# **SUMMARY**\n\nBuilds things.\n"); // agent dropped the comment
  const r = run("reattach-src.ts", dir, [f]);
  assert.equal(r.code, 0, r.out);
  assert.match(readFileSync(join(dir, f), "utf8"), /Builds things\. <!-- src: syspro-saas-erp#4\.1 -->/);
  // The snapshot stays until the next --save: a second run still compares with it (never with git HEAD).
  writeFileSync(join(dir, f), "# **SUMMARY**\n\nBuilds things.\n");
  const again = run("reattach-src.ts", dir, [f]);
  assert.equal(again.code, 0, again.out);
  assert.match(readFileSync(join(dir, f), "utf8"), /Builds things\. <!-- src: syspro-saas-erp#4\.1 -->/);
  // A generated section intro line is never reported as an unmatched sentence.
  const cv = "cv/Kirill_Kohan_CV.md";
  assert.equal(run("reattach-src.ts", dir, [cv, "--save"]).code, 0);
  assert.doesNotMatch(run("reattach-src.ts", dir, [cv]).out, /unmatched\s+sentence: "Part-time contract/);
});

test("refresh, market and lint use the variant's role profile (headline, skills order)", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/rn.yaml"), "schema_version: 1\nid: rn\nheadline: Senior React Native Engineer\nsummary_focus: [react-native]\nemphasize_tags: [react-native]\nskills_order: [mobile, languages]\n");
  mkdirSync(join(dir, "cv/variants/rn"), { recursive: true });
  writeFileSync(join(dir, "cv/variants/rn/cv.md"), readFileSync(join(dir, CV), "utf8"));
  assert.equal(run("refresh.ts", dir, ["cv/variants/rn/cv.md"]).code, 0);
  const v = readFileSync(join(dir, "cv/variants/rn/cv.md"), "utf8");
  assert.match(v, /\*\*Senior React Native Engineer\*\*/);
  assert.match(v, /<!-- generated:skills -->\n\*\*Mobile:\*\*/);
  assert.doesNotMatch(run("lint.ts", dir, ["cv/variants/rn/cv.md"]).out, /out of date/);
  run("market.ts", dir, ["cv/variants/rn/cv.md"]);
  assert.match(readFileSync(join(dir, "cv/variants/rn/markets/ukraine/Kirill_Kohan_CV_Rn_UA.md"), "utf8"), /\*\*Senior React Native Engineer\*\*/);
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

test("refresh reports hand-written text it replaces, and refuses to run on invalid sources", () => {
  const dir = refreshed();
  edit(dir, CV, "<!-- /generated:skills -->", "<!-- /generated:skills -->\n\nMy own skills note.");
  const r = run("refresh.ts", dir);
  assert.match(r.out, /removed hand-written text from the SKILLS section .*My own skills note/);
  edit(dir, "summaries/velas-wallet.md", "cv_section: experience", "cv_section: nope");
  const bad = run("refresh.ts", dir);
  assert.equal(bad.code, 1);
  assert.match(bad.out, /fix the validate errors first/);
});

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

test("validate warns about a skill nothing supports", () => {
  const dir = tempRepo();
  edit(dir, "facts/skills.yaml", "      - { name: TypeScript, tags: [typescript] }", "      - { name: TypeScript, tags: [typescript] }\n      - { name: Haskell, tags: [testing-unused-xyz] }");
  edit(dir, "framework.config.yaml", "  - typescript\n", "  - typescript\n  - testing-unused-xyz\n");
  const r = run("validate.ts", dir);
  assert.match(r.out, /skill "Haskell" isn't supported/);
});

test("lint uses the role profile's max_words", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/short.yaml"), "id: short\nmax_words: 500\n");
  mkdirSync(join(dir, "cv/variants/short"), { recursive: true });
  writeFileSync(join(dir, "cv/variants/short/cv.md"), readFileSync(join(dir, CV), "utf8"));
  run("refresh.ts", dir, ["cv/variants/short/cv.md"]);
  assert.match(run("lint.ts", dir, ["cv/variants/short/cv.md"]).out, /\d+ words \(max 500\)/);
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

test("lint ignores confidential terms inside a comment that spans several lines", () => {
  const dir = refreshed();
  edit(dir, CV, "# **SUMMARY**", "<!--\nnote: studio-shell\n-->\n# **SUMMARY**");
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /confidential term/);
  edit(dir, CV, "# **SUMMARY**", "# **SUMMARY**\n\nstudio-shell");
  assert.match(run("lint.ts", dir, [CV]).out, /confidential term "studio-shell"/);
});

test("a job-specific CV takes its profile and headline from jd-tags.yaml", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "cv/tailored/acme-senior-rn"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme-senior-rn/cv.md"), readFileSync(join(dir, CV), "utf8"));
  writeFileSync(join(dir, "cv/tailored/acme-senior-rn/jd-tags.yaml"), "profile: react-native\nheadline: Senior React Native Engineer (Healthcare)\nrequired: [react-native]\n");
  const r = run("refresh.ts", dir, ["cv/tailored/acme-senior-rn/cv.md"]);
  assert.equal(r.code, 0, r.out);
  const md = readFileSync(join(dir, "cv/tailored/acme-senior-rn/cv.md"), "utf8");
  assert.match(md, /^\*\*Senior React Native Engineer \(Healthcare\)\*\*$/m);
  const skills = md.slice(md.indexOf("<!-- generated:skills -->"));
  assert.ok(skills.indexOf("**Mobile:**") < skills.indexOf("**Frontend:**"), "skills follow the react-native profile order");
});

test("lint warns about non-US spellings from checks.spelling_variants", () => {
  const dir = refreshed();
  edit(dir, CV, "user engagement grew 4x afterward.", "user engagement grew 4x afterwards.");
  assert.match(run("lint.ts", dir, [CV]).out, /"afterwards": use "afterward" \(US English\)/);
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

test("check skips a market copy older than its CV instead of linting stale text", async () => {
  const { utimesSync } = await import("node:fs");
  const dir = refreshed();
  run("market.ts", dir);
  const ua = join(dir, "cv/markets/ukraine/Kirill_Kohan_CV_UA.md");
  const old = new Date(Date.now() - 60_000);
  utimesSync(ua, old, old);
  assert.match(run("check.ts", dir).out, /Kirill_Kohan_CV_UA\.md: older than Kirill_Kohan_CV\.md; skipped/);
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

test("market hide_headline_qualifier: master drops the master CV's (…) qualifier; variants keep theirs", () => {
  const dir = refreshed();
  run("market.ts", dir);
  const ua = readFileSync(join(dir, "cv/markets/ukraine/Kirill_Kohan_CV_UA.md"), "utf8");
  assert.match(ua, /^\*\*Senior Software Engineer \/ Tech Lead\*\*$/m);
  assert.match(readFileSync(join(dir, CV), "utf8"), /^\*\*Senior Software Engineer \/ Tech Lead\*\*$/m); // worldwide hides it too
  run("market.ts", dir, ["cv/variants/react-native/cv.md"]);
  const rn = readFileSync(join(dir, "cv/variants/react-native/markets/ukraine/Kirill_Kohan_CV_React_Native_UA.md"), "utf8");
  assert.match(rn, /^\*\*Senior React Native Engineer \/ Tech Lead \(Mobile\)\*\*$/m);
  assert.equal(run("lint.ts", dir, ["cv/markets/ukraine/Kirill_Kohan_CV_UA.md", "--market", "ukraine"]).code, 0);
});

test("lint warns when the summary paragraph names a company (decision summary-no-company-names)", () => {
  const dir = refreshed();
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /summary names/);
  edit(dir, CV, "Core contributor to", "At SYSPRO, currently a core contributor to");
  const out = run("lint.ts", dir, [CV]).out;
  assert.match(out, /summary names "SYSPRO": describe the work instead/);
  assert.match(out, /summary says "currently": describe general experience without timing words/);
});

test("hide_headline_qualifier: master: a job-ad CV without a profile or headline keeps its qualifier", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/cv.md"), readFileSync(join(dir, CV), "utf8"));
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react]\n");
  assert.equal(run("market.ts", dir, ["cv/tailored/acme/cv.md"]).code, 0);
  const ua = readFileSync(join(dir, "cv/tailored/acme/markets/ukraine/Kirill_Kohan_CV_UA.md"), "utf8");
  assert.match(ua, /^\*\*Senior Software Engineer \/ Tech Lead \(Frontend and Mobile\)\*\*$/m);
});

test("round 1 audit: unsourced summary sentence, partial reattach, refresh guards, case-insensitive names", () => {
  const dir = refreshed();
  const V = "cv/variants/react/cv.md";
  // A sentence added before a sourced one has no source of its own: trace error (a variant build fails).
  edit(dir, V, /(blockchain products\.) (<!-- src:)/, "$1 Shipped Kubernetes operators. $2");
  assert.match(run("trace.ts", dir, [V]).out, /1 sentence\(s\) without their own source/);
  // reattach-src restores one comment dropped from the middle of the summary.
  const dir2 = refreshed();
  assert.equal(run("reattach-src.ts", dir2, [CV, "--save"]).code, 0);
  edit(dir2, CV, /(blockchain products\.) <!-- src:[^>]*-->/, "$1");
  assert.match(run("reattach-src.ts", dir2, [CV]).out, /1 source comment\(s\) restored/);
  // refresh refuses to write another market's header into the default-market CV, and reports replaced lines.
  const g = run("refresh.ts", dir2, [CV, "--market", "ukraine"]);
  assert.equal(g.code, 2);
  assert.match(g.out, /would write that market's header/);
  edit(dir2, CV, "**Senior Software Engineer / Tech Lead**", "**Principal Engineer**");
  assert.match(run("refresh.ts", dir2, [CV]).out, /replaced: "\*\*Principal Engineer\*\*"/);
  // Hidden client names and company names in the summary match in any case.
  const dir3 = refreshed();
  edit(dir3, CV, "Core contributor to", "For clinical ink, core contributor at syspro to");
  const l = run("lint.ts", dir3, [CV]).out;
  assert.match(l, /confidential term "Clinical Ink"/);
  assert.match(l, /summary names "SYSPRO"/);
  // Clear messages instead of stack traces.
  assert.match(run("select.ts", dir3, ["cv/variants/react", "--tags", "nope.yaml"]).out, /tags file not found/);
  assert.match(run("market.ts", dir3, ["--market", "mars"]).out, /unknown market "mars"/);
  assert.match(run("render.ts", dir3, ["--template", "nope"]).out, /template "nope" not found/);
});

test("round 2 audit: abbreviations don't split sentences; empty summary; unknown tags in select", () => {
  const dir = refreshed();
  edit(dir, CV, "Core contributor to a schema-driven React 19 runtime", "Core contributor (e.g. React 19 and XState) to a schema-driven React 19 runtime");
  assert.doesNotMatch(run("trace.ts", dir, [CV]).out, /without their own source/);
  const dir2 = refreshed();
  edit(dir2, CV, /# \*\*SUMMARY\*\*\n\n[^\n]+\n/, "# **SUMMARY**\n\n");
  assert.match(run("lint.ts", dir2, [CV]).out, /the SUMMARY section is empty/);
  mkdirSync(join(dir2, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir2, "cv/tailored/acme/jd-tags.yaml"), "profile: react\nrequired: [react-nativ]\n");
  const s = run("select.ts", dir2, ["cv/tailored/acme", "--tags", "jd-tags.yaml"]);
  assert.equal(s.code, 2);
  assert.match(s.out, /unknown tag\(s\) in jd-tags\.yaml: react-nativ/);
});
