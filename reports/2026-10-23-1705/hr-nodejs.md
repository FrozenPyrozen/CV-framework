---
schema_version: 1
rubric: hr
cv: cv/variants/nodejs/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:06
verdict: pass-with-issues
score: 7.5
---

# HR recruiter review

## Verdict
Yes, a recruiter screening for Senior Node.js or backend-leaning full-stack roles would probably shortlist this CV for a first call. The headline names Node.js, the summary's second sentence gives concrete backend results (Node.js REST APIs with Stripe, PostgreSQL on AWS RDS, 2x database performance), Itjet and Velas back them up on page 1, and the hiring setup is clear. The weak point for this audience is the framing: the summary's first sentence says "mostly React and React Native frontends", and the current job's first bullet starts with "Delivered the frontend". A backend recruiter reading quickly sees "frontend developer" before the Node.js evidence. Length is within the profile (2 pages against `max_pages: 3`; 978 + 647 = 1,625 words against `max_words: 1800`).

Build: current (`npm run status`: everything is up to date). Reviewed the Markdown, `cv/variants/nodejs/pdf-check.md` (pass, 2 pages) and `preview/page-1.png`, `preview/page-2.png`.

## First-10-seconds impression
- **Good:** The headline "Senior Full-Stack Engineer (TypeScript, Node.js, React)" (cv.md:4) matches the target role. Location, remote, "Open to B2B contract or full-time employment" and the time-zone overlap are in the header (cv.md:6).
- **Good:** Known names on page 1 (SYSPRO, General Motors, Thermo Fisher Scientific), "Led a team of 8 engineers", 7+ years with dates running continuously from April 2019 to the present.
- **Good:** The summary's second sentence (cv.md:13) is the strongest backend text in the CV: "built Node.js REST APIs for a Stripe subscription flow, set up PostgreSQL schema migrations and moved PostgreSQL to AWS RDS and tuned slow queries, doubling database performance". The Itjet entry, titled "Full-Stack Engineer" (cv.md:87), backs it up on page 1 with Express, Sequelize, Stripe, PostgreSQL, AWS RDS and Docker.
- **Bad:** The first sentence of the summary sets the story as frontend: "mostly React and React Native frontends, with hands-on Node.js backend work" (cv.md:13). That is honest, but it is the first thing a backend recruiter reads.
- **Bad:** The current job opens with "Delivered the frontend through architecture-governed specification-driven development (SDD)…" (cv.md:22), a 50-word process bullet. The only Node.js work at SYSPRO is a "mock backend" and a "local Node.js OTLP receiver" (cv.md:28, cv.md:30), which a backend recruiter will read as dev tooling.
- **Neutral:** Page 2 has four mobile bullets in a row for the clinical-trials contract (Android 14, Gradle, SQLCipher, React Native Testing Library), which say nothing to a Node.js reader. The Jira plugin entry, which does have Node.js, is titled "Frontend Engineer (Contract)".

## Strengths
- The headline and summary name the target stack (TypeScript, Node.js, React), and the summary gives backend results with numbers before any frontend detail beyond sentence 1.
- Itjet is a solid full-stack entry: Node.js REST APIs (Express, Sequelize), Stripe payments, PostgreSQL on AWS RDS with 2x database performance, node-pg-migrate migrations, Docker, CI/CD on AWS, a RegiStart MVP built from sketches, and Wink with more than 5 million registered users.
- Velas adds backend and performance work: Node.js staking-rewards redesign (engagement grew 4x) and staking page loading cut "from 2 minutes to 5 seconds" by moving filtering to the server.
- Security and observability, which backend hiring managers value: OIDC, zero-trust micro-frontends, OpenTelemetry with PII redaction, OAuth 2.0, a reverse-tabnabbing fix.
- Leadership with sizes (team of 8 at General Motors, about 3 at OMO Systems, 3 at The Admasters), code reviews and technical interviewing.
- The length fits the profile: 2 pages, about 1,600 words, with the strongest backend entries (Itjet, Velas) on page 1.
- Master's with an Honors Diploma, PhD in progress, English C1.

## Questions the recruiter will ask
1. **"When did you last build a production backend? What does your Node.js work at SYSPRO involve?"**
   *Why:* At SYSPRO the Node.js work is a "mock backend" and a "local Node.js OTLP receiver" (cv.md:28, cv.md:30). The production backend work is at Itjet (2019 to 2020) and Velas (2021 to 2023). This gap is already in `gap-report.md` ("Recent Node.js backend in production"), so it is a question to prepare, not a new finding.
   *Prepare:* Itjet and Velas as the production backend work (Express REST APIs, Stripe, PostgreSQL on RDS, the staking-rewards calculation), the Jira Forge Node.js resolvers in TypeScript (cv.md:134), and what the SYSPRO mock backend does (smart-tag fixtures and view-management routes so frontend features could be built before the real backend existed). If there is backend work after 2023 (gap report: "the user will add later"), add it with `/add-experience` first.
2. **"Are you a frontend engineer applying for backend roles? What split of frontend and backend do you want?"**
   *Why:* The summary says "mostly React and React Native frontends" (cv.md:13), the current job opens with "Delivered the frontend" (cv.md:22), and the Jira plugin entry is titled "Frontend Engineer (Contract)" (cv.md:131).
   *Prepare:* Say clearly that you want full-stack TypeScript work with more backend, and point to the backend results in the summary.
3. **"Which databases have you used besides PostgreSQL? Have you worked with Redis, MongoDB, queues or microservices?"**
   *Why:* Backend job ads usually list these. The CV shows PostgreSQL only (cv.md:172). Already in `gap-report.md` ("Databases beyond PostgreSQL", "WebSockets, message queues, microservices").
   *Prepare:* Answer truthfully. If you have used any of these, record them with `/add-experience`.
4. **"Did you build the GraphQL API, or only call it? What did you do with AppSync and Cognito?"**
   *Why:* "used GraphQL" (cv.md:101) and Skills list "Amplify, AppSync, Cognito" (cv.md:172). Already in `gap-report.md` (GraphQL client or server unclear; AppSync used by the project, not hands-on).
   *Prepare:* Say which side you worked on and what you did hands-on.
5. **"Your LinkedIn says Kyrylo Kokhan. Is that you?"**
   *Why:* The CV says "Kirill Kohan" (cv.md:2); the legal name and LinkedIn handle differ (`profile.yaml`).
   *Prepare (decided, `keep-cv-name`):* "Kirill is the name I use at work; my legal name, as in my passport, is Kyrylo Kokhan."
6. **"You had contracts alongside full-time jobs and a PhD. How did that fit?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" (cv.md:114); PhD 2023 to 2027 (cv.md:154).
   *Prepare:* Open item "Side work" in `docs/open-items.md` (parked).
7. **"How would we hire you, and what is your notice period?"**
   *Why:* "Open to B2B contract or full-time employment" from Kyiv (cv.md:6); "December 2025 - Present" (cv.md:20).
   *Prepare:* Open items "Hiring route" and "Notice period" in `docs/open-items.md` (parked).
8. **"Why are you looking after about 10 months at SYSPRO?"**
   *Why:* "December 2025 - Present" (cv.md:20), after a Team Leader title at General Motors (the title step itself is decided, `keep-title-step`).
   *Prepare:* Your real reason; for this CV, "I want more backend and full-stack ownership" fits the story.
9. **"How many people did you lead as Technical Leader at Velas?"**
   *Why:* The Velas entry (cv.md:51-64) has no leadership bullet.
   *Prepare:* Open item "Velas leadership" in `docs/open-items.md`.
10. **"How do you keep working through power or internet outages in Kyiv?"**
    *Why:* Commonly asked of Ukraine-based remote candidates.
    *Prepare:* Open item "Outages" in `docs/open-items.md` (parked).

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "with each subsystem traced from architecture to code across 4 repositories" | cv.md:22 (SYSPRO, bullet 1) | "checking each part of the product against its plan, across 4 code repositories" |
| "drove open questions to decisions" | cv.md:24 (SYSPRO, bullet 2) | "got open design questions decided" |
| "ERP smart-tag fixtures and view-management routes" | cv.md:28 (SYSPRO, bullet 4) | "test data and API routes for ERP screens" |
| "event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter" | cv.md:30 (SYSPRO, bullet 5) | "a module that records how the app is used and removes personal data before sending it" (keep OpenTelemetry for ATS) |
| "in a zero-trust, independently deployable micro-frontend architecture" | cv.md:32 (SYSPRO, bullet 6) | "in a secure setup where each part of the app is released on its own" |
| "a blockchain-node RPC fallback" | cv.md:58 (Velas, bullet 3) | "a backup connection to the blockchain" |
| "reverse tabnabbing vulnerability" | cv.md:62 (Velas, bullet 5) | "a security flaw that let opened links take over the original page" |
| "exact-alarm and PendingIntent behavior changes" | cv.md:121 (Clinical Trials Patient App, bullet 1) | "Android 14 changes to alarms and notifications" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:13 (Summary, sentence 1) | For a Node.js audience, the summary opens on frontend: "building TypeScript and JavaScript products, mostly React and React Native frontends, with hands-on Node.js backend work in fintech, blockchain and Jira integration projects." This is the first sentence a backend recruiter reads after the headline, and it frames the candidate as a frontend engineer who has done some backend work, which undercuts the "Full-Stack (TypeScript, Node.js, React)" headline. | Keep it honest but lead with what fits the role. For example: "Senior full-stack engineer and tech lead with 7+ years of TypeScript and JavaScript experience: Node.js REST APIs, PostgreSQL and AWS in fintech, blockchain and Jira integration projects, and React and React Native frontends." Every part has a source already (calc:years_experience, itjet-fintech#4.6, #4.4, velas-wallet#4.6, designai-jira-plugin#4.1). The user decides how strongly to state the frontend share. | yes |
| hr-2 | medium | cv.md:22-28 (SYSPRO, bullets 1 to 4) | The current job, the most-read entry, starts with "Delivered the frontend through architecture-governed specification-driven development (SDD)…", about 50 words of process terms, followed by an architecture bullet and the React runtime. The only Node.js bullet ("Maintained a Node.js mock backend…") is fourth. A backend recruiter learns first that the current job is frontend, then has to read past jargon to find any backend work. The SDD framing is decided (`sdd-not-vibe-coding`), but the order is set in `profiles/nodejs.yaml` (pins 4.2, 4.3, 4.1, 4.11), not in `facts/decisions.yaml`. | For this variant, consider putting the architecture bullet (4.3) or the 1,800+ ERP programs bullet (4.1) first and SDD second, and shorten the tail of the SDD bullet (see the wording table). Also consider describing the mock backend by what it does ("a Node.js backend service the frontend team developed and tested against") so "mock" isn't the first word. Order is the user's choice (profile pins, 2026-10-16). | yes |
| hr-3 | low | cv.md:13 (Summary, sentence 4) | "That work also covered OpenID Connect (OIDC) authentication, OpenTelemetry browser telemetry with PII redaction and a Node.js mock backend." Naming a mock backend in the summary of a Node.js CV draws attention to the fact that the current backend work isn't production, and the sentence is a keyword list. The summary is about 150 words in one dense paragraph, which is long for a 10-second skim. | Drop "and a Node.js mock backend" from the summary (it stays in the SYSPRO entry), or drop the whole sentence. This leaves the summary on the backend results and the team of 8. | no |
| hr-4 | low | cv.md:131 (Generative AI Jira Plugin, title) | The entry is titled "Frontend Engineer (Contract)", but its first bullet is "Built an Atlassian Jira Forge app from scratch with Node.js resolvers in TypeScript and a React UI". In a Node.js CV, the title hides the backend part and adds to the "frontend engineer" impression (hr-1). | If the contract's actual scope was full-stack, confirm the title (for example "Full-Stack Engineer (Contract)") as a fact with `/add-experience`; if "Frontend Engineer" was the real title, keep it. | yes |
| hr-5 | low | cv.md:121-127 (Clinical Trials Patient App, bullets 1 to 4) | Four mobile-only bullets (Android 14 SDK 34, Gradle 8, SQLCipher, React Native Testing Library) on page 2 of a Node.js CV. They are the profile's de-emphasized topics and show nothing a backend recruiter is looking for. "exact-alarm and PendingIntent behavior changes" is also hard to read. | Keep 2 bullets (the profile's `min_bullets_per_entry`): the eCOA app overview (4.1) and the SQLCipher plus SSL pinning bullet (4.5), which reads as security. This leaves more room for backend material or a shorter page 2. | no |
| hr-6 | low | cv.md:22, 24, 28, 30, 32, 58, 62 (SYSPRO bullets 1, 2, 4, 5, 6; Velas bullets 3, 5) | Jargon on page 1 ("traced from architecture to code", "drove open questions to decisions", "smart-tag fixtures", "OTLP exporter", "zero-trust", "blockchain-node RPC fallback", "reverse tabnabbing"). | Use the plain alternatives in the wording table, keeping the ATS keywords (OIDC, OpenTelemetry, micro-frontend, Node.js). | no |

Not raised again as findings (already recorded): recent production Node.js backend, databases beyond PostgreSQL, GraphQL client or server, queues and microservices, AWS depth (all in `cv/variants/nodejs/gap-report.md`); side work, notice period, hiring route, outages, Velas leadership, General Motors details (all in `docs/open-items.md`). They appear above only as questions to prepare.

## Decided (not raised again)
- CV name "Kirill Kohan" vs legal name "Kyrylo Kokhan" and LinkedIn handle: `keep-cv-name`.
- No LinkedIn or GitHub link in the header: `no-profile-links`. For backend roles, a GitHub link is often expected, but the user has decided against it.
- Google Drive portfolio link in the header: `keep-portfolio-link`.
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step`.
- Short early tenures (The Admasters, Thermo Fisher Scientific, OMO Systems) with no "(Contract)" label: `all-full-time`.
- No dates in the consulting and freelance section: `consulting-no-dates`.
- Unnamed clients and their feature details: `hidden-clients`, `hidden-client-details-ok`.
- SDD framing and "not ad-hoc AI code generation" in SYSPRO bullet 1, and the AI agent wording: `sdd-not-vibe-coding`, `ai-agents-wording` (hr-2 is about bullet order and jargon for this variant, not the framing).
- Summary names no companies and no timing ("At a fintech company", "on a blockchain wallet", "on an automotive app"): `summary-no-company-names`.
- "1,800+ ERP programs" and the SYSPRO platform detail: `keep-erp-programs-figure`.
- "company income grew 10x", "user engagement grew 4x": `keep-previous-cv-metrics`.
- Itjet client names (Fused, Wink, RegiStart, Aspiration): `itjet-client-names`.
- SYSPRO, General Motors and Thermo Fisher Scientific as direct employers (who employed you is not a question): `direct-employment`.
- Length: `keep-length` applies to the master CV only. This variant was judged by its profile and is within it (2 of 3 pages, about 1,600 of 1,800 words).
