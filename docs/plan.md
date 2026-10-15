# CV Agent Framework: Plan

Status: draft for review · 2026-10-15

## 1. Goal

A small, local, specification-driven (SDD) framework that keeps the CV current and traceable:

1. Generate a work summary from a local repo clone.
2. Compose the master CV from summaries and confirmed facts.
3. Tailor the CV to a specific job description.
4. Review the CV with several independent reviewers that write reports and never edit the CV.
5. Render to `.docx` (and PDF) using the existing Word template.

## 2. Principles

- **Specs come first.** Every agent follows a written spec in `specs/`. An agent that changes behavior changes its spec first.
- **Every claim needs a source.** Each CV bullet must trace to a work summary or a confirmed fact. Unsourced bullets are flagged, not silently allowed.
- **Tool-neutral.** `AGENTS.md` is the entry point, and agent definitions are plain Markdown in `agents/`. Claude Code files in `.claude/` are thin wrappers that point to them. Codex, Cursor, Gemini CLI or anything else can run the same agents by reading `AGENTS.md`.
- **Deterministic work is done by scripts, not AI:** rendering, linting and trace checking. Any agent, or you, runs them with `npm run …`.
- **Private by default.** Summaries may contain internal names. Only the CV and its tailored versions are scrubbed, following confidentiality rules in the facts file.
- **Reviewers only write reports.** You decide what to change.

## 3. Repository layout

```
CV/
├── AGENTS.md                      # entry point for any AI tool: layout, workflows, rules, commands
├── CLAUDE.md                      # one line: "Read AGENTS.md"
├── README.md                      # for humans: what this is, how to run it
├── package.json                   # npm scripts: render, pdf, lint, trace, check
├── specs/
│   ├── cv-spec.md                 # CV structure and writing rules (seeded from this chat)
│   ├── work-summary-spec.md       # summary template + front matter schema
│   ├── tailoring-spec.md          # how a tailored CV may differ from the master
│   └── rubrics/
│       ├── ats.md                 # AI ATS screener rubric
│       ├── hr.md                  # recruiter / HR reader rubric
│       ├── proofreading.md        # spelling, grammar, consistency
│       ├── fact-check.md          # claim -> source tracing
│       └── confidentiality.md     # client names, internal codes, ticket IDs
├── agents/                        # tool-neutral agent definitions (role, inputs, outputs, spec, steps)
│   ├── harvester.md
│   ├── composer.md
│   ├── tailor.md
│   └── reviewer.md                # one generic reviewer, run once per rubric
├── facts/
│   ├── profile.yaml               # name, contacts, location, availability, education, languages
│   └── confirmed.yaml             # facts and decisions you confirmed, each with id + source
├── summaries/                     # one file per project, all following work-summary-spec
│   ├── syspro-saas-erp.md
│   ├── orion-mobile-clinical-ink.md
│   └── designai-jira-plugin.md
├── cv/
│   ├── Kirill_Kohan_CV.md         # master CV (generated, hand-editable)
│   ├── Kirill_Kohan_CV.docx
│   └── tailored/<company-role>/   # cv.md, cv.docx, job-description.md, gap-report.md
├── templates/
│   └── cv-template.docx           # current Kirill_Kohan_CV_prev.docx, committed
├── reports/<YYYY-MM-DD>/          # reviewer reports: ats.md, hr.md, proofreading.md, ...
├── scripts/                       # Node/TypeScript CLIs
│   ├── render-docx.ts
│   ├── export-pdf.ts              # macOS Pages via osascript
│   ├── lint-cv.ts
│   └── trace-check.ts
└── .claude/
    ├── agents/                    # thin wrappers -> agents/*.md
    └── commands/                  # /harvest /compose /tailor /review /render
```

## 4. Data formats

### 4.1 Work summary front matter (`summaries/*.md`)

```yaml
---
id: syspro-saas-erp                # stable id used in trace references
client: SYSPRO                     # real name, private
cv_client_label: SYSPRO            # what the CV may show; e.g. "Clinical Trials Patient App"
role: Senior Software Engineer
engagement: full-time              # full-time | contract | freelance
period: { start: 2025-12, end: present }
show_dates_in_cv: true             # false for freelance entries
repos:
  - { name: saas-frontend-repo, path: ~/work/saas-frontend-repo }
author_identities: [Kyrylo Kohan, Kyrylo Kokhan, FrozenPyrozen]
harvested_at: 2026-09-30
---
```

Additional front matter fields:

```yaml
schema_version: 1                  # bumped when the summary format changes (see section 9)
show_in_cv: true                   # false = kept as a source, never used in CV/tailored output; can be flipped later
cv_section: experience             # which CV section the entry goes into: experience | consulting (ids from framework.config.yaml)
cv_order: 1                        # optional; default is newest-first inside the section
domain: [ERP, SaaS]                # industry tags, used by tailoring and later the portfolio
```

**CV placement.** Each summary decides which CV section its entry goes in, so any job can appear under **EXPERIENCE** or under **CONSULTING AND FREELANCE PROJECTS**, and you can move it by changing one field:

| Field | `experience` (e.g. SYSPRO, GM) | `consulting` (e.g. Clinical Ink, Jira plugin) |
|---|---|---|
| `cv_section` | `experience` | `consulting` |
| `show_dates_in_cv` | `true` (MM/YYYY ranges) | `false` by default, can be set to `true` |
| `cv_client_label` | real company name | can hide the client, e.g. "Clinical Trials Patient App" |

The sections themselves are listed in `framework.config.yaml`, which sets each section's heading text, order, intro line and whether dates are shown by default:

```yaml
cv_sections:
  - id: experience
    heading: EXPERIENCE
    show_dates: true
  - id: consulting
    heading: CONSULTING AND FREELANCE PROJECTS
    intro: Part-time contract and consulting work, alongside full-time roles
    show_dates: false
```

Entries that don't come from a single repo, such as **Software Engineering Consultant / Various Clients**, are defined in `facts/confirmed.yaml` with the same fields (`cv_section: consulting`), so they're placed the same way. A new section (for example *OPEN SOURCE* or *PUBLICATIONS*) is added in config only. Lint fails if a summary uses an unknown `cv_section`.

A summary is the **single source of truth for a project**. The CV uses it now, and the portfolio (and other outputs) will use it later. So the body is richer than what the CV needs and follows fixed sections:

1. **Project overview:** what the product is, who uses it, the business problem, and your team and organization context.
2. **Main features:** the product's key features, described in user terms whether or not you built them, so a portfolio reader understands the product.
3. **My role and responsibilities:** your title, ownership areas, leadership, architecture and process responsibilities, and who you worked with (for example, the lead architect).
4. **My contributions:** numbered work items (`4.1`, `4.2` …) that the CV cites as `syspro-saas-erp#4.2`. Each item gives what you built, why, and the result.
5. **Technologies and frameworks:** grouped by category (language, UI, state, testing, CI/CD, cloud, AI and agents …) with versions where known, marked *hands-on* or *used by the project*.
6. **Skills demonstrated:** a skills list mapped to the contributions that prove each skill.
7. **Metrics and outcomes:** each number with its source (git history, the user, or a dashboard) and a confidence level.
8. **Portfolio material:** links, screenshots and demo notes, plus what is safe to show publicly. Left empty until you share portfolio details.
9. **Confidentiality notes:** internal names, codes and tickets that must not leave this file.

### 4.2 Confirmed facts (`facts/confirmed.yaml`)

Seeded from this chat:

```yaml
- id: syspro-team-size
  fact: SYSPRO platform program has 25+ people (FE, BE, architects)
  source: user, 2026-10-15
- id: syspro-speed
  fact: Schema-driven runtime cut time to bring an ERP screen to web from days to hours
  source: user, 2026-10-15
- id: syspro-review-cycles
  fact: SDD process reduced PR review cycles (no exact number)
  source: user, 2026-10-15
- id: syspro-architecture-scope
  fact: Reviewed and co-authored platform/solution architecture docs with the lead architect, resolved open architecture questions, helped define the SDD process (spec templates, validation routine, AI agent rules)
  source: user, 2026-10-15
- id: contract-roles
  fact: OMO Systems, Thermo Fisher Scientific and The Admasters were direct contracts; GM and Velas were direct full-time
  source: user, 2026-10-15
- id: availability
  fact: Open to B2B contract or full-time employment
  source: user, 2026-10-15
- id: consulting-presales
  fact: Technical interviews (React, React Native, JS, TS), legacy React Native audits with estimations, presales technical expertise
  source: user, 2026-10-15
- id: various-clients-entry          # a CV entry defined in facts, not in a summary
  type: cv_entry
  role: Software Engineering Consultant
  cv_client_label: Various Clients
  cv_section: consulting
  show_dates_in_cv: false
  period: { start: 2017-01, end: present }
  source: user + previous CV
```

Rules that came out of this chat (SDD emphasis, freelance entries without dates, hidden client names, no `→`/`·`/`•`/`—`, "SYSPRO" spelling) go into `specs/cv-spec.md`, not the facts file.

### 4.3 Trace references in the CV

The composer adds an HTML comment after each bullet, which Markdown viewers and the renderer ignore:

```markdown
* Built the **Login micro-frontend** from scratch ... <!-- src: syspro-saas-erp#1.1 -->
```

`trace-check` reports bullets with no `src`, and `src` ids that don't resolve to a summary section or a fact id.

## 5. Agents

| Agent | Input | Output | Spec / rubric |
|---|---|---|---|
| **Harvester** | repo path(s), project id, author identities | `summaries/<id>.md` | work-summary-spec |
| **Composer** | all summaries, facts, current CV | updated `cv/Kirill_Kohan_CV.md` with trace comments + short change log in the reply | cv-spec |
| **Tailor** | job description file, master CV, summaries, facts | `cv/tailored/<company-role>/cv.md` + `gap-report.md` | tailoring-spec (may reorder, re-emphasize, drop; may not add unsourced claims) |
| **Reviewer** (run per rubric) | CV file, rubric, summaries/facts (fact-check only) | `reports/<date>/<rubric>.md` with verdict, score, findings (line, issue, suggestion) | rubrics/* |

Reviewer set: **ATS**, **HR**, **proofreading**, **fact-check**, **confidentiality**. They run in parallel when the tool supports it, otherwise one after another.

## 6. Scripts (`npm run …`)

| Script | What it does |
|---|---|
| `render [file]` | Markdown to `.docx` using `templates/cv-template.docx`. This ports the build script used in this chat, including the Pages bullet-indent fix. Defaults to the master CV. |
| `pdf [file]` | `.docx` to `.pdf` via Pages (`osascript`). macOS only. |
| `lint [file]` | Deterministic checks: forbidden characters, date format, duplicate skills, word count, heading structure, bold balance |
| `trace [file]` | Claim-to-source check (section 4.3) |
| `check` | lint + trace for the master CV and all tailored CVs |

Dependencies: TypeScript run with `tsx`, `jszip` for reading and writing `.docx`, `yaml` for front matter and facts. No LibreOffice and no Python, since your Homebrew Python's XML parser is currently broken.

## 7. Workflows (commands)

| Command | Steps |
|---|---|
| `/harvest <repo-path> <id>` | Harvester writes the summary, then you review it |
| `/compose` | Composer updates the master CV, then `npm run check` |
| `/tailor <jd-file>` | Tailor creates the variant and gap report, then `npm run check` and `npm run render` on it |
| `/review [cv-file] [rubric…]` | Runs the reviewers (default all 5) and writes `reports/<date>/` |
| `/render [cv-file]` | `npm run render`, plus `npm run pdf` if asked |

Each command file in `.claude/commands/` only says "follow `agents/<name>.md`". The same instructions are listed in `AGENTS.md` for other tools.

## 8. Build steps

Each step ends with something you can check.

1. **Restructure and preserve.** Create the folders. Move the CV files to `cv/` and the template to `templates/` (committing the template). Move the summaries to `summaries/` with the new names. Add `package.json`.
   *Check:* `git status` shows moves only, no content changes.
2. **Specs.** Write `cv-spec.md` (the current CV's structure plus every rule from this chat), `work-summary-spec.md`, `tailoring-spec.md` and the 5 rubrics. The ATS and HR rubrics are based on the reviews done in this chat.
   *Check:* you review the specs. This is the most important review.
3. **Facts.** Write `profile.yaml` and `confirmed.yaml` (section 4.2).
   *Check:* you confirm every entry is true.
4. **Migrate summaries.** Add front matter and restructure the body into the 9 sections from section 4.1, numbering the contributions. Existing content is kept. Sections the old summaries don't cover (for example, *Main features* for the Jira plugin, *Portfolio material*) are filled only from what the summary already says, or marked `TODO (needs user input)`. Nothing is invented.
   *Check:* you review the 3 migrated summaries and fill in the TODOs.
5. **Scripts and config.** `framework.config.yaml`, `schemas/`, `scripts/lib/`, the docx renderer, `pdf`, `lint`, `trace`, `validate`, `index` and `check`, each with fixture tests.
   *Check:* `npm test` passes, `npm run validate` passes on all summaries and facts, and `npm run render` produces a `.docx` matching the current one.
6. **Agents and wrappers.** `agents/*.md`, `.claude/agents/*`, `.claude/commands/*`, `AGENTS.md`, `CLAUDE.md`.
7. **Trace the current CV.** Run the composer once in "annotate only" mode to add `src` comments to the existing CV without changing its text. Then run `npm run check`.
   *Check:* every bullet resolves, or the gaps are listed for you.
8. **First full review run.** Run `/review` with all 5 rubrics.
   *Check:* the reports match what we found by hand in this chat.
9. **README.**

## 9. Scalability

The framework is designed so new outputs, reviewers and agents are **added as files, not by changing existing code**.

- **Sources and outputs are separate.** Summaries and facts are the sources. The CV, tailored CVs, and later the portfolio, a LinkedIn profile or cover letters are *outputs*. Each output is defined by one spec plus an optional renderer, so adding the portfolio later means adding `specs/outputs/portfolio.md` and an agent, without touching summaries.
- **Folders act as registries:**
  - Any file in `specs/rubrics/` is a reviewer. Dropping in `rubrics/frontend-architect-role.md` adds a reviewer with no other changes.
  - Any file in `agents/` is listed in `AGENTS.md` by the `index` script, so new agents are discovered automatically.
  - Any renderer in `scripts/renderers/` (docx now, then PDF, HTML or JSON) is chosen by file type or output type.
- **One config file.** `framework.config.yaml` sets paths, default rubrics, the default renderer, the template, the CV owner and the spelling variant (US). Scripts and agents read it instead of hard-coding values.
- **Versioned, validated formats:**
  - Summaries, facts and reports carry `schema_version`.
  - JSON Schemas in `schemas/` are checked by `npm run validate`.
  - When a format changes, a migration script moves old files forward, so old summaries never silently break.
- **Shared engine.** Markdown parsing, front matter and trace resolution live in one `scripts/lib/` module used by every script, so a new renderer or check is a small file.
- **Tests with fixtures.** Each script has fixture inputs and expected outputs, so changes are safe as the framework grows.
- **Tool-neutral contracts.** Agent definitions only use files and `npm run` commands, never tool-specific features. The Claude Code wrappers, and later Codex, Cursor or Agent SDK wrappers, stay replaceable.

Updated layout additions:

```
├── framework.config.yaml
├── schemas/                        # summary.schema.json, facts.schema.json, report.schema.json
├── specs/outputs/                  # cv.md, tailored-cv.md (later: portfolio.md, linkedin.md, cover-letter.md)
└── scripts/
    ├── lib/                        # shared md/front-matter/trace engine
    ├── renderers/docx.ts
    ├── migrations/
    ├── index.ts                    # regenerates the agents/rubrics/outputs list in AGENTS.md
    └── validate.ts
```

## 10. Decisions

| Topic | Decision |
|---|---|
| Spelling | US English, enforced by the proofreading rubric and `framework.config.yaml` |
| Local clone paths | Stored in summary front matter (`repos[].path`), so a summary can be re-harvested later |
| Tailored CVs in git | `cv/tailored/` is in `.gitignore` by default. To keep one, run `git add -f`. The tailor agent reminds you of this after each run. |
| Projects hidden from the CV | Supported with `show_in_cv: false`. Composer and tailor skip them, but they stay available for the portfolio and can be switched on later. |

## 11. Out of scope for now

- **Portfolio output:** the summaries already collect what it needs (section 4.1). The portfolio spec, agent and renderer come once you share your portfolio format.
- Cover-letter agent (the format leaves room to add it later).
- Pulling history from remote GitHub or Azure DevOps (local clones only).
- A fully code-driven pipeline (Agent SDK CLI). It can wrap the same `agents/*.md` later.
- Translating the CV into other languages.

