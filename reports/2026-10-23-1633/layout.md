---
schema_version: 1
rubric: layout
cv: portfolio/portfolio.md
job_ad: null
market: null
reviewed_at: 2026-10-23T16:35
verdict: pass-with-issues
score: 8.5
---

# Layout review

## Verdict
Both sizes build cleanly and look the same: 18 pages each, the same page breaks, every template font embedded (`pdf-check-a4.md` and `pdf-check-letter.md` both pass), and every project starts on a new page with the same spacing. No labels, titles or images are left alone at a page bottom. The findings are all low-severity polish. Three project titles wrap inside their technology parentheses, and some screenshots are hard to read or come pre-cropped from the source files. The build is current: `portfolio.md` was saved at 16:33:18, the PDFs and previews were built at 16:33:29 to 16:33:38, and `npm run status` reports `ok portfolio/portfolio.md`.

## Per page
Inputs: `portfolio/preview/a4/page-1.png` to `page-18.png`, `portfolio/preview/letter/page-1.png` to `page-18.png`, `portfolio/pdf-check-a4.md`, `portfolio/pdf-check-letter.md`, and `templates/portfolio-classic/style-map.yaml` (approved 2026-10-23). The template has no `reference-preview.png`, so I compared the pages with output spec 5a and with each other.

| Page | A4 | Letter | Note |
|---|---|---|---|
| 1 Cover | ok | ok | The coral banner is one block: links line, then "My Portfolio", then "Kirill Kohan", with white rules between the rows. There's no headline or intro under it, as output spec section 4.1 says. The links sit inside the banner and aren't clipped. |
| 2 SYSPRO (1/2) | ok | ok | The 4 screenshots sit in 2 centered rows of equal height. The screenshot text is very small (layout-3). On A4 the page breaks inside the SDD paragraph ("what the component must / do"); on Letter it breaks between the two Responsibilities paragraphs. The user accepted that SYSPRO runs to 2 pages, and both breaks keep at least two lines on each side. |
| 3 SYSPRO (2/2) | ok | ok | The rest of Responsibilities, then Technologies. The rest of the page is empty, which is accepted. |
| 4 General Motors | ok | issues | The 4 phone screenshots sit in one row. On Letter the title wraps as "…General Motors (React / Native)" (layout-1). This is the fullest page, and it still fits above the bottom margin. |
| 5 HERE navigation | issues | issues | The title wraps after "for HERE" in both sizes (layout-1). The 2 landscape screenshots fill one row. The right screenshot has a stray strip at its bottom-left corner that comes from the source file (layout-5). |
| 6 Car navigation PoC | issues | issues | The single tablet screenshot is centered but soft (layout-4). |
| 7 Velas Wallet | ok | ok | The mobile and desktop screenshots share one row at the same height. |
| 8 Jira plugin | issues | issues | The 2 form screenshots print very small, and their text can't be read (layout-2). |
| 9 Clinical trial app | issues | ok | On A4 the title wraps as "(React Native, React, / Android)" (layout-1). On Letter it fits on one line. The 3 phone screenshots sit in one row. |
| 10 OMO Systems | ok | ok | Two description paragraphs, then one centered phone screenshot. |
| 11 Dosimeter app | ok | ok | No public screenshots, so Responsibilities follows the description with the normal label gap. |
| 12 Aspiration signup | ok | ok | 3 screenshots in one row. |
| 13 Aspiration banking | issues | issues | The middle screenshot ends partway through the "Our Community" card. That cut is in the source file (layout-5). |
| 14 RegiStart | issues | issues | 4 screenshots fill the row. The 4th one starts right at the "Miron Yanovich" heading with no top margin, a cut that is also in the source file (layout-5). |
| 15 Fused | ok | ok | Two rows: 4 phone screenshots, then 2 web screenshots. Spacing matches the other pages. |
| 16 Wink | ok | ok | 4 phone screenshots in one row. |
| 17 Golfuture | ok | ok | 4 phone screenshots in one row. |
| 18 Oroscopo | ok | ok | 2 composite screenshots (3 phones each) fill the row. |

## Checks
- **Cover:** ok in both sizes.
- **Each project on a new page:** ok. All 16 projects start at the top of a page in both sizes. There is no skills overview, as output spec section 4.3 says.
- **Orphans:** none. No title, "Responsibilities" or "Technologies and frameworks" label or image row is alone at a page bottom (`keepNext` on `project_title`, `section_label` and `image` works).
- **Images:** all are centered and kept within the margins, and every image in a row has the same height. The renderer upscales nothing: the smallest effective resolution is about 150 dpi (Velas desktop). Captions are alt text only, as output spec 4.2 says. Softness and cuts come from the source files (layout-2 to layout-5).
- **Spacing:** the same everywhere: title to description, description to image row (about 0.17 in), image row to "Responsibilities" (about 0.35 in), and the gap between body paragraphs.
- **Fonts:** Rockwell Bold for titles, Charter for body text, Avenir Next Medium for labels and DIN Condensed on the cover links. All are embedded, and none is substituted.
- **Both sizes alike:** yes. The page count and project order are the same. The only differences are line wraps: the SYSPRO page break, the GM and clinical-trial title wraps, and more words per line on Letter.

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| layout-1 | low | portfolio.md:12, 40, 68, 154 (project titles); Letter page 4, A4 page 9, both sizes pages 2 and 5 | Project titles wrap inside the technology parentheses and leave a short second line: "Automotive car management app for General Motors (React / Native)" (Letter p.4), "Clinical trial app under NDA (React Native, React, / Android)" (A4 p.9), "Schema-driven ERP web platform for SYSPRO (React 19, / TypeScript)" (both sizes, p.2). The HERE title breaks "…for HERE / Technologies (…)" (both sizes, p.5). The parenthetical splits differently between sizes. | Keep the technology list together. Have the renderer or the `refresh` title writer join the words inside "( … )" with non-breaking spaces, so that the whole "(…)" moves to line 2 when the title doesn't fit. Alternatively, lower `project_title` `size` in `scripts/portfolio-template.ts` from 32 to 30 half-points (15 pt), then rerun `npm run portfolio-template` and `npm run build:portfolio`. | no |
| layout-2 | low | portfolio.md:138, 140 (Jira plugin screenshots); page 8, both sizes | `form-image-attached.png` and `form-images-and-url.png` are only 179 x 460 px, so they print at about 0.9 in wide. The form text ("Description", "Images", "URL") can't be read, and the narrow row leaves most of the content width empty. | This is a source material issue, not a template one. If the user has them, swap in higher-resolution form screenshots (at least about 450 px wide) in section 8 of the Jira plugin summary, with the plugin name still covered. | yes |
| layout-3 | low | portfolio.md:18-24 (SYSPRO screenshots); page 2, both sizes | The 4 full-window desktop screenshots (3456 x 1724 px and similar) are shrunk to fit 2 rows, so the menu, grid and form labels are too small to read on paper or at 100% zoom. The purchase-order screenshot is mostly pale grey. | Use tighter crops of the important area: the program menu with search, one grid with filters, one rendered form. Add them as public items in section 8 of `summaries/syspro-saas-erp.md`, or keep the full screenshots and accept them as an overview. | yes |
| layout-4 | low | portfolio.md:96 (car navigation PoC screenshot); page 6, both sizes | `p04-1.png` (732 x 483 px, taken from the 2025-09 PDF) prints at about 3.8 in wide and looks soft, with blurred map labels. The renderer doesn't upscale it (about 190 dpi), so the blur is in the source. | If the user has the original head-unit screenshot, use it in place of the copy taken from the PDF. | yes |
| layout-5 | low | portfolio.md:252 (Aspiration banking, screen 2), 280 (RegiStart, screen 4), 76 (HERE, search); pages 13, 14, 5, both sizes | Some screenshots are cut in the source files, so on the page they look clipped. Aspiration banking screen 2 ends in the middle of the "Our Community" card. RegiStart screen 4 starts right at the "Miron Yanovich" heading with no top margin. The HERE search screenshot has a stray strip of another window at its bottom-left. The renderer doesn't crop images; the cuts are in `p11-3.png`, `p12-7.png` and `image3.jpeg`. These are the same cuts the published 2025-09 portfolio shows. | Either keep them as published, or recrop them from the originals if the user has them. | yes |

## Decided (not raised again)
- The SYSPRO project runs to 2 pages (pages 2 and 3), longer than output spec section 4's "each page fits one page" target. The user accepted this in the request for this run. It isn't in `facts/decisions.yaml` yet, so consider recording it.
- The cover has no headline, location or phone line. This is set by output spec section 4.1 ("No headline, location or phone"), which overrides the rubric's older "headline under the banner" wording.
- No printed captions under the screenshots. This is set by output spec sections 4.2 and 5 (captions only as alt text).
- "under NDA" and the client names in the titles: `portfolio-client-names`, `gm-project-names` (content, not layout).
