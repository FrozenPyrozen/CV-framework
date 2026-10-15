// LibreOffice exporter (any OS): soffice --headless --convert-to pdf.
import { spawnSync } from "node:child_process";
import { existsSync, renameSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import type { Exporter } from "./types.ts";

function sofficePath(): string | undefined {
  const candidates = ["/Applications/LibreOffice.app/Contents/MacOS/soffice", "C:\\Program Files\\LibreOffice\\program\\soffice.exe"];
  for (const c of candidates) if (existsSync(c)) return c;
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["soffice"], { encoding: "utf8" });
  return which.status === 0 ? which.stdout.trim().split("\n")[0] : undefined;
}

export const libreoffice: Exporter = {
  id: "libreoffice",
  available() {
    return sofficePath() ? { ok: true } : { ok: false, reason: "LibreOffice (soffice) is not installed" };
  },
  exportPdf(docx, pdf, timeoutMs) {
    const outDir = dirname(pdf);
    const r = spawnSync(sofficePath()!, ["--headless", "--convert-to", "pdf", "--outdir", outDir, docx], { encoding: "utf8", timeout: timeoutMs });
    if (r.error || r.status !== 0) throw new Error(`LibreOffice export failed: ${(r.stderr || r.error?.message || "").trim()}`);
    const produced = join(outDir, basename(docx).replace(/\.docx$/i, ".pdf"));
    if (produced !== pdf && existsSync(produced)) renameSync(produced, pdf);
    if (!existsSync(pdf)) throw new Error("LibreOffice reported success but no PDF was written");
  },
};
