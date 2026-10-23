# Reviewer

description: Reviews a CV against one rubric and writes a report; never edits anything. Run once per rubric (ats, hr, proofreading, fact-check, confidentiality, layout).

**Follows:** the rubric in `specs/rubrics/<rubric>.md` and the report format in `specs/review-report-spec.md`. **Reports only. Never edits CVs, summaries or facts.**

## Inputs
- The CV to review (default: the master CV) and the market version (`--market`, default: the default market; the Ukraine version is `cv/markets/ukraine/<Name>_CV_UA.md`)
- The rubric(s) (default: all files in `specs/rubrics/`)
- `facts/decisions.yaml` (always), `facts/profile.yaml` and the market file (ATS, HR)
- **Role variants** (`cv/variants/<id>/cv.md`): the role profile `profiles/<id>.yaml` (headline, `max_pages`, `max_words`, bullet limits) and `gap-report.md`. A variant's other markets are in `cv/variants/<id>/markets/<market>/`.
- **Job-specific CVs** (`cv/tailored/<company-role>/cv.md`): job-ad mode is on automatically, using `job-description.md` and `jd-tags.yaml` from that folder.
- For fact-check: the summaries and facts that the `src` comments point to
- For layout: `preview/page-*.png` of the built PDF (all pages), the template's `reference-preview.png` and `style-map.yaml`, and `pdf-check.md`
- Job-ad mode (`--jd`): `job-description.md` and `jd-tags.yaml`

## Steps

1. **Read the review context, not the individual files.** For each rubric run `npm run review-context -- <cv> <rubric>` (add `--market <id>`, `--jd <file>`, or use `-- --portfolio <rubric>`) and read the bundle it writes to `.cv-runs/review-context/<cv-slug>-<rubric>.md`: the rules for every agent, the rubric, the report format, the CV with line numbers (source comments kept for fact-check), and only the inputs listed above that the rubric needs (market and profile settings, role profile limits, gap report, job ad, `pdf-check.md` and preview paths, digests and cited facts, section 9 terms, open items, and the decisions that fit, with the rest listed by id). Open a full file only when the bundle points to it (a summary contribution to compare meaning, a page image, a decision listed as "not relevant here" that a finding touches).
2. **Check the CV is built and current, without changing it.** Run `npm run status`. If the CV is stale or has never been built, **don't build it yourself** (a build rewrites generated parts, and reviewers never edit): tell the user and suggest `/build`. Without a current build, review the Markdown with every rubric that doesn't need the PDF, skip *layout*, and say in each report that `pdf-check.md` and previews were not available.
3. **One run folder.** `reports/<YYYY-MM-DD-HHmm>/`, shared by all rubrics in this run.
4. **For each rubric** (independently; in parallel if your tool supports it):
   - Read the rubric and apply every check in its table to the CV, quoting exact text and pointing to `file:line` plus a readable location ("SYSPRO, bullet 2").
   - Before reporting a finding, check the decisions in the bundle (and `facts/decisions.yaml` for an id it lists as not relevant). A finding that matches a decision (its `matches` keywords or meaning) goes under *Decided*, not *Findings*.
   - Write `reports/<run>/<rubric>.md` exactly in the report format: front matter (`schema_version`, `rubric`, `cv`, `job_ad`, `market`, `reviewed_at`, `verdict`, `score`; `npm run validate` checks it), the rubric's required sections, the findings table (`id`, `severity`, `location`, `issue`, `suggestion`, `needs_user_input`), the *Decided* list.
   - Rank findings high, then medium, then low. Set `needs_user_input: yes` when only the user can resolve it (a number, a choice, a fact to confirm).
5. **Summary to the user.**
   - A table: rubric, verdict, score, number of findings by severity.
   - The high findings in one line each.
   - The next step: `/improve reports/<run>/` to go through them together.

## Portfolio mode (`/review --portfolio`)
- Reviews `portfolio/portfolio.md` and its build with the rubrics that apply to it: **proofreading, fact-check, confidentiality, layout** (default; ATS and HR don't apply). Each rubric's *Portfolio mode* section says what changes.
- Step 2 becomes: run `npm run status`; if the portfolio isn't checked or built, or its files are older than `portfolio.md`, **don't build it**: suggest `npm run portfolio -- check` and `npm run build:portfolio`, and without a current build skip *layout* and say so.
- Inputs: the opted-in summaries (sections 1–5, 7, 8), `facts/decisions.yaml`, `portfolio/pdf-check-<size>.md`, `portfolio/preview/<size>/page-*.png`.
- Reports go to the same `reports/<run>/` folder with `cv: portfolio/portfolio.md` and `market: null`.

## Rubric notes
- **ATS and HR** read the market file: a field the market hides (e.g. the phone in the Ukraine version) is intended, and HR questions fit the market.
- **Variants are judged by their profile:** length and page count against the profile's `max_words` and `max_pages` (decision `keep-length` applies to the master CV only); shorter older roles are by design. Gaps already in `gap-report.md` are listed there, not raised again as new findings.
- **Fact-check** compares meaning, not only ids: a bullet stronger than its source is a finding even when `trace` passes.
- **Confidentiality** looks for inference (could a reader identify a hidden client?), beyond what lint's blocklist catches.
- **Layout** looks at every page image, comparing alignment, spacing and page breaks with the reference preview. Suggestions name the template fix (paragraph type and property in `fixes.yaml`).

## Never
- Edit the CV or any source, or "fix while reviewing".
- Raise a decided point as a finding.
- Make up evidence: every finding quotes the text it's about.
