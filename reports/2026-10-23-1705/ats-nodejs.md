---
schema_version: 1
rubric: ats
cv: cv/variants/nodejs/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:05
verdict: pass-with-issues
score: 7.5
---

# AI ATS screener review

## Verdict
The Node.js variant parses cleanly and fits the profile's limits (2 pages, 1,625 words in the PDF; the profile allows 3 pages and 1,800 words). It passes screens for balanced full-stack TypeScript / Node.js / React roles. For backend-leaning Senior Node.js roles it stays borderline because the last production backend work is from 2023, a gap the gap report already lists. The new findings are small: a few honestly sourced backend and cloud keywords appear only in Skills, and the summary opens with a frontend framing.

Build status: `npm run status` reports the CV current; `pdf-check.md` passes (2 pages, 978 and 647 words, embedded fonts), and the page-1 preview shows a one-column layout.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES), one column, no tables, PDF text extractable, no forbidden characters (lint and pdf-check pass). "CONSULTING AND FREELANCE PROJECTS" is non-standard, but its undated client-label entries are covered by decisions. |
| Contact details | pass | Name, headline, location, phone in international format (+380 97 891 9783), email and portfolio link on page 1, as the worldwide market shows them. |
| Dates and gaps | pass | One format ("Month YYYY - Month YYYY"), no gaps between July 2019 and Present; the consulting section is labeled "alongside full-time roles". Short tenures are decided (all-full-time). |
| Seniority signals | pass | "Senior Full-Stack Engineer" headline, "Led the map team of 8 engineers", "Owned the frontend technology stack", "Owned the system design", "Worked with the lead architect on the platform and solution architecture". The Velas "Technical Leader" title still has no leadership bullet; that question is parked in `docs/open-items.md` (Velas leadership), so it isn't raised again here. |
| Keywords in context | warning | Node.js, Express, Sequelize, PostgreSQL, AWS RDS, Stripe, Docker, GraphQL, REST APIs, CI/CD, OIDC and OpenTelemetry all appear in bullets. PM2, Nginx, AWS Amplify, AppSync and Cognito are only in Skills, although the summaries record them as hands-on (ats-1, ats-2). |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "4 repositories". Older roles: 20% engagement, 15% fewer crashes, 2 minutes to 5 seconds, 4x engagement, 2x database performance, 5 million users. |
| Signs of AI padding | pass | Bullets name technologies and results. The two Admasters bullets are generic ("Redesigned a legacy codebase to speed up feature deployment.") with no technology (ats-5). |
| Length | pass | 2 pages and 1,625 PDF words against the profile's `max_pages: 3` and `max_words: 1800`; every entry has 2 to 6 bullets (`min_bullets_per_entry: 2`, `max_bullets_per_entry: 6`). |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Full-Stack Engineer (TypeScript, Node.js, React) (profile `nodejs`), balanced full-stack ads | pass | The headline matches the title exactly. TypeScript, React 19 and Node.js appear in the current job. Express, Sequelize, PostgreSQL, AWS RDS, Stripe, Docker and node-pg-migrate are in Itjet bullets, and Jira Forge Node.js resolvers are in a contract entry. |
| Senior Node.js / backend-leaning full-stack | borderline | Production Node.js work dates from 2019-2023 (Itjet, Velas). The current job's Node.js work is a mock backend and a local OTLP receiver. NestJS, MongoDB, Redis, message queues, microservices, Kubernetes and backend testing are missing. All of these are known gaps in `gap-report.md`. Recent job titles carry no "Backend" or "Full-Stack" wording; screeners that match titles find "Full-Stack Engineer" only at Itjet (2019-2020) and The Admasters. |
| Full-stack (Node-heavy) | borderline | Same reasons as the row above. |
| Senior Frontend / React Engineer | pass | React 19 / TypeScript runtime, micro-frontends, OIDC, Vitest Browser Mode and Next.js SSR are in bullets. This variant plays down frontend keywords on purpose (design systems, Storybook only in the Stack line and Skills). |
| Tech Lead / Frontend Architect | pass | Team of 8, code reviews, coding standards, system design, platform and solution architecture with the lead architect, and ownership of the technology stack. |
| Senior React Native / Mobile | pass | React Native at General Motors, Velas, Thermo Fisher, Itjet (Wink, 5M+ users) and the clinical-trials contract. |
| Native Android | likely filtered out | Native Android (Java / Kotlin, Android 14 migration) appears only in one undated contract entry. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | medium | cv/variants/nodejs/cv.md:97 (Itjet, bullet 4, RegiStart) and :172 (SKILLS, Backend and Cloud: "PM2, Nginx") | PM2 and Nginx are two backend-ops keywords that Node.js ads often name. In this CV they appear only in Skills. The master CV's RegiStart bullet has them in context ("a **Node.js** backend with **Sequelize** and **PostgreSQL** on **AWS RDS** behind **PM2** and **Nginx**", cv/Kirill_Kohan_CV.md:135, src `itjet-fintech#5`), but the variant's bullet comes from the `itjet-fintech#4.14` override `text` in `profiles/nodejs.yaml`, which predates that wording ("...on **AWS RDS**, **node-pg-migrate** migrations..."). The source is `summaries/itjet-fintech.md:172` ("PM2 process manager and Nginx for running and serving the Node.js services (hands-on, confirmed by user 2026-10-22)"). | Honestly addable. Update the override text in `profiles/nodejs.yaml` to match the master wording ("...on **AWS RDS** behind **PM2** and **Nginx**, **node-pg-migrate** migrations..."), add `itjet-fintech#5` to its sources, then rebuild the variant. That adds 4 words; the CV has 175 words of headroom. | no |
| ats-2 | medium | cv/variants/nodejs/cv.md:125 (Clinical Trials Patient App, bullet 3) and :172 (SKILLS: "Amazon Web Services (AWS: EC2, S3, RDS, Amplify, AppSync, Cognito)") | AWS Amplify, AppSync and Cognito appear only in Skills. No bullet in this variant ties them to a project, so screeners read the CV's AWS evidence as Itjet only (EC2, S3, RDS, 2019-2020). The clinical-trials summary records them as hands-on, along with GraphQL through Apollo Client (`summaries/orion-mobile-clinical-ink.md:150-154`, "hands-on (confirmed by user 2026-10-22)"). That is more recent AWS and GraphQL evidence than `gap-report.md` knows about: its AWS row says "No recent hands-on AWS work in any source", and its GraphQL row predates the confirmation. | Honestly addable. Extend clinical-trials bullet 3 with the client-side services it used, for example "...built with **React Native, Expo and TypeScript** on **GraphQL** (**Apollo Client**) and **AWS Amplify**, **AppSync** and **Cognito**, and its native...". Keep it clear that this is app-side use, not backend work. Decision `orion-stack-line` gives this entry a Stack line only in the master CV and the React Native variant, so use the bullet unless the user wants a Stack line here too. Rerun `/tailor --profile nodejs` so the gap report reflects the 2026-10-22 confirmations. | no |
| ats-3 | low | cv/variants/nodejs/cv.md:13 (SUMMARY, sentence 1) and :22 (SYSPRO, bullet 1) | The headline says "Senior Full-Stack Engineer (TypeScript, Node.js, React)", but the summary's first clause classes the candidate as frontend: "building TypeScript and JavaScript products, mostly React and React Native frontends, with hands-on Node.js backend work". The current job's first bullet then opens with "Delivered the frontend through...". AI screeners that pull a primary specialization from the opening lines will tag the CV as frontend, which pulls down the backend-leaning match. The wording is accurate. | User's choice. One option: keep the facts but lead with the full-stack span, for example "...building TypeScript and JavaScript products across React and React Native frontends and Node.js backends in fintech, blockchain and Jira integration projects". The first SYSPRO bullet is pinned by the profile, so its opening stays as it is. | yes |
| ats-4 | low | cv/variants/nodejs/cv.md:30 (SYSPRO, bullet 5: "strips sensitive data (PII)"), :82 (Thermo Fisher, bullet 1: "**IoT healthcare**"), :58 (Velas, bullet 3: "blockchain-node RPC fallback") | Acronyms that are never spelled out. The master CV already spells out PII ("personally identifiable information (**PII**)", cv/Kirill_Kohan_CV.md:34) and IoT ("Internet of Things (**IoT**)", :93), but the variant's text is older (PII) or comes from a bullet the variant doesn't select (IoT is spelled out in the OMO bullet). | Use the master's PII wording in SYSPRO bullet 5, write "Internet of Things (**IoT**) healthcare app" in Thermo Fisher bullet 1, and optionally "remote procedure call (RPC)". | no |
| ats-5 | low | cv/variants/nodejs/cv.md:104-110 (The Admasters, title and both bullets) | The title "Full-Stack Engineer and Team Leader" has two bullets with no technology or result ("Led a team of 3 software engineers and introduced **Agile** processes."; "Redesigned a legacy codebase to speed up feature deployment."). A Full-Stack title with no stack reads as padding to a screener. The summary lists only Next.js SSR and A/B testing, and "TODO (needs user input): other languages, backend and tools used" (`summaries/admasters-ecommerce.md`, section 5). | Ask the user which backend and tools were used at The Admasters and record them. Until then, name the stack in bullet 2 where the source allows it (e.g. the Next.js SSR e-commerce work, `admasters-ecommerce#4.3`). | yes |

## Decided (not raised again)
- In the PDF the portfolio URL appears only as the link text "Portfolio" (cv.md:8), so screeners that ignore hyperlinks can't read it: keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters (4 months), Thermo Fisher Scientific (5 months) and OMO Systems (8 months), with no "(Contract)" label: all-full-time
- Title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO): keep-title-step
- The consulting and freelance entries have no dates: consulting-no-dates
- The client labels "Clinical Trials Patient App" and "Generative AI Jira Plugin" are parsed as employer names: hidden-clients
- The summary names no employer and doesn't say which work is current: summary-no-company-names
- "React.js" next to "React 19" in Skills: keep-contact-and-keywords
- "not ad-hoc AI code generation" in SYSPRO bullet 1 reads as defensive: sdd-not-vibe-coding, ai-agents-wording
- Playwright appears only in the SYSPRO Stack line, with no end-to-end bullet: playwright-browser-mode-only

Known gaps from `gap-report.md`, not raised as findings: no production backend after 2023; no databases beyond PostgreSQL; WebSockets only in the SYSPRO Stack line; no message queues or backend microservices; no backend testing or API design evidence. The AWS-depth and GraphQL rows of the gap report are out of date; see ats-2.
