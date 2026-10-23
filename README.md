# CV framework

Kirill Kohan's CV, kept current by a local, specification-driven framework. Work summaries and confirmed facts are the sources. Scripts build the CV and check it; AI agents write and review it, following the rules in `specs/`. Every claim in a CV points back to a source, so nothing is invented.

**What you get from one `npm run build:all`:**

| CV | Markdown (committed) | Built files (git-ignored) |
|---|---|---|
| Master CV | `cv/Kirill_Kohan_CV.md` | `.docx`, `.pdf`, `pdf-check.md`, `preview/` |
| Role variants (react, react-native, fullstack-react-node, nodejs) | `cv/variants/<profile>/cv.md` + `gap-report.md` | the same, named `Kirill_Kohan_CV_<Profile>.pdf` |
| Ukraine versions of each (no phone, availability, time zones or "(Contract)"; the master's headline without "(Frontend and Mobile)") | generated | `markets/ukraine/…_UA.pdf` |
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

The rules are in `specs/portability-spec.md`. Committed files travel with git; private files that aren't in git (tailored CVs, job ads, the application log, sent PDFs) travel in a backup; `node_modules/`, built files, `.cv-runs/` and `backups/` never move (they are recreated, and `node_modules/` holds native binaries for one OS).

**Old laptop:** commit everything, then either
- **with a private remote:** `git push`, and `npm run backup` for the private files; or
- **without a remote:** `npm run backup -- --full`. It writes `cv-full-<date-time>.zip` to `backup_dir`: the repo with full history (`repo.bundle`), the private files (`private-backup.zip`, encrypted as `.zip.enc` when the password variable is set), a manifest and `RESTORE.txt`. The outer zip isn't encrypted and holds every summary, so keep it on your own devices. It refuses to run with uncommitted changes.

**New laptop:**
1. Install Node from `.nvmrc`, an exporter (Pages, Word or LibreOffice), the fonts and your AI agent tool.
2. Get the repo:
   - from a remote: `git clone <private url> CV && cd CV`
   - from a full archive: unzip it, then `git clone repo.bundle CV && cd CV && git remote remove origin`
3. `npm ci`
4. `npm run restore -- <backup>` (for a full archive: `../private-backup.zip` or `.zip.enc`, with the password variable set). It never overwrites a newer local file (`--force` does), and it saves the old laptop's settings as `framework.local.previous.yaml`.
5. `cp framework.local.example.yaml framework.local.yaml` and set this laptop's repo paths and backup folder.
6. `npm run doctor`, fix what it reports, then `npm run build:all`.
7. **Connect a remote later** (when you have one): `git remote add origin <private url>`, then `git push -u origin --all && git push origin --tags`. Pushing sends the whole history, so first check it holds nothing that should stay local (`specs/portability-spec.md` 6). Use a private remote only: the summaries describe client work.

## Everyday tasks

Slash commands run in your AI agent tool (`.claude/commands/` for Claude Code; other tools follow the same files through `AGENTS.md`). Agents never commit: they leave a diff, and you commit.

| You want to … | Run |
|---|---|
| Add a repo's work to the CV (summary, CV, variants, build, review) | `/add-repo <path or repo name>` |
| Add a repo that can't leave a work laptop (summary written there, brought back) | `/harvest-prompt`, then `/import-summary <file>` |
| Take details from old CVs or portfolios (they fill gaps; current data wins) | `/import-docs <file…>` |
| Choose what goes into the public portfolio (projects, screenshots, links) | `/portfolio-material` |
| Write or update the portfolio's text | `/portfolio` (then `npm run portfolio -- check`) |
| Build the portfolio (Word, PDF in A4 and Letter, previews, Pages) | `npm run build:portfolio` |
| Review the portfolio (spelling, facts, confidentiality, layout) | `/review --portfolio` |
| Check spelling (also part of build and check) | `npm run spellcheck` |
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

A script that fails prints one line with the reason; run it with `CV_DEBUG=1` in front to see the full stack trace.

All scripts and their flags are listed in `docs/scripts.md`, all commands in `docs/workflows.md`. The ones you'll use most:

```bash
npm run build -- [cv] [--market ukraine] [--no-pdf]   # one CV
npm run check                                         # lint + source trace for every CV
npm run validate                                      # all inputs against schemas/
npm test                                              # the framework's own tests
npm run verify                                        # validate, doc-check, check, status and tests in one go
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
| `docs/plan.md`, `docs/changelog.md`, `docs/acceptance.md` | design, change log, acceptance checklist |
| `docs/open-items.md` | what you said you'll add or answer later |
| `scripts/`, `schemas/`, `tests/` | the deterministic tooling |
