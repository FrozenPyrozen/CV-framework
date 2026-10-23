# Review Report Spec

Status: v1 · Applies to: every reviewer run (`/review`), one report per rubric in `reports/<YYYY-MM-DD-HHmm>/<rubric>.md`

All rubrics in `specs/rubrics/` produce reports in this format, so the advisor (`/improve`), reviewers in later runs and any AI tool can read them the same way.

## Format

```markdown
---
schema_version: 1
rubric: ats                         # file name of the rubric
cv: cv/Kirill_Kohan_CV.md           # the file reviewed (portfolio/portfolio.md for /review --portfolio)
job_ad: null                        # path when run with --jd
market: worldwide                   # the market version reviewed (null for the portfolio)
reviewed_at: 2026-10-20T14:05
verdict: pass                       # pass | pass-with-issues | fail
score: 8.5                          # 0-10, rubric-specific meaning
---

# <Rubric name> review

## Verdict
One or two sentences: the overall answer to the rubric's question.

## <Rubric-specific sections>
(defined by each rubric)

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | high | cv.md:21 (SYSPRO, bullet 2) | ... | ... | yes |

## Decided (not raised again)
- <finding that matches an entry in facts/decisions.yaml>: <decision id>
```

## Rules

- **Severity:** `high` (likely to cause rejection, a false claim, a confidentiality leak or a broken file), `medium` (weakens the CV noticeably), `low` (polish).
- **Findings are ranked**: high first, then by expected impact.
- **Location** is `file:line` plus a readable pointer (entry and bullet number).
- **`needs_user_input: yes`** when only the user can resolve it (a missing number, a choice, a fact to confirm). The advisor asks about these one topic at a time.
- **Decisions:** before reporting, the reviewer reads `facts/decisions.yaml`. A finding that matches a decision is listed under *Decided*, not as a finding.
- **Reports only.** Reviewers never edit the CV, summaries or facts.
- **Evidence:** every finding quotes or points to the exact text it's about.
