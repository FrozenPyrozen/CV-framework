# Sources Spec

Status: v1 · Applies to: `sources/`, written by `npm run import-doc` and `/import-docs`

Old CVs, portfolios and similar documents often say more about past jobs than the summaries do. They can be imported as **sources**: kept in the repo, turned into text, and used to fill gaps in summaries. They never replace what the framework already holds.

## 1. Layout

```
sources/
├── index.yaml          # one entry per document (section 2)
├── files/<id>.<ext>    # the original file, unchanged
├── text/<id>.md        # its text, extracted by import-doc (never edited by hand)
└── media/<id>/         # images extracted from the document (.pages), linked from its text
```

The originals are private and stay in the private repo, in git, like `facts/` and `summaries/`.

## 2. `sources/index.yaml`

```yaml
schema_version: 1
documents:
  - id: cv-2021-06               # lowercase-kebab, never changes (summaries cite doc:<id>)
    kind: cv                     # cv | portfolio | other
    date: 2021-06                # when the document was written: YYYY-MM or YYYY
    title: CV, June 2021
    file: sources/files/cv-2021-06.docx
    text: sources/text/cv-2021-06.md
    sha256: "…"                  # of the original; validate checks it
    imported_at: 2026-10-21
    status: imported             # imported | reviewed (every proposal from it went through with the user)
    media: sources/media/cv-2021-06   # optional: extracted images
    original_sha256: "…"         # only after a lossless recompression (section 6): the imported file's hash
    recompressed: 2026-10-25     # and when
```

Accepted files: `.docx`, `.pdf`, `.md`, `.txt`, and `.pages` on macOS with Pages: Pages exports it to Word, and pandoc (when installed) turns that into Markdown with headings, lists, links, captions and images (`media/<id>/`, listed as `media:` in the index). Other formats (`.doc`, `.pptx`, `.key`) are exported to PDF first. The same file (by `sha256`) is imported only once.

## 3. Precedence

When sources disagree, the higher one wins:

1. **The user**: answers and `facts/confirmed.yaml` (source `user`).
2. **git**: harvested summaries (source `git`).
3. **The current originals**: the summaries as they are, including those built from the current CV (source `cv`, "previous CV").
4. **Imported documents** (`doc:<id>`), the newer `date` first.

So a document **only fills gaps**. It never overrides 1–3, and an older document never overrides a newer one.

## 4. What a document may add

Everything goes through the user, one summary at a time (`/import-docs`, `agents/advisor.md`), and is marked with its document:

| Gap | What is added |
|---|---|
| A section that is `TODO (needs user input)` (overview, features, role, technologies, portfolio material) | text in your own words, ending with `(doc:<id>)` |
| A piece of work no contribution covers | a new contribution with the next free number and a `Source: doc:<id>` line after `Tags:` |
| A number | a section 7 line with source `doc:<id>` and its confidence. **The CV uses it only after the user confirms it** (`doc:<id>, confirmed by user <date>`) |
| A job no summary covers | a new summary, `source: cv`, every contribution with `Source: doc:<id>`, and `show_in_cv: false` until the user decides (the current CV may have left it out on purpose) |

## 5. Conflicts

A document that disagrees with a higher source (dates, titles, team sizes, numbers, technologies, scope) is **listed, not applied**. The current value stays unless the user says the document is right. The change is then made as a user answer (source `user`, with a confirmed fact where the CV needs one), not as `doc:<id>`.

## 6. Rules

- `doc:<id>` references (contribution `Source:` lines, section 7, section texts, `facts/confirmed.yaml` `source`) must name a document in `index.yaml`. `validate` checks this, and also that each file exists and matches its `sha256`. They may also appear in `portfolio/portfolio.md` source comments, which `npm run portfolio -- check` checks the same way.
- Text kept from a published portfolio may cite that document directly in `portfolio/portfolio.md` (`<!-- src: doc:<id> -->`, `specs/outputs/portfolio.md` 4); numbers still follow section 4 (used only once confirmed).
- Text from documents is still written in your own words in summaries, with the same writing rules (`work-summary-spec.md` 5). Internal names found in a document go to the summary's section 9.
- The extracted text is regenerated, never edited. To correct a document, import a new version under a new id.
- **Lossless recompression.** To save space, an original (and the images in its `media/` folder) may be recompressed without losing anything: every image stays identical pixel for pixel with the same color profile (e.g. uncompressed TIFF re-saved as LZW TIFF), the file keeps its format, names and structure (for `.pages`, the same entries in the same order, stored the same way), and extracting it gives exactly the same text and images. The entry keeps its id, its `sha256` becomes the new file's, `original_sha256` keeps the imported file's (import-doc still refuses that file as already imported) and `recompressed` says when. Anything lossy is a new version: import it under a new id.
