# Gap report: nodejs

Built: 2026-10-16 · Profile: nodejs · Job ad: no

## Strong evidence
- Node.js backend and REST APIs: Itjet subscription flow with Node.js REST APIs and Stripe (itjet-fintech#4.6); Velas staking-rewards calculation on the Node.js backend, 4x engagement (velas-wallet#4.6); server-side filtering and blockchain-node RPC fallback, 12x faster (velas-wallet#4.2); Jira Forge Node.js resolvers in TypeScript (designai-jira-plugin#4.1).
- PostgreSQL and AWS: PostgreSQL migration from EC2 to AWS RDS with query tuning, 2x database performance (itjet-fintech#4.4); node-pg-migrate schema migrations (itjet-fintech#4.5); AWS EC2/S3 CI/CD (itjet-fintech#4.3).
- TypeScript: every recent entry (syspro-saas-erp#4.1, itjet-fintech#4.3, orion-mobile-clinical-ink#4.2, designai-jira-plugin#4.1).
- Security and auth: OIDC in the Login micro-frontend and host application, zero-trust micro-frontend setup (syspro-saas-erp#4.7), PII redaction (syspro-saas-erp#4.8), OAuth 2.0 (thermo-fisher-dosimeter#4.5), SSL pinning and SQLCipher (orion-mobile-clinical-ink#4.5), reverse tabnabbing fix (velas-wallet#4.7).
- Observability: OpenTelemetry browser telemetry with a Node.js OTLP receiver (syspro-saas-erp#4.8).
- CI/CD and Docker: GitHub Actions code signing (velas-wallet#4.4), Bitbucket Pipelines CI/CD (itjet-fintech#4.3), Docker hands-on at Itjet ("containerized services with Docker", itjet-fintech#4.7) and at SYSPRO (syspro-saas-erp#5, in the Stack line); Docker and Helm were also used by the Jira plugin project (designai-jira-plugin#5, not hands-on). Azure Pipelines (syspro-saas-erp#4.10) is no longer a selected bullet.
- Architecture and leadership: platform and solution architecture with the lead architect, SDD (syspro-saas-erp#4.2, #4.3, syspro-architecture-scope); team of 8 at General Motors (general-motors-navigation#4.1, #4.2, #4.4).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| Recent Node.js backend in production | Itjet 2019-2020 and Velas 2021-2023 are the only production backend work; SYSPRO has a Node.js mock backend (syspro-saas-erp#4.11) and a local Node.js OTLP receiver (#4.8), both dev tooling; Jira Forge resolvers. User context (2026-10-16): there is backend work after 2023 that the user will add later | Add that work with /add-experience, then rebuild this variant. Until then the CV shows no production backend after 2023, so expect interview questions on recent backend depth. |
| Databases beyond PostgreSQL | PostgreSQL only (Itjet); Realm and SQLCipher are mobile storage | Add MongoDB, Redis or others only as facts, and only if true. |
| GraphQL | "used GraphQL" at Itjet (itjet-fintech#4.7), client or server unclear. User context (2026-10-16): GraphQL was also used on the clinical-trials app (Orion summary section 5 lists Apollo Client, AWS AppSync and GraphQL as used by the project, not hands-on) and on other projects | To show it in the CV, record the hands-on GraphQL work as a contribution or confirmed fact (/add-experience), including whether any of it was server side. |
| WebSockets, message queues, microservices | WebSockets hands-on in SYSPRO section 5 only; no queues or backend microservices | Add contributions with /harvest or /add-experience if any exist. |
| Backend testing and API design | No source for API design, load testing or backend tests | Same: only if true. |
| AWS depth | Hands-on EC2, S3, RDS at Itjet (2019-2020); AWS AppSync used by the clinical-trials project (not hands-on) | No recent hands-on AWS work in any source; add it with /add-experience if true. |

## Selection disagreements
- Velas: #4.6 (Node.js staking rewards) and #4.2 (server-side filtering) would fit better right after #4.1 than the code-signing bullet (#4.4).
- Thermo Fisher: #4.2 (MQTT over TLS with client certificates, 30% faster) is closer to backend and security work than #4.1.
- (Resolved on 2026-10-16 by the profile update: headline now "Senior Full-Stack Engineer (TypeScript, Node.js, React)"; SYSPRO #4.3, #4.1 and #4.11 pinned after #4.2; General Motors #4.1 pinned first.)
