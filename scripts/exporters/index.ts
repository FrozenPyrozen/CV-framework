// Registry of PDF exporters (docs/scripts.md, PDF exporters). Add a new exporter by adding a module here.
import type { Exporter } from "./types.ts";
import { libreoffice } from "./libreoffice.ts";
import { pages } from "./pages.ts";
import { word } from "./word.ts";

export const EXPORTERS: Record<string, Exporter> = { pages, word, libreoffice };
export type { Exporter };
