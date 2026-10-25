// npm run verify: which status lines reach the summary (warnings, never failures).
import { test } from "node:test";
import assert from "node:assert/strict";
import { statusLines } from "../scripts/verify.ts";

test("verify keeps status STALE, NEW, SENT, SHARED and CONFIRM lines with their reasons, and drops ok lines", () => {
  const out = [
    "ok     cv/Kirill_Kohan_CV.md",
    "STALE  cv/variants/react/cv.md",
    "         summaries/velas-wallet.md changed",
    "SENT   Acme received an older version of cv/Kirill_Kohan_CV.pdf on 2026-10-20",
    "SHARED text changed since the release of 2026-10-25: cv/Kirill_Kohan_CV.pdf; build, share the new PDF(s), then npm run release",
    "CONFIRM summaries/x.md: engagement (# TODO … confirm; /improve or /add-experience asks)",
    "ok     portfolio/portfolio.md",
    "",
    "status: CVs and portfolio are up to date; 2 warning(s) above (SENT, SHARED)",
  ].join("\n");
  const lines = statusLines(out);
  assert.deepEqual(lines.map((l) => l.split(/\s+/)[0]), ["STALE", "", "SENT", "SHARED", "CONFIRM", "status:"]);
  assert.equal(statusLines("ok     cv/Kirill_Kohan_CV.md\n\nstatus: everything is up to date\n").length, 0);
});
