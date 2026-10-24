---
schema_version: 1
rubric: confidentiality
cv: portfolio/portfolio.md
job_ad: null
market: null
reviewed_at: 2026-10-24T10:14
verdict: pass-with-issues
score: 9.0
---

# Confidentiality review (portfolio)

## Verdict
The built portfolio is safe to publish; nothing blocks the public link. `npm run status` reports the portfolio as ok, built 2026-10-24 10:14 (A4 and Letter, 18 pages, `pdf-check-a4.md`: pass), and all 18 A4 preview pages were read. No Section 9 term without `allow_in: [portfolio]` appears in the built Word text (the PDF is built from it) or its alt text. That covers the HERE service, module, repo and theme names, the BEN-, WP3- and PSPOC- prefixes and the internal GitLab and Artifactory URLs. The only external links are the profile's own GitHub and LinkedIn. The rewritten HERE pages describe what was built in plain words ("guidance statistics", "core statistics service", "developer tools and their React diagnostic displays", "demo control panel", "driver warning cards"). None of these restates an internal service, module or repo name closely enough to identify it. One low point remains: the PoC page says the Kotlin reference app is for motorcycle navigation, which points to an unreleased internal HERE app.

Status of the two open screenshot items (open questions in `docs/open-items.md`, not raised again here):
- **DEBUG banners:** still visible. The red "DEBUG | 7.0.1+… | 17:46…" banner is in the top-right corner of both HERE navigation screenshots (`sources/media/portfolio-2025-04/image2.jpeg`, `image3.jpeg`; preview page 5). The "DEBUG | v2 | 10.x…" banner is on the PoC screenshot (`sources/media/portfolio-2025-09/p04-1.png`; preview page 6). They are small at page size but readable when zoomed in.
- **Fused email:** still visible. "dima@gmail.com" is at the top of the Fused settings screen (`sources/media/portfolio-2025-09/p13-3.png`; preview page 15, mobile screen 2).

## Hidden clients
- **Velocity AI** (title "Jira design generation plugin under NDA", portfolio/portfolio.md:138-155; preview page 8): *safe*. The client isn't named in the text, the alt text or the built Word file. The plugin name is covered in both screenshots, which show only placeholder content. "designai" appears only in local image paths and HTML comments, which the build doesn't carry over.
- **Clinical Ink** (portfolio/portfolio.md:160-179; preview page 9): *named on purpose* since 2026-10-24 (`hidden-clients`, `portfolio-client-names`). The other Section 9 terms of this summary (Orion, Lumiere, Centros Health, MPM HealthBook, AtHome, the OR- and ENGAGE- prefixes, "Clinical inc") don't appear in the text, the alt text or the three screenshots.
- **HERE Technologies' customer on the truck navigation page** (portfolio/portfolio.md:71): *safe*. "a package delivery company" with large-truck drivers doesn't single out one company, and the Section 9 names that could hint at one (AlexaModel, fs2-vp-alexa) don't appear. The Houston address and coordinates in image2.jpeg are a public test location.
- **Car brands on the PoC page** (portfolio/portfolio.md:95-107; preview page 6): Volkswagen AG, Audi, Porsche and Volkswagen are *named on purpose* (`portfolio-poc-names-public`). Bentley and Daimler (Section 9, not allowed) don't appear. "For a luxury car brand" (line 103) sits next to "Volkswagen AG cars (Audi, Porsche, Volkswagen and others)", so a reader could narrow the brand down to a few VW AG luxury brands. The wording is covered by decision `gm-features-public`, so it is listed under *Decided*.
- **General Motors, SYSPRO, OMO Systems, Velas, Thermo Fisher Scientific (not named; page titled "under NDA"), Itjet clients**: *named on purpose* or hidden more than required (`portfolio-client-names`, `itjet-client-names`).

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| confidentiality-1 | low | portfolio/portfolio.md:107 (Car navigation PoC for HERE Technologies, Responsibilities, paragraph 3; preview page 6) | "In a separate Kotlin reference app for motorcycle navigation, I built a curviness slider and screen orientation handling during guidance." The name is gone, but the wording still describes the internal app behind Section 9 terms "refappkotlin" and "HERE Moto HMI": an unreleased HERE motorcycle navigation app. No decision covers it (`portfolio-poc-names-public` allows Kurviger, not the motorcycle app). | Safer: "In a separate Kotlin reference app, I built a curviness slider and screen orientation handling during guidance." Or keep it and record a decision if the user confirms the motorcycle reference app is public. | yes |

## Decided (not raised again)
- "For a luxury car brand, I built a second screen for the passenger" (line 103), which a reader could narrow down within Volkswagen AG: `gm-features-public`.
- Volkswagen AG, Audi, Porsche, Hugo AI assistant, Kurviger, the Porsche theme and layout on the PoC page: `portfolio-poc-names-public`.
- HNav and HNod SDKs (TypeScript and Kotlin) on both HERE pages: `here-sdk-names-in-skills`, `portfolio-here-detail-kept`.
- HERE components and project structure on the truck navigation page (HNod library, HERE bundler, service packages, Android app): `portfolio-here-detail-kept`. "service-packages" carries `allow_in: [portfolio]` in the navigation-statistics summary.
- HERE Technologies named, with two separate pages: `gm-project-names`, `portfolio-client-names`.
- Clinical Ink named in the title, with its description and screenshots: `hidden-clients`, `portfolio-clinical-page-kept`, `hidden-client-details-ok`.
- Wink mockup people and handles: `portfolio-wink-mockups`.
- OMO device IDs, the Fused photo and body data, the GM and Golfuture phone numbers, the RegiStart names, the Velas wallet data: `portfolio-screenshots-test-data`.
- SYSPRO platform detail and "more than 1,800 ERP menu items": `keep-erp-programs-figure`.
- Technologies lists that show the project's stack (Kotlin, Jetpack Compose, gRPC on the HERE pages): `portfolio-tech-lists-project-stack`.
- DEBUG banners and the Fused "dima@gmail.com" address: open questions in `docs/open-items.md` (still visible, see *Verdict*).
