---
description: Whole new-repo flow: harvest, compose, variants, build, review
argument-hint: <repo-path | repo-name> [--resume]
---

Run the whole new-repo flow with progress saved in `.cv-runs/<run-id>/state.json` (stage, repo, summary id, pending approvals), so `--resume` continues the latest run:
1. `agents/harvester.md` (all steps). **Pause:** the user approves the summary diff.
2. `agents/composer.md`. **Pause:** the user approves the CV diff.
3. `/variants` (`agents/tailor.md`), then `npm run build:all`.
4. `/review` (`agents/reviewer.md`, all rubrics).
5. Finish with `npm run status` and the review verdicts.

Arguments: $ARGUMENTS

Read `AGENTS.md` first. Never commit. Don't use `cns:*` skills.
