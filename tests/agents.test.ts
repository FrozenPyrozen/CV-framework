// Consistency of the agent layer (step 6): every npm script, file and agent that AGENTS.md, the agent
// definitions and the commands refer to must exist, so instructions can't drift from the code.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { REPO, run, tempRepo } from "./helpers.ts";

const read = (p: string) => readFileSync(join(REPO, p), "utf8");
const docs = () => [
  "AGENTS.md", "CLAUDE.md", "docs/workflows.md", "docs/scripts.md",
  ...readdirSync(join(REPO, "agents")).map((f) => `agents/${f}`),
  ...readdirSync(join(REPO, ".claude/commands")).map((f) => `.claude/commands/${f}`),
  ...readdirSync(join(REPO, ".claude/agents")).map((f) => `.claude/agents/${f}`),
];

test("every npm script the agent docs mention exists in package.json", () => {
  const scripts = new Set(Object.keys(JSON.parse(read("package.json")).scripts));
  for (const d of docs()) {
    for (const m of read(d).matchAll(/npm run ([a-z][a-z:-]*)/g)) assert.ok(scripts.has(m[1]), `${d}: npm run ${m[1]} doesn't exist`);
  }
});

test("every repo file and agent the docs point to exists", () => {
  for (const d of docs()) {
    for (const m of read(d).matchAll(/`((?:agents|specs|schemas|scripts|facts|templates\/classic|docs)\/[\w./-]+\.(?:md|yaml|ts|json))`/g)) {
      // Written later: the acceptance checklist (build step 10) and the git-ignored application log (first /log-application).
      if (["docs/acceptance.md", "facts/applications.yaml"].includes(m[1])) continue;
      assert.ok(existsSync(join(REPO, m[1])), `${d}: ${m[1]} doesn't exist`);
    }
  }
});

test("each Claude wrapper points to its agent, and each command to an agent section or script", () => {
  for (const f of readdirSync(join(REPO, ".claude/agents"))) {
    const t = read(`.claude/agents/${f}`);
    assert.match(t, /^---\nname: [\w-]+\ndescription: .+\n(?:model: (?:sonnet|opus|haiku)\b.*\n)?---/);   // model: optional (token saving)
    assert.ok(t.includes(`agents/${f}`), `${f} must point to agents/${f}`);
  }
  for (const f of readdirSync(join(REPO, ".claude/commands"))) {
    const t = read(`.claude/commands/${f}`);
    assert.match(t, /^---\ndescription: .+\nargument-hint: .*\n---/, f);
    assert.match(t, /agents\/[\w-]+\.md|npm run /, `${f} must reference an agent or a script`);
    for (const m of t.matchAll(/the `(\/[\w-]+)` section of `(agents\/[\w-]+\.md)`/g)) {
      assert.ok(read(m[2]).includes(`## \`${m[1]}`), `${f}: ${m[2]} has no "${m[1]}" section`);
    }
  }
});

test("AGENTS.md registry is up to date, and docs/workflows.md lists every command", () => {
  const dir = tempRepo();
  for (const p of ["AGENTS.md", "agents", ".claude"]) {
    cpSync(join(REPO, p), join(dir, p), { recursive: true });
  }
  assert.equal(run("index.ts", dir, ["--check"]).code, 0, "run npm run index");
  const w = read("docs/workflows.md");
  for (const f of readdirSync(join(REPO, ".claude/commands"))) assert.match(w, new RegExp(`^\\| \`/${f.replace(/\.md$/, "")}[ \`]`, "m"), `docs/workflows.md has no row for /${f}`);
  assert.match(read("AGENTS.md"), /`docs\/workflows\.md`[\s\S]*`docs\/scripts\.md`/, "AGENTS.md must point to docs/workflows.md and docs/scripts.md");
});

test("docs/scripts.md describes every npm script", () => {
  const s = read("docs/scripts.md");
  for (const name of Object.keys(JSON.parse(read("package.json")).scripts)) {
    assert.match(s, new RegExp(`^\\| \`${name}[ \`]`, "m"), `docs/scripts.md has no row for ${name}`);
  }
});


test("no per-laptop tool settings (.claude/*.local.*) are committed anywhere", async () => {
  const { execFileSync } = await import("node:child_process");
  const tracked = execFileSync("git", ["ls-files"], { cwd: REPO, encoding: "utf8" }).split("\n");
  assert.deepEqual(tracked.filter((f) => /(^|\/)\.claude\/[^/]*\.local\./.test(f)), []);
});
