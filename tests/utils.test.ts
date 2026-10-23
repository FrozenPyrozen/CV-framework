// Tests for the utilities: doctor, backup/restore, git-digest, index (step 5, part 4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import JSZip from "jszip";
import { run, slow, tempRepo } from "./helpers.ts";
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
  writeFileSync(join(fresh, "facts/applications.yaml"), "- company: Newer\n");
  utimesSync(join(fresh, "facts/applications.yaml"), new Date(Date.now() + 60_000), new Date(Date.now() + 60_000));
  const r = run("backup.ts", fresh, ["--restore", archive]);
  assert.equal(r.code, 0, r.out);
  assert.equal(readFileSync(join(fresh, "cv/tailored/acme/job-description.md"), "utf8"), "Acme job ad");
  assert.match(r.out, /CONFLICT\s+facts\/applications\.yaml \(the local file is newer; kept it\)/);
  // framework.local.yaml is per laptop: never overwritten; the old one is kept as framework.local.previous.yaml.
  assert.equal(readFileSync(join(fresh, "framework.local.yaml"), "utf8"), "backup_password_env: CV_TEST_PW\nrepos: {}\n");
  assert.match(readFileSync(join(fresh, "framework.local.previous.yaml"), "utf8"), /backup_dir: /);
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
  assert.match(a, /<!-- generated:index -->[\s\S]*`ats\.md`: AI ATS screener[\s\S]*`classic` \(default\): approved/);
  assert.equal(run("index.ts", dir, ["--check"]).code, 0);
  mkdirSync(join(dir, "profiles"), { recursive: true });
  writeFileSync(join(dir, "profiles/rn.yaml"), "schema_version: 1\nid: rn\nheadline: Senior React Native Engineer\nsummary_focus: [react-native]\nemphasize_tags: [react-native]\nskills_order: [mobile]\n");
  assert.equal(run("index.ts", dir, ["--check"]).code, 1);
  run("index.ts", dir);
  assert.match(readFileSync(join(dir, "AGENTS.md"), "utf8"), /`rn\.yaml`: Senior React Native Engineer/);
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
  // A default-market PDF is logged with that market's id, not "default".
  writeFileSync(join(dir, "cv/Kirill_Kohan_CV.pdf"), "%PDF-1.4 fake");
  assert.equal(run("log-application.ts", dir, ["--company", "Beta", "--pdf", "cv/Kirill_Kohan_CV.pdf"]).code, 0);
  assert.match(readFileSync(join(dir, "facts/applications.yaml"), "utf8"), /company: Beta[\s\S]*market: worldwide/);
});

test("backup leaves out built files of tailored CVs (they are recreated)", async () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/tailored/acme/preview"), { recursive: true });
  for (const f of ["cv.md", "jd-tags.yaml", "job-description.md", "job-ad.pdf", "gap-report.md", "Kirill_Kohan_CV.docx", "Kirill_Kohan_CV.pdf", "pdf-check.md", "selection.json", "preview/page-1.png"]) writeFileSync(join(dir, "cv/tailored/acme", f), "x");
  writeFileSync(join(dir, "framework.local.yaml"), `backup_dir: ${join(dir, "bk")}\n`);
  assert.equal(run("backup.ts", dir, ["--no-password"]).code, 0);
  const zip = await JSZip.loadAsync(readFileSync(join(dir, "bk", readdirSync(join(dir, "bk"))[0])));
  const names = Object.keys(zip.files).filter((n) => n.startsWith("cv/tailored/acme/") && !zip.files[n].dir).map((n) => n.slice(17)).sort();
  assert.deepEqual(names, ["cv.md", "gap-report.md", "jd-tags.yaml", "job-ad.pdf", "job-description.md"]); // a job ad saved as PDF travels
});

test("doctor: a summary repo without a local path is info, not a warning", () => {
  const dir = tempRepo();
  writeFileSync(join(dir, "package.json"), readFileSync(join(import.meta.dirname, "..", "package.json")));
  writeFileSync(join(dir, "framework.local.yaml"), "repos: {}\nbackup_dir: backups\n");
  const r = run("doctor.ts", dir, ["--no-export"]);
  assert.match(r.out, /info\s+repos with no local path on this laptop: .*normal once a job has ended/);
  assert.doesNotMatch(r.out, /warn\s+repos with no local path/);
});

test("backup --full: one plain zip with the repo bundle, private backup, manifest and restore steps; restore from it", slow(), async () => {
  const { spawnSync } = await import("node:child_process");
  const dir = tempRepo();
  const sh = (cwd: string, ...a: string[]) => spawnSync(a[0], a.slice(1), { cwd, encoding: "utf8" });
  writeFileSync(join(dir, ".gitignore"), "bk/\ncv/tailored/\nfacts/applications.yaml\nframework.local.yaml\nframework.local.previous.yaml\nsummaries/.digests/\n");
  mkdirSync(join(dir, "cv/tailored/acme"), { recursive: true });
  writeFileSync(join(dir, "cv/tailored/acme/job-description.md"), "Acme job ad");
  writeFileSync(join(dir, "framework.local.yaml"), `backup_dir: ${join(dir, "bk")}\n`);
  sh(dir, "git", "init", "-q", "-b", "main");
  sh(dir, "git", "add", "-A");
  sh(dir, "git", "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "init");
  // Uncommitted changes: refused.
  writeFileSync(join(dir, "summaries/new.md"), "x");
  const refused = run("backup.ts", dir, ["--full", "--no-password"]);
  assert.equal(refused.code, 1);
  assert.match(refused.out, /uncommitted changes .* commit first/);
  rmSync(join(dir, "summaries/new.md"));
  const r = run("backup.ts", dir, ["--full", "--no-password"]);
  assert.equal(r.code, 0, r.out);
  const archive = join(dir, "bk", readdirSync(join(dir, "bk")).find((f) => f.startsWith("cv-full-"))!);
  const zip = await JSZip.loadAsync(readFileSync(archive));
  assert.deepEqual(Object.keys(zip.files).sort(), ["RESTORE.txt", "manifest.json", "private-backup.zip", "repo.bundle"]);
  const manifest = JSON.parse(await zip.file("manifest.json")!.async("string"));
  assert.equal(manifest.branch, "main");
  assert.equal(manifest.private_files, 2);
  assert.match(await zip.file("RESTORE.txt")!.async("string"), /git clone repo\.bundle CV/);
  // The new laptop: clone the bundle, then restore the private part straight from the full archive.
  const target = mkdtempSync(join(tmpdir(), "cv-new-laptop-"));
  writeFileSync(join(target, "repo.bundle"), await zip.file("repo.bundle")!.async("nodebuffer"));
  assert.equal(sh(target, "git", "clone", "-q", "repo.bundle", "CV").status, 0);
  const cv = join(target, "CV");
  assert.ok(existsSync(join(cv, "summaries/syspro-saas-erp.md")));
  assert.ok(!existsSync(join(cv, "cv/tailored")));
  const rr = run("backup.ts", cv, ["--restore", archive]);
  assert.equal(rr.code, 0, rr.out);
  assert.equal(readFileSync(join(cv, "cv/tailored/acme/job-description.md"), "utf8"), "Acme job ad");
  assert.ok(!existsSync(join(cv, "framework.local.yaml")));
  assert.ok(existsSync(join(cv, "framework.local.previous.yaml")));
});

test("status: a sent PDF that is missing is reported; build --no-pdf keeps a sent PDF", () => {
  const dir = tempRepo();
  mkdirSync(join(dir, "cv/markets/ukraine"), { recursive: true });
  writeFileSync(join(dir, "cv/Kirill_Kohan_CV.pdf"), "%PDF-1.4 sent");
  assert.equal(run("log-application.ts", dir, ["--company", "Acme", "--pdf", "cv/Kirill_Kohan_CV.pdf"]).code, 0);
  const b = run("build.ts", dir, ["--no-pdf"]);
  assert.match(b.out, /kept cv\/Kirill_Kohan_CV\.pdf: it was sent/);
  rmSync(join(dir, "cv/Kirill_Kohan_CV.pdf"));
  assert.match(run("status.ts", dir).out, /SENT\s+Acme: the PDF you sent \(cv\/Kirill_Kohan_CV\.pdf\) is missing/);
});

test("tokens rejoin a word broken after a slash at a line end (CI/ + CD)", async () => {
  const { tokens } = await import("../scripts/lib/text.ts");
  assert.deepEqual(tokens("set up CI/\nCD pipelines"), ["set", "up", "ci/cd", "pipelines"]);
});
