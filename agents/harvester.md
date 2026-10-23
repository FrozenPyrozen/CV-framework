# Harvester

description: Writes or merges a work summary (summaries/<id>.md) from a local git repo, asking the user for everything git can't know.

**Never commits.**

## Read first
- `AGENTS.md` (rules for every agent)
- `specs/work-summary-spec.md` 1–6 (file, front matter, body sections, contributions, writing and harvesting rules), after its *Rules at a glance*

Open other sections only when a step points there: `specs/work-summary-spec.md` 7 (merging, step 7) and 9 (portable harvest, *Importing a portable summary*).

## Inputs
- A repo path or a repo name, and optionally a summary id
- `framework.local.yaml` (repo name to local path), `facts/profile.yaml` (`git_identities`), existing `summaries/` and their digests (`summaries/.digests/`)
- `framework.config.yaml` (tag list), `facts/skills.yaml`

## Output
- A new `summaries/<id>.md`, or a merge into an existing one, plus proposed additions to the tag list, `facts/skills.yaml` and `git_identities`, all shown as a diff for approval.

## Steps

1. **Locate the repo.**
   - Given a path: use the folder name as the repo name (ask if the user prefers another). Add `<repo-name>: <path>` to `framework.local.yaml` (create it from `framework.local.example.yaml` if missing).
   - Given a name: look it up in `framework.local.yaml`. If it's missing, ask the user for the path. If they no longer have access (the job has ended), stop: the summary is the record, and there is nothing to harvest.
   - Summaries store **only the repo name**, never its remote URL or local path (`specs/work-summary-spec.md` 2).
2. **Digest the history.** Run `npm run git-digest -- <repo-name> --run <run-id>` (run id: `harvest-<repo-name>-<date>`; add `--since`/`--until` if the user gives a period). Read `.cv-runs/<run-id>/git-digest.md`.
3. **Confirm identities.** Show the commit authors that look like the user but weren't matched, and ask before adding any to `git_identities` in `facts/profile.yaml`. If you add one, rerun step 2. **Zero commits matched: stop** and ask the user how they contributed (merged pull requests, another email, reviews only).
4. **New or existing job?** Ask whether this repo is a new job or project, or part of an existing summary. Suggest likely matches by period and domain (read the digests) and by the clone's remote host. Existing: merge (step 7). New: continue.
5. **Job details (new summaries).** Ask, one topic at a time, with suggestions from the repo (first and last commit dates, README, remote host):
   - company (`client`), and what the CV may show (`cv_client_label`); hidden clients get a neutral label
   - role and the **real** employment type (`engagement`: full-time, contract, freelance)
   - period, location (`cv_location`), CV section (`experience` or `consulting`), team size led
   - anything the entry must make clear (`cv_emphasis`)

   Suggest an id `<client>-<project>` (lowercase-kebab) and confirm it; it never changes later.
6. **Write the summary** with the nine sections of the spec. Read the README and docs, and open individual commits only where the digest isn't enough.
   - **Contributions** (section 4): numbered by importance, each with body, optional `Result:` and a `Tags:` line.
   - **Technologies** (section 5): hands-on vs used by the project.
   - **Metrics** (section 7): each number with its source (`git` or `user`) and confidence. Every number in a contribution's `Result:` line must also be listed here (`specs/work-summary-spec.md` 4); check before finishing.
   - **Confidentiality notes** (section 9): internal product and module names, repo names, ticket prefixes and internal URL patterns. Read the remote with `git -C <path> remote get-url origin` only to derive a host pattern (e.g. `*dev.azure.com*<org>*`); never store the URL itself.
   - Unknowns: `TODO (needs user input)`.
   - Your own words only: no code, copied commit messages, internal URLs or secrets.
7. **Merge into an existing summary** (`specs/work-summary-spec.md` 7):
   - Add the repo to `repos` and update `harvested_at`.
   - Update contributions from the new history. Keep existing numbers; new items get new numbers.
   - Keep sections the user edited, filled TODOs, all `cv_*` fields and section 9 as they are. List proposed changes to them instead of applying them.
8. **New tags and skills.** For technologies used hands-on that have no tag or skill yet, propose additions to `tags` in `framework.config.yaml` and to `facts/skills.yaml`. Add them only after the user approves.
9. **Check.** Run `npm run validate` and `npm run lint` (which secret-scans summary bodies). Fix what you wrote; report what you can't fix.
10. **Report** to the user:
    - how many of the user's commits were matched (from the digest)
    - the diff
    - the contributions you wrote (number and title)
    - the TODOs left
    - the identities and tags added
    - the next step: `/compose`, or `/add-repo` continues automatically

## Importing a portable summary

For a summary written on another machine from `npm run harvest-prompt` (`/import-summary <file>`; `specs/work-summary-spec.md` 9):

1. **Check.** Run `npm run import-summary -- <file>`. Errors: report them and stop; the user fixes the file (or asks you to fix wording here), then check again. Never import a file that fails.
2. **Tags.** For proposed or unknown tags, ask the user to approve each one (step 8 above) or change it to an existing tag.
3. **Apply.** Run `npm run import-summary -- <file> --apply`.
   - **New id:** the file is now `summaries/<id>.md`. Ask about the TODOs you can fill here, especially section 9 (confidentiality notes) if it was left out on the other machine.
   - **Existing id:** the file is in `.cv-runs/import/<id>.md`. Merge it into `summaries/<id>.md` by step 7 (existing numbers, user edits, `cv_*` fields and section 9 kept; proposed changes to them listed for approval), add its repos and take its `harvested_at`.
   - Set `harvest_mode: portable` on the summary (a merged summary keeps it once any repo was harvested this way).
4. **Check and report** as in steps 9 and 10. Next step: `/compose`.
