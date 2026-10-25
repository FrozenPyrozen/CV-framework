// npm run backup [--out <dir>] [--no-password] [--full]
// npm run restore <archive> [--force]
//
// Rules: specs/portability-spec.md.
// Moves what git doesn't carry between laptops (plan 9a): tailored CVs and job ads (cv/tailored/), sent PDFs
// (cv/sent/), the application log (facts/applications.yaml) and per-laptop settings (framework.local.yaml).
// The archive is a zip built with jszip. If the environment variable named by backup_password_env in
// framework.local.yaml is set, the whole zip is encrypted with AES-256-GCM (key from the password via scrypt)
// and saved as .zip.enc. The password itself is never stored.
// --full writes the whole project as one plain zip that opens without the framework: repo.bundle (git bundle,
// every branch and tag), private-backup.zip[.enc] (the backup above), manifest.json and RESTORE.txt. It refuses
// to run with uncommitted changes, since a bundle holds commits only.
// restore never overwrites a newer local file; it lists those conflicts (--force overwrites them). It never writes
// framework.local.yaml: the archived one is saved as framework.local.previous.yaml. Given a full archive, it
// restores the private part inside it.
import { spawnSync } from "node:child_process";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { outputBaseName } from "./lib/paths.ts";
import JSZip from "jszip";
import { cliPath, errorMessage, isMain, loadConfig, loadLocalConfig, rootPath } from "./lib/repo.ts";
import { parseArgs } from "./refresh.ts";

const MAGIC = Buffer.from("CVBK1"); // file format: MAGIC | salt(16) | iv(12) | tag(16) | ciphertext

export function backupPaths(): string[] {
  const cfg = loadConfig();
  return [
    join(cfg.output.tailored_dir),
    join(cfg.output.master_dir, "sent"),
    join(cfg.paths.facts, "applications.yaml"),
    "framework.local.yaml",
  ];
}

// Built outputs inside backup folders (a tailored CV's .docx, .pdf, checks, previews, markets, selection) aren't moved.
// Word and PDF files count only when they carry the CV's own file name (<Name>_CV…), so a job ad saved as a PDF travels.
export const isBuiltOutput = (rel: string, cvPrefix = "Kirill_Kohan_CV") =>
  rel.startsWith("cv/tailored/") &&
  (new RegExp(`/${cvPrefix}[^/]*\\.(docx|pdf)$`).test(rel) || /\/(pdf-check\.md|selection\.json)$|\/(preview|markets)\//.test(rel));

function walk(abs: string): string[] {
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return [abs];
  return readdirSync(abs).flatMap((f) => walk(join(abs, f)));
}

export function encrypt(data: Buffer, password: string): Buffer {
  const salt = randomBytes(16), iv = randomBytes(12);
  const key = scryptSync(password, salt, 32);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([c.update(data), c.final()]);
  return Buffer.concat([MAGIC, salt, iv, c.getAuthTag(), body]);
}

export function decrypt(data: Buffer, password: string): Buffer {
  if (!data.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error("not an encrypted CV backup");
  let o = MAGIC.length;
  const salt = data.subarray(o, (o += 16)), iv = data.subarray(o, (o += 12)), tag = data.subarray(o, (o += 16));
  const d = createDecipheriv("aes-256-gcm", scryptSync(password, salt, 32), iv);
  d.setAuthTag(tag);
  try {
    return Buffer.concat([d.update(data.subarray(o)), d.final()]);
  } catch {
    throw new Error("wrong password or damaged backup");
  }
}

const expandHome = (p: string) => p.replace(/^~(?=\/|$)/, process.env.HOME ?? "~");
// backup_dir may be absolute, start with ~, or be relative to the repo root.
export const resolveBackupDir = (p: string) => (/^(~|\/)/.test(p) ? expandHome(p) : rootPath(p));

function stamp(): string {
  const d = new Date(), z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}`; // local time
}

// The private files as a zip (encrypted when a password is given).
async function privateArchive(password: string | undefined): Promise<{ data: Buffer; files: number }> {
  const zip = new JSZip();
  const cvPrefix = basename(outputBaseName());
  let n = 0;
  for (const p of backupPaths()) for (const abs of walk(rootPath(p))) {
    if (isBuiltOutput(relative(rootPath(), abs), cvPrefix)) continue; // recreated by build (specs/portability-spec.md 1)
    zip.file(relative(rootPath(), abs), readFileSync(abs), { date: statSync(abs).mtime });
    n++;
  }
  const data = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return { data: password ? encrypt(data, password) : data, files: n };
}

function settings(opts: { outDir?: string; password?: string | null }) {
  const local = loadLocalConfig() ?? {};
  const outDir = opts.outDir ?? resolveBackupDir(local.backup_dir ?? "backups");
  const password = opts.password === null ? undefined : opts.password ?? (local.backup_password_env ? process.env[local.backup_password_env] : undefined);
  return { outDir, password };
}

export async function backup(opts: { outDir?: string; password?: string | null } = {}): Promise<{ file: string; files: number }> {
  const { outDir, password } = settings(opts);
  const { data, files } = await privateArchive(password);
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `cv-backup-${stamp()}${password ? ".zip.enc" : ".zip"}`);
  writeFileSync(file, data);
  return { file, files };
}

const git = (args: string[]) => {
  const r = spawnSync("git", args, { cwd: rootPath(), encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${(r.stderr || r.stdout || "failed").trim()}`);
  return r.stdout.trim();
};

export function restoreSteps(privateName: string): string {
  return [
    "Restoring this CV framework archive (specs/portability-spec.md, section 5, route B)",
    "",
    "1. Install Node (the version in .nvmrc, see manifest.json), an exporter (Pages, Word or LibreOffice),",
    "   the template fonts and your AI agent tool.",
    "2. In the folder where you unzipped this archive:",
    "     git clone repo.bundle CV",
    "     cd CV",
    "     git remote remove origin      # origin points at the bundle file",
    "     npm ci",
    `3. npm run restore -- ../${privateName}${privateName.endsWith(".enc") ? "   (set the backup password variable first)" : ""}`,
    "4. cp framework.local.example.yaml framework.local.yaml, then set this laptop's repo paths and backup folder",
    "   (the old laptop's settings are in framework.local.previous.yaml).",
    "5. npm run doctor, fix what it reports, then npm run build:all, npm run build:portfolio and npm run status.",
    "6. Later, connect a private remote: git remote add origin <private url>",
    "   then git push -u origin --all && git push origin --tags",
    "   Pushing sends the whole history: check it first (specs/portability-spec.md, section 6).",
    "7. Delete archive copies you no longer need: this zip holds every work summary in plain text.",
    "",
  ].join("\n");
}

// The whole project in one plain zip: repo bundle + private backup + manifest + restore steps.
export async function fullBackup(opts: { outDir?: string; password?: string | null } = {}): Promise<{ file: string; files: number; head: string }> {
  const dirty = git(["status", "--porcelain"]);
  if (dirty) throw new Error(`uncommitted changes (a bundle holds commits only); commit first:\n${dirty}`);
  const { outDir, password } = settings(opts);
  const tmp = mkdtempSync(join(tmpdir(), "cv-full-"));
  try {
    const bundle = join(tmp, "repo.bundle");
    git(["bundle", "create", bundle, "--all"]);
    const priv = await privateArchive(password);
    const privateName = `private-backup${password ? ".zip.enc" : ".zip"}`;
    const head = git(["rev-parse", "--short", "HEAD"]);
    const manifest = {
      schema_version: 1,
      created_at: new Date().toISOString(),
      branch: git(["rev-parse", "--abbrev-ref", "HEAD"]),
      head,
      node: existsSync(rootPath(".nvmrc")) ? readFileSync(rootPath(".nvmrc"), "utf8").trim() : null,
      private_files: priv.files,
      encrypted: !!password,
    };
    const zip = new JSZip();
    zip.file("repo.bundle", readFileSync(bundle));
    zip.file(privateName, priv.data);
    zip.file("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
    zip.file("RESTORE.txt", restoreSteps(privateName));
    mkdirSync(outDir, { recursive: true });
    const file = join(outDir, `cv-full-${stamp()}.zip`);
    writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
    return { file, files: priv.files, head };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

export async function restore(archive: string, opts: { password?: string; force?: boolean } = {}): Promise<{ written: string[]; skipped: string[]; conflicts: string[] }> {
  let data: Buffer = readFileSync(archive);
  let encrypted = archive.endsWith(".enc");
  // A full archive: restore the private backup inside it (the repo comes from cloning repo.bundle).
  if (!encrypted) {
    const outer = await JSZip.loadAsync(data);
    const inner = outer.file("private-backup.zip.enc") ?? outer.file("private-backup.zip");
    if (inner && outer.file("repo.bundle")) {
      data = await inner.async("nodebuffer");
      encrypted = inner.name.endsWith(".enc");
    }
  }
  if (encrypted) {
    const local = loadLocalConfig() ?? {};
    const pw = opts.password ?? (local.backup_password_env ? process.env[local.backup_password_env] : undefined);
    if (!pw) throw new Error(`the backup is encrypted: set ${local.backup_password_env ?? "the password environment variable"} (see backup_password_env in framework.local.yaml)`);
    data = decrypt(data, pw);
  }
  const zip = await JSZip.loadAsync(data);
  const allowed = backupPaths();
  const res = { written: [] as string[], skipped: [] as string[], conflicts: [] as string[] };
  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    // Only paths a backup can contain: a damaged or foreign archive can't write elsewhere.
    if (entry.name.includes("..") || !allowed.some((a) => entry.name === a || entry.name.startsWith(a + "/"))) { res.skipped.push(`${entry.name} (not a backup path)`); continue; }
    // framework.local.yaml is per laptop: never overwrite it; keep the archived one for reference.
    const target = rootPath(entry.name === "framework.local.yaml" ? "framework.local.previous.yaml" : entry.name);
    const content = await entry.async("nodebuffer");
    if (existsSync(target)) {
      if (readFileSync(target).equals(content)) { res.skipped.push(`${entry.name} (identical)`); continue; }
      if (statSync(target).mtime > entry.date && !opts.force) { res.conflicts.push(`${relative(rootPath(), target)} (the local file is newer; kept it)`); continue; }
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    utimesSync(target, entry.date, entry.date);
    res.written.push(entry.name === "framework.local.yaml" ? "framework.local.previous.yaml (the old laptop's framework.local.yaml; copy what still applies)" : entry.name);
  }
  return res;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const mode = args.restore ? "restore" : "backup";
  try {
    if (mode === "backup") {
      const o = { outDir: args.out ? cliPath(args.out as string) : undefined, password: args["no-password"] ? null : undefined };
      if (args.full) {
        const r = await fullBackup(o);
        console.log(`backup --full: repo at ${r.head} + ${r.files} private file(s) -> ${r.file}`);
        console.log("  plain zip (it holds every summary): keep it on your own devices. Restore steps are in RESTORE.txt inside it.");
      } else {
        const r = await backup(o);
        console.log(`backup: ${r.files} file(s) -> ${r.file}${r.file.endsWith(".enc") ? " (encrypted)" : args["no-password"] ? " (not encrypted: --no-password)" : " (not encrypted: set the password environment variable to encrypt)"}`);
      }
    } else {
      // "npm run restore -- <archive>" runs "backup.ts --restore <archive>", so the archive may arrive as the flag's value.
      const archive = positional[0] ?? (typeof args.restore === "string" ? args.restore : undefined);
      if (!archive) { console.error("usage: npm run restore -- <archive> [--force]"); process.exit(2); }
      const r = await restore(cliPath(expandHome(archive)), { force: !!args.force });
      for (const w of r.written) console.log(`restored  ${w}`);
      for (const c of r.conflicts) console.log(`CONFLICT  ${c}`);
      console.log(`\nrestore: ${r.written.length} restored, ${r.skipped.length} skipped, ${r.conflicts.length} conflict(s)${r.conflicts.length ? " (use --force to overwrite)" : ""}`);
    }
  } catch (e) {
    console.error(`${mode}: ${errorMessage(e)}`);
    process.exit(1);
  }
}
