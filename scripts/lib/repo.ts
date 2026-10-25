// Shared loader for the CV framework: config, summaries, facts, profile, skills and markets.
// Every script reads inputs through this module, so file formats are parsed in one place.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { relative, basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";

// CV_ROOT lets tests run scripts against a temporary copy of the repo.
export const ROOT = process.env.CV_ROOT ?? resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// True when the given module is the script being run (node/tsx <script>).
export function isMain(metaUrl: string): boolean {
  const main = !!process.argv[1] && metaUrl === pathToFileURL(resolve(process.argv[1])).href;
  // Every script run from the command line reports a failure as one clear line (CV_DEBUG=1 shows the stack).
  if (main && !process.listenerCount("uncaughtException")) {
    const name = basename(process.argv[1]).replace(/\.ts$/, "");
    const fail = (e: unknown) => {
      console.error(`${name}: ${errorMessage(e)}`);
      if (process.env.CV_DEBUG) console.error((e as Error)?.stack);
      process.exit(1);
    };
    process.on("uncaughtException", fail);
    process.on("unhandledRejection", fail);
  }
  return main;
}

// Paths given on the command line are relative to the repo root (CV_ROOT in tests).
export function cliPath(p: string): string {
  return resolve(ROOT, p);
}

export function rootPath(...parts: string[]): string {
  return join(ROOT, ...parts);
}

export function readYaml<T = any>(path: string): T {
  const text = readFileSync(path, "utf8");
  try {
    return parseYaml(text) as T;
  } catch (e) {
    throw new Error(`${relative(ROOT, path)}: invalid YAML (${(e as Error).message.split("\n")[0]})`);
  }
}

// One clear line for any error (missing files read as "file not found: <path>").
export function errorMessage(e: unknown): string {
  const err = e as NodeJS.ErrnoException;
  return err?.code === "ENOENT" && err.path ? `file not found: ${relative(ROOT, err.path)}` : err?.message ?? String(e);
}

// ---------- config ----------

export interface CvSection {
  id: string;
  heading: string;
  enabled: boolean;
  source: string;
  intro?: string;
  show_dates?: boolean;
}

export interface Config {
  schema_version: number;
  spelling: string;
  paths: Record<string, string>;
  output: Record<string, string>;
  default_template: string;
  pdf_exporters: string[];
  cv_sections: CvSection[];
  display: Record<string, string>;
  header: any;
  checks: any;
  secret_scan: { allow: string[]; internal_url_patterns: string[] };
  tags: string[];
}

export interface LocalConfig {
  repos?: Record<string, string>;
  backup_dir?: string;
  backup_password_env?: string;
  pdf_exporters?: string[];
}

export function loadConfig(): Config {
  return readYaml<Config>(rootPath("framework.config.yaml"));
}

export function loadLocalConfig(): LocalConfig | null {
  const p = rootPath("framework.local.yaml");
  return existsSync(p) ? readYaml<LocalConfig>(p) ?? {} : null;
}

// ---------- summaries ----------

export interface Contribution {
  number: string; // "4.2"
  title: string;
  removed: boolean;
  body: string;
  result?: string;
  tags: string[];
  source?: string; // "doc:<id>" for a contribution taken from an imported document (specs/sources-spec.md 4)
}

export interface ConfidentialityRule {
  term?: string;
  prefix?: string;
  url_pattern?: string;
  allow_in?: string[];
}

export interface Summary {
  file: string;
  id: string;
  frontMatter: Record<string, any>;
  sections: { number: number; title: string; text: string }[];
  contributions: Contribution[];
  confidentiality: ConfidentialityRule[];
  confidentialityNone: boolean;
  portfolio: PortfolioItem[]; // structured items of section 8 (specs/outputs/portfolio.md 3)
}

export interface PortfolioItem {
  kind: "image" | "link" | "demo";
  value: string; // image path (relative to portfolio/), URL, or demo note
  caption?: string; // image caption
  project?: string; // the portfolio page (portfolio_projects id) it belongs to, for a summary with several
  label?: string; // link text
  public: string | undefined; // "no" or "yes, confirmed by user YYYY-MM-DD"
  isPublic: boolean;
  line: number; // line inside section 8, for messages
}

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n?/;

export const SUMMARY_SECTIONS = [
  "Project overview",
  "Main features",
  "My role and responsibilities",
  "My contributions",
  "Technologies and frameworks",
  "Skills demonstrated",
  "Metrics and outcomes",
  "Portfolio material",
  "Confidentiality notes",
];

export function parseSummary(text: string, file = "<memory>"): Summary {
  const fm = text.match(FRONT_MATTER);
  if (!fm) throw new Error(`${file}: missing front matter`);
  const frontMatter = parseYaml(fm[1]) ?? {};
  const body = text.slice(fm[0].length);

  const sections: Summary["sections"] = [];
  const re = /^## (\d+)\. (.+)$/gm;
  const heads = [...body.matchAll(re)];
  heads.forEach((m, i) => {
    const start = m.index! + m[0].length;
    const end = i + 1 < heads.length ? heads[i + 1].index! : body.length;
    sections.push({ number: Number(m[1]), title: m[2].trim(), text: body.slice(start, end) });
  });

  const contribSection = sections.find((s) => s.number === 4);
  const contributions: Contribution[] = [];
  if (contribSection) {
    const items = contribSection.text.split(/^### /m).slice(1);
    for (const raw of items) {
      const firstLine = raw.split("\n", 1)[0];
      const m = firstLine.match(/^(4\.\d+)\s+(.*)$/);
      if (!m) continue;
      const removed = /\(removed\)/i.test(m[2]);
      const rest = raw.slice(firstLine.length);
      const tagsLine = rest.match(/^Tags:\s*(.+)$/m);
      const resultLine = rest.match(/^Result:\s*(.+)$/m);
      const sourceLine = rest.match(/^Source:\s*(.+)$/m);
      contributions.push({
        number: m[1],
        title: m[2].replace(/\s*\(removed\)\s*/i, "").trim(),
        removed,
        body: rest.replace(/^Tags:.*$/m, "").replace(/^Result:.*$/m, "").replace(/^Source:.*$/m, "").trim(),
        result: resultLine?.[1].trim(),
        tags: tagsLine ? tagsLine[1].split(",").map((t) => t.trim()).filter(Boolean) : [],
        ...(sourceLine ? { source: sourceLine[1].trim() } : {}),
      });
    }
  }

  const confSection = sections.find((s) => s.number === 9);
  const { rules, none } = parseConfidentiality(confSection?.text ?? "");

  return {
    file,
    id: frontMatter.id ?? basename(file, ".md"),
    frontMatter,
    sections,
    contributions,
    confidentiality: rules,
    confidentialityNone: none,
    portfolio: parsePortfolioItems(sections.find((x) => x.number === 8)?.text ?? ""),
  };
}

// Section 8 items: "- image: <path>" / "- link: <url>" / "- demo: <note>", each followed by indented
// "caption:", "label:" and "public:" lines. Free text around them stays as notes (specs/outputs/portfolio.md 3).
export const PUBLIC_YES = /^yes, confirmed by user \d{4}-\d{2}-\d{2}$/;
export function parsePortfolioItems(text: string): PortfolioItem[] {
  const out: PortfolioItem[] = [];
  let cur: PortfolioItem | null = null;
  text.split("\n").forEach((line, i) => {
    const item = line.match(/^- (image|link|demo):\s*(.+?)\s*$/);
    if (item) { cur = { kind: item[1] as PortfolioItem["kind"], value: unquote(item[2]), public: undefined, isPublic: false, line: i + 1 }; out.push(cur); return; }
    const field = line.match(/^\s+(caption|label|public|project):\s*(.+?)\s*$/);
    if (field && cur) {
      const v = unquote(field[2]);
      if (field[1] === "public") { cur.public = v; cur.isPublic = PUBLIC_YES.test(v); } else cur[field[1] as "caption" | "label" | "project"] = v;
      return;
    }
    if (line.trim() && !/^\s/.test(line)) cur = null; // a note ends the item
  });
  return out;
}

// Section 9 uses a YAML-like list: "- term: X", "- prefix: OR-", "- url_pattern: ...", optional "  allow_in: [...]".
function parseConfidentiality(text: string): { rules: ConfidentialityRule[]; none: boolean } {
  const rules: ConfidentialityRule[] = [];
  let current: ConfidentialityRule | null = null;
  for (const line of text.split("\n")) {
    const item = line.match(/^- (term|prefix|url_pattern):\s*(.+?)\s*(#.*)?$/);
    if (item) {
      current = { [item[1]]: unquote(item[2]) } as ConfidentialityRule;
      rules.push(current);
      continue;
    }
    const allow = line.match(/^\s+allow_in:\s*\[(.*)\]/);
    if (allow && current) current.allow_in = allow[1].split(",").map((s) => unquote(s.trim())).filter(Boolean);
  }
  return { rules, none: rules.length === 0 && /None known/i.test(text) };
}

function unquote(s: string): string {
  return s.replace(/^["']|["']$/g, "");
}

// Front-matter values to confirm (work-summary-spec 3): `<field>: <value>  # TODO (needs user input): confirm` on
// engagement, cv_section or period. YAML drops comments, so they're read from the raw text.
export const CONFIRM_FIELDS = ["engagement", "cv_section", "period"];
export function unconfirmedFields(text: string): string[] {
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  return CONFIRM_FIELDS.filter((f) => new RegExp(`^${f}:.*#\\s*TODO \\(needs user input\\): confirm`, "m").test(fm));
}

export function loadSummaries(cfg = loadConfig()): Summary[] {
  const dir = rootPath(cfg.paths.summaries);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => parseSummary(readFileSync(join(dir, f), "utf8"), join(cfg.paths.summaries, f)));
}

// ---------- facts, profile, skills, decisions, markets ----------

export interface Fact {
  id: string;
  fact: string;
  source: string;
  entry: string;
  tags: string[];
  team_size_led?: number;
}

export interface CvEntryFact {
  id: string;
  type: "cv_entry";
  role: string;
  client: string;
  cv_client_label: string;
  cv_location: string;
  engagement: string;
  period: { start: string; end: string };
  cv_section: string;
  show_dates_in_cv?: boolean;
  counts_as_experience?: boolean;
  team_size_led?: number;
  cv_order?: number;
  source: string;
}

export function loadConfirmed(cfg = loadConfig()): { raw: any; facts: Fact[]; entries: CvEntryFact[] } {
  const raw = readYaml(rootPath(cfg.paths.facts, "confirmed.yaml"));
  const all: any[] = raw?.facts ?? [];
  return {
    raw,
    facts: all.filter((f) => f.type !== "cv_entry"),
    entries: all.filter((f) => f.type === "cv_entry"),
  };
}

export const loadProfile = (cfg = loadConfig()) => readYaml(rootPath(cfg.paths.facts, "profile.yaml"));
export const loadSkills = (cfg = loadConfig()) => readYaml(rootPath(cfg.paths.facts, "skills.yaml"));
export const loadDecisions = (cfg = loadConfig()) => readYaml(rootPath(cfg.paths.facts, "decisions.yaml"));

export interface Market {
  id: string;
  default: boolean;
  file_suffix: string;
  header: { show_phone: boolean; show_availability: boolean; engagement_types?: string[]; show_time_zone_overlap: boolean; hide_headline_qualifier?: "none" | "master" | "all" };
  entries: { show_contract_suffix: boolean };
}

export function loadMarkets(cfg = loadConfig()): { file: string; market: Market }[] {
  const dir = rootPath(cfg.paths.markets);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => ({ file: join(cfg.paths.markets, f), market: readYaml<Market>(join(dir, f)) }));
}

// ---------- CV entries (summaries shown in the CV + cv_entry facts) ----------

export interface CvEntry {
  id: string;
  kind: "summary" | "fact";
  role: string;
  client: string;
  label: string;
  location: string;
  engagement: string;
  period: { start: string; end: string };
  section: string;
  showDates: boolean;
  titleSuffix: string; // before market filtering
  countsAsExperience: boolean;
  teamSizeLed: number;
  order?: number;
  maxBullets?: number;
  emphasis: string[];
}

export function loadEntries(cfg = loadConfig(), summaries = loadSummaries(cfg), confirmed = loadConfirmed(cfg)): CvEntry[] {
  const sectionDefaults = new Map(cfg.cv_sections.map((s) => [s.id, s]));
  const toEntry = (src: any, id: string, kind: CvEntry["kind"]): CvEntry => {
    const sec = sectionDefaults.get(src.cv_section);
    const contract = src.engagement === "contract";
    return {
      id,
      kind,
      role: src.role,
      client: src.client,
      label: src.cv_client_label,
      location: src.cv_location,
      engagement: src.engagement,
      period: src.period,
      section: src.cv_section,
      showDates: src.show_dates_in_cv ?? sec?.show_dates ?? true,
      titleSuffix: src.cv_title_suffix ?? (contract ? cfg.display.contract_suffix : ""),
      countsAsExperience: src.counts_as_experience ?? src.cv_section === "experience",
      teamSizeLed: src.team_size_led ?? 0,
      order: src.cv_order,
      maxBullets: src.cv_max_bullets,
      emphasis: src.cv_emphasis ?? [],
    };
  };
  const fromSummaries = summaries
    .filter((s) => s.frontMatter.show_in_cv !== false)
    .map((s) => toEntry(s.frontMatter, s.id, "summary"));
  const fromFacts = confirmed.entries.map((e) => toEntry(e, e.id, "fact"));
  return [...fromSummaries, ...fromFacts];
}

// Entries of one section, in CV order: cv_order first, then newest start date first.
export function sortEntries(entries: CvEntry[]): CvEntry[] {
  return [...entries].sort((a, b) => {
    if (a.order != null || b.order != null) return (a.order ?? 999) - (b.order ?? 999);
    return b.period.start.localeCompare(a.period.start);
  });
}
