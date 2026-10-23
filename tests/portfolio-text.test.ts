// Portfolio: refresh writes the generated parts, check enforces sources and confidentiality (split from the portfolio tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { edit, run, tempRepo } from "./helpers.ts";
import { optIn, P, write, png } from "./portfolio-helpers.ts";

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
  edit(dir, "summaries/velas-wallet.md", /^portfolio_order: \d+$/m, "portfolio_order: 11"); // after Itjet, so write() fills Itjet first
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Itjet text. <!-- src: itjet-fintech#1 -->");
  edit(dir, "summaries/velas-wallet.md", "show_in_portfolio: true", "show_in_portfolio: false");
  const r = run("portfolio.ts", dir, ["refresh"]);
  assert.match(r.out, /removed: velas-wallet/);
  const md = readFileSync(join(dir, P), "utf8");
  assert.match(md, /Itjet text\./);
  assert.doesNotMatch(md, /project: velas-wallet/);
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
  assert.match(md, /## \*\*Fused \(React Native, React, Node\.js\)\*\*/);
  edit(dir, "summaries/itjet-fintech.md", "  project: fused\n", "  project: nope\n");
  assert.match(run("validate.ts", dir).out, /project "nope" isn't in portfolio_projects/);
});
