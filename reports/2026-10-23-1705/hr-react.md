---
schema_version: 1
rubric: hr
cv: cv/variants/react/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:06
verdict: pass-with-issues
score: 8
---

# HR recruiter review

## Verdict
Yes, a recruiter for Senior React / Frontend Tech Lead roles would likely shortlist this CV: page 1 shows a current React 19 / TypeScript senior role, known company names (SYSPRO, General Motors, Thermo Fisher Scientific), 7+ years, a team of 8 and clear hiring terms. The issues are emphasis rather than blockers: the current job opens with process wording before the React work, and most of page 1 after SYSPRO reads as mobile (React Native, Android, Bluetooth), which makes the "Frontend" half of the headline less clear.

Build state: `npm run status` reports the CV up to date; the PDF (2 pages, 1,002 and 636 words per page, `pdf-check.md` pass) and `preview/page-1.png` were reviewed. Length is within the profile (`max_pages: 3`, `max_words: 1800`; about 1,640 words in the PDF), and page 1 carries the strongest material.

## First-10-seconds impression
- **Good:** the headline "Senior React Engineer / Frontend Tech Lead" matches the target role exactly; the header answers location, remote, B2B or full-time and time zones without a question; the current job is React 19 / TypeScript with a concrete scale figure ("1,800+ ERP programs", "25+ person program"); General Motors and Thermo Fisher Scientific are names a recruiter knows; "team of 8 engineers" supports the lead part of the headline.
- **Bad:** the first SYSPRO bullet is about the delivery process (specification-driven development, AI agents, "traced from architecture to code across 4 repositories"), so a recruiter skimming for "what did they build in React" finds it only in bullet 3. Below SYSPRO, "React Native" appears in nearly every entry on page 1 and one bullet is Android-only, so a fast reader may file the candidate as a mobile engineer. The current title "Senior Software Engineer" under a "Tech Lead" headline will be noticed (the title step is decided; see Questions).

## Strengths
- Headline, summary and current role all aligned with React / frontend leadership; summary names React 19, micro-frontends, OIDC, XState, Zustand, OpenTelemetry, Vitest.
- Current job shows architecture-level scope: works with the lead architect, owns the frontend technology stack, built core modules of a runtime for a 25+ person program.
- Measurable results a non-technical reader understands: "cutting screen delivery from days to hours", "user engagement rose 20% and app crashes fell 15%", "from 2 minutes to 5 seconds", "more than 5 million registered users", "Forbes top 10".
- Clear leadership evidence with numbers: team of 8 (General Motors), about 3 (OMO Systems), 3 (The Admasters), plus senior technical interviewing.
- Hiring setup is upfront for the worldwide market: remote from Kyiv, B2B or full-time, time-zone overlap, phone shown.
- Tidy length: 2 pages, consistent date format, no gaps between jobs since April 2019.

## Questions the recruiter will ask
1. **"Your title is Senior Software Engineer now, but you were Team Leader before and you apply as Frontend Tech Lead. Which role do you want, and why move after about 10 months?"**
   - *Why they'll ask:* headline vs current title (cv.md:4, cv.md:18), SYSPRO started December 2025.
   - *Suggested answer to prepare:* at SYSPRO you work with the lead architect on platform architecture and own the frontend technology stack for the Login micro-frontend and the schema-driven runtime (cv.md:24), which is lead-level technical scope without direct reports; before that you led a team of 8 at General Motors. Say which you want next (people lead or hands-on technical lead) and give a reason for looking that you are comfortable with.
2. **"Your team of 8 was on a React Native app. Have you led a web React team?"**
   - *Why they'll ask:* the only team-of-8 evidence is "built in React Native" (cv.md:43); the gap report lists "Web React leadership" as weak.
   - *Suggested answer to prepare:* the team-of-8 practices (code reviews, coding standards, modular architecture, 95% unit-test coverage strategy) are the same for web; at OMO Systems the payment flow you led was in React (cv.md:75); at SYSPRO you own the web frontend stack and helped define the delivery process for a 25+ person program.
3. **"What does specification-driven development with AI agents mean? Is the code AI-written?"**
   - *Why they'll ask:* first bullet of the current job (cv.md:22).
   - *Suggested answer to prepare (decisions `sdd-not-vibe-coding`, `ai-agents-wording`):* every part is written as a specification first; AI agents implement and review code against those specifications under human review, and each subsystem is traced from architecture to code. It is a governed process, not ad-hoc AI code generation.
4. **"How many working hours do you overlap with US clients?"**
   - *Why they'll ask:* the header says "Working hours overlap with EU, UK and US time zones" (cv.md:6); Kyiv is 7 hours ahead of US East and 10 hours ahead of US West.
   - *Suggested answer to prepare:* give a concrete window (for example, which Kyiv hours you can work for US East and US West). Only you can say what is realistic.
5. **"You're doing a PhD and had contracts during your General Motors job. How much time does the PhD take?"**
   - *Why they'll ask:* PhD 2023 to 2027 (cv.md:154-156) overlaps all full-time roles since 2023; the consulting section says "alongside full-time roles" (cv.md:118).
   - *Suggested answer to prepare:* hours per week on the PhD and that it does not affect working hours; the contract-hours part is already parked in `docs/open-items.md` ("Side work").
6. **"What is your name on your passport and LinkedIn?"**
   - *Why they'll ask:* CV name "Kirill Kohan", email "kiril.kohan", legal name "Kyrylo Kokhan".
   - *Suggested answer to prepare (decision `keep-cv-name`):* "Kirill Kohan is the English spelling I use; my legal name is Kyrylo Kokhan, and LinkedIn is kyrylo-kohan."
7. **"Were you employed by SYSPRO / General Motors directly?"**
   - *Suggested answer to prepare (decision `direct-employment`):* yes, directly employed by SYSPRO, General Motors and Thermo Fisher Scientific.
8. **"Why were OMO Systems, Thermo Fisher and The Admasters short?"**
   - *Why they'll ask:* 8, 6 and 4 months (cv.md:71, 82, 108).
   - *Suggested answer to prepare (decision `all-full-time`):* a short reason for each move; prepared in interviews, no labels in the CV.

Notice period, hiring route (FOP, Employer of Record), outages and Velas team size will also come up; they are already tracked in `docs/open-items.md`.

## Wording a non-technical reader won't understand
| Quote (location) | Plain alternative |
|---|---|
| "with each subsystem traced from architecture to code across 4 repositories" (cv.md:22, SYSPRO bullet 1) | "checking each part of the code against its design across 4 code repositories" |
| "renders 1,800+ ERP programs from data-model definitions" (cv.md:26, SYSPRO bullet 3) | "builds 1,800+ ERP screens automatically from their data descriptions" (keep "ERP programs" if that is the platform's term) |
| "event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter" (cv.md:28, SYSPRO bullet 4) | "records user and app events in a standard format and sends them to monitoring, removing personal data first" (keep "OpenTelemetry" as the keyword) |
| "view orchestration layer ... view session lifecycle, ... context-aware related-program navigation" (cv.md:30, SYSPRO bullet 5) | "the part that controls which screens are open and how users move between related screens" |
| "zero-trust, independently deployable micro-frontend architecture where apps never import from each other" (cv.md:34, SYSPRO bullet 7) | "separate frontend apps that are released on their own and don't trust each other by default" |
| "It is the only app ever exposed to a user's password." (cv.md:32, SYSPRO bullet 6) | "It is the only part of the platform that ever handles user passwords." |
| "adding a blockchain-node RPC fallback" (cv.md:62, Velas bullet 3) | "adding a backup connection to the blockchain" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:22 (SYSPRO, bullet 1); cv.md:26 (SYSPRO, bullet 3) | The first bullet of the current job is process wording: "Delivered the frontend through architecture-governed specification-driven development (SDD) ... with each subsystem traced from architecture to code across 4 repositories." The React result a React recruiter looks for ("schema-driven React 19 / TypeScript runtime ... 1,800+ ERP programs ... from days to hours") is only bullet 3. Raised on the master CV as 2026-10-23-1349 hr-1; still open and not a decision. | For this variant, put `syspro-saas-erp#4.1` first (pin order in `profiles/react.yaml`), keeping the SDD bullet pinned and its decided framing; or shorten its tail as in the wording table. | no |
| hr-2 | medium | cv.md:43, 58-66, 73, 84, 95 (General Motors bullet 1, Velas bullets 1-5, OMO bullet 1, Thermo Fisher bullet 1, Itjet bullet 2) | Mobile tilt on page 1 for a frontend role: after SYSPRO almost every entry leads with React Native, and Velas bullet 5 is Android-only ("Made the first interaction with the Android wallet 3x faster"), Thermo Fisher bullet 1 mentions "radiation dosimeters over Bluetooth", OMO bullet 1 "mobile app architecture". A 10-second reader may see a mobile engineer with one recent web job. (Web React leadership itself is already in the gap report; this is about bullet choice.) | Swap Velas `#4.9` (Android) for `velas-wallet#4.10` ("Removed unnecessary component re-renders ... lighter API responses", tagged react and performance), which also helps the weak web-performance area; where a bullet covers both, name the web side first (e.g. Velas bullet 1 already says "for web, mobile and desktop"). | no |
| hr-3 | low | cv.md:6 (header) | "Working hours overlap with EU, UK and US time zones": US West is 10 hours behind Kyiv, so a US recruiter will ask how many hours overlap. | Prepare question 4 with a concrete window; if the overlap is mainly US East, consider recording that in `profile.yaml` (`overlaps`) with `/profile`. | yes |
| hr-4 | low | cv.md:154-156 (PhD 2023-2027); cv.md:118 (consulting intro) | Workload: a PhD in progress since 2023 alongside full-time roles and part-time contracts. The contract-hours question is parked in `docs/open-items.md` ("Side work"); the PhD time commitment is not tracked anywhere. | Prepare question 5 (PhD hours per week, how it fits around work). | yes |
| hr-5 | low | cv.md:28, 30, 34, 62 (SYSPRO bullets 4, 5, 7; Velas bullet 3) | Jargon on page 1 a non-technical recruiter skims past: "event taxonomy, payload contracts", "OTLP exporter", "view orchestration layer", "context-aware related-program navigation", "zero-trust", "blockchain-node RPC fallback". | Use the plain alternatives in the wording table, keeping the ATS keywords (OpenTelemetry, XState, Zustand, OIDC, micro-frontend). | no |
| hr-6 | low | cv.md:32 (SYSPRO, bullet 6) | "It is the only app ever exposed to a user's password." reads oddly and could be misread as a security weakness. | "It is the only part of the platform that ever handles user passwords." (same meaning as `syspro-saas-erp#4.6` Result). | no |

## Decided (not raised again)
- Name "Kirill Kohan" vs legal name "Kyrylo Kokhan" and LinkedIn handle: `keep-cv-name` (prepared answer in question 6).
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step` (question 1 prepares the target-role answer, not a title change).
- Short tenures at OMO Systems, Thermo Fisher Scientific and The Admasters, no contract labels: `all-full-time`.
- No dates in the consulting section: `consulting-no-dates`.
- No LinkedIn or GitHub link in the header: `no-profile-links`.
- Google Drive portfolio link: `keep-portfolio-link`.
- "1,800+ ERP programs" figure and SYSPRO detail: `keep-erp-programs-figure`.
- Summary names no companies and doesn't state the current role: `summary-no-company-names`.
- SDD sentence in the summary: `sdd-summary-sentence`; SDD framing of the first SYSPRO bullet: `sdd-not-vibe-coding`, `ai-agents-wording` (hr-1 is about bullet order only).
- Hidden client names for the clinical-trials app and the Jira plugin: `hidden-clients`, `hidden-client-details-ok`.
- No Playwright E2E claim at SYSPRO: `playwright-browser-mode-only`.
- Direct employment at SYSPRO, General Motors, Thermo Fisher Scientific: `direct-employment`.
- Previous-CV metrics ("Forbes top 10", "income grew 10x", "engagement grew 4x"): `keep-previous-cv-metrics`.

Not raised because they are already tracked: web React leadership, recent Next.js, design systems, accessibility, web performance and E2E (`cv/variants/react/gap-report.md`); Velas leadership, side-work hours, notice period, hiring route and outages (`docs/open-items.md`).
