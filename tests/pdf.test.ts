// Tests for PDF export and pdf-check (step 5, part 3b).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { run, tempRepo } from "./helpers.ts";
import { markdownVisibleText, missingWords, normalizeText, tokens } from "../scripts/lib/text.ts";
import { withLock } from "../scripts/lib/lock.ts";
import { openDocx } from "../scripts/lib/docx.ts";

test("normalizeText: ligatures, quotes, dashes, line-end hyphens, spaces", () => {
  assert.equal(normalizeText("deﬁnitions “quoted” – data-\nmodel x"), 'definitions "quoted" - data-model x');
  assert.deepEqual(tokens("React Native, Node.js and CI/CD (E2E)!"), ["react", "native", "node.js", "and", "ci/cd", "e2e"]);
});

test("markdownVisibleText shows the header link as its label and drops markers and comments", () => {
  const t = markdownVisibleText("<!-- generated:header -->\n# **Name**\n+380 1 | a@b.co | Portfolio: https://x.y/z\n* **Bold** text <!-- src: a#4.1 -->");
  assert.equal(t.trim(), "Name\n+380 1 | a@b.co | Portfolio\nBold text");
});

test("missingWords counts repeats", () => {
  assert.deepEqual(missingWords(["a", "b", "b", "c"], ["b", "a", "c"]), ["b"]);
});

test("withLock runs exports one at a time", async () => {
  const dir = tempRepo();
  const lock = join(dir, ".cv-runs/export.lock");
  const log: string[] = [];
  const job = (name: string) => withLock(lock, async () => { log.push(`${name}:start`); await new Promise((r) => setTimeout(r, 150)); log.push(`${name}:end`); });
  await Promise.all([job("a"), job("b")]);
  assert.deepEqual(log.map((x) => x.split(":")[1]), ["start", "end", "start", "end"]);
  assert.ok(!existsSync(lock), "lock released");
});

test("pdf reports clearly when no exporter is available", () => {
  const dir = tempRepo();
  writeFileSync(join(dir, "x.docx"), "");
  const r = run("export-pdf.ts", dir, ["x.docx", "--exporter", "nope"]);
  assert.equal(r.code, 1);
  assert.match(r.out, /no PDF exporter available \(nope: unknown exporter\)/);
});

test("render applies the no-ligatures letter spacing to every run", async () => {
  const dir = tempRepo();
  run("refresh.ts", dir);
  run("render.ts", dir);
  const d = await openDocx(join(dir, "cv/Kirill_Kohan_CV.docx"));
  const xml = d.paragraphs.join("");
  const runs = xml.match(/<w:rPr>[\s\S]*?<\/w:rPr>/g)!;
  assert.ok(runs.length > 100);
  assert.ok(runs.every((r) => r.includes('<w:spacing w:val="1"/>')), "every run has letter spacing 1");
});

const pagesAvailable = process.platform === "darwin" && existsSync("/Applications/Pages.app");

test("Pages export + pdf-check: worldwide and Ukraine pass; a tampered Markdown fails", { skip: !pagesAvailable && "needs Pages (macOS)", timeout: 240_000 }, () => {
  const dir = tempRepo();
  assert.equal(run("refresh.ts", dir).code, 0);
  assert.equal(run("market.ts", dir).code, 0);
  for (const md of ["cv/Kirill_Kohan_CV.md", "cv/markets/ukraine/Kirill_Kohan_CV_UA.md"]) {
    assert.equal(run("render.ts", dir, [md]).code, 0);
    const pdf = run("export-pdf.ts", dir, [md.replace(".md", ".docx")]);
    assert.equal(pdf.code, 0, pdf.out);
    const chk = run("pdf-check.ts", dir, [md.replace(".md", ".pdf")]);
    assert.equal(chk.code, 0, chk.out);
    assert.match(readFileSync(join(dir, md.replace(/[^/]+$/, "pdf-check.md")), "utf8"), /Result: \*\*pass\*\*/);
  }
  // Tamper: a word in the Markdown that the PDF doesn't have, and a phone number in the Ukraine Markdown.
  const ww = join(dir, "cv/Kirill_Kohan_CV.md");
  writeFileSync(ww, readFileSync(ww, "utf8").replace("Delivered the core mobile app", "Delivered the zyxwvut core mobile app"));
  const bad = run("pdf-check.ts", dir, ["cv/Kirill_Kohan_CV.pdf"]);
  assert.equal(bad.code, 1);
  assert.match(bad.out, /missing in the PDF: zyxwvut/);
});

test("withLock clears a lock left by a process that no longer runs", async () => {
  const dir = tempRepo();
  const lock = join(dir, ".cv-runs/export.lock");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(join(dir, ".cv-runs"), { recursive: true });
  writeFileSync(lock, "999999\n2026-10-15T00:00:00Z\n"); // pid that doesn't exist, fresh file
  const started = Date.now();
  await withLock(lock, () => undefined, { waitMs: 5_000 });
  assert.ok(Date.now() - started < 2_000, "didn't wait for the stale lock");
});
