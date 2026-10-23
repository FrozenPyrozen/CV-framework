---
schema_version: 1
rubric: hr
cv: cv/variants/nodejs/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass-with-issues
score: 8.0
---

# HR recruiter review

## Verdict
Yes, a recruiter screening for Senior Node.js or full-stack TypeScript roles would move this candidate to a first call. The headline, the summary's first sentence ("Node.js REST APIs, PostgreSQL and AWS…") and the Itjet entry on page 1 now tell one full-stack story, the current job opens with a concrete result (1,800+ ERP programs), and the hiring setup is clear. One new medium point: the summary calls the backend work "fintech" ("At a fintech company…"), while the Itjet entry shows a fitness app (Fused) and a voter-registration non-profit (RegiStart); a recruiter comparing the two will ask. Remaining page-1 jargon is low.

Build: current (`npm run status`: everything is up to date). Reviewed the Markdown, `cv/variants/nodejs/pdf-check.md` (pass, 2 pages) and `preview/page-1.png`.

Follow-up on the 2026-10-23-1705 report (changelog row 91):
- **hr-1** (summary opens on frontend): **fixed**. Sentence 1 now leads with "Node.js REST APIs, PostgreSQL and AWS", frontends last.
- **hr-2** (current job opens with the SDD process bullet; Node.js bullet fourth): **decided**, `syspro-runtime-bullet-first`; the runtime bullet is now first and the SDD bullet shorter. The suggestion to reword "mock backend" was not taken; not raised again.
- **hr-3** (summary names a Node.js mock backend): **fixed**. Sentence 4 now ends at "…OpenTelemetry browser telemetry with personally identifiable information (PII) redaction."
- **hr-4** (Jira plugin titled "Frontend Engineer"): **fixed**. Now "Full-Stack Engineer (Contract)" (cv.md:130).
- **hr-5** (four mobile bullets in the clinical-trials entry): **fixed**. Cut to 2 bullets by `entry_max_bullets`. The kept bullets are the Android 14 migration and SQLCipher / pinning rather than the suggested app overview; that choice is in `gap-report.md` (selection disagreements), so it isn't raised again.
- **hr-6** (page-1 jargon): **partly fixed, still open**. "traced from architecture to code" is gone and RPC is spelled out; "drove open questions to decisions", "smart-tag fixtures", "OTLP exporter", "zero-trust" and "reverse tabnabbing" remain (hr-2 below).

## First-10-seconds impression
- **Good:** Headline "Senior Full-Stack Engineer (TypeScript, Node.js, React)" (cv.md:4); location, remote, "Open to B2B contract or full-time employment" and the EU, UK and US time-zone overlap in the header (cv.md:6).
- **Good:** The summary's first two sentences are backend-first: Node.js REST APIs, Stripe, PostgreSQL migrations, AWS RDS, "doubling database performance", a Node.js staking-rewards redesign (cv.md:13).
- **Good:** Known names on page 1 (SYSPRO, General Motors, Thermo Fisher Scientific), "Led a team of 8 engineers", 7+ years, and the Itjet "Full-Stack Engineer" entry with Express, Sequelize, PostgreSQL and AWS RDS all fit on page 1 (preview).
- **Good:** SYSPRO opens with an outcome: "renders **1,800+ ERP programs** … cutting screen delivery from days to hours" (cv.md:22).
- **Bad:** "At a fintech company" in the summary (cv.md:13) doesn't match the Itjet entry's clients (Fused, Wink, RegiStart) (hr-1).
- **Neutral:** The SYSPRO Node.js work reads as dev tooling ("mock backend", "local Node.js OTLP receiver"); a known gap, to prepare for (question 1).

## Strengths
- One consistent full-stack story from headline to summary to page-1 entries.
- Itjet: Node.js REST APIs (Express, Sequelize), Stripe, PostgreSQL on AWS RDS with 2x database performance, node-pg-migrate, a RegiStart MVP from sketches, Wink with more than 5 million registered users.
- Velas: backend and performance results ("from 2 minutes to 5 seconds", "5x less mobile battery", engagement grew 4x).
- Security and observability: OIDC, zero-trust micro-frontends, OpenTelemetry with PII redaction, OAuth 2.0, SSL certificate pinning.
- Leadership with sizes (team of 8 at General Motors, about 3 at OMO Systems, 3 at The Admasters), code reviews, technical interviewing.
- Length fits the profile: 2 pages, 1,655 words, the strongest backend entries on page 1.
- Master's with an Honors Diploma (top 10%), PhD in progress, English C1.

## Questions the recruiter will ask
1. **"When did you last build a production backend? What is the Node.js work at SYSPRO?"**
   *Why:* At SYSPRO the Node.js work is a "mock backend" and a "local Node.js OTLP receiver" (cv.md:28, cv.md:30); production backend is Itjet (2019-2020) and Velas (2021-2023). Already in `gap-report.md`.
   *Prepare:* Itjet and Velas backend work (Express REST APIs, Stripe, PostgreSQL on RDS, staking-rewards calculation), the Jira Forge Node.js resolvers in TypeScript (cv.md:134), and what the mock backend enabled (frontend features built and tested before the real backend).
2. **"Which fintech company was that, and what did you build there?"**
   *Why:* The summary says "At a fintech company, built Node.js REST APIs for a Stripe subscription flow…" (cv.md:13), but the Itjet bullets put that flow at Fused, a fitness app (cv.md:95), and the migrations at RegiStart, a voter-registration non-profit (cv.md:99). See hr-1.
   *Prepare:* "Itjet was a services company; the Stripe subscription backend was for Fused, a fitness app; on the fintech side I built Aspiration's web and signup features."
3. **"Which databases besides PostgreSQL? Redis, MongoDB, queues, microservices?"**
   *Why:* Backend ads list them; the CV shows PostgreSQL only. Known gap (`gap-report.md`).
   *Prepare:* Answer truthfully; record anything real with `/add-experience`.
4. **"Did you build the GraphQL API or only call it?"**
   *Why:* "used **GraphQL**" (cv.md:105). Known gap (`gap-report.md`).
   *Prepare:* Say which side you worked on.
5. **"Your LinkedIn says Kyrylo Kokhan. Is that you?"**
   *Why:* The CV says "Kirill Kohan" (cv.md:2).
   *Prepare (decided, `keep-cv-name`):* "Kirill is the name I use at work; my legal name is Kyrylo Kokhan."
6. **"You had contracts alongside full-time jobs and a PhD. How did that fit?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" (cv.md:118); PhD 2023-2027 (cv.md:156).
   *Prepare:* Open item "Side work" in `docs/open-items.md`.
7. **"How would we hire you, and what is your notice period?"**
   *Why:* "Open to B2B contract or full-time employment" from Kyiv (cv.md:6); "December 2025 - Present" (cv.md:20).
   *Prepare:* Open items "Hiring route" and "Notice period".
8. **"Why look for a new job after about 10 months at SYSPRO?"**
   *Why:* "December 2025 - Present" (cv.md:20).
   *Prepare:* Your real reason; "more backend and full-stack ownership" fits this CV.
9. **"How many people did you lead as Technical Leader at Velas?"**
   *Why:* No leadership bullet in the Velas entry (cv.md:54-68).
   *Prepare:* Open item "Velas leadership".
10. **"How do you handle power or internet outages in Kyiv?"**
    *Why:* Common for Ukraine-based remote candidates.
    *Prepare:* Open item "Outages".

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "drove open questions to decisions" | cv.md:26 (SYSPRO, bullet 3) | "got open design questions decided" |
| "adding ERP smart-tag fixtures and view-management routes" | cv.md:28 (SYSPRO, bullet 4) | "adding test data and API routes for ERP screens" |
| "event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter" | cv.md:30 (SYSPRO, bullet 5) | "a module that records how the app is used and removes personal data before sending it" (keep OpenTelemetry) |
| "in a **zero-trust**, independently deployable **micro-frontend architecture**" | cv.md:32 (SYSPRO, bullet 6) | "in a secure setup where each part of the app is released on its own" (keep micro-frontend) |
| "a blockchain-node remote procedure call (RPC) fallback" | cv.md:64 (Velas, bullet 4) | "a backup connection to the blockchain" |
| "**reverse tabnabbing** vulnerability" | cv.md:68 (Velas, bullet 6) | "a security flaw that let opened links take over the original page" |
| "exact-alarm and PendingIntent behavior changes" | cv.md:125 (Clinical Trials Patient App, bullet 1) | "Android 14 changes to alarms and notifications" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:13 (Summary, sentences 1 and 2) | "Node.js REST APIs, PostgreSQL and AWS in fintech, blockchain and Jira integration projects" and "At a fintech company, built Node.js REST APIs for a Stripe subscription flow, set up PostgreSQL schema migrations and moved PostgreSQL to AWS RDS and tuned slow queries". The cited sources (`itjet-fintech#4.6`, `#4.5`, `#4.4`) are Fused, "a coach and athlete fitness app", and RegiStart, "a non-profit start-up" (`summaries/itjet-fintech.md:41-42`); Itjet "was a services company with several clients, not one fintech product" (decision `itjet-client-names`). A recruiter reading the Itjet entry on the same page sees Fused, Wink and RegiStart, not a fintech company, and a fintech hiring manager will ask about fintech backend work that isn't there. The claim is stronger than its source. | Keep the results, fix the setting: "At a software services company, built Node.js REST APIs for a Stripe subscription flow…", and in sentence 1 "in fitness, non-profit, blockchain and Jira integration projects" (or no domain list). Check the master CV and other variants for the same wording. Fintech remains true for the Aspiration frontend work. | no |
| hr-2 | low | cv.md:26, 28, 30, 32, 64, 68 (SYSPRO bullets 3 to 6; Velas bullets 4 and 6) | Still open from hr-6 of the previous run: page-1 jargon a recruiter won't follow ("drove open questions to decisions", "smart-tag fixtures and view-management routes", "OTLP exporter", "zero-trust", "blockchain-node remote procedure call (RPC) fallback", "reverse tabnabbing"). | Use the plain alternatives in the wording table, keeping the ATS keywords (OIDC, OpenTelemetry, micro-frontend, Node.js, REST API). | no |

Not raised again as findings (already recorded): recent production Node.js backend, AWS depth, GraphQL server side, databases beyond PostgreSQL, queues and microservices, the clinical-trials bullet choice (all in `cv/variants/nodejs/gap-report.md`); side work, notice period, hiring route, outages, Velas leadership, OMO leadership, Admasters stack (all in `docs/open-items.md`). They appear above only as questions to prepare.

## Decided (not raised again)
- CV name "Kirill Kohan" vs legal name "Kyrylo Kokhan" and the LinkedIn handle: `keep-cv-name`.
- No LinkedIn or GitHub link in the header: `no-profile-links`.
- Google Drive portfolio link in the header: `keep-portfolio-link`.
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step`.
- Short tenures (The Admasters, Thermo Fisher Scientific, OMO Systems) with no "(Contract)" label: `all-full-time`.
- No dates in the consulting and freelance section: `consulting-no-dates`.
- SYSPRO bullet order (runtime first, SDD second) and "Maintained a Node.js mock backend" left as is: `syspro-runtime-bullet-first`.
- SDD framing and "not ad-hoc AI code generation", AI agent wording: `ai-agents-wording` (and `sdd-not-vibe-coding`).
- Summary names no companies and no timing ("At a fintech company", "on a blockchain wallet", "on an automotive app"): `summary-no-company-names` (hr-1 is about the domain label, not the missing name).
- "1,800+ ERP programs" and SYSPRO platform detail: `keep-erp-programs-figure`.
- "company income grew 10x", "user engagement grew 4x": `keep-previous-cv-metrics`.
- Itjet client names (Fused, Wink, RegiStart, Aspiration): `itjet-client-names`.
- SYSPRO, General Motors and Thermo Fisher Scientific as direct employers: `direct-employment`.
- Length: `keep-length` applies to the master CV only; this variant is within its profile (2 of 3 pages, 1,655 of 1,800 words).
