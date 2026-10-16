# CV Agent Framework: Plan

Status: steps 1–8 built (section 8); next: step 9 · 2026-10-15

## 1. Goal

A small, local, specification-driven (SDD) framework that keeps the CV current and traceable:

1. Generate a work summary from a local repo clone.
2. Compose the master CV from summaries and confirmed facts.
3. Tailor the CV to a specific job description.
4. Review the CV with several independent reviewers that write reports and never edit the CV.
5. Improve the CV together with you: go through review findings one at a time, ask you questions, and record your answers as confirmed facts.
6. Build `.docx` and PDF from any Word template, including templates imported from someone else's Word or PDF CV.

Every step done by hand in the 2026-10-15 chat maps to a framework capability (section 12).

## 2. Principles

- **Specs come first.** Every agent follows a written spec in `specs/`. An agent that changes behavior changes its spec first.
- **Every claim needs a source.** Each CV bullet must trace to a work summary or a confirmed fact. Unsourced bullets are flagged, not silently allowed.
- **Tool-neutral.** `AGENTS.md` is the entry point, and agent definitions are plain Markdown in `agents/`. Claude Code files in `.claude/` are thin wrappers that point to them. Codex, Cursor, Gemini CLI or anything else can run the same agents by reading `AGENTS.md`.
- **Deterministic work is done by scripts, not AI:** rendering (Markdown to Word to PDF), PDF checks, previews, linting and trace checking. Any agent, or you, runs them with `npm run …`.
- **Private by default.** Summaries may contain internal names. Only the CV outputs are scrubbed, using each summary's *Confidentiality notes* (enforced by the lint blocklist and the confidentiality reviewer).
- **Employer confidentiality.** The repo stays local or on a *private* remote only. Summaries describe your work in your own words: no source code, no copied internal document text, no internal URLs, no secrets. The harvester spec and lint enforce this.
- **Summaries are the lasting record.** Access to employer and client repos ends with the job, so a summary must stand on its own: it names the repos it came from but stores no remote URLs, and the last harvest happens before you leave (`/job-change`).
- **Agents never commit.** Every agent leaves its changes uncommitted and shows a diff. You review and commit, and git history is the undo.
- **Every AI step ends with a deterministic check.** Agents finish by running `validate` (after changing summaries, facts or profiles) or `check`/`build` (after changing a CV), and report failures instead of hiding them.
- **Reviewers only write reports.** You decide what to change.
- **Your manual edits are kept.** You can edit any CV Markdown by hand at any time. Agents always start from the file as it is on disk, show a diff of their changes, and never revert your edits silently.

## 3. Repository layout

```
CV/
├── AGENTS.md                      # entry point for any AI tool: layout, workflows, rules, commands
├── CLAUDE.md                      # "Read AGENTS.md" + "do not use cns:* skills in this repo"
├── README.md                      # for humans: what this is, how to run it
├── docs/                          # plan.md (this file), acceptance.md (replay checklist for agents)
├── framework.config.yaml          # paths, sections, display formats, output names, checks, exporters, tags
├── framework.local.yaml           # per-laptop settings: repo paths, backup folder, exporter order (git-ignored)
├── framework.local.example.yaml   # committed example of the file above
├── .nvmrc                         # Node version
├── package-lock.json              # exact dependency versions (committed; install with `npm ci`)
├── package.json                   # scripts: build, build:all, render, pdf, pdf-check, preview, lint, trace,
│                                  #          check, status, validate, index, template-import, test, doctor, refresh, market,
│                                  #          backup, restore, digest, git-digest, select, reattach-src, typecheck,
│                                  #          log-application
├── tsconfig.json                  # TypeScript settings (type check only; scripts run with tsx)
├── specs/
│   ├── cv-spec.md                 # CV structure and writing rules (seeded from this chat)
│   ├── work-summary-spec.md       # summary template + front matter schema
│   ├── tailoring-spec.md          # how variants and tailored CVs may differ from the master
│   ├── templates.md               # template import rules and style-map format
│   ├── review-report-spec.md      # shared format for every reviewer report
│   ├── outputs/                   # (created when first needed) specs for future output types (portfolio.md, linkedin.md, cover-letter.md); the CV's
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
│   └── template-importer.md       # labels paragraphs of a sample CV to create a style map
├── facts/
│   ├── profile.yaml               # the only place for personal details; the CV header is generated from it (4.2a)
│   ├── confirmed.yaml             # facts you confirmed, each with id, source, entry and tags (4.2)
│   ├── skills.yaml                # the SKILLS section's only source (4.2b)
│   ├── decisions.yaml             # choices you made about the CV (e.g. "no LinkedIn"), so reviewers stop re-raising them
│   └── applications.yaml          # optional log: which CV/PDF went to which company and when (4.5)
├── summaries/                     # one file per job/project, all following work-summary-spec
│   └── .digests/                  # generated short digests (contributions + tags) read by composer/tailor (R10; git-ignored,
│                                  # recreated by `npm run digest`)
├── profiles/                      # role profiles: react.yaml, react-native.yaml, fullstack-react-node.yaml, nodejs.yaml
├── markets/                       # market definitions: worldwide.yaml, ukraine.yaml (4.6)
├── cv/
│   ├── <name>_CV.md               # master CV (generated, hand-editable); file name from config
│   ├── <name>_CV.docx / .pdf / pdf-check.md / preview/   # built outputs, git-ignored
│   ├── markets/<market-id>/       # non-default market versions of the master CV (generated, git-ignored; 4.6)
│   ├── variants/<profile-id>/     # role-based CVs (generated, not hand-edited): cv.md + gap-report.md committed; built files git-ignored
│   │   └── markets/<market-id>/   # non-default market versions of each variant (generated, git-ignored)
│   ├── tailored/<company-role>/   # per job ad (git-ignored): cv.md, .docx, .pdf, job-description.md, jd-tags.yaml, gap-report.md
│   ├── sent/                      # optional exact copies of PDFs you sent (git-ignored, included in backups; 4.5)
│   └── .build-state.json          # per built CV: template, CV Markdown hash, source, output and per-entry hashes (local, git-ignored)
├── templates/
│   └── <name>/                    # one folder per template; "classic" = your previous CV
│       ├── source.docx            # the original file the template was imported from (own CVs only)
│       ├── import-map.yaml        # the agent's paragraph labels for template-import
│       ├── template.docx          # styles only, sample content removed (an input, so committed)
│       ├── style-map.yaml         # per paragraph type (title, h1, h2, h3+date, bullet, body, skills line): a sample paragraph
│                                  # with its full formatting, not just a style name (R2); also lists the template's fonts
│       ├── fixes.yaml             # renderer fixes for this template (e.g. bullet indent for Pages)
│       ├── reference-preview.png  # approved look, used by the layout reviewer
│       └── import-report.md       # ATS warnings + test build, written by the template-importer agent (step 6);
│                                  # classic predates it and has none
├── reports/<YYYY-MM-DD-HHmm>/     # reviewer reports for one run: ats.md, hr.md, proofreading.md, ...
├── .cv-runs/<run-id>/             # per-run working files: state.json (resume), git-digest.md (git-ignored)
├── schemas/                       # common, config, summary, confirmed, decisions, profile, skills, market, style-map,
│                                  # fixes, report; profile-role (step 8)
├── scripts/                       # Node/TypeScript CLIs
│   ├── lib/repo.ts                # shared loader: config, summaries, facts, profile, skills, markets, entries, CLI paths
│   ├── lib/cvmd.ts                # CV Markdown model: generated parts (header, entry lines, blocks) per market and role profile
│   ├── lib/paths.ts               # output file names and market output paths
│   ├── lib/text.ts                # text normalization for pdf-check (R4)
│   ├── lib/lock.ts                # export lock: one PDF export at a time (R1)
│   ├── git-digest.ts              # condenses a repo's history into a compact digest for the harvester (R9, R11)
│   ├── digest.ts                  # writes summaries/.digests/ from summaries + facts (R10)
│   ├── select.ts                  # deterministic bullet selection/ordering by profile or job-ad tags (R8)
│   ├── reattach-src.ts            # re-attaches source comments after an agent edit (R7)
│   ├── build.ts                   # build and build:all: validate -> refresh -> lint -> trace -> markets -> docx -> pdf -> pdf-check -> preview
│   ├── render.ts                  # npm run render: Markdown -> .docx (picks the template and output name)
│   ├── renderers/docx.ts          # template-driven Word renderer
│   ├── lib/docx.ts                # .docx zip and XML helpers
│   ├── exporters/                 # pages.ts, word.ts, libreoffice.ts
│   ├── export-pdf.ts              # npm run pdf: runs exporters in config order, under the lock, with a timeout
│   ├── pdf-check.ts               # ATS-readability and fidelity check of a built PDF (6.2)
│   ├── preview.ts
│   ├── template-import.ts         # Word sample -> templates/<name>/ (PDF later)
│   ├── refresh.ts                 # regenerates the script-owned parts of a CV (4.2d)
│   ├── market.ts                  # writes market versions (4.6)
│   ├── lint.ts
│   ├── trace.ts
│   ├── check.ts                   # lint + trace for every CV
│   ├── status.ts                  # which CVs are stale and why; sent-CV warnings
│   ├── doctor.ts                  # environment check with a tiny real export (R3, R12)
│   ├── backup.ts                  # backup and restore (npm run restore = backup.ts --restore)
│   ├── log-application.ts         # records a sent CV in facts/applications.yaml (4.5)
│   ├── lib/buildstate.ts          # build records: source/output hashes
│   ├── validate.ts                # JSON Schema validation of all inputs
│   ├── index.ts                   # regenerates the agents/rubrics/profiles/outputs list in AGENTS.md
│   └── migrations/                # (created when the first format change needs one)
├── tests/                         # *.test.ts (node:test); helpers.ts runs scripts on a temp copy of the repo (CV_ROOT)
│   └── fixtures/                  # for hand-made inputs if a test ever needs them; today every test copies the
│                                  # real repo to a temp folder and breaks it on purpose (empty, not tracked)
└── .claude/
    ├── agents/                    # thin wrappers -> agents/*.md
    └── commands/                  # /harvest /compose /tailor /variants /review /improve /add-experience
                                   # /profile /job-change /add-repo /import-template /build /status /log-application /doctor
```

## 4. Data formats

### 4.1 Work summary front matter (`summaries/*.md`)

```yaml
---
schema_version: 1                  # bumped when the summary format changes (see section 9)
id: syspro-saas-erp                # stable id used in trace references; lowercase-kebab <client>-<project>, suggested by /harvest
                                   # when <id> is omitted and confirmed by you; never renamed later (CV sources depend on it)
source: git                        # git (harvested) | cv (built from old CV text, step 4) | user (/add-experience, /job-change)
# --- the job ---
client: SYSPRO                     # real name, private
role: Senior Software Engineer
engagement: full-time              # full-time | contract | freelance
period: { start: 2025-12, end: present }
domain: [ERP, SaaS]                # industry tags, used by tailoring and later the portfolio
team_size_led: 0                   # optional; people you led on this job (used by 4.2c), e.g. 8 for GM
counts_as_experience: true         # optional; default true for experience entries, false for consulting (used by 4.2c)
# --- harvesting ---
repos:
  - { name: saas-frontend-repo }   # name only: no remote URL (access ends with the job) and no local path (per laptop, in framework.local.yaml)
author_identities: []              # optional; empty = use profile.yaml git_identities
harvested_at: 2026-09-30           # null for source: cv / user
# --- how it appears in the CV ---
show_in_cv: true                   # false = kept as a source, never used in CV/tailored output; can be flipped later
cv_section: experience             # section id from framework.config.yaml: experience | consulting | ...
cv_order: 1                        # optional; default is newest-first inside the section
cv_client_label: SYSPRO            # what the CV may show; e.g. "Clinical Trials Patient App"
cv_location: Remote                # e.g. Remote, "Kyiv, Ukraine (Hybrid)"
show_dates_in_cv: true             # optional; if missing, the cv_section's show_dates default applies
# cv_title_suffix: " (Contract)"   # optional; if missing, derived from engagement (contract -> display.contract_suffix)
cv_emphasis:                       # what this entry must make clear; the composer puts it in the first bullets
  - Architecture-governed specification-driven development (SDD), not ad-hoc AI code generation
  - Owned the frontend technology stack, worked with the lead architect
cv_max_bullets: 8                  # optional length limit for this entry in the master CV
---
```

**Optional fields follow one rule:** if a field is missing, the default applies (from config, the section or `engagement`); if it's set, it wins.

**CV placement.** Each summary decides which CV section its entry goes in, so any job can appear under **EXPERIENCE** or under **CONSULTING AND FREELANCE PROJECTS**, and you can move it by changing one field:

| Field | `experience` (e.g. SYSPRO, GM) | `consulting` (e.g. Clinical Ink, Jira plugin) |
|---|---|---|
| `cv_section` | `experience` | `consulting` |
| `show_dates_in_cv` | `true` ("December 2025 - Present") | `false` by default, can be set to `true` |
| `cv_client_label` | real company name | can hide the client, e.g. "Clinical Trials Patient App" |

**All** CV sections are listed in `framework.config.yaml`, in the order they appear. Each has a heading text, an on/off switch, an optional intro line and a source. Profiles can override `enabled` and the order through `include_sections`:

```yaml
cv_sections:
  - { id: summary,    heading: SUMMARY,    enabled: true, source: composer }
  - { id: experience, heading: EXPERIENCE, enabled: true, source: entries, show_dates: true }
  - id: consulting
    heading: CONSULTING AND FREELANCE PROJECTS
    enabled: true
    source: entries
    intro: Part-time contract and consulting work, alongside full-time roles
    show_dates: false
  - { id: education,  heading: EDUCATION,  enabled: true, source: profile.education }
  - { id: skills,     heading: SKILLS,     enabled: true, source: skills }
  - { id: languages,  heading: LANGUAGES,  enabled: true, source: profile.languages }
```

Entries that don't come from a single repo, such as **Software Engineering Consultant / Various Clients**, are defined in `facts/confirmed.yaml` with the same fields (`cv_section: consulting`), so they're placed the same way. A new section (for example *OPEN SOURCE* or *PUBLICATIONS*) is added in config only. `validate` fails if a summary uses an unknown `cv_section`.

A summary is the **single source of truth for a project**. The CV uses it now, and the portfolio (and other outputs) will use it later. So the body is richer than what the CV needs and follows fixed sections:

1. **Project overview:** what the product is, who uses it, the business problem, and your team and organization context.
2. **Main features:** the product's key features, described in user terms whether or not you built them, so a portfolio reader understands the product.
3. **My role and responsibilities:** your title, ownership areas, leadership, architecture and process responsibilities, and who you worked with (for example, the lead architect).
4. **My contributions:** numbered work items (`4.1`, `4.2` …) that the CV cites as `syspro-saas-erp#4.2`. Each item gives what you built, why, and the result, and ends with a tags line from the shared tag list in `framework.config.yaml`. Role profiles use these tags to pick and order bullets (section 4.4):
   ```markdown
   ### 4.2 Login micro-frontend
   ...
   Tags: react, typescript, micro-frontends, oidc, accessibility, storybook, testing
   ```
5. **Technologies and frameworks:** grouped by category (language, UI, state, testing, CI/CD, cloud, AI and agents …) with versions where known, marked *hands-on* or *used by the project*.
6. **Skills demonstrated:** a skills list mapped to the contributions that prove each skill.
7. **Metrics and outcomes:** each number with its source (git history, the user, or a dashboard) and a confidence level.
8. **Portfolio material:** links, screenshots and demo notes, plus what is safe to show publicly. Left empty until you share portfolio details.
9. **Confidentiality notes:** internal names, codes and tickets that must not leave this file.

### 4.2 Confirmed facts (`facts/confirmed.yaml`)

Seeded from this chat (the real file is `facts/confirmed.yaml`, format in `schemas/confirmed.schema.json`):

```yaml
schema_version: 1
facts:
  - id: syspro-team-size
    fact: The SYSPRO platform program has 25+ people (frontend, backend, architects).
    source: user, 2026-10-15
    entry: syspro-saas-erp           # which job this fact belongs to (summary id or cv_entry id)
    tags: [scale, enterprise]
  - id: consulting-presales          # interviews, audits and presales are 3 separate facts
    fact: Provided technical expertise for presales, including solution proposals, effort estimations and answering technical questions in client calls.
    source: user, 2026-10-15
    entry: various-clients
    tags: [presales, estimation]
  - id: various-clients              # a CV entry defined in facts, not in a summary
    type: cv_entry
    role: Software Engineering Consultant
    client: Various Clients
    cv_client_label: Various Clients
    cv_location: Remote
    engagement: freelance
    period: { start: 2017-01, end: present }
    cv_section: consulting
    show_dates_in_cv: false
    counts_as_experience: false
    source: user + previous CV
```

Every fact has `entry` (which job it belongs to) and `tags` (from the shared tag list), so the composer knows where to place it and role profiles can select it just like summary contributions. Contract status and availability are **not** facts. The employment type lives in each entry's `engagement` field (a summary, or a `cv_entry` fact as above), and availability in `profile.yaml` (`work.engagement_types`).

**Supported Markdown** (defined in cv-spec, enforced by lint): `#`/`##`/`###` headings, `*` bullets (one level), `**bold**`, links, plain paragraphs, and HTML comments (trace and generated markers). Anything else (italics, tables, nested lists, images, code, block quotes) fails lint, because the Word renderer and screening software can't represent it reliably.

Rules that came out of this chat (SDD emphasis, freelance entries without dates, hidden client names, no `→`/`·`/`•`/`—`/`–`, "SYSPRO" spelling) go into `specs/cv-spec.md`, not the facts file.

### 4.2a Personal profile (`facts/profile.yaml`)

All personal details live **only** here. The CV header is **always generated** from this file and never typed into the Markdown, so changing your phone or country is one edit followed by a rebuild.

```yaml
schema_version: 1
name: Kirill Kohan
legal_name: Kyrylo Kokhan              # optional; shown as "Kirill (Kyrylo) Kohan" if show_legal_name is true
show_legal_name: false
git_identities: [Kyrylo Kohan, Kyrylo Kokhan, Kyrylo_Kokhan, FrozenPyrozen]   # default author names for /harvest
headline_default: Senior Software Engineer / Tech Lead (Frontend & Mobile)   # profiles can override
contacts:
  phone: "+380 97 891 9783"            # international format, checked by validate
  email: kiril.kohan@gmail.com
  links:
    - { label: Portfolio, url: "https://drive.google.com/file/d/1-BtpQknjSQ9bxTFAKm6v-r3DQR7IOX6s/view?usp=sharing", show: true }
    - { label: LinkedIn, url: "https://www.linkedin.com/in/kyrylo-kohan/", show: false }
    - { label: GitHub, url: "https://github.com/FrozenPyrozen", show: false }
location:
  city: Kyiv
  country: Ukraine
  remote: true
  time_zone: Europe/Kyiv
  overlaps: [EU, UK, US]               # generates "Working hours overlap with EU, UK and US time zones"
work:
  engagement_types: [b2b-contract, full-time]   # generates "Open to B2B contract or full-time employment"
  work_authorization: []               # e.g. ["EU work permit"]; shown when not empty
  open_to_relocation: false
education:
  - { degree: "PhD Candidate, Computer Science", status: in-progress, institution: National University of Life and Environmental Sciences, country: Ukraine, start: 2023, end: 2027, end_expected: true }
  - { degree: Master of Computer Science, institution: National University of Life and Environmental Sciences, country: Ukraine, start: 2020, end: 2022, honors: "Honors Diploma (top 10% of graduates)" }
  - { degree: Bachelor of Computer Science, institution: National Aviation University, country: Ukraine, start: 2016, end: 2020 }
languages:
  - { language: English, level: "C1 (Advanced)" }
  - { language: Ukrainian, level: Native }
```

Rules:
- The header lines (name, headline, location, availability, time zones, contacts) are generated from these fields with templates set in `framework.config.yaml`. Changing `country` changes every line that depends on it.
- `lint` fails if any CV, role version or tailored CV has a header that doesn't match the generated one (for example, an old phone number left in one file).
- The HR rubric reads `location` and `work` to choose its questions: hiring setup from Ukraine, a work permit in a new country, relocation, time-zone overlap.

### 4.2b Skills (`facts/skills.yaml`)

The SKILLS section is generated from this file. Nothing is typed into the CV.

```yaml
schema_version: 1
categories:
  - id: languages
    label: Languages
    items:
      - { name: TypeScript, tags: [typescript] }
      - { name: JavaScript (ES6+), tags: [javascript] }
  - id: mobile
    label: Mobile
    items:
      - { name: React Native, tags: [react-native] }
      - { name: Android (Java, Kotlin, Gradle), tags: [android] }
  # frontend, state-and-data, backend-and-cloud, auth-and-security, testing, devops, ai, domain, leadership ...
```

- Role profiles reorder categories with `skills_order` (category ids) and can hide categories or items.
- Optional item fields: `calculated: team_size_led` (the number in the skill name comes from calculated values, 4.2c) and `hidden: true` (kept but not shown).
- A skill counts as **supported** when its tags appear on a contribution or fact, or when the skill is listed as **hands-on** in a summary's section 5 (e.g. Fastlane and Bitrise in the General Motors summary).
- `validate` warns when a skill is unsupported (no contribution or fact carries its tags and no summary lists it as hands-on) and when the same skill appears twice.
- Seeded in step 3 from the current CV's SKILLS section.

### 4.2c Calculated values

Values that change over time are calculated, never typed:

| Value | Calculated from |
|---|---|
| Years of experience ("7+") | earliest `period.start` among entries with `counts_as_experience: true` (default true for experience entries), rounded down |
| Team size led ("up to 8 engineers") | highest `team_size_led` across summaries and facts |
| "Present" end dates | `period.end: present` |

### 4.2d Generated parts of the Markdown

Some parts of every CV Markdown are generated, not written by an agent or by you. They are stored in the file as plain text between markers, so the Markdown stays readable and the rendered output matches it exactly:

```markdown
<!-- generated:header -->
# **Kirill Kohan**
**Senior Software Engineer / Tech Lead (Frontend & Mobile)**
Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment | Working hours overlap with EU, UK and US time zones
+380 97 891 9783 | kiril.kohan@gmail.com | Portfolio: https://...
<!-- /generated:header -->
```

| Generated block | Source |
|---|---|
| `header` | `profile.yaml` + header line templates in config (+ profile `headline`) |
| `education` | `profile.yaml` `education` |
| `skills` | `skills.yaml` + profile `skills_order` |
| `languages` | `profile.yaml` `languages` |
| entry title and detail lines | the entry's summary or `cv_entry` fields, after an `<!-- entry: <id> -->` marker that ties the entry to its source (used by `lint`, `trace`, `reattach-src` and the confidentiality `allow_in` rule) |

- `build` (and `npm run refresh`) rewrites every generated block from its source before rendering.
- Calculated values (4.2c) are written as plain text ("7+ years"). The composer uses the calculated value, and lint fails if a typed number differs from it.
- Editing inside a generated block by hand is pointless, since the next build replaces it. Lint **fails** when a generated block doesn't match its source, which shows the edit should go into the source file.

### 4.3 Trace references in the CV

The composer adds an HTML comment after each bullet, which Markdown viewers and the renderer ignore:

```markdown
* Built the **Login micro-frontend** from scratch ... <!-- src: syspro-saas-erp#4.1 -->
```

The **summary paragraph** is traced too. Each sentence ends with its own `<!-- src: … -->` (one or more ids). Calculated values and profile facts are cited with the pseudo-sources `calc:years_experience`, `calc:team_size_led` and `profile`:

```markdown
At SYSPRO, builds a schema-driven React 19 runtime that renders 1,800+ ERP programs from data-model definitions. <!-- src: syspro-saas-erp#4.1 -->
```

`npm run trace` reports bullets and summary sentences with no `src`, and `src` ids that don't resolve to a summary contribution, a summary section or a fact id. Generated blocks (4.2d) are exempt because their source is known.

### 4.4 Role profiles (`profiles/*.yaml`)

A profile describes a reusable CV version for a type of role, built without a job description. The first four profiles:

| Profile | Headline | Emphasis |
|---|---|---|
| `react` | Senior React Engineer / Frontend Tech Lead | React 19, micro-frontends, schema-driven UI, state machines, testing, OIDC, observability, SDD/architecture |
| `react-native` | Senior React Native Engineer / Tech Lead (Mobile) | React Native, Expo, Android/iOS native, BLE/IoT, offline-first, mobile CI/CD, store releases |
| `fullstack-react-node` | Senior Full-Stack Engineer (React / Node.js) | React + Node.js APIs, PostgreSQL, AWS, Stripe, Docker, CI/CD, mock backends, Forge resolvers |
| `nodejs` | Senior Full-Stack Engineer (TypeScript, Node.js, React) | Node.js, REST/GraphQL, PostgreSQL, AWS, integrations. The gap report is expected to flag limited recent backend depth. |

Example:

```yaml
schema_version: 1
id: react-native
headline: Senior React Native Engineer / Tech Lead (Mobile)
summary_focus: [react-native, android, ios, offline-first, performance, leadership]
emphasize_tags: [react-native, expo, android, ios, ble, iot, mobile-ci, performance]
deemphasize_tags: [kendo, erp]
skills_order: [mobile, languages, state-and-data, testing, devops, frontend, backend-and-cloud]   # category ids from skills.yaml
template: classic                  # optional; default from framework.config.yaml
overrides: {}                      # lasting tweaks for this variant, by source id (see 4.4 rules)
max_bullets_per_entry: 6           # lower-relevance bullets are dropped first
entry_max_bullets: {}              # optional per-entry limits, e.g. { syspro-saas-erp: 7 }
min_bullets_per_entry: 2
include_sections: [summary, experience, consulting, education, skills, languages]
max_pages: 3                       # optional; overrides checks.max_pages for this variant (used by pdf-check)
max_words: 1600                    # optional; overrides checks.max_words (used by lint)
```

Rules for the tailor agent with a profile:
- **Preferred wording.** For any bullet it keeps, it starts from the master CV's wording for the same `src` id, including your manual edits there, and only shortens or re-emphasizes it. A bullet that isn't in the master CV is written fresh from the source.
- **Variants are generated files.** Don't edit `cv/variants/*/cv.md` by hand, since `/variants` rebuilds them. Lasting changes for one variant go in the profile's `overrides`, by source id:
  ```yaml
  overrides:
    syspro-saas-erp#4.1: { text: "Built core modules of a schema-driven React 19 runtime ...", pin: true }   # exact wording, always included
    velas-wallet#4.5: { drop: true }                                                                               # never include
    general-motors-navigation#5: { pin: true }     # keep an older job's Stack line (it doesn't count toward limits)
  ```
  Lint warns when a variant file was edited after its last build, so a hand edit isn't silently lost.
- It may **select, reorder, shorten and reword** bullets, rewrite the summary and headline within the profile's focus, and reorder skills.
- It may **not add claims** without a source. Every bullet keeps its `src`, so `trace` still passes.
- All jobs stay listed (no hidden gaps in the timeline), but less relevant jobs shrink to `min_bullets_per_entry`.
- It writes a `gap-report.md`: the profile's emphasis areas that have little supporting evidence. It also suggests which summaries could be enriched, or what you could add as a confirmed fact if it's true.

**Job ads become tags.** For `--jd`, the tailor agent first maps the job ad's requirements to tags from the config list, and proposes new tags for anything missing. The map is saved as `cv/tailored/<company-role>/jd-tags.yaml` for you to adjust. Then `npm run select -- cv/tailored/<company-role> --tags jd-tags.yaml` (the tags file is looked up in that folder first) makes the deterministic selection, exactly as for profiles.

Profiles and job descriptions can be combined: `--profile react --jd job.md` starts from the profile, then tailors to the job. New profiles, such as `frontend-architect` or `tech-lead`, are added as new files with no code changes.

### 4.5 Application log (`facts/applications.yaml`, optional)

Records what each recruiter received, so you can answer "which CV did I send them?" later:

```yaml
- date: 2026-10-20
  company: Example Corp
  role: Senior React Native Engineer
  cv: cv/tailored/example-corp-senior-rn/      # or a variant id
  pdf: cv/tailored/example-corp-senior-rn/Kirill_Kohan_CV.pdf   # the PDF that was sent
  pdf_sha256: "3f1c..."                        # its hash (quoted: an all-digit hash would be read as a number)
  acknowledged_sha256: null                    # set by status --ack when you know the CV changed since
  build_commit: 772590a                        # git commit of the sources at build time
  market: worldwide                            # which market version was sent (4.6)
  exporter: pages                              # which PDF exporter built it (PDFs can differ slightly between exporters)
  sent_copy: cv/sent/2026-10-20-example-corp.pdf   # optional exact copy of the sent PDF (git-ignored, included in backups)
  status: applied                              # applied | interview | offer | rejected | withdrawn
  notes: ""
```

`/log-application` adds an entry after a build. `status` warns when a CV that was already sent is now stale, so you know a recruiter has an older version. The file is in `.gitignore` by default, like tailored CVs.

### 4.6 Markets (`markets/*.yaml`)

A **market** is the audience a CV is sent to. It changes only deterministic details (header fields, labels, availability wording), never the content. Every CV (the master and each role variant) is built once per market, so `build:all` produces profiles × markets.

```yaml
# markets/worldwide.yaml
schema_version: 1
id: worldwide
default: true                      # the master CV Markdown is written for this market
file_suffix: ""                    # Kirill_Kohan_CV.pdf, Kirill_Kohan_CV_React_Native.pdf
header:
  show_phone: true
  show_availability: true
  show_time_zone_overlap: true
  engagement_types: [b2b-contract, full-time]   # "Open to B2B contract or full-time employment"
entries:
  show_contract_suffix: true       # "(Contract)" on entries whose engagement is contract

# markets/ukraine.yaml
schema_version: 1
id: ukraine
default: false
file_suffix: _UA                   # Kirill_Kohan_CV_UA.pdf, Kirill_Kohan_CV_React_Native_UA.pdf
header:
  show_phone: false
  show_time_zone_overlap: false    # not relevant for local roles (optional, can be switched on)
  show_availability: false         # no availability line at all
entries:
  show_contract_suffix: false      # no "(Contract)" labels
```

**How it works:**
- The committed Markdown (master and variants) is written for the default market.
- `npm run market` turns it into each other market's version **by script, without AI**: it regenerates the header block and adjusts entry title lines according to the market file. Market versions are build outputs, written to a `markets/<id>/` folder next to the source CV (e.g. `cv/markets/ukraine/`, `cv/variants/react/markets/ukraine/`) and git-ignored like the Word and PDF files.
- `lint` and `pdf-check` run on every market version (e.g. the phone number must be absent from the Ukraine PDF).
- A job-specific CV (`/tailor --jd`) is built for one market, chosen with `--market` (default: worldwide).
- New markets (e.g. `eu.yaml` with work-permit wording) are new files.
- **Profile vs market:** `profile.yaml` states the truth (e.g. `work.engagement_types`). A market can only **hide or narrow** it (`show_availability: false`, a subset of `engagement_types`), never add something the profile doesn't have. `validate` fails on a market that adds a value.
- **Outputs:** `cv/markets/<id>/` (master) and `cv/variants/<profile>/markets/<id>/` (variants) hold each market's `.md`, `.docx`, `.pdf`, `pdf-check.md` and `preview/`. The default market's files sit directly in the CV folder. All market folders are git-ignored.

## 5. Agents

| Agent | Input | Output | Spec / rubric |
|---|---|---|---|
| **Harvester** | repo name(s) resolved to local paths through `framework.local.yaml` (see `/harvest`), project id, author identities (default from profile), optional date range. Reads `git log` filtered by author and dates, commit messages, diff statistics per folder, and the repo's README and docs. Large repos are summarized per area (folder or package). It **never copies source code, internal document text, URLs or secrets**, only describes the work in its own words. | new `summaries/<id>.md`, or for an existing summary a **merge**: contributions are updated from git; sections you edited, filled TODOs, `cv_*` fields and numbering of existing contributions are kept (new items get new numbers, so CV `src` ids never break); a diff is shown for approval | work-summary-spec |
| **Composer** | summary digests (full summaries only for changed entries, R10), `confirmed.yaml`, `profile.yaml`, `skills.yaml`, `decisions.yaml`, `framework.config.yaml`, current CV | the updated master CV (path and name from config) with trace comments + short change log in the reply. It edits one entry at a time and runs `reattach-src` then `trace` (R7). | cv-spec |
| **Tailor** | a profile and/or a job description file, master CV, summaries, facts | `cv/variants/<profile>/` or `cv/tailored/<company-role>/`: `cv.md` + `gap-report.md` | tailoring-spec + the profile (may reorder, re-emphasize, drop; may not add unsourced claims) |
| **Reviewer** (run per rubric) | CV file, rubric, `decisions.yaml` (findings already decided are listed as "decided", not raised again), `profile.yaml` (HR), summaries/facts (fact-check only), preview images (layout only), job ad (ATS job-ad mode) | `reports/<date-time>/<rubric>.md` with verdict, score, findings (line, issue, suggestion, severity, `needs_user_input: yes/no`) | rubrics/* |
| **Advisor** | a report (or several), the CV, facts; also used by `/job-change`, `/profile` and `/add-experience` for their questions (the harvester asks `/harvest`'s job-detail questions itself, in the advisor's style) | asks you questions one topic at a time with suggested answers. It writes your answers to `facts/confirmed.yaml`, `facts/decisions.yaml`, `facts/profile.yaml` or a summary (e.g. its `cv_emphasis`), hands the change list to the composer, and shows the diff. | cv-spec + the report's rubric |
| **Template importer** | a Word or PDF CV | `templates/<name>/` (section 6.4) | template-import rules in `specs/templates.md` |

Reviewer set: **ATS**, **HR**, **proofreading**, **fact-check**, **confidentiality**, **layout**. They run in parallel when the tool supports it, otherwise one after another.

What the main rubrics must produce (taken from the reviews done in this chat):
- **ATS:**
  - a pass/fail verdict;
  - a score table (parsing, contact details, dates and gaps, seniority signals, keywords in context, measured results, signs of AI padding);
  - an estimated match per role (Senior Frontend, React Native, Tech Lead, Full-stack, Native Android …);
  - issues ranked by importance;
  - **job-ad mode** (`--jd <file>`, used automatically for tailored CVs): a match score against that job, required and nice-to-have keywords found and missing, and which missing keywords you could honestly add (supported by a summary or fact) versus real gaps.
- **HR:**
  - the first-10-seconds impression;
  - strengths;
  - the questions a recruiter will ask (for example "why leave after 10 months?", a title step down, side work alongside a full-time job, workload, name consistency, hiring setup from Ukraine);
  - wording a non-technical reader won't understand;
  - suggested answers to prepare.
- **Layout:** compares the preview images with the template's reference preview, checking bullet alignment, indentation, date alignment, page breaks inside an entry, and orphaned headings.

## 6. Scripts (`npm run …`)

| Script | What it does |
|---|---|
| `build [file] [--template <name>] [--market <id>] [--no-pdf]` | **The full chain:** `validate` (refuses invalid sources), `digest`, `refresh`, `lint` and `trace` (unsourced claims are a warning for the master CV, an error for variants and tailored CVs), market versions, then for every market: Markdown to Word, Word to PDF, `pdf-check`, previews of every page. Stops a CV at its first failing step and records a successful build in `cv/.build-state.json`. Defaults to the master CV. `--market` builds one market only; a job-specific CV (`cv/tailored/`) is built for one market: `--market`, else the default. `--no-pdf` stops after the `.docx` (e.g. a laptop without a PDF exporter). An unapproved template is built with a warning. |
| `build:all [--no-pdf]` | `build` for the master CV and every role variant (`cv/variants/*/cv.md`), **for every market**; refuses templates that aren't approved. Tailored CVs are built by naming them: `npm run build -- cv/tailored/<company-role>/cv.md`. |
| `market [cv-file] [--market <id>]` | writes the market versions of a CV (default: the master) by script: header and entry title lines per market file, using the variant's role profile when the file is in `cv/variants/<id>/` (4.6). Called by `build`. |
| `render [file] [--template <name>] [--out <file.docx>]` | Markdown to `.docx`, filling the chosen template through its `style-map.yaml`, then applying the template's `fixes.yaml` (for `classic`: Pages bullet indent, headings kept with what follows, right-aligned dates, first and last two bullets kept together, consistent left edge and spacing, invisible letter spacing that prevents fi/fl ligatures). Links (email, portfolio, any `show: true` link in the profile) are created as proper hyperlink entries, never by reusing the template's own link ids. Template: `--template`, else the role profile's `template:`, else config. Output sits next to the Markdown (`cv.md` in a variant folder becomes `<Name>_CV_<Profile>.docx`). |
| `template-import <file.docx> <name> [--map <map.yaml>]` | Template import, script part (6.4): without `--map` lists paragraphs for the template-importer agent; with `--map` builds `template.docx` and `style-map.yaml`. PDF input comes after `build` works end to end. |
| `pdf [file.docx] [--exporter <id>]` | `.docx` to `.pdf` with the first available exporter from `pdf_exporters` (`framework.local.yaml` overrides `framework.config.yaml`), one export at a time under `.cv-runs/export.lock`, each limited to `checks.export_timeout_s` (6.1). Default file: the master CV's `.docx`. |
| `pdf-check <file.pdf> [--md <cv.md>]` | Checks that the PDF is ATS-readable and faithful to its Markdown (6.2). The Markdown defaults to the `.md` next to the PDF (or `cv.md` in a variant folder); the market comes from the `markets/<id>/` path. Writes `pdf-check.md`; exits 1 on failure. |
| `preview <file.pdf> [--out <dir>] [--scale <n>]` | Page images of the PDF into `<pdf dir>/preview/` (or `--out`), rendered at `--scale` (default 1.5) (6.3) |
| `lint [file] [--market <id>] [--profile <id>]` | Deterministic checks on CV files: supported Markdown (including only `#`/`##`/`###` headings), forbidden characters, filler words (warning), length, bullet length (warning), bold balance, section order, entry order (`cv_order`, then newest first), bullet limits (`cv_max_bullets` / profile `max_bullets_per_entry`), the current job's Stack line (warning), **generated parts match their sources**, calculated values in the summary paragraph, the **confidentiality blocklist** (terms from every summary's *Confidentiality notes*, whole-word and case-sensitive with `allow_in` contexts; ticket prefixes like `OR-`, `ENGAGE-`, `VEL-`; hidden client names; internal address patterns matched against URLs, git remotes and hostnames), the **secret scan** (keys, tokens, credential assignments, foreign emails and URLs; profile links allowed), and hidden market fields (e.g. no phone in a Ukraine CV). Without a file it lints the master, its market versions, every variant and tailored CV, and secret-scans summary bodies. Phone format, duplicate and unsupported skills, and unknown `cv_section` are checked by `validate`. Also warns when a variant was edited by hand since its last build (from `.build-state.json`). |
| `trace [file] [--warn-only]` | Claim-to-source check (section 4.3). `--warn-only` reports without failing (used by `build` for the master CV). |
| `check` | lint + trace for the master CV, all variants and all tailored CVs |
| `refresh [file] [--market <id>] [--profile <id>] [--out <file>] [--check]` | rewrites the script-owned parts (4.2d): header, section headings and intro lines, entry title and detail lines with `<!-- entry: id -->` markers, education, skills and languages. Runs `validate` first and refuses invalid sources, then writes digests. Reports any hand-written text it replaces. The role profile comes from `--profile` or the `cv/variants/<id>/` path. `--check` exits 1 if the file isn't up to date. |
| `status [--ack <company>]` | Compares `cv/.build-state.json` with the current sources (config, summaries, profile, confirmed facts, skills, markets, the template's files, the role profile; not `decisions.yaml`, which only affects reviewers) and per-entry hashes, the CV Markdown and the outputs, and lists each CV as up to date, stale (with every reason, e.g. "summaries/velas-wallet.md changed") or never built. Also warns once per application when the PDF you sent has changed since (R14); `--ack <company>` records that you know. |
| `validate` | checks all inputs against `schemas/` (summaries' `repos` hold names only; a `remote` field is rejected), including each template's `style-map.yaml` and `fixes.yaml` (fix paragraph types must exist in the style map) the tags and ids of role profiles, and the front matter of reviewer reports in `reports/`. Every tag (summary contributions, facts, skills, profiles' `emphasize_tags`/`deemphasize_tags`/`summary_focus`) must be in the config tag list, so a typo like `react-nativ` fails instead of silently breaking selection. **New** tags enter the list only through an approved proposal (from `/harvest` or `/add-experience`), so new technologies are added deliberately, never blocked. |
| `index [--check]` | regenerates the registry lists in `AGENTS.md` (agents, reviewer rubrics, role profiles, markets, templates with approval state, output specs, commands) between `<!-- generated:index -->` markers; `--check` exits 1 if `AGENTS.md` is out of date. Before step 6 (no `AGENTS.md` yet) it prints the registry. |
| `log-application --company <name> --pdf <file.pdf> [--role] [--status] [--notes] [--keep-copy]` | records a sent CV in `facts/applications.yaml` (4.5): date, company, role, the PDF and its quoted hash, CV folder, market, git commit, exporter (from the build record), status; `--keep-copy` saves the exact PDF to `cv/sent/` |
| `test` | runs every `tests/*.test.ts` file with Node's test runner; most tests break a temporary copy of the real repo |
| `typecheck` | TypeScript type check of `scripts/` and `tests/` |
| `digest` | regenerates `summaries/.digests/` from summaries and facts (R10). Runs automatically after a successful `validate`, and `refresh`, `build` and every agent flow validate before writing digests (so broken summaries never produce digests), so digests are never stale and a fresh laptop needs no extra step. |
| `git-digest <repo-name> [--path <dir>] [--since] [--until] [--identity <name>] [--run <id>]` | read-only digest of a repo's history for the harvester (R9, R11), written to `.cv-runs/<run-id>/git-digest.md`: every commit author with matches to your identities marked, your commits by area (folder or package: counts, dates, lines, key commit messages), commits by others that credit you (`Co-authored-by`), and "possibly yours" commits and merges mentioning your names. Repo path from `--path` or `framework.local.yaml`; identities from `profile.yaml`, the summaries listing the repo, and `--identity`. |
| `select <cv-dir> --profile <id> \| --tags <file>` | deterministic bullet selection and ordering by tags, limits and overrides (scoring in `specs/tailoring-spec.md` 2). `--tags` is looked up in `<cv-dir>` first. Writes `selection.json` into `<cv-dir>`, which the tailor agent then words (R8). |
| `reattach-src <file> [--save \| --from <old-file>]` | `--save` before editing stores a snapshot in `.cv-runs/snapshots/`. After editing, restores dropped source comments by matching each bullet (same entry) or summary sentence to the previous version: `--from`, else the snapshot, else git HEAD; fails with a clear message when none exists. Lists what it couldn't match (R7). |
| `doctor [--no-export]` | checks the environment and says how to fix each problem: Node version (`engines` in `package.json`), installed dependencies, the preview renderer, AI agent tools on the PATH, `framework.local.yaml`, repo paths (a repo with no local path is *info*: after a job ends that's normal; a path that doesn't exist is a warning), the backup folder, and the PDF exporters (unavailable fallbacks are only *info*). Unless `--no-export`, it renders and exports a tiny test document with the active exporter: this triggers the one-time macOS permission prompt while you're at the keyboard (R12) and checks that the template's fonts are embedded (R3). |
| `backup [--out <dir>] [--no-password]` | packs everything git doesn't carry (`cv/tailored/` with job ads, `cv/sent/`, `facts/applications.yaml`, `framework.local.yaml`) into one dated zip in `backup_dir` from `framework.local.yaml`. If the environment variable named by `backup_password_env` is set, the whole zip is encrypted with AES-256-GCM (key derived from the password with scrypt, Node's built-in `crypto`) and saved as `.zip.enc`; the password is never stored. |
| `restore <archive> [--force]` | unpacks a backup (decrypting `.zip.enc` with the same environment variable) without overwriting newer local files, which are listed as conflicts (`--force` overwrites them). Only backup paths can be written, so a damaged or foreign archive can't touch other files. |

Each built CV folder ends up as:

```
cv/variants/react-native/
├── cv.md
├── Kirill_Kohan_CV_React_Native.docx     # file names from framework.config.yaml
├── Kirill_Kohan_CV_React_Native.pdf
├── pdf-check.md                          # result of 6.2
├── gap-report.md
└── preview/page-1.png …
```

### 6.1 PDF exporters

Exporters are pluggable modules in `scripts/exporters/`. `pdf` tries them in the order set in config and uses the first one that is installed and succeeds:

```yaml
pdf_exporters: [pages, word, libreoffice]
```

| Exporter | How | Notes |
|---|---|---|
| `pages` | `osascript` drives Pages: open, export as PDF, close without saving | Installed now. This is how the bullet fix was tested. |
| `word` | `osascript` drives Microsoft Word: save as PDF | Used only if Word is installed |
| `libreoffice` | `soffice --headless --convert-to pdf` | Cross-platform fallback if installed |

If none is available, `pdf` stops with a clear message listing what to install. The Word file is still produced.

### 6.2 PDF check (`pdf-check`)

It extracts the text with `pdfjs-dist` (no system tools needed) and fails when:
- **No selectable text** (an image-only PDF), which screening software can't read.
- **Sections are missing or out of order:** every CV section heading in the Markdown must appear in the PDF text, in the same order.
- **Text doesn't match:** after normalizing (Unicode NFKC, one kind of quote and dash, single spaces; a word broken at a line-end hyphen is rejoined *with* its hyphen, since CVs don't use automatic hyphenation), the PDF's words must cover the Markdown's words, ignoring formatting, trace comments and URLs shown as link text. Missing words are listed. This is also how broken ligatures are caught ("fintech" read as "intech").
- **Garbled characters:** the replacement character `�`, private-use glyphs, or broken ligatures.
- **The contact details aren't on page 1:** every contact field the CV's market shows (email, and the phone where `show_phone: true`) must be on page 1, and **a field the market hides must not appear anywhere** (e.g. no phone number in a Ukraine PDF).
- **Fonts were substituted:** every font listed in the template's `style-map.yaml` must be embedded in the PDF (read through pdfjs, which also handles compressed PDFs); a font used without being embedded fails too. A substitute (for example, a different serif when Cambria is missing on a Linux laptop) fails the check, with the name of the font to install.

It also fails when the page count exceeds `max_pages` (from the profile, else config), and reports words per page. The results go to `pdf-check.md` next to the PDF.

### 6.3 Preview

It renders page images from the PDF into `preview/`:
- **All pages** with `pdfjs-dist` plus a Node canvas package, so no system tools are needed on any OS (R13).
- macOS Quick Look (`qlmanage`) is kept only as a page-1 fallback if the canvas package can't be installed.

An agent, or you, can open the images to catch layout problems (like the bullet issue) before sending the CV. `build` prints the preview paths at the end.

### 6.4 Template import

To make your CV look like an existing Word or PDF CV, run `/import-template <file> <name>`. It produces a reusable `templates/<name>/`.

| Input | How |
|---|---|
| **Word** | Precise. The script reads the file's styles, numbering and paragraph properties. The template-importer agent labels each paragraph type (name, contact line, section heading and its rule, job title, company and dates, bullet, body text, skills line, education line) using the text and a preview. The result is the original styles with all sample content removed, plus `style-map.yaml`. |
| **PDF** (after `build` works end to end) | Approximate. The script extracts fonts, sizes, colors, positions, margins and line spacing with `pdfjs-dist`. The agent compares them with the page preview and the template is *rebuilt* as a new Word file (with the `docx` npm package) that copies the look. `import-report.md` lists what couldn't be copied exactly. |

**Rules:**
- **Only the styling is kept.** The other person's text, name and contacts are never saved. Their file stays wherever you keep it and is not copied into the repo.
- **ATS warnings.** The import report flags multi-column layouts, text boxes, layout tables, header/footer-only contact details, and icons used in place of words. It offers a one-column version.
- **Test build.** After import, your master CV is built with the new template and previewed. The template is marked `approved: true` in its style map only after you confirm.
- **Templates can be chosen** with `npm run build -- --template <name>` or `template: <name>` in a profile.

Your current template is the first one imported (`templates/classic/`). Rebuilding today's CV through it must match the current `.docx`, which tests the importer.

Dependencies: TypeScript (`typescript`, `@types/node`) run with `tsx`, `ajv` for schema validation, `jszip` for reading and writing `.docx`, `yaml` for front matter and facts, `pdfjs-dist` for PDF text extraction, `docx` for rebuilding templates from PDF samples (installed together with PDF import, which is deferred), `@napi-rs/canvas` for rendering PDF pages to images (prebuilt, no system libraries). Backups use `jszip` plus Node's built-in `crypto` (AES-256-GCM), so password-protected backups work the same on macOS, Windows and Linux with no extra packages. LibreOffice and `pdftoppm` are optional (no longer needed for previews). No Python, since your Homebrew Python's XML parser is currently broken.

## 7. Workflows (commands)

| Command | Steps |
|---|---|
| `/harvest <repo-path \| repo-name> [<id>]` | 1. **Locate the repo.** Given a path, it stores the repo name in the summary and adds `name: path` to `framework.local.yaml`. Given a name, it looks up the path there; if it's missing on this laptop, it asks for the path (no remote URLs are stored, since access ends with the job). 2. **Find your commits.** It lists the repo's commit authors, highlights likely matches with your `git_identities` (similar names, your email domains), and asks before adding new ones to `profile.yaml`. The report shows how many of your commits were found, and zero matches stops the harvest. 3. **New or existing job?** It asks whether the repo is a new job or project, or part of an existing summary, listing likely matches by period and domain. It then creates a new summary or **merges** into the chosen one, adding the repo to its `repos` list. 4. **Job details (new summaries only).** The harvester asks (one topic at a time, as the advisor does) for company, role, dates, engagement type, CV section, client label and emphasis, suggesting answers from the repo (first and last commit dates, README, the remote host read from the clone). Nothing is guessed silently. 5. **Write or merge the summary.** 6. **New tags and skills.** It proposes new tags for the config list and new `skills.yaml` entries for technologies you used hands-on, which you approve. 7. **`validate`**, then you review the diff. |
| `/add-repo <repo-path \| repo-name>` | **The whole new-repo flow in one command:** `/harvest` (all 7 steps above), **pause for your approval of the summary**, then `/compose`, **pause for your approval of the CV diff**, then `/variants`, `build:all` and `/review`. It ends with the `/status` summary and the review verdicts. Each stage can be resumed if you stop in the middle: progress is saved in a git-ignored `.cv-runs/<run-id>/state.json` (stage, repo, summary id, pending approvals), and `/add-repo --resume` continues the latest run. |
| `/compose` | Composer updates the master CV, then `npm run check` |
| `/tailor --profile <id>` | Tailor builds `cv/variants/<id>/cv.md` from the profile, then `npm run build` on it |
| `/tailor --jd <file \| pasted text> [--profile <id>] [--market <id>]` | Tailor builds `cv/tailored/<company-role>/` for one job, optionally starting from a profile, then `npm run build`. Pasted job ad text is saved as `job-description.md` in that folder. |
| `/variants` | Rebuilds every profile variant (after summaries or the master CV change), then `npm run build:all` |
| `/review [cv-file] [rubric…] [--jd <file>] [--market <id>]` | Runs the reviewers (default all 6) on the chosen market version (default: the default market) and writes `reports/<date-time>/`. The ATS and HR reviewers read the market file, so hidden fields count as intended and HR questions fit the market. With `--jd`, the ATS reviewer also scores the CV against that job ad. "Would this CV pass an AI ATS?" is `/review ats`, and "…and then HR?" is `/review hr`. |
| `/improve [report…]` | Advisor goes through the findings one topic at a time. It asks you questions with suggested answers, records them as facts, has the composer apply them, and shows the diff. Findings you decline are recorded as decisions (e.g. "no LinkedIn link", "keep length"), so later reviews don't raise them again. |
| `/profile` | You describe a change ("moved to Poland, new phone +48…"). The advisor asks the follow-up questions (work permit? still B2B? new time zone? relocation?), updates `profile.yaml`, runs `/variants` and `build:all`, and lists tailored CVs and already-sent PDFs that still have the old details. |
| `/add-experience` | You describe experience in your own words (e.g. "technical interviewing, legacy React Native audits, presales"). The advisor asks follow-up questions, writes a `confirmed.yaml` entry (or a `cv_entry` for a new job), and the composer adds the bullets. |
| `/job-change` | Starting or leaving a job. **Leaving:** first, a **final harvest** of every repo of the job while you still have access (`/harvest` for each, filling the TODOs you can), because afterwards the summary is the only record; then sets `period.end` on the current job, asks for final results and metrics while you still remember them (saved as facts), and asks whether the job stays in Experience. **Starting:** creates the new job as a `source: user` summary (role, company, dates, engagement, what you'll own), so it can appear in the CV before any code exists. You run `/harvest` on it later. Then runs `/variants` and `/status` and lists sent CVs that are now outdated. |
| `/import-template <file> <name>` | Template import (6.4), followed by a test build and preview for your approval |
| `/build [cv-file]` | `npm run build`, then reports the pdf-check result and shows the page previews |
| `/doctor` | `npm run doctor`, then explains how to fix anything missing |
| `/status [--ack <company>]` | `npm run status`, then suggests the commands that bring stale CVs up to date |
| `/log-application` | Records a sent CV in `applications.yaml` (4.5) |

Each command file in `.claude/commands/` points to an agent definition (or one of its sections) or runs scripts (`/build`, `/status`, `/doctor`, `/log-application`), and never holds rules of its own. The same instructions are listed in `AGENTS.md` for other tools.

## 8. Build steps

Each step ends with something you can check.

1. **Restructure and preserve.** Create the folders. Move the CV files to `cv/` and the template to `templates/` (committing the template). Move the summaries to `summaries/` with the new names. Add `package.json` (with `engines: node >= 20.11`), `package-lock.json`, `.nvmrc` and `framework.local.example.yaml`, and update `.gitignore` (`summaries/.digests/`, `.cv-runs/`, `framework.local.yaml`, `backups/`, `node_modules/`, `cv/tailored/`, `facts/applications.yaml`, `cv/**/*.docx`, `cv/**/*.pdf`, `cv/**/pdf-check.md`, `cv/**/preview/`, `cv/**/markets/`, `cv/**/selection.json`, `cv/.build-state.json`, `cv/sent/`). The currently committed `Kirill_Kohan_CV.docx` is untracked with `git rm --cached` (the file stays on disk and is rebuilt in step 5).
   *Check:* `git status` shows moves only, no content changes.
2. **Specs.** Write `cv-spec.md` (the current CV's structure plus every rule from this chat), `work-summary-spec.md`, `tailoring-spec.md`, `templates.md` and the 6 rubrics. The ATS and HR rubrics are based on the reviews done in this chat.
   *Check:* you review the specs. This is the most important review.
3. **Facts.** Write `profile.yaml` (section 4.2a), `skills.yaml` (4.2b, seeded from the current SKILLS section), `confirmed.yaml` (section 4.2) and `decisions.yaml` (section 10).
   *Check:* you confirm every entry is true.
4. **Migrate summaries.** Add front matter and restructure the body into the 9 sections from section 4.1, numbering the contributions. Existing content is kept. Sections the old summaries don't cover (for example, *Main features* for the Jira plugin, *Portfolio material*) are filled only from what the summary already says, or marked `TODO (needs user input)`. Nothing is invented.
   **Older jobs without summaries:** GM, Velas, OMO Systems, Thermo Fisher Scientific, Itjet and The Admasters exist only as CV text. Each gets a summary built from that text (`source: cv`, `harvested_at: null`), with its bullets as numbered contributions and every other section marked `TODO (needs user input)`. You can enrich them later with `/harvest` (if you still have the repos) or `/add-experience`.
   *Check:* you review the 3 migrated summaries and the 6 new ones, and fill in the TODOs you can. After this step, every job in the CV has a summary.
5. **Scripts and config.** Includes every mitigation from section 9b marked *step 5*. `framework.config.yaml`, `schemas/`, `scripts/lib/`, `git-digest`, `select`, `reattach-src`, the template-driven docx renderer, `template-import` (Word input first, then PDF), the PDF exporters (Pages, Word, LibreOffice), `pdf-check`, `preview`, `build`/`build:all`, `refresh`, `lint` (including the confidentiality denylist), `trace` (bullets and summary sentences), `status`, `validate`, `index` and `check`, each with tests.
   *Check:*
   - `npm test` passes, and `npm run validate` passes on all summaries and facts.
   - `templates/classic/template.docx` is created by importing `templates/classic/source.docx` (your previous CV).
   - `npm run build` through it produces a `.docx` with the look you approved (all-page previews reviewed on 2026-10-15), a PDF that passes `pdf-check`, and previews of every page.
6. **Agents and wrappers.** `agents/*.md` (harvester, composer, tailor, reviewer, advisor, template-importer), `.claude/agents/*`, `.claude/commands/*`, `AGENTS.md`, `CLAUDE.md`. `CLAUDE.md` and `AGENTS.md` (rule 11) state "do not use `cns:*` skills in this repo", so every session and tool knows the rule on any laptop. A git-ignored `.claude/cns-preferences.local.md` may also disable them per laptop; it is a convenience, not the carrier of the rule.
7. **Convert and trace the current CV.** Run `npm run refresh` to replace the typed header, education, skills and languages with generated blocks (4.2d), and to rewrite every job's title and detail lines from the summary fields (this changes `12/2025 – Present` to `December 2025 - Present` and removes the "(Contract)" labels from the full-time jobs). Then run the composer once in "annotate only" mode (`agents/composer.md`) to add `src` comments to bullets and summary sentences without changing their text. Then run `npm run check`. Wording changes that `check` asks for (e.g. bullets over `max_bullet_words`) are proposed separately and applied only after your approval.
   *Check:* the CV text is unchanged except for generated blocks, job title and detail lines, markers, comments and the wording changes you approved, and every bullet and summary sentence resolves, or the gaps are listed for you.
8. **Role profiles and variants.** Write the 4 profiles, tag the contributions in the migrated summaries, and build the 4 variants plus their gap reports.
   *Check:* you review the variants and gap reports. `npm run check` passes on all of them.
9. **First full review run.** Run `/review` with all 6 rubrics.
   *Check:* the reports match what we found by hand in this chat. Findings already decided in this chat (no LinkedIn link, keep the length, etc.) are not raised again.
10. **Replay this chat.** Write the chat-step table in section 12 as `docs/acceptance.md`, a repeatable checklist with inputs and expected results per step, and use it as the acceptance test. Start from the CV at commit `b130643` (your CV before this chat), run each capability once, and compare the result with today's CV (commit `772590a` plus later edits). Differences in wording are fine. Missing content, structure or rules are failures. **Rerun `docs/acceptance.md` whenever a spec, rubric or agent definition changes**, since agents aren't covered by `npm test`.
11. **README.** Includes a first-run section and a "new laptop" section (section 9a).
12. **Second-laptop test.** Clone the repo into a fresh folder (or a second user account), follow the new-laptop steps, and run `npm run build:all`.
   *Check:* the outputs pass `pdf-check`, the content matches the original laptop, and `doctor` reports nothing missing.
13. **New laptop + new repo test.** On the second-laptop setup, run `/add-repo` on a small repo the framework has never seen (e.g. one of your own GitHub repos). Added to `docs/acceptance.md` as a permanent scenario.
   *Check:* identities are detected and confirmed, you're asked "new or existing job" and for the job details, new tags and skills are proposed, `validate` passes, the CV and every variant gain the new entry or bullets with sources, `build:all` passes `pdf-check`, and `/review` runs.
14. **Market test.** Run `build:all` and check both markets for the master CV and one variant.
   *Check:* the Ukraine PDFs have no phone number, no availability line, no time-zone line and no "(Contract)" label; the worldwide PDFs have the phone, availability and time-zone lines; `pdf-check` passes for both; the content (bullets) is identical. Added to `docs/acceptance.md`.

## 9. Scalability

The framework is designed so new outputs, reviewers and agents are **added as files, not by changing existing code**.

- **Sources and outputs are separate.** Summaries and facts are the sources. The CV, tailored CVs, and later the portfolio, a LinkedIn profile or cover letters are *outputs*. Each output is defined by one spec plus an optional renderer, so adding the portfolio later means adding `specs/outputs/portfolio.md` and an agent (the CV itself is specified by `cv-spec.md` and `tailoring-spec.md`), without touching summaries.
- **Folders act as registries:**
  - Any file in `specs/rubrics/` is a reviewer. Dropping in `rubrics/frontend-architect-role.md` adds a reviewer with no other changes.
  - Any file in `profiles/` is a CV variant. `/variants` builds them all.
  - Any file in `agents/` is listed in `AGENTS.md` by the `index` script, so new agents are discovered automatically.
  - Any renderer in `scripts/renderers/` (docx now, later HTML or JSON) is chosen by file type or output type. Any exporter module in `scripts/exporters/` (Pages, Word, LibreOffice), once registered in `scripts/exporters/index.ts`, can be added to `pdf_exporters` in config.
- **One config file.** `framework.config.yaml` sets paths, default rubrics, the default renderer, the template, the spelling variant (US), CV sections, display formats, output names, header line templates, the tag list and check limits. Scripts and agents read it instead of hard-coding values. Example of the parts that remove remaining hard-coded values:

  ```yaml
  output:
    master_dir: cv
    variants_dir: cv/variants
    tailored_dir: cv/tailored
    markets_subdir: markets          # cv/markets/<id>/, cv/variants/<profile>/markets/<id>/
    file_name: "{name_underscored}_CV{profile_suffix}{market_suffix}"   # Kirill_Kohan_CV, Kirill_Kohan_CV_React_Native_UA
  display:
    date_format: "MMMM YYYY"          # December 2025
    date_range_separator: " - "
    present_label: Present
    contract_suffix: " (Contract)"
    field_separator: " | "
    expected_suffix: " (expected)"  # education end year still to come
    bullet_bold_keywords: true
  checks:
    max_pages: 4
    max_words: 2200
    contacts_on_page_1: true
    forbidden_chars: ["→", "·", "•", "—", "–"]
    filler_words: [passionate, results-driven, ...]   # full list in framework.config.yaml
    max_bullet_words: 45
    export_timeout_s: 60            # per-file PDF export timeout (R1)
  secret_scan:
    allow: []                       # approved values that look like secrets (profile links are always allowed, R5)
    internal_url_patterns: []       # extra internal address patterns besides each summary's section 9 url_pattern entries
  ```

- **What stays in code:** only mechanics, such as how Markdown is parsed, how a Word file is written, how Pages is controlled and how checks run. Every value they use comes from config, a template, a spec, or the facts and summaries.
- **Versioned, validated formats:**
  - Summaries, facts and reports carry `schema_version`.
  - JSON Schemas in `schemas/` are checked by `npm run validate`.
  - When a format changes, a migration script moves old files forward, so old summaries never silently break.
- **Shared engine.** Markdown parsing, front matter and trace resolution live in one `scripts/lib/` module used by every script, so a new renderer or check is a small file.
- **Tests.** Each script has tests that run it on a temporary copy of the real repo, often broken on purpose, and check the output, so changes are safe as the framework grows. Agents are covered by the acceptance checklist (`docs/acceptance.md`), rerun after any spec or agent change.
- **Tool-neutral contracts.** Agent definitions only use files and `npm run` commands, never tool-specific features. The Claude Code wrappers, and later Codex, Cursor or Agent SDK wrappers, stay replaceable.

All of these are part of the layout in section 3.

## 9a. Running on another laptop

The framework must work on any laptop with the repo cloned. Everything machine-specific lives outside the committed files.

**What travels and how:**
| Kind | Examples | How it travels |
|---|---|---|
| Sources and rules | summaries, facts, profiles, specs, agents, templates, config, CV Markdown | git (private remote) |
| Built outputs | `.docx`, `.pdf`, previews, `pdf-check.md`, `.build-state.json` | not moved; `npm run build:all` recreates them |
| Private, not in git | tailored CVs and job ads, `applications.yaml`, sent PDFs | `npm run backup`, then `restore` on the other laptop |
| Per-laptop settings | repo paths, backup folder, exporter order | `framework.local.yaml`, created on each laptop from the example file |
| AI tool memory | my memory on this Mac | not needed: every rule and decision is in the repo (`AGENTS.md`, `CLAUDE.md`, specs, `decisions.yaml`) |

**`framework.local.yaml` (git-ignored):**
```yaml
repos:                                   # summary repo name -> local clone path on this laptop
  saas-frontend-repo: ~/work/saas-frontend-repo
  orion-mobile: ~/clients/orion-mobile
backup_dir: ~/Library/Mobile Documents/com~apple~CloudDocs/CV-backups   # e.g. iCloud Drive or a USB stick
backup_password_env: CV_BACKUP_PASSWORD  # optional; the password is read from this environment variable, never stored
pdf_exporters: [pages, word, libreoffice]   # optional override of the config order for this laptop
```

**Other operating systems:** on macOS, PDF export uses Pages or Word. On Windows or Linux, LibreOffice (`soffice`) is the supported exporter. Previews use the same Node renderer (`pdfjs-dist` + `@napi-rs/canvas`, text drawn from the PDF's embedded fonts) on every OS; macOS Quick Look is only a page-1 fallback. `doctor` shows which path is active.

**Fonts:** each template lists its fonts in `style-map.yaml` (for `classic`: Cambria, Arial). `doctor` checks they're installed, and `pdf-check` fails if the PDF used a substitute.

**Reproducibility:** `package-lock.json` plus `npm ci` installs the exact same dependency versions, and `.nvmrc` pins the Node version. PDFs from different exporters can differ slightly in layout. `pdf-check` confirms the content is identical, and `applications.yaml` records the exporter used for every sent PDF.

**New laptop steps (also in the README):**
1. Install Node (the version in `.nvmrc`), and Pages, Word or LibreOffice. Install and sign in to an AI agent tool that reads `AGENTS.md` (Claude Code, or Codex, Cursor, Gemini CLI …). The scripts run without one, but `/harvest`, `/compose` and the other agents need it.
2. `git clone <private remote>`, then `npm ci`.
3. Copy `framework.local.example.yaml` to `framework.local.yaml` and set repo paths and the backup folder.
4. `npm run restore <latest backup>` (if you have tailored CVs or an application log).
5. `npm run doctor`, and fix anything it reports (fonts, Pages permission, missing repo paths).
6. `npm run build:all`.

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
| R6 | The confidentiality blocklist raises false alarms on ordinary words ("Orion", "Studio Shell") | Whole-word, case-sensitive matching, plus a per-term `allow_in` list in the summary's confidentiality notes (e.g. allow "Orion" in a generic sentence) | 5 |
| R12 | The one-time macOS permission prompt for controlling Pages can hang an unattended agent session | `doctor` triggers the prompt while you're at the keyboard (part 4). macOS offers no way to check the permission without prompting, so each export is limited by `checks.export_timeout_s`; on a timeout Pages is quit without saving, and a permission error ("not allowed", -1743) is reported with the hint to run `npm run doctor`. | 5 |
| R13 | Only page 1 can be previewed on this Mac (no `pdftoppm`), so layout issues on later pages are missed | Render all pages with `pdfjs-dist` and a Node canvas package (section 6.3). Built in part 3a; text is drawn as shapes from the embedded fonts (`disableFontFace`), because Node can't load PDF fonts directly. | 5 |

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

## 10. Decisions

| Topic | Decision |
|---|---|
| Spelling | US English, enforced by the proofreading rubric and `framework.config.yaml` |
| Local clone paths and remotes | **Neither** is stored in summaries. Summaries store only the repo name, as a label of where the work happened. Local paths are per laptop in the git-ignored `framework.local.yaml` (section 9a) and can be removed once a job ends. Remote URLs aren't stored at all: access ends with the job, and they would keep the employer's internal addresses in your personal repo. (Replaces the earlier decisions to store paths, then remotes, in summaries.) |
| Tailored CVs in git | `cv/tailored/` and `facts/applications.yaml` are in `.gitignore` by default. To keep one, run `git add -f`. The tailor agent reminds you of this after each run. |
| Built files in git | **Only Markdown is committed** (CV `.md` files and `gap-report.md`). Every built output, for the master CV, variants and tailored CVs (`.docx`, `.pdf`, `pdf-check.md`, `preview/`, `selection.json`, `cv/.build-state.json`), is git-ignored and recreated by `npm run build` / `build:all`. The exception is `templates/*/template.docx`, which is an input, so it's committed. |
| Role profiles | First four: `react`, `react-native`, `fullstack-react-node`, `nodejs` (section 4.4) |
| `classic` template look | Chosen with the user from all-page previews on 2026-10-15: one left edge for everything, tight spacing (section 7 pt, job 4 pt, bullet 1 pt), right-aligned dates, no header rule, headings and bullet groups never split across pages, invisible 1/20 pt letter spacing so PDF readers see plain "fi"/"fl" (R15). Recorded in `templates/classic/fixes.yaml`. |
| Markets | `worldwide` (default: phone shown, B2B or full-time, time-zone line, contract labels for entries that really were contracts) and `ukraine` (no phone, no availability line, no time-zone line, no contract labels). Every CV is built for both (4.6). |
| Decisions already made in this chat | Recorded in `facts/decisions.yaml` so reviewers don't raise them again: no LinkedIn/GitHub links (the old CV had them, so they can come back), keep the current length, keep the Drive portfolio link, keep the job title step from GM to SYSPRO |
| Variants vs manual edits | Variants are generated. The master CV's wording is reused by source id, and lasting variant tweaks go in profile `overrides` |
| Application log | Optional `facts/applications.yaml`, git-ignored by default |
| Employer confidentiality | Repo is local or on a private remote only. Summaries are written in your own words with no code, copied internal text, URLs or secrets. |
| Commits | Agents never commit. You review the diff and commit. |
| Projects hidden from the CV | Supported with `show_in_cv: false`. Composer and tailor skip them, but they stay available for the portfolio and can be switched on later. |

## 11. Out of scope for now

- **Portfolio output:** the summaries already collect what it needs (section 4.1). The portfolio spec, agent and renderer come once you share your portfolio format.
- Cover-letter agent (the format leaves room to add it later).
- Pulling history from remote GitHub or Azure DevOps (local clones only, while you have access).
- A fully code-driven pipeline (Agent SDK CLI). It can wrap the same `agents/*.md` later.
- Translating the CV into other languages. If a local market ever needs a Ukrainian CV, it fits as a market setting (`language: uk`) with an agent translation that you review.

## 12. Coverage of the 2026-10-15 chat

Every step done by hand in the chat, and the capability that repeats it. Rows 37 onward also log the build steps of section 8 (step 5: rows 37–42, step 6: 43–44, step 7: 46–47, step 8: 48) and the audits after them.

| # | What we did in the chat | Framework capability |
|---|---|---|
| 1 | Generated work summaries from repo history (before the chat) | `/harvest` (Harvester, work-summary-spec) |
| 2 | Put SYSPRO into Experience and the other two projects into the freelance section | Composer + `cv_section` (4.1) |
| 3 | Made the CV ATS-friendly | cv-spec rules + `lint` + ATS rubric |
| 4 | Removed dates from the freelance section and renamed it | `cv_sections` config (`heading`, `show_dates`) + `show_dates_in_cv` |
| 5 | Removed client names (Clinical Ink, Velocity AI) | `cv_client_label` + confidentiality rubric |
| 6 | Highlighted SDD and architecture work rather than AI vibe coding, and tech-stack ownership | `cv_emphasis` in the summary + composer rule "emphasis first" |
| 7 | "Would this pass an AI ATS?" | `/review ats` (verdict, score table, role match, ranked issues) |
| 8 | Went through findings one by one with questions | `/improve` (Advisor) |
| 9 | Added numbers (25+ people, days to hours, fewer review cycles) | Advisor, then `confirmed.yaml`, then composer |
| 10 | Shortened the SYSPRO entry and merged bullets | `cv_max_bullets` + composer |
| 11 | Labeled short jobs as contracts, then confirmed they were all full-time | `engagement` records the real employment type; the "(Contract)" suffix appears only when `engagement: contract` and the market allows it (`decisions.yaml` all-full-time) |
| 12 | Decided to keep length, contacts and the portfolio link | `facts/decisions.yaml` |
| 13 | Replaced special characters, made company spelling consistent, removed duplicate skills | `lint` + proofreading rubric |
| 14 | "Would HR pass it?" with likely interview questions | `/review hr` |
| 15 | Added the "Open to B2B contract or full-time employment" line | `profile.yaml` `work.engagement_types` generates the header line; `/profile` changes it |
| 16 | Added interviewing, legacy React Native audits and presales from your description | `/add-experience` |
| 17 | Converted the Markdown to Word in your old CV's format | `/import-template` (6.4) + `render` |
| 18 | Fixed the bullet indentation that broke in Pages | template `fixes.yaml`, PDF export through Pages, `preview`, layout rubric |
| 19 | Exported a PDF and checked it | `pdf` + `pdf-check` |
| 20 | Kept your manual edits made between steps | Principle "your manual edits are kept" + diffs |
| 21 | Saved preferences and decisions for future sessions | specs, `confirmed.yaml`, `decisions.yaml` (in the repo, so any tool sees them) |
| 22 | Asked what happens if you move country or change your phone | `profile.yaml` + generated header + lint header check + `/profile` |
| 23 | Asked whether anything is hard-coded | All sections, skills, calculated values, output names and display formats come from files (4.2b, 4.2c, section 9). Older jobs get summaries (step 4). |
| 24 | Asked to check the plan for gaps | Generated blocks (4.2d), traced summary sentences, facts with `entry`/`tags`, re-harvest merge, `status`, confidentiality denylist, ATS job-ad mode, link handling, CNS rule in `CLAUDE.md`, application log (4.5) |
| 25 | Second gap check | Consistent optional-field defaults, facts with `entry`/`tags`, harvester rules, secret scan, tag validation, per-variant page limits, pasted job ads, agents never commit, deterministic check after every AI step, `docs/acceptance.md` |
| 26 | Third gap check | Hand-written bullets warn instead of blocking `build`, `/job-change`, supported Markdown subset, `doctor` and first-run setup, single summary header example |
| 27 | Asked about running on another laptop | Section 9a: `framework.local.yaml` (repo paths, backup folder), `backup`/`restore`, LibreOffice path for Windows/Linux, font checks, `package-lock.json` + `npm ci` + `.nvmrc`, new-laptop steps, second-laptop test (step 12) |
| 28 | Gap check after portability | `/harvest` accepts a repo name or path and keeps `framework.local.yaml` updated; cross-platform encrypted backups (originally `archiver-zip-encrypted`; built with `jszip` + AES-256-GCM, see row 41) |
| 29 | Validated "any laptop + any new repo" end to end | AI tool in new-laptop steps and `doctor`, identity detection, new-or-existing-job choice, job details interview, approved growth of tags and skills, `/add-repo` for the whole flow, acceptance scenario (step 13) |
| 30 | Simulated running every flow | Section 9b: export queue and timeouts, sample-paragraph style maps, font check from embedded PDF fonts, text normalization, scan exceptions, script-based bullet selection, git digests, summary digests, source-comment reattachment, all-page previews, one-time stale warnings |
| 31 | Gap check after the risks section | New scripts exposed as `npm run digest`, `git-digest`, `select`, `reattach-src`; digests auto-regenerated; `/status --ack`; new config keys; job ad mapped to tags (`jd-tags.yaml`) |
| 32 | Asked for Ukraine and worldwide versions | Markets (4.6): `markets/worldwide.yaml` and `markets/ukraine.yaml`, built for every CV by script (`npm run market`) |
| 33 | Checked the plan against the market requirement | Market-aware `pdf-check`, ATS and HR rubrics and `/review --market`; markets tracked by `status` and `validate`; `market` in the application log; profile-vs-market rule; outputs in the folder tree; market test (step 14) |
| 34 | Asked to validate all work against plan and specs | Independent audit; contract wording, date format, template name, examples and dependency list brought in line; job title and detail lines generated by `refresh` |
| 35 | Validated step 5 part 2 against the plan | Pseudo-sources for calculated values, tailored CVs in `check`, entry order and Stack-line checks, `allow_in` contexts documented |
| 36 | Checked plan and code against each other | `reattach-src --save` snapshots, role-profile-aware refresh/market/lint, `select --tags` in the CV folder, refresh reports replaced text and validates first, new lint rules (heading levels, section order, bullet limits, team size, internal addresses), unsupported-skill check, plan layout, flags and wording updated |
| 37 | Built step 5 part 3a (template import, Word renderer) | `classic` imported from `source.docx` via `import-map.yaml`; rendering matches the approved Word file (identical formatting in all 123 paragraphs; only intended text changes) |
| 38 | Reviewed every page of the rendered CV and asked for layout changes | `fixes.yaml` fix types (keep-with-next, date tab, bullet groups, per-type spacing, first item under a section line), header rule removed, all-page previews with `npm run preview`, layout rubric checks spacing and page breaks |
| 39 | Built step 5 part 3b (PDF export, pdf-check) | Pages/Word/LibreOffice exporters under a lock with timeouts; `pdf-check` with text normalization and pdfjs font reading; found and fixed the ligature problem (R15) with the `no-ligatures` template fix |
| 40 | Built step 5 part 3c (build, build:all, status) | One command for the whole chain per CV and market, build records, staleness with reasons, sent-CV warnings with acknowledgment, hand-edited-variant warning in lint |
| 41 | Built step 5 part 4 (doctor, backup/restore, git-digest, index) | `archiver-zip-encrypted` dropped: its partner `unzipper` can't decrypt AES, so backups are zipped with `jszip` and encrypted with Node's AES-256-GCM; `doctor` does a real test export (permission prompt, fonts); `git-digest` found 0 of your commits in `saas-frontend-architecture-repo` and 184 (not 270+) in `saas-frontend-repo` |
| 42 | Validated all of steps 1 to 5 against plan and specs | `[text](url)` links rendered as real links, `build --market` (tailored CVs build one market), role profile `max_words` in lint, `contacts_on_page_1` honored, style-map and fixes schemas and role-profile tag checks in `validate`, wording fixes in plan and specs |
| 43 | Built step 6 (agents) | `AGENTS.md` (rules, workflows, scripts, generated registry), `CLAUDE.md`, six tool-neutral agent definitions, Claude Code wrappers and 15 commands, `log-application` script, report schema, consistency tests between agent docs and code; template test builds go to `.cv-runs/` so they never overwrite the real CV |
| 44 | Checked step 6 against plan and specs | Reviewer no longer builds a stale CV (reviewers never edit; it asks for `/build` and skips layout), command files described as pointing to agents or scripts, template test builds documented as separate, acceptance checklist marked step 10 |
| 45 | Asked whether summaries need repo remotes, given that access ends with the job | No: summaries store only repo names; no remote URLs (useless after leaving, and they keep internal addresses); local paths stay per laptop and can be dropped after a job; `/job-change` starts with a final harvest; the summary is the lasting record |
| 46 | Built step 7 (annotate the CV) | Composer "annotate only" mode: a `src` comment on all 66 claims with no text change (verified by stripping comments and diffing); three SYSPRO bullets over 45 words shortened only after your approval; tests no longer assume unsourced claims in the real CV |
| 47 | Validated steps 1 to 7 against plan and specs | Three independent audits; SYSPRO bullets put in `cv_emphasis` order; Velas bullet starts with a verb; confidentiality rule covers rendered text only (ids and comments are never rendered); `repos` names checked for URLs and paths; composer annotate-only mode written down; AGENTS.md scripts table completed; plan and spec wording brought in line |
| 48 | Built step 8 (role profiles and variants) | `profiles/react`, `react-native`, `fullstack-react-node`, `nodejs` with the role-profile schema checked by `validate`; four variants and gap reports written by tailor agents from `select`; pins you approved (SYSPRO SDD, architecture and runtime bullets, GM team of 8, Next.js for full-stack), pinned bullets ordered as listed in `overrides`; the nodejs headline softened to "Senior Full-Stack Engineer (TypeScript, Node.js, React)" after the gap reports; then, from your review: `entry_max_bullets` (react: 7 SYSPRO bullets with OpenTelemetry), pinned Stack lines `<id>#5` (react-native keeps the GM Stack line), the SYSPRO Node.js mock backend back in nodejs; gap reports record the iOS, backend, GraphQL and Docker experience you will add with `/add-experience` |
