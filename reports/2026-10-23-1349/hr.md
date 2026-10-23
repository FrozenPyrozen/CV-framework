---
schema_version: 1
rubric: hr
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T13:49
verdict: pass-with-issues
score: 8.0
---

# HR recruiter review

## Verdict
Yes, a recruiter would move this candidate to a first call. Page 1 shows a senior title at a known ERP vendor (SYSPRO), a Team Leader role at General Motors with a team of 8, 7+ years of experience with no gaps, and a clear remote setup (B2B or full-time, EU/UK/US overlap). Nothing in the CV is a deal-breaker. The candidate should prepare answers on side work alongside full-time jobs and the PhD, the "Tech Lead" headline against the current individual-contributor title, how hiring from Ukraine works, and notice period. The first SYSPRO bullet is still the hardest text on page 1 for a non-technical reader.

Build: current (`npm run status`: everything is up to date). Reviewed the Markdown, `cv/pdf-check.md` (pass, 3 pages: 1,017 / 864 / 314 words) and `cv/preview/page-1.png`.

## First-10-seconds impression
- **Good:** Name, headline ("Senior Software Engineer / Tech Lead (Frontend and Mobile)"), Kyiv and remote, "Open to B2B contract or full-time employment", the time-zone overlap, phone and email all fit in the top four lines (cv.md:2-8).
- **Good:** Two recognizable names (SYSPRO, General Motors) and "Led a team of 8 engineers" are on page 1; dates run continuously from April 2019 to the present.
- **Good:** Page 1 carries the strongest material: SYSPRO, General Motors, Velas and OMO Systems, with numbers ("1,800+ ERP programs", "days to hours", "engagement rose 20% and app crashes fell 15%", "2 minutes to 5 seconds").
- **Bad:** The first SYSPRO bullet (cv.md:22) is a 50-word sentence of process terms ("architecture-governed specification-driven development (SDD)", "validation and rules for AI agents", "each subsystem traced from architecture to code across 4 repositories"). A recruiter skims past it to bullet 3 to learn what was built.
- **Bad:** The summary says "Senior software engineer and tech lead" and the headline says "Tech Lead", but the current job is "Senior Software Engineer" with no team, and the last leadership role ended in November 2025. A recruiter will notice the step and ask (the step itself is decided, see *Decided*).
- **Neutral:** Three short early jobs (The Admasters 4 months, Thermo Fisher Scientific 6 months, OMO Systems 8 months) and about 10 months at SYSPRO so far. Covered by `all-full-time` and `keep-title-step`; answers to prepare are below.

## Strengths
- Senior title at SYSPRO and Team Leader at General Motors, both visible on page 1.
- Leadership with sizes: a map team of 8 at General Motors (6 React Native, 1 iOS, 1 Android), about 3 at OMO Systems, 3 at The Admasters; code reviews, mentoring, technical interviewing for clients.
- Measurable results in almost every job (20% engagement, 15% fewer crashes, 95% coverage, 2 minutes to 5 seconds, 3x faster flows, 2x database performance, 5 million registered users for Wink).
- A coherent story: React and React Native across ERP, automotive, healthcare, clinical trials, fintech and blockchain, moving from product work to architecture.
- Hiring setup stated up front for a worldwide reader: location, remote, B2B or full-time, time-zone overlap.
- Strong education and language: Master's with an Honors Diploma (top 10%), PhD in progress, English C1.

## Questions the recruiter will ask
1. **"Your LinkedIn and documents say Kyrylo Kokhan. Is that you?"**
   *Why:* the CV and email say "Kirill Kohan" / "kiril.kohan@gmail.com" (cv.md:2, cv.md:8); the legal name is "Kyrylo Kokhan" and the LinkedIn handle "kyrylo-kohan" (`profile.yaml`).
   *Prepare (decided, `keep-cv-name`):* "Kirill is the name I use at work; my legal name, as in my passport, is Kyrylo Kokhan. They are two spellings of the same name."
2. **"You had contracts alongside full-time jobs and a PhD at the same time. How did that fit, and did your employer know?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" (cv.md:156). The clinical-trials contract (2024-06 to 2025-04) and the Jira plugin contract (2025-05 to 2025-08) fall inside the General Motors Team Leader period (cv.md:43), and the PhD runs 2023 to 2027 (cv.md:214).
   *Prepare (needs your input, open item "Side work"):* hours per week for each contract, whether side work was allowed, that the clients were in unrelated industries (clinical trials, design tooling vs automotive), and how much time the PhD takes now.
3. **"Your headline says Tech Lead, but at SYSPRO you're a Senior Software Engineer. Do you want a lead role or a hands-on role? Why are you looking after about 10 months?"**
   *Why:* headline and summary (cv.md:4, cv.md:13) vs the SYSPRO title (cv.md:18) and start date "December 2025 - Present" (cv.md:20).
   *Prepare (title step decided, `keep-title-step`):* point to the architecture-level scope at SYSPRO (working with the lead architect, owning the frontend stack, helping define the SDD process). Add your real reason for looking and which kind of role you want next.
4. **"How would we hire you from Ukraine: B2B invoice or employment through an Employer of Record? Any plan to relocate?"**
   *Why:* "Open to B2B contract or full-time employment" (cv.md:6); `profile.yaml` lists no work authorization outside Ukraine and `open_to_relocation: false`.
   *Prepare (needs your input, open item "Hiring setup"):* how you invoice B2B today (registered business, if any), whether an Employer of Record is fine, and that you work remotely from Kyiv and don't plan to relocate.
5. **"What is your notice period, and when could you start?"**
   *Why:* you are currently employed ("December 2025 - Present", cv.md:20) and nothing in the CV or `profile.yaml` records a notice period or start date.
   *Prepare (needs your input):* your contractual notice period at SYSPRO and the earliest realistic start date.
6. **"Were you employed directly by General Motors, Thermo Fisher Scientific and SYSPRO, or through a services company? Who can confirm it?"**
   *Why:* large US and South African companies listed as "Remote" from Kyiv (cv.md:20, cv.md:43, cv.md:106); reference and background checks need the actual employer.
   *Prepare (needs your input, open item "Employer"):* the employing company for each role and a reference contact.
7. **"You were Technical Leader at Velas. How many people did you lead?"**
   *Why:* the Velas entry (cv.md:66-86) has no leadership bullet; the summary records `team_size_led: 0`.
   *Prepare (needs your input, open item "Velas leadership"):* team size and duties, or what the title meant (technical ownership without reports).
8. **"Was the in-car navigation part of the General Motors phone app?"**
   *Why:* bullet 1 describes a "vehicle companion app" (cv.md:45), while bullets 6 and 7 describe "in-car navigation features with the HERE HNav / HNod SDK" and an in-car proof of concept (cv.md:57, cv.md:59). A recruiter may ask which product you worked on.
   *Prepare (needs your input, open item "HERE truck navigation vs General Motors"):* one sentence on how the companion app and the in-car navigation work relate.
9. **"Several early jobs were short (4, 6 and 8 months). Why?"**
   *Why:* The Admasters April to August 2019, Thermo Fisher Scientific November 2020 to April 2021, OMO Systems April to December 2021.
   *Prepare (decided, `all-full-time`):* one factual sentence per job on why it ended.
10. **"How do you keep working reliably from Kyiv during power or internet outages?"**
    *Why:* worldwide hiring managers commonly ask Ukraine-based remote candidates this.
    *Prepare (needs your input, open item "Continuity"):* your real backup power and internet setup and your uptime record since 2022.
11. **"What does specification-driven development mean? Did AI write your code?"**
    *Why:* SYSPRO bullets 1 and 4 (cv.md:22, cv.md:28) and the AI skills line (cv.md:246).
    *Prepare (decided, `sdd-not-vibe-coding`, `ai-agents-wording`):* "Each component had a specification checked against the architecture before coding. AI agents implemented and reviewed code against those specifications, and people reviewed and made every decision."

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "with each subsystem traced from architecture to code across 4 repositories" | cv.md:22 (SYSPRO, bullet 1) | "and checked that each part of the product matched its plan, across 4 code repositories" |
| "drove open questions to decisions" | cv.md:24 (SYSPRO, bullet 2) | "got open design questions decided" |
| "specification-to-code drift" | cv.md:28 (SYSPRO, bullet 4) | "places where the code no longer matched its specification" |
| "smart-tag lookups, predictive search ... view session lifecycle ... context-aware related-program navigation" | cv.md:30 (SYSPRO, bullet 5) | "forms, searchable tables and navigation between screens" (keep KendoReact, XState, Zustand for ATS) |
| "in a zero-trust, independently deployable micro-frontend architecture" | cv.md:32 (SYSPRO, bullet 6) | "in a secure setup where each part of the app is released on its own" |
| "event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter and a redaction stage" | cv.md:34 (SYSPRO, bullet 7) | "a module that records how the app is used and removes personal data before sending it" |
| "HERE HNav / HNod SDK" | cv.md:57 (General Motors, bullet 7) | "HERE navigation SDK" (keep the product names in Skills) |
| "a blockchain-node RPC fallback" | cv.md:72 (Velas, bullet 2) | "a backup connection to the blockchain" |
| "reverse tabnabbing vulnerability" | cv.md:82 (Velas, bullet 7) | "a security flaw that let opened links take over the original page" |
| "exact-alarm and PendingIntent behavior changes" | cv.md:171 (Clinical Trials Patient App, bullet 5) | "Android 14 changes to alarms and notifications" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:22 (SYSPRO, bullet 1) | Jargon in the first bullet of the current job, the most-read text after the summary: "Delivered the frontend through architecture-governed specification-driven development (SDD) ... validation and rules for AI agents that implement and review code against the specifications, with each subsystem traced from architecture to code across 4 repositories." About 50 words of process terms before the reader learns what was built. | Keep the decided SDD framing and position, but shorten the tail: e.g. replace "with each subsystem traced from architecture to code across 4 repositories" with "checking each part against its plan across 4 code repositories", or split it into two short sentences. | no |
| hr-2 | medium | cv.md:156 (Consulting section intro); cv.md:43 (General Motors dates); cv.md:214 (PhD) | Side work and workload: "Part-time contract and consulting work, alongside full-time roles" invites conflict-of-interest and workload questions. The clinical-trials contract (2024-06 to 2025-04) and the Jira plugin contract (2025-05 to 2025-08) overlap the full-time General Motors Team Leader role, and the PhD (2023 to 2027) runs at the same time. | Prepare question 2 (hours, permission, unrelated industries, PhD time). Still open in `docs/open-items.md` ("Side work"). | yes |
| hr-3 | medium | cv.md:4, cv.md:13 (headline, summary sentence 1); cv.md:18-20 (SYSPRO title and dates) | "Tech Lead" in the headline and "tech lead" in the summary, while the current role is "Senior Software Engineer" with `team_size_led: 0` and about 10 months of tenure. A recruiter will ask which kind of role is wanted and why the candidate is moving now. The title step itself is decided; the target-role and reason-for-leaving answers are not. | Prepare question 3: the role you want next (lead or senior hands-on) and your reason for looking. For lead-only applications, the role variants can set their own headline. | yes |
| hr-4 | medium | cv.md:6 (header: hiring line) | Hiring setup: "Open to B2B contract or full-time employment" from Kyiv leaves open how full-time employment works for a foreign company (Employer of Record or local entity) and how B2B is invoiced. `profile.yaml` has an empty `work_authorization` and `open_to_relocation: false`; fine for remote roles, but it will be asked. | Prepare question 4. Still open in `docs/open-items.md` ("Hiring setup"). | yes |
| hr-5 | medium | cv.md:20 (SYSPRO dates, "Present") | No notice period or start date anywhere (CV or `profile.yaml`). For a currently employed candidate this is one of the first screening questions. | Prepare question 5; if you want it in the CV, record it with `/profile`. | yes |
| hr-6 | medium | cv.md:20, cv.md:43, cv.md:106 (SYSPRO, General Motors, Thermo Fisher Scientific headings) | Employer vs client unclear for large foreign companies listed as "Remote" from Kyiv; reference and background checks need the actual employer. | Prepare question 6. Still open in `docs/open-items.md` ("Employer"). | yes |
| hr-7 | medium | cv.md:66-86 (Velas, all bullets) | "Technical Leader" with no leadership bullet and `team_size_led: 0` in the summary. A recruiter will ask how many people were led. | Answer the open item "Velas leadership"; if there were reports, add them with `/add-experience`. | yes |
| hr-8 | medium | cv.md:6 (header: "Kyiv, Ukraine (Remote)") | Business continuity: worldwide clients commonly ask Ukraine-based remote candidates about power and internet outages. The CV doesn't need to address it, but the answer must be ready. | Prepare question 10. Still open in `docs/open-items.md` ("Continuity"). | yes |
| hr-9 | low | cv.md:45, cv.md:57, cv.md:59 (General Motors, bullets 1, 7 and 8) | Product story is mixed: a "vehicle companion app" built in React Native, then "in-car navigation features with the HERE HNav / HNod SDK" and an in-car navigation proof of concept. A recruiter may ask which product it was. | Prepare question 8; the open item "HERE truck navigation vs General Motors" may change the entry later. | yes |
| hr-10 | low | cv.md:13 (Summary, sentence 4) | The last summary sentence lists six specialties plus "architecture-governed specification-driven development (SDD)", which reads as a keyword list on page 1. | Keep the three or four that matter most for the target roles; the rest are already in Skills. | no |
| hr-11 | low | cv.md:24, cv.md:28, cv.md:32, cv.md:34, cv.md:72, cv.md:82 (SYSPRO bullets 2, 4, 6, 7; Velas bullets 2, 7) | Jargon further down page 1 ("drove open questions to decisions", "specification-to-code drift", "zero-trust", "OTLP exporter", "blockchain-node RPC fallback", "reverse tabnabbing"). | Use the plain alternatives in the wording table, keeping the ATS keywords (OIDC, OpenTelemetry, micro-frontend). | no |

## Decided (not raised again)
- CV name "Kirill Kohan" vs legal name "Kyrylo Kokhan" and LinkedIn handle: `keep-cv-name` (one-line answer in question 1).
- No LinkedIn or GitHub link in the header: `no-profile-links`.
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step` (hr-3 is about the target role and reason for leaving, not the title).
- Short early tenures (The Admasters, Thermo Fisher Scientific, OMO Systems) without a "(Contract)" label: `all-full-time` (answer in question 9).
- CV length (3 pages, about 2,200 words): `keep-length`.
- Google Drive portfolio link in the header: `keep-portfolio-link`.
- No dates in the consulting and freelance section: `consulting-no-dates`.
- Unnamed clients ("Clinical Trials Patient App", "Generative AI Jira Plugin") and their feature details: `hidden-clients`, `hidden-client-details-ok`.
- SYSPRO opening with SDD and "not ad-hoc AI code generation" (could read as defensive about AI), and the AI agent wording: `sdd-not-vibe-coding`, `ai-agents-wording`.
- Summary names no companies and no timing: `summary-no-company-names`.
- "Forbes top 10", "company income grew 10x", "tripled the number of new users", "user engagement grew 4x" (recruiter may ask how they were measured): `keep-previous-cv-metrics`.
- Itjet client names (Aspiration, Wink, RegiStart, Fused) in the CV: `itjet-client-names`.
- "1,800+ ERP programs" and the SYSPRO platform detail: `keep-erp-programs-figure`.
- Stack line on the older clinical-trials contract: `orion-stack-line`.
