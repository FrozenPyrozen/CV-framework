---
schema_version: 1
rubric: hr
cv: cv/variants/fullstack-react-node/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:05
verdict: pass-with-issues
score: 7.5
---

# HR recruiter review: Full-Stack (React / Node.js) variant

## Verdict
Yes, a recruiter screening for Senior Full-Stack (React / Node.js) roles would shortlist this CV for a first call. Page 1 shows the right headline, two well-known employers (SYSPRO, General Motors), a team of 8, 7+ years with no gaps, a clear remote setup, and a full Itjet entry with Node.js REST APIs, Stripe, PostgreSQL on AWS RDS, Next.js and GraphQL. The weak point for this role is the story, not the facts: the summary still opens as "Senior software engineer and tech lead", the current job opens with two process and architecture bullets, and the clearest backend work is from 2019 to 2023. That last point is already in `gap-report.md` ("Recent Node.js backend"), so it is listed as a question to prepare, not as a new finding.

Build: current (`npm run status`: everything is up to date). Reviewed the Markdown, `cv/variants/fullstack-react-node/pdf-check.md` (pass, 2 pages: 982 / 660 words) and both preview pages. Length is within the profile (`max_pages: 3`, `max_words: 1800`; about 1,640 words on 2 pages).

## First-10-seconds impression
- **Good:** The headline "Senior Full-Stack Engineer (React / Node.js)" matches the target job title exactly (cv.md:4). Location, remote, "Open to B2B contract or full-time employment", time-zone overlap, phone and email sit in the top four lines (cv.md:6-8).
- **Good:** SYSPRO and General Motors are the first two entries; "Led the map team of 8 engineers" and "1,800+ ERP programs" are visible without scrolling. Dates run continuously from April 2019 to the present.
- **Good:** Page 1 carries the strongest material for this role: SYSPRO, General Motors, Velas (Node.js staking backend), OMO (payment flow) and the whole Itjet entry with six full-stack bullets. Page 2 holds The Admasters, the consulting work, education and skills.
- **Bad:** The first summary words are "Senior software engineer and tech lead" (cv.md:13), not "full-stack", one line below a full-stack headline. The recruiter's keyword match on the first sentence is weaker than it could be.
- **Bad:** The current job (SYSPRO) is frontend only, and its first bullet is about 50 words of process terms (cv.md:22). The first thing built appears in bullet 3. A recruiter checking "is this person full-stack today?" finds frontend at SYSPRO, React Native at General Motors, and the backend work further down (Velas 2021-2023, Itjet 2019-2020).
- **Neutral:** Short early jobs (The Admasters 4 months, Thermo Fisher Scientific 6 months, OMO Systems 8 months) and about 10 months at SYSPRO so far. Decided (`all-full-time`, `keep-title-step`); answers to prepare are below.

## Strengths
- The headline matches the target role word for word, and "React", "TypeScript" and "Node.js" are in the first summary sentence.
- Real full-stack evidence with named technologies: Node.js REST APIs with Express and Sequelize, Stripe subscriptions, PostgreSQL migrated to AWS RDS, Next.js with SSR and GraphQL, Docker, CI/CD on AWS (Itjet, cv.md:91-101), plus a Node.js staking backend (Velas, cv.md:60) and Node.js resolvers in the Jira Forge app (cv.md:134).
- Architecture and leadership a senior full-stack hiring manager wants: work with the lead architect, frontend stack ownership, micro-frontends with OIDC, system design and a team of 8.
- Numbers in almost every job: days to hours, 20% engagement, 15% fewer crashes, 2 minutes to 5 seconds, 4x engagement, 10x income, 2x delivery speed, 2x database performance, 5 million registered users.
- Payments experience twice (Stripe at Itjet, payment gate at OMO), which fits fintech and SaaS full-stack roles.
- Tight length for this variant: 2 pages, the strongest material on page 1, nothing padded.

## Questions the recruiter will ask
Items already tracked elsewhere are marked: recent backend work is a gap in `gap-report.md`; side work, notice period, hiring route and outages are parked in `docs/open-items.md` ("Interview preparation"); Velas leadership is an open item. They are questions to prepare, not new findings.

1. **"Are you full-stack today? Your last two jobs look frontend and mobile."**
   *Why:* SYSPRO bullets and Stack line are frontend (cv.md:22-34); General Motors is a React Native team (cv.md:41); the clearest Node.js backend work is Velas, December 2021 to July 2023 (cv.md:60), and Itjet, 2019 to 2020 (cv.md:91-101). Tracked in `gap-report.md` ("Recent Node.js backend").
   *Prepare (needs your input):* the Node.js resolvers in the Jira Forge app (cv.md:134), the Velas staking backend, the Itjet APIs and RDS migration; and the backend work after 2023 you mentioned on 2026-10-16. Add it with `/add-experience` so the CV can show it.
2. **"Your LinkedIn and documents say Kyrylo Kokhan. Is that you?"**
   *Why:* "Kirill Kohan" and "kiril.kohan@gmail.com" (cv.md:2, cv.md:8) vs the legal name in `profile.yaml`.
   *Prepare (decided, `keep-cv-name`):* "Kirill is the name I use at work; my legal name, as in my passport, is Kyrylo Kokhan."
3. **"You were a Team Leader at General Motors and now you're a Senior Software Engineer after about 10 months. Do you want a lead role or a hands-on role, and why are you looking?"**
   *Why:* "Senior software engineer and tech lead" (cv.md:13), SYSPRO title and "December 2025 - Present" (cv.md:18-20), "Team Leader" at General Motors until December 2025 (cv.md:37-39).
   *Prepare (title step decided, `keep-title-step`):* the architecture-level scope at SYSPRO (lead architect, frontend stack ownership) plus your real reason for looking and the kind of role you want next.
4. **"Your first job in 2019 was already Team Leader, while you were still studying. How did that happen?"**
   *Why:* "Full-Stack Engineer and Team Leader", The Admasters, April 2019 - August 2019, "Led a team of 3 software engineers" (cv.md:104-112), while the Bachelor's degree runs 2016 - 2020 (cv.md:166). It is also the start of the "7+ years".
   *Prepare (needs your input):* how you came to lead 3 engineers in that job (prior freelance or student work, a small company), and what "full-stack" meant there; the summary for this job has no backend technologies yet (`admasters-ecommerce` section 5 is a TODO).
5. **"Your team of 8 was a React Native mobile team. Have you led web or backend engineers?"**
   *Why:* "6 React Native, 1 iOS, 1 Android" (cv.md:41) is the only team size on page 1 besides "about 3 engineers" at OMO.
   *Prepare:* The Admasters team (3 engineers, Next.js web), OMO (about 3), technical interviews for React and TypeScript roles (cv.md:147), and the frontend-stack and architecture ownership at SYSPRO.
6. **"You had contracts alongside full-time jobs and a PhD. How did that fit, and did your employer know?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" (cv.md:116); PhD 2023 - 2027 (cv.md:156).
   *Prepare (parked open item "Side work"):* hours per week, permission, unrelated industries, time the PhD takes now.
7. **"How would we hire you from Ukraine, when could you start, and how do you handle outages?"**
   *Why:* "Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment" (cv.md:6) and "Present" at SYSPRO (cv.md:20).
   *Prepare (parked open items "Hiring route", "Notice period", "Outages"):* B2B (FOP) or Employer of Record, notice period and earliest start, backup power and internet.
8. **"How many people did you lead as Technical Leader at Velas?"**
   *Why:* "Technical Leader" (cv.md:52) with no leadership bullet.
   *Prepare (open item "Velas leadership"):* team size and duties, or technical ownership without reports.
9. **"What is specification-driven development? Did AI write your code?"**
   *Why:* SYSPRO bullet 1 (cv.md:22) and the summary (cv.md:13).
   *Prepare (decided, `sdd-not-vibe-coding`, `ai-agents-wording`):* "Each part had a specification checked against the architecture before coding. AI agents implemented and reviewed code against those specifications, and people reviewed and made every decision."
10. **"Several early jobs were short (4, 6 and 8 months). Why?"**
    *Why:* The Admasters, Thermo Fisher Scientific, OMO Systems.
    *Prepare (decided, `all-full-time`):* one factual sentence per job on why it ended.

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "with each subsystem traced from architecture to code across 4 repositories" | cv.md:22 (SYSPRO, bullet 1) | "checking each part of the product against its plan, across 4 code repositories" |
| "drove open questions to decisions" | cv.md:24 (SYSPRO, bullet 2) | "got open design questions decided" |
| "view session lifecycle ... context-aware related-program navigation and modal overlays that keep the underlying view's state" | cv.md:28 (SYSPRO, bullet 4) | "how screens open, close, talk to the server and link to each other" (keep XState and Zustand) |
| "in a zero-trust, independently deployable micro-frontend architecture where only the identity app sees credentials" | cv.md:30 (SYSPRO, bullet 5) | "in a secure setup where each part of the app is released on its own and only the sign-in app sees passwords" (keep OIDC and micro-frontend) |
| "adding a blockchain-node RPC fallback" | cv.md:58 (Velas, bullet 2) | "adding a backup connection to the blockchain" |
| "Docker and Node.js backend logic" | cv.md:13 (Summary, sentence 3) | "Docker and Node.js backend services" |
| "Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes" | cv.md:127 (Clinical Trials Patient App, bullet 3) | "Android 14 changes to alarms and notifications" |
| "starting with Forge UI Kit and moving to Forge Custom UI" | cv.md:134 (Generative AI Jira Plugin, bullet 1) | "moving from Atlassian's basic UI kit to a fully custom React interface" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:13 (Summary, sentence 1) | The summary opens "Senior software engineer and tech lead with 7+ years of experience", one line below the headline "Senior Full-Stack Engineer (React / Node.js)" (cv.md:4). For this variant the first words don't repeat the role the recruiter is hiring for, and "tech lead" points to a different role. | Open the variant's summary with the headline's role, e.g. "Senior full-stack engineer and tech lead with 7+ years of experience building React, TypeScript and Node.js applications ...". The rest of the sentence stays. | no |
| hr-2 | medium | cv.md:22-26 (SYSPRO, bullets 1-3) | Jargon in the first bullets of the current job: bullet 1 is about 50 words of process terms ("architecture-governed specification-driven development (SDD) ... validation and rules for AI agents ... each subsystem traced from architecture to code across 4 repositories"), bullet 2 is architecture process, and the first thing built ("Built core modules of a schema-driven React 19 / TypeScript runtime") is bullet 3. For a full-stack screen the recruiter wants to see what was built first. Raised as hr-1 in `reports/2026-10-23-1349/hr.md` for the master CV; no decision covers the wording or order (`sdd-summary-sentence` covers only the summary). | Keep the SDD bullet and its decided framing, but shorten its tail (see the wording table), or put the runtime bullet (cv.md:26) first in this variant. | no |
| hr-3 | medium | cv.md:104-112 (The Admasters, title and bullet 3); cv.md:166 (Bachelor 2016 - 2020) | The first listed job (April 2019, 4 months) is "Full-Stack Engineer and Team Leader" leading "a team of 3 software engineers", while the Bachelor's degree was still in progress. A recruiter will ask how a first job came with a lead title, and the entry shows no backend work to support "Full-Stack" (bullets: legacy redesign, Next.js sites, team lead). | Prepare question 4 (how you came to lead the team; any work before 2019). If there was backend work there, add it to `admasters-ecommerce` section 5 and as a contribution so a bullet can show it. | yes |
| hr-4 | low | cv.md:108 (The Admasters, bullet 1) | "Redesigned a legacy codebase to speed up feature deployment." is vague: no technology, no scale, no result, and it is the first bullet of the entry. | Add the technology or a result if you remember it (via `/add-experience`), or move the Next.js bullet (cv.md:110) first. | yes |
| hr-5 | low | cv.md:123-127 (Clinical Trials Patient App, bullets 1-3) | All three bullets are mobile and native Android work ("Android (Java / Kotlin)", "Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes", "Jenkins CI build fixes"). For a full-stack reader bullet 3 is the least relevant and the hardest to read text on page 2. | Keep the entry at two bullets in this variant (the profile minimum is 2), dropping the Android 14 migration, or use the plain wording from the table. | no |
| hr-6 | low | cv.md:188, cv.md:192 (Skills: Mobile; Domain and SDKs) | The skills lines carry items the profile de-emphasizes or that a full-stack recruiter reads as noise: "HERE SDK (HNav, HNod, HERE API)", "Bluetooth Low Energy (BLE)", "react-native-ble-plx", "MQTT", "SQLCipher", "Fastlane", "Bitrise". The profile lists `here-sdk` and `ble` under `deemphasize_tags`. | Let the variant's skills drop or shorten de-emphasized items (a `refresh` rule for skills by profile), or accept them as ATS keywords. | no |
| hr-7 | low | cv.md:13 (Summary) | The summary is one block of 5 long sentences (about 150 words) on page 1; "covered Node.js REST APIs with Stripe subscriptions, PostgreSQL on AWS RDS, Next.js with GraphQL, Docker and Node.js backend logic" repeats "Node.js" and ends on a vague phrase. | Trim sentence 3 to the four strongest items and end on a concrete one, e.g. "... Node.js REST APIs with Stripe subscriptions, PostgreSQL on AWS RDS, Next.js with GraphQL, and Docker." | no |

## Decided (not raised again)
- CV name "Kirill Kohan" vs legal name "Kyrylo Kokhan": `keep-cv-name` (answer in question 2).
- No LinkedIn or GitHub link in the header: `no-profile-links`.
- Google Drive portfolio link in the header: `keep-portfolio-link`.
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step` (question 3 is about the target role and reason for looking).
- Short early tenures without a "(Contract)" label: `all-full-time` (question 10).
- No dates in the consulting and freelance section: `consulting-no-dates`.
- Unnamed clients ("Clinical Trials Patient App", "Generative AI Jira Plugin") and their feature details: `hidden-clients`, `hidden-client-details-ok`.
- SYSPRO framed as SDD, "not ad-hoc AI code generation", and the AI agent wording: `sdd-not-vibe-coding`, `ai-agents-wording`; the summary's SDD sentence: `sdd-summary-sentence`.
- Summary names no companies and no timing ("at a fintech company", "on an automotive app"): `summary-no-company-names`.
- "1,800+ ERP programs" and the SYSPRO platform detail: `keep-erp-programs-figure`.
- "company income grew 10x", "user engagement grew 4x": `keep-previous-cv-metrics`.
- Itjet client names (Fused, Wink, Aspiration, RegiStart): `itjet-client-names`.
- Playwright in the SYSPRO Stack line without end-to-end claims: `playwright-browser-mode-only`.
- Not raised because already tracked: recent Node.js backend, AWS only at Itjet, thin Docker evidence, WebSockets without a bullet, Thermo Fisher bullet choice (`gap-report.md`); side work, notice period, hiring route, outages (parked in `docs/open-items.md`); Velas leadership (open item).
