// npm run build [file] [--template <name>] [--market <id>] [--no-pdf] [--entries-reviewed]   one CV (default: the master)
// npm run build:all [--no-pdf]                              the master CV and every role variant
//
// The full chain (docs/scripts.md): validate -> digest -> refresh -> lint -> trace -> spellcheck -> market versions ->
// for every market: render .docx -> PDF -> pdf-check -> previews -> build record (cv/.build-state.json).
// Stops a CV at its first failing step. Unsourced claims are warnings for the master CV and errors for
// variants and tailored CVs. --no-pdf stops after the .docx (e.g. on a laptop without a PDF exporter).
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { parse as parseYaml } from "yaml";
import { writeDigests } from "./digest.ts";
import { exportPdf } from "./export-pdf.ts";
import { entryHashes, entryTextHashes, hashSources, readState, sha, writeRecord, type BuildRecord } from "./lib/buildstate.ts";
import { loadContext, profileIdForFile } from "./lib/cvmd.ts";
import { masterCvPath } from "./lib/paths.ts";
import { cliPath, errorMessage, isMain, loadConfig, loadMarkets, rootPath } from "./lib/repo.ts";
import { lintCv, type Finding } from "./lint.ts";
import { writeMarketVersions } from "./market.ts";
import { checkPdf, writeReport } from "./pdf-check.ts";
import { renderPreviews } from "./preview.ts";
import { readApplications } from "./status.ts";
import { parseArgs, refreshText } from "./refresh.ts";
import { docxPathFor, templateFor } from "./render.ts";
import { renderDocx } from "./renderers/docx.ts";
import { buildSourceIndex, traceCv } from "./trace.ts";
import { spellcheckFiles } from "./spellcheck.ts";
import { printIssues, validateRepo } from "./validate.ts";

export interface BuildOutcome { cv: string; ok: boolean; steps: string[]; problems: string[]; outputs: string[] }

const rel = (p: string) => relative(rootPath(), p);

export function templateApproved(template: string): boolean {
  const p = rootPath(loadConfig().paths.templates, template, "style-map.yaml");
  return existsSync(p) && parseYaml(readFileSync(p, "utf8"))?.approved === true;
}

// Per-entry source hashes to record. An entry whose sources changed stays pending ("entries to rewrite") until its
// text in this CV changes (an agent rewrote it) or the build is run with --entries-reviewed (specs/tailoring-spec.md 6).
function pendingEntries(prev: BuildRecord | undefined, mdBefore: string, reviewed: boolean): Record<string, string> {
  const now = entryHashes();
  if (reviewed || !prev?.entries) return now;
  const textNow = entryTextHashes(mdBefore);
  const out: Record<string, string> = {};
  for (const [id, h] of Object.entries(now)) {
    // Older records have no entry_text: then any change to the CV Markdown counts as a rewrite.
    const rewritten = prev.entry_text ? prev.entry_text[id] !== textNow[id] : prev.md_sha !== createHash("sha256").update(mdBefore).digest("hex").slice(0, 16);
    // An entry this CV doesn't contain can't be rewritten in it: record its current hash.
    out[id] = rewritten || !(id in textNow) || prev.entries[id] === undefined ? h : prev.entries[id];
  }
  return out;
}

export async function buildCv(mdFile: string, opts: { template?: string; noPdf?: boolean; requireApproved?: boolean; market?: string; entriesReviewed?: boolean } = {}): Promise<BuildOutcome> {
  const cfg = loadConfig();
  const out: BuildOutcome = { cv: rel(mdFile), ok: false, steps: [], problems: [], outputs: [] };
  const exporters: Record<string, string> = {};
  const step = (s: string) => out.steps.push(s);
  const fail = (s: string) => { out.problems.push(s); return out; };
  const isMaster = mdFile === masterCvPath();
  const profileId = profileIdForFile(mdFile);

  let template: string;
  try { template = templateFor(mdFile, opts.template); } catch (e) { return fail((e as Error).message); }
  if (!templateApproved(template)) {
    if (opts.requireApproved) return fail(`template "${template}" is not approved (build it once with npm run build -- --template ${template} and approve the previews)`);
    step(`warning: template "${template}" is not approved yet`);
  }

  // refresh
  const before = readFileSync(mdFile, "utf8");
  // Entries whose sources changed stay listed by status until their text in this CV changes, or --entries-reviewed
  // says they need no change (pendingEntries, specs/tailoring-spec.md 6).
  const prev = readState()[rel(mdFile)];
  const { text, notes } = refreshText(before, loadContext({ cvFile: mdFile }));
  if (text !== before) writeFileSync(mdFile, text);
  step(text === before ? "refresh: up to date" : "refresh: generated parts updated");
  for (const n of notes) step(`refresh note: ${n}`);

  // lint + trace on the default-market Markdown
  const errors = (fs: Finding[]) => fs.filter((f) => f.level === "error");
  const lintErr = errors(lintCv(mdFile, loadContext({ cvFile: mdFile })));
  if (lintErr.length) return fail(`lint: ${lintErr.length} error(s), first: ${lintErr[0].line ? `line ${lintErr[0].line}: ` : ""}${lintErr[0].message}`);
  step("lint: ok");
  const traceErr = errors(traceCv(mdFile, buildSourceIndex()));
  if (traceErr.length && !isMaster) return fail(`trace: ${traceErr.length} unsourced or unresolved claim(s), first: ${traceErr[0].line ? `line ${traceErr[0].line}: ` : ""}${traceErr[0].message}`);
  step(traceErr.length ? `trace: ${traceErr.length} unsourced claim(s) (warning for the master CV)` : "trace: ok");
  const spell = await spellcheckFiles([mdFile]);
  if (spell.length) return fail(`spellcheck: ${spell.length} unknown word(s), first: line ${spell[0].line}: "${spell[0].word}" (fix it, or add it to facts/dictionary.txt if it's right)`);
  step("spellcheck: ok");

  // market versions
  // Markets: every market by default; one market with --market. A job-specific CV (cv/tailored/) is built for
  // one market only: --market, else the default market (specs/cv-spec.md 14).
  const tailored = mdFile.startsWith(rootPath(cfg.output.tailored_dir) + "/");
  const defaultMarket = loadMarkets(cfg).find((m) => m.market.default)?.market.id;
  const only = opts.market ?? (tailored ? defaultMarket : undefined);
  const versions: { md: string; market?: string }[] = [];
  if (!only || only === defaultMarket) versions.push({ md: mdFile });
  if (only !== defaultMarket) for (const m of writeMarketVersions(mdFile, only)) versions.push({ md: m, market: m.match(/\/markets\/([\w-]+)\//)![1] });
  if (!versions.length) return fail(`unknown market "${only}"`);
  step(`markets: ${versions.map((v) => v.market ?? defaultMarket).join(", ")}`);

  for (const v of versions) {
    const label = v.market ?? "default market";
    if (v.market) {
      const e = errors(lintCv(v.md, loadContext({ cvFile: v.md, market: v.market })));
      if (e.length) return fail(`lint (${label}): ${e[0].message}`);
    }
    const docx = basename(v.md) === "cv.md" ? docxPathFor(v.md) : v.md.replace(/\.md$/, ".docx");
    const r = await renderDocx(readFileSync(v.md, "utf8"), docx, template);
    for (const w of r.warnings) step(`render warning (${label}): ${w}`);
    out.outputs.push(docx);
    step(`render (${label}): ${rel(docx)}`);
    if (opts.noPdf) {
      // An older PDF, its check and previews would no longer match this Markdown: remove them, so status and
      // log-application never treat an outdated PDF as current.
      const oldPdf = docx.replace(/\.docx$/, ".pdf");
      if (existsSync(oldPdf) && readApplications().some((a) => a.pdf && rootPath(a.pdf) === oldPdf)) {
        step(`pdf (${label}): kept ${rel(oldPdf)}: it was sent (facts/applications.yaml); it no longer matches this Markdown`);
      } else if (existsSync(oldPdf)) {
        for (const x of [oldPdf, join(dirname(docx), "pdf-check.md")]) if (existsSync(x)) rmSync(x);
        if (existsSync(join(dirname(docx), "preview"))) rmSync(join(dirname(docx), "preview"), { recursive: true, force: true });
        step(`pdf (${label}): removed the outdated PDF, pdf-check.md and previews (built with --no-pdf)`);
      }
      continue;
    }
    let pdf: string;
    try {
      const e = await exportPdf(docx);
      pdf = e.pdf;
      exporters[rel(pdf)] = e.exporter;
      step(`pdf (${label}): ${rel(pdf)} via ${e.exporter}`);
    } catch (e) {
      return fail(`pdf (${label}): ${(e as Error).message}`);
    }
    out.outputs.push(pdf);
    const chk = await checkPdf(pdf, v.md, template);
    writeReport(pdf, v.md, chk);
    if (!chk.ok) return fail(`pdf-check (${label}): ${chk.failures.join("; ")}`);
    step(`pdf-check (${label}): pass, ${chk.notes[0]}`);
    const previews = await renderPreviews(pdf, join(dirname(pdf), "preview"));
    step(`preview (${label}): ${previews.length} page image(s) in ${rel(join(dirname(pdf), "preview"))}`);
  }

  writeRecord(mdFile, {
    built_at: new Date().toISOString(),
    template,
    md_sha: sha(mdFile),
    sources: hashSources(template, profileId, mdFile),
    outputs: Object.fromEntries(out.outputs.map((o) => [rel(o), sha(o)])),
    entries: pendingEntries(prev, before, !!opts.entriesReviewed),
    entry_text: entryTextHashes(readFileSync(mdFile, "utf8")),
    exporters,
  });
  out.ok = true;
  void cfg;
  return out;
}

export function allTargets(): string[] {
  const cfg = loadConfig();
  const targets = [masterCvPath()];
  const vdir = rootPath(cfg.output.variants_dir);
  if (existsSync(vdir)) for (const d of readdirSync(vdir).sort()) if (existsSync(join(vdir, d, "cv.md"))) targets.push(join(vdir, d, "cv.md"));
  return targets;
}

function print(o: BuildOutcome): void {
  console.log(`\n== ${o.cv}`);
  for (const s of o.steps) console.log(`   ${s}`);
  for (const p of o.problems) console.log(`   FAILED ${p}`);
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const all = !!args.all;
  const cfg0 = loadConfig();
  if (all && args["entries-reviewed"]) {
    console.error("build: --entries-reviewed applies to one CV at a time (npm run build -- <cv> --entries-reviewed), so the master's and other variants' pending entries aren't cleared unseen");
    process.exit(2);
  }
  // Sources must be valid before anything is built.
  // Errors in one variant's or job ad's own files fail only that CV; every other error stops the build.
  const issues = validateRepo().filter((i) => i.level === "error");
  const cvOwn = (file: string) => file.startsWith(`${cfg0.output.variants_dir}/`) || file.startsWith(`${cfg0.output.tailored_dir}/`);
  const blocking = issues.filter((i) => !cvOwn(i.file));
  if (blocking.length) { printIssues(blocking); console.log("\nbuild: fix the validate errors first"); process.exit(1); }
  writeDigests();
  const targets = all ? allTargets() : [positional[0] ? cliPath(positional[0]) : masterCvPath()];
  const ownErrors = (t: string) => issues.filter((i) => cvOwn(i.file) && rel(t).startsWith(i.file.split("/").slice(0, 3).join("/") + "/"));
  const results: BuildOutcome[] = [];
  for (const t of targets) {
    let r: BuildOutcome;
    const own = ownErrors(t);
    if (own.length) {
      r = { cv: rel(t), ok: false, steps: [], problems: [`validate: ${own[0].file}: ${own[0].message}`], outputs: [] };
      print(r);
      results.push(r);
      continue;
    }
    try {
      r = await buildCv(t, { template: args.template as string | undefined, noPdf: !!args["no-pdf"], requireApproved: all, market: args.market as string | undefined, entriesReviewed: !!args["entries-reviewed"] });
    } catch (e) {
      // One CV failing (e.g. a variant whose profile was removed) doesn't stop the others.
      r = { cv: rel(t), ok: false, steps: [], problems: [errorMessage(e)], outputs: [] };
    }
    print(r);
    results.push(r);
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\nbuild: ${results.length - failed.length} of ${results.length} CV(s) built${failed.length ? `; failed: ${failed.map((f) => f.cv).join(", ")}` : ""}`);
  if (failed.length) process.exit(1);
}
