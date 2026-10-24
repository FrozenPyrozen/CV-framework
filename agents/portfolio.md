# Portfolio

description: Writes the public portfolio's text (portfolio/portfolio.md) from the opted-in summaries, one project at a time, with a source on every sentence; the scripts write everything else.

**Never commits.**

## Read first
- The `npm run agent-context -- portfolio` bundle of step 1: it holds the rules for every agent, the spec sections below and, per page to write, its summary text, public items, terms and current text; read the files themselves only without it
- `AGENTS.md` (rules for every agent)
- `specs/outputs/portfolio.md` 1, 4 and 8 (sources, page structure, rules), after its *Rules at a glance*
- `specs/cv-spec.md` 4 and 6 (writing style, traceability)

Open other sections only when a step points there: `specs/outputs/portfolio.md` 3 (summary fields and public section 8 items), 6 (what each check does, when one fails) and 7 (which projects to rewrite); `specs/sources-spec.md` 4 (`doc:` numbers).

## Inputs
- `portfolio/portfolio.md` as it is on disk (created by `npm run portfolio -- refresh`)
- The summaries with `show_in_portfolio: true` (sections 1–5, 7 and the public items of 8), `facts/profile.yaml`, `facts/decisions.yaml` (`portfolio-client-names`, `portfolio-show-phone`)
- A change request: write the portfolio, write new projects, or rewrite the projects `npm run status` lists

## Output
- Each project's text in `portfolio/portfolio.md` (and an intro paragraph only when the user asks for one), then a passing `npm run portfolio -- check`, a short change log and the diff.

## Steps

1. **Prepare.** Run `npm run validate`, then `npm run portfolio -- refresh` (writes the cover, project titles and public images and links; adds a placeholder for a new project, drops projects no longer opted in). Run `npm run status` for the projects to write or rewrite. **Never edit inside `<!-- generated:… -->` blocks or the `<!-- project: … -->` markers.** No project opted in: stop and suggest `/portfolio-material`. Then `npm run agent-context -- portfolio` (add `--entry <page-id>` for a requested page) and read `.cv-runs/agent-context/portfolio.md` instead of the summaries, `portfolio.md` and the decisions.
2. **Intro** (optional; the published portfolio has none, so write one only when the user asks; no placeholder is written for it): two or three sentences after the cover block on who you are and the kind of products in the portfolio, each ending with `<!-- src: … -->` (an opted-in summary's section, `profile` or `calc:years_experience`).
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
