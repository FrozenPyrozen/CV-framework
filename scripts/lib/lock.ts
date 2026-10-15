// A simple cross-process lock (plan R1): PDF exporters drive desktop apps that handle one document at a time.
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, statSync, writeSync } from "node:fs";
import { dirname } from "node:path";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function withLock<T>(lockFile: string, fn: () => Promise<T> | T, opts: { waitMs?: number; staleMs?: number } = {}): Promise<T> {
  const waitMs = opts.waitMs ?? 10 * 60_000;
  const staleMs = opts.staleMs ?? 5 * 60_000;
  mkdirSync(dirname(lockFile), { recursive: true });
  const start = Date.now();
  for (;;) {
    try {
      const fd = openSync(lockFile, "wx");
      writeSync(fd, `${process.pid}\n${new Date().toISOString()}\n`);
      closeSync(fd);
      break;
    } catch (e: any) {
      if (e.code !== "EEXIST") throw e;
      // Remove a lock left by a crashed run: its process is gone, or it is older than staleMs.
      if (existsSync(lockFile) && (!holderAlive(lockFile) || Date.now() - statSync(lockFile).mtimeMs > staleMs)) { rmSync(lockFile, { force: true }); continue; }
      if (Date.now() - start > waitMs) throw new Error(`timed out waiting for the export lock ${lockFile}; delete it if no export is running`);
      await sleep(500);
    }
  }
  try {
    return await fn();
  } finally {
    rmSync(lockFile, { force: true });
  }
}

// True while the process that wrote the lock (first line: its pid) is still running.
function holderAlive(lockFile: string): boolean {
  let pid: number;
  try {
    pid = Number(readFileSync(lockFile, "utf8").split("\n")[0]);
  } catch {
    return false; // released in the meantime: nothing to wait for
  }
  if (!pid) return true; // unreadable or half-written: let the age rule decide
  try {
    process.kill(pid, 0);
    return true;
  } catch (e: any) {
    return e.code === "EPERM"; // exists but owned by someone else
  }
}
