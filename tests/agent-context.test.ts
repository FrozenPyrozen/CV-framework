// npm run agent-context: one bundle for the composer or the tailor (agents/composer.md, agents/tailor.md step 1).
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { REPO, edit, run, tempRepo } from "./helpers.ts";

// The bundle reads the agent definitions, AGENTS.md and the open items, which tempRepo() leaves out.
const repo = () => {
  const dir = tempRepo();
  for (const p of ["agents", "AGENTS.md", "docs/open-items.md"]) cpSync(join(REPO, p), join(dir, p), { recursive: true });
  return dir;
};

const bundle = (dir: string, out: string) => {
  const path = out.match(/agent-context: (\S+\.md)/)?.[1];
  assert.ok(path, out);
  return readFileSync(join(dir, path), "utf8");
};

test("composer --entry: the Read first spec sections, the entry's CV lines, summary text, facts, open items and decisions", () => {
  const dir = repo();
  const r = run("agent-context.ts", dir, ["composer", "--entry", "syspro-saas-erp"]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /\.cv-runs\/agent-context\/composer-kirill_kohan_cv\.md \([\d.]+ KB.*1 entry in scope/);
  const b = bundle(dir, r.out);
  // agents/composer.md: cv-spec Rules at a glance, 3–7 and 9–11; not 8 or 12.
  assert.match(b, /### `specs\/cv-spec\.md` \(Rules at a glance, 3, 4, 5, 6, 7, 9, 10, 11\)/);
  assert.match(b, /^### 3\. Bullets$/m);
  assert.match(b, /^### 11\. Confidentiality$/m);
  assert.doesNotMatch(b, /^### (8\. Generated blocks|12\. How agents edit)/m);
  assert.match(b, /Entries in scope: syspro-saas-erp \(--entry\)/);
  assert.match(b, /^\s+\d+\| \* .*<!-- src: syspro-saas-erp#4\.1/m); // the CV lines keep their src comments
  assert.match(b, /^#### syspro-saas-erp#4\.12 /m); // the composer sees every contribution
  assert.match(b, /Confirmed facts[\s\S]*id: syspro-team-size/);
  assert.match(b, /calc_years|years_experience/);

  const all: { id: string }[] = parse(readFileSync(join(dir, "facts/decisions.yaml"), "utf8")).decisions;
  const listed = [...b.matchAll(/^- \*\*([\w-]+)\*\* \(/gm)].map((m) => m[1]);
  const rest = b.match(/^Not relevant here: (.+?) \(open/m)?.[1].split(", ") ?? [];
  assert.deepEqual([...listed, ...rest].sort(), all.map((d) => d.id).sort());
  assert.ok(listed.includes("sdd-not-vibe-coding"));
  assert.ok(rest.includes("portfolio-wink-mockups") && rest.includes("syspro-portfolio-two-pages")); // portfolio-only
});

test("composer without --entry takes the entries status lists, and an open item rides along", () => {
  const dir = repo();
  const none = run("agent-context.ts", dir, ["composer"]);
  assert.equal(none.code, 0, none.out);
  assert.match(none.out, /0 entries in scope/);
  edit(dir, "summaries/admasters-ecommerce.md", /^(### 4\.1 .*)$/m, "$1 (renamed)");
  const r = run("agent-context.ts", dir, ["composer"]);
  assert.equal(r.code, 0, r.out);
  const b = bundle(dir, r.out);
  assert.match(b, /Entries in scope: admasters-ecommerce \(status: sources changed\)/);
  assert.match(b, /Unchanged \(copy as they are\): syspro-saas-erp \(lines \d+–\d+\)/);
  assert.match(b, /Open items[^\n]*\n- Admasters stack:/);
});

test("tailor: the role profile, the selection, master wording and only the selected contributions; a changed selection is in scope", () => {
  const dir = repo();
  const sel = join(dir, "cv/variants/react/selection.json");
  const s = JSON.parse(readFileSync(sel, "utf8"));
  const velas = s.entries.find((e: { id: string }) => e.id === "velas-wallet");
  velas.bullets.pop();
  writeFileSync(sel, JSON.stringify(s, null, 2));
  const r = run("agent-context.ts", dir, ["tailor", "react"]);
  assert.equal(r.code, 0, r.out);
  const b = bundle(dir, r.out);
  assert.match(b, /### `specs\/tailoring-spec\.md` \(Rules at a glance, 2, 3, 4, 5\)/);
  // The gap-report template inside 5 is kept as written and doesn't end the section; 6 isn't on the list.
  assert.match(b, /^### 5\. Gap report[^\n]*\n[\s\S]*^## Strong evidence$[\s\S]*^## Selection disagreements$/m);
  assert.doesNotMatch(b, /^### 6\. Output/m);
  assert.match(b, /Entries in scope: velas-wallet \(selection changed\)/);
  assert.match(b, /Role profile \(`profiles\/react\.yaml`\)/);
  assert.match(b, /### Master CV wording \(`cv\/Kirill_Kohan_CV\.md` lines/);
  const contribs = [...b.matchAll(/^#### (velas-wallet#4\.\d+) /gm)].map((m) => m[1]).sort();
  assert.deepEqual(contribs, velas.bullets.map((x: { src: string }) => x.src).sort());
});

test("tailor errors are one line (exit 2): no selection.json, an entry not selected, an unknown agent", () => {
  const dir = repo();
  const bad = run("agent-context.ts", dir, ["tailor", "react", "--entry", "nope"]);
  assert.equal(bad.code, 2);
  assert.equal(bad.out.trim(), 'agent-context: unknown entry "nope" (not in selection.json)');
  rmSync(join(dir, "cv/variants/react/selection.json"));
  const nosel = run("agent-context.ts", dir, ["tailor", "react"]);
  assert.equal(nosel.code, 2);
  assert.match(nosel.out.trim(), /^agent-context: cv\/variants\/react\/selection\.json not found: run npm run select first/);
  const who = run("agent-context.ts", dir, ["harvester"]);
  assert.equal(who.code, 2);
  assert.equal(who.out.trim(), 'agent-context: unknown agent "harvester" (one of: composer, tailor)');
});
