# Acceptance checklist

Status: v1 · 2026-10-16 · Written in build step 10 (`docs/plan.md` section 8) from the chat log in plan section 12.

`npm test` covers the scripts. The AI agents (harvester, composer, tailor, reviewer, advisor, template importer) are covered here instead: each scenario below repeats something done by hand in the 2026-10-15/16 chat and states what must come out.

**Rerun this checklist whenever a spec, rubric, agent definition or command changes.** Differences in wording are fine. Missing content, broken structure, an unsourced or overstated claim, or a broken rule is a failure.

## How to run the replay

The replay runs in a throwaway git worktree, so the real CV is never touched:

```bash
git worktree add .cv-runs/replay HEAD
ln -s ../../node_modules .cv-runs/replay/node_modules
git show b130643:Kirill_Kohan_CV.md > .cv-runs/replay/cv/Kirill_Kohan_CV.md   # the CV before the chat
cd .cv-runs/replay
# … run the scenarios below inside this folder …
cd ../.. && git worktree remove --force .cv-runs/replay
```

The reference result is the CV at the commit being tested (`cv/Kirill_Kohan_CV.md` in the main folder). Record each run in the log at the end of this file.

Rules for a fair replay:
- **Commit first.** The worktree is made from `HEAD`, so commit this checklist and any spec or agent change before replaying.
- **No peeking.** Agents in the replay folder must not run `git diff`, `git log` or `git show`: the worktree's history holds the reference CV. To see their own changes, they compare with the snapshot from `npm run reattach-src -- <cv> --save` (`.cv-runs/snapshots/`).
- **Keep the results.** Before removing the worktree, copy its CV, variants, tailored CVs and reports to `.cv-runs/replay-<date>/` (git-ignored).

## A. Scripted (deterministic) scenarios

Run `npm test` and `npm run check`, plus `npm run build:all` when an export app is available. Each line names the chat step (plan section 12 row) it repeats.

| id | Chat step | Check | Expected |
|---|---|---|---|
| A1 | 3, 13 | `npm run lint` | ATS-safe Markdown only, no forbidden characters (`→ · • — –`), no filler words, single spaces |
| A2 | 4, 14 | `npm run refresh` | consulting section without dates and with its intro line; job lines from summaries (`December 2025 - Present`) |
| A3 | 5, 32 | `npm run lint` | no hidden client name, confidential term, ticket id or internal URL in rendered text (`hidden-clients`, cv-spec 11) |
| A4 | 11 | `npm run validate` | "(Contract)" only where `engagement: contract` and the market shows it (`all-full-time`) |
| A5 | 15, 22 | change `profile.yaml` (phone, country), `npm run refresh` | the generated header follows; lint fails on a hand-edited header |
| A6 | 17, 18, 38, 53 | `npm run build` | the Word file matches the approved `classic` look: bullets aligned, dates right-aligned, no orphaned headings, section lines starting where headings start |
| A7 | 19 | `npm run pdf-check` | every word of the Markdown is in the PDF, fonts embedded, no broken ligatures, page limit kept |
| A8 | 20 | `npm run reattach-src` | dropped source comments are restored after an edit |
| A9 | 32, 33 | `npm run build:all` | Ukraine versions: no phone, availability, time-zone line or "(Contract)"; content otherwise identical |
| A10 | 23 | `npm run check` | every value comes from files: calculated "7+ years" and "a team of 8 engineers" match the calculated values |
| A11 | 40, 49 | edit a summary, `npm run status` | the CV is stale with the reason; changed entries stay listed until rewritten (`--entries-reviewed`) |
| A12 | 27, 41 | `npm run backup`, `restore`, `doctor` | the private files round-trip; doctor reports the laptop ready |

## B. Agent scenarios (replay from `b130643`)

| id | Chat step | Command | Input | Expected |
|---|---|---|---|---|
| B1 | 1, 2 | `/compose` | the `b130643` CV, current summaries and facts | SYSPRO in Experience; the clinical-trials app and the Jira plugin under CONSULTING AND FREELANCE PROJECTS with their client labels; every summary with `show_in_cv` has an entry, in section order |
| B2 | 6 | `/compose` | SYSPRO `cv_emphasis`, decision `sdd-not-vibe-coding` | SYSPRO's first bullets: architecture-governed SDD (not ad-hoc AI code generation), then the lead-architect and tech-stack work; AI agents only as governed reviewers |
| B3 | 9, 10, 51, 52 | `/compose` | `facts/confirmed.yaml` | the numbers that are facts appear (25+ person program, days to hours, fewer review cycles, team of 8, team of about 3); no number without a source; SYSPRO within `cv_max_bullets` |
| B4 | 16 | `/compose` | consulting facts | the various-clients entry covers optimization, interviews (with coding assignments), React Native audits, upgrades, presales and webinars |
| B5 | 7, 12 | `/compose` | | the header shows the B2B / full-time availability line; no LinkedIn or GitHub link; the portfolio link stays |
| B6 | step 7 | composer annotate-only mode | a CV without sources | a `src` comment on every claim with no text change (strip comments and diff); `npm run trace` reports 0 unsourced claims |
| B7 | 8 | `/tailor --profile react-native` | `profiles/react-native.yaml` | `cv/variants/react-native/cv.md` follows `selection.json` (order, pins, the GM Stack line), keeps every job, passes `npm run check`, and has a gap report in the format of tailoring-spec 5 |
| B8 | 34–36 | `/tailor --jd <ad> --profile react-native` | a pasted job ad | `jd-tags.yaml` (with `profile` and an optional `headline`), the tailored CV and a gap report with job-ad keywords; nothing claimed that has no source |
| B9 | 7, 14, 50 | `/review` | the built CV | six reports that validate; ATS pass with a role-match table; HR raises name consistency, side work, hiring from Ukraine, team sizes; every decided point appears under *Decided*, not as a finding |
| B10 | 8, 51, 52 | `/improve` | a report | one topic at a time with suggested answers; answers land in facts, decisions or summaries with `source: user, <date>`; untrue suggestions (e.g. "(Contract)" on a full-time job) are refused with truthful alternatives |
| B11 | 1, 29 | `/harvest <repo>` | a repo with your commits | a summary in the format of work-summary-spec with repo names only (no URLs or paths), identities confirmed, TODOs for what git can't know |
| B12 | 17 | `/import-template <docx> <name>` | a Word CV | a template whose test build goes to `.cv-runs/template-test-<name>/` and doesn't touch the real CV |
| B13 | 22 | `/profile` | "moved to Poland, new phone +48…" | follow-up questions (work permit, B2B, time zone); the header and every variant change after `build:all`; sent CVs with the old details are listed |
| B14 | 45 | `/job-change` (leaving) | the current job | a final harvest is offered first; `period.end` set; the summary remains the record |

## C. Permanent end-to-end scenarios

| id | Plan step | Scenario | Expected |
|---|---|---|---|
| C1 | 12 | Second laptop, route B of `specs/portability-spec.md` 5: `npm run backup -- --full`, then in a fresh folder outside the repo unzip, `git clone repo.bundle CV`, `git remote remove origin`, `npm ci`, `npm run restore -- ../private-backup.zip`, a new `framework.local.yaml`, `npm run doctor`, `npm run build:all` | the restored repo has the full history and no remote; private files are back; `framework.local.previous.yaml` holds the old settings; outputs pass `pdf-check`; content matches the first laptop; doctor reports nothing missing |
| C1b | 12 | Compare the old and new folders | `git ls-files -s` identical (every committed file by content hash), `git log --all` identical; every git-ignored file on the old laptop is either in the backup or recreated (`specs/portability-spec.md` 1); nothing needed lives only outside the repo (open items are in `docs/open-items.md`) |
| C1a | 12 | `npm run backup -- --full` with uncommitted changes | refused, with "commit first" |
| C2 | 13 | New laptop + new repo: `/add-repo` on a repo the framework hasn't seen | identities detected and confirmed; "new or existing job" asked; job details asked; new tags and skills proposed; `validate` passes; the master CV and every variant gain sourced bullets; `build:all` passes `pdf-check`; `/review` runs |
| C3 | 14 | Markets: `build:all`, then compare both markets for the master and one variant | Ukraine PDFs have no phone, availability, time-zone line or "(Contract)"; worldwide PDFs have them; `pdf-check` passes for both; bullets identical |

## Run log

| Date | Commit | Scope | Result | Notes |
|---|---|---|---|---|
| 2026-10-16 | b9ea9b9 | C1, C1b (full archive `cv-full-20261016-1629.zip` restored into a fresh folder on this Mac) | **pass** after one fix | 146 files and 44 commits identical; private file restored as `framework.local.previous.yaml`; doctor ready (only the example backup folder missing); `build:all` with the same words per page; 101 tests pass. Fix: open items moved from the AI tool's memory to `docs/open-items.md`. |
| 2026-10-16 | c1614f6 | A (`npm test` 96/96, `check`, `doctor`); B1–B6 (composer from `b130643`), B7 (react-native variant), B8 (job ad, fictional "Example Health"), B9 (ats, hr, fact-check); C not run (steps 12–14) | **pass** | Replay CV vs reference: same sections, entry order, bullet counts per entry and source ids for every entry; ~2,111 vs 2,103 words. B7 bullet counts equal the committed variant. B8 headline came from `jd-tags.yaml`. B9: no high findings, all 9 decided points listed as *Decided*. Caveat: the composer ran `git diff` and saw part of the reference (SYSPRO), hence the "no peeking" rule. Gaps found and fixed in the same change: old sections without markers (composer step 3), US spelling warnings, stale market copies in `check`, one-off overrides in `jd-tags.yaml`, tailored file names, multi-source bullets and bullet order in tailoring, composer self-check (the replay overstated "maintained … Azure Pipelines" and the fact-check caught it). B10–B14 need a user present (interactive) and were covered by the real runs in this chat (plan rows 51–52). Results in `.cv-runs/replay-2026-10-16/`. |
