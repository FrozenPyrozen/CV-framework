// Tests for the utilities: doctor, backup/restore, git-digest, index (step 5, part 4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import JSZip from "jszip";
import { run, tempRepo } from "./helpers.ts";
import { decrypt, encrypt } from "../scripts/backup.ts";
import { areaOf, matcher } from "../scripts/git-digest.ts";

test("doctor --no-export reports Node, dependencies, settings and exporters", () => {
  const dir = tempRepo();
  for (const f of ["package.json"]) writeFileSync(join(dir, f), readFileSync(join(import.meta.dirname, "..", f)));
  const r = run("doctor.ts", dir, ["--no-export"]);
  assert.match(r.out, /ok\s+Node /);
  assert.match(r.out, /warn\s+framework\.local\.yaml is missing/);
  assert.match(r.out, /PDF exporter pages:/);
});

test("encrypt/decrypt round trip; wrong password fails", () => {
  const data = Buffer.from("secret job ad");
  const enc = encrypt(data, "pw1");
  assert.ok(!enc.includes(data));
  assert.deepEqual(decrypt(enc, "pw1"), data);
  assert.throws(() => decrypt(enc, "pw2"), /wrong password/);
});

test("backup and restore: encrypted, newer local files kept as conflicts, nothing outside backup paths", async () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/job-description.md"), "Acme job ad");
  writeFileSync(join(dir, "facts/applications.yaml"), "- company: Acme\n");
  writeFileSync(join(dir, "framework.local.yaml"), `backup_dir: ${join(dir, "bk")}\nbackup_password_env: CV_TEST_PW\n`);
  const env = { ...process.env, CV_TEST_PW: "s3cret" };
  process.env.CV_TEST_PW = "s3cret";
  const b = run("backup.ts", dir);
  assert.equal(b.code, 0, b.out);
  const archive = join(dir, "bk", readdirSync(join(dir, "bk"))[0]);
  assert.match(archive, /\.zip\.enc$/);
  // New laptop: files gone; one local file is newer than the backup.
  const fresh = tempRepo();
  writeFileSync(join(fresh, "framework.local.yaml"), "backup_password_env: CV_TEST_PW\nrepos: {}\n");
  utimesSync(join(fresh, "framework.local.yaml"), new Date(Date.now() + 60_000), new Date(Date.now() + 60_000));
  const r = run("backup.ts", fresh, ["--restore", archive]);
  assert.equal(r.code, 0, r.out);
  assert.equal(readFileSync(join(fresh, "cv/tailored/acme/job-description.md"), "utf8"), "Acme job ad");
  assert.match(r.out, /CONFLICT\s+framework\.local\.yaml \(the local file is newer; kept it\)/);
  // A foreign archive can't write outside the backup paths.
  const zip = new JSZip();
  zip.file("scripts/evil.ts", "x");
  zip.file("cv/tailored/x/cv.md", "ok");
  writeFileSync(join(fresh, "foreign.zip"), await zip.generateAsync({ type: "nodebuffer" }));
  const f = run("backup.ts", fresh, ["--restore", "foreign.zip"]);
  assert.ok(!existsSync(join(fresh, "scripts/evil.ts")));
  assert.ok(existsSync(join(fresh, "cv/tailored/x/cv.md")));
  assert.match(f.out, /1 restored, 1 skipped/);
  void env;
});

test("git-digest: identities, areas, co-authored and possibly-yours commits", () => {
  assert.equal(areaOf("apps/login/src/a.ts"), "apps/login");
  assert.equal(areaOf("docs/a.md"), "docs");
  assert.ok(matcher(["Kyrylo Kohan"])("kyrylo kohan", "x@y.z"));
  assert.ok(matcher(["Kyrylo_Kokhan"])("Kyrylo Kokhan", "x@y.z"));
  const repo = mkdtempSync(join(tmpdir(), "cv-git-"));
  const g = (args: string[], env: Record<string, string> = {}) => execFileSync("git", ["-C", repo, ...args], { env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", ...env }, encoding: "utf8" });
  g(["init", "-q"]);
  const commit = (who: string, email: string, file: string, msg: string) => {
    mkdirSync(join(repo, file, ".."), { recursive: true });
    writeFileSync(join(repo, file), String(Math.random()));
    g(["add", "-A"]);
    g(["-c", `user.name=${who}`, "-c", `user.email=${email}`, "commit", "-q", "-m", msg]);
  };
  commit("Kyrylo Kohan", "k@work.com", "apps/login/a.ts", "Add login page");
  commit("Kyrylo Kohan", "k@work.com", "apps/login/b.ts", "Add password reset");
  commit("Someone Else", "s@work.com", "apps/shell/c.ts", "Add shell\n\nCo-authored-by: Kyrylo Kohan <k@work.com>");
  commit("Someone Else", "s@work.com", "docs/d.md", "Merged PR 42: telemetry by Kyrylo Kohan");
  const dir = tempRepo();
  const r = run("git-digest.ts", dir, ["myrepo", "--path", repo, "--run", "t"]);
  assert.equal(r.code, 0, r.out);
  const d = readFileSync(join(dir, ".cv-runs/t/git-digest.md"), "utf8");
  assert.match(d, /Your commits: 2 of 4 non-merge commits/);
  assert.match(d, /\| apps\/login \| 2 \|/);
  assert.match(d, /Co-authored-by[\s\S]*Someone Else: Add shell/);
  assert.match(d, /Possibly yours[\s\S]*Merged PR 42: telemetry by Kyrylo Kohan/);
});

test("index creates and updates the registry block in AGENTS.md", () => {
  const dir = tempRepo();
  writeFileSync(join(dir, "AGENTS.md"), "# Agents\n\nIntro.\n");
  run("index.ts", dir);
  const a = readFileSync(join(dir, "AGENTS.md"), "utf8");
  assert.match(a, /<!-- generated:index -->[\s\S]*\[ats\.md\]\(specs\/rubrics\/ats\.md\)[\s\S]*`classic` \(default\): approved/);
  assert.equal(run("index.ts", dir, ["--check"]).code, 0);
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/rn.yaml"), "schema_version: 1\nid: rn\nheadline: Senior React Native Engineer\nsummary_focus: [react-native]\nemphasize_tags: [react-native]\nskills_order: [mobile]\n");
  assert.equal(run("index.ts", dir, ["--check"]).code, 1);
  run("index.ts", dir);
  assert.match(readFileSync(join(dir, "AGENTS.md"), "utf8"), /\[rn\.yaml\]\(profiles\/rn\.yaml\): Senior React Native Engineer/);
});

test("log-application records a sent CV with a quoted hash, market and optional exact copy", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/markets/ukraine"), { recursive: true });
  writeFileSync(join(dir, "cv/markets/ukraine/Kirill_Kohan_CV_UA.pdf"), "%PDF-1.4 fake");
  const r = run("log-application.ts", dir, ["--company", "Acme Corp", "--role", "Senior RN", "--pdf", "cv/markets/ukraine/Kirill_Kohan_CV_UA.pdf", "--keep-copy"]);
  assert.equal(r.code, 0, r.out);
  const y = readFileSync(join(dir, "facts/applications.yaml"), "utf8");
  assert.match(y, /company: Acme Corp/);
  assert.match(y, /market: ukraine/);
  assert.match(y, /pdf_sha256: "?[0-9a-f]{16}"?/);
  assert.ok(existsSync(join(dir, `cv/sent/${new Date().toISOString().slice(0, 10)}-acme-corp.pdf`)));
  assert.match(run("status.ts", dir).out, /status:/); // the log parses and status reads it
});

test("doctor: a summary repo without a local path is info, not a warning", () => {
  const dir = tempRepo();
  writeFileSync(join(dir, "package.json"), readFileSync(join(import.meta.dirname, "..", "package.json")));
  writeFileSync(join(dir, "framework.local.yaml"), "repos: {}\nbackup_dir: backups\n");
  const r = run("doctor.ts", dir, ["--no-export"]);
  assert.match(r.out, /info\s+repos with no local path on this laptop: .*normal once a job has ended/);
  assert.doesNotMatch(r.out, /warn\s+repos with no local path/);
});
