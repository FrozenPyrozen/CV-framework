---
schema_version: 1
rubric: ats
cv: cv/variants/react/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:05
verdict: pass
score: 8.5
---

# AI ATS screener review (React variant)

## Verdict
The React variant passes an AI screener for Senior React / Frontend Tech Lead roles. It parses cleanly: `cv/variants/react/pdf-check.md` passes, the PDF has 2 pages with readable text and embedded fonts, and page 1 shows every contact field the worldwide market asks for. The current job is React 19 / TypeScript with micro-frontends, OIDC, XState, Zustand and OpenTelemetry, all in bullets and with measured results. The weak points are small. The Velas "Technical Leader" title has no leadership bullet. Three acronyms the master CV now spells out (WCAG, PII, IoT) are bare in this variant. A few frontend keywords with hands-on sources (React Testing Library, Styled Components, ADR) appear only in Skills. The CV has about 160 words of headroom, so it can absorb these fixes.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES, plus "CONSULTING AND FREELANCE PROJECTS"), one column, no tables or text boxes. `pdf-check.md` passes (2 pages, embedded ArialMT / Cambria); the page 1 preview reads in order. No forbidden characters in the Markdown. |
| Contact details | pass | Name, headline, location, availability, time-zone overlap, phone in international format (`+380 97 891 9783`), email and portfolio on page 1 (cv.md:2-8), as the worldwide market shows them. The portfolio URL renders only as the link text "Portfolio" (decided). |
| Dates and gaps | pass | One format ("December 2025 - Present"). Full-time roles run without gaps from April 2019 to now. The consulting section is labeled "alongside full-time roles" (cv.md:118). Short tenures (The Admasters, Thermo Fisher, OMO Systems) are decided. |
| Seniority signals | warning | Strong evidence: "Owned the frontend technology stack" and "platform and solution architecture" (SYSPRO), "Led the map team of 8 engineers" and "Owned the system design" (General Motors), team leads at OMO Systems and The Admasters. The Velas "Technical Leader" entry has only individual-contributor bullets (ats-1). The team of 8 was a React Native team, which is already in the gap report. |
| Keywords in context | warning | The profile's core terms appear in bullets: React 19, TypeScript, micro-frontends, schema-driven runtime, XState, Zustand, OIDC, OpenTelemetry, Vitest Browser Mode, Storybook, WCAG, Next.js / SSR, design system, Redux, TanStack Router. React Testing Library, Styled Components and ADR appear only in Skills, though the summaries record them as hands-on (ats-3). WCAG, PII and IoT are never spelled out (ats-2). |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "4 repositories". Earlier roles: 20%, 15%, 95%, 2 minutes to 5 seconds, 5x, 4x, 3x, 10x, 20%, 2x, more than 5 million users, up to 50%. |
| Signs of AI padding | pass | No filler words, and nearly every bullet names a technology and an action or result. One bullet is vague, with no technology or result: "Redesigned a legacy codebase to speed up feature deployment." (ats-4). |
| Length | pass | 1,638 words in the PDF (pdf-check: 1,002 + 636; profile `max_words: 1800`) and 2 pages (profile `max_pages: 3`). Older roles are shorter by design. |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Frontend / React Engineer | strong pass | The current job is React 19 / TypeScript on the web, with micro-frontends, OIDC, XState, Zustand, TanStack, Vite, Vitest and Storybook. Senior title and 7+ years. Web React work also appears at Velas, Itjet and the Jira plugin. |
| Senior React Native / Mobile | pass | React Native at General Motors (team lead), Velas, Thermo Fisher, Itjet (Wink, 5M+ users) and the clinical-trials contract. This variant puts the web first and drops most mobile detail, so the React Native variant is the better fit for these roles. |
| Tech Lead / Frontend Architect | pass | Team of 8 at General Motors, architecture co-authoring and frontend stack ownership at SYSPRO, system design, coding standards and technical interviewing. The current title is "Senior Software Engineer" (decided), and the Velas "Technical Leader" title lacks leadership evidence (ats-1). |
| Full-stack (Node-heavy) | borderline | Node.js, Express, Sequelize, PostgreSQL and AWS RDS appear, but only at Itjet (2019-2020) and Velas. A Node-first screen will rank this below backend-led candidates; the full-stack variants fit better. |
| Native Android | likely filtered out | Android (Java / Kotlin) appears only in the clinical-trials contract bullet and Skills. This is a real gap, not a wording problem, and not a target of this variant. |
| Senior React Engineer / Frontend Tech Lead (profile `react`) | strong pass | Matches the headline: the React 19 runtime, micro-frontends and SDD for "Senior React Engineer", and the team of 8 plus stack ownership for "Frontend Tech Lead". The gaps in `gap-report.md` (recent Next.js, web performance numbers, web React leadership) are known. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | medium | cv/variants/react/cv.md:54-66 (Velas, title and all 5 bullets) | The title "Technical Leader" has no supporting bullet. Every bullet describes individual work ("Developed the Velas blockchain wallet", "Built a new cross-platform wallet", "Cut staking page loading"). Screeners that check titles against responsibilities may score the role as an individual contributor, which weakens the "Tech Lead" half of the headline. The summary already supports an ownership sentence: "Owned performance work across the wallet, CI/CD builds and signing, end-to-end and unit test setup, store publishing, and the architecture of the new wallet" (`summaries/velas-wallet.md:43`). Team size is still a TODO (`summaries/velas-wallet.md:35, 45`), and it's an open item in `docs/open-items.md:20` ("later"). | Without new input, open the entry with an ownership bullet from `velas-wallet` section 3, or fold "owned the wallet's architecture, CI/CD and test setup" into bullet 2. When the user answers the open item (people led, code reviews), add it as a confirmed fact. | yes |
| ats-2 | low | cv/variants/react/cv.md:28 (SYSPRO, bullet 4: "strips sensitive data (PII)"), 32 (SYSPRO, bullet 6: "accessible typography per **WCAG**"), 84 (Thermo Fisher, bullet 1: "**IoT healthcare** app") | These acronyms are never spelled out in this variant, but the master CV now spells them out ("Web Content Accessibility Guidelines (**WCAG**)", "personally identifiable information (**PII**)", "Internet of Things (**IoT**)", cv/Kirill_Kohan_CV.md:32, 34, 93). WCAG matters most here, since accessibility is an emphasized tag of the `react` profile and job ads often write it out. | Use the master's spelled-out forms when the variant is next rebuilt (/variants). That adds about 10 words, well inside the limit. | no |
| ats-3 | low | cv/variants/react/cv.md:172, 178, 190 (SKILLS: "Styled Components", "React Testing Library", "Architecture decision records (ADR)") | Common frontend requirements that appear only in Skills, though the summaries record them as hands-on: React Testing Library (`summaries/itjet-fintech.md:174`), Styled Components (`summaries/syspro-saas-erp.md:227`, `general-motors-navigation.md:125`, `itjet-fintech.md:175`), and the technology-stack decision record (`summaries/syspro-saas-erp.md:97-99`). Screeners that weight in-context keywords give them little credit. Rated low because the CV's testing and styling evidence is otherwise strong (Vitest, Jest, CSS Modules, Storybook). | Honestly addable within the ~160-word headroom. Add "React Testing Library" to the Itjet test list in bullet 1 (cv.md:93). Add "Styled Components" to the SYSPRO Stack line (cv.md:36). Say "technology-stack decision record (ADR)" in SYSPRO bullet 2 (cv.md:24). | no |
| ats-4 | low | cv/variants/react/cv.md:110 (The Admasters, bullet 1) | "Redesigned a legacy codebase to speed up feature deployment." names no technology and no result, so it reads as a generic bullet. The summary has no more detail (`summaries/admasters-ecommerce.md:66`). | Ask the user for the stack and a rough result (for example how much faster deployment became). Otherwise move the bullet below the Next.js bullet so the entry opens with a technology. | yes |

## Decided (not raised again)
- In the PDF the portfolio URL shows only as the link text "Portfolio", so screeners that ignore hyperlinks can't read it (cv.md:8): keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters, Thermo Fisher Scientific and OMO Systems, with no "(Contract)" label: all-full-time
- Title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO), and no title with "Frontend" or "Tech Lead" at SYSPRO: keep-title-step
- Consulting and freelance entries have no dates: consulting-no-dates
- Unnamed clients ("Clinical Trials Patient App", "Generative AI Jira Plugin") are parsed as employer names: hidden-clients
- The summary paragraph names no employer and no timing: summary-no-company-names
- "React.js" next to "React 19" in Skills: keep-contact-and-keywords
- Playwright appears only in the SYSPRO Stack line and Skills, with no E2E suite claim: playwright-browser-mode-only
- The SDD sentence in the summary: sdd-summary-sentence

Already in `cv/variants/react/gap-report.md`, so not raised again: no recent Next.js / SSR; no measured web performance result; design systems and accessibility evidence limited to Itjet and the Login micro-frontend; E2E testing; leadership was on a React Native team, with no direct reports at SYSPRO; GraphQL and Docker only at Itjet; Redux on the web only through Skills; SYSPRO testing and KendoReact bullets cut by the bullet limit.
