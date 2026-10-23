---
schema_version: 1
rubric: fact-check
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T13:51
verdict: pass-with-issues
score: 8.5
---

# Fact check review

## Verdict
Every claim has a source and no claim is unsupported. All numbers, dates, titles and calculated values match their sources. The bullets that changed today (Itjet clients, Wink, RegiStart MVP, Velas staking, the GM map team and map architecture, the dosimeter architecture, the Clinical Trials React Native upgrade, Forge UI Kit to Custom UI, Atlaskit) match their summaries in meaning. Three claims say a little more than their sources: the Itjet "doubled delivery speed" now covers two different clients, "it reached more than 5 million registered users" links the Wink user count to the app build, and the last summary sentence says all of the listed work was delivered through SDD.

## Claims checked
- **Claims checked:** 70 (4 summary sentences and 66 experience bullets, including 4 Stack lines). There are also 10 entry lines (title, client label, location, dates) and 2 calculated values.
- **Supported:** 64
- **Partly supported:** 6 (summary sentences 3 and 4; Itjet bullets 2 and 4; Velas bullet 2; Clinical Trials bullet 7)
- **Unsupported:** 0
- **Entry lines:** all 10 match the summary front matter and `facts/confirmed.yaml` (titles, periods, locations, labels). "(Contract)" appears only on the two consulting entries (`engagement: contract`).
- **Calculated values:** "7+ years" is correct (the earliest `counts_as_experience` start is The Admasters, 2019-04, which gives 7.5 years, rounded down). "a team of 8 engineers" and "up to 8 engineers" are correct (the highest `team_size_led` is 8, General Motors).
- **Emphasis:** the SYSPRO `cv_emphasis` points come first and in order: SDD, not ad-hoc AI code generation (bullet 1); helped define SDD and worked with the lead architect (bullets 1 and 2); owned the frontend stack (bullet 2).
- **Today's changes, checked against the source text:**
  - Itjet client split (Aspiration, RegiStart, Fused, Wink): each bullet names the client its contribution names (summaries/itjet-fintech.md 4.1 to 4.8, 4.14).
  - RegiStart MVP (line 135): matches 4.14 point by point (React and Material UI, Node.js with Sequelize and PostgreSQL on AWS RDS, node-pg-migrate, the student distribution algorithm).
  - Velas "2 minutes to 5 seconds" (line 72): matches section 7, source `user 2026-10-22`, so the doc-only number rule is met.
  - GM map team of 8 (line 45): matches 4.1 ("map team of 8 developers (6 React Native, 1 iOS, 1 Android)"). GM map architecture (line 53): matches 4.11 (no shared global reference, one event listener per map, search architecture reused on several screens, normalized marker and search-result state).
  - Dosimeter "designed its architecture" (line 108): matches 4.1, confirmed by user 2026-10-22.
  - Clinical Trials React Native 0.76 / Expo SDK 52 (line 169): "Worked with the team on upgrading" matches 4.7, which records a team effort, not sole ownership.
  - Forge UI Kit to Custom UI (line 184) and Atlaskit (line 186): match 4.1 and 4.2, both confirmed by user 2026-10-22.
- **Numbers checked against sources:** 7+, 1,800+ (source: 1,891), 25+, ~17, 4 repositories, 8 (6 / 1 / 1), 20%, 15%, 95%, 2 minutes to 5 seconds, 5x, 3x (Velas new users), 4x, 3x (Android), 1st place, 10x, about 3, 30%, 20% (Thermo Fisher), 3x (Itjet), 2x (delivery speed, database), more than 5 million, Forbes top 10, 3 engineers, ~1,000 lines, 0.76, SDK 52, Android 14 / SDK 34, Java 17, Gradle 8, up to 50%. All match. Two are lower in the CV than in the source, which is allowed: GM "reduced production bugs" leaves out the confirmed 50%, and "1,800+" rounds 1,891 down.

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| fact-check-1 | medium | cv/Kirill_Kohan_CV.md:131 (Itjet, bullet 4) | The CV says "**Doubled delivery speed** by introducing TypeScript and an Atomic Design component library ... for Aspiration, and by setting up CI/CD (Bitbucket Pipelines, AWS EC2 / S3) for RegiStart." Summary 4.3 has one result, "delivery speed doubled" (summaries/itjet-fintech.md:70). That number comes from the previous CV, which described one product, and section 7 says the previous CV credited "a 2x delivery speedup separately to TypeScript plus Atomic Design and to CI/CD plus automated tests" (line 193). Since the client split on 2026-10-22, the CI/CD work is on a different client (RegiStart). One doubling of delivery speed can't come from work on two separate projects, so the bullet now says more than the source can support. | Ask the user which project's delivery speed doubled. Then keep "doubled delivery speed" for that client's work only and move the other client's part to its own bullet or clause without the number (for example, add the RegiStart CI/CD to the RegiStart MVP bullet, as 4.14 already says). | yes |
| fact-check-2 | medium | cv/Kirill_Kohan_CV.md:127 (Itjet, bullet 2) | The CV says "Built the Wink social app from scratch in **React Native** (...); **it reached more than 5 million registered users**." Section 7 says "More than 5 million registered users in the Wink database", confidence **approximate**, from the user on 2026-10-22, based on the portfolio's "more than 5 million users" (summaries/itjet-fintech.md:195). Contribution 4.8 says the app was built "from the designs" with "integration with the backend API" (line 100), so the backend and its database may have existed before the app. "It reached" says the app Kirill built grew to that number. The source only gives the size of the database. | Confirm with the user that the 5 million registered users signed up through the app he built (or while it was the product's main app). If not, reword as "for Wink, a social product with more than 5 million registered users". | yes |
| fact-check-3 | medium | cv/Kirill_Kohan_CV.md:13 (Summary, sentence 4) | The CV says "Experienced in micro-frontend architecture, ... **native Android migrations and generative AI integrations, delivered through architecture-governed specification-driven development (SDD)**." In the sources, SDD is the SYSPRO process only (summaries/syspro-saas-erp.md 4.2). The native Android migration is from the Clinical Trials contract (orion-mobile-clinical-ink 4.4, 2024) and the generative AI work is from the Jira plugin (designai-jira-plugin 4.1, 2025). Neither source mentions SDD. The sentence says all of the listed work was delivered through SDD. "Generative AI integrations" (plural) is also broader than 4.1, which describes one Jira app that starts design generation in another product's pipeline. | Separate SDD from the list, for example "Experienced in micro-frontend architecture, OIDC, OpenTelemetry observability, test automation, native Android migrations and generative AI integration, and in architecture-governed specification-driven development (SDD)". Follow decision `summary-no-company-names` (no names or timing words). | no |
| fact-check-4 | low | cv/Kirill_Kohan_CV.md:13 (Summary, sentence 3) | "Led a team of 8 engineers building the **HERE SDK map features**" cites `general-motors-navigation#4.1, #4.6`. Contribution 4.1 is the team of 8 but doesn't mention HERE. Contribution 4.6 is in-car navigation with the HERE HNav / HNod SDK, not the map features. The map features on the HERE SDK are in 4.3 ("reusable map library built on the HERE SDK", summaries/general-motors-navigation.md:59). The claim is supported, but by a section the `src` comment doesn't cite. | Add `general-motors-navigation#4.3` to the src comment (and keep or drop #4.6). | no |
| fact-check-5 | low | cv/Kirill_Kohan_CV.md:175 (Clinical Trials Patient App, bullet 7) | "Investigated production crashes and fixed patient-facing bugs ... **by bisecting dependency versions** and adding targeted logging" cites only `orion-mobile-clinical-ink#4.6`. The bisecting (Jackson 2.8.x to 2.17.2, fixing a login crash) is in 4.4 (summaries/orion-mobile-clinical-ink.md:94), and 4.6 only has the logging. | Add `orion-mobile-clinical-ink#4.4` to the src comment. | no |
| fact-check-6 | low | cv/Kirill_Kohan_CV.md:72 (Velas, bullet 2) | "Cut **staking list loading** from 2 minutes to 5 seconds". The confirmed result is for "staking page loading went from 2 minutes to 5 seconds" (summaries/velas-wallet.md:56, 144). The list is what was optimized, but the number was confirmed for the page. "Blockchain-node RPC fallback" for the source's "Node RPC fallback" fits section 5, which lists Node RPC under Blockchain (line 124). | Say "staking page loading", to match the confirmed figure. | no |

## Decided (not raised again)
- "renders 1,800+ ERP programs" (summary sentence 2, SYSPRO bullet 3) counted as 1,891 menu items on a mock backend: keep-erp-programs-figure
- Previous-CV numbers "Forbes top 10" (Itjet bullet 1), "company income grew 10x" (OMO bullet 3), "tripled the number of new users" and "user engagement grew 4x" (Velas bullets 5 and 6); the Velas "2 minutes to 5 seconds" replacing "12x faster": keep-previous-cv-metrics
- Itjet bullets naming Aspiration, RegiStart, Fused and Wink: itjet-client-names
- Stack line on the older Clinical Trials Patient App entry: orion-stack-line
- AI agent wording at SYSPRO (bullet 1 "rules for AI agents that implement and review code against the specifications"; bullet 4 "AI agents as reviewers flagging rule violations ... for human decision", which describes their review role in the validation step, while bullet 1 gives the full role): ai-agents-wording, sdd-not-vibe-coding
- Feature detail in the Clinical Trials Patient App and Generative AI Jira Plugin entries (eCOA, Expo plus native Android, PRD uploads, MCP URL, Azure Blob): hidden-client-details-ok, hidden-clients
- The summary says "an automotive manufacturer's vehicle companion app" and names no companies: summary-no-company-names
- No "(Contract)" label on OMO Systems, Thermo Fisher Scientific and The Admasters: all-full-time
- No dates on the consulting entries: consulting-no-dates
