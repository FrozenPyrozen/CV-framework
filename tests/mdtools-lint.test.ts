// Markdown tools: lint warnings, markets and confidentiality (split from the Markdown tools tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { CV, edit, refreshed, run, UA } from "./helpers.ts";

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

test("lint reports entries out of order and a missing Stack line on the current job", () => {
  const dir = refreshed();
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /out of order|no "Stack:" bullet/);
  edit(dir, "summaries/designai-jira-plugin.md", "cv_order: 4", "cv_order: 0");
  edit(dir, CV, /\n\* Stack: \*\*React 19[^\n]*\n/, "\n");
  const r = run("lint.ts", dir, [CV]);
  assert.match(r.out, /entries in CONSULTING AND FREELANCE PROJECTS are out of order: expected designai-jira-plugin, navigation-poc, navigation-statistics, orion-mobile-clinical-ink, various-clients/);
  assert.match(r.out, /current job syspro-saas-erp has no "Stack:" bullet/);
});

test("confidentiality allow_in permits a term only in the listed context", () => {
  const dir = refreshed();
  edit(dir, "summaries/syspro-saas-erp.md", "- term: Studio Shell\n", "- term: Studio Shell\n  allow_in: [summary]\n");
  edit(dir, CV, "renders 1,800+ ERP programs", "renders 1,800+ ERP programs in Studio Shell");
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /confidential term "Studio Shell"/); // in the summary paragraph: allowed
  edit(dir, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the Studio Shell core mobile app");
  assert.match(run("lint.ts", dir, [CV]).out, /confidential term "Studio Shell"/); // in a bullet: not allowed
});

test("lint ignores confidential terms inside a comment that spans several lines", () => {
  const dir = refreshed();
  edit(dir, CV, "# **SUMMARY**", "<!--\nnote: studio-shell\n-->\n# **SUMMARY**");
  assert.doesNotMatch(run("lint.ts", dir, [CV]).out, /confidential term/);
  edit(dir, CV, "# **SUMMARY**", "# **SUMMARY**\n\nstudio-shell");
  assert.match(run("lint.ts", dir, [CV]).out, /confidential term "studio-shell"/);
});

test("lint warns about non-US spellings from checks.spelling_variants", () => {
  const dir = refreshed();
  edit(dir, CV, "user engagement grew 4x afterward.", "user engagement grew 4x afterwards.");
  assert.match(run("lint.ts", dir, [CV]).out, /"afterwards": use "afterward" \(US English\)/);
});
