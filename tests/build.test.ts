// Tests for build, build:all and status (step 5, part 3c).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { edit, run, tempRepo } from "./helpers.ts";

const pagesAvailable = process.platform === "darwin" && existsSync("/Applications/Pages.app");

test("build --no-pdf: refresh, lint, trace warning, both markets rendered, build record; status follows changes", () => {
  const dir = tempRepo();
  edit(dir, "cv/Kirill_Kohan_CV.md", "December 2025 - Present", "12/2025 - Present"); // a stale job line refresh must fix
  edit(dir, "cv/Kirill_Kohan_CV.md", / <!-- src: velas-wallet#4\.1 -->/, ""); // an unsourced claim: only a warning for the master CV
  const r = run("build.ts", dir, ["--no-pdf"]);
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
  edit(dir, "cv/Kirill_Kohan_CV.md", "* Delivered the R&D department's core **React Native** app", "* Delivered the *core* mobile app");
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
  writeFileSync(join(dir, "cv/variants/rn/cv.md"), md.replace("Delivered the R&D department's core **React Native** app", "Delivered the main mobile app"));
  assert.match(run("lint.ts", dir, ["cv/variants/rn/cv.md"]).out, /edited by hand since its last build/);
});

test("status warns once about a sent CV that changed, until acknowledged", () => {
  const dir = tempRepo();
  run("build.ts", dir, ["--no-pdf"]);
  writeFileSync(join(dir, "facts/applications.yaml"), '- company: Acme\n  role: Senior RN\n  date: 2026-10-20\n  pdf: cv/Kirill_Kohan_CV.docx\n  pdf_sha256: "0000000000000000"\n  status: applied\n- company: Beta\n  pdf: cv/Kirill_Kohan_CV.docx\n  pdf_sha256: 0000000000000000\n');
  assert.match(run("status.ts", dir).out, /SENT\s+Acme \(Senior RN\) received an older version/);
  run("status.ts", dir, ["--ack", "Acme"]);
  const after = run("status.ts", dir).out;
  assert.doesNotMatch(after, /SENT\s+Acme/);
  assert.match(after, /SENT\s+Beta: quote pdf_sha256/);
});

test("full build with Pages: PDFs, pdf-check and previews for both markets", { skip: !pagesAvailable && "needs Pages (macOS)", timeout: 300_000 }, () => {
  const dir = tempRepo();
  const r = run("build.ts", dir);
  assert.equal(r.code, 0, r.out);
  for (const f of ["cv/Kirill_Kohan_CV.pdf", "cv/pdf-check.md", "cv/preview/page-1.png", "cv/markets/ukraine/Kirill_Kohan_CV_UA.pdf", "cv/markets/ukraine/preview/page-1.png"]) {
    assert.ok(existsSync(join(dir, f)), f);
  }
  assert.match(readFileSync(join(dir, "cv/markets/ukraine/pdf-check.md"), "utf8"), /Result: \*\*pass\*\*/);
});

test("build records per-entry hashes; status names only the entries that changed", () => {
  const dir = tempRepo();
  run("build.ts", dir, ["--no-pdf"]);
  const state = JSON.parse(readFileSync(join(dir, "cv/.build-state.json"), "utf8"));
  assert.ok(state["cv/Kirill_Kohan_CV.md"].entries["various-clients"]);
  edit(dir, "facts/confirmed.yaml", "giving technical consulting and educational webinars.", "giving technical consulting, workshops and educational webinars.");
  const st = run("status.ts", dir).out;
  assert.match(st, /entries to update: various-clients$/m); // the master CV (composer)
  assert.match(st, /run \/compose for the master CV and \/variants for role variants first/);
  edit(dir, "facts/decisions.yaml", "decision: Keep the master CV's current length", "decision: Keep the master CV's present length");
  assert.doesNotMatch(run("status.ts", dir).out, /decisions\.yaml/);
  // A rebuild without rewriting the CV keeps the entry listed; --entries-reviewed (or an edited CV) clears it.
  run("build.ts", dir, ["--no-pdf"]);
  assert.match(run("status.ts", dir).out, /entries to update: various-clients$/m);
  run("build.ts", dir, ["--no-pdf", "--entries-reviewed"]);
  assert.doesNotMatch(run("status.ts", dir).out, /entries to update/);
});

test("build --market builds one market; a tailored CV gets only the default market", () => {
  const dir = tempRepo();
  const ua = run("build.ts", dir, ["--no-pdf", "--market", "ukraine"]);
  assert.equal(ua.code, 0, ua.out);
  assert.match(ua.out, /markets: ukraine/);
  assert.doesNotMatch(ua.out, /render \(default market\)/);
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  run("refresh.ts", dir);
  // Tailored CVs must be fully sourced: give every claim a placeholder source so the build reaches the markets step.
  const sourced = readFileSync(join(dir, "cv/Kirill_Kohan_CV.md"), "utf8").split("\n")
    .map((l) => (/^\* /.test(l) || /^Senior software engineer/.test(l) ? `${l} <!-- src: profile -->` : l)).join("\n");
  writeFileSync(join(dir, "cv/tailored/acme/cv.md"), sourced);
  const t = run("build.ts", dir, ["cv/tailored/acme/cv.md", "--no-pdf"]);
  assert.equal(t.code, 0, t.out);
  assert.match(t.out, /markets: worldwide/);
  assert.ok(!existsSync(join(dir, "cv/tailored/acme/markets")), "no Ukraine version for a tailored CV unless asked");
});
