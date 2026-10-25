# Open items

Things you said you'll add or answer later. They are **not facts yet**, so no CV claims them. The advisor reads this file at `/improve`, `/add-experience`, `/profile` and `/job-change`, asks about the items that fit, and moves each answered one into facts, decisions or a summary, then removes it here.

Kept in the repo (not in any AI tool's memory) so it travels to every laptop (`specs/portability-spec.md` 1).

## Experience to add (`/add-experience`)

| Item | What you said | Where it goes | Since |
|---|---|---|---|
| More skills | More detail on Styled Components, Redux Thunk, Keychain, React Testing Library and others | summaries' section 5, `facts/skills.yaml` | 2026-10-16 |
| Smarty sheets on Aspiration signup | The published portfolio lists "Smarty sheets" among the Aspiration signup technologies; you think it could be a CSS-in-JS styling library (2026-10-23), not confirmed; SmartyStreets (the address API) is the other reading. Left out of the portfolio until then | `itjet-fintech` section 5 and the portfolio's aspiration-signup page | 2026-10-23 |
| OMO leadership | The CV's "Team Leader, led and mentored a team of about 3 engineers" stays for now; the April 2025 portfolio said "tech lead for a sprint of the frontend team". You'll share more details | `omo-systems-smart-home` 4.5 and section 3 | 2026-10-22 |
| GM details | The portfolio's description is used for now (phone companion app for owners, map team of 8: 6 React Native, 1 iOS, 1 Android); you'll share more | `general-motors-navigation` | 2026-10-22 |
| Admasters stack | Which technologies did the Full-Stack Engineer and Team Leader role use (backend too)? Its bullets name none (review 2026-10-23-1705) | `admasters-ecommerce` summary section 5 and its bullets | 2026-10-23 |
| Other work projects | You'll run the portable harvest prompt (generate it with `npm run harvest-prompt`, or `/harvest-prompt --merge <id>` for an existing summary) on the other machines and bring the summaries back for `/import-summary` | new `summaries/<id>.md`, then `/compose` and `/variants` | 2026-10-23 |
| HERE period and employer | The HERE navigation work (`navigation-statistics`, `navigation-poc`) began as a GM project and continued in the HERE team: who employed you there, and from when to when? The summaries keep provisional commit dates (2024-10 to 2025-02; 2025-07 to 2026-10, which overlaps SYSPRO); the consulting section shows no dates. Also team size and collaborators (TODO in both) | both summaries' `period`, `engagement`, sections 1, 3 and 7 | 2026-10-23 |
| PoC assisted-driving icons | "Migrated assisted-driving status icons and notifications" (PoC bullet in the react and nodejs variants): migrated to what? (proofreading 2026-10-24) | `navigation-poc` 4.4 | 2026-10-24 |
| ERP smart-tag fixtures | "ERP smart-tag fixtures and view-management routes" (SYSPRO, nodejs variant): a plain way to say what they are? (proofreading 2026-10-24) | `syspro-saas-erp` 4.11 | 2026-10-24 |
| GM migration request | "At the client's request, changed the architecture to move a reusable feature app into the host app": General Motors employed you directly (decision `direct-employment`), so who asked (product owners, the host app team, the car brand …)? Wording stays until then | `general-motors-navigation` 4.10, then the `react`, `nodejs` and `fullstack-react-node` variants | 2026-10-23 |
| Recent backend work | The master CV's backend evidence since 2021 is short (Velas staking backend, Jira Forge resolvers, the SYSPRO mock backend). Is there newer Node.js work to add, or is it a decision that Node-first jobs get the `nodejs` / `fullstack-react-node` variants? (review 2026-10-23-1854 ats-1, hr-2) | facts or `facts/decisions.yaml` | 2026-10-23 |
| Various clients stack | The consulting bullets "reducing operational costs by up to 50% …" and "JavaScript subject-matter expert … webinars" name no technology: which stack, and should the webinar bullet merge into the interviews one? (review 2026-10-23-1854 ats-4) | `various-clients` cv_entry facts | 2026-10-23 |

## Portfolio, before replacing the Drive PDF (review `reports/2026-10-23-1855/`)

| Item | Question | Where it goes | Since |
|---|---|---|---|
| OMO description | The OMO page repeats video surveillance and motion-sensor scenarios; what did "traffic monitoring" mean for a home? (proofreading-4) | `omo-systems-smart-home` and its portfolio text | 2026-10-23 |
| First release | You chose to record the current CV and portfolio as the accepted, shared versions: after sharing the PDFs (the Drive file behind the portfolio link), run `npm run release` on a committed tree and commit `facts/releases.yaml` | `facts/releases.yaml` (`specs/facts-spec.md` 6) | 2026-10-25 |

## Framework decisions (from the alignment audits, 2026-10-25)

| Item | Question | Where it goes | Since |
|---|---|---|---|
| HERE summaries' employer and period | `navigation-poc` and `navigation-statistics` show in the CV while their employer and period are still open: confirm them, or mark them `# TODO (needs user input): confirm` with `show_in_cv: false` until you do (work-summary-spec 3) | the two summaries' front matter, or a decision | 2026-10-25 |
| Portfolio phone | The portfolio spec allows the phone on the cover with decision `portfolio-show-phone`, but refresh never writes it: implement it, or drop the exception (specs/outputs/portfolio.md 1 and 4) | the portfolio spec, `scripts/portfolio.ts` | 2026-10-25 |
| Arial in `classic` | `classic`'s `fonts:` lists Arial, which only its page header uses (and `strip_header_text` empties); the fonts rule says only the fonts the visible text uses: document the header exception, or drop Arial | `specs/templates.md` 2, `templates/classic/style-map.yaml` | 2026-10-25 |
| Changelog for non-framework files | Should changes to `README.md`, `.gitignore`, `.claude/settings.json`, `.nvmrc`, `tsconfig.json` and `framework.local.example.yaml` also need a changelog row (`npm run impact` I1)? | `specs/alignment-spec.md` 3, `scripts/impact.ts` | 2026-10-25 |
| Stray CNS file | `sources/media/portfolio-2025-04/.claude/cns-preferences.local.md` (git-ignored) belongs to another project: delete it | delete by hand | 2026-10-25 |

## Questions from the first review (`reports/2026-10-16-1201/`)

| Item | Question | Source |
|---|---|---|
| Velas leadership | What did "Technical Leader" cover? Did you lead people, and how many? (asked again 2026-10-23: later) | ats-1, hr-5; 2026-10-23-1349 ats-1, hr-7 |

## Parked (you said: not for now, 2026-10-23; the advisor doesn't ask about these until you bring them back)

| Item | What you said | Where it goes | Since |
|---|---|---|---|
| Older CVs | The April 2025 portfolio is imported (`doc:portfolio-2025-04`, proposals gone through on 2026-10-22); older CVs are still to come | `/import-docs`, summaries | 2026-10-16 |

## Interview preparation (answers only; the CV doesn't change) (parked 2026-10-23: not for now)

| Topic | Question | Source |
|---|---|---|
| Side work | The clinical and Jira plugin contracts overlapped full-time jobs: was that allowed, and how many hours a week? | hr-2 |
| Notice period | Earliest start date after an offer | 2026-10-23-1349 hr-5 |
| Hiring route | How a company outside Ukraine hires you: B2B (Ukrainian FOP), Employer of Record, or both | 2026-10-16 review, 2026-10-23-1349 hr-4 |
| Outages | How you keep working through power or internet outages in Kyiv | hr-6 (2026-10-16), hr-8 (2026-10-23) |
| Why move now | A "Tech Lead" headline over a current Senior Software Engineer role of about 11 months: the role you want next, lead or hands-on, and why you're looking | 2026-10-23-1854 hr-1 (master) |
| Time zones | A concrete overlap window with US time zones (US West is 10 hours behind Kyiv); maybe `overlaps` in `profile.yaml` | 2026-10-23-1854 hr-2 (react) |
| PhD workload | Hours a week for the PhD (2023 to 2027) and how it fits around work | 2026-10-23-1854 hr-3 (react) |
| Title changes | Team Leader (2019) to Software Engineer (2020–2021) to Team Leader: one line on why | 2026-10-23-1854 hr-4 (master) |
