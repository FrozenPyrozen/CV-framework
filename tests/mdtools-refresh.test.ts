// Markdown tools: refresh and market (split from the Markdown tools tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CV, edit, refreshed, run, tempRepo, UA } from "./helpers.ts";

test("refresh generates header, entry lines and blocks, and keeps every bullet", () => {
  const dir = tempRepo();
  const before = readFileSync(join(dir, CV), "utf8");
  run("refresh.ts", dir);
  const after = readFileSync(join(dir, CV), "utf8");
  assert.match(after, /<!-- generated:header -->\n# \*\*Kirill Kohan\*\*/);
  assert.match(after, /<!-- entry: general-motors-navigation -->\n## \*\*Team Leader\*\*\n\n### \*\*General Motors \| Remote \| July 2023 - December 2025\*\*/);
  assert.match(after, /<!-- entry: syspro-saas-erp -->\n## \*\*Senior Software Engineer\*\*\n\n### \*\*SYSPRO \| Remote \| December 2025 - Present\*\*/);
  assert.match(after, /### \*\*Clinical Ink \| Remote\*\*/); // consulting: no dates
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

test("hide_headline_qualifier: master: a job-ad CV without a profile or headline keeps its qualifier", () => {
  const dir = refreshed();
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/cv.md"), readFileSync(join(dir, CV), "utf8"));
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react]\n");
  assert.equal(run("market.ts", dir, ["cv/tailored/acme/cv.md"]).code, 0);
  const ua = readFileSync(join(dir, "cv/tailored/acme/markets/ukraine/Kirill_Kohan_CV_UA.md"), "utf8");
  assert.match(ua, /^\*\*Senior Software Engineer \/ Tech Lead \(Frontend and Mobile\)\*\*$/m);
});
