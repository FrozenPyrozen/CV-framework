// npm run validate: checks every input against schemas/ and the cross-file rules from the specs.
// Exit code 1 on any error. Warnings don't fail. Runs `digest` afterwards when everything is valid.
import AjvModule from "ajv/dist/2020.js";

// ajv ships CommonJS; under ES modules the class may sit on .default.
const Ajv2020: typeof AjvModule.default = (AjvModule as any).default ?? AjvModule;
import { readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import {
  isMain, SUMMARY_SECTIONS, loadConfig, loadConfirmed, loadDecisions, loadMarkets, loadProfile, loadSkills, loadSummaries, rootPath,
} from "./lib/repo.ts";
import { writeDigests } from "./digest.ts";

export interface Issue { level: "error" | "warning"; file: string; message: string }

export function validateRepo(): Issue[] {
  const issues: Issue[] = [];
  const err = (file: string, message: string) => issues.push({ level: "error", file, message });
  const warn = (file: string, message: string) => issues.push({ level: "warning", file, message });

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  for (const f of readdirSync(rootPath("schemas"))) {
    ajv.addSchema(JSON.parse(readFileSync(rootPath("schemas", f), "utf8")));
  }
  const check = (schemaId: string, data: unknown, file: string) => {
    const fn = ajv.getSchema(schemaId)!;
    if (!fn(data)) for (const e of fn.errors ?? []) err(file, `${e.instancePath || "/"} ${e.message}${e.params && "additionalProperty" in e.params ? ` (${(e.params as any).additionalProperty})` : ""}`);
  };

  // --- config ---
  const cfg = loadConfig();
  check("config.schema.json", cfg, "framework.config.yaml");
  const tagSet = new Set(cfg.tags);
  if (tagSet.size !== cfg.tags.length) err("framework.config.yaml", "duplicate tags in the tag list");
  for (const t of cfg.tags) if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t)) err("framework.config.yaml", `tag "${t}" is not lowercase-kebab`);
  const sectionIds = new Set(cfg.cv_sections.map((s) => s.id));
  if (sectionIds.size !== cfg.cv_sections.length) err("framework.config.yaml", "duplicate cv_sections ids");
  const unknownTags = (tags: string[], file: string, where: string) => {
    for (const t of tags) if (!tagSet.has(t)) err(file, `${where}: tag "${t}" is not in the config tag list (propose it, then add it to framework.config.yaml)`);
  };

  // --- profile, skills, decisions ---
  const profile = loadProfile(cfg);
  check("profile.schema.json", profile, "facts/profile.yaml");
  const skills = loadSkills(cfg);
  check("skills.schema.json", skills, "facts/skills.yaml");
  const seenSkills = new Set<string>();
  for (const c of skills?.categories ?? []) for (const i of c.items ?? []) {
    unknownTags(i.tags ?? [], "facts/skills.yaml", `skill "${i.name}"`);
    const key = i.name.toLowerCase();
    if (seenSkills.has(key)) warn("facts/skills.yaml", `skill "${i.name}" appears more than once`);
    seenSkills.add(key);
  }
  const decisions = loadDecisions(cfg);
  check("decisions.schema.json", decisions, "facts/decisions.yaml");
  const decisionIds = (decisions?.decisions ?? []).map((d: any) => d.id);
  if (new Set(decisionIds).size !== decisionIds.length) err("facts/decisions.yaml", "duplicate decision ids");

  // --- summaries ---
  const summaries = loadSummaries(cfg);
  const allIds = new Map<string, string>();
  const claimId = (id: string, file: string) => {
    if (allIds.has(id)) err(file, `id "${id}" is already used in ${allIds.get(id)}`);
    else allIds.set(id, file);
  };
  for (const s of summaries) {
    check("summary.schema.json", s.frontMatter, s.file);
    claimId(s.id, s.file);
    if (s.id !== basename(s.file, ".md")) err(s.file, `id "${s.id}" doesn't match the file name`);
    const titles = s.sections.map((x) => `${x.number}. ${x.title}`);
    const expected = SUMMARY_SECTIONS.map((t, i) => `${i + 1}. ${t}`);
    if (titles.join("|") !== expected.join("|")) err(s.file, `sections must be exactly: ${expected.join(", ")} (found: ${titles.join(", ")})`);
    if (s.frontMatter.cv_section && !sectionIds.has(s.frontMatter.cv_section)) err(s.file, `cv_section "${s.frontMatter.cv_section}" is not in cv_sections`);
    const p = s.frontMatter.period;
    if (p?.end && p.end !== "present" && p.end < p.start) err(s.file, "period.end is before period.start");
    const nums = s.contributions.map((c) => Number(c.number.split(".")[1]));
    nums.forEach((n, i) => { if (n !== i + 1) err(s.file, `contributions must be numbered 4.1, 4.2 ... without gaps (found 4.${n} at position ${i + 1})`); });
    if (!s.contributions.length) err(s.file, "section 4 has no contributions");
    // Source-dependent rules (specs/work-summary-spec.md section 2)
    const fm = s.frontMatter;
    if (fm.source === "git") {
      if (!fm.harvested_at) err(s.file, "source: git needs harvested_at");
      if (!fm.repos?.length) err(s.file, "source: git needs at least one repo");
      for (const r of fm.repos ?? []) if (!r.remote || /TODO/.test(r.remote)) warn(s.file, `repo "${r.name}" has no remote URL yet (needed to clone it on another laptop)`);
    } else if (fm.harvested_at != null) {
      err(s.file, `harvested_at must be null for source: ${fm.source}`);
    }
    for (const c of s.contributions) {
      if (c.removed) continue;
      if (!c.tags.length) err(s.file, `contribution ${c.number} has no Tags line`);
      unknownTags(c.tags, s.file, `contribution ${c.number}`);
    }
    if (!s.confidentiality.length && !s.confidentialityNone) warn(s.file, `section 9 has no "- term:" / "- prefix:" entries and doesn't say "None known"`);
    for (const r of s.confidentiality) if (r.term && r.term.length < 3) warn(s.file, `confidentiality term "${r.term}" is very short and may cause false alarms`);
  }

  // --- confirmed facts ---
  const confirmed = loadConfirmed(cfg);
  check("confirmed.schema.json", confirmed.raw, "facts/confirmed.yaml");
  for (const e of confirmed.entries) {
    claimId(e.id, "facts/confirmed.yaml");
    if (!sectionIds.has(e.cv_section)) err("facts/confirmed.yaml", `${e.id}: cv_section "${e.cv_section}" is not in cv_sections`);
  }
  // A "(Contract)" suffix may only state what's true (specs/cv-spec.md 2.2).
  const suffixRule = (src: any, file: string, id: string) => {
    if (/contract/i.test(src.cv_title_suffix ?? "") && src.engagement !== "contract") err(file, `${id}: cv_title_suffix says contract but engagement is "${src.engagement}"`);
  };
  for (const s of summaries) suffixRule(s.frontMatter, s.file, s.id);
  for (const e of confirmed.entries) suffixRule(e, "facts/confirmed.yaml", e.id);
  const entryIds = new Set([...summaries.map((s) => s.id), ...confirmed.entries.map((e) => e.id)]);
  for (const f of confirmed.facts) {
    claimId(f.id, "facts/confirmed.yaml");
    if (f.entry && !entryIds.has(f.entry)) err("facts/confirmed.yaml", `${f.id}: entry "${f.entry}" is neither a summary id nor a cv_entry id`);
    unknownTags(f.tags ?? [], "facts/confirmed.yaml", `fact ${f.id}`);
  }

  // --- markets ---
  const markets = loadMarkets(cfg);
  const profileTypes: string[] = profile?.work?.engagement_types ?? [];
  for (const { file, market } of markets) {
    check("market.schema.json", market, file);
    if (market.id !== basename(file, ".yaml")) err(file, `id "${market.id}" doesn't match the file name`);
    for (const t of market.header?.engagement_types ?? []) {
      if (!profileTypes.includes(t)) err(file, `engagement type "${t}" isn't in profile.yaml work.engagement_types (a market may only hide or narrow)`);
    }
  }
  const defaults = markets.filter((m) => m.market.default);
  if (markets.length && defaults.length !== 1) err("markets/", `exactly one market must have default: true (found ${defaults.length})`);
  const suffixes = markets.map((m) => m.market.file_suffix);
  if (new Set(suffixes).size !== suffixes.length) err("markets/", "file_suffix values must be unique");

  return issues;
}

export function printIssues(issues: Issue[]): void {
  for (const i of issues) console.log(`${i.level === "error" ? "ERROR" : "warn "}  ${i.file}: ${i.message}`);
}

if (isMain(import.meta.url)) {
  const issues = validateRepo();
  printIssues(issues);
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.length - errors;
  if (errors) {
    console.log(`\nvalidate: ${errors} error(s), ${warnings} warning(s)`);
    process.exit(1);
  }
  const n = writeDigests();
  console.log(`\nvalidate: OK (${warnings} warning(s)); ${n} digest(s) written`);
}
