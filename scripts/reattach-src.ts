// npm run reattach-src <file> --save          before editing: saves a snapshot to .cv-runs/snapshots/<file>
// npm run reattach-src <file> [--from <old>]   after editing: restores dropped source comments
// Restores source comments an agent dropped (plan R7). For each bullet or summary sentence without a
// <!-- src: … --> comment, finds the most similar one in the previous version (same entry for bullets)
// and copies its comment. The previous version is, in order: --from, the snapshot saved with --save,
// or the file as committed in git (HEAD). Prints what it couldn't match.
import { splitSentences } from "./lib/text.ts";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { SRC_RE, parseCv, stripComments } from "./lib/cvmd.ts";
import { cliPath, isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

const words = (t: string) => new Set(t.toLowerCase().replace(/\*\*/g, "").match(/[a-z0-9+#.]+/g) ?? []);

export function similarity(a: string, b: string): number {
  const A = words(a), B = words(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

export const MIN_SIMILARITY = 0.5;

// skip: generated lines that never carry a source (section intro lines from config).
export function reattach(newText: string, oldText: string, skip: Set<string> = new Set()): { text: string; restored: number; unmatched: string[] } {
  const oldCv = parseCv(oldText);
  const newCv = parseCv(newText);
  const lines = newCv.lines.slice();
  const unmatched: string[] = [];
  let restored = 0;

  // Bullets, matched within the same entry.
  const oldBullets = new Map<string, { text: string; comment: string; used: boolean }[]>();
  for (const s of oldCv.sections) for (const e of s.entries) {
    const key = e.id ?? e.title;
    oldBullets.set(key, e.bullets.filter((b) => b.src.length).map((b) => ({ text: b.text, comment: oldCv.lines[b.line].match(SRC_RE)![0], used: false })));
  }
  for (const s of newCv.sections) for (const e of s.entries) {
    const pool = oldBullets.get(e.id ?? e.title) ?? [];
    for (const b of e.bullets) {
      if (b.src.length) continue;
      let best: (typeof pool)[number] | undefined, score = 0;
      for (const o of pool) if (!o.used) { const sc = similarity(b.text, o.text); if (sc > score) { score = sc; best = o; } }
      if (best && score >= MIN_SIMILARITY) { best.used = true; lines[b.line] = `${lines[b.line].trimEnd()} ${best.comment}`; restored++; }
      else unmatched.push(`bullet: "${b.text.slice(0, 70)}"`);
    }
  }

  // Summary-paragraph sentences, matched across all old sentences that had a source.
  const oldSentences: { text: string; comment: string; used: boolean }[] = [];
  for (const s of oldCv.sections) for (const p of s.paragraphs) {
    const re = new RegExp(SRC_RE.source, "g");
    let last = 0;
    for (const m of p.text.matchAll(re)) { oldSentences.push({ text: stripComments(p.text.slice(last, m.index)).trim(), comment: m[0], used: false }); last = m.index! + m[0].length; }
  }
  for (const s of newCv.sections) for (const p of s.paragraphs) {
    if (!oldSentences.length) break;
    if (skip.has(stripComments(p.text).trim())) continue;
    const parts = p.text.split(/(<!--\s*src:[^>]*-->)/);
    const rebuilt: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const hasSrc = i + 1 < parts.length && SRC_RE.test(parts[i + 1]);
      if (SRC_RE.test(part) || !stripComments(part).trim()) { rebuilt.push(part); continue; }
      // Split into sentences and match each one that has no comment of its own. When a comment follows the part,
      // it belongs to the last sentence; earlier sentences lost theirs (one dropped comment in the middle).
      const sentences = splitSentences(part);
      rebuilt.push(sentences.map((sent, si) => {
        if (hasSrc && si === sentences.length - 1) return sent;
        if (!sent.trim()) return sent;
        let best: (typeof oldSentences)[number] | undefined, score = 0;
        for (const o of oldSentences) if (!o.used) { const sc = similarity(sent, o.text); if (sc > score) { score = sc; best = o; } }
        if (best && score >= MIN_SIMILARITY) { best.used = true; restored++; return `${sent.trimEnd()} ${best.comment}`; }
        unmatched.push(`sentence: "${sent.trim().slice(0, 70)}"`);
        return sent;
      }).join(" "));
    }
    lines[p.line] = rebuilt.join("").replace(/\s+$/, "");
  }
  return { text: lines.join("\n"), restored, unmatched };
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  if (!positional[0]) { console.error("usage: npm run reattach-src -- <file> [--save | --from <old-file>]"); process.exit(2); }
  const file = cliPath(positional[0]);
  const rel = relative(rootPath(), file);
  const snapshot = join(rootPath(loadConfig().paths.runs), "snapshots", rel);
  if (args.save) {
    mkdirSync(dirname(snapshot), { recursive: true });
    copyFileSync(file, snapshot);
    console.log(`reattach-src: snapshot saved (${relative(rootPath(), snapshot)})`);
    process.exit(0);
  }
  let oldText: string;
  if (args.from) oldText = readFileSync(cliPath(args.from as string), "utf8");
  else if (existsSync(snapshot)) oldText = readFileSync(snapshot, "utf8");
  else {
    try {
      oldText = execFileSync("git", ["show", `HEAD:${rel}`], { cwd: rootPath(), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      console.error(`reattach-src: no previous version of ${rel}: no --from, no snapshot (run with --save before editing), and not in git HEAD`);
      process.exit(2);
    }
  }
  const intros = new Set(loadConfig().cv_sections.map((s: any) => s.intro).filter(Boolean) as string[]);
  const { text, restored, unmatched } = reattach(readFileSync(file, "utf8"), oldText, intros);
  writeFileSync(file, text);
  // The snapshot stays until the next --save, so later runs never fall back to git HEAD (which, in an acceptance
  // replay, holds the reference CV).
  for (const u of unmatched) console.log(`unmatched  ${u}`);
  console.log(`\nreattach-src: ${restored} source comment(s) restored, ${unmatched.length} unmatched`);
}
