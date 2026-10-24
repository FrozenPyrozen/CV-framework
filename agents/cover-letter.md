# Cover letter

description: Writes a cover letter for one job ad (cv/tailored/<company-role>/cover-letter.md) from the same sources as its tailored CV, with a source on every sentence; a script writes the header, checks and builds it.

**Never commits.**

## Read first
- `AGENTS.md` (rules for every agent)
- `specs/outputs/cover-letter.md` 1–6 (place, format, sources, writing, checks, build), after its *Rules at a glance*
- `specs/cv-spec.md` 3–4 (bullets and writing style: numbers, bold, acronyms, plain words), after its *Rules at a glance*

Open other sections only when a step points there: `specs/cv-spec.md` 6 (what counts as a source) and 11 (confidentiality); `specs/tailoring-spec.md` 5 (the gap report); `specs/sources-spec.md` 4 (numbers from imported documents).

## Inputs
- A job folder `cv/tailored/<company-role>/` with `job-description.md`, `jd-tags.yaml`, `cv.md` and `gap-report.md` (made by `/tailor --jd`; if it doesn't exist, run `/tailor` first or ask the user for the job ad)
- Optional: the person to address, and anything the user wants stressed (only claims with a source can go in)
- The summaries, `facts/` and `facts/decisions.yaml`

## Output
- `cover-letter.md` in the job folder, then its Word file, PDF, `cover-letter-check.md` and page preview; a short report.

## Steps

1. **Prepare.** `npm run cover-letter -- refresh <dir>` (add `--market <id>` when the tailored CV was built for another market). It writes the generated header and, the first time, a skeleton with the date, "Dear Hiring Team,", the closing and the name. **Never edit the header.**
2. **Read the job.** From `job-description.md` and `jd-tags.yaml` take the exact job title, the company, what it does, and the `required` requirements in order, in the ad's own words. From `gap-report.md` take the strong evidence and the gaps.
   - **Ask the user one question:** why this company or role, in a sentence or two of their own (suggest angles from the ad, but don't write it for them). Save the answer verbatim to `why.md` in the folder; the letter cites it as `why`. If the user skips, the letter does without a motivation sentence.
3. **Pick the evidence.** For the two or three most important requirements, find the bullets of the tailored `cv.md` that prove them, and their `src` ids. Prefer evidence with a number, and the current or most recent job. Don't use an entry the tailored CV leaves out, a requirement listed under weak or missing evidence, or a number the CV may not use.
4. **Write the body**, 3 or 4 paragraphs, one source comment after every sentence:
   - **Paragraph 1:** the exact job title and company (`jd`), and the one-line reason you fit (cite the evidence).
   - **Paragraphs 2 and 3:** the matches, as results ("I built…, which…"), each with one specific detail, not a copy of the CV bullets. Use the ad's required keywords where the evidence supports them. Put the user's `why` where it fits best.
   - **Last paragraph:** availability and working setup (`profile`), and one sentence asking for a conversation.
   - Write it as a person would (`specs/outputs/cover-letter.md` 4): first person, plain words, no phrase from `checks.ai_tell_phrases` or `checks.filler_words`, sentences of different lengths, not every sentence starting with "I"; within `checks.cover_letter_max_words`.
   - Personalize the greeting when the job ad names the company or a person ("Dear Hiring Team at Acme," / "Dear Ms. Smith,").
5. **Self-check against the sources.** Reread every sentence next to the contribution, fact or job-ad passage its `src` cites, as the fact-check rubric does; fix any verb or scope stronger than the source. Check names against the summaries' section 9 and decisions (hidden clients stay hidden).
6. **Check and build.** `npm run cover-letter -- check <dir>` until it reports 0 errors (fix warnings or say why they stay), then `npm run cover-letter -- build <dir>`. It must be one page; if not, shorten.
7. **Report:** ask the user to read the letter aloud and change anything that doesn't sound like them (re-run `check` and `build` after); then report the letter's text, the evidence used per requirement, any requirement left out on purpose (a gap), the check result, and the paths of the PDF and preview. Remind the user the folder is git-ignored (`git add -f` to keep it, `npm run backup`), and that `/log-application` records the CV sent with it.

**Spelling:** `check` runs the spell check. Fix a flagged typo; add a real word (name, product, technology) to `facts/dictionary.txt` and say so in the report.

## Never
- Claim anything without a source, claim more than the source, or add a number the CV may not use.
- Invent the company's facts, products, values or the hiring manager's name; only what the job ad says.
- Edit the header, the tailored CV or the job ad, or write a letter for a job that has no job ad.
