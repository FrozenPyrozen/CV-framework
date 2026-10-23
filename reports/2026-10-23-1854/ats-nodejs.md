---
schema_version: 1
rubric: ats
cv: cv/variants/nodejs/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass
score: 8.5
---

# AI ATS screener review

## Verdict
The Node.js variant parses cleanly, fits its profile (2 pages, 1,655 words; the profile allows 3 pages and 1,800 words) and now leads with full-stack evidence: the summary opens on "Node.js REST APIs, PostgreSQL and AWS", the current job opens with the 1,800+ ERP programs runtime, and the Jira plugin role is titled Full-Stack Engineer. It passes screens for balanced full-stack TypeScript / Node.js / React roles. It is still borderline for backend-heavy Node.js roles because of the known gap in recent production backend work (`gap-report.md`). No new high or medium findings. The new low findings are a domain label ("fintech") that doesn't match the projects it describes, and a few acronyms.

Build status: `npm run status` reports the CV current; `pdf-check.md` passes (2 pages, 1,008 and 654 words, fonts embedded), and the page-1 preview shows one column with Itjet's backend bullets on page 1.

Follow-up on the 2026-10-23-1705 report (changelog row 91):
- **ats-1** (PM2 and Nginx only in Skills): **decided**, `skills-only-in-skills-list`.
- **ats-2** (AWS Amplify, AppSync and Cognito only in Skills): **decided**, `skills-only-in-skills-list`. The gap report's AWS and GraphQL rows now record the 2026-10-22 confirmations, so that part is fixed.
- **ats-3** (summary opens with a frontend framing): **fixed**. Sentence 1 now reads "7+ years of TypeScript and JavaScript experience: Node.js REST APIs, PostgreSQL and AWS in fintech, blockchain and Jira integration projects, and React and React Native frontends", and SYSPRO opens with the runtime bullet (`syspro-runtime-bullet-first`).
- **ats-4** (PII, IoT, RPC not spelled out): **fixed**. "personally identifiable information (PII)" (cv.md:13), "Internet of Things (**IoT**)" (cv.md:86), "remote procedure call (RPC)" (cv.md:64).
- **ats-5** (The Admasters entry has no stack): **open**, tracked in `docs/open-items.md` ("Admasters stack"); not raised again.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names, one column, no tables, PDF text extractable, no forbidden characters (pdf-check passes; the header's stray "." is gone with `strip_header_text`). "CONSULTING AND FREELANCE PROJECTS" is non-standard but labeled "alongside full-time roles". |
| Contact details | pass | Name, headline, location, phone in international format (+380 97 891 9783), email and portfolio link on page 1, as the worldwide market shows them. |
| Dates and gaps | pass | One format ("Month YYYY - Month YYYY"), continuous from April 2019 to the present. Short tenures are decided (`all-full-time`); consulting has no dates by decision. |
| Seniority signals | pass | "Senior Full-Stack Engineer" headline; "Led the map team of 8 engineers"; "Owned the **frontend technology stack**"; "Owned the **system design**"; "Worked with the lead architect on the **platform and solution architecture**". Velas leadership detail is an open item. |
| Keywords in context | pass | Node.js, Express, Sequelize, PostgreSQL, AWS RDS, EC2, S3, Stripe, Docker, GraphQL, REST API, CI/CD, GitHub Actions, OIDC, OAuth 2.0, OpenTelemetry and Azure Blob Storage appear in bullets. Skills-only items are decided (`skills-only-in-skills-list`). Two acronyms are never spelled out (ats-2). |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "4 repositories". Older roles: 20% engagement, 15% fewer crashes, 2 minutes to 5 seconds, 5x less battery, 4x engagement, 2x database performance, 5 million users, 10x income. |
| Signs of AI padding | pass | Bullets name technologies and results. The Admasters bullets are generic but tracked as an open item. |
| Length | pass | 2 pages, 1,655 words against the profile's `max_pages: 3` and `max_words: 1800`; entries have 2 to 6 bullets. |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Full-Stack Engineer (TypeScript, Node.js, React) (profile `nodejs`) | pass | Headline matches the title exactly; summary sentence 1 leads with Node.js REST APIs, PostgreSQL and AWS; TypeScript, React 19 and Node.js in the current job; Express, Sequelize, PostgreSQL, AWS RDS, Stripe and Docker in Itjet bullets on page 1; Jira Forge Node.js resolvers under a "Full-Stack Engineer (Contract)" title. |
| Full-stack (Node-heavy) | borderline | Production Node.js work is from 2019-2023 (Itjet, Velas); the current job's Node.js work is a mock backend and a local OTLP receiver. No NestJS, MongoDB, Redis, queues, microservices or backend tests. All known in `gap-report.md`. |
| Senior Frontend / React Engineer | strong pass | React 19 / TypeScript runtime first in the current job, micro-frontends, OIDC, Vitest Browser Mode, Next.js SSR, KendoReact, Storybook. |
| Tech Lead / Frontend Architect | pass | Team of 8, code reviews, coding standards, system design, platform and solution architecture, frontend technology stack ownership. |
| Senior React Native / Mobile | pass | React Native at General Motors, Velas, Thermo Fisher, Itjet (Wink, 5M+ users) and the clinical-trials contract. |
| Native Android | likely filtered out | Android 14 / Gradle / Java work appears only in one undated contract entry; Kotlin only in Skills. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | low | cv/variants/nodejs/cv.md:13 (SUMMARY, sentences 1 and 2) | The summary tags the backend work as fintech: "Node.js REST APIs, PostgreSQL and AWS in fintech, blockchain and Jira integration projects" and "At a fintech company, built Node.js REST APIs for a Stripe subscription flow, set up PostgreSQL schema migrations and moved PostgreSQL to AWS RDS". The sources say otherwise: Fused is "a coach and athlete fitness app" and RegiStart "a non-profit start-up" (`summaries/itjet-fintech.md:41-42`), and Itjet "was a services company with several clients, not one fintech product" (decision `itjet-client-names`). An AI screener extracts "fintech" as domain experience for the backend work, which a fintech hiring manager may probe. See hr-1 for the recruiter side. | Name the setting truthfully, e.g. "At a software services company, built Node.js REST APIs for a Stripe subscription flow…", and in sentence 1 "in fitness, non-profit, blockchain and Jira integration projects" (or drop the domain list). Fintech stays true for Aspiration (frontend work). | no |
| ats-2 | low | cv/variants/nodejs/cv.md:22 (SYSPRO, bullet 1: "**ERP SaaS** modernization platform") and :192 (SKILLS, Domain: "Clinical trials (eCOA)") | Two acronyms are never spelled out: "SaaS" and "eCOA". ATS keyword matching for "software as a service" or "electronic clinical outcome assessment" misses them. ERP itself is spelled out in the summary. | "…for SYSPRO's software-as-a-service (**SaaS**) ERP modernization platform…"; in Skills "Clinical trials (electronic clinical outcome assessment, eCOA)" or just "Clinical trials". | no |

## Decided (not raised again)
- PM2 and Nginx, AWS Amplify, AppSync and Cognito, React Testing Library and Apollo Client appear only in Skills: skills-only-in-skills-list
- SYSPRO runtime bullet first, SDD bullet second: syspro-runtime-bullet-first
- "not ad-hoc AI code generation" in SYSPRO bullet 2 and the AI agent wording: ai-agents-wording (and sdd-not-vibe-coding)
- Playwright only in the SYSPRO Stack line, no end-to-end claim: playwright-browser-mode-only
- Portfolio URL shown as a Google Drive link: keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters, Thermo Fisher Scientific and OMO Systems with no "(Contract)" label: all-full-time
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): keep-title-step
- No dates in the consulting and freelance section: consulting-no-dates
- Summary names no employer and no timing: summary-no-company-names
- "React.js" next to "React 19" in Skills: keep-contact-and-keywords
- "1,800+ ERP programs": keep-erp-programs-figure
- "income grew 10x", "engagement grew 4x": keep-previous-cv-metrics
- Itjet client names (Fused, RegiStart, Aspiration, Wink): itjet-client-names

Known gaps from `gap-report.md`, not raised as findings: no production backend after 2023; AWS depth (backend AWS only 2019-2020); GraphQL server side unclear; no databases beyond PostgreSQL; no queues or backend microservices; no backend testing or API design evidence; the clinical-trials entry's 2 bullets are native Android (selection disagreement). Open items not raised: Admasters stack, Velas leadership, OMO leadership.
