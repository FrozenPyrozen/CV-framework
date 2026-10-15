// npm run preview <file.pdf> [--out <dir>] [--scale <n>]
// Renders every page of a PDF to PNG with pdfjs-dist and @napi-rs/canvas (plan 6.3, R13): no system tools.
// Output: <pdf dir>/preview/page-1.png, page-2.png, ... (git-ignored). Falls back to macOS Quick Look
// (page 1 only) if the canvas package can't be loaded.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { cliPath, isMain, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

export async function renderPreviews(pdfFile: string, outDir = join(dirname(pdfFile), "preview"), scale = 1.5): Promise<string[]> {
  mkdirSync(outDir, { recursive: true });
  for (const f of readdirSync(outDir)) if (/^page-\d+\.png$/.test(f)) rmSync(join(outDir, f));
  try {
    const { createCanvas } = await import("@napi-rs/canvas");
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(pdfFile)), useSystemFonts: false, disableFontFace: true, verbosity: 0 }).promise;
    const files: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const vp = page.getViewport({ scale });
      const canvas = createCanvas(Math.ceil(vp.width), Math.ceil(vp.height));
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx as any, viewport: vp }).promise;
      const out = join(outDir, `page-${i}.png`);
      writeFileSync(out, canvas.toBuffer("image/png"));
      files.push(out);
    }
    return files;
  } catch (e) {
    if (process.platform !== "darwin") throw e;
    // Fallback: Quick Look renders page 1 only.
    execFileSync("qlmanage", ["-t", "-s", "1600", "-o", outDir, pdfFile], { stdio: "ignore" });
    const ql = join(outDir, `${basename(pdfFile)}.png`);
    if (!existsSync(ql)) throw e;
    renameSync(ql, join(outDir, "page-1.png"));
    console.log(`preview: canvas rendering failed (${(e as Error).message}); used Quick Look for page 1 only`);
    return [join(outDir, "page-1.png")];
  }
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  if (!positional[0]) { console.error("usage: npm run preview -- <file.pdf> [--out <dir>] [--scale <n>]"); process.exit(2); }
  const pdf = cliPath(positional[0]);
  const files = await renderPreviews(pdf, args.out ? cliPath(args.out as string) : undefined, args.scale ? Number(args.scale) : undefined);
  for (const f of files) console.log(`preview: ${f.replace(rootPath() + "/", "")}`);
}
