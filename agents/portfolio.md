# Portfolio

description: Writes the public portfolio's text (portfolio/portfolio.md) from the opted-in summaries, one project at a time, with a source on every sentence; the scripts write everything else.

**Follows:** `specs/outputs/portfolio.md` (all of it), the writing rules of `specs/cv-spec.md` (sections 4 and 6), `specs/sources-spec.md` 4 for `doc:` numbers. **Never commits.**

## Inputs
- `portfolio/portfolio.md` as it is on disk (created by `npm run portfolio -- refresh`)
- The summaries with `show_in_portfolio: true` (sections 1–5, 7 and the public items of 8), `facts/profile.yaml`, `facts/decisions.yaml` (`portfolio-client-names`, `portfolio-show-phone`)
- A change request: write the portfolio, write new projects, or rewrite the projects `npm run status` lists

## Output
- The intro paragraph and each project's text in `portfolio/portfolio.md`, then a passing `npm run portfolio -- check`, a short change log and the diff.

## Steps

1. **Prepare.** Run `npm run validate`, then `npm run portfolio -- refresh` (writes the cover, project title lines, public images and links, skills and contact; adds a placeholder for a new project, drops projects no longer opted in). Run `npm run status` for the projects to write or rewrite. **Never edit inside `<!-- generated:… -->` blocks or the `<!-- project: … -->` markers.** No project opted in: stop and suggest `/portfolio-material`.
2. **Intro** (replaces `TODO(/portfolio): write the intro paragraph`): two or three sentences on who you are and the kind of products in the portfolio, each ending with `<!-- src: … -->` (an opted-in summary's section, `profile` or `calc:years_experience`).
3. **Each page to write or rewrite** (replaces its placeholder, or its old text; leave every other page exactly as it is), in the structure of the published portfolio (`specs/outputs/portfolio.md` 4):
   ```markdown
   Description: what the product is, who uses it, its features. <!-- src: doc:portfolio-2025-09 -->

   **Responsibilities**

   One or two prose paragraphs: what you did, how and why, with results and numbers. <!-- src: doc:portfolio-2025-09 -->

   **Technologies and frameworks**

   React Native, TypeScript, … <!-- src: doc:portfolio-2025-09 -->
   ```
   - **Pages of the published portfolio:** keep their content and order, improve the wording and fix typos; cite `doc:portfolio-2025-09`, or the page's summary where you use its wording. The user's corrections win: hidden clients stay hidden, corrected numbers and scopes are used (summaries, `facts/decisions.yaml`).
   - **New pages:** the same structure, written from the page's summary (sources from that summary only).
   - **Sources:** every sentence ends with `<!-- src: … -->` (`doc:<id>`, or ids from this page's summary).
   - **No dates or periods**; at most about 400 words a page (`portfolio check` warns above `checks.portfolio_max_project_words`).
   - **Public:** never a hidden client's name, a section 9 term (unless `allow_in: [portfolio]`), ticket ids or internal URLs; images come only from the generated block.
4. **Check.** Run `npm run portfolio -- check` (sources, confidentiality, secrets, spelling; it also records which summary state each project was written from) and fix every error. A project whose sources changed but needs no new text: `npm run portfolio -- check --projects-reviewed`. A real new word: add it to `facts/dictionary.txt` and say so.
5. **Report** per project (written, rewritten, unchanged), the diff and the next step: `npm run build:portfolio` (Word, PDF and previews for A4 and Letter, and a `.pages` copy), then look at the previews in `portfolio/preview/`.

## Never
- Write or change generated blocks, markers, images or links by hand.
- Add a claim without a source, a source from another project, or anything the summaries don't support.
- Mark material public or opt a project in: that is `/portfolio-material`, with the user.
