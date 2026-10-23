# Work Summary Spec

Status: v1 · Applies to: `summaries/*.md`, written by the harvester, `/add-experience`, `/job-change` and by hand

A work summary is the **single source of truth for one job or project**, and the **lasting record** of it: access to the repos usually ends with the job, so everything worth keeping must be in the summary before you leave (see the final harvest in section 6). The CV, role variants and tailored CVs are built from it now, and the portfolio will be later. It is richer than any one output needs.

## 1. File

- One file per job or project: `summaries/<id>.md`.
- `id` is lowercase-kebab, usually `<client>-<project>` (e.g. `acme-billing-portal`; older ids in another form keep it), suggested by `/harvest` and confirmed by the user. **It never changes once created**, because CV source comments refer to it.
- Several repos for the same job go into one summary (`repos` list). A new job gets a new summary.

## 2. Front matter

```yaml
---
schema_version: 1
id: acme-billing-portal
source: git                        # git | cv | user
# --- the job ---
client: Acme Corp
role: Senior Software Engineer
engagement: full-time              # full-time | contract | freelance
period: { start: 2025-12, end: present }
domain: [Billing, SaaS]
team_size_led: 0
counts_as_experience: true
# --- harvesting ---
repos:
  - { name: billing-web }
author_identities: []
harvested_at: 2026-09-30
# --- how it appears in the CV ---
show_in_cv: true
cv_section: experience
cv_order: 1
cv_client_label: Acme Corp
cv_location: Remote
show_dates_in_cv: true
# cv_title_suffix: " (Contract)"   # optional; only when engagement is contract
cv_emphasis:
  - Architecture-governed specification-driven development (SDD), not ad-hoc AI code generation
cv_max_bullets: 8
---
```

| Field | Required | Meaning |
|---|---|---|
| `schema_version` | yes | format version; migrations move old files forward |
| `id` | yes | stable id (section 1) |
| `source` | yes | `git` = harvested from repos, `cv` = built from old CV text, `user` = described by the user |
| `client` | yes | real company or client name (private) |
| `role` | yes | job title as it should appear in the CV, without the contract suffix |
| `engagement` | yes | `full-time`, `contract` or `freelance` |
| `period.start` / `period.end` | yes | `YYYY-MM`; `end` may be `present` |
| `domain` | no | industry tags (ERP, automotive, healthcare …) |
| `team_size_led` | no | people you led on this job; default 0 |
| `counts_as_experience` | no | default true for `cv_section: experience`, false otherwise |
| `repos[].name` | for `source: git` | the repo's name, as a label of where the work happened. **No remote URLs** (access ends with the job, and they'd keep the employer's internal addresses) and **no local paths** (per laptop, in `framework.local.yaml`). |
| `author_identities` | no | extra git identities for this summary's repos, added to `profile.yaml` `git_identities` |
| `harvested_at` | for `source: git` | date of the last harvest; `null` otherwise |
| `harvest_mode` | no | `local` (default: `/harvest` in this repo) or `portable` (written on another machine from a harvest prompt, section 9) |
| `show_in_cv` | no | default true; false keeps the summary as a source (e.g. for the portfolio) but never shows it in a CV |
| `cv_section` | yes | a section id from `cv_sections` in config (`experience`, `consulting` …) |
| `cv_order` | no | position inside the section; default newest first |
| `cv_client_label` | yes | what the CV shows instead of `client` (same value when nothing is hidden) |
| `cv_location` | yes | e.g. `Remote`, `Berlin, Germany (Hybrid)` |
| `show_dates_in_cv` | no | default from the section's `show_dates` |
| `cv_title_suffix` | no | default derived from `engagement` (`contract` gives `display.contract_suffix`) |
| `cv_emphasis` | no | points the CV entry must make clear, in its first bullets |
| `cv_max_bullets` | no | limit for this entry in the master CV |
| `show_in_portfolio`, `portfolio_order`, `portfolio_title`, `portfolio_label`, `portfolio_max_items` | no | the public portfolio (`specs/outputs/portfolio.md` 3); in the schema since portfolio phase P1 |

**Rule for optional fields:** if missing, the default applies; if set, it wins.

## 3. Body sections

The body may start with one optional `# Title` line, then always has these nine `##` sections, in this order and with these numbers, so source ids like `#4.2` stay meaningful:

```markdown
## 1. Project overview
## 2. Main features
## 3. My role and responsibilities
## 4. My contributions
## 5. Technologies and frameworks
## 6. Skills demonstrated
## 7. Metrics and outcomes
## 8. Portfolio material
## 9. Confidentiality notes
```

| Section | Content |
|---|---|
| 1. Project overview | What the product is, who uses it, the business problem, and the team and organization context (team size, who you worked with). |
| 2. Main features | The product's key features **in user terms**, whether or not you built them, so a portfolio reader understands the product. |
| 3. My role and responsibilities | Title, ownership areas, leadership, architecture and process responsibilities, and key collaborators (e.g. "worked with the lead architect"). |
| 4. My contributions | Numbered items (section 4 below). The CV cites these. |
| 5. Technologies and frameworks | Grouped by category (language, UI, state, data, testing, CI/CD, cloud, AI and agents …), versions where known, each marked **hands-on** or **used by the project**. |
| 6. Skills demonstrated | Each skill with the contribution numbers that prove it, e.g. `OpenID Connect (OIDC): 4.2, 4.3`. |
| 7. Metrics and outcomes | Every number with its source (`git`, `user`, `dashboard`, `cv`, `doc:<id>`; `cv` may be written "previous CV"; either may add "confirmed by user <date>") and confidence (`exact`, `approximate`). A `doc:<id>` number reaches the CV only once confirmed (`sources-spec.md` 4). |
| 8. Portfolio material | Links, screenshots, demo notes, and what is safe to show publicly. May be `TODO (needs user input)`. `validate` checks its structured items; it is a structured list (images, links, demos, each with `public: yes, confirmed by user <date>` or `public: no`; `specs/outputs/portfolio.md` 3). |
| 9. Confidentiality notes | Internal names, repo names, ticket prefixes and internal URL patterns (e.g. the repo host, `*dev.azure.com*<org>*`) that must never appear in a CV. `lint` reads this section to build its blocklist. Exceptions use `allow_in`. The host patterns stay even though no remote URLs are stored. |

A section with nothing known yet contains `TODO (needs user input)`. **Never invent content to fill a section.**

### 3.1 Confidentiality notes format

```markdown
## 9. Confidentiality notes

- term: Project Falcon
- term: PFX
  allow_in: []                     # optional: where the term may appear in a CV: job ids (inside that job's
                                   # title, detail line and bullets) and/or `summary` (the summary paragraph);
                                   # `portfolio` for the public portfolio (job ids and `summary` don't apply there)
- term: billing-web
- prefix: BIL-                    # ticket prefixes
- url_pattern: "*.acme.internal"
```

## 4. Contributions

```markdown
### 4.2 Login micro-frontend

Built the login app from scratch: sign-in, forgot and reset password flows, reusable form components, schema-based validation and accessible typography, with a Storybook component library. Integrated OpenID Connect authentication into the host and admin applications.

Result: one shared identity flow; the only app that ever sees a password.
Tags: react, typescript, micro-frontends, oidc, accessibility, storybook, testing
```

- **Numbering:** `4.1`, `4.2` … in order of importance. **Numbers never change once used.** A new contribution gets the next free number, even if it would rank higher. A removed contribution keeps its number as `### 4.5 (removed)` with a one-line reason, so old source ids still resolve.
- **Title:** short, plain (no internal code names).
- **Body:** what you built, why, and how, in your own words. Several sentences are fine; the CV shortens them.
- **Result:** one line with the outcome, if any is known. Numbers must also appear in section 7 with their source.
- **Tags:** one line, only tags from the tag list in `framework.config.yaml`. New tags are proposed to the user, never added silently.
- **Source:** optional line after `Tags:`, only for a contribution taken from an imported document: `Source: doc:<id>` (`specs/sources-spec.md`). Without it, the summary's `source` applies.

## 5. Writing rules

- **Your own words only.** Never copy source code, internal document text, commit messages verbatim, internal URLs, hostnames, tokens or credentials. Describe the work.
- **No secrets.** `lint` scans summaries for tokens, keys and internal URLs.
- **Facts only.** Everything must be supported by the repos, by the user, by the old CV text (for `source: cv`) or by an imported document (`doc:<id>`, lowest precedence: `specs/sources-spec.md` 3). Unknowns are `TODO (needs user input)`.
- **US English.**

## 6. Harvesting rules

These apply to the harvester (`/harvest`, `/add-repo`):

1. **Input** is a history digest from `npm run git-digest` (commit counts per area, date range, key commit messages, changed folders, diff statistics, co-authored and squash-merged commits, "possibly yours" commits), plus the repo's README and docs. The harvester opens individual commits only when the digest isn't enough.
2. **Your commits** are those matching `author_identities` (or `profile.yaml` `git_identities`). New identities are confirmed by the user before use.
3. **Large repos** are summarized per area (folder or package).
4. **Job details** (`client`, `role`, `engagement`, `period`, `cv_*` fields) come from the user, with suggestions from the repo. They are never guessed silently.
5. **New tags and skills** for technologies used hands-on are proposed for approval.
6. Finish with `npm run validate` and show a diff. Never commit.
7. **Before leaving a job** (`/job-change`): harvest every repo of that job one last time while access lasts and fill the TODOs you can. Afterwards the summary is the only record, and the local clones and their paths in `framework.local.yaml` can be removed.

## 7. Merging into an existing summary (re-harvest)

- Contributions are updated from the new history. **Existing numbers are kept.** New items get new numbers.
- Sections the user edited, filled `TODO`s, all `cv_*` fields and section 9 are kept as they are. Proposed changes to them are listed for approval instead of applied.
- The new repo is added to `repos`, and `harvested_at` is updated.
- The result is shown as a diff.

## 8. Summaries built from the old CV (`source: cv`)

For jobs that exist only as CV text (older jobs whose repos are no longer accessible):

- Each CV bullet becomes one contribution, in CV order, with its tags.
- Front matter comes from the CV entry (role, client, location, dates). The employment type (`engagement`) is confirmed with the user, never inferred from a "(Contract)" label.
- Numbers in bullets go to section 7 with source `cv`.
- Every other section is `TODO (needs user input)`, to be enriched later with `/harvest` or `/add-experience`.

## 9. Portable harvest (repo on a machine without this framework)

When a repo can't be cloned to the laptop that holds this framework (for example a work laptop that must keep its code), the summary is written **on that machine** and only the summary comes back:

1. **Prompt (here):** `npm run harvest-prompt -- [--merge <id>] [--out <file>]` writes one self-contained Markdown prompt: these harvesting and writing rules, the format of this spec, the official tag list, the user's git identities, plain `git` commands to replace `git-digest`, and, with `--merge`, the existing summary so numbering is kept. It contains no other summaries, facts or CVs.
2. **Harvest (there):** in the repo on that machine, the user gives the prompt to any AI agent tool. The agent asks the user for what git can't know (as in section 6), writes **one file**, `<id>.md`, with `source: git`, `harvest_mode: portable` and `harvested_at`, and checks it against the prompt's self-check list.
3. **Review and transfer:** the user reads the file before it leaves that machine. It follows the writing rules (section 5): own words, no code, copied internal text, internal URLs, secrets or local paths. **Follow your employer's rules on what may leave a work machine**; if section 9 (confidentiality notes) may not leave, write `TODO (needs user input)` there and fill it in here. Move the file by a channel the employer allows.
4. **Import (here):** `npm run import-summary -- <file>` checks the file with the same rules as `validate` (schema, nine sections, numbering, tags, `repos` names only) plus the secret scan, without touching `summaries/`. With `--apply`, a new summary goes to `summaries/<id>.md`; for an existing id it goes to `.cv-runs/import/<id>.md`, and the harvester merges it by section 7 (`/import-summary`). Unknown tags are reported as proposals for the user to approve (they enter the tag list only through approval).
5. **Then** the usual flow: `/compose`, `/variants`, `build:all`, `/review`.

Rules: the prompt is generated, never edited by hand, so it always matches this spec and the tag list; it never carries another summary's confidentiality terms or hidden client names (`harvest-prompt` refuses, so this spec's examples stay made up); a portable summary is never trusted without `import-summary`; a portable merge follows section 7 exactly (existing numbers, user edits, `cv_*` fields and section 9 are kept).

