// Output paths and file names (framework.config.yaml output.*, docs/plan.md 4.6).
import { basename, dirname, join } from "node:path";
import { type Market, loadConfig, loadProfile, rootPath } from "./repo.ts";

export function outputBaseName(opts: { profileId?: string; market?: Market } = {}): string {
  const cfg = loadConfig();
  const profile = loadProfile(cfg);
  const titleCase = (id: string) => id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("_");
  return cfg.output.file_name
    .replace("{name_underscored}", profile.name.replace(/\s+/g, "_"))
    .replace("{profile_suffix}", opts.profileId ? `_${titleCase(opts.profileId)}` : "")
    .replace("{market_suffix}", opts.market?.file_suffix ?? "");
}

export function masterCvPath(): string {
  const cfg = loadConfig();
  return rootPath(cfg.output.master_dir, `${outputBaseName()}.md`);
}

// Where a market version of a CV goes: <cv dir>/markets/<id>/<base name with market suffix>.md
export function marketCvPath(cvFile: string, market: Market): string {
  const cfg = loadConfig();
  const dir = dirname(cvFile);
  const variantsDir = rootPath(cfg.output.variants_dir);
  const profileId = dir.startsWith(variantsDir + "/") ? basename(dir) : undefined;
  return join(dir, cfg.output.markets_subdir, market.id, `${outputBaseName({ profileId, market })}.md`);
}
