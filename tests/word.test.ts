// Tests for template import and the Word renderer (step 5, part 3a).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { edit, run, tempRepo } from "./helpers.ts";
import { openDocx, pPr, paragraphText } from "../scripts/lib/docx.ts";

const CV = "cv/Kirill_Kohan_CV.md";

test("template-import lists paragraphs, then builds a template with no CV text left", async () => {
  const dir = tempRepo();
  const list = run("template-import.ts", dir, ["templates/classic/source.docx", "copy"]);
  assert.match(list.out, /^\s+0\s+Title\s+Kirill Kohan/m);
  const r = run("template-import.ts", dir, ["templates/classic/source.docx", "copy", "--map", "templates/classic/import-map.yaml"]);
  assert.equal(r.code, 0, r.out);
  const t = await openDocx(join(dir, "templates/copy/template.docx"));
  const texts = t.paragraphs.map(paragraphText).filter(Boolean);
  assert.ok(texts.every((x) => /^\{\{[a-z_]+\}\}$/.test(x)), `leftover text: ${texts.filter((x) => !x.startsWith("{{"))}`);
  assert.match(readFileSync(join(dir, "templates/copy/style-map.yaml"), "utf8"), /approved: false/);
});

test("template-import rejects a map missing required types", () => {
  const dir = tempRepo();
  edit(dir, "templates/classic/import-map.yaml", /^  bullet: .*$/m, "");
  const r = run("template-import.ts", dir, ["templates/classic/source.docx", "copy", "--map", "templates/classic/import-map.yaml"]);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /lacks required paragraph types: bullet/);
});

test("render produces the approved layout: same formatting per paragraph type, real links, bullet fix", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  const r = run("render.ts", dir);
  assert.equal(r.code, 0, r.out);
  const out = join(dir, "cv/Kirill_Kohan_CV.docx");
  const d = await openDocx(out);
  const texts = d.paragraphs.map(paragraphText);
  assert.equal(texts[0], "Kirill Kohan");
  assert.equal(texts[1], "Senior Software Engineer / Tech Lead");
  assert.equal(texts[3], "+380 97 891 9783 | kiril.kohan@gmail.com | Portfolio");
  assert.ok(texts.includes("General Motors | RemoteJuly 2023 - December 2025"), "entry details with tab before dates");
  assert.ok(texts.includes("SYSPRO | RemoteDecember 2025 - Present"), "the current job, dated, in Experience");
  assert.match(pPr(d.paragraphs[0]), /<w:spacing [^>]*w:before="0"/, "no space above the name (tighter-header-and-sections)");
  assert.match(pPr(d.paragraphs.find((p) => paragraphText(p) === "EXPERIENCE")!), /w:before="90"/, "4.5 pt above section headings");
  assert.ok(!texts.some((t) => /Team Leader \(Contract\)/.test(t)));
  const zip = await JSZip.loadAsync(readFileSync(out));
  const rels = await zip.file("word/_rels/document.xml.rels")!.async("string");
  assert.match(rels, /Target="mailto:kiril\.kohan@gmail\.com"/);
  assert.match(rels, /Target="https:\/\/drive\.google\.com\/file\/d\/1-BtpQknjSQ9bxTFAKm6v-r3DQR7IOX6s\/view\?usp=sharing"/);
  const bullet = d.paragraphs.find((p) => p.includes("<w:numPr>"))!;
  assert.match(pPr(bullet), /<w:ind w:left="226" w:right="0" w:hanging="226"\/>/);
  const numbering = await zip.file("word/numbering.xml")!.async("string");
  assert.match(numbering, /<w:tabs><w:tab w:val="num" w:pos="226"\/><\/w:tabs><w:ind w:left="226" w:hanging="226"\/>/);
  const ids = [...(await zip.file("word/document.xml")!.async("string")).matchAll(/<wp:docPr id="(\d+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "drawing ids are unique");
});

test("render of the Ukraine version has no phone and no contract labels", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  run("market.ts", dir);
  run("render.ts", dir, ["cv/markets/ukraine/Kirill_Kohan_CV_UA.md"]);
  const d = await openDocx(join(dir, "cv/markets/ukraine/Kirill_Kohan_CV_UA.docx"));
  const all = d.paragraphs.map(paragraphText).join("\n");
  assert.doesNotMatch(all, /\+380|\(Contract\)|Open to/);
  assert.match(all, /kiril\.kohan@gmail\.com \| Portfolio/);
});

test("render applies the classic fixes: right-aligned dates, headings and bullet groups kept together", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  run("render.ts", dir);
  const d = await openDocx(join(dir, "cv/Kirill_Kohan_CV.docx"));
  const details = d.paragraphs.find((p) => paragraphText(p).startsWith("SYSPRO | Remote"))!;
  assert.match(pPr(details), /<w:tab w:val="right" w:leader="none" w:pos="10800"\/>/);
  assert.match(pPr(details), /<w:keepNext w:val="1"\/>/);
  const isBullet = (p: string) => p.includes("<w:numPr>");
  const keeps = (p: string) => /<w:keepNext w:val="1"\/>/.test(pPr(p));
  // In every run of bullets: the first and the second-to-last bullet keep with the next one; the last doesn't
  // (except in EDUCATION, which the keep-education-together fix keeps on one page as a whole).
  const eduStart = d.paragraphs.findIndex((p) => paragraphText(p) === "EDUCATION");
  const eduEnd = d.paragraphs.findIndex((p, i) => i > eduStart && paragraphText(p) === "SKILLS");
  for (let i = 0; i < d.paragraphs.length; i++) {
    if (!isBullet(d.paragraphs[i]) || (i > eduStart && i < eduEnd)) continue;
    const first = !isBullet(d.paragraphs[i - 1] ?? ""), last = !isBullet(d.paragraphs[i + 1] ?? "");
    const secondLast = !last && !isBullet(d.paragraphs[i + 2] ?? "");
    if (last) assert.ok(!keeps(d.paragraphs[i]), `last bullet at ${i} must not keep with next`);
    else if (first || secondLast) assert.ok(keeps(d.paragraphs[i]), `bullet at ${i} should keep with next`);
  }
  assert.ok(!d.paragraphs.map(paragraphText).some((t) => t === "."), "no header rule paragraph");
});

test("render: consistent left edge and spacing, lead-in lines stay with their bullets", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  run("render.ts", dir);
  const d = await openDocx(join(dir, "cv/Kirill_Kohan_CV.docx"));
  const byText = (t: string) => d.paragraphs.find((p) => paragraphText(p) === t || paragraphText(p).startsWith(t + " |"))!;
  for (const t of ["EXPERIENCE", "Senior Software Engineer", "SYSPRO", "National Aviation University"]) {
    assert.match(pPr(byText(t)), /<w:ind w:left="0"[^>]*w:firstLine="0"\/>/, `${t} starts at the margin`);
  }
  assert.match(pPr(byText("Senior Software Engineer")), /w:before="20"/, "first item under a section line gets the small gap");
  assert.match(pPr(byText("Team Leader")), /w:before="80"/, "later job titles get the regular gap");
  const master = d.paragraphs.find((p) => paragraphText(p).includes("| 2020 - 2022"))!;
  assert.match(pPr(master), /<w:keepNext w:val="1"\/>/, "education line keeps with its Honors bullet");
});

test("render turns [text](url) into a real link with that text", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  edit(dir, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* See [my site](https://example.com/x) and delivered the core mobile app");
  run("render.ts", dir);
  const out = join(dir, "cv/Kirill_Kohan_CV.docx");
  const d = await openDocx(out);
  const p = d.paragraphs.find((x) => paragraphText(x).startsWith("See my site and delivered"));
  assert.ok(p, "link rendered as its text, no brackets");
  const rels = await (await JSZip.loadAsync(readFileSync(out))).file("word/_rels/document.xml.rels")!.async("string");
  assert.match(rels, /Target="https:\/\/example\.com\/x"/);
});

test("render removes source comments without leaving double spaces between sentences", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  assert.equal(run("render.ts", dir).code, 0);
  const d = await openDocx(join(dir, "cv/Kirill_Kohan_CV.docx"));
  const texts = d.paragraphs.map(paragraphText);
  const summary = texts.find((t) => t.startsWith("Senior software engineer"))!;
  assert.match(summary, /products\. Core contributor/);
  for (const t of texts) assert.doesNotMatch(t, /\S {2,}\S/, t.slice(0, 60));
});

test("render: the line under section headings starts at the left margin and spans the text width", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  assert.equal(run("render.ts", dir).code, 0);
  const d = await openDocx(join(dir, "cv/Kirill_Kohan_CV.docx"));
  const rule = d.paragraphs.find((p) => p.includes("<w:drawing>") && p.includes("wpg:wgp"))!;
  assert.match(pPr(rule), /<w:ind w:left="0"/);
  assert.match(rule, /<wp:extent cx="6858000"/); // (12240 - 720 - 720) twips x 635 EMU
});

test("render: a job-specific CV is named <Name>_CV even when it starts from a profile", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  const { mkdirSync, writeFileSync, existsSync } = await import("node:fs");
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/cv.md"), readFileSync(join(dir, "cv/Kirill_Kohan_CV.md"), "utf8"));
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: react-native\nrequired: [react-native]\n");
  assert.equal(run("render.ts", dir, ["cv/tailored/acme/cv.md"]).code, 0);
  assert.ok(existsSync(join(dir, "cv/tailored/acme/Kirill_Kohan_CV.docx")));
});

test("render: the page_margins fix sets the page's top margin", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  assert.equal(run("render.ts", dir).code, 0);
  const xml = await (await JSZip.loadAsync(readFileSync(join(dir, "cv/Kirill_Kohan_CV.docx")))).file("word/document.xml")!.async("string");
  assert.match(xml, /<w:pgMar [^>]*w:top="360"/); // classic's smaller-top-margin fix (was 580)
});

test("keep_sections_together keeps every EDUCATION paragraph with the next one", async () => {
  const dir = tempRepo();
  const out = join(dir, "edu.docx");
  const r = run("render.ts", dir, ["--out", out]);
  assert.equal(r.code, 0, r.out);
  const d = await openDocx(out);
  const start = d.paragraphs.findIndex((p) => paragraphText(p) === "EDUCATION");
  const end = d.paragraphs.findIndex((p, i) => i > start && paragraphText(p) === "SKILLS");
  assert.ok(start >= 0 && end > start);
  for (let i = start; i < end - 1; i++) assert.match(pPr(d.paragraphs[i]), /<w:keepNext/, `paragraph ${i - start} of EDUCATION`);
});

test("the classic template's strip_header_text fix leaves no text in the page headers", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  assert.equal(run("render.ts", dir).code, 0);
  const zip = await JSZip.loadAsync(readFileSync(join(dir, "cv/Kirill_Kohan_CV.docx")));
  const headers = Object.keys(zip.files).filter((n) => /^word\/header\d*\.xml$/.test(n));
  assert.ok(headers.length > 0, "the classic template has page headers");
  for (const h of headers) {
    const xml = await zip.file(h)!.async("string");
    assert.deepEqual([...xml.matchAll(/<w:t(?: [^>]*)?>([^<]+)<\/w:t>/g)].map((m) => m[1]), [], `${h} has text`);
  }
});

