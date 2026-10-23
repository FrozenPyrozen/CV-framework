// npm run market [file] [--market <id>]
// Writes the market versions of a CV (specs/cv-spec.md 14) by script, without AI:
// the same content with the header and entry title lines generated for each non-default market.
// Output: <cv dir>/markets/<id>/<name><suffix>.md (git-ignored).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { loadContext } from "./lib/cvmd.ts";
import { marketCvPath, masterCvPath } from "./lib/paths.ts";
import { cliPath, isMain, loadConfig, loadMarkets, rootPath } from "./lib/repo.ts";
import { parseArgs, refreshText } from "./refresh.ts";

export function writeMarketVersions(cvFile: string, only?: string): string[] {
  const base = readFileSync(cvFile, "utf8");
  const written: string[] = [];
  for (const { market } of loadMarkets()) {
    if (market.default || (only && market.id !== only)) continue;
    const { text } = refreshText(base, loadContext({ market: market.id, cvFile }));
    const out = marketCvPath(cvFile, market);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, text);
    written.push(out);
  }
  return written;
}

if (isMain(import.meta.url)) {
  const { args, positional } = parseArgs(process.argv.slice(2));
  const file = positional[0] ? cliPath(positional[0]) : masterCvPath();
  if (args.market && !loadMarkets(loadConfig()).some((m) => m.market.id === args.market)) { console.error(`market: unknown market "${args.market}" (see markets/*.yaml)`); process.exit(2); }
  const written = writeMarketVersions(file, args.market as string | undefined);
  for (const w of written) console.log(`market: written ${w.replace(rootPath() + "/", "")}`);
  if (!written.length) console.log("market: no non-default markets to write");
}
