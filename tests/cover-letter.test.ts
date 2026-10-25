// npm run cover-letter: the deterministic part of a cover letter (specs/outputs/cover-letter.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { run, tempRepo } from "./helpers.ts";

const DIR = "cv/tailored/acme-senior-react";

// A job folder as /tailor --jd leaves it: the react variant as its CV, the job ad and its tags.
function jobRepo(): string {
  const dir = tempRepo();
  mkdirSync(join(dir, DIR), { recursive: true });
  cpSync(join(dir, "cv/variants/react/cv.md"), join(dir, DIR, "cv.md"));
  writeFileSync(join(dir, DIR, "jd-tags.yaml"), "profile: react\nrequired: [react, typescript]\n");
  writeFileSync(join(dir, DIR, "job-description.md"), "# Senior React Engineer at Acme\n\nAcme builds a design tool. You will lead the React frontend.\n");
  return dir;
}

const good = [
  "I'm applying for the Senior React Engineer role, where Acme's React frontend needs someone who has built large schema-driven UIs. <!-- src: jd, syspro-saas-erp#4.1 -->",
  "At SYSPRO I built core modules of a schema-driven React 19 and TypeScript runtime that renders 1,800+ ERP programs. <!-- src: syspro-saas-erp#4.1 -->",
  "Before that I led the map team of 8 engineers for the General Motors vehicle companion app. <!-- src: general-motors-navigation#4.1 -->",
  "I work remotely from Kyiv and would welcome a conversation. <!-- src: profile -->",
];

function writeBody(dir: string, paragraphs: string[]) {
  const p = join(dir, DIR, "cover-letter.md");
  const text = readFileSync(p, "utf8");
  const head = text.slice(0, text.indexOf("Dear Hiring Team,") + "Dear Hiring Team,".length);
  writeFileSync(p, `${head}\n\n${paragraphs.join("\n\n")}\n\nSincerely,\nKirill Kohan\n`);
}

test("refresh creates a skeleton with the CV's generated header; check refuses its TODOs", () => {
  const dir = jobRepo();
  const r = run("cover-letter.ts", dir, ["refresh", DIR]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /created cv\/tailored\/acme-senior-react\/cover-letter\.md/);
  const text = readFileSync(join(dir, DIR, "cover-letter.md"), "utf8");
  const cvHeader = readFileSync(join(dir, DIR, "cv.md"), "utf8").match(/<!-- generated:header -->[\s\S]*?<!-- \/generated:header -->/)?.[0];
  assert.ok(cvHeader && text.startsWith(cvHeader), "the letter's header is the CV's header");
  assert.match(text, /\n\nDear Hiring Team,\n\n/);
  const c = run("cover-letter.ts", dir, ["check", DIR]);
  assert.equal(c.code, 1);
  assert.match(c.out, /TODO left in the letter/);
  assert.match(c.out, /sentence without a source/); // the empty src of the skeleton's second paragraph
});

test("a sourced letter passes; unsourced, jd without a job ad, too long, confidential and a hand-edited header fail", () => {
  const dir = jobRepo();
  run("cover-letter.ts", dir, ["refresh", DIR]);
  writeBody(dir, good);
  const ok = run("cover-letter.ts", dir, ["check", DIR]);
  assert.equal(ok.code, 0, ok.out);
  assert.match(ok.out, /0 error\(s\)/);

  writeBody(dir, [...good.slice(0, 3), "I'm a quick learner. I work remotely from Kyiv. <!-- src: profile -->", "Studio Shell taught me a lot. <!-- src: syspro-saas-erp#4.1 -->"]);
  const bad = run("cover-letter.ts", dir, ["check", DIR]);
  assert.equal(bad.code, 1);
  assert.match(bad.out, /1 sentence\(s\) without their own source before: "I'm a quick learner/);
  assert.match(bad.out, /confidential term "Studio Shell"/);
  assert.match(bad.out, /5 body paragraphs \(3 or 4 expected\)/);

  writeBody(dir, [...good.slice(0, 3), `${"Plenty of words here. ".repeat(80)}<!-- src: profile -->`]);
  const long = run("cover-letter.ts", dir, ["check", DIR]);
  assert.equal(long.code, 1); // an error, not a warning (specs/outputs/cover-letter.md 5)
  assert.match(long.out, /ERROR\s+\S+ \d+ words in the body \(max \d+, checks\.cover_letter_max_words\)/);

  writeBody(dir, good);
  const p = join(dir, DIR, "cover-letter.md");
  writeFileSync(p, readFileSync(p, "utf8").replace("# **Kirill Kohan**", "# **K. Kohan**"));
  assert.match(run("cover-letter.ts", dir, ["check", DIR]).out, /the header differs from the CV's/);
  assert.match(run("cover-letter.ts", dir, ["refresh", DIR]).out, /header refreshed/);

  rmSync(join(dir, DIR, "job-description.md"));
  assert.match(run("cover-letter.ts", dir, ["check", DIR]).out, /source "jd" but cv\/tailored\/acme-senior-react\/job-description\.md doesn't exist/);
});

test("build --no-pdf renders the Word file with the CV template; a folder without cv.md is a one-line error", () => {
  const dir = jobRepo();
  run("cover-letter.ts", dir, ["refresh", DIR]);
  writeBody(dir, good);
  const b = run("cover-letter.ts", dir, ["build", DIR, "--no-pdf"]);
  assert.equal(b.code, 0, b.out);
  assert.ok(existsSync(join(dir, DIR, "Kirill_Kohan_Cover_Letter.docx")), b.out);
  // Another market: its header, and the market's file suffix in the name (spec 1).
  run("cover-letter.ts", dir, ["refresh", DIR, "--market", "ukraine"]);
  const ua = run("cover-letter.ts", dir, ["build", DIR, "--market", "ukraine", "--no-pdf"]);
  assert.equal(ua.code, 0, ua.out);
  assert.ok(existsSync(join(dir, DIR, "Kirill_Kohan_Cover_Letter_UA.docx")), ua.out);
  const none = run("cover-letter.ts", dir, ["check", "cv/tailored/nothing-here"]);
  assert.equal(none.code, 2);
  assert.match(none.out.trim(), /^cover-letter: cv\/tailored\/nothing-here\/cv\.md not found: run \/tailor --jd/);
});

test("screening rules: AI-tell phrases fail, `why` needs why.md, missing keywords and uniform rhythm warn", () => {
  const dir = jobRepo();
  run("cover-letter.ts", dir, ["refresh", DIR]);
  writeBody(dir, [good[0], "Furthermore, I spearheaded a schema-driven React 19 runtime that renders 1,800+ ERP programs. <!-- src: syspro-saas-erp#4.1 -->", good[2], "Your mission is what drew me to Acme. <!-- src: why -->"]);
  const r = run("cover-letter.ts", dir, ["check", DIR]);
  assert.equal(r.code, 1);
  assert.match(r.out, /"furthermore" reads as machine-written/);
  assert.match(r.out, /"spearheaded" reads as machine-written/);
  assert.match(r.out, /source "why" but cv\/tailored\/acme-senior-react\/why\.md doesn't exist/);

  writeFileSync(join(dir, DIR, "why.md"), "I use design tools every day and want to build one.\n");
  writeFileSync(join(dir, DIR, "jd-tags.yaml"), "profile: react\nrequired: [react, graphql, kubernetes, rust]\n");
  writeBody(dir, [good[0], good[1], good[2], "I use design tools daily and want to build one. <!-- src: why -->"]);
  const w = run("cover-letter.ts", dir, ["check", DIR]);
  assert.equal(w.code, 0, w.out);
  assert.match(w.out, /few of the job ad's required keywords appear in the body \(missing: graphql, kubernetes, rust\)/);

  const same = "I built a large frontend platform for a big client team. <!-- src: syspro-saas-erp#4.1 -->";
  writeBody(dir, [`${good[0]}`, `${same} ${same} ${same}`, `${same} ${same}`, "I work remotely from Kyiv and would welcome a short call soon. <!-- src: profile -->"]);
  const u = run("cover-letter.ts", dir, ["check", DIR]).out;
  assert.match(u, /sentences are all about \d+ words long/);
  assert.match(u, /sentences start with "I": vary the openings/);
});

test("sentences that hand the ad back fail; an over-long sentence and no short one warn", () => {
  const dir = jobRepo();
  run("cover-letter.ts", dir, ["refresh", DIR]);
  const long = `I built core modules of a schema-driven React 19 and TypeScript runtime that renders 1,800+ ERP programs from data-model definitions for a large program of more than twenty five people across several teams and products. <!-- src: syspro-saas-erp#4.1 -->`;
  writeBody(dir, [good[0], `Your ad asks for design docs before code. ${long}`, good[2], good[3]]);
  const r = run("cover-letter.ts", dir, ["check", DIR]).out;
  assert.match(r, /"your ad asks" reads as machine-written/);
  assert.match(r, /a \d+-word sentence \("I built core modules/);
});

test("check: a hidden client in any case, a ticket id, a forbidden character and an unknown word are errors", () => {
  const dir = jobRepo();
  run("cover-letter.ts", dir, ["refresh", DIR]);
  writeBody(dir, [good[0], "I shipped a Jira plugin for velocity ai and closed VEL-123 in a week. <!-- src: designai-jira-plugin#4.1 -->",
    "I led the map team of 8 engineers \u2014 for General Motors. <!-- src: general-motors-navigation#4.1 -->",
    "I enjoy zorblefluxing large codebases. I work remotely from Kyiv. <!-- src: profile -->"]);
  const r = run("cover-letter.ts", dir, ["check", DIR]);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /confidential term "Velocity AI"/i);
  assert.match(r.out, /ticket id with prefix "VEL-"/);
  assert.match(r.out, /forbidden character "\u2014"/);
  assert.match(r.out, /unknown word "zorblefluxing"/i);
});
