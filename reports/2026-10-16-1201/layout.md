---
schema_version: 1
rubric: layout
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-16T12:01
verdict: pass-with-issues
score: 9
---

# Layout review

## Verdict
The built PDF looks right on all 3 pages and matches `templates/classic/reference-preview.png`. All the fixes in `fixes.yaml` hold: bullets, dates, left edges, spacing and page breaks. One visible defect remains: the Summary paragraph has double spaces between sentences, and the reference doesn't. The Ukraine version (`cv/markets/ukraine/`) has the same layout and the same defect.

Inputs: `cv/preview/page-1..3.png`, `cv/markets/ukraine/preview/page-1..3.png`, `templates/classic/reference-preview.png`, `templates/classic/style-map.yaml`, `templates/classic/fixes.yaml`, `cv/pdf-check.md` (pass: 3 pages, 945 / 800 / 196 words, fonts ArialMT, Cambria, Cambria-Bold embedded) and `cv/markets/ukraine/pdf-check.md` (pass: 924 / 798 / 196 words). `npm run status` said the build was current, so I didn't rebuild.

## Per page

| page | result | note |
|---|---|---|
| 1 | issues | The header is centered and matches the reference, and the email and Portfolio links show in blue with underlines. All section headings, job titles, details lines, body text and bullet glyphs share the left margin. Wrapped bullet lines line up with the first line's text, and all four dates end at the right margin. Spacing is consistent: section gap > job gap > bullet gap. OMO Systems ends the page with all 5 bullets. Thermo Fisher moves whole to page 2 (keep-with-next works). The only issue is the double spaces in the Summary (layout-1). |
| 2 | ok | Thermo Fisher, Itjet and The Admasters, then Consulting (section intro, three entries), Education and the start of Skills. The Honors Diploma bullet stays with its degree. Under SKILLS, the "Languages:" and "Frontend:" lines stay on page 2 (two lines after the heading, as the rubric asks). Dates are right-aligned and no heading or details line sits alone at the page bottom. |
| 3 | ok | The other 9 skills lines and LANGUAGES. Wrapped skills lines start at the margin, like every other body line. The page is short (196 words). See Decided. |
| UA 1-3 | issues | Same page breaks and alignment as worldwide. The header has no phone, availability or time-zone line, and the consulting titles have no "(Contract)". `markets/ukraine.yaml` hides these on purpose. The Summary has the same double spaces (layout-1). |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | low | cv/Kirill_Kohan_CV.md:13 (Summary, sentence breaks 1-3); page 1, Summary lines 2-3; same in Ukraine page 1 | The PDF has visible double spaces between Summary sentences: "blockchain products.&nbsp;&nbsp;At SYSPRO", "data-model definitions.&nbsp;&nbsp;Previously" and "HERE SDK.&nbsp;&nbsp;Experienced". The reference shows single spaces ("model definitions. Previously"). The Word text has the double spaces too (`products.  At SYSPRO`), so they come from the build. Each sentence is followed by " <!-- src: … --> ", and `scripts/renderers/docx.ts:162` deletes the comment but keeps the spaces on both sides of it. Bullets aren't affected because their src comment comes last. | This isn't a paragraph property, so `fixes.yaml` can't fix it (no paragraph type or property controls it). Fix the renderer: when the src comments are stripped (`scripts/renderers/docx.ts:162`), collapse runs of spaces into one and trim the end of the line. Then rebuild both markets. Don't edit the CV Markdown. Its src comments between sentences are correct. | no |

## Decided (not raised again)
- Page 3 is short (196 words, about 12 lines of Skills and Languages). Removing a few lines wouldn't move it onto page 2, which is full. Page count stays as it is: keep-length.
