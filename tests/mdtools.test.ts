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
  edit(dir, CV, "December 2025 - Present", "12/2025 \u2013 Present"); // the old, hand-typed date format
  const raw = run("lint.ts", dir, [CV]);
  assert.equal(raw.code, 1);
  assert.match(raw.out, /generated parts are out of date/);
  assert.match(raw.out, /forbidden character "\u2013"/);
});

const lintCases: [string, (dir: string) => void, RegExp][] = [
  ["italics", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered the *core* mobile app"), /italics are not supported/],
  ["a table", (d) => edit(d, CV, "# **SUMMARY**\n", "# **SUMMARY**\n\n| a | b |\n"), /tables are not supported/],
  ["unbalanced bold", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered the **core mobile app"), /unbalanced \*\*/],
  ["a hidden client name", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered for Clinical Ink the core mobile app"), /confidential term "Clinical Ink"/],
  ["an internal code name", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered the Studio Shell core mobile app"), /confidential term "Studio Shell"/],
  ["a ticket id", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered OR-22199 and the core mobile app"), /ticket id with prefix "OR-"/],
  ["a foreign URL", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered https://example.com/x the core mobile app"), /URL not from profile\.yaml/],
  ["a secret", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered token=abcDEF1234567890 the core mobile app"), /credential assignment/],
  ["a wrong years-of-experience number", (d) => edit(d, CV, "7+ years", "12+ years"), /"12\+ years" but the calculated value is/],
  ["a hand-edited job line", (d) => edit(d, CV, "| July 2023 - November 2025", "| July 2023 - December 2025"), /generated parts are out of date/],
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
  edit(dir, CV, "* Delivered the R&D department's core mobile app", "* Delivered the cutting-edge core mobile app");
  const r = run("lint.ts", dir, [CV]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /warn .*filler word "cutting-edge"/);
});

test("lint catches a phone number in the Ukraine version", () => {
  const dir = refreshed();
  run("market.ts", dir);
  edit(dir, UA, "* Delivered the R&D department's core mobile app", "* Call +380 97 891 9783. Delivered the core mobile app");
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
  edit(dir, CV, "* Delivered the R&D department's core mobile app", "* Delivered the Studio Shell core mobile app");
  assert.match(run("lint.ts", dir, [CV]).out, /confidential term "Studio Shell"/); // in a bullet: not allowed
});

test("check includes tailored CVs", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "cv/tailored/example-corp"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/example-corp/cv.md"), readFileSync(join(dir, CV), "utf8").replace("* Delivered the R&D department's core mobile app", "* Delivered the *core* mobile app"));
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
  // no git repo in the temp copy and the snapshot was used once: clear message instead of a stack trace
  const again = run("reattach-src.ts", dir, [f]);
  assert.equal(again.code, 2);
  assert.match(again.out, /no previous version/);
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
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react-native]\nnice_to_have: [graphql]\n");
  const r = run("select.ts", dir, ["cv/tailored/acme", "--tags", "jd-tags.yaml"]);
  assert.equal(r.code, 0, r.out);
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
  ["a wrong team size", (d) => edit(d, CV, "Previously led a team of 8 engineers", "Previously led teams of up to 6 engineers"), /"up to 6 engineers" but the largest team led is 8/],
  ["an internal git remote", (d) => edit(d, CV, "* Delivered the R&D department's core mobile app", "* Delivered git@ssh.dev.azure.com:v3/SYSPRO-Product/x the core mobile app"), /internal address matching/],
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
