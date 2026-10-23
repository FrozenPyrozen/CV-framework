// PDF exporter interface (docs/scripts.md, PDF exporters). Each exporter turns one .docx into one .pdf.
export interface Exporter {
  id: string;
  available(): { ok: boolean; reason?: string };
  // Must finish within timeoutMs or throw; must leave the app in a clean state on failure.
  exportPdf(docx: string, pdf: string, timeoutMs: number): void;
}
