// npm run pdf-check <file.pdf> [--md <cv.md>] [--template <name>]
// Checks that a built PDF is ATS-readable and faithful to its Markdown (docs/scripts.md, plan R3, R4):
//   readable text, every section heading present (in order), no missing words, no garbled characters,
//   template fonts embedded (no substitutes), contact details on page 1 as the market requires,
//   hidden contact details absent, page count within the limit.
// Writes pdf-check.md next to the PDF; exits 1 on any failure.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import { loadContext, profileIdForFile } from "./lib/cvmd.ts";
import { cliPath, isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { markdownVisibleText, missingWords, normalizeText, tokens } from "./lib/text.ts";
import { parseArgs } from "./refresh.ts";
import { templateFor } from "./render.ts";

export interface PdfInfo { pages: string[]; fonts: string[] }

export async function readPdf(file: string): Promise<PdfInfo> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(readFileSync(file));
  const doc = await pdfjs.getDocument({ data, verbosity: 0, disableFontFace: true }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const tc = await (await doc.getPage(i)).getTextContent();
    let text = "";
    for (const it of tc.items as any[]) text += it.str + (it.hasEOL ? "\n" : "");
    pages.push(text);
  }
  // Embedded fonts: the fonts each page actually uses (works for compressed object streams too).
  const fonts = new Set<string>();
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const ops = await page.getOperatorList();
    ops.fnArray.forEach((fn: number, k: number) => {
      if (fn !== pdfjs.OPS.setFont) return;
      const f = page.commonObjs.get(ops.argsArray[k][0]) as any;
      if (f?.name && !f.missingFile) fonts.add(String(f.name).replace(/^[A-Z]{6}\+/, ""));
      else if (f?.name) fonts.add(`${String(f.name).replace(/^[A-Z]{6}\+/, "")} (not embedded)`);
    });
  }
  return { pages, fonts: [...fonts] };
}

// The Markdown a PDF was built from: <name>.md next to it, or cv.md in a variant folder.
export function markdownFor(pdf: string): string | undefined {
  const same = pdf.replace(/\.pdf$/i, ".md");
  if (existsSync(same)) return same;
  const cvmd = join(dirname(pdf), "cv.md");
  return existsSync(cvmd) ? cvmd : undefined;
}

export interface CheckResult { ok: boolean; failures: string[]; notes: string[] }

export async function checkPdf(pdf: string, mdFile: string, templateName?: string): Promise<CheckResult> {
  const failures: string[] = [];
  const notes: string[] = [];
  const cfg = loadConfig();
  const market = mdFile.match(/\/markets\/([\w-]+)\//)?.[1] ?? pdf.match(/\/markets\/([\w-]+)\//)?.[1];
  const ctx = loadContext({ market, cvFile: mdFile });
  const { pages, fonts } = await readPdf(pdf);
  const all = normalizeText(pages.join("\n"));
  const md = readFileSync(mdFile, "utf8");

  // 1. Readable text.
  if (all.replace(/\s/g, "").length < 200) failures.push("no selectable text (image-only PDF?): screening software can't read it");

  // 2. Section headings present, in order.
  const headings = [...md.matchAll(/^# \*\*(.+)\*\*\s*$/gm)].map((m) => normalizeText(m[1])).filter((h) => cfg.cv_sections.some((s) => s.heading.toLowerCase() === h.toLowerCase()));
  let pos = 0;
  for (const h of headings) {
    const at = all.indexOf(h, pos);
    if (at < 0) failures.push(`section heading "${h}" missing or out of order`);
    else pos = at;
  }

  // 3. Every word of the Markdown appears in the PDF (bag comparison after normalization).
  const missing = missingWords(tokens(markdownVisibleText(md)), tokens(pages.join("\n")));
  if (missing.length) failures.push(`${missing.length} word(s) of the Markdown are missing in the PDF: ${missing.slice(0, 15).join(", ")}${missing.length > 15 ? " …" : ""}`);

  // 4. Garbled characters.
  const garbled = all.match(/[\uFFFD\uE000-\uF8FF]/g);
  if (garbled) failures.push(`${garbled.length} garbled or private-use character(s)`);

  // 5. Fonts: the template's fonts must be embedded; anything else may be a substitute.
  const template = templateName ?? templateFor(mdFile); // the template the PDF was rendered with (--template)
  const sm = parseYaml(readFileSync(rootPath(cfg.paths.templates, template, "style-map.yaml"), "utf8"));
  const families = fonts.filter((f) => !f.includes("(not embedded)")).map((f) => f.split(/[-,]/)[0].replace(/MT$|PSMT$/, ""));
  for (const f of fonts.filter((x) => x.includes("(not embedded)"))) failures.push(`font ${f}: readers without it will substitute another font`);
  // A font the template uses only in its page headers and footers is not needed once fix strip_header_text empties them.
  const fixesFile = rootPath(cfg.paths.templates, template, "fixes.yaml");
  const stripsHeader = existsSync(fixesFile) && ((parseYaml(readFileSync(fixesFile, "utf8")) ?? []) as any[]).some((x) => x?.set?.strip_header_text);
  let bodyXml = "";
  if (stripsHeader) {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(readFileSync(rootPath(cfg.paths.templates, template, "template.docx")));
    for (const n of ["word/document.xml", "word/styles.xml"]) bodyXml += (await zip.file(n)?.async("string")) ?? "";
  }
  for (const f of sm.fonts as string[]) {
    if (families.some((x) => x.toLowerCase() === f.replace(/\s+/g, "").toLowerCase())) continue;
    if (stripsHeader && !bodyXml.includes(`"${f}"`)) notes.push(`template font "${f}" is used only in the emptied page header and footer, so it isn't embedded`);
    else failures.push(`template font "${f}" is not embedded (a substitute font was used: ${fonts.join(", ") || "none"})`);
  }
  const extra = fonts.filter((f) => !(sm.fonts as string[]).some((t) => f.toLowerCase().startsWith(t.replace(/\s+/g, "").toLowerCase())));
  if (extra.length) notes.push(`fonts not listed in the template: ${extra.join(", ")}`);

  // 6. Contact details: email (and the phone where the market shows it) on page 1; hidden ones absent.
  const p1 = normalizeText(pages[0] ?? "");
  const digits = (s: string) => s.replace(/\D/g, "");
  const onP1 = cfg.checks.contacts_on_page_1 !== false;
  if (onP1 && !p1.includes(ctx.profile.contacts.email)) failures.push("email is not on page 1");
  const phone = ctx.profile.contacts.phone;
  if (phone) {
    if (onP1 && ctx.market.header.show_phone && !digits(p1).includes(digits(phone))) failures.push("phone is not on page 1");
    if (!ctx.market.header.show_phone && digits(all).includes(digits(phone))) failures.push(`phone number appears although market "${ctx.market.id}" hides it`);
  }

  // 7. Page limit (role profile overrides config).
  const maxPages = (ctx.roleProfile?.max_pages as number | undefined) ?? cfg.checks.max_pages;
  if (pages.length > maxPages) failures.push(`${pages.length} pages (limit ${maxPages})`);
  notes.push(`${pages.length} page(s); words per page: ${pages.map((p) => tokens(p).length).join(", ")}`);
  notes.push(`embedded fonts: ${fonts.join(", ")}`);
  void profileIdForFile;
  return { ok: failures.length === 0, failures, notes };
}

export function writeReport(pdf: string, mdFile: string, r: CheckResult): string {
  const out = join(dirname(pdf), "pdf-check.md");
  const rel = (p: string) => relative(rootPath(), p);
  writeFileSync(out, [
    `# PDF check: ${basename(pdf)}`, "",
    `Source: ${rel(mdFile)} · Checked: ${new Date().toISOString().slice(0, 16).replace("T", " ")} · Result: **${r.ok ? "pass" : "fail"}**`, "",
    "## Failures", "", ...(r.failures.length ? r.failures.map((f) => `- ${f}`) : ["None."]), "",
    "## Notes", "", ...r.notes.map((n) => `- ${n}`), "",
  ].join("\n"));
  return out;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  if (!positional[0]) { console.error("usage: npm run pdf-check -- <file.pdf> [--md <cv.md>] [--template <name>]"); process.exit(2); }
  const pdf = cliPath(positional[0]);
  const md = args.md ? cliPath(args.md as string) : markdownFor(pdf);
  if (!md) { console.error(`pdf-check: can't find the Markdown for ${positional[0]}; pass --md`); process.exit(2); }
  const r = await checkPdf(pdf, md, args.template as string | undefined);
  const report = writeReport(pdf, md, r);
  for (const f of r.failures) console.log(`FAIL   ${f}`);
  for (const n of r.notes) console.log(`note   ${n}`);
  console.log(`\npdf-check: ${r.ok ? "pass" : "fail"} (${relative(rootPath(), report)})`);
  if (!r.ok) process.exit(1);
}
