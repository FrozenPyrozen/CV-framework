---
description: Review a CV with the rubrics and write reports
argument-hint: [cv-file] [rubric…] [--jd <file>] [--market <id>] [--portfolio]
---

Follow `agents/reviewer.md`. Run one reviewer per rubric (all rubrics in `specs/rubrics/` by default), in parallel subagents when possible, into one `reports/<YYYY-MM-DD-HHmm>/` folder; always one report per rubric (per rubric and CV, `<rubric>-<cv>.md`, when the run covers several CVs). Each reviewer reads its `npm run review-context -- <cv> <rubric>` bundle instead of the individual files. To halve their shared reading, the orchestrator may run **ATS and HR for the same CV in one reviewer agent** (two bundles, two reports, `ats.md` and `hr.md`, or `ats-<cv>.md` and `hr-<cv>.md` in a multi-CV run; that agent keeps the default model, which HR needs). Model per rubric (tokens): **proofreading, layout and ats** are checklist work, so launch those reviewers with `model: sonnet`; **fact-check, confidentiality and hr** need judgment and keep the default model. "Would this CV pass an AI ATS?" is `/review ats`; "…and then HR?" is `/review hr`. `/review --portfolio` reviews the public portfolio (proofreading, fact-check, confidentiality, layout; the reviewer's *Portfolio mode*).

Arguments: $ARGUMENTS

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
