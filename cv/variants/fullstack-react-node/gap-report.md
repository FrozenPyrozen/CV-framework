# Gap report: fullstack-react-node

Built: 2026-10-16 · Profile: fullstack-react-node · Job ad: no

## Strong evidence
- **React and TypeScript:** SYSPRO schema-driven React 19 runtime, view orchestration, Login micro-frontend (`syspro-saas-erp#4.1`, `#4.5`, `#4.6`); Jira Forge app (`designai-jira-plugin#4.1`, `#4.2`); Velas wallet (`velas-wallet#4.1`, `#4.8`); Itjet (`itjet-fintech#4.1`, `#4.3`).
- **Architecture:** SDD process and platform/solution architecture work (`syspro-saas-erp#4.2`, `syspro-architecture-scope`), frontend tech-stack decision record (`syspro-saas-erp#4.3`); micro-frontend, zero-trust OIDC setup (`syspro-saas-erp#4.7`); General Motors modular architecture (`general-motors-navigation#4.4`); Thermo Fisher app from scratch (`thermo-fisher-dosimeter#4.1`).
- **Leadership:** team of 8 at General Motors (`general-motors-navigation#4.1`, `#4.2`), OMO Systems (`omo-systems-smart-home#4.5`), The Admasters (`admasters-ecommerce#4.2`), technical interviews (`consulting-interviews`).
- **Next.js and SSR:** Itjet (`itjet-fintech#4.7`), The Admasters (`admasters-ecommerce#4.3`).
- **Payments:** Stripe subscription flow (`itjet-fintech#4.6`), payment gate with 10x income growth (`omo-systems-smart-home#4.3`).
- **Postgres, AWS, CI/CD:** RDS migration and schema migrations (`itjet-fintech#4.4`, `#4.5`), CI/CD on AWS EC2/S3 (`itjet-fintech#4.3`), GitHub Actions releases (`velas-wallet#4.4`).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| Recent Node.js backend | Itjet REST APIs (2019-2020), Velas Node.js staking backend (2021-2023), Jira Forge Node.js resolvers, SYSPRO Node.js mock backend (`syspro-saas-erp#4.11`, not selected). No sourced production backend work after 2023 yet. User context (2026-10-16, not a CV claim): there is backend work after 2023, to be added later. | Add it with /add-experience; until then the summary keeps calling the Node.js work "earlier". |
| AWS | Only Itjet 2019-2020 (EC2, S3, RDS). Recent cloud work is Azure (Pipelines, Blob Storage). | Add newer AWS work as a fact only if it exists. |
| GraphQL | Hands-on at Itjet (`itjet-fintech#4.7`); the Clinical Trials app summary lists Apollo Client, AWS AppSync and GraphQL as "used by the project". User context (2026-10-16, not a CV claim): GraphQL was also used on the clinical-trials app and other projects. | Only if your own work there was hands-on: record it in that summary (/harvest), and the other projects via /add-experience. |
| WebSockets | SYSPRO section 5 lists WebSockets as hands-on (confirmed 2026-10-15), but no contribution describes it and the SYSPRO Stack line omits it. | Add a contribution (or add WebSockets to the master Stack line) via /compose or /harvest so variants can cite it. |
| Docker | Evidence is thin rather than missing: hands-on at Itjet (`itjet-fintech#4.7`, "containerized services with Docker") and at SYSPRO (summary section 5, Stack line); used by the Jira plugin project (Docker and Helm deployment). Only one bullet shows it. | If there is more container or deployment work, describe it in a summary so a bullet can cite it. |

## Selection disagreements
- **SYSPRO `#4.11` (Node.js mock backend) and `#4.9` (Vitest/Playwright tests)** would show Node.js and testing for this profile better than `#4.6` (Login micro-frontend) now that `#4.8` (telemetry) is out. Consider adding `testing` to `emphasize_tags`, or pinning `#4.11`.
- **Thermo Fisher `#4.4` (firmware background jobs, score 0)** was chosen only to reach the minimum; `#4.5` (OAuth 2.0 login) fits a full-stack profile better. Consider adding `oauth`/`security` to `emphasize_tags`.
- **General Motors `#4.3` (HERE SDK map library)** is picked despite the `here-sdk` de-emphasis because its `micro-frontends` tag cancels it out; acceptable, but `#4.7` (voice AI assistant proof of concept) is an alternative.
