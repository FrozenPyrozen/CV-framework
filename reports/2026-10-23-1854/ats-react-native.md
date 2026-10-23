---
schema_version: 1
rubric: ats
cv: cv/variants/react-native/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass
score: 8.5
---

# AI ATS screener review

## Verdict
The React Native variant passes an AI screener for Senior React Native / Mobile Tech Lead roles. It parses cleanly (`pdf-check.md` passes, 2 pages), every contact field the worldwide market shows is on page 1, the headline matches the target title, and the core mobile keywords appear in bullets with measured results. What remains is small: the Velas "Technical Leader" title still has no leadership bullet (an open item), SQLCipher and SSL pinning are placed only in the Summary, and "CI/CD" is never spelled out.

Follow-up on the previous report (`reports/2026-10-23-1705/ats-react-native.md`), finding by finding:
- **ats-1** (App Store / Google Play publishing not in bullets): **decided**. Store publishing stays in Skills only (`skills-only-in-skills-list`); the gap report now lists it under weak evidence.
- **ats-2** ("native modules" only in Skills): **decided** (`skills-only-in-skills-list`, which names native modules).
- **ats-3** (Velas "Technical Leader" with no leadership bullet): **still open**, tracked as the open item "Velas leadership" (`docs/open-items.md`); not raised again here.
- **ats-4** (SQLCipher and SSL certificate pinning only in Summary and Skills): **still open**; raised again as ats-1 below.
- **ats-5** (IoT and CI/CD not spelled out): **partly fixed**. The Summary now says "Internet of Things (IoT)"; "CI/CD" is still never spelled out (ats-2 below).
- **ats-6** (gap report out of date): **fixed**. The gap report was rebuilt on 2026-10-23: "2 minutes to 5 seconds", General Motors "to December 2025", and the store-publishing row now cites the Itjet summary and the decision.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, CONSULTING AND FREELANCE PROJECTS, EDUCATION, SKILLS, LANGUAGES), one column, no tables or text boxes; `pdf-check.md` passes with no failures (2 pages, embedded Cambria fonts; the header text that parsers used to read first is stripped). |
| Contact details | pass | Name, headline, "Kyiv, Ukraine (Remote)", "+380 97 891 9783" (international format), "kiril.kohan@gmail.com" and the portfolio link are on page 1, with availability, engagement types and time-zone overlap as `markets/worldwide.yaml` shows them. |
| Dates and gaps | pass | One "Month YYYY - Month YYYY" format, no gaps from April 2019 to the present; consulting is labeled "Part-time contract and consulting work, alongside full-time roles". |
| Seniority signals | pass | Headline "Senior React Native Engineer / Tech Lead (Mobile)"; teams of 8 (General Motors, split 6 React Native, 1 iOS, 1 Android), about 3 (OMO Systems) and 3 (The Admasters); "Owned the system design", "Owned the frontend technology stack", code reviews, technical interviews and audits with effort estimates. Velas leadership is an open item. |
| Keywords in context | pass | React Native, Expo, React Native Web, Android, iOS, Realm, IoT, MQTT, background jobs, push notifications, Detox, Fastlane, Bitrise, Jest, React Native Testing Library, TypeScript and Android 14 (SDK 34) appear in bullets or Stack lines. Skills-only items (store publishing, native modules, Apollo, Amplify) are decided. Minor: SQLCipher placed only in the Summary (ats-1). |
| Measured results | pass | Current job: "1,800+ ERP programs", "from days to hours", "25+ person program", "4 repositories". Mobile entries: 20% engagement, 15% fewer crashes, 3x, 2 minutes to 5 seconds, 5x battery, 30%, 20%, 5 million+ users, tripled new users. |
| Signs of AI padding | pass | No filler words; nearly every bullet names a technology or result. One soft bullet: "Worked with the team on upgrading the app to React Native 0.76 and Expo SDK 52 to improve app performance" (ats-3). |
| Length | pass | 2 pages against `max_pages: 3`; about 1,789 visible words against `max_words: 1800` (PDF: 1,019 + 773). Older roles are shorter by design. |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior React Native / Mobile (target headline) | strong pass | Exact title match; React Native in seven entries since 2019, offline-first Realm, BLE, IoT, native Android, mobile CI tools and mobile performance numbers. The web-only current job is a known gap (`gap-report.md`). |
| Tech Lead (Mobile) | pass | Team of 8 with platform split, system design ownership, code reviews, mentoring, interviews and RN audits. Would be a strong pass with Velas leadership filled in (open item). |
| Senior Frontend / React Engineer | pass | React 19, TypeScript, micro-frontends, Vitest Browser Mode and the schema-driven runtime at the current job, React Native Web and React at Itjet; the mobile headline ranks it a little below the React variant. |
| Tech Lead / Frontend Architect | pass | Platform and solution architecture with the lead architect, frontend stack ownership and SDD at SYSPRO, GM system design. |
| Full-stack (Node-heavy) | borderline | Node.js at Velas (staking-rewards backend), Itjet (Express, Sequelize, PostgreSQL, AWS RDS) and the Jira plugin, but this variant keeps backend depth short on purpose. |
| Native Android | borderline | Android 14 (SDK 34) migration with Gradle 8 and Java 17, Java / Kotlin, an Android biometrics library and F-Droid releases; no Kotlin-first product work or Jetpack keywords. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | low | cv/variants/react-native/cv.md:13 (Summary, sentence 5: "SQLCipher encryption and SSL certificate pinning"); :188 (Skills > Mobile: "SQLCipher, Keychain") | Still open from the previous ats-4. SQLCipher and SSL certificate pinning appear in the Summary and Skills but in no Experience entry, so screeners that tie claims to a dated role can't place them. | Add "SQLCipher" to the Clinical Trials Patient App Stack line (cv.md:143), which ties it to a role with no new bullet, or keep it as is. | no |
| ats-2 | low | cv/variants/react-native/cv.md:101 (Itjet, bullet 1: "**CI/CD**"); :47 (General Motors, Stack line: "(CI/CD)") | Left over from the previous ats-5: "CI/CD" is never spelled out, while the CV spells out IoT, BLE, TLS, ERP, SDD, eCOA and RPC. Some recruiter-written ads use "continuous integration and delivery". | At first use in the Wink bullet write "continuous integration and delivery (**CI/CD**)", or add the long form to Skills > DevOps. | no |
| ats-3 | low | cv/variants/react-native/cv.md:131 (Clinical Trials Patient App, bullet 1) | "Worked with the team on upgrading the app to **React Native 0.76** and **Expo SDK 52** to improve app performance" has a passive opening and an unmeasured goal; AI screeners weight "worked with the team" as low ownership. | Lead with the action and own share, e.g. "Upgraded the app to React Native 0.76 and Expo SDK 52 with the team …", keeping only what the source (`orion-mobile-clinical-ink#4.1`) supports. | no |

## Decided (not raised again)
- App Store / Google Play publishing, native modules and other skills kept only in the skills list: skills-only-in-skills-list
- The portfolio link in the header is a Google Drive link: keep-portfolio-link
- No LinkedIn or GitHub link in the header: no-profile-links
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): keep-title-step
- Short tenures (The Admasters, Thermo Fisher Scientific, OMO Systems) with no "(Contract)" labels: all-full-time
- No dates in the consulting and freelance section: consulting-no-dates
- Summary names no companies and has no timing words: summary-no-company-names
- SYSPRO SDD bullet first in this variant, its shortened ending, and the AI agents wording: syspro-runtime-bullet-first, ai-agents-wording
- "1,800+ ERP programs": keep-erp-programs-figure
- Clinical Trials Patient App Stack line: orion-stack-line
- "Forbes top 10", "tripled the number of new users", "user engagement grew 4x": keep-previous-cv-metrics
- HERE truck navigation app in the General Motors entry: gm-project-names; passenger second screen for a luxury car brand: gm-features-public
- Playwright only in Skills, not as SYSPRO end-to-end work: playwright-browser-mode-only
- Aspiration, Fused, Wink and other Itjet client names: itjet-client-names
- React.js kept in Skills next to React 19: keep-contact-and-keywords

Not new (already listed, so not raised as findings): no iOS-specific (Swift / Objective-C) work, no App Store / Google Play bullets, Expo detail, web-only current job, and the backend bullets at Itjet and Velas (`gap-report.md`); Velas leadership, GM details and Admasters stack (`docs/open-items.md`).
