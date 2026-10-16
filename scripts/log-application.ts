// npm run log-application -- --company "<name>" --pdf <file.pdf> [--role "<title>"] [--status applied] [--notes "<text>"] [--keep-copy]
// Records a sent CV in facts/applications.yaml (plan 4.5, git-ignored): date, company, role, the PDF and its
// hash (quoted), the CV folder, market, git commit of the sources, exporter, status. --keep-copy also saves the
// exact PDF to cv/sent/<date>-<company>.pdf (git-ignored, included in backups).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { parse as parseYaml, stringify } from "yaml";
import { readState, sha } from "./lib/buildstate.ts";
import { cliPath, isMain, loadConfig, loadMarkets, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function logApplication(o: { company: string; pdf: string; role?: string; status?: string; notes?: string; keepCopy?: boolean }): Record<string, unknown> {
  const cfg = loadConfig();
  if (!existsSync(o.pdf)) throw new Error(`PDF not found: ${o.pdf}`);
  const rel = relative(rootPath(), o.pdf);
  const date = new Date().toISOString().slice(0, 10);
  let commit = "";
  try { commit = execFileSync("git", ["-C", rootPath(), "rev-parse", "--short", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { /* not a git repo */ }
  const exporter = Object.values(readState()).map((r) => r.exporters?.[rel]).find(Boolean);
  const entry: Record<string, unknown> = {
    date,
    company: o.company,
    ...(o.role ? { role: o.role } : {}),
    cv: relative(rootPath(), dirname(o.pdf)) || ".",
    pdf: rel,
    pdf_sha256: sha(o.pdf),
    build_commit: commit || null,
    market: rel.match(/\/markets\/([\w-]+)\//)?.[1] ?? loadMarkets(loadConfig()).find((m) => m.market.default)?.market.id ?? "default",
    exporter: exporter ?? null,
    status: o.status ?? "applied",
    notes: o.notes ?? "",
  };
  if (o.keepCopy) {
    const copy = rootPath(cfg.output.master_dir, "sent", `${date}-${slug(o.company)}.pdf`);
    mkdirSync(dirname(copy), { recursive: true });
    copyFileSync(o.pdf, copy);
    entry.sent_copy = relative(rootPath(), copy);
  }
  const file = rootPath(cfg.paths.facts, "applications.yaml");
  const list = existsSync(file) ? ((parseYaml(readFileSync(file, "utf8")) as unknown[]) ?? []) : [];
  list.push(entry);
  const header = "# Application log (git-ignored; docs/plan.md 4.5). Written by npm run log-application; statuses can be edited by hand.\n";
  writeFileSync(file, header + stringify(list));
  return entry;
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  if (!args.company || !args.pdf) { console.error('usage: npm run log-application -- --company "<name>" --pdf <file.pdf> [--role "<title>"] [--status applied] [--notes "<text>"] [--keep-copy]'); process.exit(2); }
  try {
    const e = logApplication({ company: String(args.company), pdf: cliPath(String(args.pdf)), role: args.role as string | undefined, status: args.status as string | undefined, notes: args.notes as string | undefined, keepCopy: !!args["keep-copy"] });
    console.log(`log-application: recorded ${e.company} (${e.pdf}, ${e.market} market${e.sent_copy ? `, copy in ${e.sent_copy}` : ""})`);
  } catch (err) {
    console.error(`log-application: ${(err as Error).message}`);
    process.exit(1);
  }
}
