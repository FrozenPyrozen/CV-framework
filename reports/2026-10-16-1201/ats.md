---
schema_version: 1
rubric: ats
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-16T12:01
verdict: pass
score: 8.5
---

# AI ATS screener review

## Verdict
The CV passes an AI screener for its target roles: it parses cleanly (pdf-check pass, 3 pages, readable text, embedded fonts), has complete contact details on page 1, continuous dates and strong React, React Native and TypeScript keywords in context with measured results in the current job. The remaining issues are a "Technical Leader" title without leadership evidence, a few Skills entries with no bullet behind them and some acronyms that are never spelled out.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES), one column, no tables or text boxes; `cv/pdf-check.md` passes with readable text on all 3 pages; no forbidden characters in the Markdown. |
| Contact details | pass | Name, phone in international format (`+380 97 891 9783`), email and location on page 1, as the worldwide market shows them (`show_phone: true`). The portfolio URL shows only as the link text "Portfolio" in the PDF (decided, see below). |
| Dates and gaps | pass | One format ("December 2025 - Present"); full-time roles run continuously from April 2019 to now with no gaps; the consulting section is labeled "alongside full-time roles". Three short tenures (The Admasters 4 months, Thermo Fisher 5 months, OMO Systems 8 months) are a known risk, already decided. |
| Seniority signals | warning | Strong at SYSPRO ("Owned the frontend technology stack", "platform and solution architecture") and General Motors ("Led a team of 8 developers", "Owned the system design"), but the Velas "Technical Leader" entry has no leadership or ownership bullet, and the OMO Systems "Team Leader" entry gives no team size. |
| Keywords in context | warning | Core stack (React 19, React Native, TypeScript, Node.js, Next.js, Vitest, Playwright, OIDC, OpenTelemetry) appears in bullets; WebSockets, Architecture decision records (ADR), Native Modules (iOS/Android), Styled Components, Redux Thunk, React Testing Library and Keychain appear only in Skills; ERP, WCAG, eCOA, OTLP and PRD are never spelled out. |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "~17 component specifications", "4 repositories". Earlier roles: 20%, 15%, 95%, 12x, 5x, 3x, 4x, 10x, 30%, 2x, up to 50%. |
| Signs of AI padding | pass | No filler words; bullets name a technology and an action or result. The SYSPRO SDD bullets are specific (templates, validation routine, spec-to-code drift) rather than generic. |
| Length | pass | About 2,010 words (limit 2,200) and 3 pages (limit 4); decision `keep-length` covers the master CV's length. |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Frontend / React Engineer | strong pass | Current job is React 19 / TypeScript with micro-frontends, OIDC, KendoReact, Zustand, XState, TanStack, Vitest and Playwright; senior title; 7+ years. |
| Senior React Native / Mobile | strong pass | React Native at General Motors (team lead), Velas, Thermo Fisher, Itjet and the clinical-trials contract; Expo, Detox, Fastlane, Bitrise, BLE, Realm, Android 14 migration. The current job is web-only, so mobile recency stops at November 2025, which is minor. |
| Tech Lead / Frontend Architect | pass | Team of 8 led at General Motors, architecture co-authoring and stack ownership at SYSPRO, system design, code-review standards, technical interviewing. The current title is "Senior Software Engineer" (decided) and the Velas "Technical Leader" title lacks leadership evidence (ats-1). |
| Full-stack (Node-heavy) | borderline | Node.js appears in bullets (SYSPRO mock backend, Velas staking-rewards backend, Itjet REST APIs, Jira Forge resolvers) and PostgreSQL / AWS RDS at Itjet, but no backend framework (Express, NestJS) is named and the database work is from 2019-2020. Screeners scoring backend depth will rank this below backend-led candidates. |
| Native Android | likely filtered out | Native Android work is limited to the clinical-trials contract (Android 14 / SDK 34 migration, Java / Kotlin) and one biometrics patch at OMO Systems; no dated native Android role, Kotlin appears once. A real gap, not a wording problem. |
| Senior React Engineer / Frontend Tech Lead (profile `react`) | strong pass | Same evidence as Senior Frontend / React; the tech-lead half is carried by the General Motors team of 8. |
| Senior React Native Engineer / Tech Lead (Mobile) (profile `react-native`) | strong pass | Same evidence as Senior React Native / Mobile plus the General Motors team lead. |
| Senior Full-Stack Engineer (React / Node.js) (profile `fullstack-react-node`) | pass | React side is strong; Node.js is present in four entries' bullets, but backend depth is thinner than the frontend (see Full-stack row). |
| Senior Full-Stack Engineer (TypeScript, Node.js, React) (profile `nodejs`) | borderline | A Node-first headline makes screeners weigh backend evidence more heavily; same gaps as the Full-stack (Node-heavy) row. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | medium | cv/Kirill_Kohan_CV.md:64-84 (Velas, title and all bullets) | The title "Technical Leader" has no supporting bullet: all nine bullets are individual contributions ("Developed the Velas blockchain wallet", "Made the staking list load 12x faster"). Screeners that check titles against responsibilities may score this role as IC, and the summary (`summaries/velas-wallet.md`) still has "TODO (needs user input): ownership areas, leadership and process responsibilities". | Ask the user what the lead role covered at Velas (team size, code reviews, architecture or release ownership, hiring) and record it as a confirmed fact, then add one leadership bullet first in the entry. | yes |
| ats-2 | medium | cv/Kirill_Kohan_CV.md:228, 236/242, 226 (SKILLS: "WebSockets", "Architecture decision records (ADR)", "Native Modules (iOS/Android)") | These keywords appear only in Skills, though the summaries support them: WebSockets is hands-on at SYSPRO (`summaries/syspro-saas-erp.md:232`), the SYSPRO stack ownership was recorded in a "technology-stack decision record" (`summaries/syspro-saas-erp.md:96`), and native modules are behind Thermo Fisher 4.2 and OMO Systems 4.4. Screeners that weight in-context keywords give them little credit. | Honestly addable: name "WebSockets" in a SYSPRO bullet (real-time communication in the host runtime), say "technology-stack decision record (ADR)" in SYSPRO bullet 2, and call the rewritten libraries "native modules" in Thermo Fisher bullet 2 and the OMO Systems biometrics bullet. | no |
| ats-3 | medium | cv/Kirill_Kohan_CV.md:224, 226, 228, 234 (SKILLS: "Styled Components", "Keychain", "Redux Thunk", "React Testing Library") | These Skills entries have no bullet and no hands-on source in a summary (Redux Thunk appears only as "used by the project" in `summaries/orion-mobile-clinical-ink.md:139`; React Testing Library only as the tool replaced at SYSPRO). A screener or interviewer asking "where did you use this?" finds nothing. | Ask the user where each was used hands-on; add it to that entry's bullet or Stack line if confirmed, otherwise consider dropping it from Skills. | yes |
| ats-4 | low | cv/Kirill_Kohan_CV.md:13, 26 ("ERP SaaS"), 32 ("WCAG"), 159 ("clinical trial (eCOA)"), 34 ("OTLP exporter"), 178 ("PRD") | Acronyms that are never spelled out. Recruiter-written job ads often use the long form (Enterprise Resource Planning, Web Content Accessibility Guidelines, electronic Clinical Outcome Assessment), so exact-match screeners can miss them. | Spell out once at first use: "enterprise resource planning (ERP)", "Web Content Accessibility Guidelines (WCAG)", "electronic clinical outcome assessment (eCOA)", "OpenTelemetry Protocol (OTLP)", "product requirements document (PRD)". | no |
| ats-5 | low | cv/Kirill_Kohan_CV.md:99 (OMO Systems, bullet 5) | "Led and mentored the development team" gives no team size, while General Motors ("team of 8") and The Admasters ("team of 3") do; screeners extracting team size get nothing for a "Team Leader" title. `summaries/omo-systems-smart-home.md:40` has "TODO (needs user input): team size". | Ask the user for the team size at OMO Systems and add it ("Led and mentored a team of N developers"). | yes |

## Decided (not raised again)
- Portfolio URL appears only as the link text "Portfolio" in the PDF, so screeners that ignore hyperlinks can't read it (cv/Kirill_Kohan_CV.md:8): keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters (4 months), Thermo Fisher Scientific (5 months) and OMO Systems (8 months), with no "(Contract)" label: all-full-time
- Title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO): keep-title-step
- Consulting and freelance entries show no dates: consulting-no-dates
- Unnamed clients ("Clinical Trials Patient App", "Generative AI Jira Plugin"): hidden-clients
- CV length (about 2,000 words, 3 pages): keep-length
