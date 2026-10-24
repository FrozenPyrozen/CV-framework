---
schema_version: 1
rubric: proofreading
cv: cv/variants/react/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T09:27
verdict: pass-with-issues
score: 8.6
---

# Proofreading review

## Verdict
Clean of spelling errors and first person, with consistent tense, company names and technology spellings. A few words dropped or ambiguous in the new HERE Technologies entries, plus minor acronym and hyphenation inconsistencies, remain.

## Summary counts
Spelling 0 / grammar 3 / consistency 5 / style 3

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| proof-1 | medium | cv.md:140 (HERE navigation-poc, bullet 6) | "migrated assisted-driving status icons and notifications" has no destination ("migrated ... to what?"); probably words dropped when shortening | Add the target, e.g. "migrated assisted-driving status icons and notifications to the new ..." | yes |
| proof-2 | medium | cv.md:130 (navigation-poc, bullet 1) | "adding text input alongside voice and processing, completion and error states" reads as "voice and processing" | "adding text input alongside voice, plus processing, completion and error states" | no |
| proof-3 | medium | cv.md:134 (navigation-poc, bullet 3) | "across PoC variants": "PoC" is never defined (bullet 1 only says "proof of concept") | "across proof-of-concept variants", or define "proof of concept (PoC)" in bullet 1 | no |
| proof-4 | low | cv.md:108 (Itjet, bullet 6) | "React Native Web signup flow" vs "sign-in", "password-reset" elsewhere: noun "signup" unhyphenated | "sign-up flow" | no |
| proof-5 | low | cv.md:102 (Itjet, bullet 3) | "from scratch from the designs" repeats "from" | "from scratch, based on the designs" | no |
| proof-6 | low | cv.md:136 (Thermo Fisher, bullet 3) | "Worked test-first with test-driven development (TDD)" is redundant | "Used test-driven development (**TDD**), covered ..." | no |
| proof-7 | low | cv.md:123 (Velas, bullet 5) | "(remote procedure call, RPC)" uses a different acronym pattern from "(CI/CD)", "(PRD)", "(SSR)" | "remote procedure call (RPC)" | no |
| proof-8 | low | cv.md:170 (DesignAI, bullet 1) | "**MCP (Model Context Protocol)** server URL" is acronym-first; the other acronyms are expanded first | "**Model Context Protocol (MCP)** server URL" | no |
| proof-9 | low | cv.md:101 vs 105 (SYSPRO) | "OIDC libraries" is used in bullet 3 before "OpenID Connect (OIDC)" is expanded in bullet 7 (summary has it) | Keep as is, or expand at first use in the entry | no |
| proof-10 | low | cv.md:101 (SYSPRO, bullet 3) | "got open questions decided" is colloquial | "drove open questions to a decision" | no |
| proof-11 | low | cv.md:99 (SYSPRO, bullet 1) | "cutting screen delivery from days to hours, with no per-screen frontend code" comma-stacked | "cutting screen delivery from days to hours without per-screen frontend code" | no |
| proof-12 | low | cv.md:13 (Summary, sentence 2) | "Delivered it through ..." has no clear antecedent for "it" (runtime vs. frontend) | "Delivered the frontend through ..." (sentence is decided, wording only) | no |

## Decided (not raised again)
- "Forbes top 10" (cv.md:108, unclear what is ranked): keep-previous-cv-metrics
- "income grew 10x", "engagement grew 4x": keep-previous-cv-metrics
- "renders 1,800+ ERP programs": keep-erp-programs-figure
- SDD wording of the summary: sdd-summary-sentence, ai-agents-wording
- HERE Technologies entries, "luxury car brand": gm-project-names, gm-features-public
