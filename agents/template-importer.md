# Template importer

description: Turns a Word CV into a reusable template (templates/<name>/) by labeling its paragraph types, then test-builds the user's CV with it for approval.

**Follows:** `specs/templates.md`. **Never commits.** PDF input is not supported yet (planned after Word import); ask the user for a Word version, or say it's pending.

## Inputs
- A Word file (`.docx`) and a template name (lowercase-kebab, e.g. `modern-two-tone`)
- The user's master CV (for the test build)

## Rules
- **Only formatting is kept.** Someone else's name, contacts and text are never saved, and their file is never copied into the repo. (The user's own old CV may be kept as `templates/<name>/source.docx`.)
- The template is `approved: false` until the user approves the test build.

## Steps
1. **List the paragraphs.** `npm run template-import -- <file.docx> <name>`. It prints each paragraph's index, style, flags (list, drawing, tab) and text.
2. **Label the types.** Write `templates/<name>/import-map.yaml` (format: `templates/classic/import-map.yaml`):
   - `fonts` used by the template
   - `links` color and underline
   - per paragraph type, the index of one good sample: `name`, `headline`, `contact_line`, `section_heading`, `section_rule` (`keep: true` for a drawn line), `entry_title`, `entry_details` (`date_tab: true` when dates follow a tab), `bullet`, `body`, `section_intro`, `education_line`, `skills_line`
   - the required types: `name`, `contact_line`, `section_heading`, `entry_title`, `entry_details`, `bullet`, `body`
   - `jc`, `size` or `bold` only when a sample needs adjusting

   Prefer samples with direct formatting typical of the type. Skip decorative paragraphs that only add space.
3. **Build the template.** `npm run template-import -- <file.docx> <name> --map templates/<name>/import-map.yaml`.
4. **Check ATS risks.** Inspect the source file (paragraph listing, drawings, tables in the XML, header and footer) for multi-column layouts, text boxes holding text, layout tables, contact details only in the header or footer, icons instead of words, unusual fonts. Any of these: offer a one-column alternative.
5. **Test build, in a separate folder** (never overwrite the real CV's outputs). With `T=.cv-runs/template-test-<name>`:
   ```
   npm run render -- <master cv> --template <name> --out $T/test.docx
   npm run pdf -- $T/test.docx
   npm run pdf-check -- $T/test.pdf --md <master cv>
   npm run preview -- $T/test.pdf
   ```
   Repeat with the Ukraine market version (`cv/markets/ukraine/…_UA.md`) if it exists. Read `pdf-check.md` and look at every page in `$T/preview/` (alignment, spacing, orphaned headings, dates).
6. **Fix the look** with `templates/<name>/fixes.yaml` (fix types in `specs/templates.md` 3): bullet indentation, keep-with-next, date tab, bullet groups, per-type spacing, letter spacing (keep `letter_spacing: 1` for Pages: it prevents fi/fl ligatures that some PDF readers misread). Rebuild until it's clean.
7. **Write `templates/<name>/import-report.md`** in the spec's format: paragraph types found, ATS warnings, test build result.
8. **Ask for approval.**
   - Show the user every preview page (paths) and the PDF.
   - On approval: set `approved: true` and `approved_at` in `style-map.yaml`, and copy `$T/preview/page-1.png` to `templates/<name>/reference-preview.png`.
   - To use it: `template: <name>` in a role profile, or `default_template` in `framework.config.yaml` if the user wants it everywhere.
9. **Run `npm run validate`** (style map and fixes schemas) and `npm run index`.
