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
3. **Each project to write or rewrite** (replaces its placeholder, or its old text; leave every other project exactly as it is), in the structure of the April 2025 portfolio (`specs/outputs/portfolio.md` 4):
   ```markdown
   One paragraph, two to four sentences: what the product is, who uses it, its main features (sections 1 and 2). <!-- src: <id>#1 -->

   **Responsibilities**

   * One item per contribution: what you built, how and why, with its result or number when there is one; 1–3 sentences, longer than a CV bullet. <!-- src: <id>#4.N -->

   **Technologies and frameworks**

   React Native, TypeScript, … (the hands-on items of section 5). <!-- src: <id>#5 -->
   ```
   - The product paragraph comes first: `refresh` puts the screenshots right after it, as the old portfolio did.
   - **One page per project** with its screenshots (`specs/outputs/portfolio.md` 4): the product paragraph about 70 words; at most `portfolio_max_items` items (default 4) under *Responsibilities*, about 40 words each, most important first (contribution order, then `cv_emphasis`; the role and leadership go in as items); a short technologies line (the main hands-on items, not all of section 5); at most `checks.portfolio_max_project_words` (300) words in total (`portfolio check` warns).
   - **Sources:** every sentence and bullet ends with `<!-- src: … -->` from **this** project only.
   - **Numbers:** only from the source; a `doc:<id>` number only once "confirmed by user".
   - **Public:** use the project's `portfolio_label` (default `cv_client_label`), never a hidden client's name, a section 9 term (unless `allow_in: [portfolio]`), ticket ids or internal URLs; images and links come only from the generated block.
4. **Check.** Run `npm run portfolio -- check` (sources, confidentiality, secrets, spelling; it also records which summary state each project was written from) and fix every error. A project whose sources changed but needs no new text: `npm run portfolio -- check --projects-reviewed`. A real new word: add it to `facts/dictionary.txt` and say so.
5. **Report** per project (written, rewritten, unchanged), the diff and the next step: `npm run build:portfolio` (Word, PDF and previews for A4 and Letter, and a `.pages` copy), then look at the previews in `portfolio/preview/`.

## Never
- Write or change generated blocks, markers, images or links by hand.
- Add a claim without a source, a source from another project, or anything the summaries don't support.
- Mark material public or opt a project in: that is `/portfolio-material`, with the user.
