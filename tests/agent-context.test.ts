// npm run agent-context: one bundle for the composer or the tailor (agents/composer.md, agents/tailor.md step 1).
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { REPO, edit, run, tempRepo } from "./helpers.ts";
import { specSection } from "../scripts/agent-context.ts";

// The bundle reads the agent definitions, AGENTS.md and the open items, which tempRepo() leaves out.
const repo = () => {
  const dir = tempRepo();
  for (const p of ["agents", "AGENTS.md", "docs/open-items.md"]) cpSync(join(REPO, p), join(dir, p), { recursive: true });
  // Generated, git-ignored inputs a fresh clone doesn't have: the digests and the react variant's selection.
  run("validate.ts", dir);
  run("select.ts", dir, ["cv/variants/react", "--profile", "react"]);
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
  run("build.ts", dir, ["cv/Kirill_Kohan_CV.md", "--no-pdf", "--entries-reviewed"]); // a build record (git-ignored)
  const before = run("agent-context.ts", dir, ["composer"]);
  assert.equal(before.code, 0, before.out);
  assert.doesNotMatch(bundle(dir, before.out), /Entries in scope: [^\n]*admasters-ecommerce/); // in scope only after its summary changes
  edit(dir, "summaries/admasters-ecommerce.md", /^(### 4\.1 .*)$/m, "$1 (renamed)");
  const r = run("agent-context.ts", dir, ["composer"]);
  assert.equal(r.code, 0, r.out);
  const b = bundle(dir, r.out);
  assert.match(b, /Entries in scope: [^\n]*admasters-ecommerce \(status: sources changed\)/);
  assert.match(b, /Unchanged \(copy as they are\): [^\n]*syspro-saas-erp \(lines \d+–\d+\)/);
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
  assert.match(b, /Entries in scope: [^\n]*velas-wallet \(selection changed\)/);
  // Not changed: navigation-statistics keeps #4.5, which the master merges into its #4.1 bullet, and cites #5 on a
  // bullet that isn't a Stack line.
  assert.doesNotMatch(b, /Entries in scope: [^\n]*navigation-statistics/);
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
  assert.equal(who.out.trim(), 'agent-context: unknown agent "harvester" (one of: composer, tailor, cover-letter, portfolio, advisor)');
});

test("cover-letter, portfolio and advisor bundles: their Read first sections and only what the agent needs", () => {
  const dir = repo();
  // Cover letter: a job folder as /tailor --jd leaves it.
  const job = join(dir, "cv/tailored/acme");
  cpSync(join(dir, "cv/variants/react"), job, { recursive: true });
  writeFileSync(join(job, "jd-tags.yaml"), "profile: react\nrequired: [react]\n");
  writeFileSync(join(job, "job-description.md"), "# Senior React Engineer at Acme\n\nAcme builds a design tool.\n");
  const c = run("agent-context.ts", dir, ["cover-letter", "cv/tailored/acme"]);
  assert.equal(c.code, 0, c.out);
  const cb = bundle(dir, c.out);
  assert.match(cb, /### `specs\/outputs\/cover-letter\.md` \(Rules at a glance, 1, 2, 3, 4, 5, 6\)/);
  assert.match(cb, /Not there yet: ask the user \(agent step 2\)/); // no why.md
  assert.match(cb, /^- \*\*syspro-saas-erp#4\.1\*\* Schema-driven runtime/m); // what a cited source says
  assert.match(cb, /Errors: .*"I am writing to"/);
  assert.doesNotMatch(cb, /^## Strong evidence$/m); // the gap report's headings are nested in the bundle

  // Portfolio: one page, its summary text and current text; portfolio decisions; an unknown page is an error.
  const p = run("agent-context.ts", dir, ["portfolio", "--entry", "navigation-poc"]);
  assert.equal(p.code, 0, p.out);
  const pb = bundle(dir, p.out);
  assert.match(pb, /^## Page: navigation-poc$/m);
  assert.match(pb, /^#### navigation-poc#4\.1 /m);
  assert.match(pb, /- \*\*portfolio-poc-names-public\*\*/);
  assert.match(pb, /Other pages \(leave as they are\): syspro-saas-erp/);
  assert.match(pb, /### Published portfolio text\n`sources\/text\/portfolio-2025-09\.md` \(`doc:portfolio-2025-09`\)/); // the newest imported portfolio
  assert.match(cb, /also blocks every other summary's terms/);
  // A summary id with several pages stands for all of them (/portfolio <summary-id>).
  const multi = bundle(dir, run("agent-context.ts", dir, ["portfolio", "--entry", "itjet-fintech"]).out);
  assert.match(multi, /Pages in scope: itjet-fintech\/[\w-]+, itjet-fintech\/[\w-]+/);
  const bad = run("agent-context.ts", dir, ["portfolio", "--entry", "nope"]);
  assert.equal(bad.code, 2);
  assert.match(bad.out, /unknown portfolio page "nope"/);

  // Advisor: the Rules at a glance of two specs from one Read first line, open items, and a report's findings.
  mkdirSync(join(dir, "reports/run"), { recursive: true });
  writeFileSync(join(dir, "reports/run/hr.md"), "---\nverdict: pass\nscore: 8\n---\n# HR\n\n## Findings\n| id | severity | location | issue | suggestion | needs_user_input |\n|---|---|---|---|---|---|\n| hr-1 | low | cv.md:1 | x | y | no |\n| fact-check-1 | medium | cv.md:2 | z | w | no |\n\n## Decided\n");
  const a = run("agent-context.ts", dir, ["advisor", "reports/run"]);
  assert.equal(a.code, 0, a.out);
  const ab = bundle(dir, a.out);
  assert.match(ab, /### `specs\/cv-spec\.md` \(Rules at a glance\)[\s\S]*### `specs\/work-summary-spec\.md` \(Rules at a glance\)/);
  assert.match(ab, /^## Open items \(`docs\/open-items\.md`\)$/m);
  assert.match(ab, /^## Front-matter values to confirm[^\n]*\n\nNone\.$/m);
  edit(dir, "summaries/velas-wallet.md", /^engagement: (.+)$/m, "engagement: $1  # TODO (needs user input): confirm");
  const a2 = bundle(dir, run("agent-context.ts", dir, ["advisor", "reports/run"]).out);
  assert.match(a2, /^- summaries\/velas-wallet\.md: `engagement: full-time` \(show_in_cv: true\)$/m);
  assert.match(ab, /^## Findings: `reports\/run\/hr\.md` \(pass, 8\)[\s\S]*\| hr-1 \| low \|[\s\S]*\| fact-check-1 \| medium \|/m); // ids with a hyphen too
  assert.match(ab, /^- \*\*keep-length\*\*: /m);
});

test("specSection skips headings inside fenced code, at the start and at the end", () => {
  const text = "## 7. Seven\n\n```markdown\n## 8. Example in a fence\n```\n\n## 8. Real\nbody\n```\n## 9. Also fenced\n```\nmore\n\n## 9. Nine\n";
  const s8 = specSection(text, "8")!;
  assert.match(s8, /^## 8\. Real\nbody/);
  assert.match(s8, /Also fenced[\s\S]*more$/); // the fenced "## 9." doesn't end it
  assert.doesNotMatch(s8, /## 9\. Nine/);
});
