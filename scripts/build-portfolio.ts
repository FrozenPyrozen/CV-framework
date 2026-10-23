// npm run build:portfolio [--size a4|letter|all] [--template <name>] [--no-pdf] [--no-pages]
// Builds the public portfolio (specs/outputs/portfolio.md 5–6, plan 9e P4): `portfolio check` (fails on errors),
// then for each page size a Word file from the portfolio template, a PDF through the PDF exporters, a PDF check
// (every word present, template fonts embedded, no garbled text, no phone unless decided, page limit) and page
// previews; plus a .pages copy (A4) through Pages when it is installed. Records the outputs for `status`.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import { exportPdf } from "./export-pdf.ts";
import { readState, sha, writeRecord } from "./lib/buildstate.ts";
import { markdownVisibleText, missingWords, normalizeText, tokens } from "./lib/text.ts";
import { isMain, loadConfig, loadDecisions, loadProfile, rootPath } from "./lib/repo.ts";
import { printFindings } from "./lint.ts";
import { checkPortfolio, portfolioPath, recordPortfolio } from "./portfolio.ts";
import { readPdf } from "./pdf-check.ts";
import { renderPreviews } from "./preview.ts";
import { parseArgs } from "./refresh.ts";
import { loadTemplate } from "./renderers/docx.ts";
import { renderPortfolioDocx } from "./renderers/portfolio-docx.ts";

export const PORTFOLIO_TEMPLATE = "portfolio-classic";
const rel = (p: string) => relative(rootPath(), p);

export function portfolioBaseName(): string {
  return `${loadProfile().name.replace(/\s+/g, "_")}_Portfolio`;
}

export async function checkPortfolioPdf(pdf: string, mdFile: string, templateName: string): Promise<{ ok: boolean; failures: string[]; notes: string[] }> {
  const cfg = loadConfig();
  const failures: string[] = [];
  const notes: string[] = [];
  const { pages, fonts } = await readPdf(pdf);
  const all = normalizeText(pages.join("\n"));
  if (all.replace(/\s/g, "").length < 100) failures.push("no selectable text (image-only PDF?)");
  // Every word of the visible Markdown (image lines are pictures, not text) appears in the PDF.
  const md = readFileSync(mdFile, "utf8").split("\n").filter((l) => !/^!\[/.test(l.trim())).join("\n");
  const missing = missingWords(tokens(markdownVisibleText(md)), tokens(pages.join("\n")));
  if (missing.length) failures.push(`${missing.length} word(s) of the Markdown are missing in the PDF: ${missing.slice(0, 15).join(", ")}${missing.length > 15 ? " …" : ""}`);
  const garbled = all.match(/[�-]/g);
  if (garbled) failures.push(`${garbled.length} garbled or private-use character(s)`);
  const sm = parseYaml(readFileSync(rootPath(cfg.paths.templates, templateName, "style-map.yaml"), "utf8"));
  const families = fonts.filter((f) => !f.includes("(not embedded)")).map((f) => f.replace(/[-,\s]/g, "").toLowerCase());
  for (const f of fonts.filter((x) => x.includes("(not embedded)"))) failures.push(`font ${f}: readers without it will substitute another font`);
  for (const f of sm.fonts as string[]) if (!families.some((x) => x.startsWith(f.replace(/\s+/g, "").toLowerCase()))) failures.push(`template font "${f}" is not embedded (fonts: ${fonts.join(", ") || "none"})`);
  // The link is public: no phone number unless decision portfolio-show-phone exists.
  const phone = loadProfile().contacts?.phone;
  const showPhone = (loadDecisions()?.decisions ?? []).some((d: any) => d.id === "portfolio-show-phone");
  if (phone && !showPhone && all.replace(/\D/g, "").includes(String(phone).replace(/\D/g, ""))) failures.push("the phone number appears in the public portfolio");
  const max = (cfg.checks as any).portfolio_max_pages ?? 40;
  if (pages.length > max) failures.push(`${pages.length} pages (limit checks.portfolio_max_pages = ${max})`);
  notes.push(`${pages.length} page(s); embedded fonts: ${fonts.join(", ")}`);
  return { ok: failures.length === 0, failures, notes };
}

// .pages copy through Pages (macOS), for editing by hand. A hand edit is never the source.
function savePages(docx: string, out: string): string | undefined {
  if (process.platform !== "darwin" || !existsSync("/Applications/Pages.app")) return "Pages isn't installed; no .pages copy";
  const script = `on run argv
  set inF to POSIX file (item 1 of argv)
  set outF to POSIX file (item 2 of argv)
  with timeout of 300 seconds
    tell application "Pages"
      set d to open inF
      save d in outF
      close d saving no
    end tell
  end timeout
end run`;
  rmSync(out, { recursive: true, force: true });
  const r = spawnSync("osascript", ["-e", script, docx, out], { encoding: "utf8", timeout: 330_000 });
  if (r.status !== 0 || !existsSync(out)) {
    spawnSync("osascript", ["-e", 'tell application "Pages" to quit saving no'], { timeout: 15_000 });
    return `Pages couldn't save the .pages copy: ${(r.stderr || r.error?.message || "").trim()}`;
  }
  return undefined;
}

export async function buildPortfolio(opts: { sizes?: string[]; template?: string; noPdf?: boolean; noPages?: boolean } = {}): Promise<boolean> {
  const cfg = loadConfig();
  const md = portfolioPath();
  const dir = rootPath(cfg.paths.portfolio ?? "portfolio");
  const template = opts.template ?? PORTFOLIO_TEMPLATE;
  const step = (s: string) => console.log(`   ${s}`);
  console.log(`build:portfolio ${rel(md)}`);
  const findings = await checkPortfolio(md);
  const errors = findings.filter((f) => f.level === "error");
  if (errors.length) { printFindings(findings); console.log(`   FAILED portfolio check: ${errors.length} error(s)`); return false; }
  step("portfolio check: ok");
  recordPortfolio(md);
  const { styleMap, fixes } = loadTemplate(template, cfg);
  if (!styleMap.approved) step(`note: template ${template} isn't approved yet (approve it after looking at the previews)`);
  const known = Object.keys(Object.assign({}, ...fixes.map((f: any) => f.set?.sizes ?? {})));
  const sizes = !opts.sizes || opts.sizes.includes("all") ? known : opts.sizes;
  for (const s of sizes) if (!known.includes(s)) { console.log(`   FAILED unknown size "${s}" (template ${template} has: ${known.join(", ")})`); return false; }
  const base = portfolioBaseName();
  const text = readFileSync(md, "utf8");
  const outputs: Record<string, string> = {};
  let ok = true;
  for (const size of sizes) {
    const docx = join(dir, `${base}_${size.toUpperCase()}.docx`);
    const r = await renderPortfolioDocx(text, md, docx, template, size);
    for (const w of r.warnings) step(`warning: ${w}`);
    outputs[rel(docx)] = sha(docx);
    step(`docx (${size}): ${rel(docx)} (${r.paragraphs} paragraphs, ${r.images} images, ${r.links} links)`);
    if (opts.noPdf) continue;
    const { pdf, exporter } = await exportPdf(docx);
    outputs[rel(pdf)] = sha(pdf);
    step(`pdf (${size}): ${rel(pdf)} via ${exporter}`);
    const c = await checkPortfolioPdf(pdf, md, template);
    const report = join(dir, `pdf-check-${size}.md`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(report, [`# PDF check: ${rel(pdf)}`, "", `Result: **${c.ok ? "pass" : "fail"}**`, "", ...c.failures.map((x) => `- FAIL: ${x}`), ...c.notes.map((x) => `- ${x}`), ""].join("\n"));
    step(`pdf-check (${size}): ${c.ok ? "pass" : `FAIL: ${c.failures[0]}`}`);
    if (!c.ok) ok = false;
    const previews = await renderPreviews(pdf, join(dir, "preview", size), 1.2);
    step(`preview (${size}): ${previews.length} page image(s) in ${rel(join(dir, "preview", size))}`);
  }
  if (!opts.noPages && sizes.includes("a4")) {
    const pages = join(dir, `${base}.pages`);
    const why = savePages(join(dir, `${base}_A4.docx`), pages);
    step(why ? `note: ${why}` : `pages: ${rel(pages)}`);
  }
  // Record what was built from which Markdown, so status can say when the outputs are older than portfolio.md.
  const key = rel(md);
  const rec = readState()[key];
  if (rec) writeRecord(md, { ...rec, template, outputs: { ...outputs, [`${key}#built`]: sha(md) } });
  console.log(ok ? "build:portfolio: done" : "build:portfolio: FAILED (see pdf-check)");
  return ok;
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const sizes = args.size ? String(args.size).split(",") : ["all"];
  const ok = await buildPortfolio({ sizes, template: args.template as string | undefined, noPdf: !!args["no-pdf"], noPages: !!args["no-pages"] });
  if (!ok) process.exit(1);
}
