---
schema_version: 1
rubric: ats
cv: cv/variants/react/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass
score: 9
---

# AI ATS screener review (React variant)

## Verdict
The React variant passes an AI screener for Senior React / Frontend Tech Lead roles. It parses cleanly: `pdf-check.md` passes, the PDF has 2 pages with embedded fonts, and `npm run status` reports the variant current. Page 1 shows every contact field the worldwide market asks for. The current job now opens with the React 19 / TypeScript runtime bullet and its measured results. React, micro-frontends, OIDC, XState, Zustand, OpenTelemetry and Vitest Browser Mode all appear in bullets. What's left is small: two acronyms are never spelled out, and two known weak spots are already tracked as open items.

**Follow-up on the 2026-10-23-1705 report** (fixes applied in changelog row 91):
- **ats-1** (Velas "Technical Leader" has no leadership bullet): **still open**. Velas still has no leadership or ownership bullet (cv.md:56-70). It is now tracked as the open item "Velas leadership" (`docs/open-items.md`), so this report doesn't raise it again.
- **ats-2** (WCAG, PII, IoT not spelled out): **fixed**. The variant now has "Web Content Accessibility Guidelines (**WCAG**)" (cv.md:32), "personally identifiable information (PII)" (cv.md:28) and "Internet of Things (**IoT**)" (cv.md:88).
- **ats-3** (React Testing Library, Styled Components and ADR only in Skills): **decided** as `skills-only-in-skills-list`.
- **ats-4** (vague Admasters bullet "Redesigned a legacy codebase to speed up feature deployment."): **still open**. The text is unchanged and it is still the entry's first bullet (cv.md:116). It is now tracked as the open item "Admasters stack", so this report doesn't raise it again.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES, plus "CONSULTING AND FREELANCE PROJECTS"). One column, no tables or text boxes. `pdf-check.md` passes (2 pages, Cambria embedded), and the header's 1 pt text is now stripped (`strip_header_text`, row 91). The page 1 preview reads in order. No forbidden characters. |
| Contact details | pass | The name, headline, location, availability and time-zone overlap are on page 1 (cv.md:2-8). So are the phone in international format (`+380 97 891 9783`), the email and the portfolio link, as the worldwide market shows them. |
| Dates and gaps | pass | One format throughout ("December 2025 - Present"). No gaps between full-time roles since April 2019. The consulting section says "alongside full-time roles" (cv.md:124). Short tenures are decided. |
| Seniority signals | warning | Strong signals: "Owned the frontend technology stack" and "platform and solution architecture" (SYSPRO), "Led the map team of 8 engineers" and "Owned the system design" (General Motors), plus team leads at OMO Systems and The Admasters. The Velas "Technical Leader" entry still has only individual-contributor bullets. That gap is the open item "Velas leadership" and isn't raised again here. |
| Keywords in context | pass | The core terms are in bullets: React 19, TypeScript, micro-frontends, schema-driven runtime, XState, Zustand, OIDC, OpenTelemetry, Vitest Browser Mode, Storybook, CSS Modules, WCAG, Next.js / SSR, design system, Redux, Jest, Detox, E2E. Most acronyms are now spelled out (ERP, SDD, OTLP, PII, WCAG, OIDC, IoT, TDD, E2E, RPC, SSR, SEO, MCP, PRD). The exceptions are CI/CD and SDK (ats-1). |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "4 repositories". Earlier roles: 20% / 15%, 95%, 2 minutes to 5 seconds, 5x, 4x, 10x, 20%, 5 million users, 2x, 3x, up to 50%. |
| Signs of AI padding | pass | No filler words, and nearly every bullet names a technology and a result. The vague Admasters bullet (cv.md:116) is tracked as an open item. Velas bullet 1, "Made the wallet faster and smoother" (cv.md:60), has no number; the gap report already lists this under web performance. |
| Length | pass | About 1,778 visible words (PDF: 1,035 + 752), within the profile's `max_words: 1800`. The PDF has 2 pages, within `max_pages: 3`. There's almost no headroom left, which the gap report already notes. |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Frontend / React Engineer | strong pass | The current job is React 19 / TypeScript on the web, and its runtime bullet now comes first. It covers micro-frontends, OIDC, XState, Zustand, TanStack, Vite, Vitest and Storybook. The title is senior and the summary says 7+ years. There is web React work at Velas (re-renders bullet now first), Itjet (Aspiration banking flow) and the Jira plugin. |
| Senior React Native / Mobile | pass | React Native at General Motors (team lead), Velas, Thermo Fisher, Itjet (Wink, 5M+ users) and the clinical-trials contract. For mobile roles, the React Native variant fits better. |
| Tech Lead / Frontend Architect | pass | Team of 8 at General Motors. Architecture co-authoring and frontend stack ownership at SYSPRO. System design, coding standards and technical interviewing. Weaker points: the current title is "Senior Software Engineer" (decided), and Velas leadership evidence is an open item. |
| Full-stack (Node-heavy) | borderline | Node.js appears in Velas and Itjet bullets, and Node.js resolvers in the Jira plugin. The backend depth (Express, PostgreSQL, AWS RDS) is mostly in Skills. The full-stack and Node.js variants fit better. |
| Native Android | likely filtered out | Android (Java / Kotlin) appears only in the clinical-trials contract bullet and in Skills. This is a real gap, and not a target of this variant. |
| Senior React Engineer / Frontend Tech Lead (profile `react`) | strong pass | Matches the headline. The React 19 runtime and micro-frontends support "Senior React Engineer". The team of 8 and the frontend stack ownership support "Frontend Tech Lead". The known gaps are in `gap-report.md`. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | low | cv/variants/react/cv.md:99, 101 (Itjet, bullets 1 and 2: "**CI/CD**"); cv.md:49 (General Motors, bullet 4: "**HERE SDK**") | Two acronyms are never spelled out in the CV: "CI/CD" (also in Skills, cv.md:192) and "SDK". Both are common and most parsers know them, so this is minor. The rest of the CV now spells out its acronyms consistently. | When the variant is next rebuilt, write "continuous integration and delivery (**CI/CD**)" once in Itjet bullet 1. That adds about 4 words, so drop words elsewhere to stay under the 1,800-word limit. "SDK" can stay as it is. | no |

## Decided (not raised again)
- React Testing Library, Styled Components and ADR appear only in Skills (earlier ats-3): skills-only-in-skills-list
- The SYSPRO runtime bullet comes first and the SDD bullet second: syspro-runtime-bullet-first
- The Google Drive portfolio link in the header: keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters, Thermo Fisher Scientific and OMO Systems, with no "(Contract)" label: all-full-time
- The title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO): keep-title-step
- The consulting and freelance entries have no dates: consulting-no-dates
- The summary paragraph names no employer and has no timing words: summary-no-company-names
- "React.js" next to "React 19" in Skills: keep-contact-and-keywords
- Playwright appears only in the SYSPRO Stack line and Skills, with no E2E suite claim: playwright-browser-mode-only
- The AI agent wording in SYSPRO bullet 2: ai-agents-wording
- "1,800+ ERP programs" and the level of SYSPRO detail: keep-erp-programs-figure

Already tracked, so not raised again. In `docs/open-items.md`: Velas leadership (earlier ats-1) and the Admasters stack (earlier ats-4). In `cv/variants/react/gap-report.md`: no recent Next.js / SSR, no measured web performance result, limited accessibility and web E2E evidence, web React leadership, GraphQL only in Skills, the two Azure Blob bullets in the Jira plugin entry, and the length headroom.
