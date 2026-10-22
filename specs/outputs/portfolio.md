# Portfolio Spec

Status: v0 (specified, not built) · Applies to: `portfolio/`, written by the portfolio agent (`/portfolio`), built by `npm run build:portfolio`

The portfolio is a second **output** of the same sources as the CV (plan section 2, "Sources and outputs are separate"): a multi-page **document** with a cover and a page or more per project, shared through a **public link**. It is built like the CV: Markdown first, then Word through an imported template, then PDF, with the same checks. Building starts once the user provides the current portfolio as Pages or Word and PDF (plan 9e, phase P2).

## 1. Sources

| Portfolio part | Source |
|---|---|
| Cover: name, headline, contacts, portfolio intro | `facts/profile.yaml` and the default market's header rules (`markets/*.yaml`, `cv-spec.md` 14); one intro paragraph written by the agent from the summaries (sourced like the CV summary). Because the link is public, the **phone number is left out** unless a decision in `facts/decisions.yaml` says otherwise |
| Project pages | summaries with `show_in_portfolio: true` (section 3): section 1 (what the product is), 2 (main features), 3 (role), 4 (contributions), 5 (technologies), 7 (numbers), 8 (images, links, demo notes) |
| Skills overview | `facts/skills.yaml` (generated block, like the CV's SKILLS) |
| Contacts page | `facts/profile.yaml` |

Every sentence carries a source comment (`<!-- src: <id>#<section> -->`), as in the CV (`cv-spec.md` 6). Nothing is written that the sources don't support. Numbers follow the CV rules, including `doc:<id>` numbers only once confirmed (`sources-spec.md` 4).

## 2. Files

```
portfolio/
├── portfolio.md                 # the source Markdown (agent-written parts + generated blocks)
├── assets/<summary-id>/         # images: screenshots, diagrams, photos (PNG, JPEG, SVG); in git
├── <Name>_Portfolio.docx        # built (git-ignored)
├── <Name>_Portfolio.pages       # built with Pages when available (git-ignored)
├── <Name>_Portfolio_<size>.pdf  # one PDF per page size: A4, Letter (git-ignored)
├── pdf-check-<size>.md, preview/<size>/   # checks and page previews (git-ignored)
└── spellcheck.md                # spelling report (git-ignored)
```

## 3. Summary fields (added to `schemas/summary.schema.json` in phase P1)

| Field | Default | Meaning |
|---|---|---|
| `show_in_portfolio` | `false` | the portfolio is public, so projects are **opted in**, never included by default |
| `portfolio_order` | newest first | position among the projects |
| `portfolio_label` | `cv_client_label` | the public name of the client or product; must hide what the CV hides |
| `portfolio_max_items` | 6 | contributions shown on the project page |

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

- Image paths are relative to `portfolio/` (the file lives in `portfolio/assets/<summary-id>/`).
- Free text already in section 8 (or `TODO (needs user input)`) stays valid as notes; only the `- image:`, `- link:` and `- demo:` items are read. `validate` checks the items' format and that each image exists.
- Section 8 is filled with the advisor (`/portfolio-material`, plan 9e P1), which asks per item whether it is public.

## 4. Structure of `portfolio.md`

1. **Cover:** name, headline, one intro paragraph, contacts.
2. **Projects**, one block each, in `portfolio_order`:
   - title (role), `portfolio_label`, period, a one-line tech stack;
   - **The product** (2–3 sentences from sections 1 and 2) and **My role** (from section 3);
   - **What I built**: up to `portfolio_max_items` items from section 4, longer than CV bullets (2–3 sentences, the "how" and "why"), each with its source;
   - **Results**: numbers from section 7;
   - images with captions, and links.
3. **Skills overview** (generated block).
4. **Contact** (generated block).

Blocks (`<!-- generated:… -->`) are written by `npm run refresh`, never by the agent, as in the CV (`cv-spec.md` 8).

## 5. Formats and page sizes

- **Markdown** is the source and is readable on its own (images as relative links).
- **Word (`.docx`)** from the portfolio template (`templates/portfolio-<name>/`, imported with `/import-template` from the user's Pages or Word file). The style map gains the portfolio's paragraph types: cover title, intro, project title, project meta, section label, body, list item, caption, image.
- **Page sizes:** a portfolio template lists the sizes it supports in its `fixes.yaml`: `sizes: { a4: { page_margins: {…} }, letter: { page_margins: {…} } }`, extending the existing `page_margins` fix (`templates.md`). The renderer sets the page size and margins per size and scales images to the content width. Default: A4 and Letter.
- **PDF:** one per size, exported through the PDF exporters in order (Pages, Word, LibreOffice; plan 6.1).
- **Pages (`.pages`):** saved through Pages when it is installed (the Pages exporter already drives it), for editing by hand. A hand edit is never the source: changes go back into the summaries or `portfolio.md`.

## 6. Checks (`build:portfolio` fails on errors)

| Check | What |
|---|---|
| `trace` | every sentence has a source that exists |
| `lint` | as for the CV (secret scan, every summary's section 9 terms, hidden client names in any case, internal URLs, hidden contact details), with one difference: a term's `allow_in` job ids and `summary` **don't apply** here; only `allow_in: [portfolio]` lets a term appear in the portfolio (`work-summary-spec.md` 3.1) |
| images | every image exists, is public-confirmed in its summary's section 8, and is at least 1200 px wide; nothing in `assets/` is unused |
| `spellcheck` | a dictionary spelling check (US English) with the project word list `facts/dictionary.txt` (product names, technologies); unknown words fail until fixed or added. The same check runs on the CV |
| `pdf-check` | per size: every Markdown word appears in the PDF, fonts are embedded, the page count is within `checks.portfolio_max_pages` |
| `preview` | page images per size, to look at before sharing |
| reviewers | `/review --portfolio`: proofreading, fact-check, confidentiality (public rules) and layout rubrics; reports follow `review-report-spec.md` with `cv: portfolio/portfolio.md` |

## 7. Updates

- `npm run status` lists the portfolio like a CV: stale when a summary it uses, `profile.yaml`, `skills.yaml`, an image or the template changed, with the project ids to rewrite.
- `/portfolio` rewrites only the stale projects and keeps the wording of the rest (`cv-spec.md` 12, same rule).
- A new project appears only after `show_in_portfolio: true` is set with the user.

## 8. Rules

- Public by default: when in doubt, leave it out and ask.
- No numbers, names or images that the user hasn't confirmed as public.
- The portfolio never says more than the summaries; it says it at more length than the CV.
- US English (`framework.config.yaml` `spelling`).
