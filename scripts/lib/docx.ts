// Word (.docx) helpers: open/save the zip, split document.xml into top-level paragraphs, and small XML
// utilities. Word files are edited as XML strings, never re-serialized, so unknown markup survives intact.
import JSZip from "jszip";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export interface DocxParts {
  zip: JSZip;
  head: string; // document.xml up to and including <w:body>
  paragraphs: string[]; // top-level body paragraphs (nested paragraphs in text boxes stay inside their parent)
  tail: string; // <w:sectPr ...> to the end
}

export async function openDocx(path: string): Promise<DocxParts> {
  const zip = await JSZip.loadAsync(readFileSync(path));
  const doc = await zip.file("word/document.xml")!.async("string");
  const b0 = doc.indexOf("<w:body>") + "<w:body>".length;
  const b1 = doc.lastIndexOf("<w:sectPr");
  return { zip, head: doc.slice(0, b0), paragraphs: splitParagraphs(doc.slice(b0, b1)), tail: doc.slice(b1) };
}

export function splitParagraphs(body: string): string[] {
  const out: string[] = [];
  const re = /<w:p(?=[ >])|<\/w:p>|<w:p\/>/g;
  let depth = 0, start = 0;
  for (let m; (m = re.exec(body)); ) {
    if (m[0] === "<w:p/>") { if (depth === 0) out.push(m[0]); continue; }
    if (m[0].startsWith("<w:p")) { if (depth === 0) start = m.index; depth++; }
    else if (--depth === 0) out.push(body.slice(start, m.index + m[0].length));
  }
  if (out.join("") !== body.replace(/\s+$/, "")) {
    // Anything other than paragraphs at body level (tables, bookmarks) is not supported in templates.
    const leftover = body.replace(/\s+$/, "").replace(out.join(""), "").trim();
    if (leftover) throw new Error(`document body contains non-paragraph content (tables or sections are not supported): ${leftover.slice(0, 80)}`);
  }
  return out;
}

export async function saveDocx(parts: DocxParts, body: string, path: string, extra: Record<string, string> = {}): Promise<void> {
  parts.zip.file("word/document.xml", parts.head + body + parts.tail);
  for (const [name, content] of Object.entries(extra)) parts.zip.file(name, content);
  const buf = await parts.zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  mkdirSync(dirname(path), { recursive: true }); // --out may name a folder that doesn't exist yet
  writeFileSync(path, buf);
}

export const paragraphText = (p: string) => unescapeXml([...p.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]).join(""));
export const pPr = (p: string) => p.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0] ?? "<w:pPr/>";
export const pOpen = (p: string) => p.match(/^<w:p[^>]*>/)![0].replace(/ w14:paraId="[^"]*"/, "").replace(/ w14:textId="[^"]*"/, "");
export const firstRunRPr = (p: string) => p.match(/<w:r(?:\s[^>]*)?>\s*(<w:rPr>[\s\S]*?<\/w:rPr>)/)?.[1] ?? "<w:rPr/>";
export const hasDrawing = (p: string) => p.includes("<w:drawing>");

export function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function unescapeXml(s: string): string {
  return s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
}

// rPr helpers: make bold / set size, keeping everything else.
export function rPrBold(rpr: string, bold: boolean): string {
  let r = rpr === "<w:rPr/>" ? "<w:rPr></w:rPr>" : rpr;
  r = r.replace(/<w:b(?:\s[^>]*)?\/>/g, "").replace(/<w:bCs(?:\s[^>]*)?\/>/g, "");
  return bold ? r.replace("<w:rPr>", '<w:rPr><w:b w:val="1"/><w:bCs w:val="1"/>') : r;
}

export function rPrSize(rpr: string, halfPoints: number): string {
  let r = rpr === "<w:rPr/>" ? "<w:rPr></w:rPr>" : rpr;
  r = r.replace(/<w:sz w:val="\d+"\/>/g, "").replace(/<w:szCs w:val="\d+"\/>/g, "");
  return r.replace("</w:rPr>", `<w:sz w:val="${halfPoints}"/><w:szCs w:val="${halfPoints}"/></w:rPr>`);
}

export function pPrJustify(ppr: string, jc: "left" | "center" | "right"): string {
  let p = ppr === "<w:pPr/>" ? "<w:pPr></w:pPr>" : ppr;
  // Remove paragraph-level jc only (not the one inside the paragraph mark's rPr, which has none).
  p = p.replace(/<w:jc w:val="[^"]*"\/>/, "");
  p = p.replace(/<w:ind [^>]*\/>/, '<w:ind w:left="0" w:right="0" w:firstLine="0"/>');
  const at = p.indexOf("<w:rPr>");
  const jcTag = `<w:jc w:val="${jc}"/>`;
  return at >= 0 ? p.slice(0, at) + jcTag + p.slice(at) : p.replace("</w:pPr>", `${jcTag}</w:pPr>`);
}
