// npm run import-summary <file> [--apply]
// Checks a summary written on another machine from a portable harvest prompt (specs/work-summary-spec.md 9,
// plan 9c) with the same rules as validate, plus the summary secret scan and portable-specific checks, in a
// temporary copy of the repo, so summaries/ is never touched by the check. --apply (only when the check passes)
// writes a new summary to summaries/<id>.md, or for an existing id to .cv-runs/import/<id>.md for the harvester
// to merge (spec section 7). Proposed tags (<!-- proposed-tags: … -->) are reported for the user to approve.
import { spawnSync } from "node:child_process";
import { constants, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { cliPath, isMain, loadConfig, parseSummary, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

const PROPOSED = /^<!--\s*proposed-tags:\s*(.*?)\s*-->\s*$/m;

export interface ImportResult { id: string; errors: string[]; warnings: string[]; proposedTags: string[]; exists: boolean }

export function checkSummary(file: string): ImportResult {
  const raw = readFileSync(file, "utf8");
  const proposedTags = (raw.match(PROPOSED)?.[1] ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const text = raw.replace(PROPOSED, "").replace(/\n{3,}/g, "\n\n");
  const s = parseSummary(text, file);
  const id = String(s.frontMatter.id ?? "");
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) errors.push(`id "${id}" is missing or not lowercase-kebab`);
  if (s.frontMatter.harvest_mode !== "portable") warnings.push("harvest_mode is not \"portable\" (expected for a summary written from a harvest prompt)");
  // Portable-specific: nothing that would only make sense on the other machine, and no code.
  if (/^```/m.test(text)) errors.push("contains a code block: summaries describe work in your own words, never code");
  for (const m of text.matchAll(/(?:^|\s)((?:\/Users\/|\/home\/|[A-Z]:\\|~\/)[^\s)]+)/g)) errors.push(`contains a local path: ${m[1]}`);
  const cfg = loadConfig();
  const exists = existsSync(rootPath(cfg.paths.summaries, `${id}.md`));
  if (!id || errors.some((e) => e.startsWith("id "))) return { id, errors, warnings, proposedTags, exists };

  // The same rules as validate and lint's summary secret scan, run on a temporary copy of the repo.
  const tmp = mkdtempSync(join(tmpdir(), "cv-import-"));
  try {
    for (const p of ["framework.config.yaml", "facts", "summaries", "schemas", "markets", "specs", "cv", "templates", "profiles", "sources"]) {
      if (existsSync(rootPath(p))) cpSync(rootPath(p), join(tmp, p), { recursive: true, mode: constants.COPYFILE_FICLONE }); // clones on APFS: sources/ is large
    }
    writeFileSync(join(tmp, cfg.paths.summaries, `${id}.md`), text);
    const here = `${cfg.paths.summaries}/${id}.md`;
    const run = (script: string) => spawnSync(process.execPath, ["--import", "tsx", join(import.meta.dirname, script)], { env: { ...process.env, CV_ROOT: tmp }, encoding: "utf8" });
    const lines = [run("validate.ts"), run("lint.ts")].flatMap((r) => `${r.stdout ?? ""}${r.stderr ?? ""}`.split("\n"));
    for (const l of lines) {
      if (!l.includes(`${here}:`)) continue;
      const msg = l.replace(/^(ERROR|warn)\s+/, "").replace(new RegExp(`^${here.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(:\\d+)?: `), "");
      const unknownTag = /unknown tag/.test(msg);
      if (/^ERROR/.test(l) && !unknownTag) errors.push(msg);
      else if (unknownTag) warnings.push(`${msg} (approve it as a new tag, or change it)`);
      else warnings.push(msg);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  return { id, errors, warnings, proposedTags, exists };
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  if (!positional[0]) { console.error("usage: npm run import-summary -- <file> [--apply]"); process.exit(2); }
  const file = cliPath(positional[0]);
  if (!existsSync(file)) { console.error(`import-summary: file not found: ${positional[0]}`); process.exit(2); }
  const r = checkSummary(file);
  for (const e of r.errors) console.log(`ERROR  ${e}`);
  for (const w of r.warnings) console.log(`warn   ${w}`);
  if (r.proposedTags.length) console.log(`note   proposed new tags (approve before they enter framework.config.yaml): ${r.proposedTags.join(", ")}`);
  console.log(`\nimport-summary: ${r.id || "?"}: ${r.errors.length} error(s), ${r.warnings.length} warning(s); ${r.exists ? "an existing summary: the harvester merges it (work-summary-spec 7)" : "a new summary"}`);
  if (r.errors.length) process.exit(1);
  if (args.apply) {
    const cfg = loadConfig();
    const text = readFileSync(file, "utf8").replace(PROPOSED, "").replace(/\n{3,}/g, "\n\n");
    const target = r.exists ? rootPath(cfg.paths.runs, "import", `${r.id}.md`) : rootPath(cfg.paths.summaries, `${r.id}.md`);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, text);
    console.log(`import-summary: written ${relative(rootPath(), target)}${r.exists ? " (merge it with the harvester: /import-summary)" : "; next: npm run validate, then /compose"}`);
  }
}
