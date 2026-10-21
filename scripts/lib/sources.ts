// Imported documents (specs/sources-spec.md): the index in sources/index.yaml and text extraction for
// .docx, .pdf, .md and .txt files.
import JSZip from "jszip";
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";
import { loadConfig, readYaml, rootPath } from "./repo.ts";

export interface SourceDoc {
  id: string;
  kind: "cv" | "portfolio" | "other";
  date: string;
  title: string;
  file: string;
  text: string;
  sha256: string;
  imported_at: string;
  status: "imported" | "reviewed";
}

export const sourcesDir = (cfg = loadConfig()) => cfg.paths.sources ?? "sources";

export function loadSources(cfg = loadConfig()): { schema_version: 1; documents: SourceDoc[] } {
  const f = rootPath(sourcesDir(cfg), "index.yaml");
  if (!existsSync(f)) return { schema_version: 1, documents: [] };
  const doc = readYaml(f) ?? {};
  return { schema_version: 1, documents: doc.documents ?? [] };
}

// doc:<id> references in any text (summary bodies, section 7, facts' source fields).
export const DOC_REF = /\bdoc:([a-z0-9]+(?:-[a-z0-9]+)*)/g;

export const EXTRACTABLE = [".docx", ".pdf", ".md", ".txt"];

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, "&");

export async function extractText(file: string): Promise<string> {
  const ext = extname(file).toLowerCase();
  if (ext === ".md" || ext === ".txt") return readFileSync(file, "utf8");
  if (ext === ".docx") {
    const zip = await JSZip.loadAsync(readFileSync(file));
    const xml = await zip.file("word/document.xml")?.async("string");
    if (!xml) throw new Error(`${file}: not a Word document (no word/document.xml)`);
    const paras = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? [];
    // Per paragraph: its text runs, run tabs and line breaks, in order (tab stops in paragraph properties are not <w:tab/>).
    const run = /<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g;
    return paras
      .map((p) => [...p.matchAll(run)].map((m) => (m[0] === "<w:tab/>" ? "\t" : m[0] === "<w:br/>" ? "\n" : decode(m[1]))).join(""))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() + "\n";
  }
  if (ext === ".pdf") {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0, disableFontFace: true }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const tc = await (await doc.getPage(i)).getTextContent();
      let text = "";
      for (const it of tc.items as any[]) text += (it.str ?? "") + (it.hasEOL ? "\n" : "");
      pages.push(`<!-- page ${i} -->\n${text.trim()}`);
    }
    return pages.join("\n\n") + "\n";
  }
  throw new Error(`${file}: ${ext || "this file type"} can't be read; export it to PDF first (accepted: ${EXTRACTABLE.join(", ")})`);
}
