# Alignment Spec

How a change to the framework is checked for being aligned: the code does what the specs say, the plan describes what exists, and every file the change touches by implication was updated too. It applies to framework changes (scripts, specs, agents, commands, schemas, config, templates, markets, profiles, docs), not to CV content. The auditor agent (`agents/auditor.md`) and `/align` follow it.

## Rules at a glance

The essentials, each stated in full in the section named.

- Every framework change ends with an alignment check before it is handed back: the deterministic checks first, then a judgment of meaning only where they can't see (section 1).
- The deterministic checks are `npm run doc-check`, `npm run index -- --check` and `npm run impact`; `npm run verify` runs all three (section 2).
- `impact` enforces the impact map: what a new script, agent, command, spec or config key requires, and that a framework change has its changelog row (section 3).
- The auditor judges what scripts can't: whether behavior matches the spec text, whether the plan's status, *Rules at a glance*, *Read first* lists and decisions in force are still true (section 4).
- The auditor never edits; it writes a report with every gap as a finding and the fix it suggests (section 5).

## 1. When

- **After every framework change,** before handing back: `npm run verify` (it includes the deterministic checks). For a change to a spec, an agent, a command or a script's behavior, also `/align` for the judgment.
- **On request** ("are plan, specs and logic aligned?"): `/align --since <ref>` over the commits in question, deterministic checks first.
- Alignment is checked against the files on disk and git history; nothing is taken from an AI tool's memory.

## 2. Two layers

| Layer | Checks | Catches |
|---|---|---|
| Deterministic | `npm run doc-check` (`docs/scripts.md`) | an npm script without its row, flags a script doesn't handle, unknown or drifted config keys and values, missing repo paths, section numbers that don't exist |
| | `npm run index -- --check` | the AGENTS.md registry out of date (agents, rubrics, profiles, markets, templates, output specs) |
| | `npm run impact [--since <ref>]` | a change without the co-changes it requires (section 3) |
| Judgment | the auditor (`/align`) | behavior that contradicts a spec, a plan that no longer describes the system, stale summaries of rules, missing scenarios (section 4) |

The judgment never re-checks what a script already checks; it starts from their output.

## 3. Impact map (`npm run impact`)

For the files changed since the base (the working tree against `HEAD` by default; `--since <ref>` for a range, untracked files counted as added):

| Rule | When | Required | Level |
|---|---|---|---|
| I1 | any framework file changed (scripts, specs, agents, Claude agents and commands, schemas, templates, markets, profiles, `framework.config.yaml`, `package.json`, AGENTS.md, CLAUDE.md, the plan, scripts, workflows and acceptance docs) | a table row added to `docs/changelog.md` (editing an old row doesn't count) | error |
| I2 | a new `scripts/<name>.ts` | a `package.json` script that runs it, and `tests/<name>.test.ts` | error |
| I3 | a changed script and no changed test | a test for the new behavior | warning |
| I4 | a new `agents/<name>.md` | its Claude wrapper `.claude/agents/<name>.md`, a `docs/workflows.md` row naming it, a row in the plan's agents table (section 5), a *Read first* list | error |
| I5 | a new `.claude/commands/<name>.md` | a `/<name>` row in `docs/workflows.md` | error |
| I6 | a new spec under `specs/` (rubrics excepted) | AGENTS.md rule 1 lists it (error); the plan mentions it (warning) | error, warning |
| I7 | a new key in `framework.config.yaml`, at any level (entries of data maps such as `checks.spelling_variants` are values, not keys) | a spec or doc naming it in backticks (the schema half: `validate`) | error |
| I8 | a changed spec, agent or command | the acceptance replay is due: a table row added to `docs/acceptance.md` (a new scenario or a run-log line) | warning |
| I9 | a removed script, agent or spec | nothing but the changelog still names it | error |

A rule that turns out too strict or too loose is changed here first, then in `scripts/impact.ts` and its tests.

## 4. What the auditor judges

For each changed area, the auditor opens the spec sections it touches (by the *Read first* lists of the agents involved and the section references in the diff) and checks:

1. **Behavior matches the spec.** What the changed code does (its checks, outputs, limits, error messages) is what the spec says, word for word where the spec is specific. A spec sentence nothing implements, or code doing what no spec says, is a finding.
2. **The plan describes the system.** The status line, the agents table (section 5), the risks (9b), the decisions (10) and the out-of-scope list (11) are true after the change.
3. **Summaries of rules are still true.** Each spec's *Rules at a glance* and each agent's *Read first* list and steps match the sections they summarize or point to.
4. **Decisions in force.** `specs/cv-spec.md` 13 and `facts/decisions.yaml` don't contradict each other or the change.
5. **Commands and docs.** `docs/workflows.md`, `docs/scripts.md`, the Claude wrappers and commands describe the same behavior as the agent files and scripts.
6. **Acceptance.** A new or changed workflow has a scenario in `docs/acceptance.md`, and the run log says whether the replay is due.
7. **Tests.** The changed behavior has a test that would fail without it.
8. **Memory and portability.** Nothing the change relies on lives only in an AI tool's memory (`specs/portability-spec.md`); open questions go to `docs/open-items.md`.

## 5. Report

The auditor writes `.cv-runs/align/<YYYY-MM-DD-HHmm>.md` (git-ignored; `<YYYY-MM-DD-HHmm>-<area>.md` when several auditors split one audit by area, so their reports don't collide) and returns its summary:

```markdown
# Alignment: <base>..<working tree or ref>
Changed: N files (framework: N) · Deterministic: doc-check ok · index ok · impact N errors, N warnings

## Findings
| id | severity | where | gap | fix |
|---|---|---|---|---|
| align-1 | high | `scripts/x.ts` vs `specs/y.md` 3 | the script warns where the spec says error | make it an error, or change the spec |

## Checked and aligned
- <area>: <what was compared>
```

Severity: **high** when behavior and spec disagree or a required file is missing, **medium** when a summary, plan line or doc is stale, **low** for wording. The person or agent that made the change fixes the findings; the auditor reruns until none are high or medium, and the change log row says so.
