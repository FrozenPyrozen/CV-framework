# CV Agent Framework: Plan

Status: draft for review · 2026-10-15

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
- **Private by default.** Summaries may contain internal names. Only the CV and its tailored versions are scrubbed, following confidentiality rules in the facts file.
- **Reviewers only write reports.** You decide what to change.
- **Your manual edits are kept.** You can edit any CV Markdown by hand at any time. Agents always start from the file as it is on disk, show a diff of their changes, and never revert your edits silently.

## 3. Repository layout

```
CV/
├── AGENTS.md                      # entry point for any AI tool: layout, workflows, rules, commands
├── CLAUDE.md                      # one line: "Read AGENTS.md"
├── README.md                      # for humans: what this is, how to run it
├── package.json                   # npm scripts: build, build:all, render, pdf, pdf-check, preview, lint, trace, check
├── specs/
│   ├── cv-spec.md                 # CV structure and writing rules (seeded from this chat)
│   ├── work-summary-spec.md       # summary template + front matter schema
│   ├── tailoring-spec.md          # how a tailored CV may differ from the master
│   ├── templates.md               # template import rules and style-map format
│   └── rubrics/
│       ├── ats.md                 # AI ATS screener rubric
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
│   ├── confirmed.yaml             # facts you confirmed, each with id + source
│   ├── skills.yaml                # the SKILLS section's only source (4.2b)
│   └── decisions.yaml             # choices you made about the CV (e.g. "no LinkedIn"), so reviewers stop re-raising them
├── summaries/                     # one file per project, all following work-summary-spec
│   ├── syspro-saas-erp.md
│   ├── orion-mobile-clinical-ink.md
│   └── designai-jira-plugin.md
├── cv/
│   ├── <name>_CV.md               # master CV (generated, hand-editable); file name from config
│   ├── <name>_CV.docx / .pdf
│   ├── variants/<profile-id>/     # role-based CVs: cv.md, cv.docx, gap-report.md
│   └── tailored/<company-role>/   # cv.md, cv.docx, job-description.md, gap-report.md
├── profiles/                      # role profiles: react.yaml, react-native.yaml, fullstack-react-node.yaml, nodejs.yaml
├── templates/
│   └── <name>/                    # one folder per template; "classic" = current Kirill_Kohan_CV_prev.docx
│       ├── template.docx          # styles only, sample content removed
│       ├── style-map.yaml         # which style/paragraph is title, h1, h2, h3+date, bullet, body, skills line
│       ├── fixes.yaml             # renderer fixes for this template (e.g. bullet indent for Pages)
│       └── import-report.md       # ATS warnings + preview from the import
├── reports/<YYYY-MM-DD>/          # reviewer reports: ats.md, hr.md, proofreading.md, ...
├── scripts/                       # Node/TypeScript CLIs
│   ├── build.ts                   # md -> docx -> pdf -> pdf-check -> preview
│   ├── render-docx.ts
│   ├── export-pdf.ts              # runs exporters in config order
│   ├── exporters/                 # pages.ts, word.ts, libreoffice.ts
│   ├── pdf-check.ts
│   ├── preview.ts
│   ├── template-import.ts         # Word/PDF sample -> templates/<name>/
│   ├── lint-cv.ts
│   └── trace-check.ts
└── .claude/
    ├── agents/                    # thin wrappers -> agents/*.md
    └── commands/                  # /harvest /compose /tailor /variants /review /improve /add-experience /profile /import-template /build
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
author_identities: []                # empty = use profile.yaml git_identities; list here only to override
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
cv_title_suffix: ""                # e.g. " (Contract)"; set automatically when engagement is contract, can be overridden
cv_emphasis:                       # what this entry must make clear; the composer puts it in the first bullets
  - Architecture-governed specification-driven development (SDD), not ad-hoc AI code generation
  - Owned the frontend technology stack, worked with the lead architect
cv_max_bullets: 8                  # optional length limit for this entry in the master CV
```

**CV placement.** Each summary decides which CV section its entry goes in, so any job can appear under **EXPERIENCE** or under **CONSULTING AND FREELANCE PROJECTS**, and you can move it by changing one field:

| Field | `experience` (e.g. SYSPRO, GM) | `consulting` (e.g. Clinical Ink, Jira plugin) |
|---|---|---|
| `cv_section` | `experience` | `consulting` |
| `show_dates_in_cv` | `true` (MM/YYYY ranges) | `false` by default, can be set to `true` |
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
  - { id: skills,     heading: SKILLS,     enabled: true, source: skills.yaml }
  - { id: languages,  heading: LANGUAGES,  enabled: true, source: profile.languages }
```

Entries that don't come from a single repo, such as **Software Engineering Consultant / Various Clients**, are defined in `facts/confirmed.yaml` with the same fields (`cv_section: consulting`), so they're placed the same way. A new section (for example *OPEN SOURCE* or *PUBLICATIONS*) is added in config only. Lint fails if a summary uses an unknown `cv_section`.

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
  phone: "+380 97 891 9783"            # international format, checked by lint
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
education: [...]
languages: [...]
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
- Lint warns when a skill's tags match no contribution in any summary (an unsupported skill), and when the same skill appears twice.
- Seeded in step 3 from the current CV's SKILLS section.

### 4.2c Calculated values

Values that change over time are calculated, never typed:

| Value | Calculated from |
|---|---|
| Years of experience ("7+") | earliest `period.start` among entries with `counts_as_experience: true` (default true for experience entries), rounded down |
| Team size led ("up to 8 engineers") | highest `team_size_led` across summaries and facts |
| "Present" end dates | `period.end: present` |

The composer writes the summary using these values through placeholders like `{years_experience}+ years`. Lint flags any typed number that differs from the calculated value.

### 4.3 Trace references in the CV

The composer adds an HTML comment after each bullet, which Markdown viewers and the renderer ignore:

```markdown
* Built the **Login micro-frontend** from scratch ... <!-- src: syspro-saas-erp#1.1 -->
```

`trace-check` reports bullets with no `src`, and `src` ids that don't resolve to a summary section or a fact id.

### 4.4 Role profiles (`profiles/*.yaml`)

A profile describes a reusable CV version for a type of role, built without a job description. The first four profiles:

| Profile | Headline | Emphasis |
|---|---|---|
| `react` | Senior React Engineer / Frontend Tech Lead | React 19, micro-frontends, schema-driven UI, state machines, testing, OIDC, observability, SDD/architecture |
| `react-native` | Senior React Native Engineer / Tech Lead (Mobile) | React Native, Expo, Android/iOS native, BLE/IoT, offline-first, mobile CI/CD, store releases |
| `fullstack-react-node` | Senior Full-Stack Engineer (React / Node.js) | React + Node.js APIs, PostgreSQL, AWS, Stripe, Docker, CI/CD, mock backends, Forge resolvers |
| `nodejs` | Senior Node.js / Backend-leaning Full-Stack Engineer | Node.js, REST/GraphQL, PostgreSQL, AWS, integrations. The gap report is expected to flag limited recent backend depth. |

Example:

```yaml
schema_version: 1
id: react-native
headline: Senior React Native Engineer / Tech Lead (Mobile)
summary_focus: [react-native, mobile, android, ios, offline-first, performance, leadership]
emphasize_tags: [react-native, expo, android, ios, ble, iot, mobile-ci, performance]
deemphasize_tags: [kendo, erp-forms]
skills_order: [Mobile, Languages, State and Data, Testing, DevOps and Observability, Frontend, Backend and Cloud]
max_bullets_per_entry: 6           # lower-relevance bullets are dropped first
min_bullets_per_entry: 2
include_sections: [summary, experience, consulting, education, skills, languages]
```

Rules for the tailor agent with a profile:
- It may **select, reorder, shorten and reword** bullets, rewrite the summary and headline within the profile's focus, and reorder skills.
- It may **not add claims** without a source. Every bullet keeps its `src`, so `trace` still passes.
- All jobs stay listed (no hidden gaps in the timeline), but less relevant jobs shrink to `min_bullets_per_entry`.
- It writes a `gap-report.md`: the profile's emphasis areas that have little supporting evidence. It also suggests which summaries could be enriched, or what you could add as a confirmed fact if it's true.

Profiles and job descriptions can be combined: `--profile react --jd job.md` starts from the profile, then tailors to the job. New profiles, such as `frontend-architect` or `tech-lead`, are added as new files with no code changes.

## 5. Agents

| Agent | Input | Output | Spec / rubric |
|---|---|---|---|
| **Harvester** | repo path(s), project id, author identities | `summaries/<id>.md` | work-summary-spec |
| **Composer** | all summaries, facts, current CV | the updated master CV (path and name from config) with trace comments + short change log in the reply | cv-spec |
| **Tailor** | a profile and/or a job description file, master CV, summaries, facts | `cv/variants/<profile>/` or `cv/tailored/<company-role>/`: `cv.md` + `gap-report.md` | tailoring-spec + the profile (may reorder, re-emphasize, drop; may not add unsourced claims) |
| **Reviewer** (run per rubric) | CV file, rubric, summaries/facts (fact-check only), preview images (layout only) | `reports/<date>/<rubric>.md` with verdict, score, findings (line, issue, suggestion, severity, `needs_user_input: yes/no`) | rubrics/* |
| **Advisor** | a report (or several), the CV, facts | asks you questions one topic at a time with suggested answers. It writes your answers to `facts/confirmed.yaml` (or to a summary's `cv_emphasis`), hands the change list to the composer, and shows the diff. | cv-spec + the report's rubric |
| **Template importer** | a Word or PDF CV | `templates/<name>/` (section 6.4) | template-import rules in `specs/templates.md` |

Reviewer set: **ATS**, **HR**, **proofreading**, **fact-check**, **confidentiality**, **layout**. They run in parallel when the tool supports it, otherwise one after another.

What the main rubrics must produce (taken from the reviews done in this chat):
- **ATS:**
  - a pass/fail verdict;
  - a score table (parsing, contact details, dates and gaps, seniority signals, keywords in context, measured results, signs of AI padding);
  - an estimated match per role (Senior Frontend, React Native, Tech Lead, Full-stack, Native Android …);
  - issues ranked by importance.
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
| `build [file]` | **The full chain:** `lint` and `trace`, then Markdown to Word, Word to PDF, `pdf-check` and the preview. Stops at the first failing step. Defaults to the master CV. |
| `build:all` | `build` for the master CV and every role variant (tailored CVs only when named) |
| `render [file] [--template <name>]` | Markdown to `.docx`, filling the chosen template through its `style-map.yaml`, plus the template's `fixes.yaml` (the Pages bullet-indent fix for `classic`). The default template comes from config, or from the profile's `template:` field. |
| `template-import <file.docx\|file.pdf> <name>` | Script part of the template import (6.4) |
| `pdf [file]` | `.docx` to `.pdf` with the first available exporter from `pdf_exporters` in `framework.config.yaml` (see 6.1) |
| `pdf-check [file]` | Checks that the PDF is ATS-readable (6.2) |
| `preview [file]` | Page images of the PDF into `preview/` (6.3) |
| `lint [file]` | Deterministic checks: forbidden characters, date format, duplicate skills, word count, heading structure, bold balance, **header matches `profile.yaml`**, phone in international format |
| `trace [file]` | Claim-to-source check (section 4.3) |
| `check` | lint + trace for the master CV, all variants and all tailored CVs |

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
- **Sections are missing:** every CV heading in the Markdown must appear in the PDF text.
- **Text doesn't match:** after normalizing whitespace and hyphenation, the PDF's words must cover the Markdown's words, ignoring formatting and trace comments. Missing words are listed.
- **Garbled characters:** the replacement character `�`, private-use glyphs, or broken ligatures.
- **The contact details aren't on page 1** (email, phone).

It also reports the page count and words per page. The results go to `pdf-check.md` next to the PDF.

### 6.3 Preview

It renders page images from the PDF into `preview/`:
- **Page 1** with macOS Quick Look (`qlmanage`), as used in this chat.
- **All pages** when `pdftoppm` or LibreOffice is available.

An agent, or you, can open the images to catch layout problems (like the bullet issue) before sending the CV. `build` prints the preview paths at the end.

### 6.4 Template import

To make your CV look like an existing Word or PDF CV, run `/import-template <file> <name>`. It produces a reusable `templates/<name>/`.

| Input | How |
|---|---|
| **Word** | Precise. The script reads the file's styles, numbering and paragraph properties. The template-importer agent labels each paragraph type (name, contact line, section heading and its rule, job title, company and dates, bullet, body text, skills line, education line) using the text and a preview. The result is the original styles with all sample content removed, plus `style-map.yaml`. |
| **PDF** | Approximate. The script extracts fonts, sizes, colors, positions, margins and line spacing with `pdfjs-dist`. The agent compares them with the page preview and the template is *rebuilt* as a new Word file (with the `docx` npm package) that copies the look. `import-report.md` lists what couldn't be copied exactly. |

**Rules:**
- **Only the styling is kept.** The other person's text, name and contacts are never saved. Their file stays wherever you keep it and is not copied into the repo.
- **ATS warnings.** The import report flags multi-column layouts, text boxes, layout tables, header/footer-only contact details, and icons used in place of words. It offers a one-column version.
- **Test build.** After import, your master CV is built with the new template and previewed. The template is marked `approved: true` in its style map only after you confirm.
- **Templates can be chosen** with `npm run build -- --template <name>` or `template: <name>` in a profile.

Your current template is the first one imported (`templates/classic/`). Rebuilding today's CV through it must match the current `.docx`, which tests the importer.

Dependencies: TypeScript run with `tsx`, `jszip` for reading and writing `.docx`, `yaml` for front matter and facts, `pdfjs-dist` for PDF text extraction, and `docx` for rebuilding templates from PDF samples. LibreOffice and `pdftoppm` are optional. No Python, since your Homebrew Python's XML parser is currently broken.

## 7. Workflows (commands)

| Command | Steps |
|---|---|
| `/harvest <repo-path> <id>` | Harvester writes the summary, then you review it |
| `/compose` | Composer updates the master CV, then `npm run check` |
| `/tailor --profile <id>` | Tailor builds `cv/variants/<id>/cv.md` from the profile, then `npm run build` on it |
| `/tailor --jd <file> [--profile <id>]` | Tailor builds `cv/tailored/<company-role>/` for one job, optionally starting from a profile, then `npm run build` |
| `/variants` | Rebuilds every profile variant (after summaries or the master CV change), then `npm run build:all` |
| `/review [cv-file] [rubric…]` | Runs the reviewers (default all 6) and writes `reports/<date>/`. "Would this CV pass an AI ATS?" is `/review --rubric ats`, and "…and then HR?" is `--rubric hr`. |
| `/improve [report…]` | Advisor goes through the findings one topic at a time. It asks you questions with suggested answers, records them as facts, has the composer apply them, and shows the diff. Findings you decline are recorded as decisions (e.g. "no LinkedIn link", "keep length"), so later reviews don't raise them again. |
| `/profile` | You describe a change ("moved to Poland, new phone +48…"). The advisor asks the follow-up questions (work permit? still B2B? new time zone? relocation?), updates `profile.yaml`, runs `/variants` and `build:all`, and lists tailored CVs and already-sent PDFs that still have the old details. |
| `/add-experience` | You describe experience in your own words (e.g. "technical interviewing, legacy React Native audits, presales"). The advisor asks follow-up questions, writes a `confirmed.yaml` entry (or a `cv_entry` for a new job), and the composer adds the bullets. |
| `/import-template <file> <name>` | Template import (6.4), followed by a test build and preview for your approval |
| `/build [cv-file]` | `npm run build`, then reports the pdf-check result and shows the page previews |

Each command file in `.claude/commands/` only says "follow `agents/<name>.md`". The same instructions are listed in `AGENTS.md` for other tools.

## 8. Build steps

Each step ends with something you can check.

1. **Restructure and preserve.** Create the folders. Move the CV files to `cv/` and the template to `templates/` (committing the template). Move the summaries to `summaries/` with the new names. Add `package.json`.
   *Check:* `git status` shows moves only, no content changes.
2. **Specs.** Write `cv-spec.md` (the current CV's structure plus every rule from this chat), `work-summary-spec.md`, `tailoring-spec.md`, `templates.md` and the 6 rubrics. The ATS and HR rubrics are based on the reviews done in this chat.
   *Check:* you review the specs. This is the most important review.
3. **Facts.** Write `profile.yaml` (section 4.2a), `skills.yaml` (4.2b, seeded from the current SKILLS section), `confirmed.yaml` (section 4.2) and `decisions.yaml` (section 10). Replace the typed header in the master CV with the generated one.
   *Check:* you confirm every entry is true.
4. **Migrate summaries.** Add front matter and restructure the body into the 9 sections from section 4.1, numbering the contributions. Existing content is kept. Sections the old summaries don't cover (for example, *Main features* for the Jira plugin, *Portfolio material*) are filled only from what the summary already says, or marked `TODO (needs user input)`. Nothing is invented.
   **Older jobs without summaries:** GM, Velas, OMO Systems, Thermo Fisher Scientific, Itjet and The Admasters exist only as CV text. Each gets a summary built from that text (`source: cv`, `harvested_at: null`), with its bullets as numbered contributions and every other section marked `TODO (needs user input)`. You can enrich them later with `/harvest` (if you still have the repos) or `/add-experience`.
   *Check:* you review the 3 migrated summaries and the 6 new ones, and fill in the TODOs you can. After this step, every job in the CV has a summary.
5. **Scripts and config.** `framework.config.yaml`, `schemas/`, `scripts/lib/`, the template-driven docx renderer, `template-import` (Word input first, then PDF), the PDF exporters (Pages, Word, LibreOffice), `pdf-check`, `preview`, `build`/`build:all`, `lint`, `trace`, `validate`, `index` and `check`, each with fixture tests.
   *Check:*
   - `npm test` passes, and `npm run validate` passes on all summaries and facts.
   - `templates/classic/` is created by importing `Kirill_Kohan_CV_prev.docx`.
   - `npm run build` through it produces a `.docx` matching the current one, a PDF that passes `pdf-check`, and a page-1 preview showing correct bullets.
6. **Agents and wrappers.** `agents/*.md` (harvester, composer, tailor, reviewer, advisor, template-importer), `.claude/agents/*`, `.claude/commands/*`, `AGENTS.md`, `CLAUDE.md`.
7. **Trace the current CV.** Run the composer once in "annotate only" mode to add `src` comments to the existing CV without changing its text. Then run `npm run check`.
   *Check:* every bullet resolves, or the gaps are listed for you.
8. **Role profiles and variants.** Write the 4 profiles, tag the contributions in the migrated summaries, and build the 4 variants plus their gap reports.
   *Check:* you review the variants and gap reports. `npm run check` passes on all of them.
9. **First full review run.** Run `/review` with all 6 rubrics.
   *Check:* the reports match what we found by hand in this chat. Findings already decided in this chat (no LinkedIn link, keep the length, etc.) are not raised again.
10. **Replay this chat.** Use the chat-step table in section 12 as an acceptance test: run each capability once on a copy of the CV from before this chat, and confirm the result matches today's CV.
11. **README.**

## 9. Scalability

The framework is designed so new outputs, reviewers and agents are **added as files, not by changing existing code**.

- **Sources and outputs are separate.** Summaries and facts are the sources. The CV, tailored CVs, and later the portfolio, a LinkedIn profile or cover letters are *outputs*. Each output is defined by one spec plus an optional renderer, so adding the portfolio later means adding `specs/outputs/portfolio.md` and an agent, without touching summaries.
- **Folders act as registries:**
  - Any file in `specs/rubrics/` is a reviewer. Dropping in `rubrics/frontend-architect-role.md` adds a reviewer with no other changes.
  - Any file in `profiles/` is a CV variant. `/variants` builds them all.
  - Any file in `agents/` is listed in `AGENTS.md` by the `index` script, so new agents are discovered automatically.
  - Any renderer in `scripts/renderers/` (docx now, later HTML or JSON) is chosen by file type or output type. Any exporter in `scripts/exporters/` (Pages, Word, LibreOffice) can be added to `pdf_exporters` in config.
- **One config file.** `framework.config.yaml` sets paths, default rubrics, the default renderer, the template, the spelling variant (US), CV sections, display formats, output names, header line templates, the tag list and check limits. Scripts and agents read it instead of hard-coding values. Example of the parts that remove remaining hard-coded values:

  ```yaml
  output:
    master_dir: cv
    variants_dir: cv/variants
    tailored_dir: cv/tailored
    file_name: "{name_underscored}_CV{profile_suffix}"   # Kirill_Kohan_CV, Kirill_Kohan_CV_React_Native
  display:
    date_format: "MMMM YYYY"          # December 2025
    date_range_separator: " - "
    present_label: Present
    contract_suffix: " (Contract)"
    field_separator: " | "
    bullet_bold_keywords: true
  checks:
    max_pages: 4
    max_words: 2200
    contacts_on_page_1: true
    forbidden_chars: ["→", "·", "•", "—"]
  ```

- **What stays in code:** only mechanics, such as how Markdown is parsed, how a Word file is written, how Pages is controlled and how checks run. Every value they use comes from config, a template, a spec, or the facts and summaries.
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
| Role variants in git | `cv/variants/` is committed, since it has no confidential job descriptions |
| Role profiles | First four: `react`, `react-native`, `fullstack-react-node`, `nodejs` (section 4.4) |
| Decisions already made in this chat | Recorded in `facts/decisions.yaml` so reviewers don't raise them again: no LinkedIn/GitHub links (the old CV had them, so they can come back), keep the current length, keep the Drive portfolio link, keep the job title step from GM to SYSPRO |
| Projects hidden from the CV | Supported with `show_in_cv: false`. Composer and tailor skip them, but they stay available for the portfolio and can be switched on later. |

## 11. Out of scope for now

- **Portfolio output:** the summaries already collect what it needs (section 4.1). The portfolio spec, agent and renderer come once you share your portfolio format.
- Cover-letter agent (the format leaves room to add it later).
- Pulling history from remote GitHub or Azure DevOps (local clones only).
- A fully code-driven pipeline (Agent SDK CLI). It can wrap the same `agents/*.md` later.
- Translating the CV into other languages.

## 12. Coverage of the 2026-10-15 chat

Every step done by hand in the chat, and the capability that repeats it:

| # | What we did in the chat | Framework capability |
|---|---|---|
| 1 | Generated work summaries from repo history (before the chat) | `/harvest` (Harvester, work-summary-spec) |
| 2 | Put SYSPRO into Experience and the other two projects into the freelance section | Composer + `cv_section` (4.1) |
| 3 | Made the CV ATS-friendly | cv-spec rules + `lint` + ATS rubric |
| 4 | Removed dates from the freelance section and renamed it | `cv_sections` config (`heading`, `show_dates`) + `show_dates_in_cv` |
| 5 | Removed client names (Clinical Ink, Velocity AI) | `cv_client_label` + confidentiality rubric |
| 6 | Highlighted SDD and architecture work rather than AI vibe coding, and tech-stack ownership | `cv_emphasis` in the summary + composer rule "emphasis first" |
| 7 | "Would this pass an AI ATS?" | `/review --rubric ats` (verdict, score table, role match, ranked issues) |
| 8 | Went through findings one by one with questions | `/improve` (Advisor) |
| 9 | Added numbers (25+ people, days to hours, fewer review cycles) | Advisor, then `confirmed.yaml`, then composer |
| 10 | Shortened the SYSPRO entry and merged bullets | `cv_max_bullets` + composer |
| 11 | Marked OMO, Thermo Fisher and Admasters as contracts | `engagement: contract` gives `cv_title_suffix: " (Contract)"` |
| 12 | Decided to keep length, contacts and the portfolio link | `facts/decisions.yaml` |
| 13 | Replaced special characters, made company spelling consistent, removed duplicate skills | `lint` + proofreading rubric |
| 14 | "Would HR pass it?" with likely interview questions | `/review --rubric hr` |
| 15 | Added the "Open to B2B contract or full-time employment" line | `profile.yaml` `work.engagement_types` generates the header line; `/profile` changes it |
| 16 | Added interviewing, legacy React Native audits and presales from your description | `/add-experience` |
| 17 | Converted the Markdown to Word in your old CV's format | `/import-template` (6.4) + `render` |
| 18 | Fixed the bullet indentation that broke in Pages | template `fixes.yaml`, PDF export through Pages, `preview`, layout rubric |
| 19 | Exported a PDF and checked it | `pdf` + `pdf-check` |
| 20 | Kept your manual edits made between steps | Principle "your manual edits are kept" + diffs |
| 21 | Saved preferences and decisions for future sessions | specs, `confirmed.yaml`, `decisions.yaml` (in the repo, so any tool sees them) |
| 22 | Asked what happens if you move country or change your phone | `profile.yaml` + generated header + lint header check + `/profile` |
| 23 | Asked whether anything is hard-coded | All sections, skills, calculated values, output names and display formats come from files (4.2b, 4.2c, section 9). Older jobs get summaries (step 4). |
