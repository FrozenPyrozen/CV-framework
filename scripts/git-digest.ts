// npm run git-digest <repo-name> [--path <dir>] [--since YYYY-MM-DD] [--until YYYY-MM-DD] [--identity "<name or email>"] [--run <id>]
// Condenses a repo's history into a compact digest for the harvester (plan R9, R11). Read-only on the repo.
//   - every commit author, with the ones matching your identities marked
//   - your commits grouped by area (folder or package): counts, dates, lines changed, key commit messages
//   - commits by others that credit you (Co-authored-by) and "possibly yours" commits (merges and squashes
//     mentioning your names), for you to confirm; merges you made are listed apart (merging isn't authoring)
// History: branches, remotes and tags (not --all: a stash would count as your commit).
// Repo path: --path, else framework.local.yaml repos[<repo-name>]. Identities: profile.yaml git_identities,
// the author_identities of summaries that list this repo, and --identity.
// Output: .cv-runs/<run-id>/git-digest.md (default run id: harvest-<repo-name>-<date>).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cliPath, isMain, loadConfig, loadLocalConfig, loadProfile, loadSummaries, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

interface Commit { hash: string; author: string; email: string; date: string; subject: string; body: string; files: { path: string; add: number; del: number }[] }

const SEP = "\x1f", REC = "\x1e";
const REFS = ["--branches", "--remotes", "--tags"];

function git(repo: string, args: string[]): string {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
}

export function readCommits(repo: string, opts: { since?: string; until?: string } = {}): Commit[] {
  const range = [...(opts.since ? [`--since=${opts.since}`] : []), ...(opts.until ? [`--until=${opts.until}`] : [])];
  const raw = git(repo, ["log", ...REFS, "--no-merges", ...range, "--date=short", `--pretty=format:${REC}%H${SEP}%an${SEP}%ae${SEP}%ad${SEP}%s${SEP}%b${SEP}`, "--numstat", "--no-renames"]);
  return raw.split(REC).filter((x) => x.trim()).map((chunk) => {
    const [hash, author, email, date, subject, body, rest] = chunk.split(SEP);
    const files = (rest ?? "").split("\n").map((l) => l.match(/^(\d+|-)\t(\d+|-)\t(.+)$/)).filter(Boolean)
      .map((m) => ({ path: m![3], add: m![1] === "-" ? 0 : Number(m![1]), del: m![2] === "-" ? 0 : Number(m![2]) }));
    return { hash, author, email, date, subject: subject.trim(), body: (body ?? "").trim(), files };
  });
}

export function matcher(identities: string[]): (name: string, email: string) => boolean {
  const ids = identities.map((i) => i.toLowerCase().trim()).filter(Boolean);
  return (name, email) => {
    const n = name.toLowerCase(), e = email.toLowerCase();
    return ids.some((i) => n === i || e === i || e.split("@")[0] === i.replace(/\s+/g, ".") || n.replace(/[\s._-]+/g, "") === i.replace(/[\s._-]+/g, ""));
  };
}

const MONOREPO_ROOTS = new Set(["apps", "packages", "libs", "services", "modules", "plugins", "src"]);
export function areaOf(path: string): string {
  const parts = path.split("/");
  if (parts.length === 1) return "(root files)";
  return MONOREPO_ROOTS.has(parts[0]) && parts.length > 2 ? `${parts[0]}/${parts[1]}` : parts[0];
}

export function digest(repoName: string, repo: string, identities: string[], opts: { since?: string; until?: string } = {}): string {
  const commits = readCommits(repo, opts);
  const isMine = matcher(identities);
  const authors = new Map<string, { name: string; email: string; count: number; mine: boolean }>();
  for (const c of commits) {
    const key = `${c.author} <${c.email}>`;
    const a = authors.get(key) ?? { name: c.author, email: c.email, count: 0, mine: isMine(c.author, c.email) };
    a.count++;
    authors.set(key, a);
  }
  const mine = commits.filter((c) => isMine(c.author, c.email));
  const others = commits.filter((c) => !isMine(c.author, c.email));
  // No identities: nothing is "possibly yours" (an empty pattern would match every commit).
  const idRe = identities.length ? new RegExp(identities.map((i) => i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i") : /(?!)/;
  const coAuthored = others.filter((c) => /co-authored-by:/i.test(c.body) && c.body.split("\n").some((l) => /co-authored-by:/i.test(l) && idRe.test(l)));
  const possibly = others.filter((c) => !coAuthored.includes(c) && (idRe.test(c.subject) || idRe.test(c.body)));
  const allMerges = git(repo, ["log", ...REFS, "--merges", "--date=short", ...(opts.since ? [`--since=${opts.since}`] : []), ...(opts.until ? [`--until=${opts.until}`] : []), `--pretty=format:%h${SEP}%an${SEP}%ad${SEP}%s${SEP}%ae`])
    .split("\n").filter(Boolean).map((l) => l.split(SEP));
  const yourMerges = allMerges.filter(([, a, , , e]) => isMine(a, e ?? ""));
  const merges = allMerges.filter((m) => !yourMerges.includes(m) && idRe.test(m[3] ?? ""));

  const areas = new Map<string, { commits: Set<string>; add: number; del: number; first: string; last: string; subjects: string[] }>();
  for (const c of mine) for (const f of c.files) {
    const a = areas.get(areaOf(f.path)) ?? { commits: new Set(), add: 0, del: 0, first: c.date, last: c.date, subjects: [] };
    a.commits.add(c.hash); a.add += f.add; a.del += f.del;
    if (c.date < a.first) a.first = c.date;
    if (c.date > a.last) a.last = c.date;
    if (!a.subjects.includes(c.subject) && !/^(wip|fix|fixes|update|merge|minor|typo)\.?$/i.test(c.subject)) a.subjects.push(c.subject);
    areas.set(areaOf(f.path), a);
  }
  const dates = mine.map((c) => c.date).sort();
  const lines: string[] = [
    `# Git digest: ${repoName}`, "",
    `Generated by npm run git-digest on ${new Date().toISOString().slice(0, 10)}. Read-only summary of the repo history; describe the work in your own words in the summary (no code, URLs or secrets).`, "",
    `- Identities used: ${identities.join(", ")}`,
    `- Range: ${opts.since ?? "start"} to ${opts.until ?? "now"}`,
    `- Your commits: ${mine.length} of ${commits.length} non-merge commits${dates.length ? `, ${dates[0]} to ${dates[dates.length - 1]}` : ""}`,
    `- Your merges: ${yourMerges.length} (listed below; merging others' work isn't counted as your commits)`, "",
    "## Commit authors", "",
    "| Author | Email | Commits | Matched as you |", "|---|---|---|---|",
    ...[...authors.values()].sort((a, b) => b.count - a.count).map((a) => `| ${a.name} | ${a.email} | ${a.count} | ${a.mine ? "yes" : ""} |`), "",
    "Authors that look like you but weren't matched should be confirmed and added to `git_identities` in `facts/profile.yaml`.", "",
    "## Your work by area", "",
    "| Area | Commits | Lines + / - | From | To |", "|---|---|---|---|---|",
    ...[...areas.entries()].sort((a, b) => b[1].commits.size - a[1].commits.size).map(([k, a]) => `| ${k} | ${a.commits.size} | +${a.add} / -${a.del} | ${a.first} | ${a.last} |`), "",
  ];
  for (const [k, a] of [...areas.entries()].sort((a, b) => b[1].commits.size - a[1].commits.size)) {
    lines.push(`### ${k}`, "", ...a.subjects.slice(0, 12).map((s) => `- ${s}`), ...(a.subjects.length > 12 ? [`- … ${a.subjects.length - 12} more`] : []), "");
  }
  lines.push("## Your merges", "", ...(yourMerges.length ? yourMerges.slice(0, 30).map(([h, , d, s]) => `- ${d} ${h}: ${s}`) : ["None."]), ...(yourMerges.length > 30 ? [`- … ${yourMerges.length - 30} more`] : []), "");
  lines.push("## Credited to you in others' commits (Co-authored-by)", "", ...(coAuthored.length ? coAuthored.map((c) => `- ${c.date} ${c.hash.slice(0, 8)} ${c.author}: ${c.subject}`) : ["None found."]), "");
  lines.push("## Possibly yours (confirm before using)", "", "Commits and merges by others that mention your names (squash merges and merged pull requests are often credited to whoever merged them).", "",
    ...(possibly.length || merges.length ? [...possibly.map((c) => `- ${c.date} ${c.hash.slice(0, 8)} ${c.author}: ${c.subject}`), ...merges.map(([h, a, d, s]) => `- ${d} ${h} ${a} (merge): ${s}`)] : ["None found."]), "");
  if (!mine.length) lines.push(`**No commits matched your identities.**${yourMerges.length ? ` You made ${yourMerges.length} merge(s): your work may be in squashed or merged commits under other names.` : ""} Check the author list above before harvesting.`, "");
  return lines.join("\n");
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const name = positional[0];
  if (!name) { console.error('usage: npm run git-digest -- <repo-name> [--path <dir>] [--since YYYY-MM-DD] [--until YYYY-MM-DD] [--identity "<name>"] [--run <id>]'); process.exit(2); }
  const cfg = loadConfig();
  const localPath = loadLocalConfig()?.repos?.[name];
  const repo = args.path ? cliPath(args.path as string) : localPath ? localPath.replace(/^~(?=\/|$)/, process.env.HOME ?? "~") : undefined;
  if (!repo || !existsSync(join(repo, ".git"))) { console.error(`git-digest: no local git repo for "${name}" (pass --path, or add it to framework.local.yaml repos)`); process.exit(2); }
  const identities = [
    ...(loadProfile(cfg).git_identities ?? []),
    ...loadSummaries(cfg).filter((s) => (s.frontMatter.repos ?? []).some((r: any) => r.name === name)).flatMap((s) => s.frontMatter.author_identities ?? []),
    ...(args.identity ? [String(args.identity)] : []),
  ];
  const text = digest(name, repo, [...new Set(identities)], { since: args.since as string | undefined, until: args.until as string | undefined });
  const runId = (args.run as string) ?? `harvest-${name}-${new Date().toISOString().slice(0, 10)}`;
  const out = rootPath(cfg.paths.runs, runId, "git-digest.md");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, text);
  console.log(`git-digest: ${out.replace(rootPath() + "/", "")}`);
}
