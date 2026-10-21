---
description: Write a self-contained prompt to harvest a repo on another machine (portable harvest)
argument-hint: [--merge <id>] [--out <file>]
---

Portable harvest, step 1 (`specs/work-summary-spec.md` 9, plan 9c): for a repo that can't come to this laptop.

1. Run `npm run harvest-prompt -- $ARGUMENTS`. With `--merge <id>` the prompt extends an existing summary; ask the user which one if they mean an existing job.
2. Tell the user where the prompt is and what to do with it:
   - open the repo on the other machine and give the prompt to any AI agent tool there;
   - review the `<id>.md` it writes before it leaves that machine, and follow the employer's rules on what may leave (section 9 may stay `TODO (needs user input)`);
   - bring the file back and run `/import-summary <file>`.
3. Don't edit the generated prompt; if the spec or tag list changes, generate it again.

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
