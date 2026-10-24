# Gap report: nodejs

Built: 2026-10-24 · Profile: nodejs · Job ad: no

## Strong evidence
- **Node.js backend and REST APIs:** Fused subscription flow with Node.js REST APIs (Express, Sequelize) and Stripe, plus card-removal endpoints (`itjet-fintech#4.6`, `#4.15`); RegiStart minimum viable product with a Node.js, Sequelize and PostgreSQL backend (`itjet-fintech#4.14`); Velas staking-rewards calculation on the Node.js backend, 4x engagement (`velas-wallet#4.6`); lighter REST API responses with filters and pagination (`velas-wallet#4.10`); server-side filtering and a backup blockchain connection (RPC), staking page loading from 2 minutes to 5 seconds (`velas-wallet#4.2`); Jira Forge Node.js resolvers in TypeScript (`designai-jira-plugin#4.1`).
- **PostgreSQL and AWS:** PostgreSQL from EC2 to AWS RDS with query tuning, 2x database performance (`itjet-fintech#4.4`); node-pg-migrate migrations (`itjet-fintech#4.14`, `#4.5` in the summary); CI/CD to AWS EC2 and S3 for RegiStart (`itjet-fintech#4.3`).
- **Azure:** direct Azure Blob Storage uploads in chunks (`designai-jira-plugin#4.3`, `jira-blob-chunks`); Azure DevOps and Pipelines in the SYSPRO Stack line (`syspro-saas-erp#5`).
- **TypeScript:** every recent entry (`syspro-saas-erp#4.1`, `itjet-fintech#4.3`, `designai-jira-plugin#4.1`).
- **Security and auth:** OIDC in a secure micro-frontend setup (`syspro-saas-erp#4.7`), PII redaction (`#4.8`), SSL certificate pinning and SQLCipher (`orion-mobile-clinical-ink#4.5`), reverse tabnabbing fix (`velas-wallet#4.7`).
- **Observability:** OpenTelemetry browser telemetry with a local Node.js OTLP receiver (`syspro-saas-erp#4.8`).
- **CI/CD and Docker:** GitHub Actions code signing (`velas-wallet#4.4`), Bitbucket Pipelines (`itjet-fintech#4.3`); Docker hands-on at Itjet (`itjet-fintech#4.7`), at SYSPRO (`syspro-saas-erp#5`) and on the Jira plugin (hands-on, confirmed by user 2026-10-23, `designai-jira-plugin#5`).
- **HERE Technologies navigation work (new consulting entries):** TypeScript and RxJS guidance and route-change reasons, Protocol Buffers service contracts kept backward compatible, Jest regression tests (`navigation-statistics#4.1` to `#4.4`); voice assistant, passenger second screen, driver warnings, route progress, demo UI and a configuration-driven demo control panel with schema validation (`navigation-poc#4.1`, `#4.3`, `#4.2`, `#4.4`, `#4.6`, `#4.10`).
- **Architecture and leadership:** platform and solution architecture, SDD (`syspro-saas-erp#4.2`, `#4.3`, `syspro-architecture-scope`); team of 8, code reviews and modular architecture at General Motors (`general-motors-navigation#4.1`, `#4.2`, `#4.4`, `#4.10`).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| Recent Node.js backend in production | Itjet 2019-2020 and Velas 2021-2023 are the production backend work; SYSPRO has a Node.js mock backend (`syspro-saas-erp#4.11`) and a local OTLP receiver (`#4.8`), both dev tooling; Jira Forge resolvers (2025) | Add any newer backend work with /add-experience, only if true; until then expect interview questions on recent backend depth |
| AWS depth | Hands-on EC2, S3 and RDS at Itjet (2019-2020); on the clinical-trials app AWS Amplify, AppSync and Cognito are hands-on (confirmed by user 2026-10-22, `orion-mobile-clinical-ink#5`), as app-side client use | Shown in Skills only (decision `skills-only-in-skills-list`); no backend AWS work after 2020 in any source |
| GraphQL | Hands-on at Itjet (`itjet-fintech#4.7`, client or server not stated); Apollo Client 3 and GraphQL hands-on on the clinical-trials app (client side, confirmed 2026-10-22, `orion-mobile-clinical-ink#5`) | Record server-side GraphQL work as a fact with /add-experience, only if true |
| Databases beyond PostgreSQL | PostgreSQL only (Itjet); Realm, SQLCipher and MMKV are mobile storage | Add MongoDB, Redis or others only as facts, and only if true |
| WebSockets, message queues, microservices | WebSockets hands-on at SYSPRO (`syspro-saas-erp#5`, Stack line); no queues or backend microservices | Add contributions with /harvest or /add-experience, only if true |
| Backend testing and API design | No source for API design, load testing or backend tests | Only if true |

## Selection disagreements
- **HERE and Clinical Ink (2026-10-24):** Clinical Ink is now named (`cv_client_label`, decision `hidden-clients`); the bullets kept their wording. The HERE entries name the HNav and HNod SDKs instead of "HERE SDK" (decision `here-sdk-names-in-skills`); the General Motors map library keeps "HERE SDK". This variant selects no HERE bullet that named the SDK, so only the Clinical Ink label changed (**1,786 of 1,800 words**).
- **General Motors:** `#4.9` (delivery and testing process for nested apps) and `#4.10` (moving a feature app into the host app) are mobile architecture work; acceptable for the leadership and architecture story, but they add mobile weight to a backend-leaning CV.
- **Velas:** `#4.10` (lighter API responses) now leads the entry; fine for this profile.
- **Clinical Trials:** limited to 2 bullets by the profile (`entry_max_bullets`); the selected ones (`#4.4` Android 14 migration, `#4.5` SQLCipher and certificate pinning) are native Android work. `#4.1` (the app with React Native, Expo and TypeScript) would explain the contract better than `#4.4`.
- **Jira plugin:** `jira-blob-chunks` is its own bullet, separate from `designai-jira-plugin#4.3` (tailoring-spec 2, step 3).
- **Itjet CI/CD:** the master CV moved the RegiStart CI/CD setup out of the Aspiration bullet (`itjet-fintech#4.3`) into its RegiStart MVP bullet. This profile's `itjet-fintech#4.14` override `text` is used exactly and has no CI/CD, so the CI/CD setup stays in the `#4.3` bullet as its own sentence after the Aspiration result (so the 2x reads as Aspiration only). To match the master, add "Bitbucket Pipelines **CI/CD** to EC2/S3" to the `#4.14` override text (citing `#4.3` through `also`) and the tailor will drop the sentence.
- **HERE entries:** both are frontend-heavy (React, RxJS, Android contracts) and take 10 bullets in a backend-leaning CV; the service-contract work (`navigation-statistics#4.2`) is the most backend-relevant. If space is needed later, `entry_max_bullets: { navigation-poc: 3 }` would be the first cut. The first PoC bullet names the project from the summary's overview (`navigation-poc#1`), since `#4.11` isn't selected.
- **Length:** 1,776 of 1,800 words after shortening the summary and the in-scope entries.
- **Summary:** the Node.js work is described by domain (fitness, non-profit, blockchain, Jira) and "a software services company" (`itjet-fintech#1`), not "fintech": the Node.js projects were Fused and RegiStart, not Aspiration (decision `itjet-client-names`).
