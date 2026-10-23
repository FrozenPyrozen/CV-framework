---
schema_version: 1
rubric: proofreading
cv: portfolio/portfolio.md
job_ad: null
market: null
reviewed_at: 2026-10-23T16:40
verdict: pass-with-issues
score: 7.5
---

# Proofreading review

## Verdict
Spelling and technology names are clean, and the build matches the Markdown (`pdf-check-a4.md`: pass, 18 pages, all fonts embedded). The A4 build (built 16:33, after the last `portfolio.md` change) and the A4 previews were checked. Five issues need fixing: a sentence carried over from the 2025 portfolio says something wrong ("investing in ... fossil fuel"), one title contradicts its own page, the same stock phrases repeat across the Itjet pages, and three descriptions don't say what the product is. The rest is low-priority polish.

Note: the portfolio uses first person ("I built ..."), unlike the CV. This is intended. It is the voice of the published portfolio that spec section 4 keeps, and `agents/portfolio.md` asks for "what you did". It is not raised as a finding.

## Summary counts
| Area | Issues |
|---|---|
| Spelling | 0 (spellcheck passed; one capitalization issue counted under consistency) |
| Grammar | 3 (proofreading-1, proofreading-5, proofreading-12) |
| Consistency | 7 (proofreading-2, proofreading-6, proofreading-7, proofreading-9, proofreading-10, proofreading-11, proofreading-14) |
| Style / duplicates | 5 (proofreading-3, proofreading-4, proofreading-8, proofreading-13, proofreading-15) |
| Spec conflict (rubric) | 1 (proofreading-16) |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| proofreading-1 | high | portfolio.md:223 (Aspiration signup, description, sentence 2) | Taken over from the 2025 portfolio ("investing money in reusable energy sources and fossil fuel"), the sentence says an eco-friendly bank invests in fossil fuel: "It is an eco-friendly bank that helps the planet by planting trees and investing in renewable energy sources and fossil fuel." This contradicts itself and is probably the opposite of what was meant. | "It is an eco-friendly bank that helps the planet by planting trees and investing in renewable energy instead of fossil fuel." (or "... and keeping deposits out of fossil fuel projects"). Confirm the meaning first. | yes |
| proofreading-2 | medium | portfolio.md:68 and 71 (HERE navigation app, title and description, sentence 1) | The title and the text disagree about the customer. The title says "Automotive navigation app under NDA for HERE Technologies", but the text says "The customer works in package delivery and builds on HERE solutions", which makes HERE the supplier, not the customer. The title also names the client and says "under NDA" in the same line. Spec section 4 uses one or the other ("the client where it may be named (or "under NDA")"). | Text: "HERE's customer, a package delivery company, builds on HERE solutions (...)". Title (summary `portfolio_projects` title): "Truck navigation app for HERE Technologies (React Native, React, Node.js, Android)", without "under NDA" (decision `gm-project-names` names the project). | no |
| proofreading-3 | medium | portfolio.md:211, 235, 259, 341, 367, 389 (dosimeter, Aspiration signup, Aspiration web, Wink, Golfuture, Oroscopo: Responsibilities) | The same stock phrases repeat across pages. "took an active part in" appears 5 times (211, 235, 259, 367, 389). "proposed effective solutions for the business" and "suggested ways to improve the user experience" each appear twice (211 and 235, almost the same sentence on both pages). "optimized and tested the app" appears 3 times (341, 367, 389). "presented the results directly to the customer" appears twice (367, 389). "did code reviews" appears 3 times (211, 235, 341). "from scratch based on" appears 4 times (259, 285, 341, 367). The rubric asks for no padding or repetition across projects. | Keep each phrase on the one page where it matters most and replace the others with something specific to that project, or drop them. For example, Oroscopo: "I added new features ... with tarot layouts, and demoed each release to the customer." Dosimeter: drop "proposed effective solutions for the business". | no |
| proofreading-4 | medium | portfolio.md:297, 327 (Fused and Wink, description, sentence 1) | Two descriptions never say what the product is. Fused starts with "The application has two roles, coach and athlete" (a fitness coaching app?). Wink starts with "Users like or dislike other users by swiping ..." (a social or dating app?). Every other page opens by saying what the product is. | Add an opening sentence for each, e.g. "Fused is a training app for coaches and their athletes." and "Wink is a social app for meeting new people." Only the user can confirm what each product is. | yes |
| proofreading-5 | medium | portfolio.md:327 (Wink, description, sentence 1) | "Users like or dislike other users by swiping right or left for gems (the in-game currency)" is unclear. It can't tell whether swiping costs gems or earns them, and "in-game currency" is odd for an app that isn't a game. The 2025 source is just as unclear ("swiping left/right for Gems(game currency)"). | E.g. "Users swipe right or left to like or dislike other profiles; each like costs gems, the app's own currency." (wording depends on how gems worked). | yes |
| proofreading-6 | medium | portfolio.md:220, 223, 239 (Aspiration signup, title, description sentence 3, technologies) | The page says two different things about the technology. The title and the technologies say "React Native Web", while the text says "The company moved its signup flow from Angular to React." | "The company moved its signup flow from Angular to React Native Web." | no |
| proofreading-7 | low | portfolio.md:71 (HERE navigation app, description, sentence 2) | The pronoun changes: "We worked on a customizable Android app ..." is the only "we" in a portfolio that otherwise says "I" or "the team". | "The project was a customizable Android app built with ..." | no |
| proofreading-8 | low | portfolio.md:181, 183 (OMO, description) | The description repeats itself. Video surveillance comes up twice ("Video surveillance: they watch buildings ..." and "video surveillance inside the apartment"), and so do motion-sensor scenarios ("synced with motion sensors through scenarios", then "starting a camera when a motion sensor detects movement"). The run-in labels ("Access to the apartment:", "Video surveillance:", "Security:") inside a prose paragraph read like a list that was flattened. "traffic monitoring" is unclear for a home. | Merge into two plain paragraphs, mention the scenario example once, and drop the run-in labels. Check what "traffic monitoring" meant (perhaps "entry monitoring"). | yes |
| proofreading-9 | low | portfolio.md:71, 85 (HERE navigation app, description sentence 5 and technologies) | One component has two names: "connected to the gRPC bundler" in the text, "HERE bundler" in the technologies. | Use one name on the page, e.g. "the HERE bundler (gRPC)". | no |
| proofreading-10 | low | portfolio.md:63, 239, 263 (GM car management app, Aspiration signup, Aspiration web: technologies) | One term has two forms: "domain-driven design" (line 63) and "DDD" (line 239). "CDD" (lines 239, 263) is spelled out only in the body of the Aspiration signup page. | Use "domain-driven design" and "component-driven development (CDD)", or spell each out the first time on each page. | no |
| proofreading-11 | low | portfolio.md:40, 200, 294 (titles: GM car management app, dosimeter, Fused) | The titles don't follow one pattern. "Automotive car management app" says the same thing twice. "IoT app with dosimeter under NDA" reads awkwardly. "Fused (web, mobile and backend)" is the only title that lists no technologies (others: "(React Native)", "(React web, Node.js backend, CI/CD)"). | "Car management app for General Motors (React Native)", "Dosimeter IoT app under NDA (React Native)", "Fused (React Native, React, Node.js)". These are `portfolio_title` / `portfolio_projects` titles in the summaries; `npm run portfolio -- refresh` writes them. | no |
| proofreading-12 | low | portfolio.md:93, 113, 247 (car navigation PoC, Velas Wallet, Aspiration web: description, sentence 1) | Three descriptions are fragments with no main verb: "An automotive app built to show the possibilities ...", "A fully open-source, non-custodial ... crypto wallet that supports ...", "A banking web app flow for planting trees from your transactions ...". The last one also switches to "your", which appears nowhere else. | "The PoC showed the possibilities of ...", "Velas Wallet is a fully open-source ... wallet that supports ...", "The web app lets customers plant trees with their transactions and change their profile and settings." | no |
| proofreading-13 | low | portfolio.md:93, 132, 135 (car navigation PoC and Jira plugin) | Some jargon is never explained. "L3 interaction", "ADAS", "ODD" and "Kurviger" on the PoC page mean nothing to an HR reader. "PoC" is used in a title (line 90) before it is spelled out on a later page ("proof-of-concept (PoC)", line 135), and "MVP" is never spelled out (line 135). | Spell out the acronyms once per page (e.g. "advanced driver assistance (ADAS)", "Level 3 automated-driving interaction") or cut the list to the features that were built. Title: "Car navigation proof of concept under NDA". | no |
| proofreading-14 | low | portfolio.md:113 (Velas Wallet, description); 145 (Jira plugin, Responsibilities) | Product names are written oddly. "Heco" is usually written "HECO" (Huobi ECO Chain). "Jira Forge" is better written "Atlassian Forge" ("Forge Custom UI" in the technologies is correct). | "... BNB Smart Chain (BSC), HECO and Bitcoin networks"; "with Atlassian Forge Custom UI, Atlaskit and TypeScript". | no |
| proofreading-15 | low | portfolio.md:135, 353 (Jira plugin and Golfuture, descriptions) | Some marketing tone is left over from the old text: "greatly speeds up designers' work", "a proprietary new concept of golf", "innovative course design", "an exciting environment for golfers". `checks.filler_words` doesn't flag these, but `cv-spec.md` 4 says "no filler or hype". | "speeds up designers' work"; "Golfuture is a shorter, cheaper form of golf: ..."; "combines its own course design with ball-tracking technology". | no |
| proofreading-16 | low | specs/rubrics/proofreading.md (Portfolio mode) | The rubric conflicts with the output spec. The rubric's Portfolio mode expects the labels *The product*, *My role*, *What I built*, *Results*, *Technologies*. `specs/outputs/portfolio.md` section 4 (the published structure, user's choice 2026-10-23) uses **Responsibilities** and **Technologies and frameworks**, and `portfolio.md` uses those labels on all 16 pages without exception. The portfolio follows the newer spec, so this is a rubric fix, not a portfolio fix. | Update the rubric's Portfolio mode to check "Responsibilities" and "Technologies and frameworks" (and the description, screenshots, no dates) per `specs/outputs/portfolio.md` section 4. | no |

Other checks that passed:
- **Spelling:** technology names are correct throughout ("Node.js", "TypeScript", "GitHub Actions", "PostgreSQL", "KendoReact", "TanStack Router", "oidc-client-ts", "Atlaskit", "SQLCipher", "LiveScript", "Bitrise").
- **US English:** no British spellings.
- **Filler words:** none from `checks.filler_words`.
- **Bold:** no bold except the labels.
- **Spacing:** no double spaces.
- **Final periods:** every technologies list ends with a period.
- **Section labels:** the same on every page.
- **Dates:** none, as the spec requires.
- **Generated captions:** these are alt text only and aren't printed. They mostly follow "<product>, <view>". The SYSPRO and Jira captions are full sentences, and five pages use "screen 1 ... 4". This is a minor difference and isn't raised.

## Decided (not raised again)
- The cover's LinkedIn handle "kyrylo-kohan" next to the name "Kirill Kohan" (portfolio.md:2, 6): keep-cv-name
- "more than 1,800 ERP menu items" and the level of SYSPRO platform detail (portfolio.md:29): keep-erp-programs-figure
- The AI agents "implemented and reviewed code against these specifications under human review" (portfolio.md:31): ai-agents-wording, sdd-not-vibe-coding
- "staking page loading went from 2 minutes to 5 seconds" (portfolio.md:123): keep-previous-cv-metrics
- Naming General Motors, HERE Technologies and the Itjet clients in titles (portfolio.md:40, 68, 220–376): portfolio-client-names, gm-project-names, itjet-client-names
- The Jira plugin and clinical trial app feature details with the clients hidden (portfolio.md:132–173): hidden-client-details-ok, hidden-clients
