# Tailor

description: Builds a role variant (cv/variants/<profile>/) or a job-specific CV (cv/tailored/<company-role>/) with a gap report; a script selects the bullets, the agent words them.

**Follows:** `specs/tailoring-spec.md` and `specs/cv-spec.md`. **Never commits.**

## Inputs
- A role profile (`--profile <id>`, `profiles/<id>.yaml`) and/or a job ad (`--jd <file or pasted text>`), optional `--market <id>` for a job-specific CV
- The master CV (preferred wording for each bullet, by source id)
- Summary digests, full summaries for entries you rewrite, `facts/`
- `cv/.build-state.json` (per-entry hashes of the last build)

## Output
- `cv.md` and `gap-report.md` in the CV folder; then `npm run build` produces the Word, PDF and previews.

## Steps

1. **Folder.**
   - Variant: `cv/variants/<profile-id>/`.
   - Job-specific CV: `cv/tailored/<company-role>/` (lowercase-kebab, e.g. `example-corp-senior-rn`). Save a pasted job ad as `job-description.md` there.
2. **Tags (job ad only).** Map the ad's requirements to tags from the config list and write `jd-tags.yaml` (`required`, `nice_to_have`, `new_tags_proposed`, plus `profile` when started from one and an optional job-fitting `headline`). Show it to the user, who may adjust it; pins or drops for this one ad go in its `overrides`. When no user is present (an acceptance replay), continue and say in the gap report that `jd-tags.yaml` is awaiting approval. New tags need approval before they go into `framework.config.yaml`.
3. **Selection (script).** `npm run select -- <cv-dir> --profile <id>` and/or `--tags jd-tags.yaml`. Read `selection.json`. **Don't change the selection.** If you disagree, say so in the gap report; the user changes the profile or `jd-tags.yaml`.
4. **Which entries to rewrite.**
   - New CV: all.
   - Rebuild: run `npm run status` and rewrite only the entries it lists under "entries to rewrite in variants", plus entries whose selection changed (compare the `src` ids in the existing `cv.md` with the new `selection.json`; the old selection file is overwritten). Copy everything else unchanged from the existing `cv.md`. If a listed entry needs no text change, say so and build with `--entries-reviewed`; otherwise the entry stays listed.
5. **Write `cv.md`** (if it doesn't exist yet, start from a copy of the master CV).
   - Run `npm run reattach-src -- <cv.md> --save` before editing.
   - For each entry, in selection order, write the selected bullets:
     - The master CV has a bullet with the same `src`: start from its wording (including the user's edits) and only shorten or re-emphasize it.
     - Otherwise: write it from the source, following `cv-spec.md`.
     - A profile override with `text`: use that text exactly.
     - **Stack lines:** the current job keeps its `* Stack: …` line. An older job keeps its Stack line only when `selection.json` lists it as the entry's `stack` (from the master CV, src `<id>#5`).
   - Keep every `src` comment and every `<!-- entry -->` marker. All entries stay listed, shrinking to the minimum when less relevant.
   - **Headline and summary paragraph:** the profile's `headline` (for a job ad, one fitting it goes in `jd-tags.yaml` `headline`; `refresh` writes the header); rewrite the summary around `summary_focus`, with a `src` per sentence.
   - **Skills:** `npm run refresh` orders them by `skills_order`; never by hand.
6. **Gap report.** Write `gap-report.md` in the format of `specs/tailoring-spec.md` 5:
   - strong evidence
   - weak or missing evidence, with honest suggestions only
   - job-ad keywords (found, honestly addable, real gaps)
   - selection disagreements
7. **Check and build.** `npm run reattach-src -- <cv.md>`, then `npm run build -- <cv.md>` (add `--market <id>` for a job-specific CV). Variants and tailored CVs must have **every** claim sourced: fix any `trace` error.
8. **Report.**
   - The diff and the gap report.
   - The `pdf-check` result and the preview paths.
   - Job-specific CVs only: remind the user the folder is git-ignored, and they can keep it with `git add -f`, record it with `/log-application`, or back it up with `npm run backup`.

## `/variants`
Run steps 3 to 6 for every file in `profiles/` (only changed entries are rewritten), and step 7's `reattach-src` and `npm run check`; then one `npm run build:all` builds them all (no per-variant build).

## Never
- Add claims, change numbers, dates, titles, client labels or contract labels, hide a job, or edit generated parts.
- Edit `cv/variants/*/cv.md` outside this agent; lasting variant changes go in the profile's `overrides`.
