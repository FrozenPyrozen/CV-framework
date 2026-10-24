# Gap report: fullstack-react-node

Built: 2026-10-24 · Profile: fullstack-react-node · Job ad: no

## Strong evidence
- **React and TypeScript:** SYSPRO schema-driven React 19 runtime (first SYSPRO bullet, decision `syspro-runtime-bullet-first`), view orchestration and Login micro-frontend (`syspro-saas-erp#4.1`, `#4.5`, `#4.6`); Jira Forge app (`designai-jira-plugin#4.1`, `#4.2`); Velas wallet (`velas-wallet#4.1`, `#4.8`, `#4.10`); Itjet TypeScript adoption and RegiStart React frontend (`itjet-fintech#4.3`, `#4.14`).
- **Node.js and REST APIs:** Fused subscription flow with Node.js REST APIs and Stripe, card-removal endpoints (`itjet-fintech#4.6`, `#4.15`); RegiStart Node.js backend with Sequelize (`itjet-fintech#4.14`); Velas staking-rewards backend and lighter REST API responses (`velas-wallet#4.6`, `#4.10`); Jira Forge Node.js resolvers (`designai-jira-plugin#4.1`).
- **PostgreSQL, AWS, CI/CD:** PostgreSQL to AWS RDS, 2x database performance (`itjet-fintech#4.4`); node-pg-migrate migrations (`#4.14`); CI/CD on AWS EC2 / S3 for RegiStart (`#4.3`); GitHub Actions builds and signing (`velas-wallet#4.4`).
- **HERE Technologies navigation work (consulting entries):** React and RxJS voice AI assistant client integration for the PoC built in HERE's R&D team, passenger second screen for Bentley, driver warnings with Android service contracts (`navigation-poc#4.1`, `#4.3`, `#4.2`); TypeScript and RxJS route-change reasons on a truck navigation app and Protocol Buffers contracts kept backward compatible (`navigation-statistics#4.1`, `#4.2`, `#4.5`).
- **Architecture:** SDD and platform / solution architecture (`syspro-saas-erp#4.2`, `#4.3`, `syspro-architecture-scope`); secure OIDC micro-frontend setup (`syspro-saas-erp#4.7`); General Motors modular architecture and the move of a feature app into the host app (`general-motors-navigation#4.4`, `#4.10`).
- **Next.js, GraphQL and Docker:** Itjet (`itjet-fintech#4.7`), The Admasters (`admasters-ecommerce#4.3`); Docker hands-on at Itjet, SYSPRO (`syspro-saas-erp#5`) and the Jira plugin (confirmed by user 2026-10-23).
- **Payments:** Stripe subscription flow (`itjet-fintech#4.6`); the OMO payment gate with 10x income growth is no longer selected (`omo-systems-smart-home#4.3`).
- **Leadership:** team of 8 at General Motors (`general-motors-navigation#4.1`, `#4.2`), OMO Systems (`omo-systems-smart-home#4.5`), The Admasters (`admasters-ecommerce#4.2`), technical interviews (`consulting-interviews`).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| Recent Node.js backend | Itjet REST APIs (2019-2020), Velas Node.js backend (2021-2023), Jira Forge Node.js resolvers (2025), SYSPRO Node.js mock backend (`syspro-saas-erp#4.11`, not selected); no sourced production backend work after 2023 | Add newer backend work with /add-experience, only if true |
| AWS | Hands-on EC2, S3 and RDS at Itjet (2019-2020); AWS Amplify, AppSync and Cognito hands-on on the clinical-trials app (client side, confirmed by user 2026-10-22, `orion-mobile-clinical-ink#5`); recent cloud work is Azure (Pipelines, Blob Storage) | Amplify, AppSync and Cognito stay in Skills (decision `skills-only-in-skills-list`) |
| GraphQL | Hands-on at Itjet (`itjet-fintech#4.7`); Apollo Client 3 and GraphQL hands-on on the clinical-trials app (confirmed 2026-10-22, `orion-mobile-clinical-ink#5`) | The clinical-trials bullet could name GraphQL citing `orion-mobile-clinical-ink#5` (review 2026-10-23-1705 ats-1); Apollo Client stays in Skills by decision |
| WebSockets | Hands-on at SYSPRO (`syspro-saas-erp#5`, Stack line) with no contribution describing the work | Add a contribution with /harvest so a bullet can cite it |
| Admasters stack | Bullets name only Next.js and SSR; section 5 is TODO (open item "Admasters stack") | Answer the open item with /add-experience |

## Selection disagreements
- **General Motors:** `#4.10` (moving a feature app into the host app) and `#4.9` (delivery and testing process) push out `#4.5` (95% unit-test coverage strategy, a number). For full-stack roles `#4.5` is stronger than `#4.3` (map library).
- **Thermo Fisher `#4.4`** (firmware background jobs) is chosen only to reach the minimum; `#4.5` (OAuth 2.0 login) fits a full-stack profile better.
- **Jira plugin:** `jira-blob-chunks` is its own bullet, separate from `designai-jira-plugin#4.3` (tailoring-spec 2, step 3).
- **SYSPRO `#4.11`** (Node.js mock backend) would show Node.js at the current job; consider pinning it as the nodejs profile does.
- **Clinical Ink:** the profile now drops `#4.4` (Android 14 migration), so the entry keeps `#4.1` and `#4.2`.
- **Itjet CI/CD:** the master CV moved the RegiStart CI/CD setup out of the Aspiration bullet (`itjet-fintech#4.3`) into its RegiStart MVP bullet. This profile's `itjet-fintech#4.14` override `text` is used exactly and has no CI/CD, so the CI/CD setup stays in the `#4.3` bullet as its own sentence after the Aspiration result. To match the master, add "Bitbucket Pipelines **CI/CD** to EC2/S3" to the `#4.14` override text (citing `#4.3` through `also`).
- **Summary:** the full-stack work is placed at "a software services company" (`itjet-fintech#1`) with the Stripe work for a fitness app, not "a fintech company" (decision `itjet-client-names`).
- **Master wording carried over (2026-10-24):** the first PoC bullet now says the PoC was built in HERE's R&D team and that the work was the client integration of its voice AI assistant (`navigation-poc#4.1`, `#1`, `#3`; team work, user); the passenger second screen is "for Bentley" (`navigation-poc#4.3`, decision `portfolio-poc-names-public`); the truck-app route-change bullet also cites `navigation-statistics#4.5`, which names the app. The truck-parking bullet (`navigation-poc#4.6`, where review 2026-10-24-1044 asked for "refined" and Daimler) is no longer selected after the cap below.
- **HERE PoC context:** `navigation-poc#4.11` isn't selected, so the first PoC bullet names the project from the summary's overview (`navigation-poc#1`, `#3`). `#4.10` (configuration-driven React / TypeScript control panel) would fit a full-stack CV better than `#4.2`; swap them with a pin if wanted.

- **Fit on 2 pages (user, reports/2026-10-24-1044 layout-1):** page 3 held 56 words. Profile changes in `profiles/fullstack-react-node.yaml`:
  - `entry_max_bullets: navigation-poc: 3` drops `#4.4` (route progress), `#4.6` (truck-parking demo UI) and `#4.7` (brand themes).
  - `entry_max_bullets: navigation-statistics: 2` drops `#4.3` (diagnostic display), `#4.4` (Jest tests) and `#4.5` (HNav and HNod SDKs).
  - Tried first: `navigation-poc: 4`, `navigation-statistics: 3` and a Jira cap; still 3 pages. The final caps alone fit, so the Jira cap is not in the profile.
  - Result: **2 pages** (both markets), about 1,777 of 1,920 words.
