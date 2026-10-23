// Text normalization shared by pdf-check (plan R4): makes CV Markdown and PDF text comparable.

// Unicode NFKC (splits ligatures like "ﬁ"), one kind of quote and dash, words broken at a line-end hyphen rejoined,
// single spaces.
export function normalizeText(s: string): string {
  return s
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/(\w)-\s*\n\s*(\w)/g, "$1-$2") // a hyphen at a line end is a real one (CVs don't use automatic hyphenation)
    .replace(/(\w)\/\s*\n\s*(\w)/g, "$1/$2") // a line can also break after a slash ("CI/" + "CD")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(s: string): string[] {
  return normalizeText(s).toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}.+#/-]*[\p{L}\p{N}+#]|[\p{L}\p{N}]/gu) ?? [];
}

// The visible text of a CV Markdown file, as it appears in the rendered document:
// no comments or Markdown markers, and "Label: url" in the header shown as the link text "Label".
export function markdownVisibleText(md: string): string {
  return md
    .replace(/<!--[\s\S]*?-->/g, "")
    .split("\n")
    .map((l) => l
      .replace(/^#{1,3}\s+/, "")
      .replace(/^\*\s+/, "")
      .replace(/\*\*/g, "")
      .replace(/([^|:]+):\s*https?:\/\/\S+/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"))
    .join("\n");
}

// Words of `expected` that are missing from `actual`, counting repeats (a bag comparison).
export function missingWords(expected: string[], actual: string[]): string[] {
  const bag = new Map<string, number>();
  for (const w of actual) bag.set(w, (bag.get(w) ?? 0) + 1);
  const missing: string[] = [];
  for (const w of expected) {
    const n = bag.get(w) ?? 0;
    if (n > 0) bag.set(w, n - 1);
    else missing.push(w);
  }
  return missing;
}

// Sentence boundaries in a summary paragraph: after . ! ? followed by a capital, but not after common abbreviations
// ("e.g.", "i.e.", "etc.", "vs.") or initials ("U.S."), so "e.g. React" stays one sentence.
export const SENTENCE_BREAK = /(?<!\b(?:e\.g|i\.e|etc|vs|approx|incl|[A-Z]\.[A-Z])\.)(?<=[.!?])\s+(?=[A-Z])/;
export const splitSentences = (t: string) => t.split(SENTENCE_BREAK);
