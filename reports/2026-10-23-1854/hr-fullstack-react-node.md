---
schema_version: 1
rubric: hr
cv: cv/variants/fullstack-react-node/cv.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T18:54
verdict: pass-with-issues
score: 8.0
---

# HR recruiter review: Full-Stack (React / Node.js) variant

## Verdict
Yes, a recruiter screening for Senior Full-Stack (React / Node.js) roles would move this candidate to a first call. Page 1 now tells a consistent story: the headline and the first summary words both say "full-stack", the current job opens with something built and measured ("renders **1,800+ ERP programs** ... cutting screen delivery from days to hours"), and the backend evidence (Node.js REST APIs, Stripe, PostgreSQL on AWS RDS, a Node.js staking backend) is named in the summary. Two new medium findings: the General Motors entry says "At the client's request" although General Motors employed the user directly, and the summary calls Itjet "a fintech company" although it was a services company with fintech and other clients. Recent backend work remains the main interview question (known gap).

Build: current (`npm run status`: everything is up to date). Reviewed the Markdown and `cv/variants/fullstack-react-node/pdf-check.md` (pass, 2 pages, 1,043 + 715 words); within the profile's `max_pages: 3` and `max_words: 1800`.

**Earlier findings (`reports/2026-10-23-1705/hr-fullstack-react-node.md`):**
- **hr-1** (summary opened "Senior software engineer and tech lead" under a full-stack headline): **fixed**. cv.md:13 now opens "Senior full-stack engineer and tech lead with 7+ years of experience building **React**, **TypeScript** and **Node.js** applications".
- **hr-2** (process jargon in the first SYSPRO bullets, the first thing built only in bullet 3): **fixed and now decided** (`syspro-runtime-bullet-first`). The runtime bullet is first (cv.md:22) and the SDD bullet's tail is shortened (cv.md:24).
- **hr-3** (first job in 2019 already "Full-Stack Engineer and Team Leader", no backend shown): **still open**, tracked as the open item "Admasters stack"; the lead-title question stays in the questions below. Not raised again.
- **hr-4** (The Admasters bullet 1 vague and first): **still open**, unchanged at cv.md:112; same open item "Admasters stack". Not raised again.
- **hr-5** (clinical-trials bullet 3, Android 14 migration, least relevant for full-stack): **still open**; the entry still has three bullets (cv.md:127-131). Raised again as hr-3.
- **hr-6** (de-emphasized mobile and SDK items in Skills): **still open**; "HERE SDK (HNav, HNod, HERE API)", "react-native-ble-plx", "MQTT", "SQLCipher", "Fastlane", "Bitrise" are still listed (cv.md:194, 198). Raised again as hr-4.
- **hr-7** (summary sentence ending on "Docker and Node.js backend logic"): **fixed**. The sentence now ends "... a Node.js staking-rewards backend, Next.js with GraphQL, and Docker."

## First-10-seconds impression
- **Good:** The headline "Senior Full-Stack Engineer (React / Node.js)" and the summary's first words "Senior full-stack engineer" match the target role (cv.md:4, 13). Location, remote, "Open to B2B contract or full-time employment", time-zone overlap, phone and email are in the top lines.
- **Good:** SYSPRO and General Motors come first; "1,800+ ERP programs", "days to hours" and "Led the map team of 8 engineers" are visible without scrolling. Dates run without gaps from April 2019.
- **Good:** Page 1 carries the full Itjet entry with six full-stack bullets and the Velas Node.js staking backend.
- **Bad:** SYSPRO (current) and General Motors are frontend and mobile; the clearest backend work is 2019-2023. A recruiter checking "full-stack today?" will ask (known gap, `gap-report.md`).
- **Bad:** "At the client's request" in the General Motors entry (cv.md:43) makes the reader wonder whether the job was through an agency (hr-1).
- **Neutral:** About 10 months at SYSPRO and short early jobs; decided (`all-full-time`, `keep-title-step`), answers to prepare below.

## Strengths
- Headline and summary agree on the role, and the summary names concrete backend work, not generic phrases.
- Real full-stack evidence with named technologies: Node.js REST APIs with Express and Sequelize, Stripe subscriptions, PostgreSQL migrated to AWS RDS, Next.js with SSR and GraphQL, Docker, CI/CD on AWS (Itjet), a Node.js staking backend (Velas), Node.js resolvers in the Jira Forge app.
- The current job opens with a concrete build and a result, followed by the architecture and SDD scope.
- Architecture and leadership: work with the lead architect, frontend stack ownership, system design, a team of 8, code reviews and standards.
- Numbers in almost every job (days to hours, 20%, 15%, 2 minutes to 5 seconds, 4x, 10x, 2x twice, 5 million users).
- Tight length: 2 pages, the strongest material on page 1.

## Questions the recruiter will ask
Items tracked elsewhere are marked: recent backend work (`gap-report.md`); side work, notice period, hiring route and outages (parked, `docs/open-items.md` "Interview preparation"); Velas leadership and Admasters stack (open items).

1. **"Are you full-stack today? Your last two jobs look frontend and mobile."**
   *Why:* SYSPRO bullets and Stack line are frontend (cv.md:22-34); General Motors is a React Native team (cv.md:41); the clearest Node.js work is Velas 2021-2023 (cv.md:64) and Itjet 2019-2020 (cv.md:95-105). Known gap.
   *Prepare (needs your input):* the Jira Forge Node.js resolvers (cv.md:138), the Velas staking backend, the Itjet APIs and RDS migration, and any later backend work (add it with `/add-experience` if true).
2. **"Were you employed by General Motors or by an agency? The CV says 'the client'."**
   *Why:* "At the client's request, changed the architecture..." (cv.md:43).
   *Prepare (decided, `direct-employment`):* "General Motors employed me directly; 'the client' meant the team that owned the host app."
3. **"You were a Team Leader and now you're a Senior Software Engineer after about 10 months. Lead or hands-on next, and why are you looking?"**
   *Why:* SYSPRO "December 2025 - Present" (cv.md:18-20) after "Team Leader" at General Motors (cv.md:37-39).
   *Prepare (title step decided, `keep-title-step`):* the architecture-level scope at SYSPRO plus your reason for looking.
4. **"Your first job in 2019 was already Team Leader while you were still studying. How?"**
   *Why:* "Full-Stack Engineer and Team Leader", The Admasters, April - August 2019, "Led a team of 3 software engineers" (cv.md:108-116); Bachelor 2016 - 2020 (cv.md:172).
   *Prepare (open item "Admasters stack"):* how you came to lead the team and what the backend side was.
5. **"Have you led web or backend engineers, not only mobile?"**
   *Why:* "6 React Native, 1 iOS, 1 Android" (cv.md:41).
   *Prepare:* The Admasters team (Next.js web), OMO (about 3), technical interviews for React and TypeScript roles (cv.md:153), SYSPRO stack ownership.
6. **"Contracts alongside full-time jobs and a PhD: how did that fit, and did your employer know?"**
   *Why:* "Part-time contract and consulting work, alongside full-time roles" (cv.md:120); PhD 2023 - 2027 (cv.md:162).
   *Prepare (parked "Side work"):* hours per week, permission, unrelated industries, PhD time now.
7. **"How would we hire you from Ukraine, when could you start, and how do you handle outages?"**
   *Why:* "Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment" (cv.md:6); no work permit listed.
   *Prepare (parked "Hiring route", "Notice period", "Outages"):* B2B or Employer of Record, notice period, backup power and internet.
8. **"How many people did you lead as Technical Leader at Velas?"**
   *Why:* "Technical Leader" (cv.md:54) with no leadership bullet.
   *Prepare (open item "Velas leadership").*
9. **"What is specification-driven development? Did AI write your code?"**
   *Why:* SYSPRO bullet 2 (cv.md:24) and the summary.
   *Prepare (decided, `ai-agents-wording`, `sdd-summary-sentence`):* "Each part had a specification checked against the architecture before coding; AI agents implemented and reviewed code against it, and people reviewed and made every decision."
10. **"Several early jobs were short. Why?"**
    *Why:* The Admasters, Thermo Fisher Scientific, OMO Systems.
    *Prepare (decided, `all-full-time`):* one factual sentence per job.

## Wording a non-technical reader won't understand
| Quote | Location | Plain alternative |
|---|---|---|
| "renders 1,800+ ERP programs from data-model definitions" | cv.md:22 (SYSPRO, bullet 1) | "builds 1,800+ ERP screens automatically from data descriptions" |
| "drove open questions to decisions" | cv.md:26 (SYSPRO, bullet 3) | "got open design questions decided" |
| "view session lifecycle ... context-aware related-program navigation and modal overlays that keep the underlying view's state" | cv.md:28 (SYSPRO, bullet 4) | "how screens open, close, talk to the server and link to each other" (keep XState and Zustand) |
| "in a zero-trust, independently deployable micro-frontend architecture where only the identity app sees credentials" | cv.md:30 (SYSPRO, bullet 5) | "in a secure setup where each part of the app is released on its own and only the sign-in app sees passwords" |
| "adding a blockchain-node remote procedure call (RPC) fallback" | cv.md:62 (Velas, bullet 3) | "adding a backup connection to the blockchain" |
| "Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes" | cv.md:131 (Clinical Trials Patient App, bullet 3) | "Android 14 changes to alarms and notifications" |
| "starting with Forge UI Kit and moving to Forge Custom UI" | cv.md:138 (Generative AI Jira Plugin, bullet 1) | "moving from Atlassian's basic UI kit to a fully custom React interface" |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| hr-1 | medium | cv/variants/fullstack-react-node/cv.md:43 (General Motors, bullet 2) | "At the client's request, changed the architecture to move a reusable feature app into the host app" calls General Motors "the client", although decision `direct-employment` records that General Motors employed the user directly. A recruiter reads "the client" as a sign of agency or outsourced work and will ask (question 2). The same wording is in the `react` and `nodejs` variants (from `general-motors-navigation#4.10`, summary line 110). | Name who asked instead of "the client", e.g. "At the host app team's request" or "At the product owners' request", in the summary contribution 4.10 and then in the CVs. Only you know who made the request. | yes |
| hr-2 | medium | cv/variants/fullstack-react-node/cv.md:13 (Summary, sentence 2) | "Full-stack work at a fintech company and on a blockchain wallet covered Node.js REST APIs with Stripe subscriptions, a PostgreSQL move to AWS RDS ..." describes Itjet as "a fintech company", but Itjet was a services company with several clients (decision `itjet-client-names`; `summaries/itjet-fintech.md:38`), and the Itjet entry itself shows a social app (Wink) and a voter-registration MVP (RegiStart). The Stripe and RDS work was for Fused, not a fintech product. A recruiter matching the summary to the entry sees a mismatch. Not covered by `summary-no-company-names`, which only keeps names and timing out. | Keep it nameless but accurate, e.g. "Full-stack work for fintech and other clients of a software services company, and on a blockchain wallet, covered ...". | no |
| hr-3 | low | cv/variants/fullstack-react-node/cv.md:131 (Clinical Trials Patient App, bullet 3) | Carried over from earlier hr-5. "Migrated the native Android app to **Android 14 (SDK 34)**: Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes, and **Jenkins** CI build fixes" is the least relevant bullet for a full-stack reader and the hardest to read on page 2. | Keep the entry at two bullets in this variant (profile minimum 2), dropping this one; the freed words could also cover the GraphQL suggestion in `gap-report.md`. | no |
| hr-4 | low | cv/variants/fullstack-react-node/cv.md:194, cv.md:198 (Skills: Mobile; Domain and SDKs) | Carried over from earlier hr-6. "HERE SDK (HNav, HNod, HERE API)", "Bluetooth Low Energy (BLE)", "react-native-ble-plx", "MQTT", "SQLCipher", "Fastlane", "Bitrise" read as noise to a full-stack recruiter; the profile de-emphasizes `here-sdk` and `ble`. | Let the variant's skills drop or shorten de-emphasized items, or accept them as ATS keywords. | no |

## Decided (not raised again)
- SYSPRO runtime bullet first and SDD bullet second (earlier hr-2): `syspro-runtime-bullet-first`
- General Motors was a direct employer (answer to question 2): `direct-employment`
- CV name "Kirill Kohan" vs legal name "Kyrylo Kokhan": `keep-cv-name`
- No LinkedIn or GitHub link in the header: `no-profile-links`
- Google Drive portfolio link in the header: `keep-portfolio-link`
- Title step from Team Leader (General Motors) to Senior Software Engineer (SYSPRO): `keep-title-step`
- Short early tenures without a "(Contract)" label: `all-full-time`
- No dates in the consulting and freelance section: `consulting-no-dates`
- AI agent wording at SYSPRO and the summary's SDD sentence: `ai-agents-wording`, `sdd-summary-sentence`
- Summary names no companies and no timing: `summary-no-company-names`
- "1,800+ ERP programs": `keep-erp-programs-figure`
- "company income grew 10x", "user engagement grew 4x": `keep-previous-cv-metrics`
- Itjet client names (Fused, Wink, Aspiration, RegiStart): `itjet-client-names`
- Skills-only items not added to bullets: `skills-only-in-skills-list`

Already tracked (not raised as new findings): recent Node.js backend, AWS only at Itjet, GraphQL in the clinical-trials bullet, WebSockets without a bullet, Thermo Fisher bullet choice (`gap-report.md`); side work, notice period, hiring route, outages (parked); Velas leadership and Admasters stack, which cover earlier hr-3 and hr-4 (`docs/open-items.md`).
