---
schema_version: 1
rubric: layout
cv: portfolio/portfolio.md
job_ad: null
market: null
reviewed_at: 2026-10-24T10:14
verdict: pass-with-issues
score: 9.0
---

# Layout review

## Verdict
Both sizes build cleanly: 18 pages each, same page breaks, all template fonts embedded (`pdf-check-a4.md` and `pdf-check-letter.md` pass). Every project starts on its own page and fits it (SYSPRO uses two); no text, heading or image spills over. The trimmed HERE navigation app (page 5) and car navigation PoC (page 6) fit one page in both sizes, with room to spare on A4 and a small margin on Letter. The new clinical trial title wraps cleanly in both sizes. Only low-severity polish remains, mostly the same source-image issues as in the previous review (`reports/2026-10-23-1633/layout.md`). The title-wrap findings from that review (layout-1) are resolved.

## Per page
Inputs: `portfolio/preview/a4/page-1.png` to `page-18.png`, `portfolio/preview/letter/page-1.png` to `page-18.png`, both pdf-check files, `templates/portfolio-classic/style-map.yaml`.

| Page | A4 | Letter | Note |
|---|---|---|---|
| 1 Cover | ok | ok | One coral block: links line, "My Portfolio", "Kirill Kohan", white rules between rows. Nothing after it is shaded. |
| 2 SYSPRO (1/2) | ok | ok | 4 screenshots in 2 centered rows. A4 breaks mid-sentence in the SDD paragraph ("must / do and"), Letter breaks between the two Responsibilities paragraphs; both leave 3+ lines on each side. Title wraps as "...SYSPRO / (React 19, TypeScript)", so the parentheses stay whole. |
| 3 SYSPRO (2/2) | ok | ok | Rest of Responsibilities, then Technologies. Rest of the page is empty (accepted, `syspro-portfolio-two-pages`). |
| 4 General Motors | ok | ok | 4 phone screenshots in one row. Title on one line in both sizes. Letter is the fullest page: the last line of Technologies ends right at the bottom margin, with almost no slack (layout-6). A4 has about 0.7 in spare. |
| 5 HERE navigation app | ok | ok | Title wraps after "Technologies", with "(React Native, React, Node.js, Android)" whole on line 2, in both sizes. The intro, 2 landscape screenshots in one row (about 1.9 in tall), both Responsibilities paragraphs and Technologies all fit. Ends about 0.7 in above the margin on A4, about 0.8 in on Letter. Screenshot edge artifacts remain (layout-1). |
| 6 Car navigation PoC | ok | ok | A4 title wraps as "...for HERE Technologies / (Node.js, React)"; Letter has it on one line, and it nearly fills the line width but doesn't spill. The single tablet screenshot is centered and soft (layout-2). The text ends well above the bottom margin on both sizes (A4 about 0.4 in spare, Letter about 0.8 in), so the trim worked. |
| 7 Velas Wallet | ok | ok | Mobile and desktop screenshots in one row at the same height. "Velas Wallet" has a tight word space in the title on both sizes, which is a font kerning quirk. |
| 8 Jira plugin | ok | ok | 2 form screenshots print very small (layout-3). |
| 9 Clinical trial app (new title) | ok | ok | "Clinical trial app for Clinical Ink / (React Native, React, Android)": the parentheses are whole on line 2 in both sizes. 3 phone screenshots in one row. No spill. |
| 10 OMO Systems | ok | ok | Title wraps before "OMO Systems (React Native)" in both sizes. One centered phone screenshot. Letter text ends about 0.9 in above the margin. |
| 11 Dosimeter app | ok | ok | No screenshots; normal label gaps. |
| 12 Aspiration signup | ok | ok | 3 screenshots in one row. |
| 13 Aspiration banking | ok | ok | 3 screenshots in one row; the middle one is cut in the source file (layout-4). |
| 14 RegiStart | ok | ok | 4 screenshots fill the row; the 4th starts at the "Miron Yanovich" heading (layout-4). |
| 15 Fused | ok | ok | Two rows (4 phones, 2 web). Letter text ends close to the bottom margin (about 0.5 in spare). |
| 16 Wink | ok | ok | 4 phone screenshots in one row. |
| 17 Golfuture | ok | ok | 4 phone screenshots in one row. |
| 18 Oroscopo | ok | ok | 2 composite screenshots (3 phones each) fill the row (about 1.9 in tall). |

## Checks
- **Cover:** ok in both sizes.
- **Each project on its own page and fits:** ok. All 16 projects start at the top of a page; only SYSPRO runs to a second page.
- **Spill and orphans:** none. No title, label or image is alone at a page bottom; no heading is cut from its text.
- **Title wrapping:** no title breaks inside its parentheses. Titles that wrap (SYSPRO, HERE navigation, PoC on A4, clinical trial, OMO) break before the "(...)" group. The earlier "(React / Native)" and "(React Native, React, / Android)" splits are gone.
- **Images:** in rows, centered, same height within a row, at most 4 per row. Rows with a landscape screenshot are at least about 1.75 in tall (HERE about 1.9 in, SYSPRO and Fused web rows taller, Oroscopo about 1.9 in). No row is taller than 25% of the content height (Wink and Golfuture are the tallest, close to the limit). Nothing is upscaled.
- **Spacing:** the same in every project (title to text, text to image row, image row to Responsibilities, between paragraphs).
- **Fonts:** Rockwell Bold titles, Charter body, Avenir Next Medium labels, DIN Condensed cover links; all embedded.
- **Both sizes alike:** yes. Same page count and order; differences are only line wraps, the SYSPRO break and the PoC title.

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | low | portfolio.md:76 (HERE navigation screenshots); page 5, both sizes | The right screenshot (search panel) has a stray strip of another window at its bottom-left, and the left screenshot has a thin teal line along its bottom edge. Both are in the source image. | Recrop the source image or keep it as published. | yes |
| layout-2 | low | portfolio.md:96 (PoC tablet screenshot); page 6, both sizes | The image (732 x 483 px, taken from the 2025-09 PDF) prints soft, with blurred map labels. | Use the original head-unit screenshot if it exists. | yes |
| layout-3 | low | portfolio.md:138, 140 (Jira plugin screenshots); page 8, both sizes | The two form screenshots are about 179 x 460 px and print about 0.9 in wide; their text can't be read. | Swap in higher-resolution screenshots (about 450 px wide or more). | yes |
| layout-4 | low | portfolio.md:252 (Aspiration banking screen 2), 280 (RegiStart screen 4); pages 13 and 14, both sizes | Source-file cuts: Aspiration screen 2 ends inside the "Our Community" card; RegiStart screen 4 starts right at the "Miron Yanovich" heading. | Keep as published, or recrop from the originals. | yes |
| layout-5 | low | portfolio.md:18-24 (SYSPRO screenshots); page 2, both sizes | The full-window desktop screenshots shrink so far that menu and grid text can't be read; the purchase-order one is mostly pale grey. | Use tighter crops of the key area, or accept them as an overview. | yes |
| layout-6 | low | page 4 (General Motors), Letter | The last Technologies line ends right at the bottom margin, so any longer text or a font change would push it onto a new page. | If GM text grows, trim a sentence. No action now. | no |

## Decided (not raised again)
- SYSPRO runs to two pages (pages 2 and 3): `syspro-portfolio-two-pages`.
- Cover has no headline, location or phone line, and screenshots have no printed captions (output spec 4.1, 4.2 and 5).
- Client names, HERE Technologies and the PoC brand names in titles and text (content, not layout): `portfolio-client-names`, `gm-project-names`, `portfolio-poc-names-public`.
- Clinical trial page content and screenshot crops: `portfolio-clinical-page-kept`.
