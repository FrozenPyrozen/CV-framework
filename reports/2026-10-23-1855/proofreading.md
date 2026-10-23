---
schema_version: 1
rubric: proofreading
cv: portfolio/portfolio.md
job_ad: null
market: null
reviewed_at: 2026-10-23T18:55
verdict: pass-with-issues
score: 8.5
---

# Proofreading review

## Verdict
The text is clean: spelling and technology names are correct, US English throughout, no double spaces, every technologies list ends with a period, section labels are identical on all 16 pages. The published text was checked, not only the Markdown: the text of `Kirill_Kohan_Portfolio_A4.pdf` was extracted and every sentence of `portfolio.md` was found in it (the A4 and Letter PDFs have identical text; `pdf-check-a4.md` and `pdf-check-letter.md`: pass, 18 pages, fonts embedded). The PDFs are dated 16:52 and `portfolio.md` 17:29, but the text is the same, so the build is not stale for wording. One sentence is hard to read (proofreading-1); the rest is low-priority polish.

Earlier report `reports/2026-10-23-1633/proofreading.md` (reviewed fresh first, then compared):
- Fixed: old 3 (mostly; a small residue is proofreading-5), 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16.
- Decided: old 1 (`portfolio-aspiration-fossil-fuel`).
- Still open: old 2 (now only the title/text mismatch, proofreading-3), old 8 (proofreading-4), old 11 (proofreading-6).

Note: first person ("I built ...") is the portfolio's voice by design (spec section 4); not raised.

## Summary counts
| Area | Issues |
|---|---|
| Spelling | 0 |
| Grammar | 1 (proofreading-1) |
| Consistency | 3 (proofreading-3, proofreading-6, proofreading-8) |
| Style / duplicates | 4 (proofreading-2, proofreading-4, proofreading-5, proofreading-7) |

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| proofreading-1 | medium | portfolio.md:59 (GM car management app, Responsibilities, paragraph 2, sentence 2) | One 70-word sentence packs three changes into a list with a nested clause: "map instances no longer share a global ref, the map provider's global event listener, which caused bugs when several instances were running, became one listener per map, and the map logic moved from the reusable feature into the map provider." The commas make it unclear whether "the map provider's global event listener" renames "a global ref" or is a second item. | Split it: "Map instances no longer share a global ref. The map provider's global event listener, which caused bugs when several instances were running, became one listener per map. The map logic also moved from the reusable feature into the map provider." | no |
| proofreading-2 | low | portfolio.md:93 (car navigation PoC, description) | "latest" is used twice in one sentence: "showed the possibilities of the latest HERE technology ... and integrated the latest features". | "... showed the possibilities of new HERE technology in Volkswagen AG cars (...) and integrated features such as the Hugo AI assistant, ..." | no |
| proofreading-3 | low | portfolio.md:68 and 71 (HERE navigation app, title and description) (old 2) | The title says "for HERE Technologies" (decided: `gm-project-names`, `portfolio-client-names`), but the text says "The customer works in package delivery and builds on HERE solutions", so the customer is the delivery company and HERE the supplier. Only this mismatch is left. | "HERE's customer, a package delivery company, builds on HERE solutions (...)." | no |
| proofreading-4 | low | portfolio.md:181, 183 (OMO, description) (old 8) | Still open: video surveillance comes up twice ("Video surveillance: they watch buildings ..." and "video surveillance inside the apartment"), motion-sensor scenarios twice ("synced with motion sensors through scenarios", "starting a camera when a motion sensor detects movement"), the run-in labels ("Access to the apartment:", "Video surveillance:", "Security:") read like a flattened list, and "traffic monitoring" is unclear for a home. | Merge into two plain paragraphs, give the scenario example once, drop the labels; check what "traffic monitoring" meant. | yes |
| proofreading-5 | low | portfolio.md:211, 235, 341 (dosimeter, Aspiration signup, Wink: Responsibilities) (old 3 residue) | "reviewed code" ends the list on three pages ("I reviewed code and covered it ...", "and reviewed code.", "reviewed code and communicated directly with the customer"); "directly" with the customer appears twice (341, 367). | Keep "reviewed code" where it is the point (dosimeter) and cut or vary the others. | no |
| proofreading-6 | low | portfolio.md:40, 200, 294 (titles: GM car management app, dosimeter, Fused) (old 11) | Still open: "Automotive car management app" says the same thing twice; "IoT app with dosimeter under NDA" reads awkwardly; "Fused (web, mobile and backend)" is the only title without technologies. | "Car management app for General Motors (React Native)", "Dosimeter IoT app under NDA (React Native)", "Fused (React Native, React, Node.js)" via the summaries' `portfolio_title`. | no |
| proofreading-7 | low | portfolio.md:271 (RegiStart, description) | "distributing seniors among student organizers" is unclear to a general reader (high-school seniors). | "distributing high school seniors among student organizers" | no |
| proofreading-8 | low | portfolio.md:93, 135 (PoC and Jira plugin) | "PoC" is defined on both pages ("proof of concept (PoC)", "proof-of-concept (PoC)") and spelled two ways (with and without hyphens). | Use one form, "proof of concept (PoC)", in a noun position and "proof-of-concept" only as an adjective. | no |

Other checks that passed: US English, filler words (none), bold only on labels, final periods, no dates, one term per concept (domain-driven design, component-driven development (CDD), HERE bundler (gRPC), HECO, Atlassian Forge), descriptions all open with what the product is, no sentence fragments, captions are short alt text, intro does not copy the CV summary.

## Decided (not raised again)
- "investing in renewable energy sources and fossil fuel" (portfolio.md:223): portfolio-aspiration-fossil-fuel
- AI coding agents implementing and reviewing code under human review (portfolio.md:31): ai-agents-wording, sdd-not-vibe-coding
- Naming General Motors, HERE Technologies, Volkswagen AG and brands, Hugo AI, Kurviger, "under NDA" in titles, and the Itjet clients: portfolio-client-names, gm-project-names, portfolio-poc-names-public, itjet-client-names
- HERE components (HNod, HERE bundler, HERE runner, HNav) in the text and technologies: portfolio-here-detail-kept, portfolio-tech-lists-project-stack
- Clinical trial description kept: portfolio-clinical-page-kept
- Technologies such as PM2, Nginx, Apollo, AWS Amplify, Cognito only in lists: skills-only-in-skills-list
