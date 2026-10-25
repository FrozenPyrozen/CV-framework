# Tailor

description: Builds a role variant (cv/variants/<profile>/) or a job-specific CV (cv/tailored/<company-role>/) with a gap report; a script selects the bullets, the agent words them.

**Never commits.**

## Read first
- The `npm run agent-context -- tailor` bundle of step 3: it holds the rules for every agent and the spec sections below, plus the entries to rewrite; read the files themselves only without it
- `AGENTS.md` (rules for every agent)
- `specs/tailoring-spec.md` 2–5 (steps, rules, overrides, gap report), after its *Rules at a glance*
- `specs/cv-spec.md` 3–6 (bullets, writing style, emphasis, traceability), after its *Rules at a glance*

Open other sections only when a step points there: `specs/tailoring-spec.md` 1.1 (role profile fields) and 6 (output folders); `specs/cv-spec.md` 7 (calculated values in the summary paragraph), 9–11 (Markdown, ATS safety, confidentiality, when `lint` reports them) and 14 (markets, `--market`).

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
2. **Tags (job ad only).** Without `--profile`, propose the role profile closest to the ad and confirm it with the user (it carries the emphasis pins). Map the ad's requirements to `required` and its duties and nice-to-haves to `nice_to_have` (`specs/tailoring-spec.md` 2, step 1), using tags from the config list, and write `jd-tags.yaml` (`required`, `nice_to_have`, `new_tags_proposed`, plus the `profile` it starts from, which is required, and an optional job-fitting `headline`). Show it to the user, who may adjust it; pins or drops for this one ad go in its `overrides`. When no user is present (an acceptance replay), continue and say in the gap report that `jd-tags.yaml` is awaiting approval. New tags need approval before they go into `framework.config.yaml`.
3. **Selection (script).** `npm run select -- <cv-dir> --profile <id>` and/or `--tags jd-tags.yaml`. **Don't change the selection.** If you disagree, say so in the gap report; the user changes the profile or `jd-tags.yaml`. Then run `npm run agent-context -- tailor <cv-dir>` and read `.cv-runs/agent-context/tailor-<folder>.md` instead of `selection.json`, the role profile, digests, facts, decisions and spec sections: the selection, and per entry to rewrite its lines in this CV and in the master CV (numbered, with `src` comments), the selected contributions, sections 5, 7 and 9, confirmed facts and open items, plus the decisions that fit.
4. **Which entries to rewrite.**
   - New CV: all.
   - Rebuild: the bundle's *Entries in scope* already applies this rule (`--all` for every entry); by hand, run `npm run status` and rewrite only the entries it lists under "entries to rewrite in variants" (or "in this tailored CV"), plus entries whose selection changed (compare the `src` ids in the existing `cv.md` with the new `selection.json`: `#5` counts only on a Stack line, and ids the master bullet of a selected contribution also cites may stay; the old selection file is overwritten). Copy everything else unchanged from the existing `cv.md`. If a listed entry needs no text change, say so and build that CV alone with `npm run build -- <cv.md> --entries-reviewed` (not with `build:all`); otherwise the entry stays listed.
5. **Write `cv.md`** (if it doesn't exist yet, start from a copy of the master CV).
   - Run `npm run reattach-src -- <cv.md> --save` before editing.
   - For each entry, in selection order, write the selected bullets:
     - The master CV has a bullet with the same `src`: start from its wording (including the user's edits) and only shorten or re-emphasize it. If that bullet also cites other sources, keep their parts when they're facts about the same work or `cv_emphasis` points (`specs/tailoring-spec.md` 2, step 3).
     - Otherwise: write it from the source, following `cv-spec.md`.
     - A profile override with `text`: use that text exactly.
     - A bullet whose `src` lists several ids (an override's `also`) is one bullet citing all of them: keep the whole list in its `src` comment.
     - **Stack lines:** an entry gets its `* Stack: …` line exactly when `selection.json` lists it as the entry's `stack` (the current job always, older jobs when pinned; wording from the master CV, src `<id>#5`).
     - A master bullet that merges a source also selected as its own bullet here: give that source its own bullet and leave it out of the merged one (`specs/tailoring-spec.md` 2, step 3). Re-emphasizing may add a detail from the same source only.
   - Keep every `src` comment and every `<!-- entry -->` marker. All entries stay listed, shrinking to the minimum when less relevant.
   - **Headline and summary paragraph:** the profile's `headline` (for a job ad, one fitting it goes in `jd-tags.yaml` `headline`; `refresh` writes the header); rewrite the summary around `summary_focus`, with a `src` per sentence (any contribution or fact of an entry shown in the CV may be cited).
   - **Over `max_words`:** shorten wording first; if still over, propose drops in the gap report and let the user decide (`specs/tailoring-spec.md` 2, step 4).
   - **Skills:** `npm run refresh` orders them by `skills_order`; never by hand.
6. **Gap report.** Write `gap-report.md` in the format of `specs/tailoring-spec.md` 5:
   - strong evidence
   - weak or missing evidence, with honest suggestions only
   - job-ad keywords (found, honestly addable, real gaps)
   - selection disagreements
7. **Check and build.** `npm run reattach-src -- <cv.md>`, then `npm run build -- <cv.md>` (`check` checks every CV and takes no file) (add `--market <id>` for a job-specific CV). Variants and tailored CVs must have **every** claim sourced: fix any `trace` error.
8. **Report.**
   - The diff and the gap report.
   - The `pdf-check` result and the preview paths.
   - Job-specific CVs only: remind the user the folder is git-ignored, and they can keep it with `git add -f`, record it with `/log-application`, or back it up with `npm run backup`.

## `/variants`
Run steps 3 to 6 for every file in `profiles/` (only changed entries are rewritten), and step 7's `reattach-src` and `npm run check` (expect lint's "edited by hand since its last build" warning for each rewritten variant until the build); then one `npm run build:all` builds them all (no per-variant build, except `--entries-reviewed` builds above).

**Spelling:** `check` and `build` run `spellcheck`. Fix a flagged typo; add a real word (name, product, technology) to `facts/dictionary.txt` and say so in the report.

## Never
- Add claims, change numbers, dates, titles, client labels or contract labels, hide a job, or edit generated parts.
- Edit `cv/variants/*/cv.md` outside this agent; lasting variant changes go in the profile's `overrides`.
