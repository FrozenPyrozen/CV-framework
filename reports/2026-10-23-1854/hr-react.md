---
schema_version: 1
rubric: hr
cv: cv/variants/react/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass
score: 8.5
---

# HR recruiter review

## Verdict
Yes, a recruiter for Senior React / Frontend Tech Lead roles would move this candidate to a first call. Page 1 shows a current React 19 / TypeScript senior role that now opens with what was built and its results ("1,800+ ERP programs", "from days to hours"). It also shows names a recruiter knows (SYSPRO, General Motors, Thermo Fisher Scientific), 7+ years, a team of 8 and clear hiring terms. What's left is interview preparation and some technical wording in the middle SYSPRO bullets, not blockers.

Build state: `npm run status` reports the CV current. `pdf-check.md` passes (2 pages, 1,035 and 752 words per page), and I reviewed `preview/page-1.png`. Page 1 carries the strongest material: the summary, SYSPRO, General Motors, Velas, OMO Systems, Thermo Fisher and the start of Itjet.

**Follow-up on the 2026-10-23-1705 report** (fixes applied in changelog row 91):
- **hr-1** (current job opened with process wording): **fixed and decided**. The runtime bullet is now first and the SDD bullet second, with a shorter ending (cv.md:22-24; decision `syspro-runtime-bullet-first`).
- **hr-2** (mobile tilt; the Android-only Velas bullet): **fixed**. The Android bullet is gone, and Velas now opens with the React re-render bullet (cv.md:60). General Motors and Thermo Fisher are still React Native by nature, and web React leadership stays in the gap report.
- **hr-3** (how many hours overlap with US time zones): **still open**. The header still says "Working hours overlap with EU, UK and US time zones" (cv.md:6). Carried forward as hr-2 below.
- **hr-4** (PhD workload alongside full-time work): **still open**. The PhD time commitment is not tracked anywhere (the side-work part is the open item "Side work"). Carried forward as hr-3 below.
- **hr-5** (jargon in SYSPRO bullets 4, 5 and 7 and Velas): **partly fixed**. "RPC" is now spelled out (cv.md:68). "event taxonomy, payload contracts", "view orchestration layer" and "zero-trust" are still there (cv.md:28, 30, 34). Carried forward as hr-1 below.
- **hr-6** (odd password sentence): **fixed**. It now reads "It is the only app that handles a user's password, so no other app ever sees it." (cv.md:32), which is clear.

## First-10-seconds impression
- **Good:**
  - The headline "Senior React Engineer / Frontend Tech Lead" matches the target role.
  - The header answers location, remote work, B2B or full-time, and time zones.
  - The first SYSPRO bullet is React 19 / TypeScript at scale ("1,800+ ERP programs", "25+ person program", "cutting screen delivery from days to hours").
  - General Motors and Thermo Fisher Scientific are names a recruiter knows.
  - "team of 8 engineers" is in the summary and in the General Motors entry.
- **Bad:**
  - The current title "Senior Software Engineer" sits under a "Tech Lead" headline (decided; prepared in question 1).
  - SYSPRO bullets 4, 5 and 7 are dense technical lists that a recruiter will skip.
  - Below SYSPRO, page 1 is still mostly React Native work, but the Velas entry now opens with web React.

## Strengths
- The headline, the summary and the first bullet of the current job all point at React / frontend.
- The current job has architecture-level scope: working with the lead architect, owning the frontend technology stack, and building core modules for a 25+ person program.
- The results are easy to grasp: "from days to hours", "engagement rose 20% and app crashes fell 15%", "from 2 minutes to 5 seconds", "more than 5 million registered users", "income grew 10x".
- The leadership evidence has numbers: team of 8 (General Motors), about 3 (OMO Systems), 3 (The Admasters), plus senior technical interviews.
- The hiring setup is clear for the worldwide market.
- The length is tidy: 2 pages, one date format, no gaps since April 2019, and acronyms spelled out on first use.

## Questions the recruiter will ask
1. **"You're a Senior Software Engineer now, you were a Team Leader before, and you're applying as a Frontend Tech Lead. Which role do you want, and why move after about 10 months?"**
   - *Why they'll ask:* the headline differs from the current title (cv.md:4, 18), and SYSPRO started in December 2025.
   - *Suggested answer to prepare (decision `keep-title-step`):* at SYSPRO you own the frontend technology stack and work with the lead architect on platform architecture (cv.md:26). That is lead-level technical scope without direct reports. Before that you led a team of 8 at General Motors. Say which role you want next, and give a reason for looking that you're comfortable with.
2. **"Your team of 8 worked on a React Native app. Have you led a web React team?"**
   - *Why they'll ask:* the team-of-8 bullet says "built in **React Native**" (cv.md:43). The gap report also lists this.
   - *Suggested answer to prepare:* the same practices apply on the web (code reviews, coding standards, modular architecture, the 95% coverage strategy). At OMO Systems you led while building a React payment flow (cv.md:79). At SYSPRO you own the web frontend stack.
3. **"What does specification-driven development with AI agents mean? Is the code AI-written?"**
   - *Why they'll ask:* SYSPRO bullet 2 (cv.md:24).
   - *Suggested answer to prepare (decisions `sdd-not-vibe-coding`, `ai-agents-wording`):* each part starts as a specification. AI agents implement and review code against those specifications, under human review. It is a governed process, not ad-hoc AI code generation.
4. **"How many working hours do you overlap with US clients?"**
   - *Why they'll ask:* the header says "US time zones" (cv.md:6). Kyiv is 7 hours ahead of US East and 10 hours ahead of US West.
   - *Suggested answer to prepare:* a concrete window in Kyiv hours for US East and for US West. Only you can say what's realistic (hr-2).
5. **"You're doing a PhD alongside full-time work and contracts. How much time does it take?"**
   - *Why they'll ask:* the PhD runs 2023-2027 (cv.md:164-166), and the consulting section says "alongside full-time roles" (cv.md:124).
   - *Suggested answer to prepare:* PhD hours per week, and that they don't overlap working hours (hr-3). Contract hours are already the open item "Side work".
6. **"You went from Team Leader at OMO Systems to Software Engineer at Thermo Fisher. Why?"**
   - *Why they'll ask:* the title order in cv.md:73 and cv.md:84.
   - *Suggested answer to prepare:* a short reason (for example, joining a known healthcare company to design an app from scratch, cv.md:88), in your own words. The short tenures themselves are covered by `all-full-time`.
7. **"What is your name on your passport and LinkedIn?"**
   - *Suggested answer to prepare (decision `keep-cv-name`):* "Kirill Kohan is the English spelling I use. My legal name is Kyrylo Kokhan, and my LinkedIn is kyrylo-kohan."
8. **"Were you employed by SYSPRO and General Motors directly?"**
   - *Suggested answer to prepare (decision `direct-employment`):* yes. SYSPRO, General Motors and Thermo Fisher Scientific employed you directly.

The notice period, hiring route, outages and Velas team size will also come up. They are already tracked in `docs/open-items.md`.

## Wording a non-technical reader won't understand
| Quote (location) | Plain alternative |
|---|---|
| "a schema-driven React 19 runtime that renders 1,800+ ERP programs from data-model definitions inside a zero-trust micro-frontend architecture" (cv.md:13, summary) | "a React 19 platform that builds 1,800+ ERP screens automatically from their data descriptions, made of separately released frontend apps". Keep "micro-frontend" as the keyword. |
| "event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter and a redaction stage" (cv.md:28, SYSPRO bullet 4) | "records user and app events in a standard format and sends them to monitoring, removing personal data first". Keep "OpenTelemetry". |
| "view orchestration layer ... view session lifecycle, main navigation, context-aware related-program navigation" (cv.md:30, SYSPRO bullet 5) | "the part that controls which screens are open and how users move between related screens". Keep "XState" and "Zustand". |
| "zero-trust, independently deployable micro-frontend architecture where apps never import from each other" (cv.md:34, SYSPRO bullet 7) | "separate frontend apps that are released on their own and don't share code". |
| "adding a blockchain-node remote procedure call (RPC) fallback" (cv.md:68, Velas bullet 5) | "adding a backup connection to the blockchain". |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | low | cv.md:28, 30, 34 (SYSPRO bullets 4, 5, 7); cv.md:13 (summary, sentence 2) | Carried from the earlier hr-5. Technical lists on page 1 that a recruiter skims past: "event taxonomy, payload contracts", "view orchestration layer", "context-aware related-program navigation", "zero-trust". The first two SYSPRO bullets are now readable, so this is no longer in the opening bullets. | Use the plain alternatives in the wording table where words allow, keeping the ATS keywords (OpenTelemetry, XState, Zustand, OIDC, micro-frontend). The variant is at about 1,778 of 1,800 words, so each change must not add words. | no |
| hr-2 | low | cv.md:6 (header) | Carried from the earlier hr-3. "Working hours overlap with EU, UK and US time zones": US West is 10 hours behind Kyiv, so a US recruiter will ask how many hours overlap. | Prepare question 4 with a concrete window. If the overlap is mainly with US East, consider recording that in `profile.yaml` (`overlaps`) with `/profile`. | yes |
| hr-3 | low | cv.md:164-166 (PhD 2023 - 2027); cv.md:124 (consulting intro) | Carried from the earlier hr-4. Workload: a PhD in progress since 2023 alongside full-time roles and part-time contracts. The contract-hours part is the open item "Side work"; the PhD time commitment isn't tracked anywhere. | Prepare question 5 (PhD hours per week, and how the PhD fits around work). Consider adding it to `docs/open-items.md` under interview preparation. | yes |

## Decided (not raised again)
- SYSPRO runtime bullet first and SDD bullet second (earlier hr-1): `syspro-runtime-bullet-first`.
- Name "Kirill Kohan" vs legal name "Kyrylo Kokhan" and the LinkedIn handle: `keep-cv-name` (question 7).
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step` (question 1).
- Short tenures at OMO Systems, Thermo Fisher Scientific and The Admasters, with no contract labels: `all-full-time`.
- No dates in the consulting section: `consulting-no-dates`.
- No LinkedIn or GitHub link in the header: `no-profile-links`.
- Google Drive portfolio link: `keep-portfolio-link`.
- "1,800+ ERP programs" figure and the level of SYSPRO detail: `keep-erp-programs-figure`.
- Summary names no companies and doesn't state the current role: `summary-no-company-names`.
- SDD sentence in the summary: `sdd-summary-sentence`. AI agent wording in SYSPRO bullet 2: `ai-agents-wording`.
- Direct employment at SYSPRO, General Motors and Thermo Fisher Scientific: `direct-employment`.
- Previous-CV metrics ("Forbes top 10", "income grew 10x", "engagement grew 4x"): `keep-previous-cv-metrics`.
- Itjet client names (Aspiration, RegiStart, Wink, Oroscopo): `itjet-client-names`.

Not raised again because they are already tracked:
- In `cv/variants/react/gap-report.md`: web React leadership, recent Next.js, accessibility, web performance and web E2E.
- In `docs/open-items.md`: Velas leadership, side-work hours, notice period, hiring route, outages and the Admasters stack.
