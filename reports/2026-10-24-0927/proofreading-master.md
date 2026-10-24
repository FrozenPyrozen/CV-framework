---
schema_version: 1
rubric: proofreading
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T09:27
verdict: pass-with-issues
score: 8.7
---

# Proofreading review

## Verdict
The CV is clean of misspellings, wrong-word errors and tense slips, and the new HERE, SYSPRO, GM, Velas, Itjet and clinical-trials wording reads correctly. A few awkward phrases and inconsistent acronym forms remain, all low or medium.

## Summary counts
Spelling 0 / grammar 1 / consistency 4 / style 6.

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| proof-1 | medium | cv:170 (navigation-poc, bullet 1) | Acronym form reversed: "**car navigation PoC** (proof of concept)" | "car navigation **proof of concept (PoC)**" | no |
| proof-2 | medium | cv:24, 66, 208 | Same reversed pattern, unlike the "(SDD)" and "(OIDC)" convention: "(architecture decision record, **ADR**)", "(remote procedure call, RPC)", "**MCP (Model Context Protocol)**" | "architecture decision record (ADR)", "remote procedure call (RPC)", "Model Context Protocol (MCP)" | no |
| proof-3 | medium | cv:163 (navigation-poc, bullet 4) | Unclear: "extended their service contracts with the Android layer for confirming, rejecting and dismissing warnings" | "extended their service contracts to the Android layer for confirming, rejecting and dismissing warnings" | no |
| proof-4 | low | cv:36 (SYSPRO, bullet 8) | Awkward and repeated word: "Covered implementations with Vitest and Vitest Browser Mode (Playwright provider) tests" | "Tested implementations with Vitest and Vitest Browser Mode (Playwright provider)" | no |
| proof-5 | low | cv:24 (SYSPRO, bullet 2) | Colloquial: "got open questions decided"; "architecture" appears 4 times in the bullet | "drove open architecture questions to a decision" | no |
| proof-6 | low | cv:176 vs cv:49, 270 | Term varies: "HERE navigation SDK" vs "HERE SDK" | Use "HERE SDK" (or "HERE SDK for navigation") everywhere | no |
| proof-7 | low | cv:176 vs cv:170 | "in-car navigation features" vs "car navigation PoC" | "car navigation features" | no |
| proof-8 | low | cv:104 (SYSPRO, bullet 6) | "micro-frontend" twice, bullet near the 45-word limit: "...in a secure, independently released **micro-frontend architecture**" | "...in a secure, independently released setup" or trim the ending | no |
| proof-9 | low | cv:94 (summary) | List reads ambiguously: "healthcare and clinical trials, fintech and blockchain products" | "healthcare (including clinical trials), fintech and blockchain products" | no |
| proof-10 | low | cv:191 (clinical trials, bullet 4) | "app" twice: "upgrading the app to React Native 0.76 and Expo SDK 52 to improve app performance" | "...to improve performance" | no |
| proof-11 | low | cv:206 (Jira plugin, bullet 1) | "started" twice: "starting with Forge UI Kit ... The app started generative AI design generation" | "The app triggered generative AI design generation from a Jira issue" | no |
| proof-12 | low | cv:221 (Various Clients, bullet 2) | "for ... for" and "technical" twice: "technical interviews for React ... roles for enterprise clients, with technical questions" | "...roles for enterprise clients, using coding assignments and technical questions" | no |
| proof-13 | low | cv:144 vs cv:133 | SSR spelled out twice (Itjet then Admasters) | Keep the expansion at the first use (cv:133) and write "SSR" at cv:144 | no |
| proof-14 | low | cv:252 (Skills) | Label "**Languages:**" collides with the LANGUAGES section (spoken) | "**Programming languages:**" | no |
| proof-15 | low | cv:272 (Skills) | "Figma, Jira" listed under Leadership and Methodologies | Move to Frontend or DevOps and Observability | no |
| proof-16 | low | cv:127 vs cv:153 | "Doubled" opens two Itjet bullets back to back in different contexts | Optional: "Raised database performance 2x for Fused ..." | no |

## Decided (not raised again)
- "renders 1,800+ ERP programs" and summary/SDD sentence: keep-erp-programs-figure, sdd-summary-sentence
- "Forbes top 10", "income grew 10x": keep-previous-cv-metrics
- "luxury car brand", HERE names, no dates on consulting entries: gm-features-public, gm-project-names
- Master length: keep-length
