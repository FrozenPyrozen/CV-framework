---
schema_version: 1
rubric: ats
cv: cv/variants/react-native/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:05
verdict: pass
score: 8.0
---

# AI ATS screener review

## Verdict
The React Native variant passes an AI screener for Senior React Native / Mobile Tech Lead roles. It parses cleanly: `pdf-check.md` passes with 2 pages, readable text and embedded fonts. Every contact field the worldwide market shows is on page 1. The headline matches the target title exactly, and React Native, Android, Realm, BLE, offline-first, Expo, Detox, Fastlane and Bitrise appear in context with measured results. Three things weaken the match. First, App Store and Google Play publishing has a source but isn't in the CV. Second, "native modules" appears only in Skills. Third, the Velas "Technical Leader" title has no leadership bullet. The weaker recent mobile work (SYSPRO is web-only) and the missing iOS-specific detail are already in `gap-report.md`, so this report doesn't raise them again.

## Score table
| Area | Result | Reason |
|---|---|---|
| Parsing | pass | Standard section names (SUMMARY, EXPERIENCE, EDUCATION, SKILLS, LANGUAGES, plus "CONSULTING AND FREELANCE PROJECTS"), one column, no tables or text boxes. `pdf-check.md` passes (2 pages, embedded ArialMT and Cambria). The Markdown has no non-ASCII characters, so it has none of the forbidden characters (`→ · • — –`). |
| Contact details | pass | Name, headline, location, phone in international format (`+380 97 891 9783`), email and the portfolio link are all on page 1, as `markets/worldwide.yaml` asks (phone, availability, engagement types and time-zone overlap shown). In the PDF the link text reads "Portfolio" (decided, see below). |
| Dates and gaps | pass | Every job uses one "Month YYYY - Month YYYY" format, with no gaps from April 2019 to the present. The General Motors end and the SYSPRO start share December 2025, a user-confirmed one-month overlap (`summaries/general-motors-navigation.md:9`) that screeners treat as a normal handover. The consulting section is labeled "alongside full-time roles". |
| Seniority signals | pass | The headline is "Senior React Native Engineer / Tech Lead (Mobile)". The CV shows team sizes of 8 (GM), about 3 (OMO) and 3 (Admasters), "Owned the system design", "Owned the frontend technology stack", code reviews and mentoring, and technical interviewing. The one weak spot is the Velas "Technical Leader" title (ats-3). |
| Keywords in context | warning | The core mobile keywords appear in bullets or Stack lines: React Native, Expo, React Native Web, Android, iOS, Realm, BLE, MQTT, background jobs, push notifications, CI/CD, Detox, Fastlane, Bitrise, Jest, React Native Testing Library and TypeScript. Two keywords that Senior RN screeners weight heavily are missing from bullets even though sources back them: App Store / Google Play publishing (ats-1) and native modules (ats-2). SQLCipher, Keychain and MMKV appear only in Summary, Skills or a Stack line (ats-4). |
| Measured results | pass | The current job has "1,800+ ERP programs", "from days to hours", "25+ person program" and "4 repositories". The mobile entries have 20% engagement and 15% fewer crashes, 3x, 2 minutes to 5 seconds, 5x battery, 30%, 20%, 5 million+ users and tripled new users. |
| Signs of AI padding | pass | No filler words. Almost every bullet names a technology or a result. "Implemented a passenger second-screen feature for a luxury car brand" has neither, but the gap report already covers it (selection disagreement on `general-motors-navigation#4.8`). |
| Length | pass | 2 pages against the profile's `max_pages: 3`. The PDF has about 1,700 words (975 + 728) against `max_words: 1800`. Older roles are shorter by design. |

## Estimated match per role
| Role | Rating | Reason |
|---|---|---|
| Senior React Native / Mobile (target headline) | strong pass | The title matches exactly. 7+ years with React Native across six entries, offline-first, BLE, IoT, native Android, mobile CI tools, performance numbers. The weak points are the current job being web-only (in the gap report) and no App Store / Google Play wording (ats-1). |
| Tech Lead (Mobile) | pass | The team of 8 split by platform, system design ownership, code reviews and mentoring, technical interviews and RN audits with effort estimates. With a team size added to Velas (ats-3), it would be a strong pass. |
| Senior Frontend / React Engineer | pass | React 19, TypeScript, micro-frontends, Vitest Browser Mode and the schema-driven runtime at the current job. The headline is mobile, so a React-only screener ranks it a little lower than the React variant. |
| Tech Lead / Frontend Architect | pass | Architecture work with the lead architect, frontend stack ownership and SDD at SYSPRO, plus GM system design. |
| Full-stack (Node-heavy) | borderline | Node.js appears at Velas, Itjet and GM, but this variant cuts back the backend depth on purpose. |
| Native Android | borderline | The Android 14 / SDK 34 migration, Gradle 8, Java 17, Java / Kotlin and an Android biometrics library show real native work, but there is no Kotlin-first product work or Jetpack keywords. |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| ats-1 | medium | cv/variants/react-native/cv.md:103 (Itjet, bullet 2, Wink) | The CV never mentions App Store or Google Play publishing, one of the most common requirements in Senior RN job ads. The source for this bullet says "The app was published on Google Play and the App Store" (`summaries/itjet-fintech.md:110`, contribution 4.8, tag `app-distribution`). Golfuture (4.9) says the same. The gap report (built 2026-10-16) says no summary has store releases, but that is now out of date: the Itjet summary added them on 2026-10-22. | Honestly addable. In the Wink bullet, add "and published it on Google Play and the App Store" (about 9 words; the CV has about 100 words of headroom). Optionally add "App Store and Google Play publishing" to Skills > Mobile. Then rebuild the gap report's "Mobile CI/CD and store releases" row. | no |
| ats-2 | medium | cv/variants/react-native/cv.md:184 (SKILLS > Mobile: "Native modules (iOS / Android)"); :88 (Thermo Fisher, bullet 3: "Rewrote legacy native libraries"); :75 (OMO, bullet 2: "a native **Android biometrics** library") | "Native modules" is a key Senior RN keyword (bridging, native modules), but it appears only in Skills, so in-context scoring gives it little credit. The sources call this work native modules: `summaries/thermo-fisher-dosimeter.md:45` ("background jobs on Android and iOS, native modules and the Realm database setup") and the skills map (`thermo-fisher-dosimeter.md:120`, "Native modules (iOS/Android): 4.2"; `omo-systems-smart-home.md:112`, "Android native modules: 4.4"). This finding is about the term, not the iOS-specific detail the gap report already covers. | Honestly addable. Rephrase Thermo Fisher bullet 3 as "Rewrote legacy iOS and Android **native modules** to use **MQTT over TLS** …". In OMO bullet 2, write "a native **Android biometrics** module". | no |
| ats-3 | medium | cv/variants/react-native/cv.md:52-66 (Velas, title and all 6 bullets) | The title "Technical Leader" has no bullet that shows leadership or ownership. All six bullets are individual work. For a Tech Lead (Mobile) headline, screeners that check titles against responsibilities may score 1.5 of the 6.5 years of RN tenure as individual-contributor work. The summary supports an ownership sentence: "Owned performance work across the wallet, CI/CD builds and signing, end-to-end and unit test setup, store publishing, and the architecture of the new wallet" (`summaries/velas-wallet.md:43`). The team size is still a TODO (`velas-wallet.md:35, 45`; `team_size_led: 0`), and it is an open item the user deferred ("later", `docs/open-items.md:20`). | Short of a team size, open the entry with the ownership sentence from `velas-wallet` section 3 (it fits the word budget). Add people led once the user answers the open item. | yes |
| ats-4 | low | cv/variants/react-native/cv.md:13 (Summary: "SQLCipher encryption and SSL certificate pinning"); :184 (Skills: "SQLCipher, Keychain") | SQLCipher and SSL certificate pinning appear in the Summary and Skills but in no Experience bullet, because the profile drops `orion-mobile-clinical-ink#4.5`. The summary sentence's source comment still cites `#4.5`. Screeners that tie claims to a dated role can't place these two security keywords. Keychain appears only in Skills. | Either keep it this way (the Summary still puts them in context), or add "SQLCipher" next to Realm and MMKV in the clinical-trials Stack line (line 139), which ties it to a role without a new bullet. | no |
| ats-5 | low | cv/variants/react-native/cv.md:13, 73, 86 ("IoT"); :103 ("CI/CD") | "IoT" and "CI/CD" are never spelled out. Recruiter-written job ads sometimes use the long forms ("Internet of Things", "continuous integration and delivery"). The CV already spells out BLE, ERP, SDD and eCOA. | Spell out each at first use: "Internet of Things (IoT)" in the Summary, "continuous integration and delivery (CI/CD)" in the Wink bullet. | no |
| ats-6 | low | cv/variants/react-native/gap-report.md (Strong evidence: "12x / 5x (velas-wallet#4.2)"; Weak evidence: "General Motors (to November 2025)", "no ... App Store / Google Play work in any summary") | The gap report is out of date compared with the CV and sources. The CV now says "2 minutes to 5 seconds" (decision `keep-previous-cv-metrics`, exception), GM ends in December 2025, and the Itjet summary records store publishing. Later reviewers and `/improve` read the gap report, so the stale rows can hide real gaps or bring back fixed ones. | Regenerate the gap report with `/tailor --profile react-native` (or `/variants`) after the fixes above. | no |

## Decided (not raised again)
- The portfolio link in the PDF shows as the word "Portfolio" (a Google Drive URL): keep-portfolio-link
- There are no LinkedIn or GitHub links in the header: no-profile-links
- The title steps down from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): keep-title-step
- Short tenures at OMO Systems, Thermo Fisher Scientific and The Admasters, with no "(Contract)" labels: all-full-time
- The consulting and freelance entries have no dates: consulting-no-dates
- The Clinical Trials Patient App and Generative AI Jira Plugin clients are unnamed: hidden-clients, hidden-client-details-ok
- The Summary names no companies and has no timing words: summary-no-company-names
- The Summary's SDD sentence and the SYSPRO SDD / AI agents wording: sdd-summary-sentence, sdd-not-vibe-coding, ai-agents-wording
- The "1,800+ ERP programs" figure: keep-erp-programs-figure
- The clinical-trials Stack line on an older contract: orion-stack-line
- Numbers carried over from the previous CV ("Forbes top 10", "tripled", "4x"): keep-previous-cv-metrics
- Playwright at SYSPRO is only the Vitest Browser Mode provider, with no E2E claim: playwright-browser-mode-only
- Already in `gap-report.md`, not raised again: no iOS-specific (Swift / Objective-C) work; no bullet on a mobile release pipeline; Expo named only once; the current job is web-only; "passenger second-screen" chosen over the unit-testing bullet; backend-only Itjet and Velas bullets
