---
schema_version: 1
rubric: proofreading
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-16T12:02
verdict: pass-with-issues
score: 8.5
---

# Proofreading review

## Verdict
The CV is clean. Company, product and technology names are spelled correctly, there are no first-person or filler words, no double spaces and no forbidden characters, and every bullet ends with a period. What's left is one subject-verb attachment problem, one misplaced modifier, a repeated bullet opener, a few term inconsistencies (React / React.js, developers / engineers) and small punctuation and style polish.

## Summary counts
| Category | Issues |
|---|---|
| Spelling | 1 |
| Grammar | 3 |
| Consistency | 10 |
| Style (incl. duplicates and punctuation) | 9 |
| **Total** | **23** |

High: 0 | Medium: 4 | Low: 19

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| proofreading-1 | medium | cv/Kirill_Kohan_CV.md:176 (Generative AI Jira Plugin, bullet 1) | Grammar: "with **React, TypeScript** and **Node.js** resolvers that starts **generative AI** design generation". The nearest noun is the plural "resolvers", so "that starts" reads as a subject-verb error. The subject is meant to be "app". "generative AI design generation" also repeats "generat-". | "Built an **Atlassian Jira Forge** app from scratch (**React, TypeScript**, **Node.js** resolvers) that starts **generative AI** design creation from a Jira issue and creates a Jira subtask for the result." | no |
| proofreading-2 | medium | cv/Kirill_Kohan_CV.md:169 (Clinical Trials Patient App, bullet 6) | Misplaced modifier: "by bisecting dependency versions and adding targeted logging, including login, PIN, task scheduling and document loading issues". The "including …" phrase attaches to "logging", but it is meant to list the bugs. | "Resolved production crashes and patient-facing bugs, including login, PIN, task-scheduling and document-loading issues, by bisecting dependency versions and adding targeted logging." | no |
| proofreading-3 | medium | cv/Kirill_Kohan_CV.md:125 (Itjet, bullet 2) and :142 (The Admasters, bullet 1) | Duplicate: two consecutive entries open with the same words, "Integrated **A/B testing** …". | Vary one opener. For example, Itjet: "Added **A/B testing** so the marketing team could analyze user engagement." Or Admasters: "Ran **A/B tests** on e-commerce products to raise conversion rates." | no |
| proofreading-4 | medium | cv/Kirill_Kohan_CV.md:13 (Summary, sentence 3), :45 (General Motors, bullet 1), :144 (The Admasters, bullet 2), :242 (Skills, Leadership) | Inconsistent term for team members: "a team of 8 developers" (summary, GM), "a team of 3 software engineers" (Admasters), "Team leadership (up to 8 engineers)" (skills). | Pick one noun: either "engineers" everywhere ("Led a team of 8 engineers …", "Led a team of 3 engineers …") or "developers" everywhere. The skills line is generated, so change it in `facts/skills.yaml`. `lint` accepts both forms. | yes |
| proofreading-5 | low | cv/Kirill_Kohan_CV.md:224 (Skills, Frontend) | Consistency: "React 19, React.js" lists a second form of the term. Bullets use "React" everywhere. | If "React.js" is kept on purpose as an ATS keyword variant, leave it. Otherwise change it to "React" in `facts/skills.yaml` (generated block). | yes |
| proofreading-6 | low | cv/Kirill_Kohan_CV.md:78 (Velas, bullet 6) | Spelling (US English): "user engagement grew 4x afterwards". US usage is "afterward". | "… user engagement grew 4x afterward." (The summary wording `velas-wallet#4.6` uses "afterwards" too.) | no |
| proofreading-7 | low | cv/Kirill_Kohan_CV.md:24 (SYSPRO, bullet 2), :28 (SYSPRO, bullet 4), :22, :32 | Bullet length: lines 24 and 28 have 46 words, over the ~45-word guideline (cv-spec 3). Lines 22 and 32 are at exactly 45. | Line 28: drop "which reduced PR review cycles" into a shorter form ("… for human decision, reducing PR review cycles"), or move the technical-debt sentence elsewhere. Line 24: "Worked with the lead architect on the **platform and solution architecture**, co-authoring architecture documents and driving open questions to decisions." | no |
| proofreading-8 | low | cv/Kirill_Kohan_CV.md:28 (SYSPRO, bullet 4) | Consistency: "spec-to-code drift" uses the short form "spec", while the CV says "specification" everywhere else. "PR" is not spelled out. | "specification-to-code drift" and "pull request (PR) review cycles". Or keep "PR" if the audience is technical. | no |
| proofreading-9 | low | cv/Kirill_Kohan_CV.md:13 (Summary, sentence 4) vs :22 (SYSPRO, bullet 1) | Consistency: "architecture-governed, specification-driven development (SDD)" has a comma, and "architecture-governed **specification-driven development (SDD)**" doesn't. | Drop the comma in the summary: "architecture-governed specification-driven development (SDD)". | no |
| proofreading-10 | low | cv/Kirill_Kohan_CV.md:13, :34, :127 vs :36, :68, :178, :182 | Punctuation: the serial (Oxford) comma is used inconsistently. With it: "frontend technology-stack decisions, and architecture-governed …", "OTLP exporter, and a redaction stage", "(**design system**), and setting up". Without it: "MobX and Web3.js", "server URL and design-system selection", "SonarQube and Atlassian design tokens". | Most lists have no serial comma, so remove it on lines 13, 34 and 127 (line 127 can keep it if it's needed for clarity after the parenthesis). | no |
| proofreading-11 | low | cv/Kirill_Kohan_CV.md:26, :38, :55, :159 vs :127, :226 | Separators: slash spacing varies. "React 19 / TypeScript", "SCSS / CSS Modules", "HNav / HNod", "Java / Kotlin" have spaces, while "EC2/S3" and "iOS/Android" don't. | Pick one style, for example spaced " / " between technology names and unspaced for short pairs, and apply it everywhere. Line 226 is generated (`facts/skills.yaml`). | no |
| proofreading-12 | low | cv/Kirill_Kohan_CV.md:32 (SYSPRO, bullet 6) | Compound modifiers are missing hyphens: "**WCAG** accessible typography" and "sign-in, forgot and reset password flows". | "**WCAG**-accessible typography" and "sign-in, forgot-password and reset-password flows". | no |
| proofreading-13 | low | cv/Kirill_Kohan_CV.md:114 (Thermo Fisher Scientific, bullet 5) | Punctuation: an unneeded comma before "and" joins two objects, not two clauses: "with **OAuth 2.0**, and local storage of dosimeter data". | "Implemented a secure login flow with **OAuth 2.0** and local storage of dosimeter data in **Realm** with efficient filtering." | no |
| proofreading-14 | low | cv/Kirill_Kohan_CV.md:135 (Itjet, bullet 7) vs :146 (The Admasters, bullet 3), :224 (Skills) | Consistency: "**Next.js** (server-side rendering)" vs "server-side rendering (SSR)" and "Server-side rendering (SSR)" in skills. | "Built web features with **Next.js** and server-side rendering (SSR) and **GraphQL** …", or drop the acronym in the Admasters bullet. | no |
| proofreading-15 | low | cv/Kirill_Kohan_CV.md:193, :197 (Various Clients, bullets 3 and 5) vs :242 (Skills) | Wording: "effort estimations" (twice). US usage is "effort estimates", and the skills list says "Effort estimation". | "prioritized upgrade plans with **effort estimates**" and "solution proposals, effort estimates and …". | no |
| proofreading-16 | low | cv/Kirill_Kohan_CV.md:189 (Various Clients, bullet 1) | Style: "by up to 50% by refactoring" uses "by" twice in a row, and "adding caching and adding unit tests" repeats "adding". | "… cutting operational costs by up to 50% through refactoring core apps and adding caching and unit tests." | no |
| proofreading-17 | low | cv/Kirill_Kohan_CV.md:91 (OMO Systems, bullet 1) | Modifier placement: "controlling smart-home **IoT** devices in the R&D department" reads as if the devices were in the R&D department. | "Delivered, in the R&D department, the core mobile app for controlling smart-home **IoT** devices." Or: "As part of the R&D department, delivered …". | no |
| proofreading-18 | low | cv/Kirill_Kohan_CV.md:93 (OMO Systems, bullet 2) | Style: "won 1st place" uses a numeral for an ordinal in running text. | "won first place at a local hackathon". | no |
| proofreading-19 | low | cv/Kirill_Kohan_CV.md:70 (Velas, bullet 2) | Clarity: "a Node RPC fallback" (capital N) can be read as Node.js, which this CV uses a lot, rather than a blockchain node. | "a blockchain-node RPC fallback" or "a node RPC fallback". | no |
| proofreading-20 | low | cv/Kirill_Kohan_CV.md:226 (Skills, Mobile) | Capitalization: "Native Modules (iOS/Android)" capitalizes the second word. Other skill items use sentence case ("Design systems", "Micro-frontends"). | "Native modules (iOS/Android)" in `facts/skills.yaml` (generated block). | no |
| proofreading-21 | low | cv/Kirill_Kohan_CV.md:4 (Header, headline) | Consistency: "(Frontend & Mobile)" uses "&", while the rest of the CV uses "and". | "(Frontend and Mobile)" in the headline source (`facts/profile.yaml` / config). This is a generated line. | yes |
| proofreading-22 | low | cv/Kirill_Kohan_CV.md:8 (Header, contacts) | Check: the email "kiril.kohan@gmail.com" spells the first name with one "l", while the CV name is "Kirill". It matches `facts/profile.yaml`, so it's probably correct, but a typo here would make the CV unreachable. | Confirm that the address is exactly right. No change if it is. | yes |
| proofreading-23 | low | cv/Kirill_Kohan_CV.md:106, :114, :116 (Thermo Fisher Scientific, bullets 1, 5, 6) | Repetition: "**Realm**" appears in three of the six bullets, and bullets 5 and 6 both cover Realm storage and filtering or access. | Keep the bold on the first mention only, or merge the storage part of bullet 5 into bullet 6. | no |

## Decided (not raised again)
- Consulting entries show no dates (lines 157, 174, 187), so the date format check doesn't apply to them: consulting-no-dates
- "(Contract)" appears only on the two consulting entries (lines 155, 172), and the full-time jobs carry no label: all-full-time
- Generative-AI and AI-agent wording in the SYSPRO bullets is presented as governed review, which is the agreed framing, not a style issue: sdd-not-vibe-coding
