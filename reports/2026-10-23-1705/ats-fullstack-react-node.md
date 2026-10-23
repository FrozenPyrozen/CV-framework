---
schema_version: 1
rubric: ats
cv: cv/variants/fullstack-react-node/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:05
verdict: pass
score: 8.0
---

# AI ATS screener review

## Verdict
The variant would pass an AI screener for Senior Full-Stack (React / Node.js) roles. It parses cleanly (pdf-check pass, 2 pages, readable text, embedded fonts), shows every contact field the worldwide market asks for, has no date gaps, and puts React, TypeScript, Node.js, Express, REST APIs, PostgreSQL, AWS RDS, Stripe, Next.js, GraphQL and Docker into bullets. Its weak spot is how recent the backend work is: the current job and General Motors show no backend bullets. That gap is already in `gap-report.md`. New findings: GraphQL (Apollo Client) at the clinical-trials contract is now confirmed hands-on but isn't in the CV, the Velas "Technical Leader" title has no leadership bullet, and some confirmed backend and deployment keywords (PM2, Nginx) appear only in Skills. There are about 158 words to spare, so these can be added.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES, plus "CONSULTING AND FREELANCE PROJECTS"), one column, no tables or text boxes. `pdf-check.md` passes (2 pages, 982 + 660 words, fonts embedded). The page images show clean single-column text. |
| Contact details | pass | Name, headline, phone in international format (`+380 97 891 9783`), email, location, availability and time-zone overlap are on page 1, as the worldwide market shows them (`show_phone`, `show_availability`, `show_time_zone_overlap` true). The portfolio link shows only as the text "Portfolio" (decided). |
| Dates and gaps | pass | One format ("December 2025 - Present"). Full-time roles run without gaps from April 2019 to now. The consulting section is labeled "alongside full-time roles". The short tenures (The Admasters 4 months, Thermo Fisher 5, OMO Systems 8) are decided. |
| Seniority signals | warning | Strong scope words at SYSPRO ("Owned the frontend technology stack", "platform and solution architecture"), General Motors ("Led the map team of 8 engineers", "Owned the system design"), OMO Systems and The Admasters (teams of 3). The Velas "Technical Leader" entry has only individual-contributor bullets (ats-2). For this headline, the only "Full-Stack" job titles are Itjet and The Admasters (2019-2020), so a title-match scorer leans on the summary and the bullets. Those are facts, not a wording problem. |
| Keywords in context | warning | The core full-stack set is in bullets: React, TypeScript, Node.js, Node.js REST APIs, Express, Sequelize, PostgreSQL, AWS RDS, EC2 / S3, Stripe, Next.js, SSR, GraphQL, Docker, CI/CD, GitHub Actions, OIDC, micro-frontends. GraphQL appears in context only for 2019-2020, although Apollo Client / GraphQL work from the clinical-trials contract is now confirmed (ats-1). PM2, Nginx, React Testing Library, Redux Toolkit and RxJS are confirmed hands-on but appear only in Skills (ats-3). WCAG and IoT are never spelled out (ats-5). |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "4 repositories". Earlier jobs: 20%, 15%, 95%, 2 minutes to 5 seconds, 5x, 4x, 10x, 2x (twice), 5 million users, up to 50%. |
| Signs of AI padding | pass | No filler words. Almost every bullet names a technology and an action or a result. One exception is The Admasters bullet 1, which has neither (ats-4). |
| Length | pass | 1,642 words (pdf-check: 982 + 660) against the profile's `max_words: 1800`, and 2 pages against `max_pages: 3`. Every entry has 2 to 6 bullets (profile limits 2 to 6, with the SYSPRO Stack line on top). |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Full-Stack Engineer (React / Node.js) (profile `fullstack-react-node`, this variant's headline) | pass | The React and TypeScript side is strong and current. Node.js REST APIs, Express, Sequelize, PostgreSQL / AWS RDS, Stripe, Next.js / GraphQL and Docker appear in bullets at Itjet. The Node.js staking backend work at Velas runs to 2023. Screeners that weight recent backend work will rank this below backend-led candidates (known gap, `gap-report.md`). |
| Full-stack (Node-heavy) | borderline | Same evidence. A Node-first job ad weighs the server side more heavily, and there is no backend bullet after 2023 (known gap). |
| Senior Full-Stack Engineer (TypeScript, Node.js, React) (profile `nodejs`) | borderline | Same as Full-stack (Node-heavy). This variant's headline helps less when the ad leads with Node.js. |
| Senior Frontend / React Engineer | strong pass | The current job is React 19 / TypeScript with micro-frontends, OIDC, Zustand, XState, TanStack, Vite, Vitest and Storybook. Next.js / SSR and a design system come from earlier jobs. |
| Senior React Engineer / Frontend Tech Lead (profile `react`) | strong pass | Same evidence, plus the General Motors team of 8, code-review standards and stack ownership at SYSPRO. |
| Tech Lead / Frontend Architect | pass | Team of 8 at General Motors, SDD process definition, architecture co-authoring and stack ownership at SYSPRO, system design at General Motors. The current title is "Senior Software Engineer" (decided). |
| Senior React Native / Mobile | pass | React Native at General Motors (team lead), Velas, Thermo Fisher, Itjet (Wink, 5M+ users) and the clinical-trials contract. This variant cuts mobile detail, so the React Native variant is the better file for those ads. |
| Senior React Native Engineer / Tech Lead (Mobile) (profile `react-native`) | pass | Same as Senior React Native / Mobile. Use the `react-native` variant for these roles. |
| Native Android | likely filtered out | Native Android shows only in the clinical-trials contract (Android 14 / SDK 34 migration, Java / Kotlin). There is no dated native Android role. This is a real gap, not a wording problem. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | medium | cv/variants/fullstack-react-node/cv.md:123 (Clinical Trials Patient App, bullet 1); cv.md:97 (Itjet, bullet 4) | GraphQL is one of the profile's `emphasize_tags`, but it appears in context only once: "Delivered web features for Aspiration with **Next.js** ... and **GraphQL**" (Itjet, 2019-2020). Since the gap report was written (2026-10-16), the clinical-trials summary records "Apollo Client 3, GraphQL" as **hands-on (confirmed by user 2026-10-22)** (`summaries/orion-mobile-clinical-ink.md:150`, `:206`). The gap report still says "used by the project", so it's out of date, and the CV doesn't use this evidence. The variant's clinical-trials bullet 1 names only "React Native, Expo and TypeScript". | Honestly addable. Add "**GraphQL** (**Apollo Client**)" to the clinical-trials bullet 1, citing `orion-mobile-clinical-ink#5`, about 4 words. Rebuild the gap report (`/tailor --profile fullstack-react-node`) so its GraphQL row reflects the confirmation. | no |
| ats-2 | medium | cv/variants/fullstack-react-node/cv.md:53-64 (Velas, title and all 5 bullets) | The title "Technical Leader" has no bullet behind it. Every bullet describes individual work ("Developed the Velas blockchain wallet", "Redesigned the staking-rewards calculation", "Set up GitHub Actions workflows"). Screeners that check titles against responsibilities may score the role as an individual contributor. `summaries/velas-wallet.md` still has `team_size_led: 0` and TODOs for leadership (lines 35, 45). This is the open item "Velas leadership" in `docs/open-items.md` (user: "later"). | When the user answers, record team size, code reviews or mentoring as a confirmed fact and fold an ownership clause into bullet 1. Until then, an ownership sentence from `velas-wallet` section 3 (architecture of the new wallet, CI/CD builds and signing) can open bullet 4 or 5 without new claims. | yes |
| ats-3 | medium | cv/variants/fullstack-react-node/cv.md:176, 178, 182 (SKILLS: "PM2", "Nginx", "Redux Toolkit", "RxJS", "React Testing Library") | These appear only in Skills, though the summaries record them as hands-on. PM2 and Nginx "for running and serving the Node.js services" (`summaries/itjet-fintech.md:172`, confirmed 2026-10-22), React Testing Library (`itjet-fintech.md:174`), Redux Toolkit and RxJS (`general-motors-navigation.md:128`; `orion-mobile-clinical-ink.md:148`). For a full-stack ad, PM2 and Nginx are the only deployment and runtime keywords besides Docker, and screeners give keywords that appear only in Skills little credit. | Honestly addable within the word limit (1,642 of 1,800). Add "deployed with **PM2** and **Nginx**" to Itjet bullet 1 or the RegiStart bullet (cv.md:91 or 101). Add "React Testing Library" to the testing list in Itjet bullet 3 (cv.md:95). Redux Toolkit and RxJS matter less for this profile and can wait. | no |
| ats-4 | low | cv/variants/fullstack-react-node/cv.md:108 (The Admasters, bullet 1) | "Redesigned a legacy codebase to speed up feature deployment." names no technology, no scope and no result, which reads as a generic bullet. Its source has nothing more (`summaries/admasters-ecommerce.md:64-66`; section 5 and other sections are TODO). | Ask the user for the stack, what changed and any result (for example, how much faster deploys got), and record it in the summary. Without that, the profile's minimum of 2 bullets still holds if this bullet is dropped. | yes |
| ats-5 | low | cv/variants/fullstack-react-node/cv.md:32 ("accessible typography per **WCAG**"), cv.md:82 ("**IoT healthcare** app") | Acronyms that are never spelled out. Skills has "Web accessibility (WCAG)", which still doesn't give the long form. Recruiter-written ads often use "Web Content Accessibility Guidelines" or "Internet of Things", so exact-match screeners may miss them. ERP, OIDC, SDD, SSR, eCOA, PRD and MCP are already spelled out. | Write "Web Content Accessibility Guidelines (WCAG)" and "Internet of Things (IoT)" at first use, about 6 words. | no |

## Decided (not raised again)
- In the PDF the portfolio URL shows only as the link text "Portfolio" (cv.md:8): keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters (4 months), Thermo Fisher Scientific (5 months) and OMO Systems (8 months), with no "(Contract)" label: all-full-time
- Title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO): keep-title-step
- Consulting and freelance entries show no dates: consulting-no-dates
- Unnamed clients ("Clinical Trials Patient App", "Generative AI Jira Plugin") are parsed as employer names: hidden-clients
- The summary names no employers and says nothing about timing ("Full-stack work at a fintech company and on a blockchain wallet"): summary-no-company-names
- The summary's SDD sentence: sdd-summary-sentence
- Playwright in the SYSPRO Stack line without an end-to-end bullet: playwright-browser-mode-only
- "React.js" next to "React 19" in Skills: keep-contact-and-keywords
- "company income grew 10x", "user engagement grew 4x" (numbers from the previous CV): keep-previous-cv-metrics

Already in `gap-report.md` (not raised as new findings): no sourced Node.js backend work after 2023; AWS only at Itjet 2019-2020; WebSockets and Docker only in the SYSPRO Stack line with thin bullet evidence; the selection disagreements (SYSPRO `#4.11` Node.js mock backend, Thermo Fisher `#4.5` OAuth 2.0 in place of `#4.4`).
