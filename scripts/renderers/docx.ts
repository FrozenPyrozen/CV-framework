// Template-driven Word renderer (specs/templates.md 5). Fills a template's sample paragraphs with the CV
// Markdown, creates real hyperlinks, applies the template's fixes.yaml, and writes the .docx.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { escapeXml, firstRunRPr, openDocx, pOpen, pPr, rPrBold, saveDocx } from "../lib/docx.ts";
import { type Config, loadConfig, rootPath } from "../lib/repo.ts";

interface StyleMap {
  name: string;
  approved: boolean;
  fonts: string[];
  links: { color: string; underline: boolean };
  paragraphs: Record<string, { sample: number; keep?: boolean; bold?: boolean; date_tab?: boolean }>;
  page?: { width_twips: number; margins_twips: { left: number; right: number } };
}

interface Fix { id: string; set: { bullet?: { indent_left: number; hanging: number; tab?: { type: string; pos: number } }; keep_with_next?: string[]; date_tab?: { align: "left" | "right"; pos: number }; keep_last_bullets_together?: number; keep_first_bullets_together?: number; paragraphs?: Record<string, { indent_left?: number; first_line?: number; before?: number; after?: number; line?: number }>; first_after_section_heading?: { before: number }; letter_spacing?: number; rule_full_width?: boolean; page_margins?: Partial<Record<"top" | "bottom" | "left" | "right", number>> } }

export interface RenderResult { paragraphs: number; links: number; warnings: string[] }

const MD_LINK_OR_URL = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)|https?:\/\/[^\s)]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const DATE_FIELD = /\b(19|20)\d{2}\b/;

export function loadTemplate(name: string, cfg: Config = loadConfig()) {
  const dir = rootPath(cfg.paths.templates, name);
  if (!existsSync(join(dir, "style-map.yaml"))) throw new Error(`template "${name}" not found (${cfg.paths.templates}/${name}/style-map.yaml)`);
  const styleMap = parseYaml(readFileSync(join(dir, "style-map.yaml"), "utf8")) as StyleMap;
  const fixes = existsSync(join(dir, "fixes.yaml")) ? (parseYaml(readFileSync(join(dir, "fixes.yaml"), "utf8")) as Fix[]) ?? [] : [];
  return { dir, styleMap, fixes };
}

export async function renderDocx(markdown: string, outPath: string, templateName: string): Promise<RenderResult> {
  const cfg = loadConfig();
  const { dir, styleMap, fixes } = loadTemplate(templateName, cfg);
  const doc = await openDocx(join(dir, "template.docx"));
  const warnings: string[] = [];
  const sample = (type: string): string | undefined => {
    const p = styleMap.paragraphs[type];
    return p ? doc.paragraphs[p.sample] : undefined;
  };

  // ----- fixes (applied to samples and numbering before filling) -----
  let keepLastBullets = 0;
  let letterSpacing = 0;
  let firstAfterHeading: number | undefined;
  let keepFirstBullets = 0;
  let numbering = doc.zip.file("word/numbering.xml") ? await doc.zip.file("word/numbering.xml")!.async("string") : undefined;
  for (const f of fixes) {
    // keep_with_next: the paragraph moves to the next page together with the one after it (no orphaned headings).
    for (const type of f.set.keep_with_next ?? []) {
      const idx = styleMap.paragraphs[type]?.sample;
      if (idx === undefined) continue;
      let p = doc.paragraphs[idx].replace(/<w:keepNext(?:\s[^>]*)?\/>/, "");
      p = /<w:pStyle [^>]*\/>/.test(p) ? p.replace(/(<w:pStyle [^>]*\/>)/, '$1<w:keepNext w:val="1"/>') : p.replace("<w:pPr>", '<w:pPr><w:keepNext w:val="1"/>');
      doc.paragraphs[idx] = p;
    }
    // date_tab: where the dates in entry detail lines sit (e.g. right-aligned at the margin).
    if (f.set.date_tab) {
      const idx = styleMap.paragraphs.entry_details?.sample;
      if (idx !== undefined) {
        const tab = `<w:tabs><w:tab w:val="${f.set.date_tab.align}" w:leader="none" w:pos="${f.set.date_tab.pos}"/></w:tabs>`;
        const p = doc.paragraphs[idx];
        doc.paragraphs[idx] = /<w:tabs>[\s\S]*?<\/w:tabs>/.test(p) ? p.replace(/<w:tabs>[\s\S]*?<\/w:tabs>/, tab) : p.replace(/(<w:pStyle [^>]*\/>(?:<w:keepNext[^>]*\/>)?)/, `$1${tab}`);
      }
    }
    // paragraphs: indentation and spacing per paragraph type (direct formatting overrides the Word style).
    for (const [type, v] of Object.entries(f.set.paragraphs ?? {})) {
      const idx = styleMap.paragraphs[type]?.sample;
      if (idx === undefined) continue;
      doc.paragraphs[idx] = setSpacingAndIndent(doc.paragraphs[idx], v);
    }
    // rule_full_width: the drawn line under section headings spans the whole text width (margin to margin).
    if (f.set.rule_full_width) {
      const idx = styleMap.paragraphs.section_rule?.sample;
      // Effective margins: the template's, overridden by any page_margins fix.
      const m = Object.assign({}, styleMap.page?.margins_twips, ...fixes.map((x) => x.set.page_margins ?? {}));
      const width = styleMap.page ? (styleMap.page.width_twips - m.left - m.right) * 635 : undefined;
      const old = idx !== undefined ? doc.paragraphs[idx].match(/<wp:extent cx="(\d+)"/)?.[1] : undefined;
      if (idx !== undefined && width && old) {
        const w = Number(old);
        doc.paragraphs[idx] = doc.paragraphs[idx]
          .replace(new RegExp(`"${w}"`, "g"), `"${width}"`)
          .replace(new RegExp(`"${w - 1}"`, "g"), `"${width - 1}"`);
      }
    }
    // page_margins: override the template's page margins (twips) in the section properties.
    for (const [side, v] of Object.entries(f.set.page_margins ?? {})) {
      doc.tail = doc.tail.replace(/<w:pgMar [^>]*\/>/, (m) => m.replace(new RegExp(`w:${side}="\\d+"`), `w:${side}="${v}"`));
    }
    if (f.set.letter_spacing) letterSpacing = f.set.letter_spacing;
    if (f.set.first_after_section_heading) firstAfterHeading = f.set.first_after_section_heading.before;
    if (f.set.keep_last_bullets_together) keepLastBullets = Math.max(keepLastBullets, f.set.keep_last_bullets_together);
    if (f.set.keep_first_bullets_together) keepFirstBullets = Math.max(keepFirstBullets, f.set.keep_first_bullets_together);
    const b = f.set.bullet;
    if (!b) continue;
    const idx = styleMap.paragraphs.bullet?.sample;
    if (idx === undefined) continue;
    const ind = `<w:ind w:left="${b.indent_left}" w:right="0" w:hanging="${b.hanging}"/>`;
    const tabs = b.tab ? `<w:tabs><w:tab w:val="${b.tab.type}" w:pos="${b.tab.pos}"/></w:tabs>` : "";
    let p = doc.paragraphs[idx].replace(/<w:ind [^>]*\/>/, ind).replace(/<w:tabs>[\s\S]*?<\/w:tabs>/, tabs);
    doc.paragraphs[idx] = p;
    const numId = p.match(/<w:numId w:val="(\d+)"\/>/)?.[1];
    if (numId && numbering) {
      const absId = numbering.match(new RegExp(`<w:num w:numId="${numId}"[^>]*>\\s*<w:abstractNumId w:val="(\\d+)"`))?.[1];
      if (absId) {
        numbering = numbering.replace(new RegExp(`(<w:abstractNum [^>]*w:abstractNumId="${absId}"[\\s\\S]*?<w:lvl w:ilvl="0"[\\s\\S]*?<w:pPr>)[\\s\\S]*?(</w:pPr>)`),
          `$1${tabs}<w:ind w:left="${b.indent_left}" w:hanging="${b.hanging}"/>$2`);
      }
    }
  }

  // ----- hyperlinks -----
  let rels = await doc.zip.file("word/_rels/document.xml.rels")!.async("string");
  let relCounter = 0;
  const linkIds = new Map<string, string>();
  const relFor = (target: string) => {
    if (linkIds.has(target)) return linkIds.get(target)!;
    const id = `rIdCv${++relCounter}`;
    rels = rels.replace("</Relationships>", `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${escapeXml(target)}" TargetMode="External"/></Relationships>`);
    linkIds.set(target, id);
    return id;
  };
  const linkRPr = (base: string) => {
    let r = rPrBold(base, false).replace(/<w:color w:val="[^"]*"\/>/, "").replace(/<w:u w:val="[^"]*"\/>/, "");
    return r.replace("<w:rPr>", `<w:rPr><w:color w:val="${styleMap.links.color}"/>${styleMap.links.underline ? '<w:u w:val="single"/>' : ""}`);
  };

  // ----- runs: **bold**, links ("Label: url" in contact lines becomes a link titled Label) -----
  const runs = (text: string, base: string, opts: { contact?: boolean; forceBold?: boolean } = {}): string => {
    const out: string[] = [];
    const plain = (t: string, bold: boolean) => { if (t) out.push(`<w:r>${rPrBold(base, bold || !!opts.forceBold)}<w:t xml:space="preserve">${escapeXml(t)}</w:t></w:r>`); };
    const link = (label: string, target: string) => {
      out.push(`<w:hyperlink r:id="${relFor(target)}"><w:r>${linkRPr(base)}<w:t xml:space="preserve">${escapeXml(label)}</w:t></w:r></w:hyperlink>`);
    };
    const parts = text.split("**");
    parts.forEach((part, i) => {
      const bold = i % 2 === 1;
      let last = 0;
      // [text](url) links first, then bare URLs and emails.
      for (const m of part.matchAll(MD_LINK_OR_URL)) {
        let before = part.slice(last, m.index);
        if (m[1] !== undefined) {
          plain(before, bold);
          link(m[1], m[2]);
          last = m.index! + m[0].length;
          continue;
        }
        const isEmail = !m[0].startsWith("http");
        let label = m[0];
        if (opts.contact && !isEmail) {
          // "Portfolio: https://..." in a contact line becomes a link whose text is "Portfolio".
          const lm = before.match(/(\s*)([^|:]+):\s*$/);
          if (lm) { label = lm[2].trim(); before = before.slice(0, lm.index) + lm[1]; }
        }
        plain(before, bold);
        link(label, isEmail ? `mailto:${m[0]}` : m[0]);
        last = m.index! + m[0].length;
      }
      plain(part.slice(last), bold);
    });
    return out.join("");
  };

  const para = (type: string, text: string, opts: { contact?: boolean } = {}): string | undefined => {
    const s = sample(type);
    if (!s) return undefined;
    const base = firstRunRPr(s);
    const forceBold = !!styleMap.paragraphs[type]?.bold;
    return `${pOpen(s)}${pPr(s)}${runs(text, base, { ...opts, forceBold })}</w:p>`;
  };
  const keep = (type: string) => sample(type);

  // ----- walk the Markdown -----
  const intros = new Set(cfg.cv_sections.map((s) => s.intro).filter(Boolean) as string[]);
  const educationHeading = cfg.cv_sections.find((s) => s.source === "profile.education")?.heading.toLowerCase();
  const body: string[] = [];
  const push = (x: string | undefined, what: string) => { if (x) body.push(x); else warnings.push(`template "${templateName}" has no sample for ${what}`); };
  let inHeader = false;
  let section = "";
  // Comments are removed together with the space before them, so "sentence. <!-- src --> Next" renders with one space.
  const lines = markdown.replace(/[ \t]*<!--(?!\s*\/?generated:header)[\s\S]*?-->/g, "").split("\n");

  let firstAfter = -1;
  for (const raw of lines) {
    if (firstAfter >= 0 && body.length > firstAfter && firstAfterHeading !== undefined) {
      body[firstAfter] = setSpacingAndIndent(body[firstAfter], { before: firstAfterHeading });
      firstAfter = -1;
    }
    const line = raw.trimEnd();
    if (/^<!--\s*generated:header\s*-->$/.test(line)) { inHeader = true; continue; }
    if (/^<!--\s*\/generated:header\s*-->$/.test(line)) { inHeader = false; const hr = keep("header_rule"); if (hr) body.push(hr); continue; } // optional
    if (!line.trim()) continue;
    let m: RegExpMatchArray | null;
    if (inHeader) {
      if ((m = line.match(/^# \*\*(.+)\*\*$/))) push(para("name", m[1]), "name");
      else if ((m = line.match(/^\*\*(.+)\*\*$/))) push(para("headline", m[1]) ?? para("contact_line", m[1]), "headline");
      else push(para("contact_line", line, { contact: true }), "contact_line");
      continue;
    }
    if ((m = line.match(/^# \*\*(.+)\*\*$/))) {
      section = m[1].toLowerCase();
      push(para("section_heading", m[1]), "section_heading");
      const rule = keep("section_rule");
      if (rule) body.push(rule);
      firstAfter = body.length; // index of the first paragraph after this heading
      continue;
    }
    if ((m = line.match(/^## \*\*(.+)\*\*$/))) { push(para("entry_title", m[1]), "entry_title"); continue; }
    if ((m = line.match(/^### \*\*(.+)\*\*$/))) {
      const fields = m[1].split(cfg.display.field_separator);
      const last = fields[fields.length - 1];
      const hasDate = fields.length > 1 && DATE_FIELD.test(last);
      const left = hasDate ? fields.slice(0, -1).join(cfg.display.field_separator) : m[1];
      const s = sample("entry_details");
      if (!s) { push(undefined, "entry_details"); continue; }
      const base = firstRunRPr(s);
      const r = `<w:r>${rPrBold(base, true)}<w:t xml:space="preserve">${escapeXml(left)}</w:t>${hasDate ? "<w:tab/>" : ""}</w:r>` +
        (hasDate ? `<w:r>${rPrBold(base, true)}<w:t xml:space="preserve">${escapeXml(last)}</w:t></w:r>` : "");
      body.push(`${pOpen(s)}${pPr(s)}${r}</w:p>`);
      continue;
    }
    if ((m = line.match(/^\* (.*)$/))) { push(para("bullet", m[1]), "bullet"); continue; }
    if (intros.has(line.trim())) { push(para("section_intro", line) ?? para("body", line), "section_intro"); continue; }
    if (section === educationHeading) { push(para("education_line", line) ?? para("body", line), "education_line"); continue; }
    if (/^\*\*[^*]+:\*\*/.test(line)) { push(para("skills_line", line) ?? para("body", line), "skills_line"); continue; }
    push(para("body", line), "body");
  }

  if (firstAfter >= 0 && body.length > firstAfter && firstAfterHeading !== undefined) body[firstAfter] = setSpacingAndIndent(body[firstAfter], { before: firstAfterHeading });

  // keep_first_bullets_together: the first N bullets of each entry stay together (with keep-with-next on the
  // entry lines, the heading never ends a page with fewer than N bullets under it).
  if (keepFirstBullets > 1) {
    const isBullet = (x: string) => x.includes("<w:numPr>");
    for (let i = 0; i < body.length; i++) {
      if (!isBullet(body[i]) || (i > 0 && isBullet(body[i - 1]))) continue; // i = first bullet of a run
      // The line right before a run of bullets (entry details, an education line) stays with its first bullet.
      if (i > 0) body[i - 1] = body[i - 1].replace(/<w:keepNext(?:\s[^>]*)?\/>/, "").replace(/(<w:pStyle [^>]*\/>)|<w:pPr>/, (m0, style) => style ? `${style}<w:keepNext w:val="1"/>` : '<w:pPr><w:keepNext w:val="1"/>');
      for (let k = 0; k < keepFirstBullets - 1 && i + k + 1 < body.length && isBullet(body[i + k + 1]); k++) {
        body[i + k] = body[i + k].replace(/<w:keepNext(?:\s[^>]*)?\/>/, "").replace("<w:pPr>", '<w:pPr><w:keepNext w:val="1"/>');
      }
    }
  }

  // keep_last_bullets_together: the last N bullets of each entry stay on one page (no lone bullet on a new page).
  if (keepLastBullets > 1) {
    const isBullet = (x: string) => x.includes("<w:numPr>");
    for (let i = 0; i < body.length; i++) {
      if (!isBullet(body[i]) || (i + 1 < body.length && isBullet(body[i + 1]))) continue; // i = last bullet of a run
      for (let k = 1; k < keepLastBullets && i - k >= 0 && isBullet(body[i - k]); k++) {
        body[i - k] = body[i - k].replace(/<w:keepNext(?:\s[^>]*)?\/>/, "").replace("<w:pPr>", '<w:pPr><w:keepNext w:val="1"/>');
      }
    }
  }

  // letter_spacing: a tiny character spacing on every run (e.g. to stop Pages from forming ligatures).
  if (letterSpacing) for (let i = 0; i < body.length; i++) body[i] = body[i].replace(/<w:rPr>[\s\S]*?<\/w:rPr>/g, (r) => withCharSpacing(r, letterSpacing));

  // Unique drawing ids (each section rule is a copy of the same drawing).
  let n = 100;
  const xml = body.join("").replace(/(<wp:docPr id=")\d+"/g, (_m, p1) => `${p1}${++n}"`);
  const extra: Record<string, string> = { "word/_rels/document.xml.rels": rels };
  if (numbering) extra["word/numbering.xml"] = numbering;
  await saveDocx(doc, xml, outPath, extra);
  return { paragraphs: body.length, links: linkIds.size, warnings };
}

// Replaces <w:spacing> and <w:ind> in a paragraph's pPr, inserted where the schema expects them
// (after tabs/borders/shading, before contextualSpacing/jc/rPr).
export function setSpacingAndIndent(p: string, v: { indent_left?: number; first_line?: number; before?: number; after?: number; line?: number }): string {
  const m = p.match(/<w:pPr>[\s\S]*?<\/w:pPr>/);
  if (!m) return p;
  let ppr = m[0];
  const rpr = ppr.match(/<w:rPr>[\s\S]*?<\/w:rPr>|<w:rPr\/>/)?.[0] ?? "";
  let head = ppr.replace(rpr, "");
  const oldSp = head.match(/<w:spacing ([^>]*)\/>/)?.[1] ?? "";
  const oldInd = head.match(/<w:ind ([^>]*)\/>/)?.[1] ?? "";
  const attr = (src: string, name: string) => src.match(new RegExp(`w:${name}="([^"]*)"`))?.[1];
  const sp: string[] = [];
  const after = v.after ?? attr(oldSp, "after"), before = v.before ?? attr(oldSp, "before"), line = v.line ?? attr(oldSp, "line");
  if (after !== undefined) sp.push(`w:after="${after}"`);
  if (before !== undefined) sp.push(`w:before="${before}"`);
  if (line !== undefined) sp.push(`w:line="${line}" w:lineRule="auto"`);
  const ind: string[] = [];
  const left = v.indent_left ?? attr(oldInd, "left"), right = attr(oldInd, "right"), hanging = attr(oldInd, "hanging");
  const first = v.first_line ?? (hanging === undefined ? attr(oldInd, "firstLine") : undefined);
  if (left !== undefined) ind.push(`w:left="${left}"`);
  if (right !== undefined) ind.push(`w:right="${right}"`);
  if (hanging !== undefined && v.first_line === undefined) ind.push(`w:hanging="${hanging}"`);
  else if (first !== undefined) ind.push(`w:firstLine="${first}"`);
  head = head.replace(/<w:spacing [^>]*\/>/, "").replace(/<w:ind [^>]*\/>/, "");
  const ins = `${sp.length ? `<w:spacing ${sp.join(" ")}/>` : ""}${ind.length ? `<w:ind ${ind.join(" ")}/>` : ""}`;
  const at = head.search(/<w:contextualSpacing|<w:mirrorIndents|<w:suppressOverlap|<w:jc |<w:textDirection|<w:textAlignment|<w:textboxTightWrap|<w:outlineLvl|<w:divId|<w:cnfStyle|<\/w:pPr>/);
  head = head.slice(0, at) + ins + head.slice(at);
  const out = rpr ? head.replace("</w:pPr>", `${rpr}</w:pPr>`) : head;
  return p.replace(m[0], out);
}

// Sets <w:spacing w:val> (character spacing) in a run's rPr at the schema position (before w:w/kern/position/sz…).
export function withCharSpacing(rpr: string, val: number): string {
  const r = rpr.replace(/<w:spacing w:val="[^"]*"\/>/, "");
  const at = r.search(/<w:w |<w:kern|<w:position|<w:sz |<w:szCs|<w:highlight|<w:u |<w:effect|<w:bdr|<w:shd|<w:fitText|<w:vertAlign|<w:rtl|<w:cs\b|<w:em |<w:lang|<w:eastAsianLayout|<w:specVanish|<w:oMath|<w14:|<\/w:rPr>/);
  return r.slice(0, at) + `<w:spacing w:val="${val}"/>` + r.slice(at);
}
