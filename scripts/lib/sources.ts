// Imported documents (specs/sources-spec.md): the index in sources/index.yaml and text extraction for
// .docx, .pdf, .md, .txt and (on macOS with Pages) .pages files.
import JSZip from "jszip";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
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
  media?: string; // folder with the images extracted from the document (.pages through pandoc)
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

export const EXTRACTABLE = [".docx", ".pdf", ".md", ".txt", ".pages"];

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, "&");

// A .pages file is exported to Word by Pages (macOS), then turned into Markdown by pandoc when it's installed, keeping
// headings, lists, links, captions and images (written to mediaDir, linked as mediaLink/<name>); without pandoc,
// the Word text is extracted as for any .docx.
const PAGES_TO_DOCX = `
on run argv
  set inF to POSIX file (item 1 of argv)
  set outF to POSIX file (item 2 of argv)
  with timeout of 600 seconds
    tell application "Pages"
      set d to open inF
      export d to outF as Microsoft Word
      close d saving no
    end tell
  end timeout
end run`;

// pandoc on PATH, or in the usual Homebrew folders (a GUI-launched or minimal shell may not have them on PATH).
export const pandocBin = (): string | undefined =>
  ["pandoc", "/opt/homebrew/bin/pandoc", "/usr/local/bin/pandoc"].find((b) => spawnSync(b, ["--version"], { encoding: "utf8" }).status === 0);
export const hasPandoc = () => !!pandocBin();

async function pagesToText(file: string, media?: { dir: string; link: string }): Promise<string> {
  if (process.platform !== "darwin" || !existsSync("/Applications/Pages.app")) throw new Error(`${file}: reading .pages needs Pages on macOS; export it to PDF or Word first`);
  const tmp = mkdtempSync(join(tmpdir(), "cv-pages-"));
  try {
    const docx = join(tmp, "doc.docx");
    const r = spawnSync("osascript", ["-e", PAGES_TO_DOCX, file, docx], { encoding: "utf8", timeout: 660_000 });
    if (r.status !== 0 || !existsSync(docx)) throw new Error(`Pages couldn't export ${file} to Word: ${(r.stderr || r.error?.message || "").trim()}`);
    if (!hasPandoc()) return await extractText(docx);
    const p = spawnSync(pandocBin()!, ["doc.docx", "-t", "gfm", "--wrap=none", "--extract-media=media"], { cwd: tmp, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    if (p.status !== 0) throw new Error(`pandoc failed on the Word export of ${file}: ${p.stderr.trim()}`);
    let md = p.stdout;
    const imgs = join(tmp, "media", "media");
    if (media && existsSync(imgs) && readdirSync(imgs).length) {
      cpSync(imgs, media.dir, { recursive: true });
      md = md.replaceAll("media/media/", `${media.link}/`);
    }
    return md;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

export async function extractText(file: string, media?: { dir: string; link: string }): Promise<string> {
  const ext = extname(file).toLowerCase();
  if (ext === ".pages") return pagesToText(file, media);
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
