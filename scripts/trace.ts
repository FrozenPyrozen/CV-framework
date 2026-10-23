// npm run trace [file] [--warn-only]
// Every bullet and every summary-paragraph sentence must end with <!-- src: id[, id] --> pointing to a
// summary contribution (id#4.N), a summary section (id#N) or a confirmed fact id (specs/cv-spec.md 6).
// Generated blocks, entry lines and section intro lines are exempt.
// --warn-only: report but exit 0 (used by `build` for the master CV, docs/scripts.md).
import { splitSentences } from "./lib/text.ts";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { SRC_RE, parseCv, stripComments } from "./lib/cvmd.ts";
import { masterCvPath } from "./lib/paths.ts";
import { cliPath, isMain, loadConfig, loadConfirmed, loadSummaries, rootPath } from "./lib/repo.ts";
import { type Finding, printFindings } from "./lint.ts";
import { parseArgs } from "./refresh.ts";

export interface SourceIndex { resolve(id: string): { ok: boolean; entry?: string; warning?: string } }

export function buildSourceIndex(): SourceIndex {
  const cfg = loadConfig();
  const summaries = loadSummaries(cfg);
  const { facts } = loadConfirmed(cfg);
  const byId = new Map(summaries.map((s) => [s.id, s]));
  const factById = new Map(facts.map((f) => [f.id, f]));
  return {
    resolve(id: string) {
      if (id === "profile" || id === "calc:years_experience" || id === "calc:team_size_led") return { ok: true };
      const m = id.match(/^([\w-]+)#(\d+)(?:\.(\d+))?$/);
      if (m) {
        const s = byId.get(m[1]);
        if (!s) return { ok: false };
        if (m[3] === undefined) return { ok: Number(m[2]) >= 1 && Number(m[2]) <= 9, entry: s.id };
        if (m[2] !== "4") return { ok: false };
        const c = s.contributions.find((x) => x.number === `4.${m[3]}`);
        if (!c) return { ok: false };
        return { ok: true, entry: s.id, warning: c.removed ? `${id} is marked (removed)` : undefined };
      }
      const f = factById.get(id);
      return f ? { ok: true, entry: f.entry } : { ok: false };
    },
  };
}

// Splits a paragraph into pieces that each end with a src comment, plus any trailing text without one.
export function sentencePieces(raw: string): { text: string; src: string[] }[] {
  const pieces: { text: string; src: string[] }[] = [];
  const re = new RegExp(SRC_RE.source, "g");
  let last = 0;
  for (const m of raw.matchAll(re)) {
    pieces.push({ text: stripComments(raw.slice(last, m.index)).trim(), src: m[1].split(",").map((x) => x.trim()).filter(Boolean) });
    last = m.index! + m[0].length;
  }
  const tail = stripComments(raw.slice(last)).trim();
  if (tail) pieces.push({ text: tail, src: [] });
  return pieces;
}

const sentenceCount = (t: string) => splitSentences(t).filter((x) => x.trim()).length;

export function traceCv(file: string, idx = buildSourceIndex()): Finding[] {
  const f: Finding[] = [];
  const rel = relative(rootPath(), file);
  const add = (level: Finding["level"], message: string, line?: number) => f.push({ level, file: rel, line: line === undefined ? undefined : line + 1, message });
  const { lines, sections } = parseCv(readFileSync(file, "utf8"));
  const cfg = loadConfig();
  const introLines = new Set(cfg.cv_sections.map((s) => s.intro).filter(Boolean));

  const checkIds = (ids: string[], line: number, entryId?: string) => {
    for (const id of ids) {
      const r = idx.resolve(id);
      if (!r.ok) add("error", `source "${id}" doesn't resolve to a summary contribution, summary section or fact`, line);
      else {
        if (r.warning) add("warning", r.warning, line);
        if (entryId && r.entry && r.entry !== entryId) add("warning", `source "${id}" belongs to ${r.entry}, but the bullet is under ${entryId}`, line);
      }
    }
  };

  for (const s of sections) {
    for (const p of s.paragraphs) {
      if (introLines.has(p.text.trim())) continue;
      for (const piece of sentencePieces(p.text)) {
        if (!piece.src.length) { add("error", `sentence without a source: "${piece.text.slice(0, 70)}"`, p.line); continue; }
        // A sentence followed by another sentence's comment has no source of its own: an error, so an added claim
        // can't slip in before a sourced sentence (build fails for variants and tailored CVs; a warning for the master).
        if (sentenceCount(piece.text) > 1) add("error", `${sentenceCount(piece.text) - 1} sentence(s) without their own source before: "${piece.text.slice(0, 50)}"`, p.line);
        checkIds(piece.src, p.line);
      }
    }
    for (const e of s.entries) {
      for (const b of e.bullets) {
        if (!b.src.length) add("error", `bullet without a source: "${b.text.slice(0, 70)}"`, b.line);
        else checkIds(b.src, b.line, e.id);
      }
    }
  }
  void lines;
  return f;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const file = positional[0] ? cliPath(positional[0]) : masterCvPath();
  const findings = traceCv(file);
  printFindings(findings);
  const errors = findings.filter((x) => x.level === "error").length;
  console.log(`\ntrace: ${errors} unsourced or unresolved claim(s), ${findings.length - errors} warning(s)${args["warn-only"] && errors ? " (warn-only)" : ""}`);
  if (errors && !args["warn-only"]) process.exit(1);
}
