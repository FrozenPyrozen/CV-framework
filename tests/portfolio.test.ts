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
    if (f === "itjet-fintech.md") t = t.replace(/^portfolio_projects:[^\n]*\n(?:  - [^\n]*\n)+/m, "").replace(/^  project: fused\n/gm, "");
    writeFileSync(p, t);
  }
};
const P = "portfolio/portfolio.md";
const write = (d: string, intro: string, project: string) => {
  const p = join(d, P);
  writeFileSync(p, readFileSync(p, "utf8").replace("<!-- TODO(/portfolio): write the intro paragraph -->", intro).replace("<!-- TODO(/portfolio): write this project -->", project));
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
  assert.match(md, /### \*\*Itjet \| Full-Stack Engineer\*\*/);
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
  edit(dir, "templates/portfolio-classic/style-map.yaml", /  image:\n    sample: 10\n/, "");
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

test("portfolio refresh: portfolio_title in the title, label | role | period, and images after the product paragraph", () => {
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
  assert.match(md, /### \*\*Fused, an Itjet client \| Full-Stack Engineer\*\*/);
  edit(dir, "summaries/itjet-fintech.md", "  project: fused\n", "  project: nope\n");
  assert.match(run("validate.ts", dir).out, /project "nope" isn't in portfolio_projects/);
});
