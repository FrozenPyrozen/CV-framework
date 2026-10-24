// Markdown tools: trace, reattach-src, check and the audit rounds (split from the Markdown tools tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CV, edit, refreshed, run } from "./helpers.ts";
import { reattach, similarity } from "../scripts/reattach-src.ts";

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

test("trace accepts calc: and profile pseudo-sources", () => {
  const dir = refreshed();
  writeFileSync(join(dir, "cv/tiny.md"), [
    "# **SUMMARY**", "",
    "Engineer with 7+ years of experience. <!-- src: calc:years_experience --> Based in Kyiv. <!-- src: profile -->", "",
  ].join("\n"));
  const r = run("trace.ts", dir, ["cv/tiny.md"]);
  assert.equal(r.code, 0, r.out);
});

test("check includes tailored CVs", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "cv/tailored/example-corp"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/example-corp/cv.md"), readFileSync(join(dir, CV), "utf8").replace("* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the *core* mobile app"));
  const r = run("check.ts", dir);
  assert.match(r.out, /cv\/tailored\/example-corp\/cv\.md:\d+: italics are not supported/);
});

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

test("check skips a market copy older than its CV instead of linting stale text", async () => {
  const { utimesSync } = await import("node:fs");
  const dir = refreshed();
  run("market.ts", dir);
  const ua = join(dir, "cv/markets/ukraine/Kirill_Kohan_CV_UA.md");
  const old = new Date(Date.now() - 60_000);
  utimesSync(ua, old, old);
  assert.match(run("check.ts", dir).out, /Kirill_Kohan_CV_UA\.md: older than Kirill_Kohan_CV\.md; skipped/);
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
  edit(dir3, CV, "Core contributor to", "For velocity ai, core contributor at syspro to");
  const l = run("lint.ts", dir3, [CV]).out;
  assert.match(l, /confidential term "Velocity AI"/);
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
