---
schema_version: 1
rubric: layout
cv: cv/variants/nodejs/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T10:44
verdict: pass-with-issues
score: 7.5
---

# Layout review

## Verdict
Pages 1 and 2 are clean and match the reference. Page 3 holds only the LANGUAGES heading and one line (6 words), which looks like a mistake to a recruiter although it is within `max_pages: 3`; it is the cheapest of the four variants to fix.

## Per page
| page | state | note |
|---|---|---|
| 1 | ok | Header through Itjet (4 bullets); full page. |
| 2 | ok | Itjet end, Admasters, consulting, Education and the whole Skills block; filled to the bottom. |
| 3 | issues | Only "LANGUAGES" and "English: C1 (Advanced) \| Ukrainian: Native" (6 words). |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | medium | page 3 ("LANGUAGES" heading and line, 6 words) | A page with two lines: "English: C1 (Advanced) \| Ukrainian: Native" alone under its heading at the top of an otherwise empty page. | Smallest fix: save 3 lines on pages 1-2: drop one bullet (e.g. a 2-line consulting bullet such as "Conducted senior-level technical interviews ..." or the Admasters bullet) or shorten a wrapped bullet to one line; or fold the line into the Skills block as one "Languages" skills line and drop the section. Template alternative: slightly lower `bullet` space-after in `fixes.yaml`. User decides; leaving it is within max_pages. | yes |

## Decided (not raised again)
- HERE Technologies as two consulting entries: gm-project-names
