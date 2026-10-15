// npm run digest: writes summaries/.digests/<id>.yaml, a short digest per summary (front matter,
// contributions with titles, results and tags, and the confirmed facts for that entry).
// Composer and tailor read digests and open full summaries only for entries they change (plan R10).
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stringify } from "yaml";
import { isMain, loadConfig, loadConfirmed, loadSummaries, rootPath } from "./lib/repo.ts";

export function writeDigests(): number {
  const cfg = loadConfig();
  const dir = rootPath(cfg.paths.digests);
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.endsWith(".yaml")) rmSync(join(dir, f));

  const { facts } = loadConfirmed(cfg);
  const summaries = loadSummaries(cfg);
  for (const s of summaries) {
    const metrics = s.sections.find((x) => x.number === 7)?.text.trim().split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2)) ?? [];
    const digest = {
      generated: "by npm run digest; do not edit",
      id: s.id,
      file: s.file,
      front_matter: s.frontMatter,
      contributions: s.contributions.map((c) => ({
        id: `${s.id}#${c.number}`,
        title: c.title,
        ...(c.removed ? { removed: true } : {}),
        ...(c.result ? { result: c.result } : {}),
        tags: c.tags,
      })),
      facts: facts.filter((f) => f.entry === s.id).map((f) => ({ id: f.id, fact: f.fact, tags: f.tags })),
      metrics,
    };
    writeFileSync(join(dir, `${s.id}.yaml`), stringify(digest, { lineWidth: 0 }));
  }
  return summaries.length;
}

if (isMain(import.meta.url)) {
  console.log(`digest: ${writeDigests()} digest(s) written to ${loadConfig().paths.digests}/`);
}
