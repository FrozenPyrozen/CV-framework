// Shared helpers for the portfolio tests.
import assert from "node:assert/strict";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync } from "node:zlib";
import JSZip from "jszip";
import { run } from "./helpers.ts";

// Only the Itjet project in the portfolio (the real summaries opt every job in), and no build records copied from
// the real repo (they would hold the real portfolio's build).
export const optIn = (d: string) => {
  rmSync(join(d, "cv/.build-state.json"), { force: true });
  for (const f of readdirSync(join(d, "summaries")).filter((x) => x.endsWith(".md"))) {
    const p = join(d, "summaries", f);
    // Itjet as one page (its portfolio_projects and the screenshots' project keys removed): the older tests below.
    let t = readFileSync(p, "utf8").replace(/^show_in_portfolio: true.*$/m, f === "itjet-fintech.md" ? "show_in_portfolio: true" : "show_in_portfolio: false");
    if (f === "itjet-fintech.md") t = t.replace(/^portfolio_projects:[^\n]*\n(?:  - [^\n]*\n)+/m, "").replace(/^- image: \.\.\/sources\/media\/(?:portfolio-2025-09\/|portfolio-2025-04\/image(?:8|9|10)\.tif)[^\n]*\n(?:  [^\n]*\n)*/gm, "").replace(/^  project: [\w-]+\n/gm, "");
    writeFileSync(p, t);
  }
};
export const P = "portfolio/portfolio.md";
export const write = (d: string, intro: string, project: string) => {
  const p = join(d, P);
  // The intro is optional now (the published portfolio has none): it goes right after the cover.
  writeFileSync(p, readFileSync(p, "utf8").replace("<!-- /generated:portfolio-cover -->\n", `<!-- /generated:portfolio-cover -->\n\n${intro}\n`).replace("<!-- TODO(/portfolio): write this project -->", project));
};

export const PNG_1PX = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

// A valid grayscale PNG of any size (the renderer reads the size from the IHDR chunk; Word gets real image data).
export function png(w: number, h: number): Buffer {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b: Buffer) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 0;
  const raw = Buffer.alloc((w + 1) * h, 0xff); for (let y = 0; y < h; y++) raw[y * (w + 1)] = 0;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

// Itjet as one page with only the given screenshots (assets/itjet-fintech/<name>.png) and a portfolio_title.
export function withImages(dir: string, imgs: [string, number, number][], title = "Client apps (React, React Native, Node.js)") {
  optIn(dir);
  mkdirSync(join(dir, "portfolio/assets/itjet-fintech"), { recursive: true });
  const items = imgs.map(([n, w, h]) => {
    writeFileSync(join(dir, `portfolio/assets/itjet-fintech/${n}.png`), png(w, h));
    return `- image: assets/itjet-fintech/${n}.png\n  caption: A test screen\n  public: yes, confirmed by user 2026-10-23\n`;
  }).join("");
  const p = join(dir, "summaries/itjet-fintech.md");
  writeFileSync(p, readFileSync(p, "utf8").replace(/^- image: [^\n]*\n(?:  [^\n]*\n)*/gm, "").replace("## 8. Portfolio material\n", `## 8. Portfolio material\n\n${items}`).replace(/^show_in_portfolio: true$/m, `show_in_portfolio: true\nportfolio_title: ${title}`));
  run("portfolio.ts", dir, ["refresh"]);
  write(dir, "Intro. <!-- src: itjet-fintech#1 -->", "Client apps. <!-- src: itjet-fintech#1 -->");
}
export async function buildA4(dir: string): Promise<string[]> {
  const r = run("build-portfolio.ts", dir, ["--no-pdf", "--no-pages", "--size", "a4"]);
  assert.equal(r.code, 0, r.out);
  const zip = await JSZip.loadAsync(readFileSync(join(dir, "portfolio/Kirill_Kohan_Portfolio_A4.docx")));
  return (await zip.file("word/document.xml")!.async("string")).match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? [];
}
export const EMU_PER_INCH = 914400;
