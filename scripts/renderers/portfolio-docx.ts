// Portfolio Word renderer (specs/outputs/portfolio.md 5, plan 9e P4): fills a portfolio template's sample paragraphs
// (style map kind: portfolio) with portfolio/portfolio.md, embeds the images (converting formats Word can't show to
// PNG), starts each project and the skills overview on a new page, and sets the page size per output size.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { escapeXml, firstRunRPr, openDocx, pOpen, pPr, saveDocx } from "../lib/docx.ts";
import { loadConfig } from "../lib/repo.ts";
import { loadTemplate } from "./docx.ts";

export interface PortfolioRenderResult { paragraphs: number; images: number; links: number; warnings: string[] }
interface Size { width_twips: number; height_twips: number; page_margins?: Partial<Record<"top" | "bottom" | "left" | "right", number>> }

const MD_LINK_OR_URL = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)|https?:\/\/[^\s)]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const EMU_PER_TWIP = 635;

// Pixel size of a PNG or JPEG (enough to keep the aspect ratio).
export function imageSize(buf: Buffer): { w: number; h: number } | undefined {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return undefined;
}

// PNG and JPEG go in as they are; other formats (TIFF from Pages, GIF, WebP) are converted to PNG with macOS sips.
function loadImage(file: string): { data: Buffer; ext: "png" | "jpeg" } {
  const ext = extname(file).toLowerCase();
  if (ext === ".png") return { data: readFileSync(file), ext: "png" };
  if (ext === ".jpg" || ext === ".jpeg") return { data: readFileSync(file), ext: "jpeg" };
  const tmp = mkdtempSync(join(tmpdir(), "cv-img-"));
  try {
    const out = join(tmp, "img.png");
    const r = spawnSync("sips", ["-s", "format", "png", file, "--out", out], { encoding: "utf8" });
    if (r.status !== 0 || !existsSync(out)) throw new Error(`can't convert ${file} to PNG (sips: ${(r.stderr || r.error?.message || "").trim()}); export it as PNG or JPEG`);
    return { data: readFileSync(out), ext: "png" };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

export async function renderPortfolioDocx(markdown: string, mdFile: string, outPath: string, templateName: string, sizeId: string): Promise<PortfolioRenderResult> {
  const cfg = loadConfig();
  const { dir, styleMap, fixes } = loadTemplate(templateName, cfg);
  if ((styleMap as any).kind !== "portfolio") throw new Error(`template "${templateName}" isn't a portfolio template (style map kind: portfolio)`);
  const sizes = Object.assign({}, ...fixes.map((f: any) => f.set?.sizes ?? {})) as Record<string, Size>;
  const size = sizes[sizeId];
  if (!size) throw new Error(`template "${templateName}" has no page size "${sizeId}" (sizes: ${Object.keys(sizes).join(", ") || "none"})`);
  const doc = await openDocx(join(dir, "template.docx"));
  const warnings: string[] = [];
  const sample = (type: string) => { const p = styleMap.paragraphs[type]; return p ? doc.paragraphs[p.sample] : undefined; };

  // ----- page size and margins -----
  doc.tail = doc.tail.replace(/<w:pgSz [^>]*\/>/, `<w:pgSz w:w="${size.width_twips}" w:h="${size.height_twips}"/>`);
  for (const [side, v] of Object.entries(size.page_margins ?? {})) doc.tail = doc.tail.replace(/<w:pgMar [^>]*\/>/, (m) => m.replace(new RegExp(`w:${side}="\\d+"`), `w:${side}="${v}"`));
  const margin = (side: "left" | "right" | "top" | "bottom") => Number(doc.tail.match(new RegExp(`<w:pgMar [^>]*w:${side}="(\\d+)"`))?.[1] ?? 1134);
  const contentW = size.width_twips - margin("left") - margin("right");
  const contentH = size.height_twips - margin("top") - margin("bottom");

  // ----- relationships: hyperlinks and images -----
  let rels = await doc.zip.file("word/_rels/document.xml.rels")!.async("string");
  let relN = 0;
  const linkIds = new Map<string, string>();
  const relFor = (target: string) => {
    if (!linkIds.has(target)) {
      const id = `rIdPf${++relN}`;
      rels = rels.replace("</Relationships>", `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${escapeXml(target)}" TargetMode="External"/></Relationships>`);
      linkIds.set(target, id);
    }
    return linkIds.get(target)!;
  };
  let images = 0;
  // Images: consecutive screenshots share one row (as in the April 2025 portfolio), scaled to the same height, the
  // row fitting the content width and at most 30% of the content height, and never larger than 150 dpi
  // (1440 / 150 = 9.6 twips per pixel): a small screenshot is printed smaller rather than blurry.
  const loadMedia = (path: string) => {
    const abs = resolve(dirname(mdFile), path);
    if (!existsSync(abs)) { warnings.push(`image not found: ${path}`); return undefined; }
    const img = loadImage(abs);
    const px = imageSize(img.data);
    if (!px) { warnings.push(`can't read the size of ${path}`); return undefined; }
    return { ...img, px, path };
  };
  const drawing = (media: { data: Buffer; ext: string }, alt: string, wTw: number, hTw: number): string => {
    const n = ++images;
    const name = `media/portfolio${n}.${media.ext}`;
    doc.zip.file(`word/${name}`, media.data);
    const id = `rIdPfImg${n}`;
    rels = rels.replace("</Relationships>", `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${name}"/></Relationships>`);
    const cx = Math.round(wTw * EMU_PER_TWIP), cy = Math.round(hTw * EMU_PER_TWIP);
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${1000 + n}" name="Picture ${n}" descr="${escapeXml(alt)}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${1000 + n}" name="portfolio${n}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  };
  const imageRow = (items: { path: string; alt: string }[]): string | undefined => {
    const media = items.map((it) => ({ it, m: loadMedia(it.path) })).filter((x) => x.m) as { it: { path: string; alt: string }; m: NonNullable<ReturnType<typeof loadMedia>> }[];
    if (!media.length) return undefined;
    const gap = 144; // 0.1 inch between screenshots
    const ratios = media.map((x) => x.m.px.w / x.m.px.h);
    const h = Math.min(contentH * 0.3, (contentW - gap * (media.length - 1)) / ratios.reduce((a, b) => a + b, 0), ...media.map((x) => x.m.px.h * (1440 / 150)));
    const spacer = `<w:r><w:t xml:space="preserve">  </w:t></w:r>`;
    return media.map((x, k) => {
      const w = h * ratios[k];
      if (Math.max(w, h) / 1440 < 1.5) warnings.push(`image ${x.m.path} is small (${x.m.px.w}x${x.m.px.h} px: under 1.5 inches at 150 dpi); use a larger screenshot`);
      return drawing(x.m, x.it.alt, w, h);
    }).join(spacer);
  };

  // Bold in schema order (after rStyle/rFonts): Pages ignores rFonts that come after <w:b>, and a font without a
// system fallback (Superclarendon) then turns into Times. A sample's own bold stays.
  const rPrBold = (rpr: string, bold: boolean): string => {
    let r = rpr === "<w:rPr/>" ? "<w:rPr></w:rPr>" : rpr;
    if (!bold || /<w:b(?:\s[^>]*)?\/>/.test(r)) return r;
    const at = r.search(/<w:i[ \/>]|<w:iCs|<w:caps|<w:smallCaps|<w:strike|<w:color|<w:spacing|<w:sz |<w:szCs|<w:u |<w:lang|<\/w:rPr>/);
    return r.slice(0, at) + '<w:b w:val="1"/><w:bCs w:val="1"/>' + r.slice(at);
  };
  // ----- runs: **bold**, links, bare URLs and emails -----
  const linkRPr = (base: string) => rPrBold(base, false).replace(/<w:color w:val="[^"]*"\/>/, "").replace(/<w:u w:val="[^"]*"\/>/, "").replace("<w:rPr>", `<w:rPr><w:color w:val="${base.includes('w:val="FFFFFF"') ? "FFFFFF" : styleMap.links.color}"/>${styleMap.links.underline ? '<w:u w:val="single"/>' : ""}`);
  const runs = (text: string, base: string, forceBold = false): string => {
    const out: string[] = [];
    const plain = (t: string, bold: boolean) => { if (t) out.push(`<w:r>${rPrBold(base, bold || forceBold)}<w:t xml:space="preserve">${escapeXml(t)}</w:t></w:r>`); };
    text.split("**").forEach((part, i) => {
      const bold = i % 2 === 1;
      let last = 0;
      for (const m of part.matchAll(MD_LINK_OR_URL)) {
        plain(part.slice(last, m.index), bold);
        const label = m[1] ?? m[0];
        const target = m[2] ?? (m[0].startsWith("http") ? m[0] : `mailto:${m[0]}`);
        out.push(`<w:hyperlink r:id="${relFor(target)}"><w:r>${linkRPr(base)}<w:t xml:space="preserve">${escapeXml(label)}</w:t></w:r></w:hyperlink>`);
        last = m.index! + m[0].length;
      }
      plain(part.slice(last), bold);
    });
    return out.join("");
  };
  const para = (type: string, text: string, inner?: string): string | undefined => {
    const s = sample(type) ?? sample("body");
    if (!s) return undefined;
    if (!sample(type)) warnings.push(`template "${templateName}" has no sample for ${type}; used body`);
    return `${pOpen(s)}${pPr(s)}${inner ?? runs(text, firstRunRPr(s))}</w:p>`;
  };
  const withPageBreak = (p: string) => (p.includes("<w:pageBreakBefore") ? p : p.replace("<w:pPr>", '<w:pPr><w:pageBreakBefore w:val="1"/>'));

  // ----- walk the Markdown, block by block -----
  const body: string[] = [];
  const push = (p: string | undefined) => { if (p) body.push(p); };
  let block = "";
  let inProject = false;
  let row: { path: string; alt: string }[] = [];
  let captions: string[] = [];
  const flushRow = () => {
    if (row.length) { const r = imageRow(row); if (r) push(para("image", "", r)); }
    if (captions.length) push(para("caption", captions.join("; ")));
    row = []; captions = [];
  };
  let headline: string | undefined;
  for (const raw of markdown.split("\n")) {
    const g = raw.match(/^<!--\s*(\/?)generated:([\w/-]+)\s*-->$/);
    if (g) {
      if (g[1] && g[2].startsWith("media-")) flushRow();
      block = g[1] ? "" : g[2];
      if (!g[1] && block === "portfolio-cover") push(para("cover_contact", "", ""));    // banner padding above
      if (g[1] && g[2] === "portfolio-cover") { push(para("cover_contact", "", "")); push(headline); headline = undefined; } // and below, then the headline
      continue;
    }
    if (/^<!--\s*project:/.test(raw)) { inProject = true; continue; }
    const line = raw.replace(/[ \t]*<!--[\s\S]*?-->/g, "").trimEnd();
    if (!line.trim()) continue;
    let m: RegExpMatchArray | null;
    if (block === "portfolio-cover") {
      if ((m = line.match(/^# \*\*(.+)\*\*$/))) push(para("cover_title", m[1]));
      else if ((m = line.match(/^## \*\*(.+)\*\*$/))) push(para("cover_name", m[1]));
      else if ((m = line.match(/^\*\*(.+)\*\*$/))) headline = para("headline", m[1]); // goes under the banner
      else push(para("cover_contact", line));
      continue;
    }
    if (block.startsWith("project-")) {
      if ((m = line.match(/^## \*\*(.+)\*\*$/))) { const p = para("project_title", m[1]); push(p ? withPageBreak(p) : p); } // each project starts a new page
      else if ((m = line.match(/^### \*\*(.+)\*\*$/))) push(para("project_meta", m[1]));
      else push(para("body", line));
      continue;
    }
    if (block.startsWith("media-")) {
      if ((m = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/))) row.push({ path: m[2], alt: m[1] });
      else if ((m = line.match(/^\*([^*].*[^*])\*$/))) captions.push(m[1]);
      else { flushRow(); push(para("body", line)); }
      continue;
    }
    if (block === "skills") {
      if ((m = line.match(/^## \*\*(.+)\*\*$/))) { const p = para("section_heading", m[1]); push(p ? withPageBreak(p) : p); }
      else push(para("skills_line", line));
      continue;
    }
    if (block === "contact") {
      if ((m = line.match(/^## \*\*(.+)\*\*$/))) push(para("section_heading", m[1]));
      else push(para("contact_line", line));
      continue;
    }
    // The agent's text: the intro before the first project, then each project's sections.
    if (!inProject) { push(para("intro", line)); continue; }
    if ((m = line.match(/^\*\*([^*]+)\*\*$/))) { push(para("section_label", m[1])); continue; }
    if ((m = line.match(/^\* (.*)$/))) { push(para("list_item", m[1])); continue; }
    push(para("body", line));
  }

  await saveDocx(doc, body.join(""), outPath, { "word/_rels/document.xml.rels": rels });
  return { paragraphs: body.length, images, links: linkIds.size, warnings };
}
