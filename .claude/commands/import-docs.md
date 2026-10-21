---
description: Import old CVs or portfolios and fill gaps in the summaries from them
argument-hint: <file…>
---

Follow the `/import-docs` section of `agents/advisor.md` for the files given in the arguments, then `agents/composer.md` for the changed summaries. Imported documents have the lowest precedence (`specs/sources-spec.md` 3): they fill gaps and never override what the summaries, facts or git say. Stop and ask whenever the agent definition says to ask the user.

Arguments: $ARGUMENTS

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
