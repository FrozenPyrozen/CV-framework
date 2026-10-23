---
schema_version: 1
rubric: hr
cv: cv/variants/react-native/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass
score: 8.5
---

# HR recruiter review

## Verdict
Yes, a recruiter hiring for Senior React Native or Mobile Tech Lead roles would move this candidate to a first call. Page 1 shows the matching headline, "7+ years", a team of 8 on a General Motors React Native app, known company names and many mobile results, and the header answers the remote-hiring basics. The SYSPRO entry is now shorter (no Stack line, a shorter SDD bullet), so General Motors starts higher on page 1. The remaining points are polish: a dense summary, a summary sentence that mixes results from different projects, and some jargon further down.

Follow-up on the previous report (`reports/2026-10-23-1705/hr-react-native.md`), finding by finding:
- **hr-1** (jargon-heavy first SYSPRO bullet): **fixed and decided**. The tail "with each subsystem traced from architecture to code across 4 repositories" is now "across 4 repositories", and keeping the SDD bullet first in this variant is decided (`syspro-runtime-bullet-first`).
- **hr-2** (SYSPRO takes too much page-1 space; KendoReact Stack line): **fixed**. The react-native profile drops the SYSPRO Stack line (`syspro-saas-erp#5: { drop: true }`, changelog row 91); 4 bullets remain.
- **hr-3** (summary one block of about 170 words): **still open**. It is now about 179 words in six sentences, with "including its architecture" still there; raised again as hr-2 below.
- **hr-4** (SQLCipher and SSL pinning in the summary but in no entry): **still open**; raised again as hr-3 below.
- **hr-5** (jargon further down): **partly fixed**. "buffer-reading logic" and "bisecting dependency versions" are gone and RPC is spelled out; "HERE HNav / HNod SDK", "route-deviation handling", "MQTT over TLS with client certificates" and "exact-alarm and PendingIntent behavior changes" remain (hr-4 below).

## First-10-seconds impression
- **Good:** "Senior React Native Engineer / Tech Lead (Mobile)" matches the target role; "7+ years" and "Led a team of 8 engineers" are in the first two summary sentences; General Motors and Thermo Fisher Scientific are recognizable names; numbers stand out (20% engagement, 15% fewer crashes, 3x, 2 minutes to 5 seconds, 5 million+ users).
- **Good:** the header covers location, remote work, B2B or full-time and EU / UK / US time-zone overlap.
- **Good:** progression reads Software Engineer, Team Leader, Technical Leader, Team Leader, Senior Software Engineer, which supports "Tech Lead".
- **Bad:** the current job (SYSPRO) is web and ERP work under a mobile headline; its first bullet still opens with "architecture-governed specification-driven development (SDD)" (decided).
- **Bad:** the summary is one 179-word block; a skim reads only its first sentence.

## Strengths
- Clear target role with deep evidence: React Native in seven entries since 2019, with Android, iOS, Realm, offline-first, BLE, background jobs, push notifications and Expo in context.
- Leadership backed by facts: team of 8 with platform split, a team of about 3 with code reviews and standards, a team of 3 with Agile, and technical interviewing for enterprise clients.
- Concrete mobile results: 3x faster first interaction on Android, 5x less battery, 30% faster data transfer, 15% fewer crashes, 5 million+ users, tripled new users after F-Droid and Snapcraft releases.
- Recent, in-demand upgrade work: React Native 0.76 / Expo SDK 52, Android 14 (SDK 34), React Native upgrade audits with effort estimates.
- Page 1 carries the strongest material: Summary, SYSPRO, General Motors, Velas, OMO Systems and Thermo Fisher Scientific (1,019 of about 1,790 words).

## Questions the recruiter will ask

1. **"Your current job is web (React 19). Why mobile roles now, and why move after about 10 months?"**
   *Why:* SYSPRO (December 2025 - Present) has no mobile bullet under a Mobile headline (known: `gap-report.md`).
   *Prepare:* React Native has been the main stack since 2019 (General Motors, Velas, OMO Systems, Thermo Fisher Scientific, the clinical-trials contract); SYSPRO added platform architecture and specification-driven work on a 25+ person program; say what you want next (hands-on senior or lead, mobile first).

2. **"Is the Tech Lead title current? You're a Senior Software Engineer now."**
   *Why:* the headline says Tech Lead, the current title doesn't (the title step is decided: `keep-title-step`).
   *Prepare:* Team Leader at General Motors (8 engineers) and OMO Systems (about 3), Technical Leader at Velas; at SYSPRO you work with the lead architect and own the frontend stack for the Login micro-frontend and the runtime.

3. **"What did Technical Leader at Velas involve? Did people report to you?"**
   *Why:* no Velas bullet mentions leading people (open item "Velas leadership").
   *Prepare:* the answer to the open item.

4. **"How much iOS have you done? App Store releases?"**
   *Why:* iOS appears only alongside Android (known: `gap-report.md`; store publishing is Skills-only by decision `skills-only-in-skills-list`).
   *Prepare:* MQTT over TLS on iOS and Android and background jobs on both (Thermo Fisher Scientific), safe-area fixes on iOS and Android (clinical trials), the 1 iOS engineer on the General Motors team; Wink, Golfuture and Oroscopo were published on Google Play and the App Store (`itjet-fintech` summary).

5. **"The contracts ran alongside full-time jobs, plus a PhD. How did you manage the hours, and was it allowed?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" and the PhD from 2023 to 2027 (open item "Side work").
   *Prepare:* the answer to the open item.

6. **"B2B or employment? Notice period? How do you handle power outages in Kyiv?"**
   *Why:* standard screening for a Ukraine-based remote candidate; the header gives B2B or full-time but not notice period (open items "Hiring route", "Notice period", "Outages").
   *Prepare:* the answers to the open items.

7. **"Where did the SQLCipher encryption and SSL pinning in your summary happen?"**
   *Why:* no entry mentions them (hr-3).
   *Prepare:* "On the native Android counterpart of the clinical-trials patient app (contract)."

## Wording a non-technical reader won't understand

| Quote | Plain alternative |
|---|---|
| "the OIDC libraries and the move from React Testing Library to Vitest Browser Mode" (SYSPRO, bullet 3) | "the login (OpenID Connect) libraries and a move to in-browser testing (Vitest Browser Mode)" |
| "packaged as a React Native micro-frontend" (General Motors, bullet 2) | "packaged as a self-contained React Native module" (keep "micro-frontend" if target ads use it) |
| "with the HERE HNav / HNod SDK, including route-deviation handling" (General Motors, bullet 4) | "with HERE's navigation toolkit, including rerouting when the driver leaves the route" |
| "MQTT over TLS with client certificates" (Thermo Fisher Scientific, bullet 3) | "a secure, certificate-based messaging protocol (MQTT over TLS)" |
| "exact-alarm and PendingIntent behavior changes" (Clinical Trials Patient App, bullet 6) | "Android 14's new rules for alarms and notifications" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | low | cv.md:13 (Summary, sentence 4) | New. "Made mobile apps measurably faster: a 3x faster first interaction on Android, staking page loading cut from 2 minutes to 5 seconds with 5x less battery use and 30% faster data transfer." The 30% data-transfer result belongs to the Thermo Fisher Scientific IoT app, but the sentence reads as if it came from the same staking page. A recruiter who asks about it gets a different project than expected. | Separate the results by project, e.g. "…from 2 minutes to 5 seconds with 5x less battery use, and 30% faster device data transfer in an IoT app." | no |
| hr-2 | low | cv.md:13 (Summary) | Still open from the previous hr-3. The summary is one block of about 179 words in six sentences; on a skim only sentence 1 is read, so the team of 8 and the mobile results may be missed. | Tighten it: cut "including its architecture,", and merge the native Android sentence into the performance one; or split it into two short paragraphs if the template allows. | no |
| hr-3 | low | cv.md:13 (Summary, sentence 5: "SQLCipher encryption and SSL certificate pinning") | Still open from the previous hr-4. A recruiter looking for these under Experience won't find them; no entry in this variant mentions them. | Add "SQLCipher" to the Clinical Trials Patient App Stack line (cv.md:143), or drop the words from this variant's summary. | no |
| hr-4 | low | cv.md:41, 88, 141 (General Motors bullet 4, Thermo Fisher Scientific bullet 3, Clinical Trials Patient App bullet 6) | Partly fixed from the previous hr-5. Jargon remains further down: "HERE HNav / HNod SDK", "route-deviation handling", "MQTT over TLS with client certificates", "exact-alarm and PendingIntent behavior changes". | Use the plain alternatives in the wording table, keeping the keywords an ATS looks for (React Native, HERE SDK, MQTT, Android 14). | no |

## Decided (not raised again)
- SYSPRO SDD bullet first in this variant with a shortened ending; AI agents and SDD wording; SDD sentence in the summary: syspro-runtime-bullet-first, ai-agents-wording, sdd-summary-sentence
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): keep-title-step
- Name "Kirill Kohan" vs legal name "Kyrylo Kokhan": keep-cv-name
- No LinkedIn or GitHub link; Google Drive portfolio link: no-profile-links, keep-portfolio-link
- Short tenures (The Admasters, Thermo Fisher Scientific, OMO Systems) with no contract labels: all-full-time
- No dates in the consulting section: consulting-no-dates
- No company names or timing words in the summary: summary-no-company-names
- "1,800+ ERP programs" and SYSPRO platform detail: keep-erp-programs-figure
- "Forbes top 10", "tripled", "4x": keep-previous-cv-metrics
- HERE truck navigation app in the General Motors entry: gm-project-names; passenger second screen for a luxury car brand: gm-features-public
- Itjet client names (Aspiration, Fused, Wink): itjet-client-names
- Clinical Trials Patient App Stack line: orion-stack-line
- Store publishing and native modules only in Skills: skills-only-in-skills-list
- SYSPRO, General Motors and Thermo Fisher Scientific as direct employers: direct-employment

Not new (already listed, so not raised as findings): web-only current job, no iOS-specific work, Expo detail and backend bullets at Itjet and Velas (`gap-report.md`); Velas leadership, GM details, side work, notice period, hiring route and outages (`docs/open-items.md`).
