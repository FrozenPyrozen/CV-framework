---
schema_version: 1
rubric: layout
cv: cv/variants/react-native/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T10:44
verdict: pass-with-issues
score: 8.0
---

# Layout review

## Verdict
Pages 1 and 2 are clean and match the reference. Page 3 holds only 89 words (three skills lines and Languages), within `max_pages: 3`, but it splits Skills and looks like an overflow to a recruiter.

## Per page
| page | state | note |
|---|---|---|
| 1 | ok | Header, long Summary, SYSPRO, GM, Velas, OMO, Thermo Fisher, Itjet (4 bullets); full page. |
| 2 | ok | 2 Itjet bullets, Admasters, consulting, Education, Skills up to "Authentication and Security"; filled to the bottom. |
| 3 | issues | Skills lines "AI", "Leadership and Methodologies", "Domain and SDKs", then Languages; about 12 percent of the page used. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | medium | page 3, whole page (89 words) | Page 3 starts with "AI: Generative AI integration, ..." and ends with "English: C1 (Advanced) \| Ukrainian: Native" at about 12 percent of the page; the Skills block is split across pages. | Smallest fix: save about 8 lines on pages 1-2, e.g. shorten the 8-line Summary by 2 lines, drop one or two Various Clients or Clinical Ink bullets, or merge short Skills lines (Languages into Mobile, AI into Leadership). Template alternative: reduce `bullet` or `entry_title` spacing in `fixes.yaml` (alone probably not enough). User decides. | yes |
| layout-2 | low | page 1, Summary | The Summary runs 8 lines, the longest of the five CVs, and pushes page 1's content down. | Part of layout-1: trimming it is the most visible way to gain lines. | yes |

## Decided (not raised again)
- HERE Technologies as two consulting entries: gm-project-names
