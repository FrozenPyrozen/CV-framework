// Imported documents (specs/sources-spec.md): import-doc and the validate checks for sources and doc:<id>.
import { test } from "node:test";
import assert from "node:assert/strict";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { edit, REPO, run, tempRepo } from "./helpers.ts";
import { parseSummary } from "../scripts/lib/repo.ts";

const OLD_CV = join(REPO, "templates/classic/source.docx");
const importCv = (dir: string, extra: string[] = []) => run("import-doc.ts", dir, [OLD_CV, "--date", "2025-10", "--kind", "cv", "--id", "cv-2025-10", ...extra]);

test("import-doc keeps the original, extracts its text and lists it; validate passes", () => {
  const dir = tempRepo();
  const r = importCv(dir);
  assert.equal(r.code, 0, r.out);
  assert.ok(existsSync(join(dir, "sources/files/cv-2025-10.docx")));
  const text = readFileSync(join(dir, "sources/text/cv-2025-10.md"), "utf8");
  assert.match(text, /EXPERIENCE/);
  assert.match(text, /General Motors\t/); // run tabs survive
  assert.match(readFileSync(join(dir, "sources/index.yaml"), "utf8"), /id: cv-2025-10[\s\S]*status: imported/);
  assert.equal(run("validate.ts", dir).code, 0);
});

test("import-doc refuses the same file twice, unreadable types, a missing date and an empty document", () => {
  const dir = tempRepo();
  assert.equal(importCv(dir).code, 0);
  assert.match(importCv(dir, ["--id", "other"]).out, /already imported as "cv-2025-10"/);
  const keynote = join(dir, "old.key");
  writeFileSync(keynote, "x");
  assert.match(run("import-doc.ts", dir, [keynote, "--date", "2020", "--kind", "cv"]).out, /export it to PDF first/);
  const md = join(dir, "portfolio.md");
  writeFileSync(md, "# Portfolio\n");
  assert.match(run("import-doc.ts", dir, [md, "--kind", "portfolio"]).out, /--date must be YYYY-MM or YYYY/);
  assert.match(run("import-doc.ts", dir, [md, "--date", "2022"]).out, /almost no text/);
  assert.ok(!existsSync(join(dir, "sources/files/portfolio-2022.md")));
});

test("a newer document is listed first; the kind is read from the file name", () => {
  const dir = tempRepo();
  assert.equal(importCv(dir).code, 0);
  const md = join(dir, "My Portfolio.md");
  writeFileSync(md, "# Portfolio\n\n" + "Built a wallet app with React Native and a design system for mobile and web. ".repeat(3));
  const r = run("import-doc.ts", dir, [md, "--date", "2026-01"]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /my-portfolio-2026-01 \(portfolio, 2026-01\)/);
  const idx = readFileSync(join(dir, "sources/index.yaml"), "utf8");
  assert.ok(idx.indexOf("my-portfolio-2026-01") < idx.indexOf("cv-2025-10"));
});

test("a contribution's Source line is parsed, not part of its body", () => {
  const s = parseSummary(`---\nid: x\n---\n## 4. My contributions\n\n### 4.1 Thing\n\nDid it.\n\nTags: react\nSource: doc:cv-2021\n`);
  assert.equal(s.contributions[0].source, "doc:cv-2021");
  assert.equal(s.contributions[0].body, "Did it.");
});

const broken: [string, (d: string) => void, RegExp][] = [
  ["a doc: reference to a document that isn't imported", (d) => edit(d, "summaries/velas-wallet.md", "## 8. Portfolio material\n", "## 8. Portfolio material\n\nScreenshots described in the old CV (doc:cv-2019).\n"), /doc:cv-2019 is not a document/],
  ["a malformed Source line", (d) => edit(d, "summaries/velas-wallet.md", /^(Tags: .*)$/m, "$1\nSource: old cv"), /Source must be "doc:<id>"/],
  ["an original changed after import", (d) => { assert.equal(importCv(d).code, 0); appendFileSync(join(d, "sources/files/cv-2025-10.docx"), "x"); }, /changed since it was imported/],
  ["a missing text file", (d) => { assert.equal(importCv(d).code, 0); writeFileSync(join(d, "sources/index.yaml"), readFileSync(join(d, "sources/index.yaml"), "utf8").replace("text: sources/text/cv-2025-10.md", "text: sources/text/nope.md")); }, /text sources\/text\/nope\.md is missing/],
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

test("a doc: reference to an imported document passes", () => {
  const dir = tempRepo();
  assert.equal(importCv(dir).code, 0);
  edit(dir, "summaries/velas-wallet.md", /^(Tags: .*)$/m, "$1\nSource: doc:cv-2025-10");
  const r = run("validate.ts", dir);
  assert.equal(r.code, 0, r.out);
});

test("import-doc names what .pages needs when Pages can't be used, and leaves no trace", { skip: process.platform === "darwin" }, () => {
  const dir = tempRepo();
  const f = join(dir, "old.pages");
  writeFileSync(f, "x");
  const r = run("import-doc.ts", dir, [f, "--date", "2020", "--kind", "portfolio"]);
  assert.match(r.out, /needs Pages on macOS/);
  assert.ok(!existsSync(join(dir, "sources/index.yaml")));
});
