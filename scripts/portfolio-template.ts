// npm run portfolio-template [--name portfolio-classic]
// Builds the portfolio template templates/<name>/ (template.docx, style-map.yaml, fixes.yaml) as a flowing Word
// document with the look recorded from the April 2025 portfolio (specs/outputs/portfolio.md 5a): a coral-red cover
// banner, Superclarendon titles, Charter text, teal Avenir Next labels. The original Pages file is a free-form layout
// that the paragraph-based template importer can't take over (plan 9e P2/P4), so the template is generated instead.
// The style map starts with approved: false; it is approved only after the user has seen the previews.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { escapeXml } from "./lib/docx.ts";
import { isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

const CORAL = "F46B75";
const TEAL = "077482";
const GREY = "555555";
// Fonts. The April 2025 portfolio used Superclarendon for titles, but Pages doesn't apply Superclarendon to text
// imported from Word under any name (tested 2026-10-23: it falls back to Times), so titles use Rockwell Bold, the
// closest slab serif that Pages, Word and the PDF all keep (specs/outputs/portfolio.md 5a).
const F = { title: "Rockwell", body: "Charter", label: "Avenir Next Medium", banner: "DIN Condensed" };
const PDF_FONTS: Record<string, string> = {};

// One sample paragraph per portfolio paragraph type, in this order (style-map.yaml sample indexes).
interface Sample { type: string; font: string; size: number; bold?: boolean; italic?: boolean; color?: string; fill?: string; align?: "center" | "left"; caps?: boolean; rule?: number; before?: number; after?: number; pageBreak?: boolean; keepNext?: boolean; bullet?: boolean }
export const SAMPLES: Sample[] = [
  { type: "cover_title", font: F.title, size: 84, bold: true, color: "FFFFFF", fill: CORAL, align: "center", rule: 2, before: 60, after: 0 },
  { type: "cover_name", font: F.title, size: 32, bold: true, color: "FFFFFF", fill: CORAL, align: "center", before: 80, after: 200 },
  { type: "cover_contact", font: F.banner, size: 24, color: "FFFFFF", fill: CORAL, align: "left", caps: true, rule: 4, before: 160, after: 100 },
  { type: "headline", font: F.body, size: 28, bold: true, color: TEAL, align: "center", before: 360, after: 240 },
  { type: "intro", font: F.body, size: 26, align: "center", before: 120, after: 240 },
  { type: "project_title", font: F.title, size: 32, bold: true, color: TEAL, align: "center", before: 0, after: 60, pageBreak: true, keepNext: true },
  { type: "project_meta", font: F.label, size: 22, color: GREY, align: "center", before: 0, after: 240, keepNext: true },
  { type: "section_label", font: F.label, size: 26, color: TEAL, align: "left", before: 240, after: 80, keepNext: true },
  { type: "body", font: F.body, size: 24, align: "left", before: 0, after: 120 },
  { type: "list_item", font: F.body, size: 24, align: "left", before: 0, after: 80, bullet: true },
  { type: "image", font: F.body, size: 24, align: "center", before: 120, after: 40, keepNext: true },
  { type: "caption", font: F.body, size: 20, italic: true, color: GREY, align: "center", before: 0, after: 200 },
  { type: "section_heading", font: F.title, size: 32, bold: true, color: TEAL, align: "left", before: 360, after: 160, keepNext: true },
  { type: "skills_line", font: F.body, size: 22, align: "left", before: 0, after: 100 },
  { type: "contact_line", font: F.body, size: 24, align: "left", before: 0, after: 120 },
];

// Page sizes in twips (A4 210 x 297 mm, Letter 8.5 x 11 in) with their margins.
export const SIZES = {
  a4: { width: 11906, height: 16838, margins: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
  letter: { width: 12240, height: 15840, margins: { top: 1080, bottom: 1080, left: 1080, right: 1080 } },
} as const;

function paragraph(s: Sample): string {
  const ppr = [
    s.keepNext ? '<w:keepNext w:val="1"/>' : "",
    s.pageBreak ? '<w:pageBreakBefore w:val="1"/>' : "",
    s.bullet ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : "",
    // a thin white rule under a cover row (rule = space in points; rows differ so Word doesn't merge their borders)
    s.rule ? `<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="${s.rule}" w:color="FFFFFF"/></w:pBdr>` : "",
    s.fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${s.fill}"/>` : "",
    `<w:spacing w:before="${s.before ?? 0}" w:after="${s.after ?? 0}"/>`,
    s.bullet ? '<w:ind w:left="360" w:hanging="360"/>' : "",
    `<w:jc w:val="${s.align ?? "left"}"/>`,
  ].join("");
  const rpr = `<w:rPr><w:rFonts w:ascii="${s.font}" w:hAnsi="${s.font}" w:cs="${s.font}"/>${s.bold ? "<w:b/>" : ""}${s.italic ? "<w:i/>" : ""}${s.caps ? "<w:caps/>" : ""}${s.color ? `<w:color w:val="${s.color}"/>` : ""}<w:sz w:val="${s.size}"/><w:szCs w:val="${s.size}"/></w:rPr>`;
  return `<w:p><w:pPr>${ppr}</w:pPr><w:r>${rpr}<w:t xml:space="preserve">${escapeXml(`{{${s.type}}}`)}</w:t></w:r></w:p>`;
}

export async function buildTemplateDocx(): Promise<Buffer> {
  const z = new JSZip();
  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  const NS = `${W} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"`;
  z.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`);
  z.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
  z.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`);
  z.file("word/styles.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${W}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${F.body}" w:hAnsi="${F.body}" w:cs="${F.body}"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>`);
  z.file("word/numbering.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering ${W}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr><w:rPr><w:rFonts w:ascii="${F.body}" w:hAnsi="${F.body}"/><w:color w:val="${TEAL}"/></w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`);
  const a4 = SIZES.a4;
  const sect = `<w:sectPr><w:pgSz w:w="${a4.width}" w:h="${a4.height}"/><w:pgMar w:top="${a4.margins.top}" w:right="${a4.margins.right}" w:bottom="${a4.margins.bottom}" w:left="${a4.margins.left}" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>`;
  z.file("word/document.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${NS}><w:body>${SAMPLES.map(paragraph).join("")}${sect}</w:body></w:document>`);
  return z.generateAsync({ type: "nodebuffer" });
}

export function styleMapYaml(name: string): string {
  const fonts = [...new Set(SAMPLES.map((s) => PDF_FONTS[s.font] ?? s.font))];
  return [
    `# Generated by npm run portfolio-template (specs/templates.md, specs/outputs/portfolio.md 5, 5a). Don't edit: change the generator.`,
    "schema_version: 1",
    `name: ${name}`,
    "kind: portfolio",
    "approved: false   # set only after the user approves the previews of npm run build:portfolio",
    "page:",
    `  width_twips: ${SIZES.a4.width}`,
    `  height_twips: ${SIZES.a4.height}`,
    "  margins_twips:",
    ...Object.entries(SIZES.a4.margins).map(([k, v]) => `    ${k}: ${v}`),
    "fonts:",
    ...fonts.map((f) => `  - ${f}`),
    "links:",
    `  color: "${TEAL.toLowerCase()}"`,
    "  underline: true",
    "paragraphs:",
    ...SAMPLES.flatMap((s, i) => [`  ${s.type}:`, `    sample: ${i}`]),
    "",
  ].join("\n");
}

export function fixesYaml(): string {
  const size = (k: keyof typeof SIZES) => `{ width_twips: ${SIZES[k].width}, height_twips: ${SIZES[k].height}, page_margins: { top: ${SIZES[k].margins.top}, bottom: ${SIZES[k].margins.bottom}, left: ${SIZES[k].margins.left}, right: ${SIZES[k].margins.right} } }`;
  return [
    "# Renderer fixes and page sizes for the portfolio template (specs/templates.md 3, specs/outputs/portfolio.md 5).",
    "- id: page-sizes",
    '  why: "The portfolio is built in A4 and Letter; each size gets its own page size and margins."',
    '  found: "2026-10-23"',
    "  set:",
    "    sizes:",
    `      a4: ${size("a4")}`,
    `      letter: ${size("letter")}`,
    "",
  ].join("\n");
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const name = (args.name as string) ?? "portfolio-classic";
  const dir = rootPath(loadConfig().paths.templates, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "template.docx"), await buildTemplateDocx());
  // Keep an approval the user already gave unless the samples changed.
  const smPath = join(dir, "style-map.yaml");
  const next = styleMapYaml(name);
  const old = existsSync(smPath) ? readFileSync(smPath, "utf8") : "";
  const approvedBefore = /^approved: true/m.test(old) && old.replace(/^approved.*$/gm, "") === next.replace(/^approved.*$/gm, "");
  writeFileSync(smPath, approvedBefore ? old : next);
  writeFileSync(join(dir, "fixes.yaml"), fixesYaml());
  console.log(`portfolio-template: templates/${name}/ written (${SAMPLES.length} sample paragraphs; ${approvedBefore ? "still approved" : "approved: false until you approve the previews"})`);
}
