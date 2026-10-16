---
description: What is stale and why
argument-hint: [--ack <company>]
---

Run `npm run status -- <arguments>` and explain the result: for stale CVs, suggest the command that brings them up to date: when "entries to update" or "entries to rewrite in variants" is listed, `/compose` or `/variants` first (a plain build keeps them listed), otherwise `npm run build -- <file>` or `npm run build:all`; for sent CVs that changed, explain the warning and `--ack`.

Arguments: $ARGUMENTS

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
