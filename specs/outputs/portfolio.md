# Portfolio Spec

Status: v1 (built, plan 9e P1–P6; the `portfolio-classic` template awaits approval from the first real previews) · Applies to: `portfolio/`, written by the portfolio agent (`/portfolio`), built by `npm run build:portfolio`

The portfolio is a second **output** of the same sources as the CV (plan section 2, "Sources and outputs are separate"): a multi-page **document** with a cover and a page or more per project, shared through a **public link**. It is built like the CV: Markdown first, then Word through an imported template, then PDF, with the same checks. Building starts once the user provides the current portfolio as Pages or Word and PDF (plan 9e, phase P2).

## 1. Sources

| Portfolio part | Source |
|---|---|
| Cover: title, name, headline, contacts, portfolio intro | `facts/profile.yaml` and the default market's header rules (`markets/*.yaml`, `cv-spec.md` 14), without the location line and without a profile link labeled "Portfolio" (the portfolio doesn't link to itself); one intro paragraph written by the agent from the summaries (sourced like the CV summary). Because the link is public, the **phone number is left out** unless decision `portfolio-show-phone` exists in `facts/decisions.yaml` |
| Project pages | summaries with `show_in_portfolio: true` (section 3): section 1 (what the product is), 2 (main features), 3 (role), 4 (contributions), 5 (technologies), 7 (numbers), 8 (images, links, demo notes) |
| Skills overview | `facts/skills.yaml` (generated block, like the CV's SKILLS) |
| Contacts page | `facts/profile.yaml` |

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
| `portfolio_title` | the role | the project title: the product and its main technologies, as in the April 2025 portfolio |
| `portfolio_projects` | none | several pages from one job (`[{ id, title, label? }]`), e.g. one per client of a services company; a section 8 item goes to a page with `project: <id>` |
| `portfolio_label` | `cv_client_label` | the public name of the client or product; must hide what the CV hides |
| `portfolio_max_items` | 4 | Responsibilities items on the project page |

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

`npm run portfolio -- refresh` writes the generated parts (`<!-- generated:… -->`) and the project markers; the portfolio agent (`agents/portfolio.md`, `/portfolio`) writes the rest, never inside a generated block.

1. **Cover** (generated `portfolio-cover`): "My Portfolio", name, headline, contacts (section 1). Then the **intro** (agent): two or three sourced sentences.
2. **Projects**, one page per opted-in summary or per entry of its `portfolio_projects`, in `portfolio_order` (then newest first; pages of one summary in their listed order), each starting with `<!-- project: <id> -->` (`<summary-id>` or `<summary-id>/<project-id>`), in the structure of the April 2025 portfolio (section 5a):
   - title lines (generated `project-<id>`): `portfolio_title` (the product and its main technologies, e.g. "Velas crypto wallet (React, React Native, Electron)"; default the role), or the page's title from `portfolio_projects`; then the label (`portfolio_label`, default `cv_client_label`, or the page's own) and the role. **No dates or periods anywhere in the portfolio** (the user's choice, 2026-10-23); the CV carries the dates;
   - the agent's **product paragraph** (sections 1 and 2: what it is, who uses it, its main features);
   - images and links (generated `media-<id>`, placed by `refresh` right after the product paragraph): only the section 8 items marked public, images with their captions;
   - **Responsibilities** (agent): up to `portfolio_max_items` items from sections 3 and 4, longer than CV bullets (the "how" and "why", with results and numbers from section 7 or a contribution's Result);
   - **Technologies and frameworks** (agent): the hands-on items of section 5.
   **Length:** each project fits one page with its screenshots, as in the April 2025 portfolio (160–370 words a project): a product paragraph of about 70 words, at most `portfolio_max_items` (4) Responsibilities items of about 40 words, a short technologies line; `portfolio check` warns above `checks.portfolio_max_project_words` (300).
   Every sentence and bullet cites this project only. A newly opted-in project gets a placeholder until `/portfolio` writes it; a project no longer opted in is dropped.
3. **Skills overview** (generated `skills`, from `facts/skills.yaml`).
4. **Contact** (generated `contact`).

## 5. Formats and page sizes

- **Markdown** is the source and is readable on its own (images as relative links).
- **Word (`.docx`)** from a portfolio template (`templates/portfolio-<name>/`, style map `kind: portfolio`): imported with `/import-template` from a flowing Pages or Word file, or generated when the original is a free-form layout, as `portfolio-classic` is (`npm run portfolio-template`, section 5a). Its paragraph types: `cover_title`, `cover_name`, `cover_contact` (the banner), `headline`, `intro`, `project_title` (each project starts a new page), `project_meta`, `section_label`, `body`, `list_item`, `image`, `caption`, `section_heading` (skills starts a new page, contact doesn't), `skills_line`, `contact_line` (`templates.md` 2). One Word file per size.
- **Images:** PNG and JPEG are embedded as they are; other formats (TIFF from Pages, GIF, WebP) are converted to PNG (macOS `sips`). Consecutive screenshots share **one row**, as in the April 2025 portfolio: scaled to the same height, the row fitting the content width and at most 30% of the page height, with their captions together under it; no image is shown above 150 dpi: a small screenshot is printed smaller rather than blurry (the build warns under 1.5 inches).
- **Page sizes:** a portfolio template lists the sizes it supports in its `fixes.yaml`: `sizes: { a4: { page_margins: {…} }, letter: { page_margins: {…} } }`, extending the existing `page_margins` fix (`templates.md`). The renderer sets the page size and margins per size. Default: A4 and Letter (`npm run build:portfolio -- --size a4|letter|all`).
- **PDF:** one per size, exported through the PDF exporters in order (Pages, Word, LibreOffice; plan 6.1).
- **Pages (`.pages`):** saved from the A4 Word file through Pages when it is installed, for editing by hand. A hand edit is never the source: changes go back into the summaries or `portfolio.md`.

## 5a. Reference layout (the current portfolio, `doc:portfolio-2025-04`)

The current portfolio (Pages, April 2025, 16 A4 pages) is the visual reference for the first template, `templates/portfolio-classic/`. Its content is a source (`sources/`, imported 2026-10-22); its layout is recorded here because the Pages file is a **free-form page layout** (88 positioned text boxes and floating images, no flowing paragraphs), which the paragraph-based template importer (`templates.md`) can't take over directly. The template is therefore rebuilt as a flowing Word document with the same look:

| Part | Look |
|---|---|
| Page | A4 portrait |
| Cover | a coral-red banner (`#F46B75`) with the links line (DIN Condensed Bold, small caps look), the title "My Portfolio" (Superclarendon Bold, 42 pt, white, centered) and the name (Superclarendon, white) |

In `portfolio-classic` the Superclarendon titles become **Rockwell Bold**, the closest slab serif: Pages doesn't apply Superclarendon to text that comes from a Word file under any name (tested 2026-10-23, it falls back to Times), while Rockwell, Charter, Avenir Next and DIN Condensed are kept and embedded. The headline sits under the banner. `doctor` checks that the template's fonts are installed.
| Project title | Superclarendon Bold (Rockwell Bold in the template), about 16 pt, teal (`#077482`), centered, one project per page |
| Intro and body | Charter Roman, 14 pt (some 12 pt), left-aligned |
| Images | a row of phone screenshots or one or two wide screenshots under the intro, centered |
| Section labels | "Responsibilities", "Technologies and frameworks": Avenir Next Medium, teal (`#077482`) |

The fonts are macOS system fonts: the PDF is exported through Pages (first in `pdf_exporters`), which embeds them; Word on Windows and LibreOffice would substitute them, so `pdf-check`'s embedded-font check matters here. Content issues found in that portfolio (client names the CV hides, informal wording, typos) are handled through `/import-docs`, never copied.

## 6. Checks

`npm run portfolio -- check` runs the text and image checks; `npm run build:portfolio` runs it first, then the output checks, and fails on any error; `/review --portfolio` reviews the result (plan 9e P3, P4, P6).

| Check | Where | What |
|---|---|---|
| sources | `portfolio check` | every sentence and bullet the agent wrote has a source that resolves; a project cites only itself; the intro cites opted-in projects, `profile` or `calc:`; no placeholder left |
| confidentiality | `portfolio check` | the CV's lint rules (every summary's section 9 terms, hidden client names in any case, ticket prefixes, internal addresses, secrets, URLs other than profile links and public link items), with one difference: a term's `allow_in` job ids and `summary` **don't apply** here; only `allow_in: [portfolio]` lets a term appear in the portfolio (`work-summary-spec.md` 3.1) |
| generated parts | `portfolio check` (warning), `status` | the generated parts match what `refresh` writes now |
| `spellcheck` | `portfolio check`, `spellcheck` | dictionary spelling (US English) with `facts/dictionary.txt`; unknown words fail until fixed or added. The same check runs on the CV |
| images | `validate`, `portfolio check`, the renderer | every image exists and is public-confirmed in its summary's section 8 (`validate`); an image in `portfolio.md` that isn't a public item of its own project is an error (`portfolio check`); a file in `assets/` no summary lists is a warning; the renderer never shows an image above 150 dpi and warns when one ends up under 1.5 inches (a pixel minimum like "1200 px wide" doesn't fit phone screenshots) |
| `pdf-check` | `build:portfolio` | per size: every Markdown word appears in the PDF (image lines excepted), the template's fonts are embedded, no garbled text, no phone number unless decision `portfolio-show-phone`, the page count is within `checks.portfolio_max_pages` (40); written to `pdf-check-<size>.md` |
| `preview` | `build:portfolio` | page images per size in `preview/<size>/`, to look at before sharing; the template is approved (`approved: true`) only after the user has looked at them |
| reviewers | `/review --portfolio` | proofreading, fact-check, confidentiality (public rules, screenshots) and layout (both sizes), each rubric's *Portfolio mode*; reports follow `review-report-spec.md` with `cv: portfolio/portfolio.md`, `market: null`; `validate` refuses other rubrics for the portfolio |

## 7. Updates

- `npm run status` lists the portfolio: projects to write (placeholders), projects to rewrite (what the project was written from changed: summary sections 1–5 and 7, its public section 8 items, role, label, period or `portfolio_max_items`; recorded by each passing `portfolio check`), generated parts out of date (`profile.yaml`, `skills.yaml`, images or titles changed: `npm run portfolio -- refresh`), changes not yet checked, and Word, Pages and PDF files older than `portfolio.md` (`npm run build:portfolio`).
- A project whose sources changed but whose text still fits: `npm run portfolio -- check --projects-reviewed`.
- `/portfolio` rewrites only the stale projects and keeps the wording of the rest (`cv-spec.md` 12, same rule).
- A new project appears only after `show_in_portfolio: true` is set with the user.
- **Coverage (2026-10-23):** every project of the April 2025 portfolio stays (GM companion app and HERE navigation app, Velas, the clinical trial app, OMO, the dosimeter app, and the Itjet clients Aspiration (signup and web app), RegiStart, Fused, Wink, Golfuture and Oroscopo), plus SYSPRO and the Jira plugin. The Admasters wasn't in it and stays out.

## 8. Rules

- Public by default: when in doubt, leave it out and ask.
- No numbers, names or images that the user hasn't confirmed as public.
- The portfolio never says more than the summaries; it says it at more length than the CV.
- US English (`framework.config.yaml` `spelling`).
