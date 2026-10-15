// Microsoft Word exporter (macOS): opens the .docx in Word, saves as PDF, closes without saving.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import type { Exporter } from "./types.ts";

const SCRIPT = `
on run argv
  set inPath to item 1 of argv
  set outPath to item 2 of argv
  tell application "Microsoft Word"
    open (POSIX file inPath)
    set d to active document
    save as d file name outPath file format format PDF
    close d saving no
  end tell
end run`;

export const word: Exporter = {
  id: "word",
  available() {
    if (process.platform !== "darwin") return { ok: false, reason: "macOS only (on Windows, use LibreOffice)" };
    if (!existsSync("/Applications/Microsoft Word.app")) return { ok: false, reason: "Microsoft Word is not installed" };
    return { ok: true };
  },
  exportPdf(docx, pdf, timeoutMs) {
    const r = spawnSync("osascript", ["-e", SCRIPT, docx, pdf], { encoding: "utf8", timeout: timeoutMs });
    if (r.error || r.status !== 0) {
      spawnSync("osascript", ["-e", 'tell application "Microsoft Word" to quit saving no'], { timeout: 15_000 });
      throw new Error(`Word export failed: ${(r.stderr || r.error?.message || "").trim()}`);
    }
    if (!existsSync(pdf)) throw new Error("Word reported success but no PDF was written");
  },
};
