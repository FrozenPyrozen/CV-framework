// npm run cover-letter -- refresh|check|build <dir> [--market <id>] [--no-pdf]
// The deterministic part of a cover letter (specs/outputs/cover-letter.md): `refresh` writes the generated header (and
// a skeleton when the letter doesn't exist yet), `check` enforces sources, confidentiality, length and spelling, and
// `build` renders it with the CV template, exports the PDF and checks it. The cover-letter agent writes the body.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { headerBlock, loadContext, parseCv, wrapBlock } from "./lib/cvmd.ts";
import { exportPdf } from "./export-pdf.ts";
import { type Finding, buildBlocklist, printFindings, secretFindings } from "./lint.ts";
import { readPdf } from "./pdf-check.ts";
import { renderPreviews } from "./preview.ts";
import JSZip from "jszip";
import { renderDocx, setSpacingAndIndent } from "./renderers/docx.ts";
import { cliPath, isMain, loadConfig, loadSummaries, rootPath } from "./lib/repo.ts";
import { normalizeText, splitSentences } from "./lib/text.ts";
import { parseArgs } from "./refresh.ts";
import { spellcheckText } from "./spellcheck.ts";
import { buildSourceIndex, sentencePieces } from "./trace.ts";

export const LETTER = "cover-letter.md";
const CLOSINGS = /^(Sincerely|Best regards|Kind regards|Regards),$/;
const HEADER = /<!-- generated:header -->\n[\s\S]*?<!-- \/generated:header -->/;
const rel = (p: string) => relative(rootPath(), p);

function context(dir: string, market?: string) {
  const cv = join(dir, "cv.md");
  if (!existsSync(cv)) throw new UsageError(`${rel(cv)} not found: run /tailor --jd for this job first (specs/outputs/cover-letter.md 1)`);
  return loadContext({ market, cvFile: cv });
}

const today = () => new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

// The header block for this letter: the same lines as its CV's header, for the same market and headline.
export function refreshLetter(dir: string, market?: string): { file: string; created: boolean; changed: boolean } {
  const ctx = context(dir, market);
  const file = join(dir, LETTER);
  const header = wrapBlock("header", headerBlock(ctx));
  if (!existsSync(file)) {
    const name = ctx.profile.name;
    writeFileSync(file, `${header}\n\n${today()}\n\nDear Hiring Team,\n\nTODO (cover-letter agent): the role and why you fit. <!-- src: jd -->\n\nTODO: the strongest matching evidence. <!-- src: -->\n\nTODO: availability and a short close. <!-- src: profile -->\n\nSincerely,\n${name}\n`);
    return { file, created: true, changed: true };
  }
  const text = readFileSync(file, "utf8");
  const next = HEADER.test(text) ? text.replace(HEADER, header) : `${header}\n\n${text}`;
  if (next !== text) writeFileSync(file, next);
  return { file, created: false, changed: next !== text };
}

interface Parts { header: string; body: { line: number; text: string }[]; other: { line: number; text: string }[] }

// Splits the letter into the header, the body paragraphs (what needs sources) and the date, greeting and closing.
export function letterParts(text: string): Parts {
  const lines = text.split("\n");
  const header = text.match(HEADER)?.[0] ?? "";
  const end = header ? text.slice(0, text.indexOf(header) + header.length).split("\n").length : 0;
  const body: Parts["body"] = [], other: Parts["other"] = [];
  let closing = false;
  for (let i = end; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (CLOSINGS.test(t)) { closing = true; other.push({ line: i, text: t }); continue; }
    if (closing || /^Dear\b.*,$/.test(t) || /^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(t)) { other.push({ line: i, text: t }); continue; }
    body.push({ line: i, text: lines[i] });
  }
  return { header, body, other };
}

const words = (s: string) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}.+#/'-]*/gu) ?? []).length;
const visible = (s: string) => s.replace(/<!--[\s\S]*?-->/g, "").replace(/\*\*/g, "");

export async function checkLetter(dir: string, market?: string): Promise<Finding[]> {
  const ctx = context(dir, market);
  const cfg = ctx.cfg;
  const file = join(dir, LETTER);
  if (!existsSync(file)) throw new UsageError(`${rel(file)} not found: run npm run cover-letter -- refresh ${rel(dir)}`);
  const f: Finding[] = [];
  const add = (level: Finding["level"], message: string, line?: number) => f.push({ level, file: rel(file), line: line === undefined ? undefined : line + 1, message });
  const text = readFileSync(file, "utf8");
  const { header, body, other } = letterParts(text);

  if (header !== wrapBlock("header", headerBlock(ctx))) add("error", "the header differs from the CV's for this market: run npm run cover-letter -- refresh (never edit it by hand)");
  if (!body.length) add("error", "no body paragraph");
  else if (body.length < 3 || body.length > 4) add("warning", `${body.length} body paragraphs (3 or 4 expected)`);

  // Sources: every body sentence has its own; `jd` needs the job ad; cited entries should be shown in the tailored CV.
  const idx = buildSourceIndex();
  const hasJd = existsSync(join(dir, "job-description.md"));
  const shown = new Set(parseCv(readFileSync(join(dir, "cv.md"), "utf8")).sections.flatMap((s) => s.entries.map((e) => e.id)).filter(Boolean));
  for (const p of body) {
    for (const piece of sentencePieces(p.text)) {
      if (!piece.src.length) { add("error", `sentence without a source: "${piece.text.slice(0, 70)}"`, p.line); continue; }
      const n = splitSentences(piece.text).filter((x) => x.trim()).length;
      if (n > 1) add("error", `${n - 1} sentence(s) without their own source before: "${piece.text.slice(0, 50)}"`, p.line);
      for (const id of piece.src) {
        if (id === "jd") { if (!hasJd) add("error", `source "jd" but ${rel(join(dir, "job-description.md"))} doesn't exist`, p.line); continue; }
        const r = idx.resolve(id);
        if (!r.ok) add("error", `source "${id}" doesn't resolve to a summary contribution, summary section or fact`, p.line);
        else if (r.entry && !shown.has(r.entry)) add("warning", `source "${id}" is from ${r.entry}, which the tailored CV doesn't show`, p.line);
      }
    }
  }

  // Confidentiality, secrets, characters, placeholders, filler and spelling variants, over everything but the header.
  const bl = buildBlocklist(loadSummaries(cfg), ctx);
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const p of [...body, ...other]) {
    const v = visible(p.text);
    for (const t of bl.terms) {
      if (t.allowIn.includes("cover-letter")) continue;
      if (new RegExp(`(?<![\\w-])${esc(t.term)}(?![\\w-])`, t.anyCase ? "i" : "").test(v)) add("error", `confidential term "${t.term}" (from ${t.from})`, p.line);
    }
    for (const pre of bl.prefixes) if (new RegExp(`(?<![\\w-])${esc(pre)}\\d`).test(v)) add("error", `ticket id with prefix "${pre}"`, p.line);
    for (const re of bl.urlPatterns) if (re.test(v)) add("error", `internal address matching ${re.source}`, p.line);
    for (const c of cfg.checks.forbidden_chars ?? []) if (v.includes(c)) add("error", `forbidden character "${c}"`, p.line);
    if (/\bTODO\b/.test(v)) add("error", "TODO left in the letter", p.line);
    for (const w of cfg.checks.filler_words ?? []) if (new RegExp(`\\b${esc(w)}\\b`, "i").test(v)) add("warning", `filler word "${w}" (checks.filler_words)`, p.line);
    for (const [bad, good] of Object.entries(cfg.checks.spelling_variants ?? {})) if (new RegExp(`\\b${esc(bad)}\\b`, "i").test(v)) add("warning", `"${bad}": use "${good}" (US English)`, p.line);
  }
  const profileUrls = (ctx.profile.contacts.links ?? []).map((l: any) => l.url);
  for (const s of secretFindings(visible([...body, ...other].map((p) => p.text).join("\n")), ctx, profileUrls, { checkUrls: true })) add("error", `secret scan: ${s}`);

  const count = body.reduce((n, p) => n + words(visible(p.text)), 0);
  const max = cfg.checks.cover_letter_max_words;
  if (max && count > max) add("error", `${count} words in the body (max ${max}, checks.cover_letter_max_words)`);

  for (const s of await spellcheckText(text.replace(HEADER, ""), rel(file))) add("error", `unknown word "${s.word}" (fix it or add it to facts/dictionary.txt)`);
  return f;
}

// The CV template's body paragraphs have no space between them, which suits bullets, not a letter: from the date line
// on, every paragraph gets space after it, and the date line some space above (twips; 20 = 1 pt).
export const LETTER_SPACING = { gap: 200, after_header: 360 };
async function letterSpacing(docx: string, firstLine: string | undefined): Promise<void> {
  if (!firstLine) return;
  const zip = await JSZip.loadAsync(readFileSync(docx));
  let xml = await zip.file("word/document.xml")!.async("string");
  const paras = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => m[0]);
  const textOf = (p: string) => [...p.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]).join("");
  const start = paras.findIndex((p) => textOf(p).trim() === firstLine.trim());
  if (start < 0) return;
  paras.slice(start).forEach((p, i) => {
    const after = CLOSINGS.test(textOf(p).trim()) ? 0 : LETTER_SPACING.gap; // the name sits right under "Sincerely,"
    xml = xml.replace(p, setSpacingAndIndent(p, i === 0 ? { before: LETTER_SPACING.after_header, after } : { after }));
  });
  zip.file("word/document.xml", xml);
  writeFileSync(docx, await zip.generateAsync({ type: "nodebuffer" }));
}

// Renders, exports and checks the letter: one page, every body sentence present in the PDF text.
export async function buildLetter(dir: string, opts: { market?: string; noPdf?: boolean } = {}): Promise<{ ok: boolean; docx: string; pdf?: string; findings: Finding[] }> {
  refreshLetter(dir, opts.market);
  const findings = await checkLetter(dir, opts.market);
  const ctx = context(dir, opts.market);
  const docx = join(dir, `${ctx.profile.name.replace(/\s+/g, "_")}_Cover_Letter${ctx.market.file_suffix ?? ""}.docx`);
  if (findings.some((x) => x.level === "error")) return { ok: false, docx, findings };
  const md = readFileSync(join(dir, LETTER), "utf8");
  await renderDocx(md, docx, ctx.cfg.default_template);
  await letterSpacing(docx, letterParts(md).other[0]?.text);
  if (opts.noPdf) return { ok: true, docx, findings };
  const { pdf } = await exportPdf(docx);
  const { pages } = await readPdf(pdf);
  const failures: string[] = [];
  if (pages.length !== 1) failures.push(`${pages.length} pages (a cover letter is one page)`);
  const all = normalizeText(pages.join(" ")).toLowerCase();
  for (const p of letterParts(md).body) for (const s of sentencePieces(p.text)) {
    const want = normalizeText(visible(s.text)).toLowerCase().slice(0, 40);
    if (want && !all.includes(want)) failures.push(`not found in the PDF text: "${want}"`);
  }
  const report = [`# Cover letter check: ${rel(pdf)}`, "", `Result: **${failures.length ? "fail" : "pass"}**`, "", `- ${pages.length} page(s)`, ...failures.map((x) => `- ${x}`), ""].join("\n");
  writeFileSync(join(dir, "cover-letter-check.md"), report);
  await renderPreviews(pdf, join(dir, "preview", "cover-letter"));
  for (const x of failures) findings.push({ level: "error", file: rel(pdf), message: x });
  return { ok: !failures.length, docx, pdf, findings };
}

export class UsageError extends Error {}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const [cmd, dirArg] = positional;
  const usage = "usage: npm run cover-letter -- refresh|check|build <cv/tailored/<company-role>> [--market <id>] [--no-pdf]";
  if (!["refresh", "check", "build"].includes(cmd ?? "") || !dirArg) { console.error(usage); process.exit(2); }
  const dir = cliPath(dirArg).replace(/\/(cv|cover-letter)\.md$/, "");
  const market = args.market as string | undefined;
  try {
    if (cmd === "refresh") {
      const r = refreshLetter(dir, market);
      console.log(`cover-letter: ${r.created ? "created" : r.changed ? "header refreshed in" : "no changes to"} ${rel(r.file)}`);
    } else if (cmd === "check") {
      const f = await checkLetter(dir, market);
      printFindings(f);
      const errors = f.filter((x) => x.level === "error").length;
      console.log(`cover-letter check: ${errors} error(s), ${f.length - errors} warning(s)`);
      process.exit(errors ? 1 : 0);
    } else {
      const r = await buildLetter(dir, { market, noPdf: !!args["no-pdf"] });
      printFindings(r.findings);
      console.log(r.ok ? `cover-letter: built ${rel(r.docx)}${r.pdf ? ` and ${rel(r.pdf)}` : ""}` : "cover-letter: not built (fix the errors above)");
      process.exit(r.ok ? 0 : 1);
    }
  } catch (e) {
    if (!(e instanceof UsageError)) throw e;
    console.error(`cover-letter: ${e.message}`);
    process.exit(2);
  }
}
