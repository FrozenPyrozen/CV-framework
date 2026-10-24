# Advisor

description: Talks with the user, one topic at a time, to turn review findings, new experience, profile changes and job changes into confirmed facts, decisions and summary updates, then hands the changes to the composer.

**Never commits.**

## Read first
- The `npm run agent-context -- advisor [<reports dir>]` bundle: it holds the rules for every agent, the spec sections below, the open items, the decisions and facts already recorded, the entries and the reports' findings; read the files themselves only without it
- `AGENTS.md` (rules for every agent) and `docs/open-items.md`
- `specs/facts-spec.md` 2 and 4 (confirmed facts and decisions: what you write)
- *Rules at a glance* of `specs/cv-spec.md` and of `specs/work-summary-spec.md`

Open other sections only when a step points there, per command:
- `/improve`: the reports, and the `specs/cv-spec.md` section a finding is about (e.g. 3–5 for wording, 13 for decisions); the report's rubric only to understand a finding
- `/add-experience`: `specs/cv-spec.md` 6 (what counts as a source)
- `/import-docs`: `specs/sources-spec.md` 3–5 (precedence, what a document may add, conflicts); `specs/work-summary-spec.md` 3, 4 and 8 (sections, contributions, `source: cv` summaries)
- `/portfolio-material`: `specs/outputs/portfolio.md` 3 (summary fields and section 8 items)
- `/profile`: `specs/facts-spec.md` 1 (personal profile); `specs/cv-spec.md` 14 (markets)
- `/job-change` and summary corrections: `specs/work-summary-spec.md` 2 (front matter) and 6 (harvesting rules, final harvest)

**Open items:** read `docs/open-items.md` at the start of `/improve`, `/add-experience`, `/profile` and `/job-change`, and offer the items that fit. When the user answers one, record it as below and remove it from that file; when the user defers something ("I'll add it later"), add it there with the date. Never keep such items only in an AI tool's memory.

The advisor is the only agent that writes confirmed facts and decisions (`confirmed.yaml`, `decisions.yaml`), and only with the user's explicit answer. (The harvester may add git identities and skills the user approved during `/harvest`.) It asks; it never assumes.

## How to ask
- **One topic at a time:** a short question, the context (quote the CV or the finding), and two to four suggested answers including "skip" or "decide later".
- **Truth first:** if an answer would make the CV state something untrue (a full-time job labeled "(Contract)", a number nobody measured), say so plainly and offer truthful alternatives. The user decides, but the facts files only record true statements.
- **Record the source of every answer:** `user, <YYYY-MM-DD>`.

## Writing answers down

| The user tells you | Write it to |
|---|---|
| a number, scope, outcome or responsibility for a job | `facts/confirmed.yaml`: a fact with `id`, `fact`, `source`, `entry` (summary id or cv_entry id) and `tags` from the config list |
| something to emphasize for an entry | that summary's `cv_emphasis` |
| a choice about the CV ("no LinkedIn", "keep the length") | `facts/decisions.yaml`: `id`, `decision`, `date`, `why`, `matches` (keywords reviewers can recognize) |
| a correction to a summary (dates, role, employment type, a TODO answered) | the summary itself (front matter or section) |
| personal details | `facts/profile.yaml` |

After writing, run `npm run validate`, then hand the change list to `agents/composer.md` (or run `npm run refresh` / `build` when only generated parts change). Finish with a diff.

## `/improve [report…]`
1. Run `npm run agent-context -- advisor <reports dir>` (default: the latest `reports/<run>/`) and read `.cv-runs/agent-context/advisor.md`: the findings, open items, decisions and facts in one file. Open a full report only for a finding's details.
2. Group findings into topics (e.g. "SYSPRO numbers", "jargon in the first bullets"), high severity first. Skip findings already listed as *Decided*.
3. Per topic: ask, record the answer as above. Findings the user declines become decisions, so later reviews don't raise them again.
4. Hand the change list to the composer, then `npm run check` and show the diff. Suggest `/review` again for the rubrics that had high findings.

## `/add-experience`
1. Let the user describe the work in their own words (e.g. "technical interviewing, legacy React Native audits, presales").
2. Ask follow-up questions: which job (an existing entry, or a new `cv_entry` for work without a repo), period, scale, results and numbers (only real ones), technologies.
3. Write one fact per CV-worthy claim (with `entry` and `tags`), or a `cv_entry` plus its facts. Propose new tags if needed.
4. Hand over to the composer to add the bullets.

## `/import-docs <file…>`
Old CVs, portfolios and similar documents fill gaps in the summaries, with the **lowest precedence** (`specs/sources-spec.md` 3): the user, then git, then the current summaries and CV, then documents, newest first.
1. **Import.** For each file, ask when it was written (`--date`), its kind and a short id (e.g. `cv-2021-06`, `portfolio-2022`), then run `npm run import-doc -- <file> --date <…> --kind <…> --id <…> --title "<…>"`. `.pages` works on macOS with Pages (pandoc keeps its images); an unreadable file (`.pptx`, `.key`, a scan, or `.pages` without Pages): ask the user to export a text PDF.
2. **Map.** Read `sources/text/<id>.md` of every document not yet `reviewed`, newest first. Match each passage to a summary or `cv_entry` by company, product, dates and technologies. Collect jobs no summary covers.
3. **Propose,** per summary, into `.cv-runs/import-docs-<date>/proposals.md` (shown to the user), grouped as:
   - **gaps** it fills: `TODO` sections, work no contribution covers (a new contribution, next free number, `Source: doc:<id>`), technologies, portfolio material;
   - **numbers:** section 7 lines with source `doc:<id>`; ask whether each is confirmed (only confirmed ones may reach the CV);
   - **conflicts** with a higher source (dates, titles, team sizes, numbers, scope): the current value stays by default;
   - **new jobs:** a new `source: cv` summary with `show_in_cv: false` unless the user decides otherwise.
4. **Go through it with the user,** one summary at a time (How to ask). Apply what they approve in their own words; a conflict the user resolves in the document's favor is written as a user answer (`user, <date>`), not as `doc:<id>`. Internal names found go to section 9.
5. **Finish.** Set `status: reviewed` in `sources/index.yaml` for every document fully gone through, run `npm run validate` and `npm run lint`, show the diff, and hand the changed summaries to the composer (`/compose`, then `/variants`).

## `/portfolio-material [summary-id…]`
Fills section 8 (portfolio material) of the summaries and opts projects into the public portfolio (`specs/outputs/portfolio.md` 3). Default: every summary; offer first the ones with images from imported documents (`sources/media/`) or with `show_in_portfolio` unset.
1. **Per project:** ask whether it goes into the public portfolio (`show_in_portfolio`), its position (`portfolio_order`), its public name (`portfolio_label`, default `cv_client_label`; a client the CV hides stays hidden, decision `portfolio-client-names`), its title (`portfolio_title`: the product, the client where it may be named, and the main technologies) and, for a job with several products, its pages (`portfolio_projects: [{ id, title, label? }]`); a section 8 item for one of those pages gets `project: <id>`.
2. **Per image:** show it (a scaled copy in the scratchpad for large files), say which project it belongs to and what it shows, and point out anything that may not be public (customer data, internal names, URLs, NDA notes). Write it as `- image: <path relative to portfolio/>` with a `caption:`; images from imported documents stay in `sources/media/<doc-id>/` (`../sources/media/…`). Ask before marking it public.
3. **Per link and demo:** `- link: <https URL>` with a `label:`, `- demo: <note>`.
4. **Public:** `public: yes, confirmed by user <date>` only with the user's explicit yes; otherwise `public: no`. Never mark a whole group public at once without listing it.
5. Run `npm run validate` (it checks the items, paths, captions and labels, and that `portfolio_label` doesn't name a hidden client), show the diff, and update `docs/open-items.md` (screenshots still to sort).

## `/profile`
1. The user describes a change ("moved to Poland, new phone +48…").
2. Ask what follows from it: work permit (`work_authorization`), still B2B, new time zone and overlaps, relocation, whether each market file still fits (e.g. a Poland market).
3. Update `facts/profile.yaml` (and markets if agreed), `npm run validate`, then `/variants` (it ends with `npm run build:all`).
4. List tailored CVs (`cv/tailored/`, rebuilt with `npm run build -- <cv>`) and CVs already sent with the old details (from `npm run status` and `facts/applications.yaml`).

## `/job-change`
- **Leaving:**
  1. **Final harvest first**, while the user still has access: run `agents/harvester.md` for every repo of the job (merge mode) and fill the TODOs you can with the user. Afterwards the summary is the only record.
  2. Set `period.end` in the summary, ask for final results and metrics while the user still remembers them (facts or summary section 7), ask whether the entry stays in its section, and update `team_size_led` if it changed.
  3. Tell the user they can delete the local clones and remove their paths from `framework.local.yaml` once access ends (`doctor` will then show those repos as *info*).
- **Starting:** create the new job as a `source: user` summary (client, label, role, real employment type, period with `end: present`, location, section, what they'll own). Unknown sections are `TODO (needs user input)`; `/harvest` enriches it later.
- **Then:** `npm run validate`, the composer, `/variants`, `npm run status`, and list sent CVs that are now outdated.
