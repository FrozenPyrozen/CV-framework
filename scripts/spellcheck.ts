// npm run spellcheck [file…] [--list]
// Dictionary spelling check (US English, framework.config.yaml spelling) of the CV Markdown files and the
// portfolio (specs/cv-spec.md 4, specs/outputs/portfolio.md 6), with cspell's bundled dictionaries for English,
// software terms and company names, plus the project word list facts/dictionary.txt (names, products,
// technologies). Default files: the master CV, every role variant and job-specific CV, and portfolio/portfolio.md
// when it exists. Unknown words are errors: fix them, or add a real word to facts/dictionary.txt.
// --list prints each unknown word once (for reviewing additions to the word list).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { getDefaultSettings, mergeSettings, validateText } from "cspell-lib";
import { allTargets } from "./build.ts";
import { markdownVisibleText } from "./lib/text.ts";
import { cliPath, isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

export interface SpellIssue { file: string; line: number; word: string }

const DICTIONARIES = ["en_us", "softwareTerms", "companies", "node", "typescript", "npm", "fullstack", "aws", "html", "css", "filetypes"];

export function projectWords(): string[] {
  const f = rootPath(loadConfig().paths.facts, "dictionary.txt");
  if (!existsSync(f)) return [];
  return readFileSync(f, "utf8").split("\n").map((l) => l.replace(/#.*/, "").trim()).filter(Boolean);
}

let settingsCache: any;
async function settings() {
  if (!settingsCache) {
    const language = loadConfig().spelling === "en-GB" ? "en-GB" : "en-US";
    settingsCache = mergeSettings(await getDefaultSettings(), {
      language,
      dictionaries: language === "en-GB" ? DICTIONARIES.map((d) => (d === "en_us" ? "en-gb" : d)) : DICTIONARIES,
      words: projectWords(),
      ignoreRegExpList: ["/https?:\\/\\/\\S+/g", "/\\b(?:www\\.)?[\\w-]+\\.(?:com|org|net|io|dev|app|ai)(?:\\/\\S*)?/gi", "/[\\w.+-]+@[\\w-]+\\.[\\w.]+/g", "/`[^`]*`/g"],
    } as any);
  }
  return settingsCache;
}

// The visible text of a Markdown file, line for line (comments, markup and link targets removed).
export async function spellcheckText(md: string, file: string): Promise<SpellIssue[]> {
  const text = markdownVisibleText(md);
  const issues = await validateText(text, await settings(), { generateSuggestions: false } as any);
  return issues.map((i: any) => ({ file, line: text.slice(0, i.offset).split("\n").length, word: i.text }));
}

export function defaultFiles(): string[] {
  const cfg = loadConfig();
  const files = [...allTargets()];
  const tdir = rootPath(cfg.output.tailored_dir);
  if (existsSync(tdir)) for (const d of readdirSync(tdir).sort()) if (existsSync(join(tdir, d, "cv.md"))) files.push(join(tdir, d, "cv.md"));
  const portfolio = rootPath(cfg.paths.portfolio ?? "portfolio", "portfolio.md");
  if (existsSync(portfolio)) files.push(portfolio);
  return files;
}

export async function spellcheckFiles(files: string[]): Promise<SpellIssue[]> {
  const out: SpellIssue[] = [];
  for (const f of files) out.push(...(await spellcheckText(readFileSync(f, "utf8"), relative(rootPath(), f))));
  return out;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const files = positional.length ? positional.map(cliPath) : defaultFiles();
  for (const f of files) if (!existsSync(f)) { console.error(`spellcheck: file not found: ${relative(rootPath(), f)}`); process.exit(2); }
  const issues = await spellcheckFiles(files);
  if (args.list) {
    const counts = new Map<string, number>();
    for (const i of issues) counts.set(i.word, (counts.get(i.word) ?? 0) + 1);
    for (const [w, n] of [...counts].sort((a, b) => a[0].localeCompare(b[0]))) console.log(`${w}\t${n}`);
  } else {
    for (const i of issues) console.log(`ERROR  ${i.file}:${i.line}: unknown word "${i.word}" (fix it, or add it to facts/dictionary.txt if it's right)`);
  }
  console.log(`\nspellcheck: ${files.length} file(s), ${issues.length} unknown word(s)`);
  if (issues.length && !args.list) process.exit(1);
}
