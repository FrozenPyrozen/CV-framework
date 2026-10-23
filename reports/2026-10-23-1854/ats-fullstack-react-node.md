---
schema_version: 1
rubric: ats
cv: cv/variants/fullstack-react-node/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass
score: 8.5
---

# AI ATS screener review

## Verdict
The variant would pass an AI screener for Senior Full-Stack (React / Node.js) roles. It parses cleanly (pdf-check pass, 2 pages, fonts embedded), shows every contact field the worldwide market asks for, has no date gaps, and puts React, TypeScript, Node.js, Express, Sequelize, REST APIs, PostgreSQL, AWS RDS, Stripe, Next.js, GraphQL and Docker into bullets. The summary now opens with "Senior full-stack engineer", and the current job leads with a measured, technology-rich bullet. The remaining weak spot is how recent the backend work is (no Node.js bullet after 2023), which is already in `gap-report.md`. The only new finding is low: "CI/CD" is never spelled out.

Build: current (`npm run status`: everything is up to date). Reviewed the Markdown and `cv/variants/fullstack-react-node/pdf-check.md` (pass, 2 pages, 1,043 + 715 words).

**Earlier findings (`reports/2026-10-23-1705/ats-fullstack-react-node.md`):**
- **ats-1** (GraphQL / Apollo Client from the clinical-trials contract not in a bullet): **still open for GraphQL, decided for Apollo Client.** The clinical-trials bullet 1 (cv.md:127) still names only "React Native, Expo and TypeScript". Apollo Client stays in Skills by decision `skills-only-in-skills-list`. The GraphQL suggestion is now tracked in `gap-report.md` (GraphQL row, citing this finding), so it isn't raised again here.
- **ats-2** (Velas "Technical Leader" title with no leadership bullet): **still open**, tracked as the open item "Velas leadership" in `docs/open-items.md`. Not raised again.
- **ats-3** (PM2, Nginx, React Testing Library, Redux Toolkit, RxJS only in Skills): **decided**, `skills-only-in-skills-list`.
- **ats-4** (The Admasters bullet 1 "Redesigned a legacy codebase to speed up feature deployment." is generic): **still open**, unchanged at cv.md:112; now tracked as the open item "Admasters stack". Not raised again.
- **ats-5** (WCAG and IoT not spelled out): **fixed**. cv.md:32 has "Web Content Accessibility Guidelines (**WCAG**)" and cv.md:86 has "Internet of Things (**IoT**)".

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES, plus "CONSULTING AND FREELANCE PROJECTS"), one column, no tables or text boxes. `pdf-check.md` passes with no failures; the header's stray text is stripped (template fix in changelog row 91). |
| Contact details | pass | Name, headline, phone in international format ("+380 97 891 9783"), email, location, availability and time-zone overlap on page 1, as the worldwide market shows them. The portfolio link shows as "Portfolio" (decided). |
| Dates and gaps | pass | One format ("December 2025 - Present"). Full-time roles run without gaps from April 2019 to now; the consulting section says "alongside full-time roles". Short tenures (The Admasters 4 months, Thermo Fisher 5, OMO Systems 8) are decided. |
| Seniority signals | warning | Strong scope words at SYSPRO ("Worked with the lead architect on the platform and solution architecture", "Owned the frontend technology stack"), General Motors ("Led the map team of 8 engineers", "Owned the system design") and in the summary. The Velas "Technical Leader" entry still has only individual-contributor bullets (open item "Velas leadership"). |
| Keywords in context | pass | The full-stack set is in bullets: React, TypeScript, Node.js REST APIs, Express, Sequelize, PostgreSQL, AWS RDS, EC2 / S3, Stripe, Next.js, SSR, GraphQL, Docker, CI/CD, GitHub Actions, OIDC, micro-frontends, and the Jira plugin's Node.js resolvers. Acronyms are spelled out at first use (ERP, OIDC, SDD, WCAG, IoT, RPC, MVP, SSR, SEO, eCOA, PRD, MCP), except CI/CD (ats-1). Skills-only items are decided. |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "4 repositories". Earlier: 20%, 15%, 2 minutes to 5 seconds, 5x, 4x, 10x, 2x (twice), 5 million users, up to 50%. |
| Signs of AI padding | pass | No filler words. Almost every bullet names a technology and an action or a result; the exception is The Admasters bullet 1 (open item). |
| Length | pass | About 1,758 words (pdf-check: 1,043 + 715) against `max_words: 1800`, 2 pages against `max_pages: 3`; every entry has 2 to 6 bullets. Only about 40 words are left, so additions need a matching cut. |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Full-Stack Engineer (React / Node.js) (profile `fullstack-react-node`, this headline) | pass | Exact headline match; the summary now opens "Senior full-stack engineer" and names Node.js REST APIs, Stripe, PostgreSQL on AWS RDS, a Node.js backend, Next.js with GraphQL and Docker. Screeners weighting recent backend work will rank it below backend-led candidates (known gap). |
| Full-stack (Node-heavy) | borderline | Same evidence; no Node.js bullet after 2023 (known gap in `gap-report.md`). |
| Senior Frontend / React Engineer | strong pass | The current job is React 19 / TypeScript with micro-frontends, OIDC, Zustand, XState, TanStack Router, Vite, Vitest and Storybook, now led by the runtime bullet. |
| Tech Lead / Frontend Architect | pass | Team of 8, system design, frontend stack ownership, architecture work with the lead architect, code reviews and standards. Titles at SYSPRO and Velas give mixed signals (decided title step; Velas open item). |
| Senior React Native / Mobile | pass | React Native at General Motors, Velas, Thermo Fisher, Itjet (Wink) and the clinical-trials contract; this variant's headline points elsewhere, so a mobile ad matches on bullets, not the title. |
| Native Android | likely filtered out | Only the clinical-trials contract (Android 14 / SDK 34 migration, Java / Kotlin); no dated native Android role. A real gap, not a wording problem. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | low | cv/variants/fullstack-react-node/cv.md:97, cv.md:101 (Itjet, bullets 2 and 4) | "**CI/CD**" appears in two bullets ("push notifications, **CI/CD**", "set up **CI/CD** (Bitbucket Pipelines, AWS EC2 / S3)") and in Skills, but is never spelled out, while every other acronym now is. Job ads often write "continuous integration and delivery", which an exact-match screener may not link to "CI/CD". | At the first use (cv.md:97 or cv.md:101), write "continuous integration and delivery (**CI/CD**)", about 4 words; take them from the 40-word margin. | no |

## Decided (not raised again)
- PM2, Nginx, React Testing Library, Apollo Client, Redux Toolkit and other hands-on skills only in Skills (earlier ats-3, part of ats-1): `skills-only-in-skills-list`
- SYSPRO runtime bullet first, SDD bullet second: `syspro-runtime-bullet-first`
- The portfolio URL shows only as the link text "Portfolio" (cv.md:8): `keep-portfolio-link`
- No LinkedIn or GitHub link in the header: `no-profile-links`
- Short tenures at The Admasters, Thermo Fisher Scientific and OMO Systems, with no "(Contract)" label: `all-full-time`
- Title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO): `keep-title-step`
- Consulting and freelance entries show no dates: `consulting-no-dates`
- The summary names no employers and no timing: `summary-no-company-names`
- Playwright in the SYSPRO Stack line without an end-to-end bullet: `playwright-browser-mode-only`
- "React.js" next to "React 19" in Skills: `keep-contact-and-keywords`
- "company income grew 10x", "user engagement grew 4x": `keep-previous-cv-metrics`
- "1,800+ ERP programs": `keep-erp-programs-figure`

Already tracked (not raised as new findings): no Node.js backend work after 2023, AWS hands-on only at Itjet, GraphQL in the clinical-trials bullet, WebSockets only in the SYSPRO Stack line, the Admasters stack, and the selection disagreements (`gap-report.md`); Velas leadership and Admasters stack (`docs/open-items.md`).
