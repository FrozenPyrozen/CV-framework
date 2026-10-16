---
schema_version: 1
rubric: hr
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-16T12:02
verdict: pass-with-issues
score: 7.5
---

# HR recruiter review

## Verdict
Yes, a recruiter would most likely move this candidate to a first call. Page 1 shows a senior title at a known ERP vendor, a team-lead role at General Motors, 7+ years of experience and a clear remote B2B or full-time setup. Before the call, the candidate should resolve one identity point (CV name vs legal and LinkedIn name) and prepare answers on side work alongside full-time jobs, how hiring from Ukraine works, and the leadership titles that list no team size.

Build: current (`npm run status`: up to date). Reviewed the Markdown, `cv/pdf-check.md` (pass, 3 pages: 945 / 800 / 196 words) and `cv/preview/page-1.png`.

## First-10-seconds impression
- **Good:** The name, headline ("Senior Software Engineer / Tech Lead (Frontend & Mobile)"), location, remote setup, B2B or full-time and time-zone overlap all fit in the top three lines. Two known names (SYSPRO, General Motors) and "led a team of 8 developers" appear in the summary and on page 1. Dates are continuous from April 2019 to the present with no gaps.
- **Good:** Every bullet in the current job is concrete ("renders 1,800+ ERP programs", "cutting screen delivery from days to hours"), and the General Motors bullets carry numbers (20% engagement, 15% fewer crashes, 95% coverage).
- **Bad:** The first SYSPRO bullet is the hardest to read on the page ("architecture-governed specification-driven development (SDD)", "traced from architecture through component specification to implementation"). A non-technical recruiter will skim past it to bullet 3 to find what was built.
- **Bad:** Page 1 is dense: the summary's last sentence lists nine specialties, and SYSPRO has nine bullets. The General Motors leadership story only starts about halfway down the page.
- **Neutral:** Several short early jobs (The Admasters 4 months, Thermo Fisher 6 months, OMO 8 months) will be noticed. This is covered by decision `all-full-time` and needs a prepared answer (see questions).

## Strengths
- Senior title at SYSPRO (a known ERP software company) and a Team Leader role at General Motors, both on page 1.
- Clear leadership: a team of 8 at General Motors, a team of 3 at The Admasters, code reviews, mentoring, onboarding and technical interviewing for clients.
- Measurable results in most jobs (12x faster staking list, 3x more new users, 2x database performance, 95% test coverage).
- Wide yet coherent range: React and React Native across ERP, automotive, healthcare, clinical trials, fintech and blockchain.
- The hiring setup is explicit for a worldwide reader: Kyiv, remote, B2B or full-time, EU/UK/US time-zone overlap, phone and email.
- Strong education: Master's with an Honors Diploma (top 10%) and a PhD in progress; English C1.

## Questions the recruiter will ask
1. **"Your LinkedIn and documents say Kyrylo Kokhan. Is that you?"**
   *Why:* the CV says "Kirill Kohan" (cv.md:2), the email is "kiril.kohan@gmail.com", but the legal name in `profile.yaml` is "Kyrylo Kokhan" and the LinkedIn URL is "kyrylo-kohan". A recruiter searching LinkedIn for "Kirill Kohan" may not find the profile, and contracts and background checks use the legal name.
   *Prepare:* "Kirill is the name I use at work; my legal name, as in my passport, is Kyrylo Kokhan. Both are the Ukrainian and the common English spelling of the same name." Consider switching on `show_legal_name` so the header reads "Kirill (Kyrylo) Kohan".
2. **"You did contract and consulting work alongside full-time jobs, and a PhD. How did that fit together, and did your employers know?"**
   *Why:* the consulting section says "Part-time contract and consulting work, alongside full-time roles" (cv.md:152). The summaries place the clinical-trials contract (June 2024 to April 2025) and the Jira plugin contract (May to August 2025) inside the General Motors Team Leader period, while the PhD runs from 2023 to 2027.
   *Prepare (needs your input):* the hours per week for each contract, whether your employer allowed side work, that the clients were in unrelated industries (clinical trials, design tooling vs automotive), and how much time the PhD takes now.
3. **"How would you be hired from Ukraine: B2B invoice, or employment through an Employer of Record? Do you plan to relocate?"**
   *Why:* the header says "Open to B2B contract or full-time employment" (cv.md:6), but full-time employment by a foreign company from Ukraine needs a local entity or an Employer of Record. `profile.yaml` lists no work authorization outside Ukraine and `open_to_relocation: false`.
   *Prepare (needs your input):* how you invoice today for B2B work (if you have a registered business in Ukraine, say so), whether you accept an Employer of Record, and that you work remotely from Kyiv and are not looking to relocate.
4. **"Were you employed directly by General Motors, Thermo Fisher Scientific and SYSPRO, or through a services company?"**
   *Why:* each is listed as "Remote" from Kyiv. Recruiters and background checks often find that remote work for a large US or South African company went through a vendor, and they want the company that will confirm employment.
   *Prepare (needs your input):* the actual employer for each role and the name a reference check should contact.
5. **"You were Technical Leader at Velas and Team Leader at OMO Systems. How many people did you lead?"**
   *Why:* the Velas entry (cv.md:64-84) has no leadership bullet, only individual delivery, and the OMO bullet "Led and mentored the development team" (cv.md:99) gives no size. Both summaries record `team_size_led: 0`.
   *Prepare (needs your input):* the team size and your leadership duties in each role, or an explanation of what "Technical Leader" meant at Velas (technical ownership without direct reports).
6. **"Why did you move from Team Leader at General Motors to Senior Software Engineer at SYSPRO, and why are you looking again after about 10 months?"**
   *Why:* the title changes from "Team Leader" (cv.md:41) to "Senior Software Engineer" (cv.md:18), and SYSPRO started in December 2025.
   *Prepare:* the title step is decided (`keep-title-step`): point to the architecture-level scope at SYSPRO (co-authoring the platform architecture with the lead architect, owning the frontend stack, helping define the development process). Add your real reason for looking now.
7. **"Several early jobs were short (4, 6 and 8 months). Why?"**
   *Why:* The Admasters April to August 2019, Thermo Fisher November 2020 to April 2021, OMO Systems April to December 2021.
   *Prepare (decided, `all-full-time`):* one sentence per job on why it ended (project end, offer for a larger role); keep it factual.
8. **"How do you keep working reliably from Kyiv during power or internet outages?"**
   *Why:* worldwide hiring managers often ask Ukraine-based remote candidates about business continuity.
   *Prepare (needs your input):* your real backup setup (power, second internet connection, working location) and your track record of uptime in remote roles since 2022.
9. **"What does 'specification-driven development' mean in practice? Did AI write your code?"**
   *Why:* SYSPRO bullet 1 (cv.md:22) and the AI skills line (cv.md:238).
   *Prepare (decided, `sdd-not-vibe-coding`):* "We wrote and validated a specification for each component against the architecture before coding; AI agents reviewed the code against those specifications, and people made every decision."

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "Every subsystem was traced from architecture through component specification to implementation across 4 repositories." | cv.md:22 (SYSPRO, bullet 1) | "Each part of the product was planned in the architecture, written up as a specification, then built and checked against it, across 4 code repositories." |
| "drove open questions to decisions" | cv.md:24 (SYSPRO, bullet 2) | "resolved open design questions" |
| "schema-driven React 19 / TypeScript runtime ... renders 1,800+ ERP programs from data-model definitions" | cv.md:26 (SYSPRO, bullet 3) | Keep for ATS; the clause "with no per-screen frontend code" already helps. Optionally: "a React 19 engine that builds 1,800+ ERP screens automatically from their data definitions". |
| "spec-to-code drift" | cv.md:28 (SYSPRO, bullet 4) | "places where the code no longer matched its specification" |
| "zero-trust, independently deployable micro-frontend architecture" | cv.md:32 (SYSPRO, bullet 6) | "a secure setup where each part of the app is deployed on its own" |
| "event bus, event taxonomy, payload contracts, OTLP exporter, and a redaction stage" | cv.md:34 (SYSPRO, bullet 7) | "a module that records how users use the app and removes personal data before sending it" |
| "HERE HNav / HNod SDK" | cv.md:55 (General Motors, bullet 6) | "HERE navigation SDK" (keep the product names in the skills list) |
| "Node RPC fallback" | cv.md:70 (Velas, bullet 2) | "a backup server connection" |
| "reverse tabnabbing vulnerability" | cv.md:80 (Velas, bullet 7) | "a security flaw that let opened links take over the original page" |
| "fintech product (Forbes top 10)" | cv.md:123 (Itjet, bullet 1) | Name the list: "a fintech product on a Forbes top-10 list of ..." |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | high | cv.md:2, cv.md:8 (header: name and email) | Identity mismatch with no explanation in the CV: the CV and email say "Kirill Kohan" / "kiril.kohan@gmail.com", while the legal name is "Kyrylo Kokhan" and the LinkedIn URL is "kyrylo-kohan" (`profile.yaml`). With no LinkedIn link in the header (decided), a recruiter searching for "Kirill Kohan" may not find the profile, and contracts and background checks will show a different first name and surname spelling. | Decide whether to set `show_legal_name: true` in `profile.yaml` so the header reads "Kirill (Kyrylo) Kohan", or keep it off and prepare the one-line explanation in question 1. | yes |
| hr-2 | medium | cv.md:152 (Consulting section intro); cv.md:155, cv.md:172 (contract entries); cv.md:43 (General Motors dates); cv.md:204 (PhD) | Side work and workload: "Part-time contract and consulting work, alongside full-time roles" invites conflict-of-interest and workload questions. The clinical-trials contract (2024-06 to 2025-04) and the Jira plugin contract (2025-05 to 2025-08) overlap the full-time General Motors Team Leader role, and the PhD (2023-2027) runs at the same time. | Prepare the answer in question 2: hours per week, whether the employer allowed side work, unrelated industries, PhD time. No CV change needed unless you want to state the weekly hours. | yes |
| hr-3 | medium | cv.md:6 (header: availability line) | Hiring setup: "Open to B2B contract or full-time employment" from Kyiv leaves open how full-time employment would work for a foreign company (Employer of Record or local entity) and how B2B is invoiced. No work authorization outside Ukraine and no relocation are recorded in `profile.yaml`; the CV doesn't say so, which is fine for remote roles but will be asked. | Prepare the answer in question 3 (registered business for B2B if you have one, Employer of Record acceptable or not, remote only). | yes |
| hr-4 | medium | cv.md:20, cv.md:43, cv.md:104 (SYSPRO, General Motors, Thermo Fisher Scientific headings) | Employer vs client is unclear: large US and South African companies listed as "Remote" from Kyiv. Recruiters and reference checks will ask whether the employment was direct or through a services company, and whom to contact. | Prepare the actual employer for each role (question 4). If any was through a vendor, consider recording it in the summary so the advisor can decide how to show it. | yes |
| hr-5 | medium | cv.md:64-84 (Velas, all bullets); cv.md:99 (OMO Systems, bullet 5) | Leadership titles without team size: "Technical Leader" at Velas has no leadership bullet at all, and "Led and mentored the development team" at OMO gives no size (both summaries record `team_size_led: 0`). A recruiter will ask how many people were led. | Confirm the team size and leadership duties for both roles (question 5); if there were reports, add them as a confirmed fact with `/add-experience`. | yes |
| hr-6 | medium | cv.md:6 (header: "Kyiv, Ukraine (Remote)") | Business continuity: worldwide clients commonly ask Ukraine-based remote candidates about power and internet outages. Nothing in the CV addresses it (and it doesn't need to), but the answer must be ready. | Prepare the answer in question 8 from your real setup. | yes |
| hr-7 | low | cv.md:22 (SYSPRO, bullet 1, second sentence); cv.md:32, cv.md:34 (SYSPRO, bullets 6 and 7) | Jargon a recruiter won't follow in the first page's most-read bullets: "Every subsystem was traced from architecture through component specification to implementation across 4 repositories", "zero-trust, independently deployable micro-frontend architecture", "OTLP exporter". The SDD framing and its position are decided; only the wording of the second sentence and the later bullets is at issue. | Use the plain alternatives in the wording table, keeping the decided SDD framing and the ATS keywords (OIDC, OpenTelemetry, micro-frontend). | no |
| hr-8 | low | cv.md:13 (Summary, sentence 4) | The last summary sentence lists nine specialties ("micro-frontend architecture, OpenID Connect (OIDC) authentication, OpenTelemetry observability, test automation, native Android migrations, ..."), which reads as a keyword list on page 1. | Keep the three or four that matter most to the target roles in the summary; the rest are already in the skills section. | no |
| hr-9 | low | cv.md:123 (Itjet, bullet 1) | "a fintech product (Forbes top 10)" doesn't say which list or year; a recruiter may ask and can't verify it. | Name the list (e.g. "on Forbes' top-10 list of ... in <year>") or drop the bracket. | yes |
| hr-10 | low | cv.md:95 (OMO Systems, bullet 3); cv.md:76, cv.md:78 (Velas, bullets 5 and 6) | Large outcome numbers attributed to single features ("company income grew 10x after launch", "tripled the number of new users", "user engagement grew 4x afterwards") will draw "how was that measured, and what was your part?" | Prepare one sentence of context for each (baseline, time frame, your share). The wording already says "after", which is fair. | yes |

## Decided (not raised again)
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step` (interview answer in question 6).
- Short early tenures (The Admasters, Thermo Fisher Scientific, OMO Systems) with no "(Contract)" label: `all-full-time` (interview answer in question 7).
- No LinkedIn or GitHub link in the header: `no-profile-links` (the identity finding hr-1 is about the name, not the link).
- CV length (3 pages, about 1,950 words): `keep-length`.
- Google Drive portfolio link in the header: `keep-portfolio-link`.
- No dates in the consulting and freelance section: `consulting-no-dates`.
- Unnamed clients ("Clinical Trials Patient App", "Generative AI Jira Plugin"): `hidden-clients`.
- SYSPRO opening with the SDD process and "not ad-hoc AI code generation" (could read as defensive about AI): `sdd-not-vibe-coding`.
