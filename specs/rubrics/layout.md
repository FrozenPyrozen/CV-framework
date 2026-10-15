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
| Indentation | same left edge for body text, headings and bullets as in the reference |
| Dates | entry dates aligned at the same position on every entry |
| Page breaks | no entry title or detail line alone at the bottom of a page, no section heading without content after it |
| Header | name, headline, location and contacts centered and readable, links visible |
| Fonts | look matches the reference (no substituted font) |
| Density | no overcrowded or near-empty pages, last page not mostly empty |

## Required sections in the report
1. **Per page:** page number, *ok / issues*, one line.
2. **Findings** (report spec), with page number and position (e.g. "page 2, third bullet of Velas"). Fixes usually belong in the template's `fixes.yaml`, so suggestions say which paragraph type and property to adjust.

## Severity guide
- high: broken alignment or overlapping text, missing content on a page, wrong font
- medium: orphaned headings or entry lines, inconsistent date alignment
- low: spacing polish
