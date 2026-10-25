# Facts Spec

Status: v1 · Applies to: `facts/profile.yaml`, `facts/confirmed.yaml`, `facts/skills.yaml`, `facts/decisions.yaml` the optional, git-ignored `facts/applications.yaml` and `facts/releases.yaml`; written by the advisor (`/add-experience`, `/profile`, `/job-change`, `/improve`), `/harvest` (identities, skills), `npm run log-application` and `npm run release`

The facts files hold what no repo history shows. Their structure is checked by `npm run validate` against `schemas/` (`profile`, `confirmed`, `skills`, `decisions`); this spec gives the meaning and the rules. Every file except the application log carries `schema_version`.

## 1. Personal profile (`facts/profile.yaml`)

All personal details live **only** here. The CV header is **always generated** from this file and never typed into the Markdown, so changing your phone or country is one edit followed by a rebuild.

```yaml
schema_version: 1
name: Kirill Kohan
legal_name: Kyrylo Kokhan              # optional; shown as "Kirill (Kyrylo) Kohan" if show_legal_name is true
show_legal_name: false
git_identities: [Kyrylo Kohan, Kyrylo Kokhan, Kyrylo_Kokhan, FrozenPyrozen]   # default author names for /harvest
headline_default: Senior Software Engineer / Tech Lead (Frontend and Mobile)   # profiles can override
contacts:
  phone: "+380 97 891 9783"            # international format, checked by validate
  email: kiril.kohan@gmail.com
  links:
    - { label: Portfolio, url: "https://drive.google.com/...", show: true }
    - { label: LinkedIn, url: "https://www.linkedin.com/in/kyrylo-kohan/", show: false }
location:
  city: Kyiv
  country: Ukraine
  remote: true
  time_zone: Europe/Kyiv
  overlaps: [EU, UK, US]               # generates "Working hours overlap with EU, UK and US time zones"
work:
  engagement_types: [b2b-contract, full-time]   # generates "Open to B2B contract or full-time employment"
  work_authorization: []               # e.g. ["EU work permit"]; shown when not empty
  open_to_relocation: false
education:
  - { degree: "PhD Candidate, Computer Science", status: in-progress, institution: National University of Life and Environmental Sciences, country: Ukraine, start: 2023, end: 2027, end_expected: true }
  - { degree: Master of Computer Science, institution: ..., country: Ukraine, start: 2020, end: 2022, honors: "Honors Diploma (top 10% of graduates)" }
languages:
  - { language: English, level: "C1 (Advanced)" }
```

- The header lines (name, headline, location, availability, time zones, contacts) are generated from these fields with the header templates in `framework.config.yaml`, then filtered by the market (`cv-spec.md` 14). Changing `country` changes every line that depends on it.
- `lint` fails if any CV, role variant or tailored CV has a header that doesn't match the generated one (for example, an old phone number left in one file).
- The HR rubric reads `location` and `work` to choose its questions: hiring setup from Ukraine, a work permit in a new country, relocation, time-zone overlap.
- Availability is a profile field (`work.engagement_types`), not a fact; the employment type of a job is its entry's `engagement`.

## 2. Confirmed facts (`facts/confirmed.yaml`)

Things the user confirmed that no repo history shows, each a source a CV bullet or summary sentence can cite by id.

```yaml
schema_version: 1
facts:
  - id: syspro-team-size
    fact: The SYSPRO platform program has 25+ people (frontend, backend, architects).
    source: user, 2026-10-15
    entry: syspro-saas-erp           # which job this fact belongs to (summary id or cv_entry id)
    tags: [scale, enterprise]
  - id: various-clients              # a CV entry defined in facts, not in a summary
    type: cv_entry
    role: Software Engineering Consultant
    client: Various Clients
    cv_client_label: Various Clients
    cv_location: Remote
    engagement: freelance
    period: { start: 2017-01, end: present }
    cv_section: consulting
    show_dates_in_cv: false
    counts_as_experience: false
    source: user + previous CV
```

- Every fact, except `cv_entry` items, has `entry` (which job it belongs to) and `tags` (from the config tag list), so the composer knows where to place it and role profiles select it like a summary contribution. Separate claims are separate facts (for example interviews, audits and presales).
- **`cv_entry` items** define an entry that doesn't come from a single repo (e.g. *Software Engineering Consultant / Various Clients*), with the same placement fields as a summary's front matter (`work-summary-spec.md` 2), so they're placed the same way.
- Contract status and availability are **not** facts: the employment type lives in each entry's `engagement` (a summary or a `cv_entry`), availability in `profile.yaml`.
- Facts may hold internal names for context; CVs paraphrase them (`cv-spec.md` 11).
- CV writing rules (SDD emphasis, hidden client names, forbidden characters, company spelling) go into `cv-spec.md`, not into this file.

## 3. Skills (`facts/skills.yaml`)

The SKILLS section's only source; nothing is typed into the CV.

```yaml
schema_version: 1
categories:
  - id: mobile
    label: Mobile
    items:
      - { name: React Native, tags: [react-native] }
      - { name: "Android (Java, Kotlin, Gradle)", tags: [android] }   # quoted: the name has commas
```

- Role profiles reorder categories with `skills_order` (category ids; unlisted categories come last).
- Optional item fields: `calculated: team_size_led` (the number in the skill name comes from the calculated value, `cv-spec.md` 7) and `hidden: true` (kept but not shown in any CV).
- A skill is **supported** when its tags appear on a contribution or fact, or when a summary's section 5 lists it as **hands-on** (e.g. Fastlane and Bitrise in the General Motors summary). `validate` warns about unsupported skills and about the same skill listed twice.
- New skills for technologies used hands-on are proposed by `/harvest` or `/add-experience` and added only after approval.

## 4. Decisions (`facts/decisions.yaml`)

Choices the user made about the CV (`id`, `decision`, `date`, `why`, `matches`). Agents follow them; reviewers list findings that match `matches` under *Decided* instead of raising them (`review-report-spec.md`). Findings the user declines in `/improve` become decisions.

## 5. Application log (`facts/applications.yaml`, optional, git-ignored)

Records what each recruiter received, so "which CV did I send them?" has an answer later. `npm run log-application` adds an entry after a build.

```yaml
- date: 2026-10-20
  company: Example Corp
  role: Senior React Native Engineer
  cv: cv/tailored/example-corp-senior-rn/      # the folder of the PDF that was sent (e.g. cv/variants/react/markets/ukraine)
  pdf: cv/tailored/example-corp-senior-rn/Kirill_Kohan_CV.pdf   # the PDF that was sent
  pdf_sha256: "3f1c..."                        # its hash (status refuses an unquoted all-digit hash, which YAML would read as a number)
  acknowledged_sha256: null                    # set by status --ack when you know the CV changed since
  build_commit: 772590a                        # git commit of the sources at build time
  market: worldwide                            # which market version was sent
  exporter: pages                              # which PDF exporter built it (PDFs can differ slightly between exporters)
  sent_copy: cv/sent/2026-10-20-example-corp.pdf   # optional exact copy of the sent PDF (--keep-copy; git-ignored, included in backups)
  status: applied                              # applied | interview | offer | rejected | withdrawn
  notes: ""
```

`npm run status` warns once per application when a PDF you sent has since been rebuilt with changes (or is gone with no kept copy), so you know a recruiter has an older version; `status --ack <company>` records that you know. CVs whose sources changed but aren't rebuilt yet show up as stale. The file is git-ignored like tailored CVs and travels in backups (`portability-spec.md`).

## 6. Releases (`facts/releases.yaml`, optional)

The CV and portfolio versions you accepted and shared (the PDF behind the portfolio link in the header, the CV you hand out), so "is the shared copy current?" has an answer. `npm run release [--note "<text>"]` adds an entry after a build; it refuses while the master CV or the portfolio is out of date (`npm run status`) or tracked files have uncommitted changes, so the commit names the sources. It's in git: nothing in it is private.

```yaml
schema_version: 1
releases:                                       # newest last
  - date: 2026-10-25
    commit: bcb57eb                             # git commit of the sources
    note: Uploaded to the Drive portfolio link  # optional
    files:                                      # the master CV in every market, the portfolio in every page size
      - path: cv/Kirill_Kohan_CV.pdf
        sha256: "…"                             # the PDF as shared
        source: cv/Kirill_Kohan_CV.md           # the Markdown it was built from (a market's own Markdown for a market PDF)
        source_sha256: "…"
        exporter: pages
```

`npm run status` compares the latest release with the current Markdown: when a released file's text changed, it says to build, share the new PDF and run `npm run release` again. A rebuild with the same text isn't reported (exporters write slightly different PDFs each time). Sources are untouched: a release is a record of an output, never a source (`sources-spec.md` 3).
