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
