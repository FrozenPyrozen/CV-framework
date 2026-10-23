# Rubric: Layout

**Question:** does the built PDF look right on every page?

This rubric looks at the **page images** in `preview/`, which an AI model with image input can inspect. It was added after the bullet indentation bug found on 2026-10-15, where bullets rendered with their text pushed about 0.6 inch to the right in Pages.

## Inputs
- `preview/page-*.png` of the built PDF (all pages)
- The template's `reference-preview.png` and `style-map.yaml`
- `pdf-check.md`

## Checks
| Area | What to check |
|---|---|
| Bullets | bullet glyph and text aligned, wrapped lines aligned with the first line, consistent spacing |
| Indentation | one shared left edge: section headings, job titles, job details, body, education and skills lines and bullet symbols all start at the margin (as in the reference) |
| Spacing | the same gap for the same kind of paragraph everywhere (above every job title, under every section line, between bullets); section gap > job gap > bullet gap; no unusually large gap (e.g. between the header and the first section) |
| Dates | entry dates end at the same right edge (the right margin) on every entry |
| Page breaks | no section heading, job title or detail line alone at the bottom of a page; a heading is followed by at least two bullets on the same page; no single bullet alone at the top of a page; a lead-in line (e.g. a degree's institution) stays with its bullet |
| Header | name, headline, location and contacts centered and readable, links visible |
| Fonts | look matches the reference (no substituted font) |
| Density | no overcrowded pages; a short last page is a *low* note (suggest tightening only if a few lines would bring it onto the previous page), never a high finding |

## Portfolio mode (`/review --portfolio`)

Inputs: `portfolio/preview/<size>/page-*.png` for every size (A4, Letter), `portfolio/pdf-check-<size>.md`, the portfolio template's `style-map.yaml` and, once approved, its `reference-preview.png`. Checks: the cover banner is one block with the headline under it; each project and the skills overview start on a new page; no project title, label or image is left alone at a page bottom; images are sharp (not upscaled), centered, not cut, with the caption right under them; spacing is the same in every project; both sizes look alike. Suggestions name the generator setting in `scripts/portfolio-template.ts` (paragraph type and property), since `portfolio-classic` is generated.

## Required sections in the report
1. **Per page:** page number, *ok / issues*, one line.
2. **Findings** (report spec), with page number and position (e.g. "page 2, third bullet of Velas"). Fixes usually belong in the template's `fixes.yaml`, so suggestions say which paragraph type and property to adjust.

## Severity guide
- high: broken alignment or overlapping text, missing content on a page, wrong font
- medium: orphaned headings or entry lines, inconsistent date alignment
- low: spacing polish
