// npm run pdf [file.docx] [--exporter <id>]
// .docx -> .pdf with the first available exporter in pdf_exporters order (framework.local.yaml overrides
// framework.config.yaml). Exports run one at a time under a lock, each with a timeout (plan 6.1, R1).
// Default file: the master CV's .docx. Output: the same path with .pdf.
import { resolve } from "node:path";
import { EXPORTERS } from "./exporters/index.ts";
import { withLock } from "./lib/lock.ts";
import { masterCvPath } from "./lib/paths.ts";
import { cliPath, isMain, loadConfig, loadLocalConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

export function exporterOrder(): string[] {
  return loadLocalConfig()?.pdf_exporters ?? loadConfig().pdf_exporters;
}

export async function exportPdf(docx: string, opts: { exporter?: string } = {}): Promise<{ pdf: string; exporter: string }> {
  const cfg = loadConfig();
  const pdf = docx.replace(/\.docx$/i, ".pdf");
  const order = opts.exporter ? [opts.exporter] : exporterOrder();
  const skipped: string[] = [];
  for (const id of order) {
    const ex = EXPORTERS[id];
    if (!ex) { skipped.push(`${id}: unknown exporter`); continue; }
    const a = ex.available();
    if (!a.ok) { skipped.push(`${id}: ${a.reason}`); continue; }
    await withLock(rootPath(cfg.paths.runs, "export.lock"), () => ex.exportPdf(resolve(docx), resolve(pdf), cfg.checks.export_timeout_s * 1000));
    return { pdf, exporter: id };
  }
  throw new Error(`no PDF exporter available (${skipped.join("; ")}). Install Pages or Microsoft Word (macOS) or LibreOffice (any OS); the .docx was still produced.`);
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const docx = positional[0] ? cliPath(positional[0]) : masterCvPath().replace(/\.md$/, ".docx");
  try {
    const r = await exportPdf(docx, { exporter: args.exporter as string | undefined });
    console.log(`pdf: ${r.pdf.replace(rootPath() + "/", "")} (exporter: ${r.exporter})`);
  } catch (e) {
    console.error(`pdf: ${(e as Error).message}`);
    process.exit(1);
  }
}
