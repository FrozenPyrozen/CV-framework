# Templates Spec

Status: v1 · Applies to: `templates/<name>/`, `npm run template-import`, `/import-template`, `npm run render`

A template defines how a CV looks in Word and PDF. Content always comes from the CV Markdown, and the template contributes only formatting.

## 1. Folder

```
templates/<name>/
├── source.docx           # optional: the original file, only for your own CVs (never someone else's)
├── template.docx         # formatting only: styles, numbering, page setup, header/footer, one sample of each paragraph type, no CV content
├── style-map.yaml        # how each Markdown element maps to the template
├── fixes.yaml            # renderer fixes for this template
├── reference-preview.png # the approved look of page 1, used by the layout reviewer
└── import-report.md      # findings from the import
```

`<name>` is lowercase-kebab (e.g. `classic`, `modern-two-tone`).

## 2. `style-map.yaml`

Templates often use direct formatting (font size and color on each piece of text, lines drawn as shapes) rather than Word styles. So the map stores a **sample paragraph** for each paragraph type, which the renderer copies and fills. A named style is used only when the template really has one.

```yaml
schema_version: 1
name: classic
approved: true                     # set only after the user confirms the test build
page: { size: letter, margins_twips: { top: 580, bottom: 280, left: 720, right: 720 } }
fonts: [Cambria, Arial]            # every font the template uses; checked by doctor and pdf-check
paragraphs:                        # Markdown element -> sample paragraph in template.docx
  name:           { sample: p-name }
  headline:       { sample: p-headline }
  contact_line:   { sample: p-contact }
  section_heading:{ sample: p-h1, followed_by: p-h1-rule }   # heading plus its drawn line
  entry_title:    { sample: p-h2 }
  entry_details:  { sample: p-h3, date_tab: true }           # dates after a tab stop
  bullet:         { sample: p-bullet, bold_runs: true }
  body:           { sample: p-body }
  section_intro:  { sample: p-body }
  education_line: { sample: p-edu }
  skills_line:    { sample: p-body, label_bold: true }
links: { color: "1155cc", underline: true }
```

Sample ids are bookmarks or marked paragraphs in `template.docx`, created by the importer.

## 3. `fixes.yaml`

Known rendering problems of a template, applied by the renderer after filling. Each fix records why it exists:

```yaml
- id: bullet-indent-pages
  why: "The original bullet indent (163/105 twips, tab at 162) renders with text pushed about 0.6 inch right in Pages."
  found: 2026-10-15
  set:
    bullet: { indent_left: 284, hanging: 226, tab: { type: num, pos: 284 } }
```

## 4. Import (`/import-template <file> <name>`)

| Input | Method |
|---|---|
| Word (`.docx`) | Read styles, numbering, paragraph properties and drawings. The template-importer agent labels each paragraph's type from its text and a preview. Keep one sample per type, remove all other content. |
| PDF | Extract fonts, sizes, colors, positions, margins and line spacing with `pdfjs-dist`. The agent compares them with a page preview, and the template is rebuilt as a new Word file with the `docx` npm package. Fine details may differ, and `import-report.md` lists them. |

### Rules

1. **Only formatting is kept.** Someone else's name, contacts and text are never saved, and their file is never copied into the repo. (Your own old CV may be kept as `source.docx`.)
2. **ATS warnings** in `import-report.md`: multi-column layouts, text boxes, layout tables, contact details only in header or footer, icons instead of words, image-only text, unusual fonts. When any apply, a one-column variant is offered.
3. **Fonts** are listed in `style-map.yaml`. `doctor` checks them by exporting a test PDF and reading which fonts are embedded.
4. **Test build:** the master CV is built with the new template and previewed (all pages). The user approves, then `approved: true` is set and `reference-preview.png` saved.
5. An unapproved template can be built with `--template <name>`, but `build:all` refuses it.

### `import-report.md` format

```markdown
# Import report: <name>
Source: <file name only> (Word | PDF) · Imported: <date>

## Paragraph types found
| Type | Sample | Notes |

## ATS warnings
- <warning>: <why it matters> -> <what the one-column variant does instead>

## Not copied exactly (PDF imports)
- <detail>

## Test build
Pages: N · pdf-check: pass/fail · Preview: preview/page-1.png …
```

## 5. Rendering rules

- Every Markdown element in the supported subset (`cv-spec.md` section 9) maps to one paragraph type. Anything unmapped fails the render with the element name.
- Hyperlinks are created as new link entries from the URLs in the Markdown (and `profile.yaml`), never by reusing the template's own link ids.
- Bold Markdown becomes bold text in the same font, size and color as the sample.
- Dates in entry detail lines go after the sample's tab stop.
- `fixes.yaml` is applied last.
- The current template, `classic`, is created in build step 5 by importing `templates/classic/source.docx` (your previous CV). Rebuilding today's CV with it must match today's Word file.
