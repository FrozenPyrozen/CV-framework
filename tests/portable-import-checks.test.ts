// Portable harvest: import-summary rejects or flags a broken summary (split from the portable tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { run, sample, tempRepo } from "./helpers.ts";

const broken: [string, (t: string) => string, RegExp][] = [
  ["a code block", (t) => t.replace("## 5.", "```ts\nconst x = 1;\n```\n\n## 5."), /code block/],
  ["a local path", (t) => t.replace("## 5.", "See /Users/me/work/app for details.\n\n## 5."), /local path/],
  ["a missing section", (t) => t.replace("## 8. Portfolio material", "## 8. Portfolio"), /sections must be exactly/],
  ["an unknown tag", (t) => t.replace(/^Tags: /m, "Tags: not-a-real-tag, "), /not-a-real-tag/],
  ["a repo URL", (t) => t.replace(/^source: cv$/m, "source: git").replace(/^harvested_at: .*$/m, "harvested_at: 2026-10-01").replace(/^repos: \[\]$/m, "repos:\n  - { name: \"https://dev.azure.com/org/repo\" }"), /repo name only/],
];

for (const [name, change, expected] of broken) {
  test(`import-summary rejects or flags ${name}`, () => {
    const dir = tempRepo();
    const r = run("import-summary.ts", dir, [sample(dir, "acme-portal", change), "--apply"]);
    assert.match(r.out, expected);
    if (name !== "an unknown tag") {
      assert.equal(r.code, 1, r.out);
      assert.ok(!existsSync(join(dir, "summaries/acme-portal.md")));
    }
  });
}
