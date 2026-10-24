---
schema_version: 1
rubric: proofreading
cv: portfolio/portfolio.md
job_ad: null
market: null
reviewed_at: 2026-10-24T09:27
verdict: pass-with-issues
score: 8.5
---

# Proofreading review (portfolio)

## Verdict
The text is clean enough to publish: no spelling errors, US English, no double spaces, one set of section labels on all 16 pages, and the built PDF matches `portfolio.md`. The two pages rewritten yesterday (HERE navigation app, car navigation PoC) are the weakest in style: long run-on sentences, a mixed tense, two acronyms defined and never used, and HERE terms that vary. Nothing is high severity.

## PDF versus Markdown
`Kirill_Kohan_Portfolio_A4.pdf` and `portfolio.md` are both dated Oct 23 20:37, and `pdf-check-a4.md` and `pdf-check-letter.md` pass (18 pages, fonts embedded). I extracted the PDF text with pdfjs and looked for every sentence and heading of `portfolio.md` in it, ignoring case and spacing. All were found and none were missing, including the rewritten HERE and PoC pages. The PDF is not stale. The Letter PDF has the same timestamp and was not compared separately.

## Previous report (`reports/2026-10-23-1855/proofreading.md`)
- Fixed: proofreading-1 (GM sentence split into three), -2 ("latest" twice), -3 (HERE's customer is now the package delivery company), -5 (the "reviewed code" repeats are varied; the "directly" repeat is gone), -6 (titles now "Car management app for General Motors", "Dosimeter IoT app under NDA", "Fused (React Native, React, Node.js)"), -7 ("high school seniors"), -8 ("proof of concept (PoC)" on both pages).
- Still open: proofreading-4 (OMO description), now proofreading-pf-6.

## Summary counts
| Area | Issues |
|---|---|
| Spelling | 0 |
| Grammar | 2 (pf-1, pf-2) |
| Consistency | 4 (pf-3, pf-4, pf-5, pf-7) |
| Style / duplicates | 4 (pf-6, pf-8, pf-9, pf-10) |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| pf-1 | medium | portfolio.md:95 (car navigation PoC, description) | One 80-word sentence with a nine-item list, and a mixed tense: "This proof of concept (PoC) is an automotive app that showed the possibilities of new HERE technology in Volkswagen AG cars (...) and integrated features such as the Hugo AI assistant, Level 3 automated driving (L3) interaction, advanced driver-assistance systems (ADAS), the Kurviger route planner, the operational design domain (ODD), custom themes and layout support." "showed the possibilities of" is awkward. ADAS and ODD are spelled out but never used again, and "ODD" is never explained. | "This proof of concept (PoC) is an automotive app that demonstrated what new HERE technology can do in Volkswagen AG cars (Audi, Porsche, Volkswagen and others). It integrated features such as the Hugo AI assistant, Level 3 automated driving (L3) interaction, advanced driver-assistance systems, the Kurviger route planner, custom themes and layout support." Drop the ODD item or explain it. | no |
| pf-2 | medium | portfolio.md:81 (HERE navigation app, Responsibilities, paragraph 1) | "handled" is used twice ("I handled route deviations ... I then handled these events"). The comma and colon in "route deviations, when a truck driver leaves the planned route: collecting these cases" are awkward. The last sentence is hard to follow: "a redesigned search UI I built used the HERE navigation SDK in TypeScript and on Android". The search UI is mentioned nowhere else. | "I worked on route deviations, the cases when a truck driver leaves the planned route: I collected them and sent them to a reporting endpoint. ... I then processed these events, compared the route data to detect deviations, and sent that data to the customer. I also built a redesigned search UI. Both pieces used the HERE navigation SDK in TypeScript and on Android, with HNav, HNod and HERE's service packages." | no |
| pf-3 | low | portfolio.md:71, 81, 123 (HERE navigation app) | HERE terms are not consistent: "the HNod library" (71) versus "the HERE HNod library" (81). The order flips: "(HNod, HNav, HERE SDK ...)" (71) versus "HNav, HNod and HERE's service packages" (81). HNod and HNav are never expanded. "gRPC" appears twice in the same paragraph ("connected through gRPC", "HERE bundler (gRPC)"). "an Android native or web app" is unclear. The description opens with the customer, not the product. | One form, "the HNod library", and one order, "HNod, HNav". Add a short gloss at first use. Drop the second "gRPC". Write "an Android app, native or web-based". Open with "A customizable Android navigation app for large-truck drivers ...". | yes (HNod and HNav meanings) |
| pf-4 | low | portfolio.md:57, 63, 71, 87, 109 (GM, HERE, PoC pages) | Three names for the same SDK: "HERE SDK", "HERE navigation SDK", "HERE SDK for Android" ("HERE navigation SDK" in the HERE page text and technologies lists, "HERE SDK" in the HERE description and the GM page, "HERE SDK for Android" in the PoC list). | Use "HERE SDK" in prose and keep the one precise name per page in the lists, or confirm that they are different products. | yes |
| pf-5 | low | portfolio.md:105 (car navigation PoC, Responsibilities, paragraph 2) | "curvy-route controls" and "route-curviness slider" name the same feature two ways. The paragraph is about 130 words with seven sentences starting with "I", and a semicolon sentence mixes two projects ("... from the map; in a separate Kotlin reference app ..."). "Porsche theme and layout" and "brand themes" overlap. | "I added curvy-route controls and fixed alternative-route selection from the map. In a separate Kotlin reference app for motorcycle navigation, I built a curviness slider and screen orientation handling during guidance." Split the paragraph after the theme sentences. | no |
| pf-6 | low | portfolio.md:185, 187 (OMO description) (previous proofreading-4, still open) | Video surveillance comes up twice ("Video surveillance: they watch buildings ..." and "video surveillance inside the apartment"), the motion-sensor scenario twice ("synced with motion sensors through scenarios", "starting a camera when a motion sensor detects movement"). The run-in labels "Access to the apartment:", "Video surveillance:", "Security:" read like a flattened list. "traffic monitoring" is unclear for a home. | Merge into two plain paragraphs, give the scenario example once, drop the labels, and check what "traffic monitoring" meant. | yes |
| pf-7 | low | portfolio.md:57, 59 (GM page) | "reusable feature app" (57, 59) and "reusable feature" (59: "the reusable feature's architecture", "from the reusable feature into the map provider") name the same thing. "planned moving its logic" is clumsy. | Use "reusable feature app" throughout; "planned the move of its logic and components to the parent app's patterns". | no |
| pf-8 | low | portfolio.md:393 (Oroscopo, Responsibilities) | "worked with the app's API: UI components, an animated card circle, the zodiac compatibility logic ..." The colon list is not about the API. "demoed" is informal. | "I added new features: UI components, an animated card circle, ... I worked with the app's API, optimization and testing, took part in project meetings and demonstrated my work to the customer." | no |
| pf-9 | low | portfolio.md:127, 263, 319, 345 | Informal or unclear wording: "configured building and signing of the wallets in CI/CD" (127); "grooming sessions" and "planned the scope of tasks for the next period" (263); "migrated the dev and production databases", "dev backend EC2 instance" (319); "did code reviews" (345). | "configured wallet builds and signing in CI/CD"; "backlog grooming sessions" and "planned the scope of the next sprint" (if that is what it was); "development and production databases", "development backend EC2 instance"; "reviewed code". | no |
| pf-10 | low | portfolio.md:98 (PoC caption) | Alt text "Car navigation PoC on the head unit": "head unit" is jargon next to the in-car display wording in the description. | "Car navigation PoC on the in-car display". | no |

## Checked and fine
Titles (all in "name (technologies)" form, "under NDA" where decided), US English, no filler words, tense in the Responsibilities paragraphs (past), bold only on section labels, final periods in every technologies list, capitalization of Hugo AI (twice, same form), L3, HNav and HNod (as spelled everywhere), MVP and PoC defined once per page, "frontend" and "end-to-end" spelled one way, the first-person voice (the portfolio's design, spec section 4).

## Decided (not raised again)
- "investing in renewable energy sources and fossil fuel" (portfolio.md:227): portfolio-aspiration-fossil-fuel
- AI coding agents implementing and reviewing code under human review (portfolio.md:31): ai-agents-wording, sdd-not-vibe-coding
- Naming General Motors, HERE Technologies, Volkswagen AG and brands, Hugo AI, Kurviger, "under NDA" in titles, the Itjet clients: portfolio-client-names, gm-project-names, portfolio-poc-names-public, itjet-client-names
- HERE components (HNod, HERE bundler, HNav) in the text and technologies lists: portfolio-here-detail-kept, portfolio-tech-lists-project-stack
- Clinical trial description kept: portfolio-clinical-page-kept
- PM2, Nginx, Apollo, AWS Amplify, Cognito only in technologies lists: skills-only-in-skills-list
