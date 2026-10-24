// build: markets, tailored CVs, audit rounds and profile overrides (split from the build tests so files run in parallel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CV, edit, run, tempRepo } from "./helpers.ts";

test("build --market builds one market; a tailored CV gets only the default market", () => {
  const dir = tempRepo();
  const ua = run("build.ts", dir, ["--no-pdf", "--market", "ukraine"]);
  assert.equal(ua.code, 0, ua.out);
  assert.match(ua.out, /markets: ukraine/);
  assert.doesNotMatch(ua.out, /render \(default market\)/);
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  run("refresh.ts", dir);
  // Tailored CVs must be fully sourced: give every claim a placeholder source so the build reaches the markets step.
  // One short bullet is left out: the master CV runs to its own word limit (decision keep-length), a tailored CV's is max_words.
  const sourced = readFileSync(join(dir, "cv/Kirill_Kohan_CV.md"), "utf8").split("\n")
    .filter((l) => !/passenger second-screen/.test(l))
    .map((l) => (/^\* /.test(l) || /^Senior software engineer/.test(l) ? `${l} <!-- src: profile -->` : l)).join("\n");
  writeFileSync(join(dir, "cv/tailored/acme/cv.md"), sourced);
  const t = run("build.ts", dir, ["cv/tailored/acme/cv.md", "--no-pdf"]);
  assert.equal(t.code, 0, t.out);
  assert.match(t.out, /markets: worldwide/);
  assert.ok(!existsSync(join(dir, "cv/tailored/acme/markets")), "no Ukraine version for a tailored CV unless asked");
});

test("round 1 audit: per-entry pending list, --all with --entries-reviewed refused, jd-tags makes a tailored CV stale", () => {
  const dir = tempRepo();
  const V = "cv/variants/fullstack-react-node/cv.md";
  assert.equal(run("build.ts", dir, [V, "--no-pdf", "--entries-reviewed"]).code, 0); // a clean record, whatever the live repo has pending
  // Velas changes: the variant lists it; rewriting another entry (Thermo Fisher) keeps Velas listed.
  edit(dir, "summaries/velas-wallet.md", "Developed the Velas blockchain wallet", "Developed the Velas blockchain wallet app");
  assert.match(run("status.ts", dir).out, /entries to rewrite in variants: velas-wallet/);
  edit(dir, V, "* Built an Internet of Things (**IoT**) healthcare app", "* Built an Internet of Things (**IoT**) healthcare application");
  run("build.ts", dir, [V, "--no-pdf"]);
  assert.match(run("status.ts", dir).out, /entries to rewrite in variants: velas-wallet/);
  // --entries-reviewed works per CV, and is refused with --all.
  const all = run("build.ts", dir, ["--all", "--no-pdf", "--entries-reviewed"]);
  assert.equal(all.code, 2);
  assert.match(all.out, /applies to one CV at a time/);
  // A tailored CV depends on its jd-tags.yaml.
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/cv.md"), readFileSync(join(dir, "cv/variants/react/cv.md"), "utf8")); // fits the react profile's limits
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: react\nrequired: [react]\n");
  assert.equal(run("build.ts", dir, ["cv/tailored/acme/cv.md", "--no-pdf"]).code, 0);
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: react\nrequired: [react]\nheadline: Senior React Engineer\n");
  assert.match(run("status.ts", dir).out, /cv\/tailored\/acme\/jd-tags\.yaml changed/);
});

test("round 2 audit: clear one-line errors, build:all continues past a failing CV, profiles required", async () => {
  const dir = tempRepo();
  const r = run("render.ts", dir, ["--template", "nope"]);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /render: template "nope" not found/);
  assert.doesNotMatch(r.out, /at .*\.ts:\d+/); // no stack trace
  const t = run("trace.ts", dir, ["cv/nope.md"]);
  assert.match(t.out, /trace: file not found/);
  // A variant without its profile: validate says so (and build:all would report that CV, not crash).
  const { rmSync } = await import("node:fs");
  rmSync(join(dir, "profiles/nodejs.yaml"));
  assert.match(run("validate.ts", dir).out, /role profile "nodejs" not found/);
  // A job ad must name its profile.
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "required: [react]\n");
  assert.match(run("validate.ts", dir).out, /jd-tags\.yaml: no profile/);
});

test("round 3 audit: a variant without its profile fails alone; check takes no file; invalid YAML names its file", async () => {
  const { rmSync } = await import("node:fs");
  const dir = tempRepo();
  rmSync(join(dir, "profiles/nodejs.yaml"));
  const r = run("build.ts", dir, ["--all", "--no-pdf"]);
  assert.equal(r.code, 1);
  assert.match(r.out, /FAILED validate: cv\/variants\/nodejs\/cv\.md: role profile "nodejs" not found/);
  assert.match(r.out, /build: 4 of 5 CV\(s\) built; failed: cv\/variants\/nodejs\/cv\.md/);
  assert.match(run("check.ts", dir, ["cv/nope.md"]).out, /check: checks every CV and takes no file/);
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/jd-tags.yaml"), "profile: react\nrequired: [react\n");
  assert.match(run("select.ts", dir, ["cv/tailored/acme", "--tags", "jd-tags.yaml"]).out, /cv\/tailored\/acme\/jd-tags\.yaml: invalid YAML/);
});

test("profile overrides: `also` makes one bullet cite two contributions, the second isn't selected again, and validate checks it", () => {
  const dir = tempRepo();
  const r = run("select.ts", dir, ["cv/variants/nodejs", "--profile", "nodejs"]);
  assert.equal(r.code, 0, r.out);
  const it = JSON.parse(readFileSync(join(dir, "cv/variants/nodejs/selection.json"), "utf8")).entries.find((e: any) => e.id === "itjet-fintech");
  const srcs = it.bullets.map((b: any) => b.src);
  assert.ok(srcs.includes("itjet-fintech#4.6, itjet-fintech#4.15"), srcs.join(" | "));
  assert.ok(!srcs.includes("itjet-fintech#4.15"));
  edit(dir, "profiles/nodejs.yaml", "also: [itjet-fintech#4.15]", "also: [itjet-fintech#4.99]");
  const v = run("validate.ts", dir);
  assert.equal(v.code, 1);
  assert.match(v.out, /also: "itjet-fintech#4\.99" doesn't resolve/);
});

test("select lists the current job's Stack line even when no profile pins it; an older job's only when pinned", () => {
  const dir = tempRepo();
  assert.equal(run("select.ts", dir, ["cv/variants/react", "--profile", "react"]).code, 0);
  const entries = JSON.parse(readFileSync(join(dir, "cv/variants/react/selection.json"), "utf8")).entries;
  assert.equal(entries.find((e: any) => e.id === "syspro-saas-erp").stack, "syspro-saas-erp#5");
  assert.equal(entries.find((e: any) => e.id === "velas-wallet").stack, undefined);
});
