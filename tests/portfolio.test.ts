// Portfolio phase P1 (specs/outputs/portfolio.md 3): summary fields and structured section 8 items.
import { test } from "node:test";
import assert from "node:assert/strict";
import { edit, run, tempRepo } from "./helpers.ts";
import { parsePortfolioItems } from "../scripts/lib/repo.ts";

test("section 8 items are parsed; free text stays notes", () => {
  const items = parsePortfolioItems(`
- image: ../sources/media/doc/a.png
  caption: Home screen
  public: yes, confirmed by user 2026-10-23
- link: https://example.org/app
  label: App store page
  public: no

Some free-text note.
- demo: a screen recording on request
  public: no
`);
  assert.equal(items.length, 3);
  assert.deepEqual(items.map((i) => [i.kind, i.isPublic]), [["image", true], ["link", false], ["demo", false]]);
  assert.equal(items[0].caption, "Home screen");
  assert.equal(items[1].label, "App store page");
});

test("the repo's portfolio material and fields validate", () => {
  const dir = tempRepo();
  edit(dir, "summaries/itjet-fintech.md", /^portfolio_order: \d+$/m, "portfolio_order: 2\nportfolio_max_items: 6");
  const r = run("validate.ts", dir);
  assert.equal(r.code, 0, r.out);
});

const broken: [string, (d: string) => void, RegExp][] = [
  ["a missing image", (d) => edit(d, "summaries/itjet-fintech.md", "image30.png", "image99.png"), /no such file \(paths are relative to portfolio\/\)/],
  ["a public value without the user's confirmation", (d) => edit(d, "summaries/itjet-fintech.md", "public: yes, confirmed by user 2026-10-22", "public: yes"), /public must be "no" or "yes, confirmed by user YYYY-MM-DD"/],
  ["an image without a caption", (d) => edit(d, "summaries/itjet-fintech.md", /  caption: Fused web app, the coach's workout schedule\n/, ""), /needs a caption/],
  ["a link that isn't a URL", (d) => edit(d, "summaries/itjet-fintech.md", "## 8. Portfolio material\n", "## 8. Portfolio material\n\n- link: example.org\n  label: Site\n  public: no\n"), /must start with http/],
  ["a portfolio_label naming a hidden client", (d) => edit(d, "summaries/orion-mobile-clinical-ink.md", "cv_client_label: Clinical Trials Patient App", "cv_client_label: Clinical Trials Patient App\nportfolio_label: Clinical Ink patient app"), /names the client the CV hides/],
  ["an unknown portfolio field", (d) => edit(d, "summaries/itjet-fintech.md", "show_in_cv: true", "show_in_cv: true\nportfolio_subtitle: x"), /must NOT have additional properties/],
];
for (const [name, breakIt, expected] of broken) {
  test(`validate catches ${name}`, () => {
    const dir = tempRepo();
    breakIt(dir);
    const r = run("validate.ts", dir);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, expected);
  });
}

// P3: refresh writes the generated parts, check enforces sources and confidentiality, status tracks projects.
import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Only the Itjet project in the portfolio (the real summaries opt every job in), and no build records copied from
// the real repo (they would hold the real portfolio's build).
const optIn = (d: string) => {
  rmSync(join(d, "cv/.build-state.json"), { force: true });
  for (const f of readdirSync(join(d, "summaries")).filter((x) => x.endsWith(".md"))) {
    const p = join(d, "summaries", f);
    // Itjet as one page (its portfolio_projects and the screenshots' project keys removed): the older tests below.
    let t = readFileSync(p, "utf8").replace(/^show_in_portfolio: true.*$/m, f === "itjet-fintech.md" ? "show_in_portfolio: true" : "show_in_portfolio: false");
    if (f === "itjet-fintech.md") t = t.replace(/^portfolio_projects:[^\n]*\n(?:  - [^\n]*\n)+/m, "").replace(/^- image: \.\.\/sources\/media\/(?:portfolio-2025-09\/|portfolio-2025-04\/image(?:8|9|10)\.tif)[^\n]*\n(?:  [^\n]*\n)*/gm, "").replace(/^  project: [\w-]+\n/gm, "");
    writeFileSync(p, t);
  }
};
const P = "portfolio/portfolio.md";
const write = (d: string, intro: string, project: string) => {
  const p = join(d, P);
  // The intro is optional now (the published portfolio has none): it goes right after the cover.
  writeFileSync(p, readFileSync(p, "utf8").replace("<!-- /generated:portfolio-cover -->\n", `<!-- /generated:portfolio-cover -->\n\n${intro}\n`).replace("<!-- TODO(/portfolio): write this project -->", project));
};

test("portfolio refresh: cover without phone or self-link, only public images, placeholders; check refuses placeholders", () => {
  const dir = tempRepo();
  optIn(dir);
  assert.equal(run("portfolio.ts", dir, ["refresh"]).code, 0);
  const md = readFileSync(join(dir, P), "utf8");
  assert.match(md, /# \*\*My Portfolio\*\*/);
  assert.doesNotMatch(md, /\+380/);
  assert.doesNotMatch(md, /drive\.google\.com/);
  assert.match(md, /!\[Fused web app, the coach's workout schedule\]\(\.\.\/sources\/media\/portfolio-2025-04\/image32\.png\)/);
  assert.doesNotMatch(md, /^### /m, "title-only pages, as on the published portfolio");
  assert.match(md, /github\.com\/FrozenPyrozen/);
  assert.match(md, /## \*\*Kirill Kohan\*\*/);
  assert.doesNotMatch(md, /## \*\*Skills\*\*/);
  assert.doesNotMatch(md, /^\*Fused web app/m, "captions aren't printed");
  assert.doesNotMatch(md, /August 2019|November 2020/, "no dates in the portfolio");
  const c = run("portfolio.ts", dir, ["check"]);
  assert.equal(c.code, 1);
  assert.match(c.out, /itjet-fintech: not written yet/);
});

test("portfolio check: sources, project ownership and confidentiality; a passing check records state for status", () => {
  const dir = tempRepo();
  optIn(dir);
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Apps for fintech, non-profit and fitness clients. <!-- src: itjet-fintech#1 --> Clinical Ink too. <!-- src: itjet-fintech#1 -->",
    "**What I built**\n\n* Built the RegiStart MVP. <!-- src: itjet-fintech#4.14 -->\n* Built the Velas wallet. <!-- src: velas-wallet#4.1 -->\n* Built something unsourced.");
  const bad = run("portfolio.ts", dir, ["check"]);
  assert.equal(bad.code, 1);
  assert.match(bad.out, /confidential term "Clinical Ink"/);
  assert.match(bad.out, /velas-wallet#4\.1" is from a project that isn't in the portfolio/);
  assert.match(bad.out, /bullet without a source: "Built something unsourced\."/);
  const p = join(dir, P);
  writeFileSync(p, readFileSync(p, "utf8").replace(" Clinical Ink too. <!-- src: itjet-fintech#1 -->", "").replace("* Built the Velas wallet. <!-- src: velas-wallet#4.1 -->\n", "").replace("* Built something unsourced.", "* Built the Fused athlete web app. <!-- src: itjet-fintech#4.15 -->"));
  const ok = run("portfolio.ts", dir, ["check"]);
  assert.equal(ok.code, 0, ok.out);
  assert.match(run("status.ts", dir).out, /ok +portfolio\/portfolio\.md/);
  edit(dir, "summaries/itjet-fintech.md", "RegiStart. Built the MVP from sketches", "RegiStart. Built the whole MVP from sketches");
  assert.match(run("status.ts", dir).out, /projects to rewrite \(their summaries changed\): itjet-fintech/);
  assert.equal(run("portfolio.ts", dir, ["check", "--projects-reviewed"]).code, 0);
  assert.doesNotMatch(run("status.ts", dir).out, /projects to rewrite/);
});

test("portfolio refresh drops a project that is no longer opted in and keeps the others' text", () => {
  const dir = tempRepo();
  optIn(dir);
  edit(dir, "summaries/velas-wallet.md", "show_in_portfolio: false", "show_in_portfolio: true");
  edit(dir, "summaries/velas-wallet.md", /^portfolio_order: \d+$/m, "portfolio_order: 9"); // after Itjet, so write() fills Itjet first
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Itjet text. <!-- src: itjet-fintech#1 -->");
  edit(dir, "summaries/velas-wallet.md", "show_in_portfolio: true", "show_in_portfolio: false");
  const r = run("portfolio.ts", dir, ["refresh"]);
  assert.match(r.out, /removed: velas-wallet/);
  const md = readFileSync(join(dir, P), "utf8");
  assert.match(md, /Itjet text\./);
  assert.doesNotMatch(md, /project: velas-wallet/);
});

// P4: the portfolio template, renderer and build (without PDF export, so no Pages is needed).
import JSZip from "jszip";
import { existsSync } from "node:fs";

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

test("the CV renderer refuses a portfolio template; a portfolio style map needs its paragraph types", () => {
  const dir = tempRepo();
  const r = run("render.ts", dir, ["--template", "portfolio-classic", "--out", join(dir, "x.docx")]);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /is a portfolio template/);
  edit(dir, "templates/portfolio-classic/style-map.yaml", /  image:\n    sample: \d+\n/, "");
  const v = run("validate.ts", dir);
  assert.equal(v.code, 1);
  assert.match(v.out, /must have required property 'image'/);
});

// P6: image checks and portfolio reviews.
import { mkdirSync } from "node:fs";
const PNG_1PX = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

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

test("validate: a portfolio report may only use a rubric with a portfolio mode", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "reports/2026-10-23-1200"), { recursive: true });
  const fm = (rubric: string) => `---\nschema_version: 1\nrubric: ${rubric}\ncv: portfolio/portfolio.md\njob_ad: null\nmarket: null\nreviewed_at: 2026-10-23T12:00\nverdict: pass\nscore: 9\n---\n\n# Review\n`;
  writeFileSync(join(dir, "reports/2026-10-23-1200/layout.md"), fm("layout"));
  assert.equal(run("validate.ts", dir).code, 0);
  writeFileSync(join(dir, "reports/2026-10-23-1200/ats.md"), fm("ats"));
  const v = run("validate.ts", dir);
  assert.equal(v.code, 1);
  assert.match(v.out, /rubric "ats" has no portfolio mode/);
});

test("portfolio refresh: portfolio_title in the title (no meta line or dates), and images after the product paragraph", () => {
  const dir = tempRepo();
  optIn(dir);
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Fused and other client apps. <!-- src: itjet-fintech#1 -->\n\n**Responsibilities**\n\n* Built the RegiStart MVP. <!-- src: itjet-fintech#4.14 -->");
  run("portfolio.ts", dir, ["refresh"]);
  const md = readFileSync(join(dir, P), "utf8");
  assert.match(md, /## \*\*Full-Stack Engineer\*\*/);
  const intro = md.indexOf("Fused and other client apps."), img = md.indexOf("![Fused web app"), label = md.indexOf("**Responsibilities**");
  assert.ok(intro > 0 && intro < img && img < label, "product paragraph, then images, then Responsibilities");
  assert.equal(run("portfolio.ts", dir, ["refresh"]).code, 0);
  assert.equal(readFileSync(join(dir, P), "utf8"), md, "refresh is stable");
});


test("portfolio_projects: one summary gives several pages; screenshots go to the page their project key names", () => {
  const dir = tempRepo();
  for (const f of readdirSync(join(dir, "summaries")).filter((x) => x.endsWith(".md") && x !== "itjet-fintech.md")) {
    const p = join(dir, "summaries", f);
    writeFileSync(p, readFileSync(p, "utf8").replace(/^show_in_portfolio: true.*$/m, "show_in_portfolio: false"));
  }
  rmSync(join(dir, "cv/.build-state.json"), { force: true });
  const r = run("portfolio.ts", dir, ["refresh"]);
  assert.equal(r.code, 0, r.out);
  const md = readFileSync(join(dir, P), "utf8");
  for (const id of ["aspiration-signup", "aspiration-web", "registart", "fused", "wink", "golfuture", "oroscopo"]) assert.match(md, new RegExp(`<!-- project: itjet-fintech/${id} -->`));
  const fused = md.slice(md.indexOf("<!-- project: itjet-fintech/fused -->"), md.indexOf("<!-- project: itjet-fintech/wink -->"));
  assert.match(fused, /image30\.png/);
  assert.doesNotMatch(md.slice(0, md.indexOf("<!-- project: itjet-fintech/fused -->")), /image30\.png/);
  assert.match(md, /## \*\*Fused \(web, mobile and backend\)\*\*/);
  edit(dir, "summaries/itjet-fintech.md", "  project: fused\n", "  project: nope\n");
  assert.match(run("validate.ts", dir).out, /project "nope" isn't in portfolio_projects/);
});

// Alignment with the published portfolio (docs/changelog.md row 91): image rows, title parentheses, the cover banner, doc: sources,
// the length warning.
import { deflateSync } from "node:zlib";

// A valid grayscale PNG of any size (the renderer reads the size from the IHDR chunk; Word gets real image data).
function png(w: number, h: number): Buffer {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b: Buffer) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 0;
  const raw = Buffer.alloc((w + 1) * h, 0xff); for (let y = 0; y < h; y++) raw[y * (w + 1)] = 0;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

// Itjet as one page with only the given screenshots (assets/itjet-fintech/<name>.png) and a portfolio_title.
function withImages(dir: string, imgs: [string, number, number][], title = "Client apps (React, React Native, Node.js)") {
  optIn(dir);
  mkdirSync(join(dir, "portfolio/assets/itjet-fintech"), { recursive: true });
  const items = imgs.map(([n, w, h]) => {
    writeFileSync(join(dir, `portfolio/assets/itjet-fintech/${n}.png`), png(w, h));
    return `- image: assets/itjet-fintech/${n}.png\n  caption: A test screen\n  public: yes, confirmed by user 2026-10-23\n`;
  }).join("");
  const p = join(dir, "summaries/itjet-fintech.md");
  writeFileSync(p, readFileSync(p, "utf8").replace(/^- image: [^\n]*\n(?:  [^\n]*\n)*/gm, "").replace("## 8. Portfolio material\n", `## 8. Portfolio material\n\n${items}`).replace(/^show_in_portfolio: true$/m, `show_in_portfolio: true\nportfolio_title: ${title}`));
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Client apps. <!-- src: itjet-fintech#1 -->");
}
async function buildA4(dir: string): Promise<string[]> {
  const r = run("build-portfolio.ts", dir, ["--no-pdf", "--no-pages", "--size", "a4"]);
  assert.equal(r.code, 0, r.out);
  const zip = await JSZip.loadAsync(readFileSync(join(dir, "portfolio/Kirill_Kohan_Portfolio_A4.docx")));
  return (await zip.file("word/document.xml")!.async("string")).match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? [];
}
const EMU_PER_INCH = 914400;

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

