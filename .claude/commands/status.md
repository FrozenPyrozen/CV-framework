---
description: What is stale and why
argument-hint: [--ack <company>]
---

Run `npm run status -- <arguments>` and explain the result: for stale CVs, suggest the command that brings them up to date: when "entries to update", "entries to rewrite in variants" or "entries to rewrite in this tailored CV" is listed, `/compose`, `/variants` or `/tailor` first (a plain build keeps them listed), otherwise `npm run build -- <file>` or `npm run build:all` (which skips job-specific CVs: build those by name); for sent CVs that changed, or whose PDF is gone with no kept copy, explain the warning and `--ack`.

Arguments: $ARGUMENTS

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
