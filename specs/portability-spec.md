# Portability Spec

Status: v1 · 2026-10-16 · Applies to: moving the framework to another laptop, `npm run backup`, `npm run restore`

The framework must run on any laptop. This spec defines what moves, how, and what each laptop sets up for itself. The design background is in `docs/plan.md` section 9a.

## 1. What travels and how

| Kind | Examples | How it travels |
|---|---|---|
| Committed files | summaries, facts, profiles, specs, agents, templates, config, CV Markdown, reports | git: a private remote, or the repo bundle in a full archive (section 3) |
| Private files, not in git | `cv/tailored/` (job ads, tailored CVs), `cv/sent/`, `facts/applications.yaml` | a backup (section 2), also inside a full archive |
| Per-laptop settings | `framework.local.yaml` (repo paths, backup folder, exporter order) | not moved as settings: each laptop writes its own from `framework.local.example.yaml`; a backup carries the old file only for reference (section 4) |
| Recreated on each laptop | `node_modules/`, built files (`.docx`, `.pdf`, `pdf-check.md`, `preview/`, `markets/`, `selection.json`, `cv/.build-state.json`), `summaries/.digests/`, `.cv-runs/` | never moved: `npm ci`, `npm run validate` and `npm run build:all` recreate them |
| Archives | `backups/` | never inside another archive |

**Never move `node_modules/`.** It holds native binaries built for one OS and CPU (`@napi-rs/canvas`); `npm ci` installs the right ones from `package-lock.json`.

## 2. Backup (private files only)

`npm run backup [--out <dir>] [--no-password]` writes `cv-backup-<date-time>.zip` to `backup_dir`, or `.zip.enc` when the environment variable named by `backup_password_env` holds a password (AES-256-GCM, key from the password via scrypt; the password is never stored). `--no-password` writes a plain zip even when the variable is set.

Contents: the private files from section 1 and `framework.local.yaml`.

## 3. Full archive (the whole project in one file)

`npm run backup -- --full [--out <dir>] [--no-password]` writes `cv-full-<date-time>.zip` for moving the project when there is no remote yet, or for a complete offline copy. It is a **plain zip that opens with the operating system's own tools**, because the new laptop doesn't have the framework yet:

| File | Contents |
|---|---|
| `repo.bundle` | `git bundle` of every branch and tag, with full history: all committed files |
| `private-backup.zip` or `private-backup.zip.enc` | the backup from section 2 (encrypted when the password is set) |
| `manifest.json` | `schema_version`, `created_at`, `branch`, `head` (commit), `node` (version from `.nvmrc`), `private_files` (count), `encrypted` |
| `RESTORE.txt` | the restore steps from section 5, so the archive explains itself |

Rules:
- **Committed work only.** The bundle holds commits, not working-tree changes, so `--full` refuses to run while `git status` shows modified or untracked files that aren't git-ignored. Commit first.
- **Never included:** everything in the "recreated" and "archives" rows of section 1.
- **Sensitivity:** the bundle holds every summary in plain text (client work, internal names). The outer zip is not encrypted, so keep it on your own devices or an encrypted medium, and delete copies you no longer need. The private part follows the same password rule as a normal backup.

## 4. Restore

`npm run restore -- <archive> [--force]`, run inside the project folder:
- unpacks a backup (`.zip`, or `.zip.enc` with the same password variable) or the `private-backup.zip[.enc]` taken out of a full archive;
- writes only backup paths, never anything else;
- never overwrites a local file that is newer; it lists those conflicts, and `--force` overwrites them;
- **never writes `framework.local.yaml`.** The archived file is saved as `framework.local.previous.yaml` (git-ignored), and restore says so: copy what still applies (backup folder, exporter order) into this laptop's `framework.local.yaml`. Repo paths usually differ per laptop, and repos you no longer have access to are left out (their summaries are the record).

## 5. Moving to another laptop

**A. With a private remote:**
1. Old laptop: commit, push, and `npm run backup`.
2. New laptop: install Node (`.nvmrc`), an exporter (Pages, Word or LibreOffice), the template fonts and an AI agent tool; then `git clone <private remote>` and `npm ci`.
3. Continue at step 4 of route B.

**B. With a full archive (no remote yet):**
1. Old laptop: commit everything, then `npm run backup -- --full`. Copy `cv-full-<date-time>.zip` to the new laptop.
2. New laptop: install the same tools as in A2. Unzip the archive, then:
   ```bash
   git clone repo.bundle CV            # recreates the repo with full history
   cd CV
   git remote remove origin            # origin points at the bundle file; drop it
   npm ci
   ```
3. Restore the private files: `npm run restore -- ../private-backup.zip` (or `.zip.enc`, with the password variable set).
4. `cp framework.local.example.yaml framework.local.yaml`, set this laptop's repo paths and backup folder (see `framework.local.previous.yaml` if a restore created it).
5. `npm run doctor` and fix what it reports, then `npm run build:all` and `npm run status`.
6. **Connect a remote** (when you have one): `git remote add origin <private url>` and `git push -u origin --all && git push origin --tags`. Before the first push, check that the history holds nothing you don't want on that server (see section 6).
7. Delete the archive copies you no longer need.

## 6. Before connecting a remote

- **Private only.** The remote must be private: summaries describe client work.
- **History check.** Pushing sends the whole history, not just the current files. Search the history for what should stay local before the first push: `git log -p --all | grep -iE "<client names>|https?://|password|token"`. If something sensitive is in old commits, rewrite those commits first (with your approval), then push.

## 7. Checks

- `npm run doctor` on the new laptop: Node version, exporters, fonts (by a real test export), repo paths from `framework.local.yaml`.
- `docs/acceptance.md` C1 runs route B on one machine (a fresh folder stands in for the new laptop); route A is the same from step 4.
