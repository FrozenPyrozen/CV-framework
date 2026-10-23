// build with Pages: the full build that exports PDFs (split from the build tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { run, slow, tempRepo } from "./helpers.ts";

const pagesAvailable = process.platform === "darwin" && existsSync("/Applications/Pages.app");

test("full build with Pages: PDFs, pdf-check and previews for both markets", slow({ skip: !pagesAvailable && "needs Pages (macOS)", timeout: 300_000 }), () => {
  const dir = tempRepo();
  const r = run("build.ts", dir);
  assert.equal(r.code, 0, r.out);
  for (const f of ["cv/Kirill_Kohan_CV.pdf", "cv/pdf-check.md", "cv/preview/page-1.png", "cv/markets/ukraine/Kirill_Kohan_CV_UA.pdf", "cv/markets/ukraine/preview/page-1.png"]) {
    assert.ok(existsSync(join(dir, f)), f);
  }
  assert.match(readFileSync(join(dir, "cv/markets/ukraine/pdf-check.md"), "utf8"), /Result: \*\*pass\*\*/);
});
