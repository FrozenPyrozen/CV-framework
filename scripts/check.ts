// npm run check: lint + trace for the master CV, its market versions and every variant (plan 6).
import { existsSync } from "node:fs";
import { defaultLintTargets, lintCv, lintSummaries, printFindings, type Finding } from "./lint.ts";
import { buildSourceIndex, traceCv } from "./trace.ts";
import { loadContext } from "./lib/cvmd.ts";
import { isMain } from "./lib/repo.ts";

if (isMain(import.meta.url)) {
  const targets = defaultLintTargets();
  const findings: Finding[] = [];
  const idx = buildSourceIndex();
  for (const t of targets) {
    findings.push(...lintCv(t.file, loadContext({ market: t.market, cvFile: t.file })));
    if (!t.market && existsSync(t.file)) findings.push(...traceCv(t.file, idx)); // market versions share the same sources
  }
  findings.push(...lintSummaries(loadContext()));
  printFindings(findings);
  const errors = findings.filter((x) => x.level === "error").length;
  console.log(`\ncheck: ${targets.length} CV file(s), ${errors} error(s), ${findings.length - errors} warning(s)`);
  if (errors) process.exit(1);
}
