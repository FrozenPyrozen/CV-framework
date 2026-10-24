// build: refresh, lint, trace, render and the build record (split from the build tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { CV, edit, run, tempRepo } from "./helpers.ts";

test("build --no-pdf: refresh, lint, trace warning, both markets rendered, build record; status follows changes", () => {
  const dir = tempRepo();
  edit(dir, "cv/Kirill_Kohan_CV.md", "July 2023 - December 2025", "07/2023 - 12/2025"); // a stale job line refresh must fix
  edit(dir, "cv/Kirill_Kohan_CV.md", / <!-- src: velas-wallet#4\.1 -->/, ""); // an unsourced claim: only a warning for the master CV
  // --entries-reviewed: start from a clean record, whatever entries the live repo still has pending.
  const r = run("build.ts", dir, ["cv/Kirill_Kohan_CV.md", "--no-pdf", "--entries-reviewed"]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /refresh: generated parts updated/);
  assert.match(r.out, /trace: \d+ unsourced claim\(s\) \(warning for the master CV\)/);
  assert.ok(existsSync(join(dir, "cv/Kirill_Kohan_CV.docx")));
  assert.ok(existsSync(join(dir, "cv/markets/ukraine/Kirill_Kohan_CV_UA.docx")));
  const state = JSON.parse(readFileSync(join(dir, "cv/.build-state.json"), "utf8"));
  assert.ok(state["cv/Kirill_Kohan_CV.md"].sources["summaries/velas-wallet.md"]);
  assert.match(run("status.ts", dir).out, /ok\s+cv\/Kirill_Kohan_CV\.md/);
  edit(dir, "summaries/velas-wallet.md", "cv_client_label: Velas", "cv_client_label: Velas Network");
  const st = run("status.ts", dir);
  assert.match(st.out, /STALE\s+cv\/Kirill_Kohan_CV\.md/);
  assert.match(st.out, /summaries\/velas-wallet\.md changed/);
});

test("build stops on lint errors", () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  edit(dir, "cv/Kirill_Kohan_CV.md", "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the *core* mobile app");
  const r = run("build.ts", dir, ["--no-pdf"]);
  assert.equal(r.code, 1);
  assert.match(r.out, /FAILED lint: \d+ error\(s\), first: line \d+: italics are not supported/);
});

test("build of a variant fails on unsourced claims; build:all refuses an unapproved template", () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/rn.yaml"), "schema_version: 1\nid: rn\nheadline: Senior React Native Engineer\nsummary_focus: [react-native]\nemphasize_tags: [react-native]\nskills_order: [mobile]\n");
  mkdirSync(join(dir, "cv/variants/rn"), { recursive: true });
  writeFileSync(join(dir, "cv/variants/rn/cv.md"), readFileSync(join(dir, "cv/Kirill_Kohan_CV.md"), "utf8"));
  edit(dir, "cv/variants/rn/cv.md", / <!-- src: velas-wallet#4\.1 -->/, "");
  const v = run("build.ts", dir, ["cv/variants/rn/cv.md", "--no-pdf"]);
  assert.equal(v.code, 1);
  assert.match(v.out, /FAILED trace: \d+ unsourced or unresolved claim/);
  edit(dir, "templates/classic/style-map.yaml", "approved: true", "approved: false");
  const all = run("build.ts", dir, ["--all", "--no-pdf"]);
  assert.equal(all.code, 1);
  assert.match(all.out, /template "classic" is not approved/);
});

test("lint warns when a built variant was edited by hand", () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/rn.yaml"), "schema_version: 1\nid: rn\nheadline: Senior React Native Engineer\nsummary_focus: [react-native]\nemphasize_tags: [react-native]\nskills_order: [mobile]\n");
  mkdirSync(join(dir, "cv/variants/rn"), { recursive: true });
  writeFileSync(join(dir, "cv/variants/rn/cv.md"), readFileSync(join(dir, "cv/Kirill_Kohan_CV.md"), "utf8"));
  run("refresh.ts", dir, ["cv/variants/rn/cv.md"]);
  const sha = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 16);
  const md = readFileSync(join(dir, "cv/variants/rn/cv.md"), "utf8");
  writeFileSync(join(dir, "cv/.build-state.json"), JSON.stringify({ "cv/variants/rn/cv.md": { built_at: "x", template: "classic", md_sha: sha(md), sources: {}, outputs: {} } }));
  assert.doesNotMatch(run("lint.ts", dir, ["cv/variants/rn/cv.md"]).out, /edited by hand/);
  writeFileSync(join(dir, "cv/variants/rn/cv.md"), md.replace("Delivered the research and development (R&D) department's core **React Native** app", "Delivered the main mobile app"));
  assert.match(run("lint.ts", dir, ["cv/variants/rn/cv.md"]).out, /edited by hand since its last build/);
});
