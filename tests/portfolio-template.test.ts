// npm run portfolio-template: the generated portfolio template, and its approval surviving an unchanged rerun only.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { run, tempRepo } from "./helpers.ts";

test("portfolio-template writes the template unapproved; a rerun keeps approval only when nothing else changed", () => {
  const dir = tempRepo();
  const sm = join(dir, "templates/t-portfolio/style-map.yaml");
  const first = run("portfolio-template.ts", dir, ["--name", "t-portfolio"]);
  assert.equal(first.code, 0, first.out);
  for (const f of ["template.docx", "style-map.yaml", "fixes.yaml"]) assert.ok(existsSync(join(dir, "templates/t-portfolio", f)), f);
  assert.match(readFileSync(sm, "utf8"), /^approved: false/m);
  assert.match(first.out, /approved: false until you approve the previews/);

  writeFileSync(sm, readFileSync(sm, "utf8").replace(/^approved: false.*$/m, "approved: true"));
  const again = run("portfolio-template.ts", dir, ["--name", "t-portfolio"]);
  assert.match(again.out, /still approved/);
  assert.match(readFileSync(sm, "utf8"), /^approved: true/m);

  // A style map that differs (here: a hand edit) is regenerated, and approval is reset.
  writeFileSync(sm, readFileSync(sm, "utf8").replace("underline: true", "underline: false"));
  run("portfolio-template.ts", dir, ["--name", "t-portfolio"]);
  assert.match(readFileSync(sm, "utf8"), /^approved: false/m);
});
