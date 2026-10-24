// npm run test:changed: which test files a change can affect (selection only; the run is node --test).
import { test } from "node:test";
import assert from "node:assert/strict";
import { selectTests } from "../scripts/test-changed.ts";

const M = (path: string) => ({ status: "M" as const, path });

test("a changed script selects its own tests and those of the scripts importing it; docs select the doc tests", () => {
  const cl = selectTests([M("scripts/cover-letter.ts")]);
  assert.equal(cl.all, false);
  assert.ok(cl.files.includes("tests/cover-letter.test.ts"), cl.files.join());
  assert.ok(!cl.files.includes("tests/build-core.test.ts"));

  const lint = selectTests([M("scripts/lint.ts")]).files; // imported by check, build, cover-letter, agent-context …
  for (const t of ["tests/mdtools-lint.test.ts", "tests/cover-letter.test.ts", "tests/agent-context.test.ts"]) assert.ok(lint.includes(t), `${t} in ${lint.join()}`);

  const docs = selectTests([M("docs/plan.md")]).files;
  assert.ok(docs.includes("tests/doc-check.test.ts") && docs.includes("tests/impact.test.ts"), docs.join());
  assert.ok(selectTests([M("tests/impact.test.ts")]).files.includes("tests/impact.test.ts"));
  // A spec read at run time (harvest-prompt embeds the summary spec) selects that script's tests.
  assert.ok(selectTests([M("specs/work-summary-spec.md")]).files.includes("tests/portable.test.ts"));
  // Only the scripts that read the changed file: an agent file doesn't pull in the build tests.
  const agent = selectTests([M("agents/advisor.md")]).files;
  assert.ok(!agent.includes("tests/build-core.test.ts") && !agent.includes("tests/test-changed.test.ts") && agent.length <= 8, agent.join());
});

test("shared code, config and CV content select every test; an unrelated change selects none", () => {
  for (const p of ["scripts/lib/cvmd.ts", "framework.config.yaml", "summaries/velas-wallet.md", "cv/Kirill_Kohan_CV.md", "tests/helpers.ts"]) {
    assert.equal(selectTests([M(p)]).all, true, p);
  }
  const none = selectTests([M(".gitignore")]);
  assert.equal(none.all, false);
  assert.deepEqual(none.files, []);
});
