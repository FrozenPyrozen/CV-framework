# CV Agent Framework: Plan

Status: steps 1–12 and 14 done (section 8; step 12 by full archive on this Mac, its private-file round trip still to rerun once a tailored or sent CV exists); left: step 13 (new laptop + new repo, on the new laptop); agent replay passed 2026-10-23 (B1, B7, B8). Since then: portable harvest (9c) and sources (9d) built, the portfolio specified, its content imported (P2), its summary fields (P1), the portfolio agent and text checks (P3), template, renderer and build (P4), the spell check (P5) and portfolio reviews (P6) built (9e); the portfolio rebuilt on the published 2025-09 structure (change log rows 86–89), its template approved, the portfolio reviewed (`reports/2026-10-23-1633`), an ATS and HR review of all CVs (`reports/2026-10-23-1705`); docs split to save tokens (change log in `docs/changelog.md`, scripts and workflows in `docs/`, fact formats in `specs/facts-spec.md`); context bundles for the composer and tailor (`agent-context`), the HERE Technologies navigation work imported by portable harvest into the consulting section · 2026-10-24

## 1. Goal

A small, local, specification-driven (SDD) framework that keeps the CV current and traceable:

1. Generate a work summary from a local repo clone.
2. Compose the master CV from summaries and confirmed facts.
3. Tailor the CV to a specific job description.
4. Review the CV with several independent reviewers that write reports and never edit the CV.
5. Improve the CV together with you: go through review findings one at a time, ask you questions, and record your answers as confirmed facts.
6. Build `.docx` and PDF from any Word template, including templates imported from someone else's Word or PDF CV.

Every step done by hand in the 2026-10-15 chat maps to a framework capability (`docs/changelog.md`, rows 1–36).

## 2. Principles

- **Specs come first.** Every agent follows a written spec in `specs/`. An agent that changes behavior changes its spec first.
- **Every claim needs a source.** Each CV bullet must trace to a work summary or a confirmed fact. Unsourced bullets are flagged, not silently allowed.
- **Tool-neutral.** `AGENTS.md` is the entry point, and agent definitions are plain Markdown in `agents/`. Claude Code files in `.claude/` are thin wrappers that point to them. Codex, Cursor, Gemini CLI or anything else can run the same agents by reading `AGENTS.md`.
- **Deterministic work is done by scripts, not AI:** rendering (Markdown to Word to PDF), PDF checks, previews, linting and trace checking. Any agent, or you, runs them with `npm run …`.
- **Private by default.** Summaries may contain internal names. Only the CV outputs are scrubbed, using each summary's *Confidentiality notes* (enforced by the lint blocklist and the confidentiality reviewer).
- **Employer confidentiality.** The repo stays local or on a *private* remote only. Summaries describe your work in your own words: no source code, no copied internal document text, no internal URLs, no secrets. The harvester spec and lint enforce this.
- **Summaries are the lasting record.** Access to employer and client repos ends with the job, so a summary must stand on its own: it names the repos it came from but stores no remote URLs, and the last harvest happens before you leave (`/job-change`).
- **Agents never commit.** Every agent leaves its changes uncommitted and shows a diff. You review and commit, and git history is the undo.
- **Every AI step ends with a deterministic check.** Agents run `npm run verify -- --fast` while iterating and `npm run verify` (validate, doc-check, index --check, check, status, tests) before handing back, plus `build` for a CV they changed, and report failures instead of hiding them.
- **Reviewers only write reports.** You decide what to change.
- **Your manual edits are kept.** You can edit any CV Markdown by hand at any time. Agents always start from the file as it is on disk, show a diff of their changes, and never revert your edits silently.

## 3. Repository layout

```
CV/
├── AGENTS.md                      # entry point for any AI tool: rules, where things are, generated registry
├── CLAUDE.md                      # "Read AGENTS.md" + "do not use cns:* skills in this repo"
├── README.md                      # for humans: what this is, how to run it
├── docs/                          # plan.md (this file), changelog.md (one row per change), scripts.md (every npm script),
│                                  # workflows.md (every command), acceptance.md (replay checklist for agents), open-items.md (to add or answer later)
├── framework.config.yaml          # paths, sections, display formats, output names, checks, exporters, tags
├── framework.local.yaml           # per-laptop settings: repo paths, backup folder, exporter order (git-ignored)
├── framework.local.example.yaml   # committed example of the file above
├── .nvmrc                         # Node version
├── package-lock.json              # exact dependency versions (committed; install with `npm ci`)
├── package.json                   # scripts: build, build:all, render, pdf, pdf-check, preview, lint, trace,
│                                  #          check, status, validate, index, template-import, test, doctor, refresh, market,
│                                  #          backup, restore, digest, git-digest, select, reattach-src, typecheck,
│                                  #          log-application, harvest-prompt, import-summary, import-doc
├── tsconfig.json                  # TypeScript settings (type check only; scripts run with tsx)
├── specs/
│   ├── cv-spec.md                 # CV structure and writing rules (seeded from this chat)
│   ├── work-summary-spec.md       # summary template + front matter schema
│   ├── sources-spec.md            # imported old CVs and portfolios: layout, precedence, what they may add (9d)
│   ├── facts-spec.md              # profile, confirmed facts, skills, decisions, application log
│   ├── tailoring-spec.md          # how variants and tailored CVs may differ from the master
│   ├── templates.md               # template import rules and style-map format
│   ├── review-report-spec.md      # shared format for every reviewer report
│   ├── portability-spec.md        # moving to another laptop: backup, full archive, restore, remotes
│   ├── outputs/                   # specs for further output types: portfolio.md (built, 9e); later linkedin.md, cover-letter.md; the CV's
│   │                              # output specs are cv-spec.md and tailoring-spec.md
│   └── rubrics/
│       ├── ats.md                 # AI ATS screener rubric (+ job-ad match mode)
│       ├── hr.md                  # recruiter / HR reader rubric
│       ├── proofreading.md        # spelling, grammar, consistency
│       ├── fact-check.md          # claim -> source tracing
│       ├── confidentiality.md     # client names, internal codes, ticket IDs
│       └── layout.md              # visual check of the preview images (bullets, spacing, page breaks)
├── agents/                        # tool-neutral agent definitions (role, inputs, outputs, spec, steps)
│   ├── harvester.md
│   ├── composer.md
│   ├── tailor.md
│   ├── reviewer.md                # one generic reviewer, run once per rubric
│   ├── advisor.md                 # interactive: findings -> questions -> confirmed facts -> composer
│   ├── template-importer.md       # labels paragraphs of a sample CV to create a style map
│   └── portfolio.md               # writes the public portfolio's text from opted-in summaries (9e P3)
├── facts/
│   ├── profile.yaml               # the only place for personal details; the CV header is generated from it (facts-spec 1)
│   ├── confirmed.yaml             # facts you confirmed, each with id, source, entry and tags (facts-spec 2)
│   ├── skills.yaml                # the SKILLS section's only source (facts-spec 3)
│   ├── decisions.yaml             # choices you made about the CV (e.g. "no LinkedIn"), so reviewers stop re-raising them
│   ├── dictionary.txt             # project word list for spellcheck: names, products, technologies (9e P5)
│   └── applications.yaml          # optional log: which CV/PDF went to which company and when (facts-spec 5)
├── sources/                       # imported old CVs and portfolios: index.yaml, files/ (originals), text/ (extracted), media/ (images) (9d)
├── portfolio/                     # (9e) assets/<summary-id>/ images (P1), portfolio.md (P3); built .docx/.pages/PDFs git-ignored (P4)
├── summaries/                     # one file per job/project, all following work-summary-spec
│   └── .digests/                  # generated short digests (contributions + tags) read by composer/tailor (R10; git-ignored,
│                                  # recreated by `npm run digest`)
├── profiles/                      # role profiles: react.yaml, react-native.yaml, fullstack-react-node.yaml, nodejs.yaml
├── markets/                       # market definitions: worldwide.yaml, ukraine.yaml (cv-spec 14)
├── cv/
│   ├── <name>_CV.md               # master CV (generated, hand-editable); file name from config
│   ├── <name>_CV.docx / .pdf / pdf-check.md / preview/   # built outputs, git-ignored
│   ├── markets/<market-id>/       # non-default market versions of the master CV (generated, git-ignored; cv-spec 14)
│   ├── variants/<profile-id>/     # role-based CVs (generated, not hand-edited): cv.md + gap-report.md committed; built files git-ignored
│   │   └── markets/<market-id>/   # non-default market versions of each variant (generated, git-ignored)
│   ├── tailored/<company-role>/   # per job ad (git-ignored): cv.md, .docx, .pdf, job-description.md, jd-tags.yaml, gap-report.md
│   ├── sent/                      # optional exact copies of PDFs you sent (git-ignored, included in backups; facts-spec 5)
│   └── .build-state.json          # per built CV: template, CV Markdown hash, source, output and per-entry hashes (local, git-ignored)
├── templates/
│   └── <name>/                    # one folder per template; "classic" = your previous CV; "portfolio-classic" = the portfolio (9e P4)
│       ├── source.docx            # the original file the template was imported from (own CVs only)
│       ├── import-map.yaml        # the agent's paragraph labels for template-import
│       ├── template.docx          # styles only, sample content removed (an input, so committed)
│       ├── style-map.yaml         # per paragraph type (name, headline, contact_line, section_heading, section_rule, entry_title, entry_details, bullet, body, section_intro, education_line, skills_line): a sample paragraph
│                                  # with its full formatting, not just a style name (R2); also lists the template's fonts
│       ├── fixes.yaml             # renderer fixes for this template (e.g. bullet indent for Pages)
│       ├── reference-preview.png  # approved look, used by the layout reviewer
│       └── import-report.md       # ATS warnings + test build, written by the template-importer agent (step 7);
│                                  # classic predates it and has none
├── reports/<YYYY-MM-DD-HHmm>/     # reviewer reports for one run: ats.md, hr.md, proofreading.md, ...
├── .cv-runs/                      # working files (git-ignored): <run-id>/ (state.json, git-digest.md), export.lock, snapshots/, doctor/, template-test-<name>/
├── schemas/                       # common, config, summary, confirmed, decisions, profile, skills, market, style-map,
│                                  # fixes, report, role-profile, sources
├── scripts/                       # Node/TypeScript CLIs
│   ├── lib/repo.ts                # shared loader: config, summaries, facts, profile, skills, markets, entries, CLI paths
│   ├── lib/cvmd.ts                # CV Markdown model: generated parts (header, entry lines, blocks) per market and role profile
│   ├── lib/paths.ts               # output file names and market output paths
│   ├── lib/text.ts                # text normalization for pdf-check (R4)
│   ├── lib/lock.ts                # export lock: one PDF export at a time (R1)
│   ├── git-digest.ts              # condenses a repo's history into a compact digest for the harvester (R9, R11)
│   ├── harvest-prompt.ts          # builds the portable harvest prompt for a machine without this framework (9c)
│   ├── import-summary.ts          # checks a summary written elsewhere and places it (9c)
│   ├── import-doc.ts              # imports an old CV or portfolio into sources/ and extracts its text (9d)
│   ├── digest.ts                  # writes summaries/.digests/ from summaries + facts (R10)
│   ├── select.ts                  # deterministic bullet selection/ordering by profile or job-ad tags (R8)
│   ├── reattach-src.ts            # re-attaches source comments after an agent edit (R7)
│   ├── build.ts                   # build and build:all: validate -> digest -> refresh -> lint -> trace -> markets -> docx -> pdf -> pdf-check -> preview
│   ├── render.ts                  # npm run render: Markdown -> .docx (picks the template and output name)
│   ├── renderers/docx.ts          # template-driven Word renderer
│   ├── renderers/portfolio-docx.ts # the portfolio's Word renderer: portfolio templates, images, page sizes (9e P4)
│   ├── lib/docx.ts                # .docx zip and XML helpers
│   ├── exporters/                 # pages.ts, word.ts, libreoffice.ts; index.ts (registry), types.ts
│   ├── export-pdf.ts              # npm run pdf: runs exporters in config order, under the lock, with a timeout
│   ├── pdf-check.ts               # ATS-readability and fidelity check of a built PDF (docs/scripts.md)
│   ├── preview.ts
│   ├── template-import.ts         # Word sample -> templates/<name>/ (PDF later)
│   ├── refresh.ts                 # regenerates the script-owned parts of a CV (cv-spec 8)
│   ├── market.ts                  # writes market versions (cv-spec 14)
│   ├── lint.ts
│   ├── trace.ts
│   ├── check.ts                   # lint + trace for every CV
│   ├── status.ts                  # which CVs are stale and why; sent-CV warnings
│   ├── doctor.ts                  # environment check with a tiny real export (R3, R12)
│   ├── backup.ts                  # backup (--full: whole-project archive) and restore (npm run restore = backup.ts --restore)
│   ├── log-application.ts         # records a sent CV in facts/applications.yaml (facts-spec 5)
│   ├── spellcheck.ts              # dictionary spelling check of CVs and the portfolio (9e P5)
│   ├── portfolio.ts               # portfolio refresh (generated parts) and check (sources, confidentiality, spelling) (9e P3)
│   ├── portfolio-template.ts      # generates templates/portfolio-classic (9e P4)
│   ├── build-portfolio.ts         # build:portfolio: check, Word and PDF per size, pdf-check, previews, .pages (9e P4)
│   ├── lib/buildstate.ts          # build records: source/output hashes
│   ├── lib/sources.ts             # imported documents: the sources index and text extraction (.docx, .pdf, .md, .txt, .pages) (9d)
│   ├── validate.ts                # JSON Schema validation of all inputs
│   ├── index.ts                   # regenerates the agents/rubrics/profiles/markets/templates/outputs list in AGENTS.md
│   └── migrations/                # (created when the first format change needs one)
├── tests/                         # *.test.ts (node:test); helpers.ts runs scripts on a temp copy of the repo (CV_ROOT)
│   └── fixtures/                  # for hand-made inputs if a test ever needs them; today every test copies the
│                                  # real repo to a temp folder and breaks it on purpose (empty, not tracked)
└── .claude/
    ├── agents/                    # thin wrappers -> agents/*.md
    └── commands/                  # /harvest /compose /tailor /variants /review /improve /add-experience
                                   # /profile /job-change /add-repo /import-template /build /status /log-application /doctor
                                   # /harvest-prompt /import-summary /import-docs /portfolio-material /portfolio
```

## 4. Data formats

Each format has one owner; this table only says where to look. Structure is checked by `npm run validate` against `schemas/`, meaning and rules are in the specs.

| Format | Owner (rules) | Structure |
|---|---|---|
| Work summary `summaries/*.md`: front matter, the nine body sections, numbered contributions, confidentiality notes | `specs/work-summary-spec.md` (portfolio fields: `specs/outputs/portfolio.md` 3; `Source: doc:<id>`: `specs/sources-spec.md`) | `schemas/summary.schema.json` |
| CV sections and their order (`cv_sections`), placement of an entry (`cv_section`, `show_dates_in_cv`, `cv_client_label`) | `specs/cv-spec.md` 2 | `framework.config.yaml`, `schemas/config.schema.json` |
| Personal profile `facts/profile.yaml` (the generated header) | `specs/facts-spec.md` 1, `specs/cv-spec.md` 8 | `schemas/profile.schema.json` |
| Confirmed facts and `cv_entry` items `facts/confirmed.yaml` | `specs/facts-spec.md` 2 | `schemas/confirmed.schema.json` |
| Skills `facts/skills.yaml` | `specs/facts-spec.md` 3 | `schemas/skills.schema.json` |
| Decisions `facts/decisions.yaml` | `specs/facts-spec.md` 4, `specs/review-report-spec.md` | `schemas/decisions.schema.json` |
| Application log `facts/applications.yaml` (optional, git-ignored) | `specs/facts-spec.md` 5 | written by `npm run log-application` |
| Calculated values (years of experience, team size led, "Present") | `specs/cv-spec.md` 7 | |
| Generated parts of the CV Markdown (header, education, skills, languages, entry lines, `<!-- entry: -->` markers) | `specs/cv-spec.md` 2.2, 8 | |
| Supported Markdown | `specs/cv-spec.md` 9 | enforced by `lint` |
| Trace references `<!-- src: … -->` and pseudo-sources | `specs/cv-spec.md` 6 | checked by `trace` |
| Role profiles `profiles/*.yaml`, `overrides`, `jd-tags.yaml`, `selection.json`, gap reports | `specs/tailoring-spec.md` | `schemas/role-profile.schema.json` |
| Markets `markets/*.yaml` | `specs/cv-spec.md` 14 | `schemas/market.schema.json` |
| Templates: `style-map.yaml`, `fixes.yaml`, `import-map.yaml` | `specs/templates.md` | `schemas/style-map.schema.json`, `schemas/fixes.schema.json` |
| Imported documents `sources/index.yaml` | `specs/sources-spec.md` | `schemas/sources.schema.json` |
| Reviewer reports `reports/<date-time>/*.md` | `specs/review-report-spec.md` | `schemas/report.schema.json` |
| Portfolio `portfolio/portfolio.md` | `specs/outputs/portfolio.md` | |
| Backups, full archives, `framework.local.yaml` | `specs/portability-spec.md` | `framework.local.example.yaml` |
| Shared definitions (ids, tags, periods, engagement) | | `schemas/common.schema.json` |

**Optional fields follow one rule everywhere:** if a field is missing, the default applies (from config, the section or `engagement`); if it's set, it wins.

## 5. Agents

Each agent's inputs, outputs and steps are in its definition in `agents/`; the commands that run them are in `docs/workflows.md`.

| Agent | Writes | Spec / rubric |
|---|---|---|
| Harvester (`agents/harvester.md`) | `summaries/<id>.md`, new or merged (existing numbers, user edits and `cv_*` fields kept); never copies code, internal text, URLs or secrets | `specs/work-summary-spec.md` |
| Composer (`agents/composer.md`) | the master CV, one entry at a time, from its `npm run agent-context` bundle (R10), with `reattach-src` and `trace` (R7) | `specs/cv-spec.md` |
| Tailor (`agents/tailor.md`) | `cv/variants/<profile>/` or `cv/tailored/<company-role>/`: `cv.md` + `gap-report.md`, wording only (selection by `select`, R8), from its `npm run agent-context` bundle | `specs/tailoring-spec.md` + the profile |
| Reviewer (`agents/reviewer.md`), once per rubric | `reports/<date-time>/<rubric>.md` from its `npm run review-context` bundle; never edits | `specs/rubrics/*`, `specs/review-report-spec.md` |
| Advisor (`agents/advisor.md`) | your answers, one topic at a time, into `facts/` or a summary, then hands over to the composer; also `/job-change`, `/profile`, `/add-experience`, `/import-docs`, `/portfolio-material` | `specs/facts-spec.md`, `specs/cv-spec.md` + the report's rubric |
| Template importer (`agents/template-importer.md`) | `templates/<name>/` from a Word CV (PDF input deferred, section 11) | `specs/templates.md` |
| Portfolio (`agents/portfolio.md`) | the projects' text in `portfolio/portfolio.md`, every sentence sourced from its own project; scripts write the rest | `specs/outputs/portfolio.md` |

Reviewer set: **ATS** (with a job-ad mode), **HR**, **proofreading**, **fact-check**, **confidentiality**, **layout**, taken from the reviews done in the 2026-10-15 chat. They run in parallel when the tool supports it, otherwise one after another.

## 6. Scripts

Every deterministic step is an npm script; arguments and exact behavior are in `docs/scripts.md` (with the PDF exporters, the PDF check, previews and the dependencies). Template import is in `specs/templates.md` 4.

## 7. Workflows

The commands, what each does and which agent file it follows are in `docs/workflows.md`.

## 8. Build steps

Each step ends with something you can check.

1. **Restructure and preserve.** Create the folders. Move the CV files to `cv/` and the template to `templates/` (committing the template). Move the summaries to `summaries/` with the new names. Add `package.json` (with `engines: node >= 20.11`), `package-lock.json`, `.nvmrc` and `framework.local.example.yaml`, and update `.gitignore` (`summaries/.digests/`, `.cv-runs/`, `framework.local.yaml`, `backups/`, `node_modules/`, `cv/tailored/`, `facts/applications.yaml`, `cv/**/*.docx`, `cv/**/*.pdf`, `cv/**/pdf-check.md`, `cv/**/preview/`, `cv/**/markets/`, `cv/**/selection.json`, `cv/.build-state.json`, `cv/sent/`). The currently committed `Kirill_Kohan_CV.docx` is untracked with `git rm --cached` (the file stays on disk and is rebuilt in step 5).
   *Check:* `git status` shows moves only, no content changes.
2. **Specs.** Write `cv-spec.md` (the current CV's structure plus every rule from this chat), `work-summary-spec.md`, `tailoring-spec.md`, `templates.md` and the 6 rubrics. The ATS and HR rubrics are based on the reviews done in this chat.
   *Check:* you review the specs. This is the most important review.
3. **Facts.** Write `profile.yaml`, `skills.yaml` (seeded from the current SKILLS section), `confirmed.yaml` (formats now in `specs/facts-spec.md`) and `decisions.yaml` (section 10).
   *Check:* you confirm every entry is true.
4. **Migrate summaries.** Add front matter and restructure the body into the 9 sections of `specs/work-summary-spec.md` 3, numbering the contributions. Existing content is kept. Sections the old summaries don't cover (for example, *Main features* for the Jira plugin, *Portfolio material*) are filled only from what the summary already says, or marked `TODO (needs user input)`. Nothing is invented.
   **Older jobs without summaries:** GM, Velas, OMO Systems, Thermo Fisher Scientific, Itjet and The Admasters exist only as CV text. Each gets a summary built from that text (`source: cv`, `harvested_at: null`), with its bullets as numbered contributions and every other section marked `TODO (needs user input)`. You can enrich them later with `/harvest` (if you still have the repos) or `/add-experience`.
   *Check:* you review the 3 migrated summaries and the 6 new ones, and fill in the TODOs you can. After this step, every job in the CV has a summary.
5. **Scripts and config.** Includes every mitigation from section 9b marked *step 5*. `framework.config.yaml`, `schemas/`, `scripts/lib/`, `git-digest`, `select`, `reattach-src`, the template-driven docx renderer, `template-import` (Word input; PDF input deferred, section 11), the PDF exporters (Pages, Word, LibreOffice), `pdf-check`, `preview`, `build`/`build:all`, `refresh`, `lint` (including the confidentiality blocklist), `trace` (bullets and summary sentences), `status`, `validate`, `index` and `check`, each with tests.
   *Check:*
   - `npm test` passes, and `npm run validate` passes on all summaries and facts.
   - `templates/classic/template.docx` is created by importing `templates/classic/source.docx` (your previous CV).
   - `npm run build` through it produces a `.docx` with the look you approved (all-page previews reviewed on 2026-10-15), a PDF that passes `pdf-check`, and previews of every page.
6. **Agents and wrappers.** `agents/*.md` (harvester, composer, tailor, reviewer, advisor, template-importer), `.claude/agents/*`, `.claude/commands/*`, `AGENTS.md`, `CLAUDE.md`. `CLAUDE.md` and `AGENTS.md` (rule 11) state "do not use `cns:*` skills in this repo", so every session and tool knows the rule on any laptop. A git-ignored `.claude/cns-preferences.local.md` may also disable them per laptop; it is a convenience, not the carrier of the rule.
   *Check:* `tests/agents.test.ts` passes (every path and script the agent docs name exists, each wrapper and command points to its agent or script, the AGENTS.md registry is current, `docs/workflows.md` and `docs/scripts.md` list every command and script, no `.claude/*.local.*` file is committed).
7. **Convert and trace the current CV.** Run `npm run refresh` to replace the typed header, education, skills and languages with generated blocks (cv-spec 8), and to rewrite every job's title and detail lines from the summary fields (this changes `12/2025 – Present` to `December 2025 - Present` and removes the "(Contract)" labels from the full-time jobs). Then run the composer once in "annotate only" mode (`agents/composer.md`) to add `src` comments to bullets and summary sentences without changing their text. Then run `npm run check`. Wording changes that `check` asks for (e.g. bullets over `max_bullet_words`) are proposed separately and applied only after your approval.
   *Check:* the CV text is unchanged except for generated blocks, job title and detail lines, markers, comments and the wording changes you approved, and every bullet and summary sentence resolves, or the gaps are listed for you.
8. **Role profiles and variants.** Write the 4 profiles (checking that the summaries' existing `Tags:` lines support them), and build the 4 variants plus their gap reports.
   *Check:* you review the variants and gap reports. `npm run check` passes on all of them.
9. **First full review run.** Run `/review` with all 6 rubrics.
   *Check:* the reports match what we found by hand in this chat. Findings already decided in this chat (no LinkedIn link, keep the length, etc.) are not raised again.
10. **Replay this chat.** Write the chat-step table (now `docs/changelog.md` rows 1–36) as `docs/acceptance.md`, a repeatable checklist with inputs and expected results per step, and use it as the acceptance test. Start from the CV at commit `b130643` (your CV before this chat), run each capability once, and compare the result with the CV at the commit being tested (`docs/acceptance.md`). Differences in wording are fine. Missing content, structure or rules are failures. **Rerun `docs/acceptance.md` whenever a spec, rubric or agent definition changes**, since agents aren't covered by `npm test`.
   *Check:* a run-log row in `docs/acceptance.md` with the result; differences found are fixed or listed.
11. **README.** Includes a first-run section and a "new laptop" section (section 9a).
   *Check:* you review it; its commands match `docs/workflows.md`, `docs/scripts.md` and `specs/portability-spec.md`.
12. **Second-laptop test.** Make a full archive (`npm run backup -- --full`), restore it into a fresh folder outside the repo (or a second user account) following route B of `specs/portability-spec.md` 5, and run `npm run build:all` there. Route A (clone from a remote) is the same from the restore step on.
   *Check:* the outputs pass `pdf-check`, the content matches the original laptop, `doctor` reports nothing missing, and the restored repo has the full history and no remote.
13. **New laptop + new repo test.** On the second-laptop setup, run `/add-repo` on a small repo the framework has never seen (e.g. one of your own GitHub repos). Added to `docs/acceptance.md` as a permanent scenario.
   *Check:* identities are detected and confirmed, you're asked "new or existing job" and for the job details, new tags and skills are proposed, `validate` passes, the CV and every variant gain the new entry or bullets with sources, `build:all` passes `pdf-check`, and `/review` runs.
14. **Market test.** Run `build:all` and check both markets for the master CV and one variant.
   *Check:* the Ukraine PDFs have no phone number, no availability line, no time-zone line and no "(Contract)" label; the worldwide PDFs have the phone, availability and time-zone lines; `pdf-check` passes for both; the content (bullets) is identical. Added to `docs/acceptance.md`.

## 9. Scalability

The framework is designed so new outputs, reviewers and agents are **added as files, not by changing existing code**.

- **Sources and outputs are separate.** Summaries and facts are the sources. The CV, tailored CVs, and later the portfolio, a LinkedIn profile or cover letters are *outputs*. Each output is defined by one spec plus an optional renderer, so adding the portfolio means adding `specs/outputs/portfolio.md`, an agent and a renderer (the CV itself is specified by `cv-spec.md` and `tailoring-spec.md`); summaries only gain optional portfolio fields and a structured section 8 (9e, P1).
- **Folders act as registries:**
  - Any file in `specs/rubrics/` is a reviewer. Dropping in a new rubric (`specs/rubrics/<name>.md`, for example a frontend architect rubric) adds a reviewer with no other changes.
  - Any file in `profiles/` is a CV variant. `/variants` builds them all.
  - Any file in `agents/` is listed in `AGENTS.md` by the `index` script, so new agents are discovered automatically.
  - Renderers live in `scripts/renderers/` (docx today; an HTML or JSON renderer would be added there and chosen by output type, which needs a small change to `build`). Any exporter module in `scripts/exporters/` (Pages, Word, LibreOffice), once registered in `scripts/exporters/index.ts`, can be added to `pdf_exporters` in config; `validate` checks the id is registered.
- **One config file.** `framework.config.yaml` sets paths, the default template, the spelling variant (US), CV sections, display formats, output names, header line templates, the tag list and check limits. Reviewers default to every rubric in `specs/rubrics/`, and `build` uses the docx renderer. Scripts and agents read the config instead of hard-coding values; every key and its current value is in `framework.config.yaml` itself (structure: `schemas/config.schema.json`), including `output` (folders, file names), `display` (date format, separators, suffixes), `checks` (limits, forbidden characters, filler words, export timeout) and `secret_scan`.
- **What stays in code:** only mechanics, such as how Markdown is parsed, how a Word file is written, how Pages is controlled and how checks run. Every value they use comes from config, a template, a spec, or the facts and summaries.
- **Versioned, validated formats:**
  - Summaries, facts (except the git-ignored application log) and reports carry `schema_version`.
  - JSON Schemas in `schemas/` are checked by `npm run validate`.
  - When a format changes, a migration script moves old files forward, so old summaries never silently break.
- **Shared engine.** Markdown parsing, front matter, build records and paths live in `scripts/lib/` (with the source index in `trace.ts`), used by every script, so a new renderer or check is a small file.
- **Tests.** Each script has tests that run it on a temporary copy of the real repo, often broken on purpose, and check the output, so changes are safe as the framework grows. Agents are covered by the acceptance checklist (`docs/acceptance.md`), rerun after any spec or agent change.
- **Tool-neutral contracts.** Agent definitions only use files and `npm run` commands, never tool-specific features. The Claude Code wrappers, and later Codex, Cursor or Agent SDK wrappers, stay replaceable.

All of these are part of the layout in section 3.

## 9a. Running on another laptop

The framework must work on any laptop with the repo cloned. Everything machine-specific lives outside the committed files.

What travels and how (git, backups, per-laptop `framework.local.yaml` made from `framework.local.example.yaml`, recreated files) and the steps for both routes (A: private remote; B: full archive with a git bundle) are in `specs/portability-spec.md`; the README repeats the steps for humans. Every rule, decision and open item is in the repo, so no AI tool memory has to move.

**Other operating systems:** on macOS, PDF export uses Pages or Word. On Windows or Linux, LibreOffice (`soffice`) is the supported exporter. Previews use the same Node renderer (`pdfjs-dist` + `@napi-rs/canvas`, text drawn from the PDF's embedded fonts) on every OS; macOS Quick Look is only a page-1 fallback. `doctor` shows which path is active.

**Fonts:** each template lists its fonts in `style-map.yaml` (for `classic`: Cambria, Arial). `doctor` checks them with a real test export (the fonts must be embedded in the PDF), and `pdf-check` fails if the PDF used a substitute.

**Reproducibility:** `package-lock.json` plus `npm ci` installs the exact same dependency versions, and `.nvmrc` pins the Node version. PDFs from different exporters can differ slightly in layout. `pdf-check` confirms the content is identical, and `applications.yaml` records the exporter used for every sent PDF.

## 9b. Known risks and mitigations

Problems expected when the flows actually run, found by simulating every flow against what happened in the 2026-10-15 chat. Each mitigation is part of the build step shown.

### Technical
| # | Risk | Mitigation | Step |
|---|---|---|---|
| R1 | Pages exports one document at a time. Parallel exports in `build:all` collide, and a Pages dialog (missing font, conversion notice) can hang the export forever. | All PDF exports go through one queue with a lock file, one at a time, with a timeout per file (config `checks.export_timeout_s`, default 60). On timeout, Pages is closed without saving and the build fails with a clear message. | 5 |
| R2 | The classic template uses direct formatting (font size and color set on each piece of text, section lines as drawings), not real Word styles, so a style map that names styles would lose the look | `style-map.yaml` stores a **sample paragraph with full formatting** for each paragraph type, copied and filled in by the renderer, which is the approach that worked in this chat. Named styles are used only when a template really has them. | 5 |
| R3 | Font checks by searching font folders give false "missing" results: Cambria isn't in the macOS font folders, yet Pages embeds it | `doctor` checks fonts by exporting a tiny test document with the active exporter and reading which fonts are embedded in the PDF | 5 |
| R4 | `pdf-check` text comparison gives false failures: joined letters ("ﬁ"), line-end hyphenation, link text vs URL ("Portfolio" in the PDF, a URL in the Markdown), different quote and dash characters | A shared text normalizer: Unicode NFKC (splits joined letters), rejoins hyphenated line breaks, unifies quotes, dashes and whitespace, and compares link *text* rather than URLs | 5 |
| R5 | The secret scan flags your own portfolio link (a Drive file ID looks like a random token) | Links in `profile.yaml` are exempt, and `framework.config.yaml` has a `secret_scan.allow` list for other approved values | 5 |
| R6 | The confidentiality blocklist raises false alarms on ordinary words ("Orion", "Studio Shell") | Whole-word, case-sensitive matching (hidden client names match in any case), plus a per-term `allow_in` list in the summary's confidentiality notes (e.g. allow "Orion" in a generic sentence) | 5 |
| R12 | The one-time macOS permission prompt for controlling Pages can hang an unattended agent session | `doctor` triggers the prompt while you're at the keyboard (part 4). macOS offers no way to check the permission without prompting, so each export is limited by `checks.export_timeout_s`; on a timeout Pages is quit without saving, and a permission error ("not allowed", -1743) is reported with the hint to run `npm run doctor`. | 5 |
| R13 | Only page 1 can be previewed on this Mac (no `pdftoppm`), so layout issues on later pages are missed | Render all pages with `pdfjs-dist` and a Node canvas package (`docs/scripts.md`, Preview). Built in part 3a; text is drawn as shapes from the embedded fonts (`disableFontFace`), because Node can't load PDF fonts directly. | 5 |

### AI agent behavior
| # | Risk | Mitigation | Step |
|---|---|---|---|
| R7 | Agents drop or misplace source comments when rewriting text, so `trace` keeps failing | Agents edit **one entry at a time**, never rewriting the whole file. `reattach-src` then matches each bullet to its previous version (same entry, closest text) and restores its comment. The agent is asked to fix only what's left, and `trace` runs last. | 5, 6 |
| R8 | AI wording differs on every rebuild, so variants change in git even when nothing meaningful changed | `select` (a script) chooses and orders bullets by profile tags and limits, so selection is fixed. The tailor agent rewrites only entries whose per-entry hash changed since the last build (the `entries` map in `.build-state.json`, also listed by `status`), and copies everything else unchanged. | 5, 6, 8 |
| R9 | Large repos have too much history for one AI session, making runs slow, expensive or incomplete | `git-digest` condenses history into a compact digest per area (commit counts, date range, key commit messages, changed folders, diff statistics). The harvester reads the digest and opens individual commits only when needed. | 5, 6 |
| R10 | The composer must read every summary (about 30 KB each), which gets slow and costly as they accumulate | Each summary gets a generated short digest in `summaries/.digests/` (contributions, tags, metrics, `cv_*` fields). Composer and tailor read digests, and open a full summary only for entries they change. | 5, 6 |
| R11 | Squash-merged pull requests are often credited to whoever merged them, or to a bot, so your work goes missing | `git-digest` also searches `Co-authored-by` lines and PR merge commits mentioning your identities, and lists "possibly yours" commits for you to confirm | 5 |

### Noise
| # | Risk | Mitigation | Step |
|---|---|---|---|
| R15 | Pages joins "fi"/"fl" into ligature glyphs that some PDF readers extract wrongly (found 2026-10-15: pdfjs read "fintech" as "intech"; Apple PDFKit read it correctly). Screening systems using such readers would see misspelled keywords. | Template fix `no-ligatures`: an invisible letter spacing of 1/20 pt on every run stops Pages from forming ligatures (Pages ignores Word's own no-ligatures setting). `pdf-check` catches any remaining case as missing words. | 5 |
| R14 | `status` warns "sent CV is outdated" forever after any change | Warn once per application. `/status --ack <company>` stores the acknowledgment in `applications.yaml`, and the warning comes back only if the CV changes again after that. | 5 |

**Design consequence:** scripts handle selection, history condensing, source comments and comparisons. AI agents handle only writing and judgment. That keeps runs cheaper, repeatable and low-noise.

## 9c. Harvesting on another machine

Some repos can't leave the machine they live on (a work laptop), and this framework can't go there either. The summary is then written on that machine and only the summary comes back (rules in `specs/work-summary-spec.md` 9):

1. Here: `/harvest-prompt` (or `npm run harvest-prompt -- --merge <id>` to extend an existing summary) generates a self-contained prompt. It is generated from the current spec and tag list, so it never drifts.
2. There: in the repo, any AI agent tool follows the prompt: it reads the history with plain `git` commands, asks you what git can't know, and writes one `<id>.md` with `harvest_mode: portable`.
3. You review the file and move it by a channel your employer allows (the prompt reminds you: own words, no code, secrets or internal URLs; section 9 can stay `TODO` if internal names may not leave).
4. Here: `/import-summary <file>` checks it with the same rules as `validate` plus the secret scan, then adds or merges it, and the usual `/compose`, `/variants`, `build:all` and `/review` follow.

## 9d. Old CVs and portfolios as sources

Older CVs and portfolios often hold more detail about past jobs than the summaries. They are imported into the repo and used to fill gaps (rules in `specs/sources-spec.md`):

1. `/import-docs <file…>`: `npm run import-doc` copies each file to `sources/files/`, extracts its text to `sources/text/<id>.md` and lists it in `sources/index.yaml` with the date it was written.
2. **Precedence:** your answers and confirmed facts, then git, then the current summaries and CV (the originals), then imported documents, newest first. A document only fills gaps; it never overrides anything above it.
3. The advisor proposes, per summary: filled `TODO` sections, new contributions (`Source: doc:<id>`), technologies, portfolio material, numbers (section 7 `doc:<id>`; in the CV only once you confirm them) and conflicts (listed; the current value stays unless you say otherwise, and then it's recorded as your answer). Jobs no summary covers become `source: cv` summaries hidden from the CV until you decide.
4. `validate` checks the index, that each original is unchanged (sha256), and that every `doc:<id>` names an imported document. Then `/compose`, `/variants`, `build:all`.

## 9e. Portfolio (built in phases P1–P6)

The portfolio is a second output of the same sources: a multi-page document (cover and a page or more per project, as on the published portfolio) behind a **public link**. Rules are in `specs/outputs/portfolio.md`; it reuses the CV pipeline (Markdown → Word template → PDF exporters → checks) and adds images, several page sizes, `.pages` output, public-only confidentiality and a dictionary spell check.

| Phase | What | Needs |
|---|---|---|
| P1 (**done 2026-10-23**) | Summary fields `show_in_portfolio`, `portfolio_order`, `portfolio_label`, `portfolio_title`, `portfolio_projects`, `portfolio_max_items` and the structured section 8 (items may carry `project:`) (images, links, demos, each `public: yes, confirmed by user <date>`) in the schema and `validate`; `/portfolio-material` with the advisor to fill section 8 and opt projects in | nothing |
| P2 (**done 2026-10-23**) | Import your current portfolio: `/import-docs` for its content (sources, 9d; **content imported 2026-10-22** as `doc:portfolio-2025-04`, the published PDF on 2026-10-23 as `doc:portfolio-2025-09`) and its layout as the template `templates/portfolio-classic/`. The Pages file is a free-form layout (text boxes), so the template is rebuilt as a flowing Word document with the recorded look (`specs/outputs/portfolio.md` 5a) instead of `/import-template`; new paragraph types: cover top (the banner's empty first row, `cover_top`), cover title, intro, project title, project meta, section label, body, list item, caption, image | provided 2026-10-22 |
| P3 (**done 2026-10-23**) | `agents/portfolio.md` and `/portfolio`: writes `portfolio/portfolio.md` with a source on every sentence; `refresh` writes its generated blocks; `status` tracks it | P1, P2 |
| P4 (**done 2026-10-23**) | Renderer: images in rows (at most 4; a row with a landscape screenshot at least 1.75 in tall; at most 25% of the content height; captions only as alt text), title parentheses kept on one line, page sizes per template (`sizes: { a4, letter }`), `build:portfolio [--size a4\|letter\|all]`: `.docx`, `.pages` (through Pages), one PDF per size, `pdf-check` and previews per size | P2, P3 |
| P5 (**done 2026-10-23**) | `npm run spellcheck`: a dictionary spell check (US English) with the project word list `facts/dictionary.txt`, for the portfolio **and** the CV, in `build` and `check` (cspell-lib with bundled English, software-term and company dictionaries) | nothing |
| P6 (**done 2026-10-23**) | Portfolio checks and reviews: images (exist and public-confirmed; an image in `portfolio.md` must be a public item of its own project; unused files in `assets/` warned; shown at most at 150 dpi, warned under 1.5 inches, instead of a pixel minimum that phone screenshots can't meet), `lint` as for the CV except that section 9 terms are allowed only with `allow_in: [portfolio]` (in `portfolio check` since P3); the phone number left out unless decided; `/review --portfolio` (proofreading, fact-check, confidentiality with public rules and screenshots, layout for both sizes; `validate` refuses other rubrics); acceptance B17 | P4 |

P1–P6 are done and the `portfolio-classic` template is approved (2026-10-23). What's left is content: `/portfolio-material` (choose projects and screenshots), `/portfolio`, `npm run build:portfolio` and `/review --portfolio`.

## 10. Decisions

| Topic | Decision |
|---|---|
| Spelling | US English, enforced by the proofreading rubric and `framework.config.yaml` |
| Local clone paths and remotes | **Neither** is stored in summaries. Summaries store only the repo name, as a label of where the work happened. Local paths are per laptop in the git-ignored `framework.local.yaml` (section 9a) and can be removed once a job ends. Remote URLs aren't stored at all: access ends with the job, and they would keep the employer's internal addresses in your personal repo. (Replaces the earlier decisions to store paths, then remotes, in summaries.) |
| Tailored CVs in git | `cv/tailored/` and `facts/applications.yaml` are in `.gitignore` by default. To keep one, run `git add -f`. The tailor agent reminds you of this after each run. |
| Built files in git | **Only Markdown is committed** (CV `.md` files and `gap-report.md`). Every built output, for the master CV, variants and tailored CVs (`.docx`, `.pdf`, `pdf-check.md`, `preview/`, `selection.json`, `cv/.build-state.json`), is git-ignored and recreated by `npm run build` / `build:all`. The exception is `templates/*/template.docx`, which is an input, so it's committed. |
| Role profiles | First four (`specs/tailoring-spec.md` 1.1): `react` (React 19, micro-frontends, schema-driven UI, state machines, testing, OIDC, observability, SDD/architecture), `react-native` (React Native, Expo, Android/iOS native, BLE/IoT, offline-first, mobile CI/CD, store releases), `fullstack-react-node` (React + Node.js APIs, PostgreSQL, AWS, Stripe, Docker, CI/CD, mock backends, Forge resolvers) and `nodejs` (Node.js, REST/GraphQL, PostgreSQL, AWS, integrations; its gap report is expected to flag limited recent backend depth) |
| `classic` template look | Chosen with the user from all-page previews on 2026-10-15: one left edge for everything, tight spacing (section 4.5 pt since 2026-10-20, job 4 pt, bullet 1 pt; no space above the name, header lines at 1.05; top margin 0.25 inch since 2026-10-21), right-aligned dates, no header rule, headings and bullet groups never split across pages, invisible 1/20 pt letter spacing so PDF readers see plain "fi"/"fl" (R15). Recorded in `templates/classic/fixes.yaml`. |
| Markets | `worldwide` (default: phone shown, B2B or full-time, time-zone line, contract labels for entries that really were contracts) and `ukraine` (no phone, no availability line, no time-zone line, no contract labels). Both hide the master CV's headline qualifier "(Frontend and Mobile)" (`hide_headline_qualifier: master`); variants keep theirs. Every CV is built for both (cv-spec 14). |
| Decisions already made in this chat | Recorded in `facts/decisions.yaml` so reviewers don't raise them again: no LinkedIn/GitHub links (the old CV had them, so they can come back), keep the current length, keep the Drive portfolio link, keep the job title step from GM to SYSPRO |
| Variants vs manual edits | Variants are generated. The master CV's wording is reused by source id, and lasting variant tweaks go in profile `overrides` |
| Application log | Optional `facts/applications.yaml`, git-ignored by default |
| Employer confidentiality | Repo is local or on a private remote only. Summaries are written in your own words with no code, copied internal text, URLs or secrets. |
| Commits | Agents never commit. You review the diff and commit. |
| Projects hidden from the CV | Supported with `show_in_cv: false`. Composer and tailor skip them, but they stay available for the portfolio and can be switched on later. |

## 11. Out of scope for now

- **PDF input for `/import-template`:** Word input works; PDF input (planned in `specs/templates.md` 4) is deferred until you need a template from a PDF CV.
- **Portfolio output:** built (`specs/outputs/portfolio.md`, section 9e, P1–P6, 2026-10-23). The `portfolio-classic` template is approved (2026-10-23); what's left is content, not scope: choosing projects and screenshots (`/portfolio-material`), writing (`/portfolio`), building and reviewing.
- Cover-letter agent (the format leaves room to add it later).
- Pulling history from remote GitHub or Azure DevOps (local clones only, while you have access).
- A fully code-driven pipeline (Agent SDK CLI). It can wrap the same `agents/*.md` later.
- Translating the CV into other languages. If a local market ever needs a Ukrainian CV, it fits as a market setting (`language: uk`) with an agent translation that you review.

## 12. Change log

The change log is in `docs/changelog.md`; add a row there for every change. Its rows 1–36 map every step done by hand in the 2026-10-15 chat to the capability that repeats it.
