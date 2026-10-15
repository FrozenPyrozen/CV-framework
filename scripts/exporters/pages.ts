// Pages exporter (macOS): opens the .docx in Pages, exports PDF, closes without saving.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import type { Exporter } from "./types.ts";

const SCRIPT = `
on run argv
  set inF to POSIX file (item 1 of argv)
  set outF to POSIX file (item 2 of argv)
  tell application "Pages"
    set d to open inF
    export d to outF as PDF
    close d saving no
  end tell
end run`;

export const pages: Exporter = {
  id: "pages",
  available() {
    if (process.platform !== "darwin") return { ok: false, reason: "macOS only" };
    if (!existsSync("/Applications/Pages.app")) return { ok: false, reason: "Pages is not installed" };
    return { ok: true };
  },
  exportPdf(docx, pdf, timeoutMs) {
    const r = spawnSync("osascript", ["-e", SCRIPT, docx, pdf], { encoding: "utf8", timeout: timeoutMs });
    if (r.error || r.status !== 0) {
      // Timeout or failure: a dialog may be open (missing fonts, conversion notice). Quit Pages without saving.
      spawnSync("osascript", ["-e", 'tell application "Pages" to quit saving no'], { timeout: 15_000 });
      const why = r.error?.message.includes("ETIMEDOUT") ? `timed out after ${timeoutMs / 1000}s (Pages may be showing a dialog)` : (r.stderr || r.error?.message || "").trim();
      if (/not allowed|-1743|assistive/i.test(why)) throw new Error(`macOS hasn't allowed this terminal to control Pages yet; run npm run doctor while at the keyboard to grant it (${why})`);
      throw new Error(`Pages export failed: ${why}`);
    }
    if (!existsSync(pdf)) throw new Error("Pages reported success but no PDF was written");
  },
};
