# Rubric: AI ATS screener

**Question:** would this CV pass an AI-powered applicant tracking system for the target roles?

Reviewer persona: an automated screening system that parses the file, extracts structured data, scores keyword and seniority match, and flags risks. Not a human.

## Inputs
- The CV Markdown and, when available, its built PDF and `pdf-check.md`
- `profile.yaml` (target roles implied by the headline)
- `decisions.yaml`
- The market file of the version reviewed (`markets/<id>.yaml`)
- Job ad mode: `job-description.md` and `jd-tags.yaml`

## Checks
| Area | What to check |
|---|---|
| Parsing | standard section names, one column, no tables or text boxes, readable PDF text, no forbidden characters |
| Contact details | name, email and every contact field the CV's **market** shows (`markets/<id>.yaml`) on page 1, phone in international format where shown; links readable. A field the market hides (e.g. the phone in the Ukraine version) is intended, not a finding. |
| Dates and gaps | consistent format, no unexplained gaps, overlaps explained (e.g. consulting "alongside full-time roles"); short jobs are noted as a risk, but a "(Contract)" label is only suggested when the job really was a contract (see `facts/decisions.yaml`) |
| Seniority signals | titles, team size led, architecture and tech-stack ownership, scope words (led, owned, defined) |
| Keywords in context | key technologies appear in bullets, not only in Skills; acronyms spelled out once |
| Measured results | numbers in bullets, especially for the current job |
| Signs of AI padding | generic phrases, buzzwords, vague bullets without technology or result |
| Length | page and word limits from config or profile |

## Required sections in the report
1. **Score table:** one row per area above with *pass / warning / fail* and a one-line reason.
2. **Estimated match per role:** Senior Frontend / React Engineer, Senior React Native / Mobile, Tech Lead / Frontend Architect, Full-stack (Node-heavy), Native Android, plus any profile headlines. Each rated *strong pass / pass / borderline / likely filtered out* with a reason.
3. **Job ad match** (job ad mode only): match score, required and nice-to-have keywords *found / missing*, and for each missing keyword whether it's **honestly addable** (a summary or fact supports it) or a **real gap**.
4. **Findings** (report spec), ranked.

## Severity guide
- high: unparseable content, missing contact details, broken dates, forbidden characters, no measured results in the current job
- medium: keywords only in Skills, unexplained short jobs, length over limit
- low: inconsistent capitalization, minor keyword gaps
