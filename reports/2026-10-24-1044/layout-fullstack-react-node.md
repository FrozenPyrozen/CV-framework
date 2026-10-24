---
schema_version: 1
rubric: layout
cv: cv/variants/fullstack-react-node/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T10:44
verdict: pass-with-issues
score: 8.0
---

# Layout review

## Verdict
Pages 1 and 2 are clean and match the reference. Page 3 holds only 56 words: one wrapped line of a Skills entry, "Domain and SDKs" and Languages. Within `max_pages: 3`, but it looks like an overflow and a Skills line breaks mid-sentence across the page.

## Per page
| page | state | note |
|---|---|---|
| 1 | ok | Header, 8-line Summary, SYSPRO, GM, Velas, OMO, Thermo Fisher, Itjet (4 bullets); full page. |
| 2 | ok | 2 Itjet bullets, Admasters, consulting, Education, Skills through the first line of "Leadership and Methodologies"; filled to the bottom. |
| 3 | issues | Second line of "Leadership and Methodologies", "Domain and SDKs", Languages; about 9 percent of the page used. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | medium | page 3, whole page (56 words) | Page 3 begins with the continuation "(ADR), Technology stack selection, Technical interviewing, ..." and ends with "English: C1 (Advanced) \| Ukrainian: Native" at about 9 percent of the page. | Smallest fix: save about 5 lines on pages 1-2: drop one bullet (e.g. the 2-line "Conducted senior-level technical interviews ..." in Various Clients or a 2-line GM bullet) and shorten one wrapped line, or merge two short Skills lines (Languages into Frontend). Template alternative: slightly lower `bullet` space in `fixes.yaml`. User decides. | yes |
| layout-2 | low | page 2 to 3, "Leadership and Methodologies" | A single Skills paragraph breaks across the page ("... Architecture decision records" / "(ADR), Technology stack selection, ..."). | Resolved by layout-1; or set keep-lines-together on `skills_line` in `fixes.yaml` (this would push the whole line to page 3, a worse result). | no |

## Decided (not raised again)
- HERE Technologies as two consulting entries: gm-project-names
