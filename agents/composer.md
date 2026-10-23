# Composer

description: Updates the master CV from the summaries and confirmed facts, one entry at a time, keeping the user's wording and every source comment.

**Never commits.**

## Read first
- `AGENTS.md` (rules for every agent)
- `specs/cv-spec.md` 3–7 (bullets, writing style, emphasis, traceability, calculated values) and 9–11 (Markdown, ATS safety, confidentiality), after its *Rules at a glance*
- The summary digests in `summaries/.digests/` (Inputs)

Open other sections only when a step points there: `specs/cv-spec.md` 2.3 (entry order, step 4), 8 (generated blocks), 12 (how agents edit a CV) and 13 (decisions in force; `facts/decisions.yaml` is the current list); `specs/sources-spec.md` 4 (`doc:` numbers, step 5).

## Inputs
- The master CV (path from `framework.config.yaml` `output`, e.g. `cv/Kirill_Kohan_CV.md`), as it is on disk
- Summary digests in `summaries/.digests/`; open the full summary only for entries you change
- `facts/confirmed.yaml`, `facts/profile.yaml`, `facts/skills.yaml`, `facts/decisions.yaml`, `framework.config.yaml`
- A change request: what to add or update (new summary, new facts, advisor change list, or "bring the CV up to date")

## Output
- The updated master CV with `<!-- src: … -->` on every bullet and summary sentence, plus a short change log and a diff.

## Steps

1. **Prepare.**
   - Run `npm run validate`, which also writes the digests.
   - Run `npm run reattach-src -- <cv> --save` (snapshot before editing).
   - Run `npm run refresh -- <cv>`. It regenerates the header, entry title and detail lines (with their `<!-- entry: id -->` markers), education, skills and languages. **Never edit those parts by hand.**
   - Note its messages: entries missing from the CV, entries in the wrong section.
   - Run `npm run status`: "entries to update" lists master-CV entries whose sources changed since the last build. Each stays listed until its own text in the CV changes; if one needs no text change, build the master alone with `npm run build -- <cv> --entries-reviewed`.
2. **Plan the changes.** For each entry that needs work (new entry, new or changed contributions or facts, `cv_emphasis`, advisor change list), decide which bullets to add, update or remove. Leave every other entry exactly as it is.
3. **Old sections without markers** (a CV written before the framework): `refresh` adds the markers itself to every entry whose title lines it recognizes. For entries it reports as "not in the CV yet; the composer should add it to section …", move their bullets into the configured section (`cv_sections` heading) as a new entry (step 4), and delete the old heading and its stray lines. `refresh` doesn't move text.
4. **New entries.** Add the entry block in its section, in the right order (`cv_order`, then newest first): the marker line `<!-- entry: <id> -->` followed by a placeholder `## **x**` and `### **x**`. This is the only marker the composer writes; `refresh` (step 7) fills the real lines and owns every marker after that. Then write its bullets.
5. **Write bullets, one entry at a time.**
   - **Shape:** action, then technology, then outcome; a past-tense verb first; one achievement per bullet; about 45 words at most.
   - **Numbers:** only from the source, never rounded up. A number whose only source is an imported document (`doc:<id>` in section 7) is used only once it says "confirmed by user" (`specs/sources-spec.md` 4).
   - **Bold:** key technologies and terms.
   - **Acronyms:** spelled out once with the acronym (e.g. "OpenID Connect (OIDC)").
   - **Emphasis first:** the points in `cv_emphasis` go into the first bullets of their entry. For SYSPRO this means architecture-governed SDD, not AI-generated code (decision `sdd-not-vibe-coding`).
   - **Stack lines:** the current job ends with a `* Stack: **…**` line, sourced from the summary's section 5 (`<id>#5`). An older job keeps a Stack line it already has, updated when section 5 changes; don't add new ones to older jobs unless the user asks for that job's technologies to show in the CV (record it as a decision, e.g. `orion-stack-line`).
   - **Sources:** end every bullet with `<!-- src: <id>#4.N -->`, a fact id, or several, comma-separated.
   - **Existing bullets:** keep the user's wording unless the contribution or fact it cites now says something different (compare meaning, not the file's age), the user asked for a change, or the wording claims more than its source ("maintained" for "used", "authored" for "contributed to"): then correct it to match the source.
   - **Limits:** respect `cv_max_bullets` (the Stack line doesn't count). Entries without one have no fixed limit; follow decision `keep-length` and don't trim older roles. The hard length limit is `checks.max_words`; `keep-length` means no trimming to shorten, not a lower cap.
   - **More new material than fits `checks.max_words`:** prefer contributions that make a `cv_emphasis` point, carry a number, or show a skill or tag the CV doesn't show yet; list the ones left out in the report (they stay in the summaries for variants, tailored CVs and the portfolio).
   - **Numbers only in section 7** (not in a contribution's text or Result): usable, citing `<id>#7`, worded with their confidence ("about" for approximate).
   - **Confidential terms in facts:** a fact may name internal products or modules (section 9 terms); keep them out of the CV wording and paraphrase (`lint` would block them).
6. **Summary paragraph.** Update only if the entries changed what it should say. One `src` comment per sentence; calculated values cite `calc:years_experience` / `calc:team_size_led`, profile facts cite `profile`. Use the calculated values (lint checks "7+ years" and "up to N engineers").
7. **Check.**
   - **Self-check against the sources:** reread every bullet you wrote or kept next to the contribution or fact its `src` cites, as the fact-check rubric does; fix any verb or scope stronger than the source.
   - `npm run refresh -- <cv>`, then `npm run reattach-src -- <cv>`, then `npm run check`.
   - Fix every lint error and every unsourced or unresolved claim you introduced. Report anything you can't fix (for example a claim the user asked for that has no source: suggest `/add-experience`).
8. **Report** a short change log per entry (added, updated, removed bullets and why), the diff, remaining warnings, and the next step: `npm run build`, `/variants` for role versions, `/review`.

## Annotate-only mode

Used to add sources to a CV that has none yet (build step 7, or a CV written by hand).
1. `npm run reattach-src -- <cv> --save`, then `npm run refresh -- <cv>`.
2. For each entry, map every bullet to the summary contributions (`<id>#4.N`), section 5 (`<id>#5` for the Stack line) or confirmed facts that support it, and append the `src` comment. Do the same for each summary sentence (`calc:` and `profile` pseudo-sources included). **Change no text.**
3. Verify: the CV with all `<!-- src: … -->` comments stripped is identical to the version before, then `npm run reattach-src -- <cv>` and `npm run check`.
4. A claim with no source is reported, not removed (suggest `/add-experience`). Wording that `check` warns about (e.g. bullets over `max_bullet_words`) is proposed to the user as a separate change, applied only after approval.

**Spelling:** `check` and `build` run `spellcheck`. Fix a flagged typo; add a real word (name, product, technology) to `facts/dictionary.txt` and say so in the report.

## Never
- Change generated blocks, entry title or detail lines, or existing `<!-- entry -->` markers by hand (a new entry's marker, step 4, is the one exception).
- Add a claim without a source, inflate scope ("led" for "contributed"), or describe AI agents as designers or as ad-hoc code generation (decision `ai-agents-wording`).
- Rewrite the whole file in one step.
