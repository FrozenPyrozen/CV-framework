---
schema_version: 1
rubric: hr
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass-with-issues
score: 8.2
---

# HR recruiter review

## Verdict
Yes, a recruiter would move this candidate to a first call for senior frontend (React) and senior mobile (React Native) roles. Page 1 shows SYSPRO and General Motors, a team of 8, 7+ years with no gaps, results with numbers, and a clear remote hiring setup. The CV has no deal-breakers. What's left is interview preparation: why move after about 11 months and which role comes next, recent backend depth for full-stack roles, and plainer wording further down page 1. The build is current (`npm run status`: ok). I reviewed the Markdown, `cv/pdf-check.md` (pass, 3 pages) and `cv/preview/page-1.png`.

Follow-up on the 2026-10-23-1705 findings:
- **hr-1** (jargon in the first SYSPRO bullet, "with each subsystem traced from architecture to code across 4 repositories"): **fixed.** The tail is shortened to "…against the specifications across 4 repositories." (cv.md:22), as `syspro-runtime-bullet-first` records. The bullet keeps first place and its SDD framing, which is decided.
- **hr-2** (master CV thin on recent backend for full-stack roles): **still open.** The master is unchanged. Row 91 put the runtime bullet first in the `nodejs` and `fullstack-react-node` variants, which is the route for those jobs. Carried forward as hr-2.
- **hr-3** (target role and reason for moving not prepared): **still open.** Not answered, not decided, and not in `docs/open-items.md`. Carried forward as hr-1.
- **hr-4** (jargon further down: "drove open questions to decisions", "specification-to-code drift", "zero-trust", "OTLP exporter", "HERE HNav / HNod SDK", "reverse tabnabbing", "PendingIntent"): **still open.** All quotes are unchanged. "RPC" is now spelled out ("remote procedure call (RPC)", cv.md:72), but still technical. Carried forward as hr-3.
- **hr-5** (title sequence Team Leader to Software Engineer at Thermo Fisher Scientific to Team Leader): **still open** (interview preparation only). Carried forward as hr-4.
- **hr-6** (summary sentence 4 lists six specialties): **still open,** unchanged (cv.md:13). Carried forward as hr-5. The SDD ending stays decided (`sdd-summary-sentence`).

## First-10-seconds impression
- **Good:** The name, headline, "Kyiv, Ukraine (Remote)", "Open to B2B contract or full-time employment", the EU/UK/US overlap, phone and email fill the top four lines (cv.md:2-8). The hiring setup is clear at a glance.
- **Good:** SYSPRO (ERP vendor) and General Motors are both on page 1 with "Led the map team of 8 engineers". Dates run continuously from April 2019 to now.
- **Good:** Strong numbers on page 1: "1,800+ ERP programs", "from days to hours", "engagement rose 20% and app crashes fell 15%", "95% coverage", "2 minutes to 5 seconds", "tripled the number of new users", "income grew 10x".
- **Better than last run:** The first SYSPRO bullet is now 2 lines in the PDF and ends on "across 4 repositories". It reads as a process statement, not a wall of terms.
- **Bad:** "Tech Lead" in the headline and "tech lead" in the summary sit over a current "Senior Software Engineer" title held since December 2025, with no team. Expect "why move now, and lead or hands-on?" (hr-1).
- **Bad:** SYSPRO bullets 2 and 4-7 are still dense for a non-technical reader ("drove open questions to decisions", "specification-to-code drift", "zero-trust", "OTLP exporter") (hr-3).

## Strengths
- Senior title at SYSPRO and Team Leader at General Motors on page 1, with a team size (8: 6 React Native, 1 iOS, 1 Android).
- Clear fit for frontend (React 19, TypeScript, micro-frontends, OIDC, WCAG, Storybook) and mobile (React Native across six jobs and contracts, Expo, BLE, native Android). Both are backed by outcomes, not only keyword lists.
- Measured results in almost every job, including 5 million registered users for Wink and a Forbes top 10 fintech client.
- Leadership with evidence: code reviews, coding standards, mentoring, system design and stack ownership, technical interviews for clients, presales.
- Varied domains (ERP, automotive, healthcare, clinical trials, fintech, blockchain, IoT) with one React / React Native thread.
- Master's with an Honors Diploma (top 10%), PhD in progress, English C1.

## Questions the recruiter will ask
1. **"Why are you looking after about 11 months at SYSPRO, and do you want a lead role or a senior hands-on role?"**
   *Why:* "December 2025 - Present" under "Senior Software Engineer" (cv.md:18-20), against "Tech Lead" in the headline (cv.md:4).
   *Prepare (needs your input):* the architecture scope at SYSPRO (working with the lead architect, owning the frontend stack and ADR, helping define SDD, cv.md:22-24). Then your real reason for looking and the role you want next. The title step itself is decided (`keep-title-step`).
2. **"How much backend have you done recently? Could you own APIs and the database?"** (full-stack roles)
   *Why:* recent Node.js is "maintained a **Node.js** mock backend" (cv.md:36) and "Node.js" in the GM stack line (cv.md:63). The concrete API, database and payment work is at Velas (to July 2023, cv.md:80) and Itjet (2019-2020, cv.md:133-137).
   *Prepare:* the Velas staking-rewards backend redesign, the Itjet REST APIs (Express, Sequelize, PostgreSQL on AWS RDS, Stripe subscriptions), and any newer Node.js work. Send the `fullstack-react-node` or `nodejs` variant for these roles.
3. **"Your LinkedIn and documents say Kyrylo Kokhan. Is that you?"**
   *Why:* the CV and email say "Kirill Kohan" / "kiril.kohan@gmail.com" (cv.md:2, 8).
   *Prepare (decided, `keep-cv-name`):* "Kirill is the name I use at work; my legal name is Kyrylo Kokhan. They are two spellings of the same name."
4. **"You had contracts alongside full-time jobs and a PhD. How did that fit?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" (cv.md:156) and "PhD Candidate … 2023 - 2027 (expected)" (cv.md:212-214).
   *Prepare:* already in `docs/open-items.md` (Interview preparation, "Side work"). Not raised again.
5. **"How would we hire you from Ukraine, and when could you start?"**
   *Why:* "Open to B2B contract or full-time employment" (cv.md:6) while currently employed.
   *Prepare:* already in `docs/open-items.md` ("Hiring route", "Notice period"). Not raised again.
6. **"You were Technical Leader at Velas. How many people did you lead?"**
   *Why:* the Velas entry (cv.md:66-86) has no leadership bullet.
   *Prepare:* already in `docs/open-items.md` ("Velas leadership"). Not raised again.
7. **"After leading a team at The Admasters you were a Software Engineer at Thermo Fisher Scientific, then a Team Leader again. Why?"**
   *Why:* the titles go "Full-Stack Engineer and Team Leader" (cv.md:142) → "Full-Stack Engineer" (cv.md:121) → "Software Engineer" (cv.md:104) → "Team Leader" (cv.md:89).
   *Prepare (needs your input):* one sentence on the Thermo Fisher Scientific title (a direct role at a large company, `direct-employment`), and one on why each short early job ended (`all-full-time`: no contract labels).
8. **"What does specification-driven development mean? Did AI write your code?"**
   *Why:* SYSPRO bullets 1 and 4 (cv.md:22, 28) and the AI skills line (cv.md:246).
   *Prepare (decided, `sdd-not-vibe-coding`, `ai-agents-wording`):* "Each component had a specification checked against the architecture before coding. AI agents implemented and reviewed code against those specifications, and people reviewed it and made every decision."

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "drove open questions to decisions" | cv.md:24 (SYSPRO, bullet 2) | "got open design questions decided" |
| "specification-to-code drift" | cv.md:28 (SYSPRO, bullet 4) | "places where the code no longer matched its specification" |
| "smart-tag lookups, predictive search" | cv.md:30 (SYSPRO, bullet 5) | "lookups and search-as-you-type" (keep KendoReact, XState, Zustand for ATS) |
| "in a **zero-trust**, independently deployable **micro-frontend architecture**" | cv.md:32 (SYSPRO, bullet 6) | "in a secure micro-frontend setup where each part of the app is released on its own" |
| "event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter and a redaction stage" | cv.md:34 (SYSPRO, bullet 7) | "a module that records how the app is used and removes personal data before sending it" (keep OpenTelemetry) |
| "**HERE HNav / HNod SDK**" | cv.md:57 (General Motors, bullet 7) | "HERE navigation SDK" (the product names are already in Skills, cv.md:248) |
| "a blockchain-node remote procedure call (RPC) fallback" | cv.md:72 (Velas, bullet 2) | "a backup connection to the blockchain" |
| "**reverse tabnabbing** vulnerability" | cv.md:82 (Velas, bullet 7) | "a security flaw that let opened links take over the original page" |
| "exact-alarm and PendingIntent behavior changes" | cv.md:171 (Clinical Trials Patient App, bullet 5) | "Android 14 changes to alarms and notifications" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:4, 13 (headline, summary sentence 1); cv.md:18-20 (SYSPRO title, "December 2025 - Present") | Carried forward from 2026-10-23-1705 hr-3. A "Tech Lead" headline over a current individual-contributor title held for about 11 months will draw "why now, and lead or hands-on?". The answer isn't recorded in the facts, decisions or `docs/open-items.md`. | Prepare question 1: the role you want next and your reason for looking, in one or two sentences. If you'd rather park it, add it to `docs/open-items.md` under Interview preparation. | yes |
| hr-2 | medium | cv.md:13 (summary sentence 1); cv.md:36 (SYSPRO, bullet 8); cv.md:63 (GM stack); cv.md:80, 133-137 (Velas, Itjet) | Carried forward from 2026-10-23-1705 hr-2. For senior full-stack roles the master CV is thin on recent backend work. The summary names "Node.js", but since mid-2023 the evidence is "maintained a **Node.js** mock backend" and a stack line. The concrete API, database and payment work is on page 2 (Velas to July 2023, Itjet 2019-2020). | For full-stack openings, send the `fullstack-react-node` or `nodejs` variant. Prepare question 2. If there was newer backend work, add it with `/add-experience`. | no |
| hr-3 | low | cv.md:24, 28, 30, 32, 34, 57, 72, 82, 171 (SYSPRO bullets 2, 4-7; GM bullet 7; Velas bullets 2, 7; Clinical Trials bullet 5) | Carried forward from 2026-10-23-1705 hr-4. The jargon in the wording table is unchanged: "drove open questions to decisions", "specification-to-code drift", "zero-trust", "OTLP exporter", "HERE HNav / HNod SDK", "reverse tabnabbing", "PendingIntent". Most of it is on page 1. | Use the plain alternatives in the wording table and keep the ATS keywords (OIDC, OpenTelemetry, micro-frontend, KendoReact). | no |
| hr-4 | low | cv.md:104 (Thermo Fisher Scientific title); cv.md:142 (The Admasters title) | Carried forward from 2026-10-23-1705 hr-5. The titles go up and down: "Full-Stack Engineer and Team Leader" (2019), then "Software Engineer" (2020-2021), then "Team Leader". | Prepare question 7. No CV change needed. | yes |
| hr-5 | low | cv.md:13 (summary, sentence 4) | Carried forward from 2026-10-23-1705 hr-6. "Experienced in micro-frontend architecture, OpenID Connect (OIDC), OpenTelemetry observability, test automation, native Android migrations and generative AI integrations" reads as a keyword list on page 1. | Keep the three or four specialties that matter most (e.g. micro-frontends, OIDC, test automation, native Android); the rest are in Skills. Keep the SDD ending as decided. | no |
| hr-6 | low | cv.md:139 (Itjet, bullet 8) | New. A doubled "with" reads as unpolished: "Delivered web features for Aspiration with **Next.js** with server-side rendering (SSR) and **GraphQL**". | "Delivered web features for Aspiration in **Next.js** with server-side rendering (SSR) and **GraphQL**…" | no |

## Decided (not raised again)
- Headline without "(Frontend and Mobile)" in the worldwide master CV: `markets/worldwide.yaml` `hide_headline_qualifier: master` (user's choice; plan row 90).
- SYSPRO opening with SDD, "not ad-hoc AI code generation", and the AI agent wording: `sdd-not-vibe-coding`, `ai-agents-wording`, `syspro-runtime-bullet-first`.
- SDD sentence at the end of the summary: `sdd-summary-sentence`.
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step`.
- CV name "Kirill Kohan" vs legal name "Kyrylo Kokhan": `keep-cv-name`.
- No LinkedIn or GitHub link: `no-profile-links`. Google Drive portfolio link: `keep-portfolio-link`.
- Short early tenures with no "(Contract)" label: `all-full-time`.
- CV length (3 pages, about 2,200 words): `keep-length`.
- No dates in the consulting and freelance section: `consulting-no-dates`.
- Summary names no companies and no timing: `summary-no-company-names`.
- Numbers from the previous CV ("Forbes top 10", "income grew 10x", "tripled", "grew 4x"): `keep-previous-cv-metrics`.
- Itjet client names: `itjet-client-names`.
- "1,800+ ERP programs" and SYSPRO platform detail: `keep-erp-programs-figure`.
- General Motors projects (HERE truck navigation app, car navigation PoC, voice AI, second screen): `gm-project-names`, `gm-features-public`.
- Direct employment at SYSPRO, General Motors and Thermo Fisher Scientific: `direct-employment`.
- Stack line on the clinical-trials contract: `orion-stack-line`.
- Already in `docs/open-items.md`, not raised as findings: side work and workload ("Side work"), notice period, hiring route, outages, Velas leadership, GM details, Admasters stack.
