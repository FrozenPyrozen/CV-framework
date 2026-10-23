---
schema_version: 1
rubric: hr
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:05
verdict: pass-with-issues
score: 8.0
---

# HR recruiter review

## Verdict
Yes, a recruiter would put this CV on the shortlist for senior frontend (React) and senior mobile (React Native) roles. Page 1 shows SYSPRO and General Motors, a team of 8, 7+ years with no gaps, React 19 and React Native work with results, and a clear remote hiring setup. For senior full-stack roles the answer is "probably yes, but it's weaker". The Node.js backend work is mostly in 2019 to 2023 (Itjet, Velas). The current job lists only "a Node.js mock backend". A full-stack recruiter would rather see the `fullstack-react-node` or `nodejs` variant than this master CV.

The CV has no deal-breakers. What's left are answers the candidate should prepare: why move after about 11 months, and which role he wants next. The first SYSPRO bullet is also still the hardest text on page 1.

Build: current (`npm run status`: everything is up to date). Reviewed the Markdown, `cv/pdf-check.md` (pass, 3 pages: 1,011 / 876 / 314 words) and `cv/preview/page-1.png`.

## First-10-seconds impression
- **Good:** The top four lines carry the name, headline, "Kyiv, Ukraine (Remote)", "Open to B2B contract or full-time employment", the EU/UK/US overlap, phone and email (cv.md:2-8). A worldwide recruiter has no hiring-setup question left at first glance.
- **Good:** Two well-known names, SYSPRO (ERP vendor) and General Motors, plus "Led a team of 8 engineers", are visible before the middle of page 1. Dates run continuously from April 2019 to the present.
- **Good:** Page 1 has the strongest numbers: "1,800+ ERP programs", "days to hours", "engagement rose 20% and app crashes fell 15%", "95% coverage", "2 minutes to 5 seconds", "tripled the number of new users".
- **Neutral (new since the last review):** The headline now reads only "Senior Software Engineer / Tech Lead" (cv.md:4). That was the user's choice (see *Decided*). The frontend and mobile focus now comes from summary sentence 1 ("React, React Native, Node.js and TypeScript applications"), which a skimming recruiter still reads within the 10 seconds. For a role-specific application, the variants carry the specific headline.
- **Bad:** The first SYSPRO bullet (cv.md:22) is a 50-word sentence of process terms. A recruiter has to read down to bullet 3 to learn what was built (see hr-1).
- **Bad:** "Tech Lead" in the headline and "tech lead" in the summary sit against a current title of "Senior Software Engineer" with no team, started December 2025. Expect a "what role do you want, and why move now?" question (hr-3).

## Strengths
- Senior title at SYSPRO and Team Leader at General Motors, both on page 1, with a team size (8: 6 React Native, 1 iOS, 1 Android).
- Matches the target roles. Frontend: React 19, TypeScript, micro-frontends, OIDC, WCAG, Storybook, design systems. Mobile: React Native across 6 jobs and contracts, native Android, BLE, Expo, store publishing. Both are backed by outcomes, not only keyword lists.
- Measurable results in almost every job (20% engagement, 15% fewer crashes, 95% coverage, 2 minutes to 5 seconds, 3x faster flows, 2x database performance, 5 million registered users for Wink, Forbes top 10 client).
- Leadership with evidence: code reviews, coding standards, mentoring, system design ownership, technical interviewing for clients, presales.
- Varied domains (ERP, automotive, healthcare, clinical trials, fintech, blockchain, IoT) with a clear React / React Native thread through all of them.
- Education and language: Master's with an Honors Diploma (top 10%), PhD in progress, English C1.

## Questions the recruiter will ask
1. **"Why are you looking after about 11 months at SYSPRO, and do you want a lead role or a senior hands-on role?"**
   *Why:* "December 2025 - Present" (cv.md:20) under "Senior Software Engineer" (cv.md:18), against "Tech Lead" in the headline (cv.md:4) and "tech lead" in the summary (cv.md:13).
   *Prepare (needs your input):* point to the architecture scope at SYSPRO: working with the lead architect, owning the frontend stack (ADR), and helping define the SDD process (cv.md:22-24). Then give your real reason for looking and the role you want next. The title step itself is decided (`keep-title-step`).
2. **"How much backend have you done recently? Could you own APIs and the database in this team?"** (full-stack roles)
   *Why:* recent Node.js work is "maintained a Node.js mock backend" at SYSPRO (cv.md:36) and "Node.js" in the General Motors stack line (cv.md:63). The concrete backend bullets are from Velas (cv.md:80, until July 2023) and Itjet (cv.md:133-137, 2019-2020).
   *Prepare:* the Velas staking-rewards backend redesign, the Itjet REST APIs (Express, Sequelize, PostgreSQL on AWS RDS, Stripe subscriptions), and anything newer you did on Node.js. Send the `fullstack-react-node` or `nodejs` variant for these roles.
3. **"Your LinkedIn and documents say Kyrylo Kokhan. Is that you?"**
   *Why:* the CV and email say "Kirill Kohan" / "kiril.kohan@gmail.com" (cv.md:2, cv.md:8).
   *Prepare (decided, `keep-cv-name`):* "Kirill is the name I use at work; my legal name is Kyrylo Kokhan. They are two spellings of the same name."
4. **"You had contracts alongside full-time jobs and a PhD. How did that fit, and did your employer know?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" (cv.md:156) and "PhD Candidate ... 2023 - 2027 (expected)" (cv.md:212-214).
   *Prepare:* already in `docs/open-items.md` (Interview preparation, "Side work", parked). Not raised again here.
5. **"How would we hire you from Ukraine, and when could you start?"**
   *Why:* "Open to B2B contract or full-time employment" (cv.md:6) while currently employed (cv.md:20).
   *Prepare:* already in `docs/open-items.md` ("Hiring route", "Notice period", parked). Not raised again here.
6. **"You were Technical Leader at Velas. How many people did you lead?"**
   *Why:* the Velas entry (cv.md:66-86) has no leadership bullet.
   *Prepare:* already in `docs/open-items.md` ("Velas leadership"). Not raised again here.
7. **"After leading a team at The Admasters you were a Software Engineer at Thermo Fisher Scientific, and then a Team Leader again. How did your titles go?"**
   *Why:* the titles go "Full-Stack Engineer and Team Leader" (2019) → "Full-Stack Engineer" → "Software Engineer" (2020-2021) → "Team Leader" → "Technical Leader" → "Team Leader" → "Senior Software Engineer" (cv.md:142, 121, 104, 89, 66, 41, 18).
   *Prepare (needs your input):* one sentence on the Thermo Fisher Scientific title, e.g. that it was a direct role at a large company whose title scheme didn't carry "Senior" or "Lead", plus one sentence on why each short early job ended (decided `all-full-time`: no contract labels).
8. **"What does specification-driven development mean? Did AI write your code?"**
   *Why:* SYSPRO bullets 1 and 4 (cv.md:22, cv.md:28) and the AI skills line (cv.md:246).
   *Prepare (decided, `sdd-not-vibe-coding`, `ai-agents-wording`):* "Each component had a specification checked against the architecture before coding. AI agents implemented and reviewed code against those specifications, and people reviewed it and made every decision."
9. **"Was the in-car navigation work part of the General Motors job?"**
   *Why:* bullet 1 says "vehicle companion app" (cv.md:45). Bullets 7 and 8 mention the "truck navigation app for HERE Technologies" and a "car navigation PoC" (cv.md:57, cv.md:59).
   *Prepare (decided, `gm-project-names`):* one sentence: during the General Motors period you also worked on HERE's truck navigation app and an in-car navigation proof of concept, both named in the entry as projects.

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "with each subsystem traced from architecture to code across 4 repositories" | cv.md:22 (SYSPRO, bullet 1) | "checking each part against its plan across 4 code repositories" |
| "drove open questions to decisions" | cv.md:24 (SYSPRO, bullet 2) | "got open design questions decided" |
| "specification-to-code drift" | cv.md:28 (SYSPRO, bullet 4) | "places where the code no longer matched its specification" |
| "smart-tag lookups, predictive search" | cv.md:30 (SYSPRO, bullet 5) | "lookups and search-as-you-type" (keep KendoReact, XState, Zustand for ATS) |
| "in a zero-trust, independently deployable micro-frontend architecture" | cv.md:32 (SYSPRO, bullet 6) | "in a secure micro-frontend setup where each part of the app is released on its own" |
| "event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter and a redaction stage" | cv.md:34 (SYSPRO, bullet 7) | "a module that records how the app is used and removes personal data before sending it" (keep OpenTelemetry) |
| "HERE HNav / HNod SDK" | cv.md:57 (General Motors, bullet 7) | "HERE navigation SDK" (the product names are already in Skills, cv.md:248) |
| "a blockchain-node RPC fallback" | cv.md:72 (Velas, bullet 2) | "a backup connection to the blockchain" |
| "reverse tabnabbing vulnerability" | cv.md:82 (Velas, bullet 7) | "a security flaw that let opened links take over the original page" |
| "exact-alarm and PendingIntent behavior changes" | cv.md:171 (Clinical Trials Patient App, bullet 5) | "Android 14 changes to alarms and notifications" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:22 (SYSPRO, bullet 1) | Jargon in the first bullet of the current job, the most-read text after the summary: "...validation and rules for AI agents that implement and review code against the specifications, with each subsystem traced from architecture to code across 4 repositories." About 50 words of process terms before the reader learns what was built. Raised before (2026-10-23-1349 hr-1) and not changed or decided since. | Keep the SDD framing and its first place (cv-spec 5, `sdd-not-vibe-coding`), but shorten the tail. For example, replace "with each subsystem traced from architecture to code across 4 repositories" with "checking each part against its plan across 4 code repositories", or split the bullet into two short sentences. | no |
| hr-2 | medium | cv.md:13 (Summary, sentence 1); cv.md:36 (SYSPRO, bullet 8); cv.md:63 (GM stack); cv.md:80, cv.md:133-137 (Velas, Itjet) | For senior **full-stack** roles the master CV is thin on recent backend work. The summary leads with "React, React Native, Node.js and TypeScript", but the backend evidence since mid-2023 is "maintained a Node.js mock backend" and "Node.js" in a stack line. The concrete API, database and payment work is at Velas (to July 2023) and Itjet (2019-2020), on page 2. A full-stack recruiter scanning page 1 sees a frontend and mobile engineer. | For full-stack openings, send the `fullstack-react-node` or `nodejs` variant, not the master. Prepare question 2. If there was newer backend work (at SYSPRO, General Motors or the consulting clients), add it with `/add-experience`. | no |
| hr-3 | medium | cv.md:4, cv.md:13 (headline, summary sentence 1); cv.md:18-20 (SYSPRO title, "December 2025 - Present") | Target role and reason for moving are not prepared. A "Tech Lead" headline over a current individual-contributor title held for about 11 months will draw "why now, and lead or hands-on?". The title step is decided; the answer isn't recorded anywhere (not in `docs/open-items.md`). | Prepare question 1: the role you want next and your reason for looking, in one or two sentences. | yes |
| hr-4 | low | cv.md:24, 28, 30, 32, 34, 57, 72, 82, 171 (SYSPRO bullets 2, 4-7; GM bullet 7; Velas bullets 2, 7; Clinical Trials bullet 5) | Jargon further down page 1 and on page 2 (see the wording table): "drove open questions to decisions", "specification-to-code drift", "zero-trust", "OTLP exporter", "HERE HNav / HNod SDK", "blockchain-node RPC fallback", "reverse tabnabbing", "PendingIntent". Raised before as 2026-10-23-1349 hr-11, still open. | Use the plain alternatives in the wording table and keep the ATS keywords (OIDC, OpenTelemetry, micro-frontend, KendoReact). | no |
| hr-5 | low | cv.md:104 (Thermo Fisher Scientific title); cv.md:142 (The Admasters title) | The titles go up and down: "Full-Stack Engineer and Team Leader" in 2019, then "Software Engineer" at Thermo Fisher Scientific in 2020-2021, then "Team Leader" again. A recruiter reading the career story may ask about it. This is a title question, not tenure, so `all-full-time` doesn't cover it. | Prepare question 7 (one sentence on the Thermo Fisher Scientific title). No CV change needed. | yes |
| hr-6 | low | cv.md:13 (Summary, sentence 4) | Sentence 4 lists six specialties ("micro-frontend architecture, OpenID Connect (OIDC), OpenTelemetry observability, test automation, native Android migrations and generative AI integrations"). It reads as a keyword list on page 1. Raised before as 2026-10-23-1349 hr-10, still open. The SDD ending of the sentence is decided (`sdd-summary-sentence`). | Keep the three or four specialties that matter most for frontend and mobile roles (e.g. micro-frontends, OIDC, test automation, native Android). The rest are already in Skills. Keep the SDD ending as decided. | no |

## Decided (not raised again)
- Headline without "(Frontend and Mobile)" in the worldwide master CV: user's request (`markets/worldwide.yaml` `hide_headline_qualifier: master`, plan row 90); the variants keep their own headlines.
- SYSPRO opening with SDD, "not ad-hoc AI code generation", and the AI agent wording (could read as defensive): `sdd-not-vibe-coding`, `ai-agents-wording`, cv-spec 5.
- SDD sentence at the end of the summary: `sdd-summary-sentence`.
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step`.
- CV name "Kirill Kohan" vs legal name "Kyrylo Kokhan": `keep-cv-name`.
- No LinkedIn or GitHub link in the header: `no-profile-links`.
- Google Drive portfolio link in the header: `keep-portfolio-link`.
- Short early tenures without a "(Contract)" label: `all-full-time`.
- CV length (3 pages, about 2,200 words): `keep-length`.
- No dates in the consulting and freelance section: `consulting-no-dates`.
- Unnamed clients and their feature details: `hidden-clients`, `hidden-client-details-ok`.
- Summary names no companies and no timing: `summary-no-company-names`.
- Numbers from the previous CV ("Forbes top 10", "income grew 10x", "tripled", "grew 4x"): `keep-previous-cv-metrics`.
- Itjet client names: `itjet-client-names`.
- "1,800+ ERP programs" and the SYSPRO platform detail: `keep-erp-programs-figure`.
- General Motors projects (HERE truck navigation app, car navigation PoC, voice AI, second screen): `gm-project-names`, `gm-features-public`.
- Direct employment at SYSPRO, General Motors and Thermo Fisher Scientific: `direct-employment`.
- Playwright only as the Vitest Browser Mode provider at SYSPRO: `playwright-browser-mode-only`.
- Stack line on the clinical-trials contract: `orion-stack-line`.
- Already in `docs/open-items.md`, not raised as findings: side work and workload ("Side work"), notice period, hiring route (B2B / Employer of Record), outages in Kyiv, Velas leadership scope, GM details.
