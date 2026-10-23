---
schema_version: 1
rubric: proofreading
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T13:51
verdict: pass-with-issues
score: 8.5
---

# Proofreading review

## Verdict
The CV is clean at the level that matters most. Company, product and technology names are spelled correctly, `spellcheck` and `lint` report 0 issues, there are no first-person or filler words, no double spaces, and every bullet ends with a period and stays within 45 words. What's left is one present-tense sentence, a few modifiers attached to the wrong noun, overused openers ("Built" on 14 bullets, "from scratch" 6 times), a summary sentence that repeats a SYSPRO bullet word for word, and small hyphenation and wording fixes.

## Summary counts
| Category | Issues |
|---|---|
| Spelling | 0 |
| Grammar | 10 |
| Consistency | 6 |
| Style (incl. duplicates and punctuation) | 9 |
| **Total** | **25** |

High: 0 | Medium: 5 | Low: 20

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| proofreading-1 | medium | cv/Kirill_Kohan_CV.md:184 (Generative AI Jira Plugin, bullet 1) | Tense: the second sentence is in present tense, "The app starts **generative AI** design creation from a Jira issue and adds a Jira subtask for the result." Bullets use past tense. "starting with Forge UI Kit" and "The app starts" also repeat "start". | "Built an **Atlassian Jira Forge** app from scratch with **React, TypeScript** and **Node.js** resolvers that launched **generative AI** design creation from a Jira issue and added a Jira subtask for the result, moving from Forge UI Kit to **Forge Custom UI**." | no |
| proofreading-2 | medium | cv/Kirill_Kohan_CV.md:125, :127, :135, :137, :139 (Itjet, bullets 1, 2, 6, 7, 8); also :26, :32, :59, :84, :97, :108, :114, :184, :186 | Duplicates: 14 bullets open with "Built", including 5 of the 8 Itjet bullets. "from scratch" appears 6 times (:32, :34, :84, :108, :127, :184). Itjet bullets 4 and 5 (:131, :133) both open with "Doubled". | Vary the verbs where the meaning allows, e.g. Itjet: "Created the Wink social app …", "Delivered the RegiStart voter-registration MVP …", "Implemented the automated monthly subscription flow for Fused …", "Developed web features for Aspiration …"; Itjet bullet 5: "Migrated Fused's **PostgreSQL** from EC2 to **AWS RDS** and optimized slow SQL queries, doubling database performance." Keep "from scratch" where it is the point (Login micro-frontend, Wink) and drop it elsewhere. | no |
| proofreading-3 | medium | cv/Kirill_Kohan_CV.md:125 (Itjet, bullet 1) | Grammar: in "… apps of Aspiration, a fintech product (Forbes top 10), which made building new flows 3x faster", the "which" clause attaches to "a fintech product", so it reads as if Aspiration made building faster, not the signup flow. | "Built a reusable **React Native Web** signup flow, shared by the native mobile and web apps of Aspiration (a Forbes top 10 fintech product), that made building new flows 3x faster." | no |
| proofreading-4 | medium | cv/Kirill_Kohan_CV.md:13 (Summary, sentence 2) vs :26 (SYSPRO, bullet 3) | Duplicate: "Built core modules of a schema-driven React 19 runtime that renders 1,800+ ERP programs from data-model definitions" repeats the SYSPRO bullet almost word for word ("Built core modules of a schema-driven **React 19 / TypeScript** runtime … that renders **1,800+ ERP programs** from data-model definitions"). | Reword the summary sentence, e.g. "Built a schema-driven React runtime that renders 1,800+ ERP screens from data definitions, with no per-screen code." (keep the figure; only the wording changes). | no |
| proofreading-5 | medium | cv/Kirill_Kohan_CV.md:182, :184, :186, :188 (Generative AI Jira Plugin) | Consistency: the same product is called "Plugin" (label, :182), "app" (:184) and "plugin" (:188); the feature is "design creation" (:184) and "design generation" (:186). | Pick one noun ("app", the Forge term, or "plugin", matching the label) and one feature name ("design generation", as in the summary) for the whole entry, e.g. :188 "removing the app's dependency on the backend" and :184 "starts generative AI design generation". | no |
| proofreading-6 | low | cv/Kirill_Kohan_CV.md:36 (SYSPRO, bullet 8) | Grammar: in "maintained a **Node.js** mock backend and the **monorepo** tooling (…) and fixed …" the two "and"s make the list hard to parse. "code generation bugs" is a compound modifier without a hyphen. | "Covered implementations with **Vitest** and **Vitest Browser Mode** (**Playwright** provider) tests; maintained a **Node.js** mock backend and the **monorepo** tooling (…); and fixed schema-to-TypeScript **code-generation** bugs, proposing improvements the lead agreed to add." | no |
| proofreading-7 | low | cv/Kirill_Kohan_CV.md:28 (SYSPRO, bullet 4) | Style: "This reduced review cycles; deferred issues went to a **technical-debt register**." "This" has no clear referent, and the second clause is a separate idea joined with a semicolon. | "… for human decision, which reduced review cycles and sent deferred issues to a **technical-debt register**." | no |
| proofreading-8 | low | cv/Kirill_Kohan_CV.md:34 (SYSPRO, bullet 7) | Consistency: "strips sensitive data (PII)": the acronym in brackets doesn't spell out its words, unlike every other acronym in the CV ("OpenTelemetry Protocol (OTLP)" in the same bullet). | "a redaction stage that strips personally identifiable information (PII) before export." | no |
| proofreading-9 | low | cv/Kirill_Kohan_CV.md:45 (General Motors, bullet 1) | Grammar: "… vehicle companion app, built in **React Native**, working with stakeholders on scope and planning." "working with stakeholders" now attaches to the app, and "built in React Native" repeats "6 React Native" earlier in the sentence. | "Led the map team of 8 engineers (6 React Native, 1 iOS, 1 Android) for the General Motors **React Native** vehicle companion app and worked with stakeholders on scope and planning." | no |
| proofreading-10 | low | cv/Kirill_Kohan_CV.md:55 (General Motors, bullet 6) | Grammar: "Defined the unit-testing strategy that reached 95% coverage and introduced an **Agile** delivery process" reads as if the strategy introduced the Agile process. | "Defined the unit-testing strategy, which reached 95% coverage, and introduced an **Agile** delivery process that reduced production bugs." | no |
| proofreading-11 | low | cv/Kirill_Kohan_CV.md:72 (Velas, bullet 2), :125 (Itjet, bullet 1), :163 (Clinical Trials Patient App, bullet 1), :186 (Generative AI Jira Plugin, bullet 2) | Consistency (hyphens): compound modifiers are hyphenated in some places ("staking-rewards calculation" :80, "sign-in" :32, :127) but not others: "staking list loading", "signup flow", "clinical trial mobile app", "design generation form". | "staking-list loading", "sign-up flow", "clinical-trial mobile app", "design-generation form". | no |
| proofreading-12 | low | cv/Kirill_Kohan_CV.md:101 (OMO Systems, bullet 5) vs :28, :165 | Consistency: approximations use "~" ("~17 component specifications", "~1,000 lines") but "about" in "a team of about 3 engineers". | Pick one form: "a team of ~3 engineers", or "about 17" and "about 1,000". | no |
| proofreading-13 | low | cv/Kirill_Kohan_CV.md:148 (The Admasters, bullet 2) | Consistency: "a team of 3 software engineers", while the summary, General Motors, OMO and Skills say "engineers". | "Led a team of 3 engineers and introduced **Agile** processes." | no |
| proofreading-14 | low | cv/Kirill_Kohan_CV.md:47 (General Motors, bullet 2) and :101 (OMO Systems, bullet 5) | Duplicate phrase: "Ran **code reviews** and set coding standards" and "ran **code reviews**, set coding standards". | Vary one, e.g. OMO: "Led and mentored a team of about 3 engineers: reviewed their code, defined coding standards and onboarded new engineers." | no |
| proofreading-15 | low | cv/Kirill_Kohan_CV.md:139 (Itjet, bullet 8) | Grammar: "with **Next.js** with server-side rendering (SSR)" repeats "with". | "Built web features for Aspiration in **Next.js** with server-side rendering (SSR) and **GraphQL** …". | no |
| proofreading-16 | low | cv/Kirill_Kohan_CV.md:108 (Thermo Fisher Scientific, bullet 1) | Grammar: "… an offline-first **Realm** database, communicating with radiation dosimeters over Bluetooth" makes the database the thing that communicates. | "Built an **IoT healthcare** app from scratch that communicated with radiation dosimeters over Bluetooth, and designed its architecture with **React Native, TypeScript, Redux** and an offline-first **Realm** database." | no |
| proofreading-17 | low | cv/Kirill_Kohan_CV.md:163 (Clinical Trials Patient App, bullet 1) | Grammar: in "electronic clinical outcome assessment (**eCOA**) built with **React Native, Expo and TypeScript**", "built with" attaches to the assessment, not the app. | "Developed and maintained a patient-facing **clinical-trial** mobile app built with **React Native, Expo and TypeScript** for electronic clinical outcome assessment (**eCOA**), and its native **Android (Java / Kotlin)** counterpart." | no |
| proofreading-18 | low | cv/Kirill_Kohan_CV.md:205 (Various Clients, bullet 5) | Grammar: the list isn't parallel: "solution proposals, effort estimates and answering technical questions". | "… for **presales**: solution proposals, effort estimates and answers to technical questions in client calls." | no |
| proofreading-19 | low | cv/Kirill_Kohan_CV.md:199 (Various Clients, bullet 2) | Grammar: "for … roles for enterprise clients" repeats "for", and "technical" appears twice. | "Conducted senior-level **technical interviews** for enterprise clients' **React, React Native, JavaScript and TypeScript** roles, with coding assignments and in-depth questions." | no |
| proofreading-20 | low | cv/Kirill_Kohan_CV.md:57 (General Motors, bullet 7) vs :248 (Skills, Domain and SDKs) | Consistency: "**HERE HNav / HNod SDK**" in the bullet vs "HERE SDK (HNav, HNod, HERE API)" in Skills. | Use one form, e.g. "**HERE SDK (HNav, HNod)**" in the bullet. | no |
| proofreading-21 | low | cv/Kirill_Kohan_CV.md:165 (Clinical Trials Patient App, bullet 2) | Punctuation: a comma before "and added" joins two verbs of the same subject; elsewhere the CV has no comma there (e.g. :116, :133). | "… to speed up the app and added ~1,000 lines of **Jest** and **React Native Testing Library** tests." | no |
| proofreading-22 | low | cv/Kirill_Kohan_CV.md:173 (Clinical Trials Patient App, bullet 6) | Wording: "rotated **SSL certificate pinning**". Certificates (or pins) are rotated, not the pinning. | "… and rotated the pinned SSL certificate (**SSL certificate pinning**) for a backend certificate change." | no |
| proofreading-23 | low | cv/Kirill_Kohan_CV.md:190 (Generative AI Jira Plugin, bullet 4) vs :184 | Consistency: "Added ESLint, TypeScript and a pre-commit lint hook" after bullet 1 says the app was built with TypeScript, which reads as a contradiction. | "Added ESLint, TypeScript checks and a pre-commit lint hook …" (or "TypeScript configuration"). | no |
| proofreading-24 | low | cv/Kirill_Kohan_CV.md:212, :214 (Education, PhD) | Style: "PhD Candidate … (in progress)" and "2023 - 2027 (expected)" say the same thing twice. This is a generated block. | "PhD Candidate, Computer Science" with "2023 - 2027 (expected)", changed in the education source in `facts/profile.yaml`. | no |
| proofreading-25 | low | cv/Kirill_Kohan_CV.md:250 (Skills, Leadership and Methodologies) | Consistency: "Figma" is a design tool listed among leadership skills and methodologies. Generated block. | Move "Figma" to Frontend (or a tools group) in `facts/skills.yaml`. | no |

## Decided (not raised again)
- "React 19, React.js" in Skills (:232) as an extra keyword, and the email spelling "kiril.kohan@gmail.com" (:8): keep-contact-and-keywords
- Consulting and freelance entries show no dates (:161, :182, :195), so the date-format check doesn't apply: consulting-no-dates
- "(Contract)" appears only on the two consulting entries (:159, :180): all-full-time
- The summary paragraph names no companies and uses no timing words ("for an automotive manufacturer"): summary-no-company-names
- AI agent wording at SYSPRO (:22 "AI agents that implement and review code against the specifications", :28 "with AI agents as reviewers" for the validation step) follows the agreed framing; whether :28 matches the decision is for the fact-check rubric, not proofreading: ai-agents-wording, sdd-not-vibe-coding
- Client names Aspiration, RegiStart, Fused and Wink in the Itjet entry: itjet-client-names
- Stack line on the older Clinical Trials Patient App entry (:177): orion-stack-line
- "Forbes top 10", "income grew 10x", "tripled the number of new users", "engagement grew 4x" kept as they are: keep-previous-cv-metrics
- The "1,800+ ERP programs" figure itself (proofreading-4 is about the repeated wording only): keep-erp-programs-figure
