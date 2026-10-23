---
schema_version: 1
rubric: ats
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T13:49
verdict: pass
score: 8.5
---

# AI ATS screener review

## Verdict
The CV passes an AI screener for its target roles. It parses cleanly (pdf-check pass, 3 pages, readable text, embedded fonts) and shows every contact field the worldwide market asks for on page 1. Dates run without gaps, and the React, React Native, TypeScript and Node.js keywords appear in context, with measured results in the current job. What's left: the Velas "Technical Leader" title still has no leadership bullet, about a dozen Skills entries have hands-on sources but no bullet, and a few acronyms are never spelled out. The CV is 5 words under its 2,200-word limit, so fixes should reword existing text rather than add bullets.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES, plus "CONSULTING AND FREELANCE PROJECTS"), one column, no tables or text boxes. `cv/pdf-check.md` passes with readable text on all 3 pages and embedded fonts. No forbidden characters in the Markdown. |
| Contact details | pass | Name, phone in international format (`+380 97 891 9783`), email, location and portfolio on page 1, as the worldwide market shows them (`show_phone: true`, `show_availability: true`). In the PDF the portfolio URL shows only as the link text "Portfolio" (decided). |
| Dates and gaps | pass | One format ("December 2025 - Present"). Full-time roles run continuously from April 2019 to now, and the consulting section is labeled "alongside full-time roles". The short tenures (The Admasters 4 months, Thermo Fisher 5, OMO Systems 8) are a known risk and are decided. |
| Seniority signals | warning | Strong at SYSPRO ("Owned the frontend technology stack", "platform and solution architecture"), General Motors ("Led the map team of 8 engineers", "Owned the system design") and OMO Systems ("a team of about 3 engineers"). The Velas "Technical Leader" entry still has only individual-contributor bullets. |
| Keywords in context | warning | The core stack (React 19, React Native, TypeScript, Node.js, Express, Next.js, PostgreSQL, Vitest, Playwright, OIDC, OpenTelemetry) is in bullets. Redux Thunk, Redux Persist, Styled Components, Keychain, React Testing Library, PM2, Nginx, Husky, ADR and native modules appear only in Skills, though the summaries support them. WCAG, PII, MQTT and IoT are never spelled out. |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "~17 component specifications", "4 repositories". Earlier roles: 20%, 15%, 95%, 2 minutes to 5 seconds, 5x, 3x, 4x, 10x, 30%, 20%, 2x, 5 million users, up to 50%. |
| Signs of AI padding | pass | No filler words. Bullets name a technology and an action or a result. The SDD bullets are specific (specification templates, validation, specification-to-code drift, technical-debt register). |
| Length | pass | 2,195 words (pdf-check: 1,017 + 864 + 314; limit 2,200) and 3 pages (limit 4). Decision `keep-length` covers the master CV's length. Only 5 words of headroom are left (see ats-2). |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior Frontend / React Engineer | strong pass | The current job is React 19 / TypeScript with micro-frontends, OIDC, KendoReact, Zustand, XState, TanStack, Vitest and Playwright. Senior title, 7+ years. |
| Senior React Native / Mobile | strong pass | React Native at General Motors (team lead), Velas, OMO Systems, Thermo Fisher, Itjet and the clinical-trials contract, plus Expo, Detox, Fastlane, Bitrise, BLE, Realm and the Android 14 migration. The current job is web-only, so the latest dated mobile role ended in November 2025, which is minor. |
| Tech Lead / Frontend Architect | pass | Led a team of 8 at General Motors. Architecture co-authoring and stack ownership at SYSPRO, system design, code-review standards and technical interviewing. The current title is "Senior Software Engineer" (decided), and the Velas "Technical Leader" title lacks leadership evidence (ats-1). |
| Full-stack (Node-heavy) | borderline | Node.js is in bullets in six entries, and Express, Sequelize, PostgreSQL, AWS RDS and Stripe now appear at Itjet. The deeper backend work dates from 2019-2020, though, and the current job's Node.js work is a mock backend. Screeners that score recent backend depth will rank this below backend-led candidates. |
| Native Android | likely filtered out | Native Android work is the clinical-trials contract (Android 14 / SDK 34 migration, Java / Kotlin) and one biometrics patch at OMO Systems. No dated native Android role, and Kotlin appears once. This is a real gap, not a wording problem. |
| Senior React Engineer / Frontend Tech Lead (profile `react`) | strong pass | Same evidence as Senior Frontend / React. The General Motors team of 8 carries the tech-lead half. |
| Senior React Native Engineer / Tech Lead (Mobile) (profile `react-native`) | strong pass | Same evidence as Senior React Native / Mobile, plus the General Motors team lead. |
| Senior Full-Stack Engineer (React / Node.js) (profile `fullstack-react-node`) | pass | The React side is strong. Node.js, Express, REST APIs and PostgreSQL appear in bullets, and backend depth is thinner but present. |
| Senior Full-Stack Engineer (TypeScript, Node.js, React) (profile `nodejs`) | borderline | A Node-first headline makes screeners weigh backend evidence more heavily. Same gaps as the Full-stack (Node-heavy) row. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | medium | cv/Kirill_Kohan_CV.md:66-86 (Velas, title and all 9 bullets) | The title "Technical Leader" has no supporting bullet. Every bullet is individual work ("Developed the Velas blockchain wallet", "Added automatic Web3 provider failover"). Screeners that check titles against responsibilities may score this role as an individual contributor. The summary supports an ownership sentence: "Owned performance work across the wallet, CI/CD builds and signing, end-to-end and unit test setup, store publishing, and the architecture of the new wallet" (`summaries/velas-wallet.md:40`). Team size is still a TODO (`summaries/velas-wallet.md:32, 42`; `team_size_led: 0`). | Ask the user whether people were led at Velas (team size, code reviews, mentoring) and record it as a confirmed fact. Either way, open the entry with an ownership bullet based on `velas-wallet` section 3, for example by merging it into bullet 1 to save words. | yes |
| ats-2 | medium | cv/Kirill_Kohan_CV.md:232-244 (SKILLS: "Styled Components", "Native modules (iOS / Android)", "Keychain", "Redux Thunk", "Redux Persist", "PM2", "Nginx", "Architecture decision records (ADR)", "React Testing Library", "Husky") | These keywords appear only in Skills, though the summaries record each one as hands-on: Styled Components (`general-motors-navigation.md:119`, `itjet-fintech.md:165`, `designai-jira-plugin.md:91`); native modules (`thermo-fisher-dosimeter.md:117`, `omo-systems-smart-home.md:109`); Keychain (react-native-keychain patch, `omo-systems-smart-home.md:70`); Redux Thunk, React Testing Library, PM2 and Nginx (`itjet-fintech.md:162-165`); Redux Persist (`orion-mobile-clinical-ink.md:145`); ADR (the technology-stack decision record, `syspro-saas-erp.md:94-96`); Husky (`syspro-saas-erp.md:261`). Screeners that weight in-context keywords give them little credit. | Honestly addable. The CV has only 5 words of headroom (2,195 of 2,200), so add the words to existing bullets or Stack lines without new bullets. Add "react-native-keychain" to OMO Systems bullet 4. Call the rewritten libraries "native modules" in Thermo Fisher bullet 2. Write "technology-stack decision record (ADR)" in SYSPRO bullet 2. Add "Redux Persist" to the clinical-trials Stack line and "Husky" next to ESLint and Prettier in SYSPRO bullet 8. Name Styled Components, Redux Thunk, React Testing Library, PM2 and Nginx in the Itjet bullets. Trim elsewhere to stay under the limit. | no |
| ats-3 | low | cv/Kirill_Kohan_CV.md:32 ("accessible typography per WCAG"), 34 ("sensitive data (PII)"), 93 and 108 ("IoT"), 110 ("MQTT over TLS") | Acronyms that are never spelled out. Recruiter-written job ads often use the long form, so exact-match screeners can miss them. ERP, OIDC, SDD, OTLP, eCOA, PRD, MCP, SSR and BLE are already spelled out. | Spell each out once at first use: "Web Content Accessibility Guidelines (WCAG)", "personally identifiable information (PII)", "Internet of Things (IoT)". MQTT can stay as is (the job ads that ask for it use the acronym). Mind the word limit (ats-2). | no |

## Decided (not raised again)
- In the PDF the portfolio URL appears only as the link text "Portfolio", so screeners that ignore hyperlinks can't read it (cv/Kirill_Kohan_CV.md:8): keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Short tenures at The Admasters (4 months), Thermo Fisher Scientific (5 months) and OMO Systems (8 months), with no "(Contract)" label: all-full-time
- Title step from "Team Leader" (General Motors) to "Senior Software Engineer" (SYSPRO): keep-title-step
- Consulting and freelance entries show no dates, so screeners may read them as undated jobs: consulting-no-dates
- Unnamed clients ("Clinical Trials Patient App", "Generative AI Jira Plugin") are parsed as employer names: hidden-clients
- CV length (2,195 words, 3 pages) is close to the 2,200-word limit: keep-length
- The summary paragraph doesn't name the current employer: summary-no-company-names
- "React.js" next to "React 19" in Skills is a duplicate keyword: keep-contact-and-keywords
- A Stack line on the older clinical-trials contract: orion-stack-line
