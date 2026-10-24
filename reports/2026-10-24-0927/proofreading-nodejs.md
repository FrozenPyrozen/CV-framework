---
schema_version: 1
rubric: proofreading
cv: cv/variants/nodejs/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T09:27
verdict: pass-with-issues
score: 8.3
---

# Proofreading review

## Verdict
No spelling errors; tense, names and spellings are consistent. The summary has a run-on first sentence and a repeated word, and the new HERE entries have a dropped destination and an undefined acronym.

## Summary counts
Spelling 0 / grammar 4 / consistency 4 / style 3

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| proof-1 | medium | cv.md:13 (Summary, sentence 1) | "7+ years of TypeScript and JavaScript experience: Node.js REST APIs, PostgreSQL and AWS in fitness, non-profit, blockchain and Jira integration projects, and React and React Native frontends." Run-on, "and" stacked three times, no verb | "7+ years of TypeScript and JavaScript experience building Node.js REST APIs on PostgreSQL and AWS for fitness, non-profit, blockchain and Jira integration projects, plus React and React Native frontends." | no |
| proof-2 | medium | cv.md:13 (Summary, sentence 4) | "It also covered OpenID Connect (OIDC) authentication and OpenTelemetry telemetry with personal data (PII) redaction." Repeated word "OpenTelemetry telemetry"; "It" has no antecedent and breaks the subject-less past-tense style; "personal data (PII)" is not the PII expansion | "Also built OpenID Connect (OIDC) authentication and OpenTelemetry instrumentation with personally identifiable information (PII) redaction." | no |
| proof-3 | medium | cv.md:130 (navigation-poc, bullet 4) | "migrated assisted-driving status icons and notifications" has no destination; words likely dropped when shortening | Add the target, e.g. "migrated ... to the new ..." | yes |
| proof-4 | medium | cv.md:124 (navigation-poc, bullet 1) | "adding text input alongside voice and processing, completion and error states" reads as "voice and processing" | "adding text input alongside voice, plus processing, completion and error states" | no |
| proof-5 | low | cv.md:30, 205 (SYSPRO bullet 5; Skills) | "removes **PII**" never expanded in the entry; Skills says "PII (personal data) redaction"; the react variant spells it "personally identifiable information (PII)" | Use "personally identifiable information (**PII**)" in the entry and Skills | no |
| proof-6 | low | cv.md:102 (Itjet, bullet 5) | Two sentences in one bullet: "...Cucumber). Set up **CI/CD** for RegiStart (...)" (one achievement per bullet, only one final stop pattern) | Split into two bullets, or join with ", and set up **CI/CD** ..." | no |
| proof-7 | low | cv.md:154 (Clinical Trials, bullet 1) | "Jenkins CI build fixes": "CI" alone while "CI/CD" is used elsewhere | "Jenkins CI/CD build fixes" or "Jenkins build fixes" | no |
| proof-8 | low | cv.md:166 (DesignAI, bullet 3) | "**MCP (Model Context Protocol)** server URL" is acronym-first; other acronyms are expanded first | "**Model Context Protocol (MCP)** server URL" | no |
| proof-9 | low | cv.md:101 vs 104-105 (SYSPRO) | "OIDC libraries" used in bullet 3 before OIDC is expanded in the entry (expanded in summary) | Keep, or expand at first use in the entry | no |
| proof-10 | low | cv.md:28 (SYSPRO, bullet 4) | "ERP smart-tag fixtures" is unexplained jargon | add a short plain explanation if the source gives one, else leave | yes |
| proof-11 | low | cv.md:63 (Velas, bullet 4) | "(remote procedure call, RPC)" uses a different acronym pattern from "(CI/CD)", "(MVP)" | "remote procedure call (RPC)" | no |
| proof-12 | low | cv.md:101 (SYSPRO, bullet 3) | "got open questions decided" is colloquial | "drove open questions to a decision" | no |

## Decided (not raised again)
- "renders 1,800+ ERP programs": keep-erp-programs-figure
- "income grew 10x", "engagement grew 4x": keep-previous-cv-metrics
- SDD and AI agent wording: ai-agents-wording, sdd-not-vibe-coding
- HERE Technologies entries, "luxury car brand": gm-project-names, gm-features-public
