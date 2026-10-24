---
schema_version: 1
rubric: layout
cv: cv/variants/react/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T10:44
verdict: pass-with-issues
score: 8.0
---

# Layout review

## Verdict
Pages 1 and 2 are clean and consistent with the reference (alignment, dates, spacing, fonts). Page 3 holds only 102 words (4 skills lines and Languages), within the profile's `max_pages: 3` but it looks like an overflow to a recruiter; see the finding for the smallest fix.

## Per page
| page | state | note |
|---|---|---|
| 1 | ok | Header, Summary, SYSPRO, GM, Velas, OMO, Thermo Fisher, Itjet (4 bullets); full page. |
| 2 | ok | 2 Itjet bullets, Admasters, consulting entries, Education, Skills (first 7 lines); filled to the bottom. |
| 3 | issues | Skills continues with "Mobile", "Leadership and Methodologies", "Domain and SDKs", then Languages; about 12 percent of the page used. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | medium | page 3, whole page (102 words) | Page 3 is nearly empty: it starts with "Mobile: React Native, Expo, ..." and ends with "English: C1 (Advanced) \| Ukrainian: Native" at about 12 percent of the page. It looks like an accident to a recruiter and splits the Skills block across pages. | Smallest fix: save about 9 lines on pages 1-2 so the Skills block and Languages fit on page 2, e.g. drop 1-2 of the weakest bullets (two-line ones in Admasters or "Various Clients" first) or merge two short Skills lines (Languages into Frontend, AI into Leadership). Template alternative: reduce `bullet` and `entry_title` spacing in `fixes.yaml` (alone probably not enough for 9 lines). Alternative: leave it (within max_pages). User decides. | yes |
| layout-2 | low | page 2 to 3, Skills block | Skills list breaks after the "Backend and Cloud" line; the heading and the first 7 lines are on page 2, 3 lines on page 3. | Resolved together with layout-1; otherwise accept. | no |

## Decided (not raised again)
- HERE Technologies as two consulting entries: gm-project-names
