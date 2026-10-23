# Tailoring Spec

Status: v1 · Applies to: role variants (`cv/variants/<profile>/`) and job-specific CVs (`cv/tailored/<company-role>/`)

A tailored CV is the master CV adapted to a type of role (a **profile**) or to one **job ad**. It may change emphasis, order and length. It may never add a claim without a source.

## 1. Inputs

| Input | Used for |
|---|---|
| Role profile `profiles/<id>.yaml` | headline, summary focus, tags to emphasize or downplay, skills order, limits, template, overrides |
| Job ad (`--jd`, a file or pasted text) | saved as `job-description.md`, then mapped to tags in `jd-tags.yaml` |
| Market (`--market`, default: the default market) | job-specific CVs are built for one market; role variants are built for every market by `build:all` (`cv-spec.md` section 14) |
| Master CV | preferred wording for every bullet, by source id |
| Summary digests, full summaries for changed entries, facts | content and sources |
| `cv-spec.md` | every structure, style, ATS and confidentiality rule still applies |

### 1.1 Role profile (`profiles/<id>.yaml`)

A profile describes a reusable CV version for a type of role, built without a job ad. Any file in `profiles/` is a variant (`/variants` builds them all); a new profile (e.g. `frontend-architect`) is a new file, with no code change. Structure: `schemas/role-profile.schema.json`.

```yaml
schema_version: 1
id: react-native
headline: Senior React Native Engineer / Tech Lead (Mobile)
summary_focus: [react-native, android, ios, offline-first, performance, leadership]
emphasize_tags: [react-native, expo, android, ios, ble, iot, mobile-ci, performance]
deemphasize_tags: [kendo, erp]
skills_order: [mobile, languages, state-and-data, testing, devops, frontend, backend-and-cloud]   # category ids from skills.yaml
template: classic                  # optional; default from framework.config.yaml
overrides: {}                      # lasting tweaks for this variant, by source id (section 4)
max_bullets_per_entry: 6           # lower-relevance bullets are dropped first
entry_max_bullets: {}              # optional per-entry limits, e.g. { syspro-saas-erp: 7 }
min_bullets_per_entry: 2
include_sections: [summary, experience, consulting, education, skills, languages]
max_pages: 3                       # optional; overrides checks.max_pages for this variant (used by pdf-check)
max_words: 1800                    # optional; overrides checks.max_words (used by lint)
```

`validate` checks every tag against the config list, `skills_order` categories, `include_sections`, the template, bullet limits, pins per entry and the ids in `overrides` and `entry_max_bullets`. A job-specific CV records its profile and an optional `headline` in `jd-tags.yaml` (section 2); `refresh`, `lint`, `build` and `pdf-check` read them from there.

## 2. Steps

1. **Tags.** For a profile, take its tags. For a job ad, map its requirements to tags from the config tag list, propose new tags for anything missing, and save `jd-tags.yaml` for the user to adjust. A job ad always builds on a role profile (`profile:` in `jd-tags.yaml`): without `--profile`, the tailor proposes the closest one for the user to confirm. The job ad's tags add to the profile's. The ad's **requirements** ("what we're looking for", "must have") go to `required`; its **duties** ("what you'll do") and "nice to have" items go to `nice_to_have`, unless the requirements repeat them. The proposed profile is written to `jd-tags.yaml` `profile` (with a one-line reason as a comment) and explained at the top of the gap report.
   `jd-tags.yaml` format:
   ```yaml
   required: [react-native, typescript, testing]     # must-have requirements, weight 3
   nice_to_have: [graphql, aws]                       # weight 1
   new_tags_proposed: [kotlin-multiplatform]          # not in the config list yet; need approval
   overrides:                                         # optional: pins and drops for this one CV, on top of the profile's
     velas-wallet#4.7: { pin: true }
   profile: react-native                              # required: the role profile it starts from (its pins carry the cv_emphasis openings)
   headline: Senior React Native Engineer (Healthcare)   # optional: a headline fitting the job ad
   ```
2. **Selection (script).** `npm run select -- <cv-dir> [--profile <id>] [--tags jd-tags.yaml]` (the profile may also come from `jd-tags.yaml` `profile`) scores every contribution and fact by its tags (2 × emphasize, 1 × summary focus, −2 × de-emphasize, 3 × job-ad required, 1 × job-ad nice-to-have; pinned bullets first in the order the profile's `overrides` list them, ties keep the summary's order), applies limits (the profile's `entry_max_bullets`, then `max_bullets_per_entry`, else the entry's `cv_max_bullets`, the same order lint uses) and overrides, and writes `selection.json`: which bullets each entry gets, in which order. **The agent doesn't change the selection.** If it disagrees, it says so in the gap report, and the user changes the profile or `jd-tags.yaml`.
3. **Wording (agent).** For each selected bullet:
   - If the master CV has a bullet with the same source id, start from its wording (including the user's manual edits) and only shorten or re-emphasize it. Re-emphasizing may bring in a detail from the **same** source (for example where an app was published), never one from another source.
   - Otherwise write it fresh from the source, following `cv-spec.md`.
   - Keep its `src` comment.
   - **Master bullets with several sources:** keep the parts backed by selected sources, and the parts backed by a confirmed fact about the same work (its number, scope or ownership, e.g. `syspro-team-size` with `#4.1`, `syspro-tech-stack-ownership` with `#4.3`) or by one of the entry's `cv_emphasis` points. Drop a part backed only by an unrelated, unselected source, unless the same claim is already elsewhere in the CV. Cite exactly the sources the remaining text uses. When a source that a master bullet merges is itself selected as a separate bullet in this CV (for example a pinned fact), it gets its own bullet and is left out of the merged one: no claim appears twice.
   - **Order:** bullets appear in selection order; the agent doesn't reorder them (pins set the opening bullets). Bullets with a score of 0 or less are selected only to reach `min_bullets_per_entry`, so an entry can end below its limit.
4. **Headline and summary.** Use the profile's `headline`, or for a job ad one fitting it, written to `jd-tags.yaml` `headline` (the header is generated, so `refresh` reads it from there). Rewrite the summary paragraph around `summary_focus`, with a `src` comment on every sentence; a sentence may cite any contribution or fact of an entry shown in the CV, selected as a bullet or not.
   - **Over `max_words`:** shorten the wording first (each bullet keeps its claim and sources). If the CV is still too long, the agent doesn't drop selected bullets itself: it proposes drops (`overrides` in `jd-tags.yaml` or the profile) in the gap report, and the user decides.
5. **Skills.** Reordered by `skills_order` through the generated `skills` block (not by hand).
6. **Only changed entries are rewritten.** Each build record in `cv/.build-state.json` has an `entries` map: a hash per CV entry of everything it's built from (its summary's front matter, contributions, metrics and facts, or its `cv_entry` and facts). `npm run status` lists the entries whose hash changed. On a rebuild, entries whose hash didn't change are copied unchanged, so variants don't change in git without a reason. `build` keeps an entry's old hash until that entry's text in the CV changes, so `build:all` can't hide entries that still need rewriting; when a listed entry needs no text change, build that CV alone with `npm run build -- <cv.md> --entries-reviewed` (refused with `--all`, which would also clear other CVs' lists).
7. **Gap report** (section 5).
8. **Checks.** `npm run reattach-src -- <cv.md>` (after saving a snapshot with `--save` before step 3; the snapshot restores source comments of text that was copied, while rewritten bullets take theirs from `selection.json`), then `npm run build -- <cv.md>` on the result (`check` checks every CV and takes no file). Report failures.
9. Show a diff. Never commit. For a job-specific CV, remind the user it's git-ignored and can be kept with `git add -f`.

## 3. Rules

| Allowed | Not allowed |
|---|---|
| Shorten and reword the bullets `select` chose, in its order (pins set the opening bullets) | Add a claim with no source, or reorder bullets by hand |
| Rewrite the headline and summary within the focus | Change numbers, dates, titles, company labels or contract suffixes |
| Reorder skills; leave out sections the profile excludes | Hide a job (every entry stays listed; less relevant ones shrink to `min_bullets_per_entry`) |
| Drop low-relevance bullets down to the minimum | Edit generated blocks by hand |
| Apply profile `overrides` | Change the master CV or any summary |

## 4. Overrides

Lasting changes for one variant go in the profile, by source id. Variant files are rebuilt and never edited by hand.

```yaml
overrides:
  syspro-saas-erp#4.1: { text: "Built core modules of a schema-driven React 19 runtime ...", pin: true }   # exact wording, always included
  velas-wallet#4.5: { drop: true }                                                                               # never include
  itjet-fintech#4.6: { pin: true, also: [itjet-fintech#4.15], text: "…" }                                        # one bullet citing two contributions about the same work
  general-motors-navigation#5: { pin: true }     # keep this older job's Stack line (pin keeps one, drop removes one, even the current job's)
entry_max_bullets:
  syspro-saas-erp: 7                             # per-entry limit instead of max_bullets_per_entry
```

- **Stack lines** (`<id>#5`) don't count toward the bullet limits. `selection.json` lists an entry's `stack` for the current job (ongoing and counting as experience, the rule `lint` uses) and for any entry whose Stack line is pinned; only those entries get one. A profile's `drop` on `<id>#5` removes the line even for the current job (lint then doesn't warn).
- **`also`** lists further sources the same bullet cites (`selection.json` gives the bullet `src: "<id>#4.6, <id>#4.15"`); a contribution named in `also` isn't selected again on its own. `validate` checks that each one resolves. Use it with `text` when the merged wording matters.
- **`entry_max_bullets`** sets a different limit for one entry (e.g. more bullets for the current job in one profile).
- Pinned bullets come first in the order `overrides` lists them, and an entry can't have more pins than its limit (`validate` checks it).

`lint` warns when a variant file was edited after its last build.

## 5. Gap report (`gap-report.md`)

```markdown
# Gap report: <profile or company-role>

Built: 2026-10-20 · Profile: react-native · Job ad: yes/no

## Strong evidence
- <emphasis area>: <entries and source ids that support it>

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| Recent Node.js backend | Itjet 2019-2020, SYSPRO mock backend | enrich a summary with /harvest, or add a confirmed fact with /add-experience if true |

## Job ad keywords (job ad only)
| Keyword | Found in CV | Honestly addable (source exists) | Real gap |

## Selection disagreements
- <bullets the agent would have chosen differently, and why>
```

The gap report never suggests claiming something that isn't true. "Add as a fact" always means "if it's true".

- **File names:** role variants carry the profile in the file name (`Kirill_Kohan_CV_React_Native.pdf`); a job-specific CV is named like the master (`Kirill_Kohan_CV.pdf`) inside its own folder, even when it starts from a profile.
- **Length:** `max_words` counts the rendered words of the default-market Markdown (comments and Markdown markers removed), the same count `lint` reports.

## 6. Output

| Kind | Folder | In git |
|---|---|---|
| Role variant | `cv/variants/<profile-id>/` | `cv.md` and `gap-report.md` committed; built files ignored |
| Job-specific CV | `cv/tailored/<company-role>/` (`<company-role>` lowercase-kebab, e.g. `example-corp-senior-rn`) | whole folder git-ignored |
