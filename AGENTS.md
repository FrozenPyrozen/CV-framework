# AGENTS.md

Entry point for any AI agent working in this repo (Claude Code, Codex, Cursor, Gemini CLI …). Read this file first, then the agent definition for your task in `agents/`.

## What this repo is

A local, specification-driven framework that keeps Kirill Kohan's CV current, traceable and ready to send:

- **Sources:** work summaries (`summaries/*.md`, one per job or project), confirmed facts and decisions (`facts/`), role profiles (`profiles/`), markets (`markets/`), templates (`templates/`), `framework.config.yaml`.
- **Outputs:** the master CV (`cv/<Name>_CV.md`), role variants (`cv/variants/<profile>/cv.md`), job-specific CVs (`cv/tailored/<company-role>/cv.md`), and their Word, PDF and preview files for every market.
- **Deterministic work is done by scripts** (`npm run …`). **AI agents only write and judge**, following the specs.

The full design is in `docs/plan.md`. The rules are in `specs/`.

## Rules for every agent

1. **Specs first.** Follow `specs/cv-spec.md`, `specs/work-summary-spec.md`, `specs/tailoring-spec.md`, `specs/templates.md`, `specs/review-report-spec.md`, `specs/portability-spec.md` and the rubrics in `specs/rubrics/`. If a spec and a request conflict, say so and ask; don't silently deviate.
2. **Every claim needs a source.** Never write a CV claim without a summary contribution, summary section or confirmed fact behind it. If the user wants something unsourced in the CV, it becomes a confirmed fact first (`/add-experience`).
3. **Never invent.** Unknowns are `TODO (needs user input)` in summaries, or a question to the user. No invented numbers, dates, titles or technologies.
4. **The user's manual edits are kept.** Start from files as they are on disk. Edit CVs one entry at a time and run `npm run reattach-src -- <file> --save` before the first edit.
5. **Never commit.** Leave changes uncommitted, show a diff and a short change log. The user reviews and commits.
6. **Every AI step ends with a deterministic check.** After changing summaries, facts or profiles: `npm run validate`. After changing a CV: `npm run reattach-src -- <file>`, then `npm run check` (or `npm run build -- <file>`). Report failures; don't hide them.
7. **Confidentiality.** The repo is local or on a private remote only. Summaries describe work in your own words: no source code, copied internal documents, internal URLs or secrets. Terms in a summary's *Confidentiality notes* never appear in a CV (lint enforces it).
8. **Employment type is a fact.** `engagement` records the real employment type; "(Contract)" appears only when it's true (decision `all-full-time`).
9. **Decisions in `facts/decisions.yaml` are settled.** Follow them; reviewers list matching findings as *Decided*.
10. **US English.** Plain words for a mixed audience; no filler words (`checks.filler_words`).
11. **Don't use `cns:*` skills in this repo.** They belong to a different project.
12. **Ask the user** for job details, numbers, employment types, new tags, approvals and anything only they can know. Ask one topic at a time, with suggested answers.

## Workflows

Commands are available as Claude Code slash commands (`.claude/commands/`). Any other tool can run the same workflow by following the agent file and the scripts listed.

| Command | What happens | Follow |
|---|---|---|
| `/add-repo <path or name> [--resume]` | Whole new-repo flow: harvest, approve the summary, compose, approve the CV diff, variants, build, review | `agents/harvester.md`, then `agents/composer.md`, `agents/tailor.md`, `agents/reviewer.md` |
| `/harvest <path or name> [id]` | Write or merge a work summary from a repo | `agents/harvester.md` |
| `/compose` | Update the master CV from summaries and facts | `agents/composer.md` |
| `/tailor --profile <id>` / `--jd <file or text> [--profile <id>] [--market <id>]` | Build a role variant or a job-specific CV, with a gap report | `agents/tailor.md` |
| `/variants` | Rebuild every role variant, then `npm run build:all` | `agents/tailor.md` |
| `/review [cv] [rubric…] [--jd <file>] [--market <id>]` | Reviewer reports in `reports/<date-time>/` | `agents/reviewer.md` |
| `/improve [report…]` | Go through findings with the user, record answers, apply them | `agents/advisor.md`, then `agents/composer.md` |
| `/add-experience` | Turn the user's description of work into confirmed facts or a new entry | `agents/advisor.md` |
| `/profile` | Update personal details (phone, country, availability …) | `agents/advisor.md` |
| `/job-change` | Start or leave a job | `agents/advisor.md` |
| `/import-template <file> <name>` | Make a template from a Word CV | `agents/template-importer.md` |
| `/build [cv] [--market <id>] [--template <name>] [--no-pdf] [--entries-reviewed]` | `npm run build`, report the PDF checks and previews | scripts only |
| `/status [--ack <company>]` | `npm run status`, suggest the commands that bring stale CVs up to date | scripts only |
| `/log-application` | Record a sent CV in `facts/applications.yaml` | `npm run log-application` |
| `/doctor` | `npm run doctor`, explain how to fix anything missing | scripts only |

## Scripts (`npm run <script> -- <args>`)

| Script | Purpose |
|---|---|
| `validate` | check every input against `schemas/` and the cross-file rules; writes digests |
| `digest` | short summary digests in `summaries/.digests/` (read these before full summaries) |
| `git-digest <repo> [--path --since --until --identity --run]` | read-only history digest of a repo for the harvester |
| `refresh [cv] [--market --profile --out --check]` | regenerate the script-owned parts of a CV (header, entry lines, education, skills, languages) |
| `market [cv] [--market <id>]` | write the other market versions of a CV |
| `lint [cv] [--market --profile]`, `trace [cv] [--warn-only]`, `check` | CV rules, claim sources, both for every CV |
| `select <cv-dir> [--profile <id>] [--tags <file>]` (at least one) | deterministic bullet selection for variants and job ads |
| `reattach-src <cv> [--save \| --from <old>]` | snapshot before editing; restore dropped source comments after |
| `render [cv] [--template --out]`, `pdf [file.docx] [--exporter]`, `pdf-check <file.pdf> [--md --template]`, `preview <file.pdf> [--out --scale]` | Word, PDF, PDF checks, page images |
| `build [cv] [--market <id>] [--no-pdf] [--template <name>] [--entries-reviewed]`, `build:all` | the full chain for one CV or all of them |
| `status [--ack <company>]` | what is stale and why; sent-CV warnings |
| `template-import <file.docx> <name> [--map <map>]` | list a Word file's paragraphs, or build a template from labels |
| `doctor [--no-export]`, `backup [--out <dir>] [--no-password] [--full]`, `restore <archive> [--force]`, `index [--check]` | environment check, moving files between laptops, this registry |
| `log-application --company <name> --pdf <file> [--role --status --notes --keep-copy]` | record a sent CV in `facts/applications.yaml` |
| `test`, `typecheck` | the framework's own tests |

## Where things are

| Path | Contents |
|---|---|
| `docs/plan.md` | the design, decisions, risks and build steps |
| `docs/open-items.md` | things the user will add or answer later (not facts yet); the advisor reads and updates it |
| `docs/acceptance.md` | acceptance checklist, rerun after any spec or agent change (written in build step 10) |
| `specs/` | rules for CVs, summaries, tailoring, templates, review reports; `specs/rubrics/` for reviewers |
| `agents/` | one definition per agent (tool-neutral) |
| `facts/` | `profile.yaml`, `confirmed.yaml`, `skills.yaml`, `decisions.yaml` (and the git-ignored `applications.yaml`) |
| `summaries/` | work summaries; `.digests/` generated |
| `cv/` | CVs; built files and `markets/`, `tailored/`, `sent/` are git-ignored |
| `reports/` | reviewer reports |
| `.cv-runs/` | per-run working files (git digests, snapshots, run state), git-ignored |

## Registry (generated by npm run index)

<!-- generated:index -->
### Agents (`agents/`)

- [advisor.md](agents/advisor.md): Advisor: Talks with the user, one topic at a time, to turn review findings, new experience, profile changes and job changes into confirmed facts, decisions and summary updates, then hands the changes to the composer.
- [composer.md](agents/composer.md): Composer: Updates the master CV from the summaries and confirmed facts, one entry at a time, keeping the user's wording and every source comment.
- [harvester.md](agents/harvester.md): Harvester: Writes or merges a work summary (summaries/<id>.md) from a local git repo, asking the user for everything git can't know.
- [reviewer.md](agents/reviewer.md): Reviewer: Reviews a CV against one rubric and writes a report; never edits anything. Run once per rubric (ats, hr, proofreading, fact-check, confidentiality, layout).
- [tailor.md](agents/tailor.md): Tailor: Builds a role variant (cv/variants/<profile>/) or a job-specific CV (cv/tailored/<company-role>/) with a gap report; a script selects the bullets, the agent words them.
- [template-importer.md](agents/template-importer.md): Template importer: Turns a Word CV into a reusable template (templates/<name>/) by labeling its paragraph types, then test-builds the user's CV with it for approval.

### Reviewer rubrics (`specs/rubrics/`)

- [ats.md](specs/rubrics/ats.md): AI ATS screener: would this CV pass an AI-powered applicant tracking system for the target roles?
- [confidentiality.md](specs/rubrics/confidentiality.md): Confidentiality: could this CV leak anything a former employer or client would consider confidential, or identify a client that is meant to stay hidden?
- [fact-check.md](specs/rubrics/fact-check.md): Fact check: is every claim in the CV supported by its source, without exaggeration?
- [hr.md](specs/rubrics/hr.md): HR recruiter: after the automated screen, would a recruiter move this candidate to a first call, and what will they ask?
- [layout.md](specs/rubrics/layout.md): Layout: does the built PDF look right on every page?
- [proofreading.md](specs/rubrics/proofreading.md): Proofreading: is the CV free of spelling, grammar and consistency errors, following `cv-spec.md`?

### Role profiles (`profiles/`)

- [fullstack-react-node.yaml](profiles/fullstack-react-node.yaml): Senior Full-Stack Engineer (React / Node.js)
- [nodejs.yaml](profiles/nodejs.yaml): Senior Full-Stack Engineer (TypeScript, Node.js, React)
- [react-native.yaml](profiles/react-native.yaml): Senior React Native Engineer / Tech Lead (Mobile)
- [react.yaml](profiles/react.yaml): Senior React Engineer / Frontend Tech Lead

### Markets (`markets/`)

- [ukraine.yaml](markets/ukraine.yaml): ukraine, file suffix "_UA"
- [worldwide.yaml](markets/worldwide.yaml): worldwide (default), file suffix ""

### Templates (`templates/`)

- `classic` (default): approved, fonts Cambria, Arial

### Output specs (`specs/outputs/`)

None yet (the CV is specified by specs/cv-spec.md and specs/tailoring-spec.md).

### Commands (`.claude/commands/`)

- `/add-experience`: Turn the user's description of work into confirmed facts or a new entry
- `/add-repo`: Whole new-repo flow: harvest, compose, variants, build, review
- `/build`: Build a CV: Word, PDF, checks and previews for every market
- `/compose`: Update the master CV from summaries and facts
- `/doctor`: Check this laptop and explain how to fix problems
- `/harvest`: Write or merge a work summary from a repo
- `/import-template`: Make a template from a Word CV
- `/improve`: Go through review findings with the user and apply the answers
- `/job-change`: Start or leave a job
- `/log-application`: Record a sent CV in facts/applications.yaml
- `/profile`: Update personal details (phone, country, availability, work permit …)
- `/review`: Review a CV with the rubrics and write reports
- `/status`: What is stale and why
- `/tailor`: Build a role variant or a job-specific CV with a gap report
- `/variants`: Rebuild every role variant, then build all CVs
<!-- /generated:index -->
