// npm run import-doc <file> --date <YYYY-MM|YYYY> [--kind cv|portfolio|other] [--id <id>] [--title <title>]
// Imports an old CV, portfolio or similar document as a source (specs/sources-spec.md): copies the original to
// sources/files/<id>.<ext>, extracts its text to sources/text/<id>.md and adds it to sources/index.yaml. It changes no
// summary: /import-docs (agents/advisor.md) proposes what the document adds, with the lowest precedence.
import { createHash } from "node:crypto";
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join, relative } from "node:path";
import { stringify } from "yaml";
import { EXTRACTABLE, extractText, loadSources, sourcesDir, type SourceDoc } from "./lib/sources.ts";
import { cliPath, isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const suggestId = (file: string, date: string) => {
  const base = basename(file, extname(file)).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return base.includes(date.replace(/-/g, "")) || base.includes(date) ? base : `${base}-${date}`.replace(/-+/g, "-");
};

export async function importDoc(file: string, opts: { date: string; kind?: string; id?: string; title?: string; today?: string }): Promise<SourceDoc> {
  if (!existsSync(file)) throw new Error(`file not found: ${file}`);
  const ext = extname(file).toLowerCase();
  if (!EXTRACTABLE.includes(ext)) throw new Error(`${basename(file)}: ${ext || "no extension"} can't be read; export it to PDF first (accepted: ${EXTRACTABLE.join(", ")}; .pages needs Pages on macOS)`);
  if (!/^\d{4}(-(0[1-9]|1[0-2]))?$/.test(opts.date ?? "")) throw new Error(`--date must be YYYY-MM or YYYY (when the document was written), got "${opts.date ?? ""}"`);
  const kind = opts.kind ?? (/portfolio/i.test(basename(file)) ? "portfolio" : /\b(cv|resume|résumé)\b|_cv/i.test(basename(file)) ? "cv" : undefined);
  if (!kind || !["cv", "portfolio", "other"].includes(kind)) throw new Error(`--kind must be cv, portfolio or other${kind ? `, got "${kind}"` : " (can't tell from the file name)"}`);
  const id = opts.id ?? suggestId(file, opts.date);
  if (!KEBAB.test(id)) throw new Error(`id "${id}" is not lowercase-kebab; pass --id`);

  const cfg = loadConfig();
  const dir = sourcesDir(cfg);
  const index = loadSources(cfg);
  const sha256 = createHash("sha256").update(readFileSync(file)).digest("hex");
  const same = index.documents.find((d) => d.sha256 === sha256);
  if (same) throw new Error(`this file is already imported as "${same.id}"`);
  if (index.documents.some((d) => d.id === id)) throw new Error(`id "${id}" is already used in ${dir}/index.yaml; pass another --id`);

  // Images (from .pages) go to a temporary folder first: an unreadable file leaves no trace in sources/.
  const mediaTmp = mkdtempSync(join(tmpdir(), "cv-media-"));
  const text = await extractText(file, { dir: mediaTmp, link: `../media/${id}` });
  if (text.replace(/<!-- page \d+ -->/g, "").replace(/!\[[^\]]*\]\([^)]*\)|<img[^>]*>/g, "").trim().length < 50) { rmSync(mediaTmp, { recursive: true, force: true }); throw new Error(`${basename(file)}: almost no text could be extracted (a scanned PDF?); export a text version or type the content into /add-experience`); }
  const hasMedia = readdirSync(mediaTmp).length > 0;
  const doc: SourceDoc = {
    id, kind: kind as SourceDoc["kind"], date: opts.date, title: opts.title ?? basename(file, ext),
    file: `${dir}/files/${id}${ext}`, text: `${dir}/text/${id}.md`, sha256,
    imported_at: opts.today ?? new Date().toISOString().slice(0, 10), status: "imported",
    ...(hasMedia ? { media: `${dir}/media/${id}` } : {}),
  };
  mkdirSync(rootPath(dir, "files"), { recursive: true });
  mkdirSync(rootPath(dir, "text"), { recursive: true });
  copyFileSync(file, rootPath(doc.file));
  if (doc.media) cpSync(mediaTmp, rootPath(doc.media), { recursive: true });
  rmSync(mediaTmp, { recursive: true, force: true });
  writeFileSync(rootPath(doc.text), `<!-- extracted from ${doc.file} by npm run import-doc on ${doc.imported_at}; regenerated, never edited -->\n\n${text}`);
  index.documents.push(doc);
  index.documents.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id)); // newest first: the precedence order
  writeFileSync(rootPath(dir, "index.yaml"), `# Imported documents (specs/sources-spec.md). Newest first; lower precedence than summaries and facts.\n${stringify(index)}`);
  return doc;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  if (!positional[0]) { console.error("usage: npm run import-doc -- <file> --date <YYYY-MM|YYYY> [--kind cv|portfolio|other] [--id <id>] [--title <title>]"); process.exit(2); }
  const doc = await importDoc(cliPath(positional[0]), { date: String(args.date ?? ""), kind: args.kind as string | undefined, id: args.id as string | undefined, title: args.title as string | undefined });
  const words = readFileSync(rootPath(doc.text), "utf8").split(/\s+/).length;
  console.log(`import-doc: ${doc.id} (${doc.kind}, ${doc.date}): ${doc.file}, text ${doc.text} (${words} words)`);
  console.log(`  next: /import-docs goes through what it adds to the summaries (${relative(rootPath(), rootPath(doc.text))})`);
}
