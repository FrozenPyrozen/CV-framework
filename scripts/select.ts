// npm run select <cv-dir> --profile <id> | --tags <file> [--profile <id> --tags <file>]
// Deterministic bullet selection for a role variant or a job-specific CV (plan R8, specs/tailoring-spec.md 2).
// Scores every contribution and fact of each CV entry by its tags, applies the profile's overrides and limits,
// and writes <cv-dir>/selection.json. The tailor agent words the selected bullets and never changes the choice.
//
// Score = 2 x matches with emphasize_tags + 1 x matches with summary_focus - 2 x matches with deemphasize_tags
//       + 3 x matches with job-ad required tags + 1 x matches with job-ad nice-to-have tags.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { cliPath, isMain, loadConfig, loadConfirmed, loadEntries, loadSummaries, readYaml, rootPath, sortEntries } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

export interface SelectionInput {
  profile?: {
    id: string; emphasize_tags?: string[]; deemphasize_tags?: string[]; summary_focus?: string[];
    max_bullets_per_entry?: number; min_bullets_per_entry?: number; entry_max_bullets?: Record<string, number>;
    overrides?: Record<string, { pin?: boolean; drop?: boolean; text?: string }>;
    skills_order?: string[]; include_sections?: string[];
  };
  jdTags?: { required?: string[]; nice_to_have?: string[]; overrides?: Record<string, { pin?: boolean; drop?: boolean; text?: string }> };
}

export interface Selection {
  generated: string;
  profile?: string;
  job_ad?: boolean;
  skills_order?: string[];
  entries: { id: string; section: string; stack?: string; bullets: { src: string; title: string; score: number; pinned?: boolean; text?: string }[] }[];
}

export function select(input: SelectionInput): Selection {
  const cfg = loadConfig();
  const summaries = loadSummaries(cfg);
  const confirmed = loadConfirmed(cfg);
  const entries = loadEntries(cfg, summaries, confirmed);
  // A job ad's own overrides (jd-tags.yaml) apply on top of the profile's, for that one CV only.
  const base = input.profile ?? { id: "" };
  const p = { ...base, overrides: { ...(base.overrides ?? {}), ...(input.jdTags?.overrides ?? {}) } };
  const min = p.min_bullets_per_entry ?? 1;
  const count = (tags: string[], list?: string[]) => tags.filter((t) => list?.includes(t)).length;
  const sections = new Set(p.include_sections ?? cfg.cv_sections.map((s) => s.id));

  const out: Selection = { generated: "by npm run select; do not edit", profile: p.id || undefined, job_ad: !!input.jdTags, skills_order: p.skills_order, entries: [] };
  for (const sec of cfg.cv_sections) {
    if (sec.source !== "entries" || !sections.has(sec.id)) continue;
    for (const e of sortEntries(entries.filter((x) => x.section === sec.id))) {
      const s = summaries.find((x) => x.id === e.id);
      const candidates = [
        ...(s?.contributions.filter((c) => !c.removed).map((c) => ({ src: `${e.id}#${c.number}`, title: c.title, tags: c.tags })) ?? []),
        ...confirmed.facts.filter((f) => f.entry === e.id).map((f) => ({ src: f.id, title: f.fact, tags: f.tags })),
      ];
      const scored = candidates
        .map((c, order) => {
          const o = p.overrides?.[c.src];
          const score = 2 * count(c.tags, p.emphasize_tags) + count(c.tags, p.summary_focus) - 2 * count(c.tags, p.deemphasize_tags)
            + 3 * count(c.tags, input.jdTags?.required) + count(c.tags, input.jdTags?.nice_to_have);
          return { ...c, score, order, pinned: !!o?.pin, drop: !!o?.drop, text: o?.text };
        })
        .filter((c) => !c.drop);
      const ranked = [...scored].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.score - a.score || a.order - b.order);
      // Pinned bullets come first, in the order they're listed in the profile's overrides.
      const pinOrder = Object.keys(p.overrides ?? {});
      const pinned = ranked.filter((c) => c.pinned).sort((a, b) => pinOrder.indexOf(a.src) - pinOrder.indexOf(b.src));
      const rest = ranked.filter((c) => !c.pinned);
      const positive = rest.filter((c) => c.score > 0);
      // Same limit order as lint: the profile's entry limit, its general limit, then the entry's cv_max_bullets.
      const entryMax = p.entry_max_bullets?.[e.id] ?? p.max_bullets_per_entry ?? e.maxBullets ?? 99;
      const take = Math.max(Math.min(min, entryMax) - pinned.length, Math.min(positive.length, entryMax - pinned.length), 0);
      const chosen = [...pinned, ...rest.slice(0, take)];
      out.entries.push({
        id: e.id,
        section: e.section,
        // The Stack line (<id>#5) is kept when pinned; it doesn't count toward the bullet limits.
        ...(p.overrides?.[`${e.id}#5`]?.pin ? { stack: `${e.id}#5` } : {}),
        bullets: chosen.map((c) => ({ src: c.src, title: c.title, score: c.score, ...(c.pinned ? { pinned: true } : {}), ...(c.text ? { text: c.text } : {}) })),
      });
    }
  }
  return out;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  // The CV folder is created on first use, but only where CVs live (a typo elsewhere would leave a stray folder).
  const cfgS = loadConfig();
  if (positional[0] && ![cfgS.output.variants_dir, cfgS.output.tailored_dir].some((d) => cliPath(positional[0]).startsWith(rootPath(d) + "/"))) { console.error(`select: ${positional[0]} is not under ${cfgS.output.variants_dir}/ or ${cfgS.output.tailored_dir}/`); process.exit(2); }
  if (!positional[0] || (!args.profile && !args.tags)) {
    console.error("usage: npm run select -- <cv-dir> [--profile <id>] [--tags <jd-tags.yaml>]   (at least one)");
    process.exit(2);
  }
  const cfg = loadConfig();
  const input: SelectionInput = {};
  if (args.tags) {
    // jd-tags.yaml usually sits in the CV folder: look there first, then relative to the repo root.
    const inDir = join(cliPath(positional[0]), args.tags as string);
    const tagsFile = existsSync(inDir) ? inDir : cliPath(args.tags as string);
    if (!existsSync(tagsFile)) { console.error(`select: tags file not found: ${args.tags} (looked in the CV folder and the repo root)`); process.exit(2); }
    input.jdTags = readYaml(tagsFile);
  }
  // The profile: --profile, else the one jd-tags.yaml names (as refresh, lint and build read it).
  const profileId = (args.profile as string | undefined) ?? (input.jdTags as any)?.profile;
  if (input.jdTags && !profileId) { console.error("select: the job ad names no role profile: add profile: <id> to jd-tags.yaml or pass --profile (specs/tailoring-spec.md 2)"); process.exit(2); }
  if (profileId) {
    const pf = rootPath(cfg.paths.profiles, `${profileId}.yaml`);
    if (!existsSync(pf)) { console.error(`select: role profile "${profileId}" not found (${cfg.paths.profiles}/${profileId}.yaml)`); process.exit(2); }
    input.profile = readYaml(pf);
  }
  const known = new Set(cfg.tags);
  const unknown = [...(input.jdTags?.required ?? []), ...(input.jdTags?.nice_to_have ?? [])].filter((t) => !known.has(t));
  if (unknown.length) { console.error(`select: unknown tag(s) in ${args.tags}: ${unknown.join(", ")} (see tags in framework.config.yaml; propose new ones in new_tags_proposed)`); process.exit(2); }
  const sel = select(input);
  const dir = cliPath(positional[0]);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "selection.json"), JSON.stringify(sel, null, 2) + "\n");
  const total = sel.entries.reduce((n, e) => n + e.bullets.length, 0);
  console.log(`select: ${total} bullet(s) across ${sel.entries.length} entries written to ${join(dir, "selection.json").replace(rootPath() + "/", "")}`);
}
