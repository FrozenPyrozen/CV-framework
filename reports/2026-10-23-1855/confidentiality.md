---
schema_version: 1
rubric: confidentiality
cv: portfolio/portfolio.md
job_ad: null
market: null
reviewed_at: 2026-10-23T18:55
verdict: pass-with-issues
score: 8.5
---

# Confidentiality review (portfolio)

## Verdict
The built portfolio is safe to publish. It was checked with `npm run status` (ok) and built 2026-10-23 16:52 (A4 and Letter, 18 pages, `pdf-check-a4.md`: pass). No Section 9 term appears in the text, and neither hidden client (Clinical Ink, Velocity AI) is named in the Word text or the alt text. There are no colleague names and no phone number in the text. The only links are the profile's own GitHub and LinkedIn: the Word relationships hold only these two external targets, and the PDF metadata has only the title and creator (Pages), with no author. What a reader can see in the screenshots is test data, mockups or detail the user decided to keep (see *Decided*). Two low points remain: the debug build banners on the HERE and PoC screenshots, and a personal-looking Gmail address on a Fused screen.

Status of the 2026-10-23-1633 findings:
- confidentiality-1 (PoC names Volkswagen AG, Porsche, Hugo AI, Kurviger): **decided** (`portfolio-poc-names-public`).
- confidentiality-2 (Wink people and handles): **decided** (`portfolio-wink-mockups`).
- confidentiality-3 (clinical description and screenshots, code-editor fragments): **decided** (`portfolio-clinical-page-kept`).
- confidentiality-4 (OMO device IDs, Armed status): **decided** (`portfolio-screenshots-test-data`).
- confidentiality-5 (HERE internal components and structure): **decided** (`portfolio-here-detail-kept`).
- confidentiality-6 (Fused face photo and body data): **decided** (`portfolio-screenshots-test-data`).
- confidentiality-7 (DEBUG build banners): **still open**. Raised again below as confidentiality-1 (low).
- confidentiality-8 (Velas wallet balance and address): **decided** (`portfolio-screenshots-test-data`).
- confidentiality-9 (GM and Golfuture phone numbers, RegiStart names): **decided** (`portfolio-screenshots-test-data`).

## Hidden clients
- **Clinical Ink** (label "Clinical trial app under NDA", portfolio/portfolio.md:154-173): *possibly identifiable*, a risk the user accepted. No Section 9 term appears in the text, the alt text or the screenshots (preview page 9). The near-verbatim product description and the real app screens could still lead a determined reader to the client, but the user decided to keep the page as it is (`portfolio-clinical-page-kept`, `hidden-client-details-ok`). This is not raised again.
- **Velocity AI** (label "Jira design generation plugin under NDA", portfolio/portfolio.md:132-149): *safe*. The plugin name is covered in both screenshots (assets/designai-jira-plugin/form-image-attached.png, form-images-and-url.png), which show only placeholder content ("Image_Title.png", "www.website.com", "https://www.example.com"). "designai" appears only in local paths and HTML comments of portfolio.md, which the build doesn't carry over: the alt text of the built Word file doesn't contain it.
- **HERE Technologies' customer** (portfolio/portfolio.md:71): *safe*. "The customer works in package delivery" doesn't single out a company. The Houston street address and coordinates in image2.jpeg ("398 St Charles St", "29.753009, -95.347635") are a public test location.
- **General Motors, Volkswagen AG brands, Thermo Fisher Scientific, Itjet clients**: *named on purpose* (`portfolio-client-names`, `portfolio-poc-names-public`, `itjet-client-names`).

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| confidentiality-1 | low | portfolio/portfolio.md:74-76 and :96 (HERE navigation app image2.jpeg and image3.jpeg; car navigation PoC p04-1.png; preview pages 5-6) | The red debug banners are still visible in the top-right corner: "DEBUG \| 7.0.1+… \| 17:46…" (image2.jpeg) and "DEBUG \| v2 \| 10.x…" (p04-1.png). They show the internal build and version strings of two pages titled "under NDA". No decision covers them (`portfolio-here-detail-kept` covers the text about HERE components, not the screenshots). This was raised before as confidentiality-7. | Crop or blur the top-right banner in the three images, or record a decision to keep them. | no |
| confidentiality-2 | low | portfolio/portfolio.md:302 (Fused mobile app, screen 2, sources/media/portfolio-2025-09/p13-3.png "Settings"; preview page 15) | The settings mockup shows the account email "dima@gmail.com", which looks like a real person's (possibly a colleague's) Gmail address. The other emails are the client's own ("support@fusedsports.com") or placeholders ("myemailaccount@email.com", "test@gmail.com"). `portfolio-screenshots-test-data` covers the Fused photo and body data but doesn't mention this address. | Blur the address, or confirm it is test data and add it to `portfolio-screenshots-test-data`. | no |

## Decided (not raised again)
- PoC page names Volkswagen AG, Audi, Porsche, Hugo AI, Kurviger and the Porsche theme under an "under NDA" title: `portfolio-poc-names-public`.
- Wink screenshots (Sarah, "Joe Viola", "jviola29", chat avatars): `portfolio-wink-mockups`.
- Clinical trial description, screenshots and code-editor fragments at their edges: `portfolio-clinical-page-kept`, `hidden-client-details-ok`.
- OMO device IDs and "Armed" status, the Fused profile photo, "75 kg" and "August 1, 1991", the GM "+1 415 888 7666" and Golfuture "+1 (415) 786-9458" phone numbers, the RegiStart names ("Miron Yanovich", "Asap Rocky"), the Velas wallet balance and address: `portfolio-screenshots-test-data`.
- HERE components (HNod library, HERE bundler, HERE runner, HNav) and the project structure: `portfolio-here-detail-kept`.
- SYSPRO platform detail and screenshots (micro-frontends, OpenTelemetry redaction, "more than 1,800 ERP menu items", "AI Assistant", developer badges "PurchaseOrder panel", "basic", "Joined"): `keep-erp-programs-figure`. All images are confirmed public.
- Naming General Motors, Thermo Fisher Scientific and the Itjet clients under titles that still say "under NDA": `portfolio-client-names`, `itjet-client-names`.
- The HERE truck navigation app and the car navigation PoC as separate pages: `gm-project-names`.
- Empty Section 9 notes of the GM, Itjet, OMO, Thermo Fisher and Velas summaries: `keep-previous-cv-metrics`.
- Technologies lists that show the project's stack: `portfolio-tech-lists-project-stack`.
