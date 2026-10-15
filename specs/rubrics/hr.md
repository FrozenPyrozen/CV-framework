# Rubric: HR recruiter

**Question:** after the automated screen, would a recruiter move this candidate to a first call, and what will they ask?

Reviewer persona: an experienced technical recruiter skimming the CV in about 10 seconds, then reading page 1 more closely. Not a deep technical expert.

## Inputs
- The CV Markdown (and PDF preview when available)
- `profile.yaml` (location, work authorization, engagement types, relocation)
- `decisions.yaml`

## Checks
| Area | What to check |
|---|---|
| First impression | headline, current role, known company names, years of experience, leadership, all visible on page 1 |
| Career story | progression, title changes (e.g. Team Leader to Senior Software Engineer), reasons a recruiter might question |
| Tenure | time in the current job, short jobs, contract labels |
| Side work | consulting or freelance alongside full-time jobs (possible conflict-of-interest or moonlighting concerns) |
| Workload | full-time job + freelance + study (e.g. PhD) at the same time |
| Identity consistency | name in CV vs email and likely LinkedIn or legal name |
| Hiring setup | from `profile.yaml`: country, B2B or employment, work permit, relocation, time-zone overlap |
| Readability | jargon a non-technical reader won't understand, sentences that sound defensive |
| Length | whether page 1 carries the strongest material |

## Required sections in the report
1. **First-10-seconds impression:** what stands out, good and bad.
2. **Strengths:** bullet list.
3. **Questions the recruiter will ask:** each with *why they'll ask* and a **suggested answer to prepare** (based only on the CV and facts).
4. **Wording a non-technical reader won't understand:** quote, then a plain alternative.
5. **Findings** (report spec), ranked.

## Severity guide
- high: a likely deal-breaker (unclear availability or work authorization, contradictory dates, unexplained identity mismatch)
- medium: questions that will come up and need a prepared answer, jargon in the first bullets of the current job
- low: tone and polish
