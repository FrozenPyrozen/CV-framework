// npm run lint [file] [--market <id>]
// Mechanical checks from specs/cv-spec.md: supported Markdown, forbidden characters, filler words, length,
// bold balance, generated parts up to date (header, entry lines, education, skills, languages), calculated
// values, the confidentiality blocklist and the secret scan.
// Without a file: lints the master CV, its market versions, every variant, and scans summary bodies.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { type Context, entriesForSection, loadContext, parseCv, stripComments } from "./lib/cvmd.ts";
import { masterCvPath, marketCvPath } from "./lib/paths.ts";
import { readState, sha } from "./lib/buildstate.ts";
import { type Summary, cliPath, isMain, loadConfig, loadMarkets, loadSummaries, rootPath } from "./lib/repo.ts";
import { parseArgs, refreshText } from "./refresh.ts";

export interface Finding { level: "error" | "warning"; file: string; line?: number; message: string }

// ---------- confidentiality and secrets (shared with summaries) ----------

interface Blocklist { terms: { term: string; allowIn: string[]; from: string }[]; prefixes: string[]; urlPatterns: RegExp[] }

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const globToRe = (g: string) => new RegExp(g.split("*").map(escapeRe).join(".*"), "i");

export function buildBlocklist(summaries: Summary[], ctx: Context): Blocklist {
  const bl: Blocklist = { terms: [], prefixes: [], urlPatterns: ctx.cfg.secret_scan.internal_url_patterns.map(globToRe) };
  for (const s of summaries) {
    for (const r of s.confidentiality) {
      if (r.term) bl.terms.push({ term: r.term, allowIn: r.allow_in ?? [], from: s.id });
      if (r.prefix) bl.prefixes.push(r.prefix);
      if (r.url_pattern) bl.urlPatterns.push(globToRe(r.url_pattern));
    }
  }
  // Hidden clients: the real client name must never appear when the CV label differs.
  for (const e of ctx.entries) if (e.client && e.label !== e.client) bl.terms.push({ term: e.client, allowIn: [], from: `${e.id} (hidden client)` });
  return bl;
}

const URL_RE = /\bhttps?:\/\/[^\s)<>]+/g;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

export function secretFindings(text: string, ctx: Context, allowedUrls: string[], opts: { checkUrls: boolean }): string[] {
  const out: string[] = [];
  const allow = new Set(ctx.cfg.secret_scan.allow);
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text)) out.push("private key");
  for (const m of text.matchAll(/\bAKIA[0-9A-Z]{16}\b/g)) if (!allow.has(m[0])) out.push(`AWS access key ${m[0].slice(0, 6)}…`);
  for (const m of text.matchAll(/\b(api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*["']?([^\s"']{6,})/gi)) if (!allow.has(m[2])) out.push(`credential assignment "${m[1]}=…"`);
  const urlsInText = new Set([...text.matchAll(URL_RE)].map((m) => m[0]));
  for (const m of text.matchAll(/[A-Za-z0-9_\-+/=]{32,}/g)) {
    const v = m[0];
    if (allow.has(v) || [...urlsInText].some((u) => u.includes(v) && allowedUrls.includes(u))) continue;
    const kinds = [/[a-z]/, /[A-Z]/, /\d/].filter((r) => r.test(v)).length;
    if (kinds === 3) out.push(`token-like string ${v.slice(0, 6)}…`);
  }
  for (const m of text.matchAll(EMAIL_RE)) if (m[0] !== ctx.profile.contacts.email && !allow.has(m[0])) out.push(`email address ${m[0]}`);
  if (opts.checkUrls) for (const u of urlsInText) if (!allowedUrls.includes(u) && !allow.has(u)) out.push(`URL not from profile.yaml: ${u}`);
  return out;
}

// ---------- CV lint ----------

export function lintCv(file: string, ctx: Context, summaries = loadSummaries(ctx.cfg)): Finding[] {
  const f: Finding[] = [];
  const rel = relative(rootPath(), file);
  const add = (level: Finding["level"], message: string, line?: number) => f.push({ level, file: rel, line: line === undefined ? undefined : line + 1, message });
  const text = readFileSync(file, "utf8");
  const { lines, sections } = parseCv(text);
  const { cfg } = ctx;

  // Generated parts up to date (header, headings, intro, entry lines, education, skills, languages).
  try {
    const { text: expected } = refreshText(text, ctx);
    if (expected !== text) {
      const exp = expected.split("\n");
      const at = lines.findIndex((l, i) => l !== exp[i]);
      add("error", `generated parts are out of date or edited by hand (first difference: "${(lines[at] ?? "").slice(0, 60)}" vs "${(exp[at] ?? "").slice(0, 60)}"); run npm run refresh`, at);
    }
  } catch (e) {
    add("error", `cannot check generated parts: ${(e as Error).message}`);
  }

  // Line rules.
  let inComment = false;
  lines.forEach((raw, i) => {
    if (inComment) { if (raw.includes("-->")) inComment = false; return; }
    if (raw.includes("<!--") && !raw.includes("-->")) { inComment = true; return; }
    const visible = stripComments(raw);
    if (!visible.trim()) return;
    if (/^#{4,}\s/.test(visible)) add("error", "only #, ## and ### headings are supported", i);
    if (/^\s*>/.test(visible)) add("error", "block quotes are not supported", i);
    if (/^\s*\|/.test(visible)) add("error", "tables are not supported", i);
    if (/^\s*\d+\.\s/.test(visible)) add("error", "numbered lists are not supported", i);
    if (/^\s+[*-]\s/.test(visible)) add("error", "nested lists are not supported", i);
    if (/^\s*-\s/.test(visible)) add("error", 'use "* " for bullets', i);
    if (/^(---|\*\*\*|___)\s*$/.test(visible)) add("error", "horizontal rules are not supported", i);
    if (/!\[/.test(visible)) add("error", "images are not supported", i);
    if (/`/.test(visible)) add("error", "code formatting is not supported", i);
    if (/<\/?[a-z][^>]*>/i.test(visible)) add("error", "raw HTML is not supported", i);
    const noBold = visible.replace(/\*\*/g, "").replace(/^\* /, "");
    if (/(^|[^\w*])\*[^*\s][^*]*\*(?!\w)/.test(noBold) || /(^|\s)_[^_\s][^_]*_(\s|$|[.,])/.test(noBold)) add("error", "italics are not supported", i);
    if (((visible.match(/\*\*/g) ?? []).length) % 2) add("error", "unbalanced ** (bold)", i);
    const noUrls = visible.replace(URL_RE, "");
    for (const ch of cfg.checks.forbidden_chars) if (noUrls.includes(ch)) add("error", `forbidden character "${ch}"`, i);
    for (const w of cfg.checks.filler_words) if (new RegExp(`\\b${escapeRe(w)}\\b`, "i").test(noUrls)) add("warning", `filler word "${w}"`, i);
    if (/^\* /.test(visible)) {
      const words = visible.slice(2).replace(/\*\*/g, "").split(/\s+/).filter(Boolean).length;
      if (words > cfg.checks.max_bullet_words) add("warning", `bullet has ${words} words (max ${cfg.checks.max_bullet_words})`, i);
    }
  });

  // Length.
  const words = stripComments(text).replace(/[#*]/g, " ").split(/\s+/).filter(Boolean).length;
  const maxWords = (ctx.roleProfile?.max_words as number | undefined) ?? cfg.checks.max_words;
  if (words > maxWords) add("error", `${words} words (max ${maxWords})`);

  // Calculated values in the summary paragraph.
  const summary = sections.find((s) => s.heading.toUpperCase() === "SUMMARY");
  for (const p of summary?.paragraphs ?? []) {
    const visible = stripComments(p.text);
    for (const m of visible.matchAll(/(\d+)\+ years/g)) if (Number(m[1]) !== ctx.calculated.years_experience) add("error", `"${m[0]}" but the calculated value is ${ctx.calculated.years_experience}+ years`, p.line);
    for (const m of visible.matchAll(/up to (\d+) (?:developers|engineers)/gi)) if (Number(m[1]) !== ctx.calculated.team_size_led) add("error", `"${m[0]}" but the largest team led is ${ctx.calculated.team_size_led}`, p.line);
    for (const m of visible.matchAll(/led a team of (\d+) (?:developers|engineers)/gi)) if (Number(m[1]) > ctx.calculated.team_size_led) add("error", `"${m[0]}" exceeds the largest team led (${ctx.calculated.team_size_led})`, p.line);
  }

  // Section order (specs/cv-spec.md 2): enabled cv_sections in config order (or the role profile's include_sections).
  const wanted = (ctx.roleProfile?.include_sections as string[] | undefined) ?? cfg.cv_sections.filter((d) => d.enabled).map((d) => d.id);
  const order = cfg.cv_sections.map((d) => d.id).filter((id) => wanted.includes(id));
  const found = sections.map((sec) => cfg.cv_sections.find((d) => d.heading.toLowerCase() === sec.heading.toLowerCase())?.id).filter((x): x is string => !!x);
  if (found.join() !== order.join()) add("error", `sections must be, in order: ${order.join(", ")} (found: ${found.join(", ")})`);

  // Entry order (specs/cv-spec.md 2.3) and the current job's Stack line (section 3).
  // cv_max_bullets (master CV) / max_bullets_per_entry (role profile); the Stack line doesn't count.
  for (const sec of sections) {
    const id = cfg.cv_sections.find((d) => d.heading.toLowerCase() === sec.heading.toLowerCase())?.id;
    if (!id) continue;
    const actual = sec.entries.map((e) => e.id).filter((x): x is string => !!x);
    const expected = entriesForSection(ctx, id).map((e) => e.id).filter((x) => actual.includes(x));
    if (actual.join() !== expected.join()) add("error", `entries in ${sec.heading} are out of order: expected ${expected.join(", ")} (cv_order, then newest first)`, sec.line);
    for (const e of sec.entries) {
      const entry = ctx.entries.find((x) => x.id === e.id);
      if (entry?.period.end === "present" && id === "experience" && !e.bullets.some((b) => /^Stack:/.test(b.text))) add("warning", `current job ${e.id} has no "Stack:" bullet`, e.titleLine);
      const limit = ((e.id ? ctx.roleProfile?.entry_max_bullets?.[e.id] : undefined) as number | undefined) ?? (ctx.roleProfile?.max_bullets_per_entry as number | undefined) ?? entry?.maxBullets;
      const n = e.bullets.filter((b) => !/^Stack:/.test(b.text)).length;
      if (limit && n > limit) add("error", `${e.id} has ${n} bullets (limit ${limit})`, e.titleLine);
    }
  }

  // Confidentiality blocklist.
  const bl = buildBlocklist(summaries, ctx);
  let currentEntry = "";
  lines.forEach((raw, i) => {
    const em = raw.match(/^<!-- entry: ([\w-]+) -->$/);
    if (em) { currentEntry = em[1]; return; }
    const h1 = raw.match(/^# \*\*(.+)\*\*/);
    if (h1) currentEntry = h1[1].toUpperCase() === "SUMMARY" ? "summary" : "";
    const visible = stripComments(raw);
    for (const t of bl.terms) {
      if (t.allowIn.includes(currentEntry)) continue;
      if (new RegExp(`(?<![\\w-])${escapeRe(t.term)}(?![\\w-])`).test(visible)) add("error", `confidential term "${t.term}" (from ${t.from})`, i);
    }
    for (const p of bl.prefixes) if (new RegExp(`(?<![\\w-])${escapeRe(p)}\\d`).test(visible)) add("error", `ticket id with prefix "${p}"`, i);
    for (const re of bl.urlPatterns) if (re.test(visible)) add("error", `internal address matching ${re.source}`, i); // URLs, git remotes, hostnames
  });

  // Secrets and foreign URLs/emails.
  const profileUrls = (ctx.profile.contacts.links ?? []).map((l: any) => l.url);
  for (const s of secretFindings(stripComments(text), ctx, profileUrls, { checkUrls: true })) add("error", `secret scan: ${s}`);

  // Variants are generated: a hand edit since the last build would be lost on the next /variants run.
  if (file.startsWith(rootPath(cfg.output.variants_dir) + "/") && !/\/markets\//.test(file)) {
    const rec = readState()[relative(rootPath(), file)];
    if (rec && sha(file) !== rec.md_sha) add("warning", "edited by hand since its last build; variants are rebuilt by /variants, so put lasting changes in the role profile's overrides");
  }

  // Market: hidden contact details must not appear (plan 6.2, cv-spec 14).
  if (!ctx.market.header.show_phone && ctx.profile.contacts.phone) {
    const digits = ctx.profile.contacts.phone.replace(/\D/g, "");
    if (stripComments(text).replace(/\D/g, "").includes(digits)) add("error", `phone number appears although market "${ctx.market.id}" hides it`);
  }
  return f;
}

// ---------- summaries (secret scan of bodies; front matter repo entries are names only, checked by the schema) ----------

export function lintSummaries(ctx: Context, summaries = loadSummaries(ctx.cfg)): Finding[] {
  const f: Finding[] = [];
  const bl = buildBlocklist(summaries, ctx);
  for (const s of summaries) {
    const body = s.sections.filter((x) => x.number !== 9).map((x) => x.text).join("\n");
    for (const hit of secretFindings(body, ctx, [], { checkUrls: false })) f.push({ level: "error", file: s.file, message: `secret scan: ${hit}` });
    for (const line of body.split("\n")) for (const re of bl.urlPatterns) if (re.test(line)) f.push({ level: "error", file: s.file, message: `internal address in summary body: "${line.trim().slice(0, 60)}"` });
  }
  return f;
}

// ---------- CLI ----------

function marketFromPath(file: string): string | undefined {
  return file.match(/\/markets\/([\w-]+)\/[^/]+\.md$/)?.[1];
}

export function defaultLintTargets(): { file: string; market?: string }[] {
  const cfg = loadConfig();
  const targets: { file: string; market?: string }[] = [];
  const add = (file: string) => {
    if (!existsSync(file)) return;
    targets.push({ file });
    for (const { market } of loadMarkets(cfg)) {
      if (market.default) continue;
      const m = marketCvPath(file, market);
      if (existsSync(m)) targets.push({ file: m, market: market.id });
    }
  };
  add(masterCvPath());
  const vdir = rootPath(cfg.output.variants_dir);
  if (existsSync(vdir)) for (const d of readdirSync(vdir)) add(join(vdir, d, "cv.md"));
  const tdir = rootPath(cfg.output.tailored_dir);
  if (existsSync(tdir)) for (const d of readdirSync(tdir)) add(join(tdir, d, "cv.md"));
  return targets;
}

export function printFindings(findings: Finding[]): void {
  for (const x of findings) console.log(`${x.level === "error" ? "ERROR" : "warn "}  ${x.file}${x.line ? `:${x.line}` : ""}: ${x.message}`);
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const targets = positional[0]
    ? [{ file: cliPath(positional[0]), market: (args.market as string) ?? marketFromPath(cliPath(positional[0])) }]
    : defaultLintTargets();
  const findings: Finding[] = [];
  for (const t of targets) findings.push(...lintCv(t.file, loadContext({ market: t.market, cvFile: t.file, profileId: args.profile as string | undefined })));
  if (!positional[0]) findings.push(...lintSummaries(loadContext()));
  printFindings(findings);
  const errors = findings.filter((x) => x.level === "error").length;
  console.log(`\nlint: ${targets.length} CV file(s)${positional[0] ? "" : " + summaries"}, ${errors} error(s), ${findings.length - errors} warning(s)`);
  if (errors) process.exit(1);
}
