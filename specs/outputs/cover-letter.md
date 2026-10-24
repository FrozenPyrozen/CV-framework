# Cover Letter Spec

A cover letter for one job application, written from the same sources as the CV and built with the CV template. The cover-letter agent (`agents/cover-letter.md`) writes its text; `npm run cover-letter` writes the header and checks and builds it.

## Rules at a glance

The essentials, each stated in full in the section named.

- One letter per job ad, in that job's tailored folder next to its CV; there is no general or master letter (section 1).
- The header is generated from the profile and the market, exactly as on the CV; the agent writes only the body (section 2).
- Every body sentence ends with a `<!-- src: … -->` comment. A claim about you cites what the tailored CV cites; a statement about the company or the role cites `jd` (the job ad); your own reason for wanting the job cites `why` (your words, saved verbatim) (section 3).
- Nothing the tailored CV leaves out or the summaries hide: section 9 terms, hidden clients and unconfirmed numbers stay out (section 3).
- Written to pass screening software and read as a person wrote it: the exact job title and company up front, the job ad's required keywords where evidence supports them, no stock phrases (`checks.ai_tell_phrases`), varied sentences, one specific reason in your own words; within `checks.cover_letter_max_words` and one page (section 4).
- `npm run cover-letter -- check` must pass before `build`; the user reviews the letter before sending (sections 5, 6).

## 1. Inputs and place

- **Folder:** a job-specific CV folder, `cv/tailored/<company-role>/` (git-ignored, `specs/tailoring-spec.md` 6), made by `/tailor --jd` first. Its `job-description.md`, `jd-tags.yaml`, `cv.md` and `gap-report.md` are the inputs, with the summaries and `facts/`.
- **File:** `cover-letter.md` in that folder; the built files are `<Name>_Cover_Letter.docx`, `.pdf` and `cover-letter-check.md`, with page images in `preview/cover-letter/`.
- **Market:** the tailored CV's market (default market unless `--market`), so the header matches the CV that goes with it.

## 2. Format

```markdown
<!-- generated:header -->
# **Kirill Kohan**
**Senior React Native Engineer**
Kyiv, Ukraine (Remote) | …
+380 … | kiril.kohan@gmail.com | Portfolio: https://…
<!-- /generated:header -->

October 24, 2026

Dear Hiring Team at Example Corp,

<paragraph 1: the role and the one-line reason you fit> <!-- src: jd, … -->

<paragraph 2: the strongest matching evidence> <!-- src: … -->

<paragraph 3 (optional): a second strength or how you work> <!-- src: … -->

<paragraph 4: availability and a short close> <!-- src: profile -->

Sincerely,
Kirill Kohan
```

- **Generated:** the header block (`refresh`, the same lines as the CV header for that market and headline) and, when the file is created, the date line, a neutral greeting ("Dear Hiring Team,"), the closing and the name. The agent personalizes the greeting from the job ad (the company, or a person it names) and may change the date; the header is never edited by hand.
- **Body:** 3 or 4 paragraphs, no headings, no bullets. Markdown as in `specs/cv-spec.md` 9 (bold sparingly, no tables or links other than the header's).
- **Closing:** "Sincerely," (or "Best regards,") and the name, without sources.

## 3. Sources

- **Every body sentence** ends with its own `src` comment, as in `specs/cv-spec.md` 6. The greeting, the date and the closing need none.
- **About you:** contribution ids, summary sections, fact ids, `profile` and `calc:` values, as on the CV. Each cited entry must be shown in the tailored CV (an entry the CV dropped is a warning; a claim the CV doesn't support is a reviewer finding).
- **About the company or the role:** `jd`, meaning `job-description.md` in the folder. Paraphrase it; never invent the company's facts, products or values.
- **Why you want this job:** `why`, meaning `why.md` in the folder: one to three sentences in your own words, asked for by the agent and saved verbatim. The letter may shorten them but not change their meaning. Without `why.md` the letter has no motivation sentence beyond the job ad.
- **Numbers:** only those the CV may use (`specs/cv-spec.md` 3 and `specs/sources-spec.md` 4), never rounded up.
- **Confidentiality:** section 9 terms are blocked unless their `allow_in` lists `cover-letter`; hidden client names never appear; decisions in `facts/decisions.yaml` apply as for the CV.

## 4. Writing

- **Shape:** open with the exact job title and the company as the ad writes them, and the reason you fit; give two or three concrete matches between the job ad's requirements (`jd-tags.yaml` `required` first) and your evidence, each with a specific detail (a number, a product, a scale); add your own reason (`why`) where you have one; close with availability (`profile`) and one plain sentence asking for a conversation.
- **Screening software (ATS):** the job title and company in the first paragraph, the ad's required keywords in the words the ad uses wherever your evidence supports them (at least half of `required`; never one you can't back), selectable text and the header's contact details (the build guarantees both), no tables, columns or images.
- **Reads as written by a person:** none of `checks.ai_tell_phrases` (stock phrases such as "I am excited to", "proven track record", "seamless", "furthermore"); sentences of different lengths, short ones included; not every sentence starting with "I"; paragraphs starting differently; no balanced lists of three adjectives; concrete facts instead of praise for the company. The user reads it aloud before sending and rewrites anything that doesn't sound like them.
- **Voice:** first person ("I built…") is fine here, past tense for past work; plain words; no filler (`checks.filler_words`), no hype, no repeating the CV line by line.
- **Gaps:** don't claim a requirement the gap report lists as missing; you may say you are learning it only if a source says so.
- **Length:** at most `checks.cover_letter_max_words` words in the body, and one page when built.
- **Spelling:** US English, checked by the spell check with `facts/dictionary.txt`.

## 5. Checks (`npm run cover-letter -- check <dir>`)

Errors stop the build:
- the header differs from what `refresh` would write;
- a body sentence without a source, or a source that doesn't resolve (`jd` without `job-description.md` included);
- a section 9 term (not allowed in `cover-letter`), a hidden client name, a ticket id, an internal address or a secret;
- a forbidden character (`checks.forbidden_chars`), a `TODO`, or no body paragraph;
- a body over `checks.cover_letter_max_words`;
- a phrase from `checks.ai_tell_phrases`, or `why` without `why.md`;
- an unknown word in the spell check.

Warnings: a source whose entry the tailored CV doesn't show, filler words, spelling variants (`checks.spelling_variants`), fewer than 3 or more than 4 body paragraphs, a first paragraph that doesn't cite `jd`, fewer than half of the job ad's `required` keywords in the body, sentences of nearly the same length (six or more sentences), more than half of the sentences starting with "I", two paragraphs starting with the same word.

## 6. Build and review

- `npm run cover-letter -- build <dir> [--market <id>] [--no-pdf]` runs `refresh` and `check`, renders the Word file with the CV's template (`default_template`), exports the PDF through the same exporters as the CV, checks it (one page, the body text present) into `cover-letter-check.md`, and writes the page preview.
- **Review:** the agent rereads every sentence next to its source (as the fact-check rubric does) before handing it over; `/review` can't take a letter yet, so the agent reports the self-check instead. The user reads the letter and sends it with the CV; `/log-application` records the CV.
