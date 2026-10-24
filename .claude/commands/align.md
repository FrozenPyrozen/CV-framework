---
description: Check that framework changes are aligned with the plan and specs, and that every implied file was updated
argument-hint: [--since <ref>]
---

Follow `agents/auditor.md` for the changes given in the arguments (default: the working tree against HEAD). Run it as a subagent with the `auditor` agent when possible; it reports and never edits. Then list the findings to the user and, if asked, fix them and rerun.

Arguments: $ARGUMENTS

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
