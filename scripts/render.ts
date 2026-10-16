// npm run render [file] [--template <name>] [--out <file.docx>]
// Markdown to .docx through a template (specs/templates.md 5). Default file: the master CV.
// Template: --template, else the role profile's `template`, else framework.config.yaml default_template.
// Output: next to the Markdown; "cv.md" in a variant folder becomes <Name>_CV_<Profile>.docx.
import { readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { loadContext, profileIdForFile, variantIdForFile } from "./lib/cvmd.ts";
import { masterCvPath, outputBaseName } from "./lib/paths.ts";
import { cliPath, isMain, loadConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";
import { renderDocx } from "./renderers/docx.ts";

export function docxPathFor(mdFile: string): string {
  // Role variants carry the profile in the file name; a job-specific CV is just <Name>_CV (plan 4.5).
  if (basename(mdFile) === "cv.md") return join(dirname(mdFile), `${outputBaseName({ profileId: variantIdForFile(mdFile) })}.docx`);
  return mdFile.replace(/\.md$/, ".docx");
}

export function templateFor(mdFile: string, explicit?: string): string {
  if (explicit) return explicit;
  const ctx = loadContext({ cvFile: mdFile });
  return (ctx.roleProfile?.template as string | undefined) ?? loadConfig().default_template;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const file = positional[0] ? cliPath(positional[0]) : masterCvPath();
  const out = args.out ? cliPath(args.out as string) : docxPathFor(file);
  const template = templateFor(file, args.template as string | undefined);
  const r = await renderDocx(readFileSync(file, "utf8"), out, template);
  for (const w of r.warnings) console.log(`warn   ${w}`);
  console.log(`render: ${out.replace(rootPath() + "/", "")} (${r.paragraphs} paragraphs, ${r.links} links, template "${template}")`);
}
