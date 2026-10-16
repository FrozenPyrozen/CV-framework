# CV framework

Kirill Kohan's CV, kept current by a local, specification-driven framework. Work summaries and confirmed facts are the sources. Scripts build the CV and check it; AI agents write and review it, following the rules in `specs/`. Every claim in a CV points back to a source, so nothing is invented.

**What you get from one `npm run build:all`:**

| CV | Markdown (committed) | Built files (git-ignored) |
|---|---|---|
| Master CV | `cv/Kirill_Kohan_CV.md` | `.docx`, `.pdf`, `pdf-check.md`, `preview/` |
| Role variants (react, react-native, fullstack-react-node, nodejs) | `cv/variants/<profile>/cv.md` + `gap-report.md` | the same, named `Kirill_Kohan_CV_<Profile>.pdf` |
| Ukraine versions of each (no phone, availability, time zones or "(Contract)") | generated | `markets/ukraine/…_UA.pdf` |
| CVs for one job ad (`/tailor --jd`) | `cv/tailored/<company-role>/` (git-ignored) | `Kirill_Kohan_CV.pdf` in that folder |

The design is in `docs/plan.md`, the rules in `specs/`, and the entry point for AI agents in `AGENTS.md`.

## Requirements

- **Node.js** in the version from `.nvmrc` (22). `nvm install` reads it.
- **A PDF exporter:** Pages or Microsoft Word on macOS, LibreOffice (`soffice`) on Windows and Linux. The order is set in `framework.config.yaml` (`pdf_exporters`) or per laptop in `framework.local.yaml`.
- **The template's fonts:** Cambria and Arial (`templates/classic/style-map.yaml`). `doctor` checks them.
- **An AI agent tool that reads `AGENTS.md`** (Claude Code, Codex, Cursor, Gemini CLI …) for the slash commands. The scripts run without one; writing, tailoring and reviewing need it.

## First run (this laptop)

```bash
npm ci                                              # exact dependency versions from package-lock.json
cp framework.local.example.yaml framework.local.yaml   # then set repo paths and backup_dir (see below)
npm run doctor                                      # Node, exporters, fonts, Pages permission, repo paths
npm run build:all                                   # every CV, every market: Word, PDF, checks, page images
npm run status                                      # "everything is up to date"
```

The first Pages export asks macOS for permission to control Pages; allow it. `doctor` does a real test export, so it surfaces this before a build does.

**`framework.local.yaml`** is per laptop and never committed:

```yaml
repos:                      # repo name in the summaries -> local clone path (used by /harvest)
  saas-frontend-repo: ~/Desktop/Work/saas-frontend-repo
backup_dir: backups         # relative to this folder, or e.g. iCloud Drive
# backup_password_env: CV_BACKUP_PASSWORD   # optional: encrypt backups with the password in this variable
# pdf_exporters: [pages, word, libreoffice] # optional: exporter order on this laptop
```

## New laptop

The committed files (summaries, facts, profiles, specs, agents, templates, config, CV Markdown) travel with git. Built files are recreated. Private files that aren't in git (tailored CVs, job ads, the application log, sent PDFs) travel in a backup.

1. **On the old laptop:** `npm run backup`. It writes an archive to `backup_dir`, encrypted (`.zip.enc`) when the variable named by `backup_password_env` holds a password, otherwise a plain `.zip`; keep a plain one on your own disks only. Copy it to the new laptop.
2. **Get the repo.** This repo has no remote yet. Either push it to a **private** remote once (`git remote add origin <private url> && git push -u origin main`) and `git clone` it, or copy the whole folder. Never use a public remote: the summaries describe client work.
3. **Install:** Node from `.nvmrc`, an exporter (Pages, Word or LibreOffice), the fonts, and your AI agent tool. Then `npm ci`.
4. `cp framework.local.example.yaml framework.local.yaml` and set the paths for this laptop. Repos you no longer have access to can be left out: their summaries are the lasting record.
5. `npm run restore <archive>` (with the same password variable set for an encrypted backup). It never overwrites a newer local file; it lists those, and `--force` overwrites them.
6. `npm run doctor` and fix anything it reports.
7. `npm run build:all`. The PDFs match the old laptop's content; `pdf-check` confirms it.

## Everyday tasks

Slash commands run in your AI agent tool (`.claude/commands/` for Claude Code; other tools follow the same files through `AGENTS.md`). Agents never commit: they leave a diff, and you commit.

| You want to … | Run |
|---|---|
| Add a repo's work to the CV (summary, CV, variants, build, review) | `/add-repo <path or repo name>` |
| Update the CV after editing summaries or facts | `/compose`, then `/variants` |
| Add experience that has no repo (interviews, audits …) | `/add-experience` |
| Change phone, country, availability | `/profile` |
| Start or leave a job (leaving: final harvest first) | `/job-change` |
| Make a CV for one job ad | `/tailor --jd <file or pasted text> [--profile react-native]` |
| Check the CV like an ATS, a recruiter, a proofreader … | `/review [rubric…]`, then `/improve` to go through the findings |
| See what is out of date and why | `/status` (or `npm run status`) |
| Rebuild everything | `npm run build:all` |
| Record a CV you sent | `/log-application` |
| Use another Word CV's look | `/import-template <file.docx> <name>` |

All scripts and their flags are listed in `AGENTS.md`. The ones you'll use most:

```bash
npm run build -- [cv] [--market ukraine] [--no-pdf]   # one CV
npm run check                                         # lint + source trace for every CV
npm run validate                                      # all inputs against schemas/
npm test                                              # the framework's own tests
```

## How it stays truthful

- Every bullet and summary sentence ends with `<!-- src: … -->` pointing to a summary contribution or a confirmed fact. `npm run trace` fails on anything unsourced.
- Facts and decisions you confirmed live in `facts/confirmed.yaml` and `facts/decisions.yaml`. Reviewers list decided points as *Decided* instead of raising them again.
- Employment types are facts: "(Contract)" appears only where it's true.
- Confidential names from each summary's notes never reach the rendered CV (`lint` checks it).
- After any change to a spec, rubric or agent, rerun `docs/acceptance.md`.

## Where things are

| Path | Contents |
|---|---|
| `summaries/` | one work summary per job or project (the lasting record) |
| `facts/` | profile, skills, confirmed facts, decisions, application log (git-ignored) |
| `profiles/`, `markets/`, `templates/` | role variants, market rules, Word templates |
| `specs/`, `agents/`, `AGENTS.md` | rules, agent definitions, the agent entry point |
| `cv/` | CVs (Markdown committed, built files ignored) |
| `reports/` | reviewer reports |
| `docs/plan.md`, `docs/acceptance.md` | design and build log, acceptance checklist |
| `scripts/`, `schemas/`, `tests/` | the deterministic tooling |
