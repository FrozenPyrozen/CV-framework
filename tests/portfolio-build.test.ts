// Portfolio: build:portfolio, image checks and the length warning (split from the portfolio tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { edit, run, tempRepo } from "./helpers.ts";
import { optIn, P, write, PNG_1PX, png, withImages, buildA4, EMU_PER_INCH } from "./portfolio-helpers.ts";

test("build:portfolio --no-pdf: one Word file per size with its page size, the public images and the template fonts; no phone", async () => {
  const dir = tempRepo();
  optIn(dir);
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Apps for fintech and fitness clients. <!-- src: itjet-fintech#1 -->", "**What I built**\n\n* Built the RegiStart MVP. <!-- src: itjet-fintech#4.14 -->");
  const r = run("build-portfolio.ts", dir, ["--no-pdf", "--no-pages"]);
  assert.equal(r.code, 0, r.out);
  for (const [size, w, h] of [["A4", 11906, 16838], ["LETTER", 12240, 15840]] as const) {
    const f = join(dir, `portfolio/Kirill_Kohan_Portfolio_${size}.docx`);
    assert.ok(existsSync(f), size);
    const zip = await JSZip.loadAsync(readFileSync(f));
    const xml = await zip.file("word/document.xml")!.async("string");
    assert.match(xml, new RegExp(`<w:pgSz w:w="${w}" w:h="${h}"/>`));
    assert.equal(Object.keys(zip.files).filter((n) => n.startsWith("word/media/") && !n.endsWith("/")).length, 2);
    assert.match(xml, /w:ascii="Rockwell"/);
    assert.match(xml, /My Portfolio/);
    assert.doesNotMatch(xml.replace(/\D/g, ""), /380978919783/);
  }
});

test("portfolio check: an image that isn't a public item is an error; an unused asset is a warning", () => {
  const dir = tempRepo();
  optIn(dir);
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Text. <!-- src: itjet-fintech#1 -->");
  mkdirSync(join(dir, "portfolio/assets/itjet-fintech"), { recursive: true });
  writeFileSync(join(dir, "portfolio/assets/itjet-fintech/unused.png"), PNG_1PX);
  const p = join(dir, P);
  writeFileSync(p, readFileSync(p, "utf8").replace("Text. <!-- src: itjet-fintech#1 -->", "![x](assets/itjet-fintech/unused.png)\n\nText. <!-- src: itjet-fintech#1 -->"));
  const r = run("portfolio.ts", dir, ["check"]);
  assert.equal(r.code, 1);
  assert.match(r.out, /image assets\/itjet-fintech\/unused\.png isn't a public item of itjet-fintech/);
  assert.match(r.out, /warn .*portfolio\/assets\/itjet-fintech\/unused\.png isn't used by any summary/);
});

test("build:portfolio warns about a small image; it is never shown above 150 dpi", () => {
  const dir = tempRepo();
  optIn(dir);
  mkdirSync(join(dir, "portfolio/assets/itjet-fintech"), { recursive: true });
  writeFileSync(join(dir, "portfolio/assets/itjet-fintech/tiny.png"), PNG_1PX);
  edit(dir, "summaries/itjet-fintech.md", "## 8. Portfolio material\n", "## 8. Portfolio material\n\n- image: assets/itjet-fintech/tiny.png\n  caption: A tiny test image\n  public: yes, confirmed by user 2026-10-23\n");
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Text. <!-- src: itjet-fintech#1 -->");
  const r = run("build-portfolio.ts", dir, ["--no-pdf", "--no-pages", "--size", "a4"]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /image assets\/itjet-fintech\/tiny\.png is small \(1x1 px/);
});

test("build:portfolio: at most 4 screenshots per row; a row with a landscape screenshot splits so it stays at least 1.75 in tall", async () => {
  const dir = tempRepo();
  withImages(dir, [["p1", 600, 1200], ["p2", 600, 1200], ["p3", 600, 1200], ["p4", 600, 1200], ["p5", 600, 1200], ["l1", 1600, 900], ["l2", 1600, 900]]);
  const rows = (await buildA4(dir)).filter((p) => p.includes("<wp:inline")).map((p) => [...p.matchAll(/<wp:extent cx="(\d+)" cy="(\d+)"\/>/g)].map((m) => ({ w: Number(m[1]), h: Number(m[2]) })));
  assert.deepEqual(rows.map((r) => r.length), [4, 2, 1], "4 phones; the 5th phone with one landscape; the second landscape alone");
  for (const r of rows) {
    assert.ok(r.every((x) => x.h === r[0].h), "same height in a row");
    if (r.some((x) => x.w / x.h > 1.2)) assert.ok(r[0].h >= 1.75 * EMU_PER_INCH - 1000, `landscape row ${r[0].h / EMU_PER_INCH} in tall`);
    assert.ok(r[0].h <= 0.25 * (16838 - 2 * 1134) * 635 + 1000, "at most 25% of the content height");
  }
});

test("build:portfolio: title parentheses keep non-breaking spaces; the cover has its top row and an unshaded paragraph after the banner", async () => {
  const dir = tempRepo();
  withImages(dir, [["p1", 600, 1200]]);
  const ps = await buildA4(dir);
  const text = (p: string) => [...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((m) => m[1]).join("");
  assert.ok(ps.some((p) => text(p) === "Client apps (React, React Native, Node.js)"), "title parentheses on one line");
  assert.ok(ps[0].includes("<w:shd") && text(ps[0]) === "", "cover_top: an empty banner row first");
  const name = ps.findIndex((p) => text(p) === "Kirill Kohan");
  assert.ok(name > 0 && ps.slice(0, name + 1).every((p) => p.includes("<w:shd")), "the banner is one shaded block");
  assert.ok(!ps[name + 1].includes("<w:shd"), "an unshaded paragraph after the banner");
});

test("portfolio check: a doc:<id> source must be an imported document; a page over 420 words is a warning", () => {
  const dir = tempRepo();
  optIn(dir);
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Fused and other client apps. <!-- src: doc:portfolio-2025-09 -->\n\nMore apps. <!-- src: doc:no-such-doc -->");
  const bad = run("portfolio.ts", dir, ["check"]);
  assert.equal(bad.code, 1);
  assert.match(bad.out, /source "doc:no-such-doc" isn't an imported document/);
  assert.doesNotMatch(bad.out, /doc:portfolio-2025-09/);
  const p = join(dir, P);
  writeFileSync(p, readFileSync(p, "utf8").replace("More apps. <!-- src: doc:no-such-doc -->", "Built the RegiStart app for clients. <!-- src: itjet-fintech#1 -->\n".repeat(70)));
  const ok = run("portfolio.ts", dir, ["check"]);
  assert.equal(ok.code, 0, ok.out);
  assert.match(ok.out, /itjet-fintech: 4\d\d words \(about 420 fit one page/);
});
