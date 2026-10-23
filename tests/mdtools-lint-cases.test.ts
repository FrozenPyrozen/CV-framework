// Markdown tools: lint errors on the master CV (split from the Markdown tools tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { CV, edit, refreshed, run } from "./helpers.ts";

test("lint passes on the refreshed CV and fails on the unrefreshed one", () => {
  assert.equal(run("lint.ts", refreshed(), [CV]).code, 0);
  const dir = refreshed();
  edit(dir, CV, "July 2023 - December 2025", "07/2023 \u2013 12/2025"); // the old, hand-typed date format
  const raw = run("lint.ts", dir, [CV]);
  assert.equal(raw.code, 1);
  assert.match(raw.out, /generated parts are out of date/);
  assert.match(raw.out, /forbidden character "\u2013"/);
});

const lintCases: [string, (dir: string) => void, RegExp][] = [
  ["italics", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the *core* mobile app"), /italics are not supported/],
  ["a table", (d) => edit(d, CV, "# **SUMMARY**\n", "# **SUMMARY**\n\n| a | b |\n"), /tables are not supported/],
  ["unbalanced bold", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the **core mobile app"), /unbalanced \*\*/],
  ["a hidden client name", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered for Clinical Ink the core mobile app"), /confidential term "Clinical Ink"/],
  ["an internal code name", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered the Studio Shell core mobile app"), /confidential term "Studio Shell"/],
  ["a ticket id", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered OR-22199 and the core mobile app"), /ticket id with prefix "OR-"/],
  ["a foreign URL", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered https://example.com/x the core mobile app"), /URL not from profile\.yaml/],
  ["a secret", (d) => edit(d, CV, "* Delivered the research and development (R&D) department's core **React Native** app", "* Delivered token=abcDEF1234567890 the core mobile app"), /credential assignment/],
  ["a wrong years-of-experience number", (d) => edit(d, CV, "7+ years", "12+ years"), /"12\+ years" but the calculated value is/],
  ["a hand-edited job line", (d) => edit(d, CV, "| July 2023 - December 2025", "| July 2023 - January 2026"), /generated parts are out of date/],
];
for (const [name, breakIt, expected] of lintCases) {
  test(`lint catches ${name}`, () => {
    const dir = refreshed();
    breakIt(dir);
    const r = run("lint.ts", dir, [CV]);
    assert.equal(r.code, 1, r.out);
    assert.match(r.out, expected);
  });
}
