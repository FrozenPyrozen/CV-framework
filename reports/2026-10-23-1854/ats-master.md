---
schema_version: 1
rubric: ats
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass
score: 9.0
---

# AI ATS screener review (master CV)

## Verdict
Yes. An AI screener would parse this CV cleanly and pass it on for senior React, React Native and tech-lead roles. Full-stack React / Node.js roles also pass. Node-first backend roles stay borderline because the deep backend work is from 2019-2020. The build is current (`npm run status`: ok; `cv/pdf-check.md`: pass, 3 pages, 1,009 / 885 / 316 words, embedded Cambria). The Word page header now holds no text, so the 1 pt "." that parsers read first is gone.

Follow-up on the 2026-10-23-1705 findings:
- **ats-1** (Velas "Technical Leader" with no leadership bullet): **still open, but an open item.** The entry is unchanged (cv.md:66-86), and the question is in `docs/open-items.md` ("Velas leadership"), so it's not raised again.
- **ats-2** (recent Node.js backend evidence thin for Node-heavy roles): **still open.** Velas bullets 2 and 6, Jira bullet 1 and SYSPRO bullet 8 are unchanged in the master CV. No decision is recorded. Row 91 put the SYSPRO runtime bullet first in the `nodejs` and `fullstack-react-node` variants, which helps when those are sent, so it's carried forward below as ats-1.
- **ats-3** (React Testing Library only in Skills; RPC, TLS, MVP, SEO, R&D not spelled out): **fixed / decided.** All five acronyms are now spelled out (cv.md:72, 93, 110, 135, 150). React Testing Library in Skills only is decided (`skills-only-in-skills-list`).
- **ats-4** (1 pt "." in the page header): **fixed.** The template fix `strip_header_text` (row 91) left `word/header1.xml` of `cv/Kirill_Kohan_CV.docx` with only an empty text run. `pdf-check.md` notes the header was "emptied".
- **ats-5** (three bullets with no technology or result: GM second screen, Admasters A/B testing, Admasters legacy redesign): **still open, but open items.** The bullets are unchanged (cv.md:61, 146, 152). "Admasters stack" and "GM details" are in `docs/open-items.md`, so they're not raised again.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard headings (SUMMARY, EXPERIENCE, CONSULTING AND FREELANCE PROJECTS, EDUCATION, SKILLS, LANGUAGES), one column, no tables or text boxes. Dates are right-aligned on the company line. The page header text is now empty (`header1.xml`), so the stray "." is no longer the first parsed text. |
| Contact details | pass | Name, "+380 97 891 9783" (international format), email, "Kyiv, Ukraine (Remote)", availability and time-zone overlap are all on page 1, as `markets/worldwide.yaml` shows them. The email and portfolio are links. |
| Dates and gaps | pass | One format ("Month YYYY - Month YYYY"). Full-time roles run without gaps from April 2019 to "December 2025 - Present". The month-boundary overlaps are handovers. The consulting section says "Part-time contract and consulting work, alongside full-time roles". Short tenures and undated consulting are decided. |
| Seniority signals | pass | "Led the map team of 8 engineers", "Owned the system design", "Owned the frontend technology stack", "Worked with the lead architect on the platform and solution architecture", technical interviews and presales. Headline "Senior Software Engineer / Tech Lead". The Velas title with no lead bullet is an open item. |
| Keywords in context | pass | Core keywords are in bullets: React 19, React Native, React Native Web, TypeScript, Node.js, Express, REST APIs, Next.js, SSR, GraphQL, PostgreSQL, AWS RDS, Docker, Vitest, Playwright, Jest, Detox, Storybook, OIDC, OAuth 2.0, OpenTelemetry, micro-frontends. Acronyms are spelled out, except one partial ADR (ats-3). Skills that appear only in Skills are decided. |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "~17 component specifications", "4 repositories". Earlier: 20%, 15%, 95%, 2 minutes to 5 seconds, 5x, 3x, 4x, 10x, 30%, 20%, 2x, 5 million users. |
| Signs of AI padding | pass | Almost every bullet names a technology and a result. The few vague bullets are open items (GM details, Admasters stack). One Various Clients bullet is generic (ats-4). |
| Length | pass | 3 pages, about 2,204 visible words. Master length is decided (`keep-length`). |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Frontend / React Engineer | strong pass | The current job is React 19 / TypeScript: schema-driven runtime, micro-frontends, OIDC, KendoReact, Zustand, XState, TanStack, Vitest Browser Mode, Storybook, WCAG. Next.js / SSR, design systems and A/B testing appear earlier. 7+ years, senior title. |
| Senior React Native / Mobile | strong pass | React Native at General Motors (team of 8), Velas, OMO Systems, Thermo Fisher, Itjet (Wink, 5 million users) and the clinical-trials contract, plus Expo, Detox, Fastlane, Bitrise, BLE, Realm and React Native 0.76 / Expo SDK 52. |
| Tech Lead / Frontend Architect | pass | Team of 8, system design, stack ownership and ADR, architecture co-authoring, code-review standards, mentoring, interviewing. Held back slightly by the current "Senior Software Engineer" title (decided) and the Velas title with no lead bullet (open item). |
| Full-stack (Node-heavy) | borderline | Node.js is in bullets in seven entries. Express, Sequelize, REST APIs, PostgreSQL, AWS RDS and Stripe are at Itjet (2019-2020). Since then the Node.js work is short: staking-rewards redesign, Forge resolvers, a mock backend (ats-1). |
| Native Android | likely filtered out | Native Android is the clinical-trials contract (Android 14 / SDK 34, Java / Kotlin, Gradle 8) and one biometrics patch at OMO. No dated native Android role, and it's not a target role. |
| Senior React Engineer / Frontend Tech Lead (profile `react`) | strong pass | Same as Senior Frontend / React. GM team lead covers the lead half. |
| Senior React Native Engineer / Tech Lead (Mobile) (profile `react-native`) | strong pass | Same as Senior React Native / Mobile. |
| Senior Full-Stack Engineer (React / Node.js) (profile `fullstack-react-node`) | pass | The React side is strong. Node.js, Express, REST APIs and PostgreSQL are in bullets, but older (ats-1). |
| Senior Full-Stack Engineer (TypeScript, Node.js, React) (profile `nodejs`) | borderline | A Node-first screen weighs recent backend depth. Send the `nodejs` variant, not the master. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | medium | cv/Kirill_Kohan_CV.md:72, 80 (Velas, bullets 2 and 6); 184 (Generative AI Jira Plugin, bullet 1); 36 (SYSPRO, bullet 8) | Carried forward from 2026-10-23-1705 ats-2, unchanged and not decided. Backend evidence since 2021 is short: "Redesigned the staking-rewards calculation on the **Node.js** backend", "**Node.js** resolvers", "maintained a **Node.js** mock backend". The deep backend bullets (Express, Sequelize, PostgreSQL, AWS RDS, Stripe) are from Itjet, 2019-2020. Screeners that weigh recency rate Node-heavy roles borderline. | Honestly addable from the summaries, within the word limit: the Velas API work ("removing unused fields and adding filters and pagination", `summaries/velas-wallet.md`), and the Forge resolver calling the Jira REST API with validation and error handling (`summaries/designai-jira-plugin.md`). Or record a decision that the master stays as is and the `nodejs` / `fullstack-react-node` variants go to Node-first jobs. | yes |
| ats-2 | low | cv/Kirill_Kohan_CV.md:24 (SYSPRO, bullet 2) | "Owned the **frontend technology stack** (decision record, **ADR**)" doesn't spell ADR out in full. "Architecture decision records (ADR)" appears only in Skills (cv.md:250). A screener matching "architecture decision record" in a bullet won't find it. | Write "(architecture decision record, **ADR**)". It adds one word. | no |
| ats-3 | low | cv/Kirill_Kohan_CV.md:139 (Itjet, bullet 8); 131 (Itjet, bullet 4) | Two bullets are hard to parse into one claim. Bullet 8 has a doubled "with": "Delivered web features for Aspiration with **Next.js** with server-side rendering (SSR)". Bullet 4 joins two clients in one result: "Doubled delivery speed for Aspiration by introducing… and set up **CI/CD** (Bitbucket Pipelines, AWS EC2 / S3) for RegiStart", so the CI/CD setup reads as part of the Aspiration result. | Bullet 8: "Delivered web features for Aspiration in **Next.js** with server-side rendering (SSR) and **GraphQL**…". Bullet 4: end at the Aspiration result and move "set up CI/CD (Bitbucket Pipelines, AWS EC2 / S3)" into the RegiStart bullet (line 135). | no |
| ats-4 | low | cv/Kirill_Kohan_CV.md:197 (Various Clients, bullet 1); 207 (Various Clients, bullet 6) | Two consulting bullets name no technology and read as generic to padding detectors: "reducing operational costs by up to 50% through refactoring core apps, adding caching and writing unit tests" (no stack) and "Acted as a JavaScript subject-matter expert for large enterprise clients: technical consulting and educational webinars." | Name the stack in bullet 1 if the summary records it (e.g. React / Node.js). Shorten or merge bullet 6 into bullet 2 (technical interviews) to save words. | yes |
| ats-5 | low | cv/Kirill_Kohan_CV.md:250 (SKILLS, Leadership and Methodologies) | "Figma, Jira" sit in "Leadership and Methodologies". Some parsers map Skills sub-headings to categories, so tools filed as methodologies may be misclassified. | Move "Figma" and "Jira" to the DevOps line (or a short "Tools" line). | no |

## Decided (not raised again)
- React Testing Library, PM2, Nginx, Apollo Client, Amplify, AppSync, Cognito and native modules only in Skills (earlier ats-3): skills-only-in-skills-list
- Portfolio URL shown only as the link text "Portfolio": keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters, Thermo Fisher Scientific and OMO Systems with no "(Contract)" label: all-full-time
- Title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO): keep-title-step
- Consulting and freelance entries show no dates: consulting-no-dates
- Summary names no employer and no timing: summary-no-company-names
- CV length (about 2,200 words, 3 pages): keep-length
- "React.js" next to "React 19" in Skills: keep-contact-and-keywords
- Stack line on the older clinical-trials contract: orion-stack-line
- Playwright at SYSPRO only as the Vitest Browser Mode provider: playwright-browser-mode-only
- SDD bullet first at SYSPRO in the master CV: syspro-runtime-bullet-first
- "1,800+ ERP programs" and SYSPRO platform detail: keep-erp-programs-figure
- HERE truck navigation app and car navigation PoC in the General Motors entry: gm-project-names, gm-features-public
- Already in `docs/open-items.md`, not raised as findings: Velas leadership (earlier ats-1), GM details and Admasters stack (earlier ats-5)
