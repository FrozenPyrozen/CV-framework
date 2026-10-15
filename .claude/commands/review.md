---
description: Review a CV with the rubrics and write reports
argument-hint: [cv-file] [rubric…] [--jd <file>] [--market <id>]
---

Follow `agents/reviewer.md`. Run one reviewer per rubric (all rubrics in `specs/rubrics/` by default), in parallel subagents when possible, into one `reports/<YYYY-MM-DD-HHmm>/` folder. "Would this CV pass an AI ATS?" is `--rubric ats`; "…and then HR?" is `hr`.

Arguments: $ARGUMENTS

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
