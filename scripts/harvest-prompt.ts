// npm run harvest-prompt [--merge <id>] [--out <file>]
// Writes one self-contained prompt for harvesting a repo on a machine that doesn't have this framework
// (specs/work-summary-spec.md 9, plan 9c): the summary spec, the official tag list, the user's git identities,
// plain git commands that replace git-digest, and with --merge the existing summary to extend. It holds no other
// summaries, facts or CVs, and it is refused if it would carry a confidentiality term or hidden client name from
// another summary (it goes to another employer's machine). Generated from the current files, so it never drifts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { cliPath, isMain, loadConfig, loadEntries, loadProfile, loadSummaries, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

// Confidentiality terms (section 9) and hidden client names of every summary except the one being extended,
// matched like lint's blocklist: terms case-sensitive, hidden clients in any case.
export function leakedTerms(text: string, merge?: string): string[] {
  const cfg = loadConfig();
  const re = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const found: string[] = [];
  for (const s of loadSummaries(cfg)) {
    if (s.id === merge) continue;
    for (const r of s.confidentiality) if (r.term && new RegExp(`(?<![\\w-])${re(r.term)}(?![\\w-])`).test(text)) found.push(`"${r.term}" (${s.id})`);
  }
  for (const e of loadEntries(cfg)) {
    if (e.id === merge || !e.client || e.label === e.client) continue;
    if (new RegExp(`(?<![\\w-])${re(e.client)}(?![\\w-])`, "i").test(text)) found.push(`"${e.client}" (hidden client of ${e.id})`);
  }
  return found;
}

export function harvestPrompt(opts: { merge?: string; today?: string } = {}): string {
  const cfg = loadConfig();
  const profile = loadProfile(cfg);
  const today = opts.today ?? new Date().toISOString().slice(0, 10);
  const spec = readFileSync(rootPath("specs", "work-summary-spec.md"), "utf8");
  const ids: string[] = profile.git_identities ?? [];
  let existing = "";
  if (opts.merge) {
    const f = rootPath(cfg.paths.summaries, `${opts.merge}.md`);
    if (!existsSync(f)) throw new Error(`no summary "${opts.merge}" (${relative(rootPath(), f)})`);
    existing = readFileSync(f, "utf8");
  }
  const authorArgs = ids.map((i) => `--author="${i.replace(/"/g, "")}"`).join(" ");
  const text = [
    `# Portable harvest prompt (generated ${today} by npm run harvest-prompt)`,
    "",
    "You are helping me write a **work summary** of my own contributions to the git repository in the current folder, in the exact format of the specification below. The summary goes back to my private CV framework on another laptop; the code never leaves this machine.",
    "",
    "## Rules (read first)",
    "",
    "- Describe the work in **your own words**. Never copy source code, internal document text, commit messages verbatim, ticket links, secrets, tokens or absolute file paths (`/Users/…`, `C:\\…`). Paraphrase the repo's specs and docs: say what was built and why, not their wording or ids.",
    "- **No URLs or hostnames anywhere, except** the host *patterns* that section 9 (confidentiality notes) asks for (e.g. `*dev.azure.com*<org>*`). Folder and package names inside the repo (`apps/login`) are fine in the body. Internal product and project names may appear in the body (section 9 keeps them out of my CV) but not in contribution titles; if my employer forbids them, they go nowhere (see below). No ticket, work-item or pull-request numbers and no spec ids in the body: their prefixes go to section 9.",
    "- **Section 9** lists: internal product, module and repo names; ticket and work-item prefixes; host patterns of the git remote (host and organization, e.g. `*dev.azure.com*<org>*`) and of internal domains named in the docs.",
    "- Only **my** work counts: commits by the identities below. Non-code work counts as much as code: specifications and design docs, decision records, process and agent instructions, reviews and technical-debt registers, CI pipelines, tests.",
    "- Never invent: what git can't tell you you **ask me** (see \"Order of work\"), with suggested answers from the repo. Unknowns stay `TODO (needs user input)`.",
    "- **My employer's rules decide what may leave this machine.** Ask me first whether internal project names may leave; if not, write `TODO (needs user input)` in section 9 and keep those names out of the whole file. Remind me to review the file before I move it.",
    "- Write **one file**, `<id>.md` (id: lowercase-kebab, e.g. `<client>-<project>`, which I confirm), and nothing else. Change nothing in the repo.",
    ...(opts.merge ? ["- **This extends an existing summary** (shown at the end): keep its `id`, every existing contribution number and its wording, every `cv_*` field and section 9; add new contributions after the last number; update only what the new history changes (spec section 7)."] : []),
    "",
    "## Order of work",
    "",
    "1. Run the git commands below. Show me the authors that look like me but aren't listed, and ask which are mine (an email domain says nothing about the employer or the employment type: never infer either from it). Identities I confirm that aren't in the list below go into `author_identities`.",
    "2. Ask me, one topic at a time, with suggestions from the repo: whether internal names may leave this machine; " + (opts.merge ? "anything that changed in the job since the existing summary; " : "the id; company (`client`) and what the CV may show (`cv_client_label`); role and the real employment type (`engagement`); period (it may start before my first commit here); location (`cv_location`); CV section (`experience` or `consulting`); team size I led; ") + "what the CV entry must make clear (`cv_emphasis`); my team and key collaborators; which of the repo's main libraries and tools I used hands-on (section 5 marks each **hands-on** or **used by the project**; when I don't know, use **used by the project**).",
    "3. Read the README and docs, then go through **every area** in the area count below: each area with a real share of my commits, and each kind of non-code work above, becomes a contribution or is explicitly folded into one. Open single commits only where the subjects aren't enough.",
    "4. Write the file, then ask me for results and numbers per contribution (a `Result:` line only when one is known; open ones go to section 7 as `TODO (needs user input)`), .",
    "5. Run the self-check and report.",
    "",
    "## My git identities",
    "",
    ...(ids.length ? ids.map((i) => `- ${i}`) : ["- (none recorded: ask me)"]),
    "",
    "## Read the history with plain git (instead of my framework's git-digest)",
    "",
    "Use `--branches --remotes`, not `--all`: `--all` counts stash entries as commits. **My commit count** is the non-merge count below (`shortlog` includes merges). An identity that only has merges still counts as mine. Lockfiles are left out of line counts.",
    "",
    "```bash",
    "git shortlog -sne --branches --remotes              # all authors: confirm which are me",
    `ME=(${authorArgs})                   # bash or zsh array`,
    "git log --branches --remotes --no-merges \"${ME[@]}\" --oneline | wc -l                                   # my commits",
    "git log --branches --remotes --no-merges \"${ME[@]}\" --date=short --pretty=format:%ad | sort | sed -n '1p;$p'   # first and last date",
    "git log --branches --remotes --no-merges \"${ME[@]}\" --pretty=format: --name-only | awk -F/ 'NF>1{n=(NF>4?4:NF-1); a=$1; for(i=2;i<=n;i++) a=a\"/\"$i; print a}' | sort | uniq -c | sort -rn | head -60   # files I changed, per folder (up to 4 levels)",
    "git log --branches --remotes --no-merges \"${ME[@]}\" --date=short --pretty=format:\"%h %ad %s\"                 # my commit subjects",
    "git log --branches --remotes --no-merges \"${ME[@]}\" --pretty=format:\"%h %s\" -- '*.md' '*.yaml' '*.yml'      # my docs, specs, pipelines, config",
    "git log --branches --remotes --no-merges \"${ME[@]}\" --numstat --pretty=format:\"%h %s\" -- . ':(exclude)*lock*' # lines per file (no lockfiles)",
    "git log --branches --remotes --merges \"${ME[@]}\" --date=short --pretty=format:\"%h %ad %s\" | grep -iv \"merge branch\\|merge remote\" | head -60   # pull requests I completed (no branch syncs)",
    "```",
    "",
    "## Front matter you must set",
    "",
    `- \`source: git\`, \`harvest_mode: portable\`, \`harvested_at: ${today}\` (today: the date of this harvest)`,
    "- `repos:` the repo **name** only (folder name), never its URL or path",
    "- the required fields of the spec's front-matter table from my answers; of the optional ones set `harvest_mode` (above), `cv_emphasis` (from my answer) and `domain`, `team_size_led`, `counts_as_experience`, `show_in_cv`, `author_identities: []`; leave the others out (my framework applies defaults)",
    "- tags: use **only** tags from the official list below. If something needs a new tag, put it in one comment line right after the front matter: `<!-- proposed-tags: tag-a, tag-b -->` (I approve them at home).",
    "",
    "## Official tag list",
    "",
    cfg.tags.join(", "),
    "",
    "## Self-check before you finish",
    "",
    "1. Front matter: `schema_version: 1`, `source: git`, `harvest_mode: portable`, `harvested_at`, `repos` with names only, and the other required fields of the spec.",
    "2. Exactly the nine `##` sections, in order and numbered as in the spec; section 4 has contributions `### 4.1`, `### 4.2` … without gaps, each with a `Tags:` line from the official list.",
    "3. Every area of the area count with a real share of my commits, and every kind of non-code work I did, is covered by a contribution.",
    "4. Every number in a `Result:` line also appears in section 7 with its source and confidence.",
    "5. No code, copied internal text, secrets, absolute paths, URLs or hostnames (only section 9's host patterns).",
    "6. Tell me the file name, my commit count and date range, the contributions you wrote and the TODOs left, and remind me to review it before moving it.",
    "",
    "## The specification (work-summary-spec.md)",
    "",
    "Use it for the format and the writing rules. Where it mentions tools of my framework (`/harvest`, `/import-summary`, `npm run git-digest`, `npm run validate`, `lint`, `framework.config.yaml`, `framework.local.yaml`, `profile.yaml`), they aren't on this machine: follow this prompt instead (the tag list above is the one from `framework.config.yaml`). Its examples (Acme Corp …) are made up.",
    "",
    spec.trim(),
    ...(existing ? ["", "## Existing summary to extend", "", "````markdown", existing.trim(), "````"] : []),
    "",
  ].join("\n");
  const leaks = leakedTerms(text, opts.merge);
  if (leaks.length) throw new Error(`the prompt would carry confidential names from other summaries: ${leaks.join(", ")}; make the spec's examples neutral (specs/work-summary-spec.md) and generate it again`);
  return text;
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const cfg = loadConfig();
  const merge = args.merge as string | undefined;
  const text = harvestPrompt({ merge });
  const out = args.out ? cliPath(args.out as string) : rootPath(cfg.paths.runs, `harvest-prompt-${new Date().toISOString().slice(0, 10)}${merge ? `-${merge}` : ""}.md`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, text);
  console.log(`harvest-prompt: ${relative(rootPath(), out)} (${text.split("\n").length} lines)`);
  console.log("  Give it to an AI agent tool in the repo on the other machine; review the summary it writes before moving it, then: npm run import-summary -- <file>");
}
