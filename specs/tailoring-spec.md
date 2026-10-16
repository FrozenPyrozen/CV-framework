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

## 2. Steps

1. **Tags.** For a profile, take its tags. For a job ad, map its requirements to tags from the config tag list, propose new tags for anything missing, and save `jd-tags.yaml` for the user to adjust. With both, the job ad's tags add to the profile's.
   `jd-tags.yaml` format:
   ```yaml
   required: [react-native, typescript, testing]     # must-have requirements, weight 3
   nice_to_have: [graphql, aws]                       # weight 1
   new_tags_proposed: [kotlin-multiplatform]          # not in the config list yet; need approval
   profile: react-native                              # optional: the role profile it starts from (--profile)
   headline: Senior React Native Engineer (Healthcare)   # optional: a headline fitting the job ad
   ```
2. **Selection (script).** `npm run select -- <cv-dir> --profile <id>` (or `--tags jd-tags.yaml`) scores every contribution and fact by its tags (2 × emphasize, 1 × summary focus, −2 × de-emphasize, 3 × job-ad required, 1 × job-ad nice-to-have; pinned bullets first in the order the profile's `overrides` list them, ties keep the summary's order), applies limits and overrides, and writes `selection.json`: which bullets each entry gets, in which order. **The agent doesn't change the selection.** If it disagrees, it says so in the gap report, and the user changes the profile or `jd-tags.yaml`.
3. **Wording (agent).** For each selected bullet:
   - If the master CV has a bullet with the same source id, start from its wording (including the user's manual edits) and only shorten or re-emphasize it.
   - Otherwise write it fresh from the source, following `cv-spec.md`.
   - Keep its `src` comment.
4. **Headline and summary.** Use the profile's `headline`, or for a job ad one fitting it, written to `jd-tags.yaml` `headline` (the header is generated, so `refresh` reads it from there). Rewrite the summary paragraph around `summary_focus`, with a `src` comment on every sentence.
5. **Skills.** Reordered by `skills_order` through the generated `skills` block (not by hand).
6. **Only changed entries are rewritten.** Each build record in `cv/.build-state.json` has an `entries` map: a hash per CV entry of everything it's built from (its summary's front matter, contributions, metrics and facts, or its `cv_entry` and facts). `npm run status` lists the entries whose hash changed. On a rebuild, entries whose hash didn't change are copied unchanged, so variants don't change in git without a reason. `build` keeps the old hashes while the CV Markdown is unchanged, so `build:all` can't hide entries that still need rewriting; when the listed entries need no text change, build with `--entries-reviewed`.
7. **Checks.** `npm run reattach-src -- <cv.md>` (after saving a snapshot with `--save` before step 3), then `npm run build` on the result. Report failures.
8. **Gap report** (section 5).
9. Show a diff. Never commit. For a job-specific CV, remind the user it's git-ignored and can be kept with `git add -f`.

## 3. Rules

| Allowed | Not allowed |
|---|---|
| Select, reorder, shorten and reword bullets | Add a claim with no source |
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
  general-motors-navigation#5: { pin: true }     # keep this older job's Stack line (only pin is allowed for #5)
entry_max_bullets:
  syspro-saas-erp: 7                             # per-entry limit instead of max_bullets_per_entry
```

- **Stack lines** (`<id>#5`) don't count toward the bullet limits. The current job always keeps its Stack line; an older job keeps it only when pinned, and `selection.json` then lists it as the entry's `stack`.
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

## 6. Output

| Kind | Folder | In git |
|---|---|---|
| Role variant | `cv/variants/<profile-id>/` | `cv.md` and `gap-report.md` committed; built files ignored |
| Job-specific CV | `cv/tailored/<company-role>/` (`<company-role>` lowercase-kebab, e.g. `example-corp-senior-rn`) | whole folder git-ignored |
