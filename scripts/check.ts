// npm run check: lint + trace for the master CV, its market versions and every variant (plan 6).
import { existsSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { defaultLintTargets, lintCv, lintSummaries, printFindings, type Finding } from "./lint.ts";
import { buildSourceIndex, traceCv } from "./trace.ts";
import { loadContext } from "./lib/cvmd.ts";
import { isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { masterCvPath } from "./lib/paths.ts";

if (isMain(import.meta.url)) {
  if (process.argv.slice(2).some((a) => !a.startsWith("-"))) { console.error("check: checks every CV and takes no file; for one CV use npm run lint -- <file> and npm run trace -- <file>"); process.exit(2); }
  const targets = defaultLintTargets();
  const findings: Finding[] = [];
  const idx = buildSourceIndex();
  const cfg = loadConfig();
  for (const t of targets) {
    // A market copy older than its CV is left from an earlier build: say so instead of linting stale text.
    if (t.market) {
      const cvDir = dirname(dirname(dirname(t.file)));
      const source = cvDir === rootPath(cfg.output.master_dir) ? masterCvPath() : join(cvDir, "cv.md");
      if (existsSync(source) && statSync(t.file).mtimeMs < statSync(source).mtimeMs) {
        findings.push({ level: "warning", file: relative(rootPath(), t.file), message: `older than ${basename(source)}; skipped (run npm run market or build)` });
        continue;
      }
    }
    try {
      findings.push(...lintCv(t.file, loadContext({ market: t.market, cvFile: t.file })));
      if (!t.market && existsSync(t.file)) findings.push(...traceCv(t.file, idx)); // market versions share the same sources
    } catch (e) {
      findings.push({ level: "error", file: relative(rootPath(), t.file), message: (e as Error).message });
    }
  }
  findings.push(...lintSummaries(loadContext()));
  printFindings(findings);
  const errors = findings.filter((x) => x.level === "error").length;
  console.log(`\ncheck: ${targets.length} CV file(s), ${errors} error(s), ${findings.length - errors} warning(s)`);
  if (errors) process.exit(1);
}
