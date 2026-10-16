// CV Markdown model: generating the script-owned parts of a CV (specs/cv-spec.md sections 2, 7, 8, 14)
// and reading a CV's structure (sections, entries, bullets, source comments).
import { existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import {
  type Config, type CvEntry, type Market, loadConfig, loadConfirmed, loadEntries, loadMarkets, loadProfile,
  loadSkills, loadSummaries, readYaml, rootPath, sortEntries,
} from "./repo.ts";

// ---------- context ----------

export interface Context {
  cfg: Config;
  profile: any;
  skills: any;
  entries: CvEntry[];
  market: Market;
  roleProfile?: { id: string; headline?: string; skills_order?: string[]; [k: string]: any };
  headline?: string; // role profile override
  skillsOrder?: string[]; // role profile override
  calculated: { years_experience: number; team_size_led: number };
}

// The role profile a CV file belongs to: cv/variants/<id>/... (also inside its markets/ subfolder),
// or, for a job-specific CV, the `profile` in cv/tailored/<company-role>/jd-tags.yaml.
export function profileIdForFile(cvFile: string, cfg = loadConfig()): string | undefined {
  const variants = rootPath(cfg.output.variants_dir) + "/";
  const abs = resolve(cvFile);
  if (abs.startsWith(variants)) return abs.slice(variants.length).split("/")[0];
  return tailoredSettings(abs, cfg).profile;
}

// A job-specific CV's jd-tags.yaml may name the role profile it starts from and a headline fitting the job ad
// (specs/tailoring-spec.md 2). Both are optional.
export function tailoredSettings(cvFile: string, cfg = loadConfig()): { profile?: string; headline?: string } {
  const tailored = rootPath(cfg.output.tailored_dir) + "/";
  const abs = resolve(cvFile);
  if (!abs.startsWith(tailored)) return {};
  const tags = join(tailored, abs.slice(tailored.length).split("/")[0], "jd-tags.yaml");
  if (!existsSync(tags)) return {};
  const t = readYaml(tags) ?? {};
  return { profile: t.profile ?? undefined, headline: t.headline ?? undefined };
}

export function loadContext(opts: { market?: string; headline?: string; profileId?: string; cvFile?: string } = {}): Context {
  const cfg = loadConfig();
  const summaries = loadSummaries(cfg);
  const confirmed = loadConfirmed(cfg);
  const entries = loadEntries(cfg, summaries, confirmed);
  const markets = loadMarkets(cfg).map((m) => m.market);
  const market = opts.market ? markets.find((m) => m.id === opts.market) : markets.find((m) => m.default);
  if (!market) throw new Error(`unknown market "${opts.market ?? "(default)"}"`);
  return {
    cfg,
    profile: loadProfile(cfg),
    skills: loadSkills(cfg),
    entries,
    market,
    ...roleProfileFields(cfg, opts.profileId ?? (opts.cvFile ? profileIdForFile(opts.cvFile, cfg) : undefined),
      opts.headline ?? (opts.cvFile ? tailoredSettings(opts.cvFile, cfg).headline : undefined)),
    calculated: calculate(entries, confirmed.facts, new Date()),
  };
}

function roleProfileFields(cfg: Config, profileId: string | undefined, headline?: string) {
  if (!profileId) return { headline };
  const file = rootPath(cfg.paths.profiles, `${profileId}.yaml`);
  if (!existsSync(file)) throw new Error(`role profile "${profileId}" not found (${cfg.paths.profiles}/${profileId}.yaml)`);
  const rp = readYaml(file);
  return { roleProfile: rp, headline: headline ?? rp.headline, skillsOrder: rp.skills_order };
}

// specs/cv-spec.md section 7
export function calculate(entries: CvEntry[], facts: { team_size_led?: number }[], today: Date) {
  const starts = entries.filter((e) => e.countsAsExperience).map((e) => e.period.start).sort();
  let years = 0;
  if (starts.length) {
    const [y, m] = starts[0].split("-").map(Number);
    const months = (today.getFullYear() - y) * 12 + (today.getMonth() + 1 - m);
    years = Math.floor(months / 12);
  }
  const team = Math.max(0, ...entries.map((e) => e.teamSizeLed), ...facts.map((f) => f.team_size_led ?? 0));
  return { years_experience: years, team_size_led: team };
}

// ---------- formatting ----------

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatYearMonth(ym: string, cfg: Config): string {
  if (ym === "present") return cfg.display.present_label;
  const [y, m] = ym.split("-");
  return cfg.display.date_format.replace("MMMM", MONTHS[Number(m) - 1]).replace("YYYY", y);
}

export function formatPeriod(p: { start: string; end: string }, cfg: Config): string {
  return `${formatYearMonth(p.start, cfg)}${cfg.display.date_range_separator}${formatYearMonth(p.end, cfg)}`;
}

function joinList(items: string[], joiner: string): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")}${joiner}${items[items.length - 1]}`;
}

// ---------- generated lines ----------

export function entryTitleLine(e: CvEntry, ctx: Context): string {
  const suffix = ctx.market.entries.show_contract_suffix ? e.titleSuffix : "";
  return `## **${e.role}${suffix}**`;
}

export function entryDetailLine(e: CvEntry, ctx: Context): string {
  const parts = [e.label, e.location];
  if (e.showDates) parts.push(formatPeriod(e.period, ctx.cfg));
  return `### **${parts.join(ctx.cfg.display.field_separator)}**`;
}

export function headerBlock(ctx: Context): string {
  const { cfg, profile, market } = ctx;
  const h = cfg.header;
  const sep = cfg.display.field_separator;
  const name = profile.show_legal_name && profile.legal_name ? `${profile.name.split(" ")[0]} (${profile.legal_name.split(" ")[0]}) ${profile.name.split(" ").slice(1).join(" ")}` : profile.name;
  const lines = [`# **${name}**`, `**${ctx.headline ?? profile.headline_default}**`];

  const loc = h.location
    .replace("{city}", profile.location.city)
    .replace("{country}", profile.location.country)
    .replace("{remote_suffix}", profile.location.remote ? h.remote_suffix : "");
  const locParts = [loc];
  if (market.header.show_availability) {
    const types: string[] = market.header.engagement_types ?? profile.work.engagement_types;
    const labels = types.map((t) => h.availability.labels[t] ?? t);
    if (labels.length) locParts.push(h.availability.template.replace("{engagement_list}", joinList(labels, h.availability.joiner)));
  }
  for (const auth of profile.work.work_authorization ?? []) locParts.push(auth);
  if (market.header.show_time_zone_overlap && profile.location.overlaps?.length) {
    locParts.push(h.time_zone_overlap.replace("{overlap_list}", joinList(profile.location.overlaps, " and ")));
  }
  lines.push(locParts.join(sep));

  const contacts: string[] = [];
  for (const kind of h.contact_order) {
    if (kind === "phone" && market.header.show_phone && profile.contacts.phone) contacts.push(profile.contacts.phone);
    if (kind === "email") contacts.push(profile.contacts.email);
    if (kind === "links") {
      for (const l of profile.contacts.links ?? []) if (l.show) contacts.push(h.link_format.replace("{label}", l.label).replace("{url}", l.url));
    }
  }
  lines.push(contacts.join(sep));
  return lines.join("\n\n");
}

export function educationBlock(ctx: Context): string {
  const sep = ctx.cfg.display.field_separator;
  return ctx.profile.education
    .map((ed: any) => {
      const degree = ed.status === "in-progress" ? `${ed.degree} (in progress)` : ed.degree;
      const years = `${ed.start}${ctx.cfg.display.date_range_separator}${ed.end}${ed.end_expected ? ctx.cfg.display.expected_suffix : ""}`;
      const out = [`## **${degree}**`, [ed.institution, ed.country, years].join(sep)];
      if (ed.honors) out.push(`* ${ed.honors}.`);
      return out.join("\n\n");
    })
    .join("\n\n");
}

export function skillsBlock(ctx: Context, order?: string[]): string {
  const cats: any[] = [...ctx.skills.categories];
  if (order?.length) cats.sort((a, b) => (order.indexOf(a.id) + 1 || 999) - (order.indexOf(b.id) + 1 || 999));
  return cats
    .map((c) => {
      const names = c.items
        .filter((i: any) => !i.hidden)
        .map((i: any) => (i.calculated === "team_size_led" ? i.name.replace(/\d+/, String(ctx.calculated.team_size_led)) : i.name));
      return names.length ? `**${c.label}:** ${names.join(", ")}` : null;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function languagesBlock(ctx: Context): string {
  return ctx.profile.languages.map((l: any) => `${l.language}: ${l.level}`).join(ctx.cfg.display.field_separator);
}

export const GENERATED_BLOCKS = ["header", "education", "skills", "languages"] as const;
export type BlockName = (typeof GENERATED_BLOCKS)[number];

export function generateBlock(name: BlockName, ctx: Context, skillsOrder?: string[]): string {
  switch (name) {
    case "header": return headerBlock(ctx);
    case "education": return educationBlock(ctx);
    case "skills": return skillsBlock(ctx, skillsOrder);
    case "languages": return languagesBlock(ctx);
  }
}

export function wrapBlock(name: string, content: string): string {
  return `<!-- generated:${name} -->\n${content}\n<!-- /generated:${name} -->`;
}

// ---------- reading a CV ----------

export interface Bullet { line: number; text: string; src: string[] }
export interface ParsedEntry { id?: string; titleLine: number; title: string; detail: string; bullets: Bullet[] }
export interface ParsedSection { line: number; heading: string; entries: ParsedEntry[]; paragraphs: { line: number; text: string }[] }

export const SRC_RE = /<!--\s*src:\s*([^>]*?)\s*-->/;
export const stripComments = (s: string) => s.replace(/<!--[\s\S]*?-->/g, "");

export function parseCv(text: string) {
  const lines = text.split("\n");
  const sections: ParsedSection[] = [];
  const blocks: { name: string; start: number; end: number; content: string }[] = [];
  let open: { name: string; start: number } | null = null;
  let pendingEntryId: string | undefined;
  let section: ParsedSection | null = null;
  let entry: ParsedEntry | null = null;

  lines.forEach((raw, i) => {
    const gs = raw.match(/^<!-- generated:([\w-]+) -->$/);
    const ge = raw.match(/^<!-- \/generated:([\w-]+) -->$/);
    if (gs) { open = { name: gs[1], start: i }; return; }
    if (ge && open) { blocks.push({ ...open, end: i, content: lines.slice(open.start + 1, i).join("\n") }); open = null; return; }
    if (open) return; // generated content is not parsed as CV structure
    const em = raw.match(/^<!-- entry: ([\w-]+) -->$/);
    if (em) { pendingEntryId = em[1]; return; }
    const h1 = raw.match(/^# \*\*(.+)\*\*\s*$/);
    if (h1) { section = { line: i, heading: h1[1], entries: [], paragraphs: [] }; sections.push(section); entry = null; return; }
    const h2 = raw.match(/^## \*\*(.+)\*\*\s*$/);
    if (h2 && section) { entry = { id: pendingEntryId, titleLine: i, title: h2[1], detail: "", bullets: [] }; pendingEntryId = undefined; section.entries.push(entry); return; }
    const h3 = raw.match(/^### \*\*(.+)\*\*\s*$/);
    if (h3 && entry) { entry.detail = h3[1]; return; }
    const b = raw.match(/^\* (.*)$/);
    if (b && entry) {
      const m = b[1].match(SRC_RE);
      entry.bullets.push({ line: i, text: stripComments(b[1]).trim(), src: m ? m[1].split(",").map((x) => x.trim()).filter(Boolean) : [] });
      return;
    }
    if (raw.trim() && section && !entry && !raw.startsWith("<!--")) section.paragraphs.push({ line: i, text: raw });
  });
  return { lines, sections, blocks };
}

// ---------- entry lookup ----------

export function entriesForSection(ctx: Context, sectionId: string): CvEntry[] {
  return sortEntries(ctx.entries.filter((e) => e.section === sectionId));
}

export function sectionIdForHeading(cfg: Config, heading: string): string | undefined {
  return cfg.cv_sections.find((s) => s.heading.toLowerCase() === heading.toLowerCase())?.id;
}

export { loadConfig, basename, dirname };
