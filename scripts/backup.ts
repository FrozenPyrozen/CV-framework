// npm run backup [--out <dir>] [--no-password]
// npm run restore <archive> [--force]
//
// Moves what git doesn't carry between laptops (plan 9a): tailored CVs and job ads (cv/tailored/), sent PDFs
// (cv/sent/), the application log (facts/applications.yaml) and per-laptop settings (framework.local.yaml).
// The archive is a zip built with jszip. If the environment variable named by backup_password_env in
// framework.local.yaml is set, the whole zip is encrypted with AES-256-GCM (key from the password via scrypt)
// and saved as .zip.enc. The password itself is never stored.
// restore never overwrites a newer local file; it lists those conflicts (--force overwrites them).
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import JSZip from "jszip";
import { cliPath, isMain, loadConfig, loadLocalConfig, rootPath } from "./lib/repo.ts";
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

export async function backup(opts: { outDir?: string; password?: string | null } = {}): Promise<{ file: string; files: number }> {
  const local = loadLocalConfig() ?? {};
  const outDir = opts.outDir ?? resolveBackupDir(local.backup_dir ?? "backups");
  const password = opts.password === null ? undefined : opts.password ?? (local.backup_password_env ? process.env[local.backup_password_env] : undefined);
  const zip = new JSZip();
  let n = 0;
  for (const p of backupPaths()) for (const abs of walk(rootPath(p))) {
    zip.file(relative(rootPath(), abs), readFileSync(abs), { date: statSync(abs).mtime });
    n++;
  }
  const data = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const d = new Date(), z = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}`; // local time
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `cv-backup-${stamp}${password ? ".zip.enc" : ".zip"}`);
  writeFileSync(file, password ? encrypt(data, password) : data);
  return { file, files: n };
}

export async function restore(archive: string, opts: { password?: string; force?: boolean } = {}): Promise<{ written: string[]; skipped: string[]; conflicts: string[] }> {
  let data: Buffer = readFileSync(archive);
  if (archive.endsWith(".enc")) {
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
    const target = rootPath(entry.name);
    const content = await entry.async("nodebuffer");
    if (existsSync(target)) {
      if (readFileSync(target).equals(content)) { res.skipped.push(`${entry.name} (identical)`); continue; }
      if (statSync(target).mtime > entry.date && !opts.force) { res.conflicts.push(`${entry.name} (the local file is newer; kept it)`); continue; }
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    utimesSync(target, entry.date, entry.date);
    res.written.push(entry.name);
  }
  return res;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const mode = args.restore ? "restore" : "backup";
  try {
    if (mode === "backup") {
      const r = await backup({ outDir: args.out ? cliPath(args.out as string) : undefined, password: args["no-password"] ? null : undefined });
      console.log(`backup: ${r.files} file(s) -> ${r.file}${r.file.endsWith(".enc") ? " (encrypted)" : " (not encrypted: set the password environment variable to encrypt)"}`);
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
    console.error(`${mode}: ${(e as Error).message}`);
    process.exit(1);
  }
}
