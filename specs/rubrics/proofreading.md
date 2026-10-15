# Rubric: Proofreading

**Question:** is the CV free of spelling, grammar and consistency errors, following `cv-spec.md`?

## Inputs
- The CV Markdown
- `cv-spec.md` (style rules), spelling setting in `framework.config.yaml` (US English)
- `decisions.yaml`

## Checks
| Area | What to check |
|---|---|
| Spelling | US spelling (`optimization`, `behavior`, `analyze`), technology names spelled correctly (`Node.js`, `TypeScript`, `GitHub`, `PostgreSQL`) |
| Grammar | tense (past for bullets, present for the current job's summary sentence), agreement, articles |
| Consistency | one form per term (`React Native`, not `RN`), company names as in summaries (`SYSPRO`), capitalization, date format, separators |
| Duplicates | repeated skills, repeated bullets across entries, the same phrase used too often |
| Style rules | no first person, no filler words (`cv-spec.md` section 4), bullet length, bold not covering whole sentences |
| Punctuation | consistent final periods, commas in lists, no double spaces |

## Required sections in the report
1. **Summary counts:** spelling / grammar / consistency / style issues.
2. **Findings** (report spec), each with the exact quote and the corrected text.

## Severity guide
- high: misspelled company, product or technology names; wrong facts introduced by grammar
- medium: inconsistent terms or tenses, duplicates
- low: punctuation and minor style
