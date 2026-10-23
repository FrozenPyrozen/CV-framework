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
  edit(dir, "summaries/itjet-fintech.md", "show_in_cv: true", "show_in_cv: true\nshow_in_portfolio: true\nportfolio_order: 2\nportfolio_max_items: 6");
  const r = run("validate.ts", dir);
  assert.equal(r.code, 0, r.out);
});

const broken: [string, (d: string) => void, RegExp][] = [
  ["a missing image", (d) => edit(d, "summaries/itjet-fintech.md", "image30.png", "image99.png"), /no such file \(paths are relative to portfolio\/\)/],
  ["a public value without the user's confirmation", (d) => edit(d, "summaries/itjet-fintech.md", "public: yes, confirmed by user 2026-10-22", "public: yes"), /public must be "no" or "yes, confirmed by user YYYY-MM-DD"/],
  ["an image without a caption", (d) => edit(d, "summaries/itjet-fintech.md", /  caption: Fused web app, the coach's workout schedule\n/, ""), /needs a caption/],
  ["a link that isn't a URL", (d) => edit(d, "summaries/itjet-fintech.md", "## 8. Portfolio material\n", "## 8. Portfolio material\n\n- link: example.org\n  label: Site\n  public: no\n"), /must start with http/],
  ["a portfolio_label naming a hidden client", (d) => edit(d, "summaries/orion-mobile-clinical-ink.md", "cv_client_label: Clinical Trials Patient App", "cv_client_label: Clinical Trials Patient App\nportfolio_label: Clinical Ink patient app"), /names the client the CV hides/],
  ["an unknown portfolio field", (d) => edit(d, "summaries/itjet-fintech.md", "show_in_cv: true", "show_in_cv: true\nportfolio_title: x"), /must NOT have additional properties/],
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
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const optIn = (d: string) => edit(d, "summaries/itjet-fintech.md", "show_in_cv: true", "show_in_cv: true\nshow_in_portfolio: true\nportfolio_order: 1");
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
  assert.match(md, /### \*\*Itjet \| August 2019 - November 2020\*\*/);
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
  edit(dir, "summaries/velas-wallet.md", "show_in_cv: true", "show_in_cv: true\nshow_in_portfolio: true\nportfolio_order: 2");
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Itjet text. <!-- src: itjet-fintech#1 -->");
  edit(dir, "summaries/velas-wallet.md", "show_in_portfolio: true", "show_in_portfolio: false");
  const r = run("portfolio.ts", dir, ["refresh"]);
  assert.match(r.out, /removed: velas-wallet/);
  const md = readFileSync(join(dir, P), "utf8");
  assert.match(md, /Itjet text\./);
  assert.doesNotMatch(md, /project: velas-wallet/);
});
