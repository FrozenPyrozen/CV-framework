// npm run doctor [--no-export]
// Checks this laptop for everything the framework needs (plan 6, 9a, R3, R12) and says how to fix what's missing:
// Node version, dependencies, AI agent tools, framework.local.yaml and repo paths, PDF exporters, previews,
// and (unless --no-export) a tiny real export with the active exporter, which triggers the one-time macOS
// permission prompt while you're at the keyboard and checks that the template's fonts get embedded.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { EXPORTERS } from "./exporters/index.ts";
import { exportPdf, exporterOrder } from "./export-pdf.ts";
import { isMain, loadConfig, loadLocalConfig, loadSummaries, rootPath } from "./lib/repo.ts";
import { readPdf } from "./pdf-check.ts";
import { parseArgs } from "./refresh.ts";
import { renderDocx } from "./renderers/docx.ts";
import { resolveBackupDir } from "./backup.ts";

export interface Check { level: "ok" | "info" | "warn" | "fail"; what: string; fix?: string }

const onPath = (cmd: string) => spawnSync(process.platform === "win32" ? "where" : "which", [cmd], { encoding: "utf8" }).status === 0;

export async function runDoctor(opts: { export?: boolean } = {}): Promise<Check[]> {
  const out: Check[] = [];
  const add = (level: Check["level"], what: string, fix?: string) => out.push({ level, what, fix });
  const cfg = loadConfig();

  // Node
  const [maj, min] = process.versions.node.split(".").map(Number);
  const pkg = JSON.parse(readFileSync(rootPath("package.json"), "utf8"));
  const want = String(pkg.engines?.node ?? ">=20.11").replace(">=", "").split(".").map(Number);
  if (maj > want[0] || (maj === want[0] && min >= (want[1] ?? 0))) add("ok", `Node ${process.versions.node}`);
  else add("fail", `Node ${process.versions.node} is older than ${pkg.engines?.node}`, `install the version in .nvmrc (e.g. nvm install && nvm use)`);

  // Dependencies
  const missing = Object.keys(pkg.dependencies ?? {}).filter((d) => !existsSync(rootPath("node_modules", d)));
  if (missing.length) add("fail", `missing dependencies: ${missing.join(", ")}`, "run npm ci");
  else add("ok", "dependencies installed");
  try { await import("@napi-rs/canvas"); add("ok", "page previews: Node renderer available"); }
  catch { add(process.platform === "darwin" ? "warn" : "fail", "page previews: @napi-rs/canvas can't load", process.platform === "darwin" ? "previews fall back to Quick Look (page 1 only); run npm ci" : "run npm ci"); }

  // AI agent tools (any tool that reads AGENTS.md)
  const tools = ["claude", "codex", "cursor-agent", "gemini"].filter(onPath);
  if (tools.length) add("ok", `AI agent tools: ${tools.join(", ")}`);
  else add("warn", "no AI agent tool found on PATH (the scripts work, but /harvest, /compose and the other agents need one)", "install and sign in to Claude Code, or another tool that reads AGENTS.md");

  // Per-laptop settings and repo paths
  const local = loadLocalConfig();
  if (!local) add("warn", "framework.local.yaml is missing", "copy framework.local.example.yaml to framework.local.yaml and set repo paths and the backup folder");
  else {
    add("ok", "framework.local.yaml found");
    const repos = new Set(loadSummaries(cfg).flatMap((s) => (s.frontMatter.repos ?? []).map((r: any) => r.name)));
    const paths = local.repos ?? {};
    const noPath = [...repos].filter((r) => !paths[r]);
    const badPath = Object.entries(paths).filter(([, p]) => !existsSync(String(p).replace(/^~/, process.env.HOME ?? "~")));
    if (noPath.length) add("info", `repos with no local path on this laptop: ${noPath.join(", ")} (normal once a job has ended; add a path only if you still have access and want to harvest)`);
    if (badPath.length) add("warn", `repo paths that don't exist: ${badPath.map(([n]) => n).join(", ")}`, "fix the paths in framework.local.yaml");
    if (!noPath.length && !badPath.length && repos.size) add("ok", `all ${repos.size} summary repos have a local path`);
    const bdir = local.backup_dir ? resolveBackupDir(String(local.backup_dir)) : undefined;
    if (bdir && !existsSync(bdir) && !bdir.startsWith(rootPath() + "/")) add("warn", `backup folder doesn't exist: ${local.backup_dir}`, "create it or change backup_dir");
    else if (bdir) add("ok", `backups go to ${local.backup_dir}${local.backup_password_env ? " (encrypted when " + local.backup_password_env + " is set)" : " (not encrypted)"}`);
  }

  // PDF exporters
  const order = exporterOrder();
  const avail = order.map((id) => ({ id, ...(EXPORTERS[id]?.available() ?? { ok: false, reason: "unknown exporter" }) }));
  const active = avail.find((a) => a.ok);
  // Unavailable exporters are only a warning when nothing earlier in the order works.
  for (const a of avail) add(a.ok ? "ok" : active && avail.indexOf(active) < avail.indexOf(a) ? "info" : "warn", `PDF exporter ${a.id}: ${a.ok ? (a === active ? "available (used)" : "available (fallback)") : `${a.reason} (fallback only)`}`);
  if (!active) add("fail", "no PDF exporter available: builds will stop after the .docx", "install Pages or Microsoft Word (macOS) or LibreOffice (any OS)");

  // A tiny real export: permission prompt (macOS) + font embedding (R3, R12)
  if (opts.export !== false && active) {
    const dir = rootPath(cfg.paths.runs, "doctor");
    mkdirSync(dir, { recursive: true });
    const template = cfg.default_template;
    const md = "<!-- generated:header -->\n# **Doctor Test**\n\nexample@example.com\n<!-- /generated:header -->\n\n# **SUMMARY**\n\nDefinitions, workflows and **bold** text.\n\n* A bullet with fi and fl.\n";
    try {
      await renderDocx(md, join(dir, "doctor.docx"), template);
      const { pdf, exporter } = await exportPdf(join(dir, "doctor.docx"));
      add("ok", `test export with ${exporter} worked (macOS permission granted)`);
      const { fonts, pages } = await readPdf(pdf);
      const sm = parseYaml(readFileSync(rootPath(cfg.paths.templates, template, "style-map.yaml"), "utf8"));
      const embedded = fonts.filter((f) => !f.includes("(not embedded)")).map((f) => f.split(/[-,]/)[0].replace(/MT$|PSMT$/, "").toLowerCase());
      // The test document uses every paragraph type that carries a template font (text, bold, bullet).
      const notEmbedded = (sm.fonts as string[]).filter((f) => !embedded.includes(f.replace(/\s+/g, "").toLowerCase()));
      if (notEmbedded.length) add("fail", `template "${template}" fonts not embedded with ${exporter}: ${notEmbedded.join(", ")} (found: ${fonts.join(", ")})`, "install the fonts on this laptop, or use another exporter");
      else add("ok", `template "${template}" fonts embedded: ${fonts.join(", ")}`);
      if (!/definitions/i.test(pages.join(" ")) || !/workflows/i.test(pages.join(" "))) add("warn", "the test PDF's text doesn't read back exactly (ligatures?)", "check the template's no-ligatures fix");
    } catch (e) {
      add("fail", `test export failed: ${(e as Error).message}`, "if macOS asked for permission, allow it and run npm run doctor again");
    }
  }
  return out;
}

if (isMain(import.meta.url)) {
  const { args } = parseArgs(process.argv.slice(2));
  const checks = await runDoctor({ export: !args["no-export"] });
  for (const c of checks) console.log(`${c.level === "ok" ? "ok  " : c.level === "info" ? "info" : c.level === "warn" ? "warn" : "FAIL"}  ${c.what}${c.fix ? `\n      fix: ${c.fix}` : ""}`);
  const fails = checks.filter((c) => c.level === "fail").length;
  const warns = checks.filter((c) => c.level === "warn").length;
  console.log(`\ndoctor: ${fails ? `${fails} problem(s) to fix` : "ready"}${warns ? `, ${warns} warning(s)` : ""}`);
  if (fails) process.exit(1);
}
