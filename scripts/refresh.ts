// npm run refresh [file] [--market <id>] [--profile <id>] [--out <file>] [--check]
// Rewrites the script-owned parts of a CV Markdown file from their sources (specs/cv-spec.md 2.2, 8, 14):
// the header block, section headings and intro lines, every entry's title and detail lines (with an
// <!-- entry: id --> marker), and the education, skills and languages blocks. Agent-written text
// (summary paragraph, bullets) is left untouched.
// --check: don't write; exit 1 if the file differs from what refresh would produce.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { writeDigests } from "./digest.ts";
import { printIssues, validateRepo } from "./validate.ts";
import {
  type Context, entryDetailLine, entryTitleLine, generateBlock, loadContext, sectionIdForHeading, wrapBlock,
} from "./lib/cvmd.ts";
import { cliPath, isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { masterCvPath } from "./lib/paths.ts";

export interface RefreshResult { text: string; notes: string[] }

export function refreshText(text: string, ctx: Context, opts: { skillsOrder?: string[] } = {}): RefreshResult {
  const notes: string[] = [];
  const skillsOrder = opts.skillsOrder ?? ctx.skillsOrder;
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const dropped = (ls: string[], where: string) => {
    for (const l of ls) if (l.trim() && !/^<!-- \/?generated:[\w-]+ -->$/.test(l)) notes.push(`removed hand-written text from ${where} (it is generated): "${l.trim().slice(0, 70)}"`);
  };
  const { cfg } = ctx;

  // 1. Split into: preamble (header) + sections (from each "# **HEADING**" that maps to a config section).
  const sectionStarts: { line: number; id: string }[] = [];
  let inGenerated = false;
  lines.forEach((l, i) => {
    if (/^<!-- generated:[\w-]+ -->$/.test(l)) inGenerated = true;
    else if (/^<!-- \/generated:[\w-]+ -->$/.test(l)) inGenerated = false;
    else if (!inGenerated) {
      const h1 = l.match(/^# \*\*(.+)\*\*\s*$/);
      const id = h1 && sectionIdForHeading(cfg, h1[1]);
      if (id) sectionStarts.push({ line: i, id });
    }
  });
  if (!sectionStarts.length) throw new Error("no section headings matching cv_sections were found");
  const headerText = lines.slice(0, sectionStarts[0].line);
  if (!headerText.some((l) => /^<!-- generated:header -->$/.test(l))) {
    // First conversion: the typed header becomes the generated one (expected, not reported).
  } else {
    let inside = false;
    dropped(headerText.filter((l) => { if (/^<!-- generated:header -->$/.test(l)) { inside = true; return false; } if (/^<!-- \/generated:header -->$/.test(l)) { inside = false; return false; } return !inside; }), "the header area");
  }

  const out: string[] = [wrapBlock("header", generateBlock("header", ctx)), ""];
  const seenEntries = new Set<string>();

  sectionStarts.forEach((s, idx) => {
    const end = idx + 1 < sectionStarts.length ? sectionStarts[idx + 1].line : lines.length;
    const def = cfg.cv_sections.find((d) => d.id === s.id)!;
    out.push(`# **${def.heading}**`, "");
    const body = lines.slice(s.line + 1, end);

    if (def.source === "profile.education" || def.source === "skills" || def.source === "profile.languages") {
      const name = def.source === "skills" ? "skills" : def.source === "profile.education" ? "education" : "languages";
      if (body.some((l) => /^<!-- generated:/.test(l))) {
        let inside = false;
        dropped(body.filter((l) => { if (/^<!-- generated:/.test(l)) { inside = true; return false; } if (/^<!-- \/generated:/.test(l)) { inside = false; return false; } return !inside; }), `the ${def.heading} section`);
      }
      out.push(wrapBlock(name, generateBlock(name, ctx, skillsOrder)), "");
      return;
    }

    if (def.source !== "entries") {
      out.push(...trimBlank(body), "");
      return;
    }

    // Entries section: intro line, then entries.
    if (def.intro) out.push(def.intro, "");
    const firstEntry = body.findIndex((l) => /^## \*\*/.test(l) || /^<!-- entry: /.test(l));
    if (def.intro) dropped((firstEntry === -1 ? body : body.slice(0, firstEntry)).filter((l) => l.trim() !== def.intro), `the ${def.heading} intro`);
    const entryLines = firstEntry === -1 ? [] : body.slice(firstEntry);
    const preface = firstEntry > 0 && !def.intro ? trimBlank(body.slice(0, firstEntry)) : [];
    if (preface.length) out.push(...preface, "");

    // Walk entries.
    let pendingId: string | undefined;
    for (let i = 0; i < entryLines.length; i++) {
      const l = entryLines[i];
      const marker = l.match(/^<!-- entry: ([\w-]+) -->$/);
      if (marker) { pendingId = marker[1]; continue; }
      const h2 = l.match(/^## \*\*(.+)\*\*\s*$/);
      if (!h2) { out.push(l); continue; }
      // Find its detail line (next "### **...**").
      let j = i + 1;
      while (j < entryLines.length && entryLines[j].trim() === "") j++;
      const h3 = entryLines[j]?.match(/^### \*\*(.+)\*\*\s*$/);
      const label = h3?.[1].split(cfg.display.field_separator)[0].trim();
      const entry = (pendingId && ctx.entries.find((e) => e.id === pendingId)) || ctx.entries.find((e) => e.label === label && e.section === s.id);
      pendingId = undefined;
      if (!entry) {
        notes.push(`entry "${h2[1]}" (${label ?? "no detail line"}) matches no summary or cv_entry; left unchanged`);
        out.push(l);
        continue;
      }
      if (entry.section !== s.id) notes.push(`${entry.id} is in section "${s.id}" but its cv_section is "${entry.section}"; the composer should move it`);
      seenEntries.add(entry.id);
      out.push(`<!-- entry: ${entry.id} -->`, entryTitleLine(entry, ctx), "", entryDetailLine(entry, ctx));
      i = h3 ? j : i;
    }
    trimTrailingBlank(out);
    out.push("");
  });

  for (const e of ctx.entries) if (!seenEntries.has(e.id)) notes.push(`${e.id} (${e.label}) is not in the CV yet; the composer should add it to section "${e.section}"`);
  trimTrailingBlank(out);
  return { text: out.join("\n") + "\n", notes };
}

function trimBlank(ls: string[]): string[] {
  let a = 0, b = ls.length;
  while (a < b && ls[a].trim() === "") a++;
  while (b > a && ls[b - 1].trim() === "") b--;
  return ls.slice(a, b);
}

function trimTrailingBlank(ls: string[]): void {
  while (ls.length && ls[ls.length - 1].trim() === "") ls.pop();
}

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const k = argv[i].slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) args[k] = argv[++i];
      else args[k] = true;
    } else positional.push(argv[i]);
  }
  return { args, positional };
}
export { parseArgs };

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const file = positional[0] ? cliPath(positional[0]) : masterCvPath();
  // Sources must be valid before anything is generated from them (and before digests are written).
  const errors = validateRepo().filter((i) => i.level === "error");
  if (errors.length) { printIssues(errors); console.log("\nrefresh: fix the validate errors first"); process.exit(1); }
  writeDigests();
  const ctx = loadContext({ market: args.market as string | undefined, profileId: args.profile as string | undefined, cvFile: file });
  // The committed CV is written for the default market (specs/cv-spec.md 14): another market's version goes elsewhere.
  if (!ctx.market.default && !args.out && !args.check && !file.includes(`/${loadConfig().output.markets_subdir}/`)) {
    console.error(`refresh: --market ${ctx.market.id} would write that market's header into ${file.replace(rootPath() + "/", "")}; use npm run market, or pass --out <file>`);
    process.exit(2);
  }
  const before = readFileSync(file, "utf8");
  const { text, notes } = refreshText(before, ctx);
  for (const n of notes) console.log(`note   ${n}`);
  // Report every line refresh replaced, so hand edits inside generated parts are never lost silently.
  const kept = new Map<string, number>();
  for (const l of text.split("\n")) kept.set(l, (kept.get(l) ?? 0) + 1);
  for (const l of before.split("\n")) {
    const n = kept.get(l) ?? 0;
    if (n) { kept.set(l, n - 1); continue; }
    if (l.trim() && !/^<!--/.test(l.trim())) console.log(`note   replaced: "${l.trim().slice(0, 90)}"`);
  }
  if (args.check) {
    if (text !== before) { console.log(`refresh --check: ${file} differs from its sources; run npm run refresh`); process.exit(1); }
    console.log(`refresh --check: ${file} is up to date`);
  } else {
    const out = args.out ? cliPath(args.out as string) : file;
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, text);
    console.log(`refresh: ${text === before && out === file ? "no changes" : "written"} ${out.replace(rootPath() + "/", "")}`);
  }
}
