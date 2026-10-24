---
schema_version: 1
rubric: proofreading
cv: cv/variants/fullstack-react-node/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T09:27
verdict: pass-with-issues
score: 8.6
---

# Proofreading review

## Verdict
No spelling errors, wrong-but-real words, tense or agreement slips found; the shortened bullets and both HERE Technologies entries read correctly apart from one ambiguous list. Remaining items are punctuation, repeated acronym expansions and small style points.

## Summary counts
Spelling 0 / grammar 1 / consistency 5 / style 3 (plus punctuation 1).

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| pr-fs-1 | medium | cv.md:126 (HERE navigation-poc, bullet 1) | Ambiguous list, comma missing after "voice": "adding text input alongside voice and processing, completion and error states" reads as "voice and processing". | "adding text input alongside voice, and processing, completion and error states" | no |
| pr-fs-2 | low | cv.md:126 and 136 (HERE navigation-poc, bullets 1 and 6) | "PoC" used in bullet 6 ("across PoC variants") but bullet 1 only says "proof of concept" without the acronym. | Bullet 1: "a car navigation proof of concept (PoC)" | no |
| pr-fs-3 | low | cv.md:13 (Summary) | Double spaces after every full stop ("products.  Built", "Docker.  Built", etc.). | Use a single space | no |
| pr-fs-4 | low | cv.md:30 (SYSPRO, bullet 5) | OIDC is spelled out again ("**OpenID Connect (OIDC)**") although the Summary (line 13) and bullet 3 (line 26, "OIDC libraries") already used it; first use in the entries is the unexpanded one. | Expand at first use in the entries (line 26) and write "OIDC" in bullet 5, or leave and accept the repeat | no |
| pr-fs-5 | low | cv.md:102 and 113 (Itjet bullet 5, Admasters bullet 2) | "server-side rendering (SSR)" expanded twice. | Keep the expansion at line 102 only; write "SSR" at line 113 | no |
| pr-fs-6 | low | cv.md:26 (SYSPRO, bullet 3) | Two sentences in one bullet (the other bullets have one): "...got open questions decided. Owned the **frontend technology stack** ...". | Split into two bullets, or join: "...decided, and owned the frontend technology stack ..." | no |
| pr-fs-7 | low | cv.md:100 (Itjet, bullet 4) | Two sentences in one bullet: "...(**Puppeteer, Jest, Cucumber**). Set up **CI/CD** for RegiStart ...". | Join with a semicolon: "...; set up CI/CD for RegiStart ..." | no |
| pr-fs-8 | low | cv.md:166 (Generative AI Jira Plugin, bullet 2) | Acronym order differs from the rest of the CV: "MCP (Model Context Protocol)" (acronym first). | "Model Context Protocol (MCP) server URL" | no |
| pr-fs-9 | low | cv.md:170 (Generative AI Jira Plugin, bullet 4) | Inconsistent bolding: "**SonarQube**" is bold, "ESLint" and "TypeScript" are not. | Bold "ESLint" and "TypeScript" or none | no |
| pr-fs-10 | low | cv.md:168 and 172 (Generative AI Jira Plugin, bullets 3 and 5) | "Azure Blob Storage" repeated in consecutive-ish bullets that describe one change (direct uploads, then chunking). | Optional: bullet 5 "Sent image data in chunks to work around Atlassian Forge's file upload limits." | no |
| pr-fs-11 | low | cv.md:13, 94 (AWS) | "AWS RDS" used before AWS is spelled out (spelled out only in Skills, line 207). | Optional: "Amazon Web Services (AWS) RDS" in the Summary | no |
| pr-fs-12 | low | cv.md:205 (Skills, Frontend) | Both "React 19" and "React.js" listed; elsewhere "React" (one form per term). | Drop "React.js" or write "React 19 (React.js)" | no |
| pr-fs-13 | low | cv.md:13 (Summary) | Three sentences open with "Built" and "Node.js" appears three times in the first two sentences. | Optional: sentence 3 "Core modules of ..." is not needed; vary one verb ("Developed") | no |

## Decided (not raised again)
- "1,800+ ERP programs" and the SYSPRO platform detail: keep-erp-programs-figure
- "company income grew 10x" (OMO, line 74): keep-previous-cv-metrics
- HERE Technologies entries with no dates, named as HERE Technologies: gm-project-names, consulting-no-dates
- AI agents wording in the Summary and SYSPRO bullet 2: ai-agents-wording
