# Portfolio Spec

Status: v1 (built, plan 9e P1–P6; the `portfolio-classic` template approved 2026-10-23) · Applies to: `portfolio/`, written by the portfolio agent (`/portfolio`), built by `npm run build:portfolio`

## Rules at a glance

The essentials, each stated in full in the section named. Agents that only need these can stop here.

- The portfolio is public: projects are opted in (`show_in_portfolio`), and only section 8 items with `public: yes, confirmed by user <date>` reach it (section 3); when in doubt, leave it out and ask (section 8).
- Every sentence carries a source comment; nothing the sources don't support; `doc:<id>` numbers only once confirmed (section 1).
- Each page: a generated title and screenshots; the agent writes the description, **Responsibilities** (prose) and **Technologies and frameworks** (section 4).
- No dates or periods; a page fits one page with its screenshots, and `portfolio check` warns above `checks.portfolio_max_project_words` (section 4).
- Generated blocks and `<!-- project: … -->` markers are written by `npm run portfolio -- refresh`, never by hand (section 4).
- Hidden clients stay hidden; a section 9 term appears only with `allow_in: [portfolio]`; no phone number without decision `portfolio-show-phone` (sections 1 and 6).
- Only stale projects are rewritten; the rest keep their wording (section 7).
- The portfolio never says more than the summaries (section 8).

The portfolio is a second **output** of the same sources as the CV (plan section 2, "Sources and outputs are separate"): a multi-page **document** with a cover and a page or more per project, shared through a **public link**. It is built like the CV: Markdown first, then Word through an imported template, then PDF, with the same checks. Its content and look come from the published portfolio, `doc:portfolio-2025-09` (imported 2026-10-23), and the April 2025 Pages file, `doc:portfolio-2025-04` (section 5a).

## 1. Sources

| Portfolio part | Source |
|---|---|
| Cover: links line, title, name (as on the published portfolio) | the links line: `framework.config.yaml` `portfolio.cover_links` (labels of `facts/profile.yaml` `contacts.links`, shown as their addresses; `validate` refuses an unknown label); the title "My Portfolio"; the name: `portfolio.name` (default the profile name). Because the link is public, the **phone number is left out** unless decision `portfolio-show-phone` exists in `facts/decisions.yaml`. No headline or location. An optional intro paragraph written by the agent from the summaries (sourced like the CV summary) |
| Project pages | summaries with `show_in_portfolio: true` (section 3): section 1 (what the product is), 2 (main features), 3 (role), 4 (contributions), 5 (technologies), 7 (numbers), 8 (images, links, demo notes) |

Every sentence carries a source comment (`<!-- src: <id>#<section> -->`), as in the CV (`cv-spec.md` 6). Nothing is written that the sources don't support. Numbers follow the CV rules, including `doc:<id>` numbers only once confirmed (`sources-spec.md` 4).

## 2. Files

```
portfolio/
├── portfolio.md                 # the source Markdown (agent-written parts + generated blocks)
├── assets/<summary-id>/         # images: screenshots, diagrams, photos (PNG, JPEG, SVG); in git
├── <Name>_Portfolio_<SIZE>.docx # built, one per page size: A4, LETTER (git-ignored)
├── <Name>_Portfolio_<SIZE>.pdf  # one PDF per page size (git-ignored)
├── <Name>_Portfolio.pages       # built from the A4 file with Pages when available (git-ignored)
└── pdf-check-<size>.md, preview/<size>/   # PDF checks and page previews (git-ignored)
```

## 3. Summary fields (in `schemas/summary.schema.json` since phase P1)

| Field | Default | Meaning |
|---|---|---|
| `show_in_portfolio` | `false` | the portfolio is public, so projects are **opted in**, never included by default |
| `portfolio_order` | newest first | position among the projects |
| `portfolio_title` | the role | the project title: the product and its main technologies, as on the published portfolio (`doc:portfolio-2025-09`) |
| `portfolio_projects` | none | several pages from one job (`[{ id, title, label? }]`), e.g. one per client of a services company; a section 8 item goes to a page with `project: <id>` |
| `portfolio_label` | `cv_client_label` | the public name of the client or product; must hide what the CV hides |
| `portfolio_max_items` | 4 | limits nothing now (Responsibilities are prose); a change marks the page for rewriting |

Section 8 of a summary (Portfolio material) gets a structured list, so the agent knows exactly what is public:

```markdown
## 8. Portfolio material

- image: assets/velas-wallet/staking.png
  caption: Staking list after the server-side filtering rework
  public: yes, confirmed by user 2026-10-22
- link: https://example.org/app
  label: App store page
  public: yes, confirmed by user 2026-10-22
- demo: a 2-minute screen recording exists on request
  public: no
```

Only items with `public: yes, confirmed by user <date>` reach the portfolio. A screenshot is public only after the user confirms it shows no customer data, internal names or internal URLs.

- Image paths are relative to `portfolio/`: a file in `portfolio/assets/<summary-id>/`, or an image of an imported document in `../sources/media/<doc-id>/` (`sources-spec.md` 1). `build:portfolio` converts formats a PDF can't take (e.g. `.tif` from Pages) to PNG.
- Free text already in section 8 (or `TODO (needs user input)`) stays valid as notes; only the `- image:`, `- link:` and `- demo:` items are read. `validate` checks the items' format and that each image exists.
- Section 8 is filled with the advisor (`/portfolio-material`, plan 9e P1), which asks per item whether it is public.

## 4. Structure of `portfolio.md`

The structure of the **published portfolio** (`doc:portfolio-2025-09`, the user's choice on 2026-10-23: "keep the old portfolio's structure"). `npm run portfolio -- refresh` writes the generated parts (`<!-- generated:… -->`) and the page markers; the portfolio agent (`agents/portfolio.md`, `/portfolio`) writes the rest, never inside a generated block.

1. **Cover** (generated `portfolio-cover`, its own page): the links line (`framework.config.yaml` `portfolio.cover_links`, shown as their addresses), "My Portfolio" and the name (the profile name, as on the CV; `portfolio.name` overrides it). No headline, location or phone. An intro paragraph is optional; the published portfolio has none.
2. **Pages**, one per opted-in summary or per entry of its `portfolio_projects`, in `portfolio_order` (pages of one summary in their listed order), each starting with `<!-- project: <id> -->`:
   - the title (generated `project-<id>`): the product, the client where it may be named (or "under NDA"), and the main technologies, as on the published portfolio (`portfolio_title` or the page's title); no separate client, role or date line;
   - the agent's **description** (what the product is, who uses it, its features);
   - the screenshots (generated `media-<id>`, right after the description, in rows): only the section 8 items marked public, without printed captions (the caption is the image's description, its alt text);
   - **Responsibilities** (agent): one or two prose paragraphs, as on the published portfolio;
   - **Technologies and frameworks** (agent): a comma-separated list.
   **No dates or periods anywhere**; the CV carries the dates. **Length:** each page fits one page with its screenshots (up to about 400 words; SYSPRO two pages, decision `syspro-portfolio-two-pages`); `portfolio check` warns above `checks.portfolio_max_project_words`.
   **Sources:** text kept from the published portfolio cites `doc:portfolio-2025-09`; text from a summary cites that page's summary. The user's corrections (summaries, decisions) win over the old text: hidden clients stay hidden, corrected numbers and scopes are used.
   A newly opted-in page gets a placeholder until `/portfolio` writes it; a page no longer opted in is dropped.
3. No skills or contact pages (the published portfolio has none).

## 5. Formats and page sizes

- **Markdown** is the source and is readable on its own (images as relative links).
- **Word (`.docx`)** from a portfolio template (`templates/portfolio-<name>/`, style map `kind: portfolio`): imported with `/import-template` from a flowing Pages or Word file, or generated when the original is a free-form layout, as `portfolio-classic` is (`npm run portfolio-template`, section 5a). Its paragraph types: `cover_top` (the empty banner row above the links line), `cover_title`, `cover_name`, `cover_contact` (the banner), `headline`, `intro`, `project_title` (each project starts a new page; the technologies in its parentheses stay on one line), `project_meta`, `section_label`, `body`, `list_item`, `image`, `caption`, `section_heading` (skills starts a new page, contact doesn't), `skills_line`, `contact_line` (`templates.md` 2). One Word file per size.
- **Images:** PNG and JPEG are embedded as they are; other formats (TIFF from Pages, GIF, WebP) are converted to PNG (macOS `sips`). Consecutive screenshots share **one row**, as on the published portfolio: at most 4, and a row with a landscape screenshot (wider than 1.2:1) stays at least 1.75 inches tall at the content width, else a new row starts; scaled to the same height, 0.1 inch apart, the row fitting the content width and at most 25% of the content height (page minus margins); captions only as alt text; never shown above 150 dpi: a small screenshot is printed smaller rather than blurry (the build warns when one is under 1.5 inches on its longer side).
- **Page sizes:** a portfolio template lists the sizes it supports in its `fixes.yaml`: `sizes: { a4: { page_margins: {…} }, letter: { page_margins: {…} } }`, extending the existing `page_margins` fix (`templates.md`). The renderer sets the page size and margins per size. Default: A4 and Letter (`npm run build:portfolio -- --size a4|letter|all`).
- **PDF:** one per size, exported through the PDF exporters in order (Pages, Word, LibreOffice; `docs/scripts.md`).
- **Pages (`.pages`):** saved from the A4 Word file through Pages when it is installed, for editing by hand. A hand edit is never the source: changes go back into the summaries or `portfolio.md`.

## 5a. Reference layout (the published portfolio, `doc:portfolio-2025-09`, and its Pages file, `doc:portfolio-2025-04`)

The current portfolio (Pages, April 2025, 16 A4 pages) is the visual reference for the first template, `templates/portfolio-classic/`. Its content is a source (`sources/`, imported 2026-10-22); its layout is recorded here because the Pages file is a **free-form page layout** (88 positioned text boxes and floating images, no flowing paragraphs), which the paragraph-based template importer (`templates.md`) can't take over directly. The template is therefore rebuilt as a flowing Word document with the same look:

| Part | Look |
|---|---|
| Page | A4 portrait |
| Cover | a coral-red banner (`#F46B75`) across the top of the page, rows separated by thin white rules: an empty top row (`cover_top`), the links line (DIN Condensed, capitals, left), the title "My Portfolio" (Superclarendon Bold, 42 pt, white, centered) and the name (Superclarendon, white); after the banner an unshaded paragraph, so the fill doesn't run on |
| Project title | Superclarendon Bold (Rockwell Bold in the template), about 16 pt, teal (`#077482`), centered, one project per page |
| Intro and body | Charter Roman, 14 pt (some 12 pt), left-aligned |
| Images | a row of phone screenshots or one or two wide screenshots under the intro, centered |
| Section labels | "Responsibilities", "Technologies and frameworks": Avenir Next Medium, teal (`#077482`) |

In `portfolio-classic` the Superclarendon titles become **Rockwell Bold**, the closest slab serif: Pages doesn't apply Superclarendon to text that comes from a Word file under any name (tested 2026-10-23, it falls back to Times), while Rockwell, Charter, Avenir Next and DIN Condensed are kept and embedded. `doctor` checks that the template's fonts are installed.

The fonts are macOS system fonts: the PDF is exported through Pages (first in `pdf_exporters`), which embeds them; Word on Windows and LibreOffice would substitute them, so `pdf-check`'s embedded-font check matters here. Content issues found in that portfolio (client names the CV hides, informal wording, typos) are handled through `/import-docs`, never copied.

## 6. Checks

`npm run portfolio -- check` runs the text and image checks; `npm run build:portfolio` runs it first, then the output checks, and fails on any error; `/review --portfolio` reviews the result (plan 9e P3, P4, P6).

| Check | Where | What |
|---|---|---|
| sources | `portfolio check` | every sentence and bullet the agent wrote has a source that resolves; a project cites only itself; the intro cites opted-in projects, `profile` or `calc:`; `doc:<id>` is accepted anywhere when the document exists in `sources/index.yaml`; no placeholder left |
| confidentiality | `portfolio check` | the CV's lint rules (every summary's section 9 terms, hidden client names in any case, ticket prefixes, internal addresses, secrets, URLs other than profile links and public link items), with one difference: a term's `allow_in` job ids and `summary` **don't apply** here; only `allow_in: [portfolio]` lets a term appear in the portfolio (`work-summary-spec.md` 3.1) |
| length | `portfolio check` (warning) | a page's text over `checks.portfolio_max_project_words` words |
| generated parts | `portfolio check` (warning), `status` | the generated parts match what `refresh` writes now |
| `spellcheck` | `portfolio check`, `spellcheck` | dictionary spelling (US English) with `facts/dictionary.txt`; unknown words fail until fixed or added. The same check runs on the CV |
| images | `validate`, `portfolio check`, the renderer | every image exists and is public-confirmed in its summary's section 8 (`validate`); an image in `portfolio.md` that isn't a public item of its own project is an error (`portfolio check`); a file in `assets/` no summary lists is a warning; the renderer never shows an image above 150 dpi and warns when one ends up under 1.5 inches (a pixel minimum like "1200 px wide" doesn't fit phone screenshots) |
| `pdf-check` | `build:portfolio` | per size: every Markdown word appears in the PDF (image lines excepted), the template's fonts are embedded, no garbled text, no phone number unless decision `portfolio-show-phone`, the page count is within `checks.portfolio_max_pages`; written to `pdf-check-<size>.md` |
| `preview` | `build:portfolio` | page images per size in `preview/<size>/`, to look at before sharing; the template is approved (`approved: true`) only after the user has looked at them |
| reviewers | `/review --portfolio` | proofreading, fact-check, confidentiality (public rules, screenshots) and layout (both sizes), each rubric's *Portfolio mode*; reports follow `review-report-spec.md` with `cv: portfolio/portfolio.md`, `market: null`; `validate` refuses other rubrics for the portfolio |

## 7. Updates

- `npm run status` lists the portfolio: projects to write (placeholders), projects to rewrite (what the project was written from changed: summary sections 1–5 and 7, its public section 8 items, role, label, title or `portfolio_max_items`; recorded by each passing `portfolio check`), generated parts out of date (`profile.yaml` links, `portfolio.cover_links`/`portfolio.name`, images or titles changed: `npm run portfolio -- refresh`), changes not yet checked, and Word, Pages and PDF files older than `portfolio.md` (`npm run build:portfolio`).
- A project whose sources changed but whose text still fits: `npm run portfolio -- check --projects-reviewed`.
- `/portfolio` rewrites only the stale projects and keeps the wording of the rest (`cv-spec.md` 12, same rule).
- A new project appears only after `show_in_portfolio: true` is set with the user.
- **Coverage (2026-10-23):** every page of the published portfolio (`doc:portfolio-2025-09`) stays, in its order: the GM car management app, the HERE navigation app, the car navigation PoC, Velas, the Jira plugin, the clinical trial app, OMO, the dosimeter app, and the Itjet clients Aspiration (signup and banking web app), RegiStart, Fused, Wink, Golfuture and Oroscopo; SYSPRO is added first. The Admasters wasn't in it and stays out. Its screenshots are reused (public, as already published).

## 8. Rules

- Public by default: when in doubt, leave it out and ask.
- No numbers, names or images that the user hasn't confirmed as public.
- The portfolio never says more than the summaries; it says it at more length than the CV.
- US English (`framework.config.yaml` `spelling`).
