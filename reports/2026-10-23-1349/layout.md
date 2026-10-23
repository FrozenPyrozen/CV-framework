---
schema_version: 1
rubric: layout
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T13:49
verdict: pass
score: 9.5
---

# Layout review

## Verdict
The built PDF looks right on all three pages: bullets, left edges, date edges, spacing, header and fonts match the reference preview, and the new `keep-education-together` fix works (EDUCATION is whole on page 3). The only side effect is about 1.2 inches of empty space at the bottom of page 2, which is the expected cost of keeping EDUCATION together.

Inputs: `cv/preview/page-1.png` to `page-3.png` (built 2026-10-23 13:45, `npm run status`: up to date), extra 2.5x renders of the same PDF for close checks, `cv/pdf-check.md` (pass, 3 pages, 1017 / 864 / 314 words, embedded ArialMT, Cambria, Cambria-Bold), `templates/classic/reference-preview.png`, `style-map.yaml` and `fixes.yaml`.

## Per page
| page | result | note |
|---|---|---|
| 1 | ok | Header centered with visible links (email, Portfolio); SUMMARY, EXPERIENCE from SYSPRO to OMO Systems; bullets, left edge, right-aligned dates and spacing match the reference; page ends with OMO's last bullet, no orphan. |
| 2 | ok | Thermo Fisher to The Admasters, then CONSULTING AND FREELANCE PROJECTS (heading, intro line and all three entries); every entry starts with its title, details and at least two bullets together; about 1.2 in of empty space at the bottom because EDUCATION moved as a whole to page 3 (layout-1). |
| 3 | ok | EDUCATION complete at the top (PhD, Master's with its Honors Diploma bullet, Bachelor's), then SKILLS and LANGUAGES; same left edge and section spacing as page 1; page is about 40% full (see Decided). |

## Checks
- **Bullets:** glyph at the left margin, text at one shared indent, wrapped lines aligned with the first line on every page (checked at 2.5x on the long SYSPRO, Itjet, Clinical Trials and consulting bullets). Matches `bullet-indent-pages`.
- **Indentation:** section headings, section rules, entry titles, details lines, body, education and skills lines and bullet glyphs share the left margin; section rules span the full text width.
- **Spacing:** section gap > entry gap > bullet gap everywhere; the same small gap under every section line (including EDUCATION at the top of page 3); header-to-SUMMARY gap the same as the reference.
- **Dates:** all eight dated entries end at the right margin (same right edge on pages 1 and 2 and in the reference).
- **Page breaks:** no heading, entry title or details line alone at a page bottom; no single bullet alone at a page top; EDUCATION is no longer split (fix `keep-education-together`, `keep_sections_together: [EDUCATION]`).
- **Header:** name, headline, location line and contact line centered and readable; links blue and underlined.
- **Fonts:** Cambria body and headings as in the reference, no substitution (pdf-check embedded fonts).
- **Density:** pages 1 and 2 are full but not crowded; page 3 is short (see Decided).

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | low | cv.md:207 (page 2, bottom, after "Acted as a JavaScript subject-matter expert for large enterprise clients: technical consulting and educational webinars.") and cv.md:209 (EDUCATION) | Page 2 ends about 1.2 in above the bottom margin: the whole EDUCATION block (heading, three degrees, the Honors Diploma bullet, about 1.3 in tall) no longer fits there, so `keep_sections_together: [EDUCATION]` moves it to page 3. This is the intended trade-off of the new fix; the gap reads as a normal section break, not a layout error. | No change needed. If the user wants EDUCATION back on page 2, the block is only a few points too tall: a smaller `entry_title.before` for education entries or `education_line.after` 30 to 0 in `fixes.yaml` (`consistent-spacing`) may let it fit; otherwise keep as is. | no |

## Decided (not raised again)
- Page 3 is about 40% full (314 words) and the master CV is 3 pages; tightening a few lines would not bring SKILLS and LANGUAGES onto page 2, so no trimming is suggested: keep-length
