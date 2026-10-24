// Portfolio: summary fields, section 8 items, templates and reports in validate (split from the portfolio tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CV, edit, run, tempRepo } from "./helpers.ts";
import { parsePortfolioItems } from "../scripts/lib/repo.ts";
import { png } from "./portfolio-helpers.ts";

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
  ["a portfolio_label naming a hidden client", (d) => edit(d, "summaries/designai-jira-plugin.md", "cv_client_label: Generative AI Jira Plugin", "cv_client_label: Generative AI Jira Plugin\nportfolio_label: Velocity AI Jira app"), /names the client the CV hides/],
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
