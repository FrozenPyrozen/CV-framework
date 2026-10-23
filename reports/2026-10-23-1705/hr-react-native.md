---
schema_version: 1
rubric: hr
cv: cv/variants/react-native/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T17:05
verdict: pass-with-issues
score: 8.0
---

# HR recruiter review

## Verdict
Yes, a recruiter hiring for Senior React Native or Mobile Tech Lead roles would shortlist this CV. The headline, "7+ years", a team of 8 on a General Motors React Native app, and several measured mobile results all appear on page 1. The main weakness is the start of the Experience section. The current job (SYSPRO) is web-only, and its first bullet is process jargon, so the most-read lines of the Experience section say nothing about mobile. The other questions a recruiter will ask are already in `gap-report.md`, in `docs/open-items.md` or in decisions.

Length is within the profile: 2 pages (limit 3) and about 1,800 words in the source including Markdown markup (limit 1,800; the visible text is slightly under). The PDF check passed (975 and 728 words per page). Page 1 carries the strongest material: General Motors, Velas, Thermo Fisher Scientific and Itjet (Wink, 5M+ users).

## First-10-seconds impression
- **Good:** the headline "Senior React Native Engineer / Tech Lead (Mobile)" matches the target role. "7+ years" and "Led a team of 8 engineers" appear in the first two summary sentences. General Motors and Thermo Fisher Scientific are names a recruiter will know. There are many numbers: 20% engagement, 15% fewer crashes, 3x, 2 minutes to 5 seconds, 5M+ users. Remote setup, time-zone overlap and engagement types are in the header.
- **Good:** the job history goes from Software Engineer to Team Leader, Technical Leader and Team Leader again, which supports "Tech Lead".
- **Bad:** the first 5 lines under EXPERIENCE (SYSPRO) are about SDD, AI agents, architecture documents, OIDC, Vitest Browser Mode, ERP and KendoReact. A recruiter checking React Native experience has to skip to General Motors.
- **Bad:** the summary is one block of about 170 words in six sentences. On a skim, only the first sentence gets read.

## Strengths
- The target role is clear and the evidence is strong: React Native appears in 6 of 9 entries, with Android, iOS, BLE, Realm, offline-first, background jobs, push notifications and CI/CD named in context.
- Leadership is backed by facts: a team of 8 with the split given (6 React Native, 1 iOS, 1 Android), code reviews, standards, mentoring, and a technical-interviewing consultancy.
- The results are concrete and mobile-specific: 3x faster first interaction on Android, 5x less battery use, 30% faster data transfer, 15% fewer crashes, 5M+ registered users, store releases on F-Droid and Snapcraft.
- The work is recent and in demand: the React Native 0.76 / Expo SDK 52 upgrade, the Android 14 (SDK 34) migration and React Native upgrade audits.
- The header covers hiring basics for a worldwide remote role: Kyiv, remote, B2B or full-time, EU / UK / US overlap.

## Questions the recruiter will ask

1. **"Your current job is web (React 19). Why are you applying for mobile roles, and why move after about 10 months?"**
   *Why:* SYSPRO, December 2025 to Present, has no mobile work, and the headline says Mobile. (Already in `gap-report.md`: "be ready to explain the move to web".)
   *Prepare:* React Native has been the main stack since 2019 (General Motors, Velas, Thermo Fisher Scientific, OMO, the clinical-trials contract). SYSPRO added architecture and specification-driven work on a 25+ person program. Then say what you want next: hands-on senior or lead, mobile first.

2. **"Is the Tech Lead title current? You're a Senior Software Engineer now."**
   *Why:* The headline says "Tech Lead"; the current title doesn't. (The title step itself is decided: `keep-title-step`.)
   *Prepare:* Team Leader at General Motors (team of 8) and OMO (about 3), Technical Leader at Velas. At SYSPRO you worked with the lead architect and owned the frontend technology stack for two parts of the platform.

3. **"How much iOS have you done? Swift, App Store releases?"**
   *Why:* iOS appears only together with Android in bullets, and Skills lists no Swift or Objective-C. (Already in `gap-report.md`; an open item is waiting for details.)
   *Prepare:* Point to the iOS work in the CV: MQTT over TLS on iOS and Android (Thermo Fisher Scientific), background jobs on Android and iOS, and safe-area layout fixes on iOS and Android. Say only what is confirmed, and add the iOS native-module work with `/add-experience` once it's a fact.

4. **"What did 'Technical Leader' at Velas involve? Did people report to you?"**
   *Why:* None of the Velas bullets mentions leading people. (Open item "Velas leadership".)
   *Prepare:* the answer to the open item.

5. **"The clinical-trials and Jira contracts ran alongside full-time jobs, and a PhD too. How did you manage the hours, and was it allowed?"**
   *Why:* The section intro says "Part-time contract and consulting work, alongside full-time roles", and the PhD runs from 2023 to 2027. (Parked interview item "Side work".)
   *Prepare:* the parked answer, when you bring it back.

6. **"How would we hire you: B2B or employment? What's your notice period? How do you handle outages in Kyiv?"**
   *Why:* These are standard screening questions for a Ukraine-based remote candidate. (Parked items "Hiring route", "Notice period" and "Outages".)
   *Prepare:* the parked answers.

7. **"Was the General Motors app a phone app or in the car? And how does HERE Technologies fit in?"**
   *Why:* Bullet 1 says "vehicle companion app"; bullet 4 says "in-car navigation features … on the truck navigation app for HERE Technologies". (Project names are decided in `gm-project-names`; open item "GM details".)
   *Prepare:* "The companion app is the phone app for owners; my map team also built in-car navigation features, and I worked on HERE's truck navigation app during the same period."

8. **"Where did you do the SQLCipher encryption and SSL pinning you mention in the summary?"**
   *Why:* The summary names them, but no bullet in this variant does (see hr-4).
   *Prepare:* "On the clinical-trials patient app (contract): its native Android counterpart."

## Wording a non-technical reader won't understand

| Quote | Plain alternative |
|---|---|
| "with each subsystem traced from architecture to code across 4 repositories" (SYSPRO, bullet 1) | "checking each part of the code against its design, across 4 code repositories" |
| "the OIDC libraries and the move from React Testing Library to Vitest Browser Mode" (SYSPRO, bullet 3) | "the login (OIDC) libraries and a move to faster in-browser testing (Vitest Browser Mode)" |
| "packaged as a React Native micro-frontend" (General Motors, bullet 2) | "packaged as a self-contained React Native module" (keep "micro-frontend" if it's an ATS keyword for the target ads) |
| "with the HERE HNav / HNod SDK, including route-deviation handling" (General Motors, bullet 4) | "with HERE's navigation toolkit, including rerouting when the driver leaves the route" |
| "adding a blockchain-node RPC fallback" (Velas, bullet 4) | "adding a backup server connection" |
| "MQTT over TLS with client certificates" (Thermo Fisher Scientific, bullet 3) | "a secure, certificate-based messaging protocol (MQTT over TLS)" |
| "by reworking the buffer-reading logic" (Thermo Fisher Scientific, bullet 6) | "by fixing how incoming device data was read" |
| "by bisecting dependency versions and adding targeted logging" (Clinical Trials Patient App, bullet 3) | "by testing library versions one by one to find the cause and adding logging" |
| "exact-alarm and PendingIntent behavior changes" (Clinical Trials Patient App, bullet 6) | "Android 14's new rules for alarms and notifications" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv.md:22 (SYSPRO, bullet 1) | Jargon in the first bullet of the current job, which is the first thing read under EXPERIENCE: "Delivered the frontend through architecture-governed specification-driven development (SDD), not ad-hoc AI code generation, and helped define it: specification templates, validation and rules for AI agents that implement and review code against the specifications, with each subsystem traced from architecture to code across 4 repositories." That is about 50 words of process terms before any product or result. For a mobile recruiter it's also off-target. | Keep the decided framing and pin (`sdd-not-vibe-coding`, `ai-agents-wording`). Shorten the tail, e.g. replace "with each subsystem traced from architecture to code across 4 repositories" with "checking each part against its design across 4 code repositories", or split it into two short sentences. | no |
| hr-2 | medium | cv.md:17-30 (SYSPRO entry: 4 bullets and a Stack line) | In a React Native CV, the top of the Experience section is entirely web, ERP and process work: 5 items, about 11 printed lines on page 1, before General Motors. The Stack line lists "KendoReact", a tag the profile de-emphasizes (`deemphasize_tags: [kendo, erp]`), and bullet 4 leads with "ERP SaaS". The web-only current job is a known gap (`gap-report.md`); the finding is how much page-1 space it takes in this variant. | In the react-native profile only, consider dropping the SYSPRO Stack line or one of the 4 pinned bullets (for example bullet 3, the technology-stack bullet, since bullet 2 already shows architecture scope). That brings General Motors about 3 lines higher. The pins are your choice, so this needs your decision. | yes |
| hr-3 | low | cv.md:13 (Summary) | The summary is one block of about 170 words in six sentences. In a 10-second skim only sentence 1 gets read, so the team of 8 and the mobile results in sentences 2 to 4 may be missed. | Keep the content and tighten it: e.g. cut "including its architecture," and merge the native Android sentence into the performance one. Alternatively, split it into two short paragraphs if the template allows. | no |
| hr-4 | low | cv.md:13 (Summary, sentence 5) | "SQLCipher encryption and SSL certificate pinning" appears in the summary, but the bullet behind it (`orion-mobile-clinical-ink#4.5`) is dropped from this variant's entries. A recruiter who looks for it under Experience won't find it. | Remove those words from this variant's summary, or let a short mention of them back into the Clinical Trials Patient App entry. | no |
| hr-5 | low | cv.md:39, 43, 62, 88, 94, 131, 137 (General Motors bullets 2 and 4, Velas bullet 4, Thermo Fisher Scientific bullets 3 and 6, Clinical Trials Patient App bullets 3 and 6) | Jargon further down: "HNav / HNod SDK", "route-deviation handling", "blockchain-node RPC fallback", "MQTT over TLS with client certificates", "buffer-reading logic", "bisecting dependency versions", "exact-alarm and PendingIntent behavior changes". | Use the plain alternatives in the wording table, keeping the keywords an ATS looks for (React Native, BLE, MQTT, Android 14). | no |

## Decided (not raised again)
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step`
- SDD and AI-agent framing and the SDD sentence in the summary: `sdd-not-vibe-coding`, `ai-agents-wording`, `sdd-summary-sentence`
- "1,800+ ERP programs": `keep-erp-programs-figure`
- Name "Kirill Kohan" vs legal name "Kyrylo Kokhan" and the email: `keep-cv-name`, `keep-contact-and-keywords`
- No LinkedIn or GitHub link; the Google Drive portfolio link: `no-profile-links`, `keep-portfolio-link`
- Short tenures (The Admasters 4 months, Thermo Fisher Scientific 5 months, OMO 8 months) with no contract labels: `all-full-time`
- No dates in the consulting section, so the recent clinical-trials work can't be dated: `consulting-no-dates`
- Hidden clients (Clinical Trials Patient App, Generative AI Jira Plugin) and their feature details: `hidden-clients`, `hidden-client-details-ok`
- No company names or timing words in the summary: `summary-no-company-names`
- "Forbes top 10", "tripled the number of new users", "user engagement grew 4x": `keep-previous-cv-metrics`
- HERE truck navigation app named in the General Motors entry: `gm-project-names`; the passenger second-screen feature: `gm-features-public`
- Clinical Trials Patient App Stack line: `orion-stack-line`
- Playwright listed at SYSPRO only as the Vitest Browser Mode provider: `playwright-browser-mode-only`

Not new (already listed, so not raised as findings): no iOS-specific, Expo or mobile release-pipeline evidence, mobile work missing at the current job, and the backend bullets at Itjet and Velas (`gap-report.md`); Velas leadership, GM details, side work, notice period, hiring route and outages (`docs/open-items.md`).
