---
schema_version: 1
rubric: proofreading
cv: cv/variants/react-native/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T09:27
verdict: pass-with-issues
score: 8.6
---

# Proofreading review

## Verdict
Clean of spelling errors, wrong-but-real words and tense slips; the shortened bullets and the two HERE Technologies entries read correctly apart from one ambiguous list. Remaining items are punctuation, acronym handling and small wording points.

## Summary counts
Spelling 0 / grammar 1 / consistency 5 / style 4 (plus punctuation 1).

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| pr-rn-1 | medium | cv.md:130 (HERE navigation-poc, bullet 1) | Ambiguous list, comma missing after "voice": "adding text input alongside voice and processing, completion and error states" reads as "voice and processing". | "adding text input alongside voice, and processing, completion and error states" | no |
| pr-rn-2 | low | cv.md:130 and 136 (HERE navigation-poc, bullets 1 and 4) | "PoC" used in bullet 4 ("into the PoC") but bullet 1 only says "proof of concept" without the acronym. | Bullet 1: "a car navigation proof of concept (PoC)" | no |
| pr-rn-3 | low | cv.md:13 (Summary) | Double spaces after every full stop ("products.  Led", "engineers building ... 15%.  Built"). | Use a single space | no |
| pr-rn-4 | low | cv.md:13 (Summary) | List mixes domains and an odd grouping: "automotive, healthcare and clinical trials, Internet of Things (IoT), fintech, blockchain and enterprise resource planning (ERP) products". | "automotive, healthcare, clinical trials, Internet of Things (IoT), fintech, blockchain and enterprise resource planning (ERP) products" | no |
| pr-rn-5 | low | cv.md:100 (Itjet, bullet 1) | Nested parentheses and an acronym in a list: "(Snapchat and phone sign-in, push notifications, continuous integration and delivery (CI/CD), image optimization ...)". Also CI/CD is used earlier (GM Stack line, line 47) before it is spelled out here. | Move "CI/CD" out of the parenthesis: "..., CI/CD (continuous integration and delivery) and image optimization ..." or spell it out at first use (line 47) | no |
| pr-rn-6 | low | cv.md:176 (Generative AI Jira Plugin, bullet 2) | Acronym order differs from the rest of the CV: "MCP (Model Context Protocol)" (acronym first); elsewhere the full term comes first ("product requirements document (PRD)"). | "Model Context Protocol (MCP) server URL" | no |
| pr-rn-7 | low | cv.md:61 (Velas, bullet 5) | The expansion sits after "backup blockchain connection (remote procedure call, RPC)", which defines the connection, not the term. | "a backup blockchain remote procedure call (RPC) connection" | no |
| pr-rn-8 | low | cv.md:104 (Itjet, Golfuture bullet) | Repeated words: "from scratch from the designs". | "Built the Golfuture **React Native** app from the designs, including ..." (keep "from scratch" only if the source needs it) | no |
| pr-rn-9 | low | cv.md:53, 55 (Velas, bullets 1 and 2) | Repeated opener and phrasing: "Made the first interaction ... 3x faster", "Made the wallet faster and smoother", plus "made it use" in bullet 5. | Bullet 2: "Smoothed the wallet by removing unnecessary component re-renders, and sped up backend responses ..." | no |
| pr-rn-10 | low | cv.md:24 (SYSPRO, bullet 2) | Awkward phrasing: "got open architecture questions and blockers decided". | "drove decisions on open architecture questions and blockers" | no |
| pr-rn-11 | low | cv.md:106, 147 and others (AWS) | "AWS RDS" is used in bullets before AWS is spelled out (spelled out only in Skills, line 223). | Optional: "Amazon Web Services (AWS) RDS" at first use (line 106) | no |
| pr-rn-12 | low | cv.md:221 (Skills, Frontend) | Both "React 19" and "React.js" listed; the CV elsewhere says "React" (one form per term). | Drop "React.js" or write "React 19 (React.js)" | no |

## Decided (not raised again)
- "Forbes top 10" (Itjet, line 102) with no stated list: keep-previous-cv-metrics
- "1,800+ ERP programs" and the SYSPRO platform detail: keep-erp-programs-figure
- HERE Technologies entries with no dates, named as HERE Technologies: gm-project-names, consulting-no-dates
- Summary's SDD sentence kept as is: sdd-summary-sentence
