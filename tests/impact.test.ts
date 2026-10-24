// npm run impact: required co-changes by the impact map (specs/alignment-spec.md 3), on a throwaway git repo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { run } from "./helpers.ts";

const sh = (dir: string, ...args: string[]) => spawnSync("git", args, { cwd: dir, encoding: "utf8" });
const put = (dir: string, p: string, text: string) => { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), text); };

// The files the impact map reads, committed once as the base.
function repo(): string {
  const dir = mkdtempSync(join(tmpdir(), "cv-impact-"));
  process.on("exit", () => rmSync(dir, { recursive: true, force: true }));
  put(dir, "package.json", JSON.stringify({ scripts: { build: "tsx scripts/build.ts" } }));
  put(dir, "framework.config.yaml", "checks:\n  max_words: 100\n");
  put(dir, "docs/changelog.md", "| # | Request | Change |\n");
  put(dir, "docs/workflows.md", "| `/build` | builds | scripts only |\n");
  put(dir, "docs/plan.md", "## 5. Agents\n");
  put(dir, "docs/acceptance.md", "# Acceptance\n");
  put(dir, "AGENTS.md", "1. **Specs first.** (`cv-spec.md`)\n");
  put(dir, "specs/cv-spec.md", "## 1. Sources\nUses `checks.max_words`.\n");
  put(dir, "scripts/build.ts", "// build\n");
  for (const a of [["init", "-q"], ["config", "user.email", "t@t"], ["config", "user.name", "t"], ["add", "-A"], ["commit", "-qm", "base"]]) sh(dir, ...a);
  return dir;
}

test("a new script, agent, command, spec and config key without their co-changes are errors; a clean tree passes", () => {
  const dir = repo();
  const clean = run("impact.ts", dir);
  assert.equal(clean.code, 0, clean.out);
  assert.match(clean.out, /impact: 0 changed file\(s\) since HEAD; 0 error\(s\), 0 warning\(s\)/);

  put(dir, "scripts/thing.ts", "// thing\n");
  put(dir, "agents/helper.md", "# Helper\n\n## Steps\n");
  put(dir, ".claude/commands/helper.md", "Follow agents/helper.md\n");
  put(dir, "specs/new-spec.md", "# New\n");
  put(dir, "framework.config.yaml", "checks:\n  max_words: 100\n  new_limit: 5\n");
  const r = run("impact.ts", dir);
  assert.equal(r.code, 1, r.out);
  for (const re of [
    /\[I1\] framework files changed .* but docs\/changelog\.md has no new row/,
    /\[I2\] scripts\/thing\.ts is new but no package\.json script runs it/,
    /\[I2\] scripts\/thing\.ts is new but has no tests\/thing\.test\.ts/,
    /\[I4\] agents\/helper\.md is new but \.claude\/agents\/helper\.md .* is missing/,
    /\[I4\] agents\/helper\.md is new but docs\/workflows\.md names no command/,
    /\[I4\] agents\/helper\.md is new but docs\/plan\.md section 5/,
    /\[I4\] agents\/helper\.md has no "## Read first" list/,
    /\[I5\] \.claude\/commands\/helper\.md is new but docs\/workflows\.md has no \/helper row/,
    /\[I6\] specs\/new-spec\.md is new but AGENTS\.md rule 1 doesn't list `new-spec\.md`/,
    /\[I7\] config key checks\.new_limit is new but no spec or doc names it/,
    /warn +\[I8\] specs, agents or commands changed/,
    /warn +\[I6\] specs\/new-spec\.md is new but docs\/plan\.md doesn't mention it/,
  ]) assert.match(r.out, re);
});

test("the co-changes clear it; --since compares with a ref; a removed spec still named elsewhere is an error", () => {
  const dir = repo();
  put(dir, "scripts/thing.ts", "// thing\n");
  put(dir, "tests/thing.test.ts", "// test\n");
  put(dir, "package.json", JSON.stringify({ scripts: { build: "tsx scripts/build.ts", thing: "tsx scripts/thing.ts" } }));
  put(dir, "docs/changelog.md", "| # | Request | Change |\n| 1 | thing | `thing` |\n");
  const ok = run("impact.ts", dir);
  assert.equal(ok.code, 0, ok.out);
  sh(dir, "add", "-A"); sh(dir, "commit", "-qm", "thing");
  assert.match(run("impact.ts", dir).out, /0 changed file\(s\) since HEAD/);
  assert.match(run("impact.ts", dir, ["--since", "HEAD~1"]).out, /4 changed file\(s\) since HEAD~1; 0 error\(s\)/);

  rmSync(join(dir, "specs/cv-spec.md"));
  put(dir, "docs/changelog.md", "| # | Request | Change |\n| 1 | thing | `thing` |\n| 2 | removed | spec |\n");
  const gone = run("impact.ts", dir);
  assert.equal(gone.code, 1, gone.out);
  assert.match(gone.out, /\[I9\] specs\/cv-spec\.md was removed but is still named in/);
});

test("an edited old changelog row isn't a new one; a new top-level key counts; I3 warns; a removed script named only in the changelog passes", () => {
  const edited = repo();
  put(edited, "docs/changelog.md", "| # | Request | Change |\n| 1 | base | first |\n");
  sh(edited, "add", "-A"); sh(edited, "commit", "-qm", "row 1");
  put(edited, "docs/changelog.md", "| # | Request | Change |\n| 1 | base | first, reworded |\n"); // an old row edited
  put(edited, "scripts/build.ts", "// build, changed\n");
  put(edited, "tests/build.test.ts", "// test\n");
  assert.match(run("impact.ts", edited).out, /\[I1\] framework files changed/);
  put(edited, "docs/changelog.md", "| # | Request | Change |\n| 1 | base | first, reworded |\n| 2 | build | changed |\n");
  assert.doesNotMatch(run("impact.ts", edited).out, /\[I1\]/);

  const dir = repo();
  put(dir, "docs/changelog.md", "| # | Request | Change |\n");
  put(dir, "scripts/build.ts", "// build, changed\n");
  put(dir, "framework.config.yaml", "checks:\n  max_words: 100\nnew_setting: true\n");
  const r = run("impact.ts", dir).out;
  assert.match(r, /\[I1\] framework files changed/); // the changelog file is unchanged: no row added
  assert.match(r, /\[I7\] config key new_setting is new/);
  assert.match(r, /warn +\[I3\] scripts changed but no test changed/);

  const d2 = repo();
  put(d2, "docs/changelog.md", "| # | Request | Change |\n| 1 | removed | `scripts/build.ts` gone |\n");
  rmSync(join(d2, "scripts/build.ts"));
  put(d2, "package.json", JSON.stringify({ scripts: {} }));
  const ok = run("impact.ts", d2);
  assert.equal(ok.code, 0, ok.out); // the changelog may name what was removed
  put(d2, "docs/workflows.md", "| `/build` | uses scripts/build.ts | scripts only |\n");
  assert.match(run("impact.ts", d2).out, /\[I9\] scripts\/build\.ts was removed but is still named in docs\/workflows\.md/);

  // A data map's new entry isn't a setting (I7); a removed agent still named elsewhere is an error (I9).
  const d3 = repo();
  put(d3, "agents/old.md", "# Old\n"); put(d3, "docs/plan.md", "## 5. Agents\n| Old (`agents/old.md`) |\n");
  sh(d3, "add", "-A"); sh(d3, "commit", "-qm", "agent");
  put(d3, "framework.config.yaml", "checks:\n  max_words: 100\n  spelling_variants:\n    colour: color\n");
  put(d3, "docs/changelog.md", "| # | Request | Change |\n| 1 | variants | colour |\n");
  rmSync(join(d3, "agents/old.md"));
  const r3 = run("impact.ts", d3).out;
  assert.doesNotMatch(r3, /spelling_variants\.colour/);
  assert.match(r3, /\[I9\] agents\/old\.md was removed but is still named in docs\/plan\.md/);
});
