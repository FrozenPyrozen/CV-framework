# Gap report: react

Built: 2026-10-16 · Profile: react · Job ad: no

## Strong evidence
- React and TypeScript (current and hands-on): SYSPRO React 19 schema-driven runtime, view orchestration and Login micro-frontend (`syspro-saas-erp#4.1`, `#4.5`, `#4.6`); Velas React / React Native Web wallets (`velas-wallet#4.1`, `#4.8`); Itjet TypeScript adoption and React Native Web signup flow (`itjet-fintech#4.3`, `#4.1`); Jira Forge app in React and TypeScript (`designai-jira-plugin#4.1`, `#4.2`).
- Architecture: platform and solution architecture work with the lead architect and ownership of the frontend technology stack (`syspro-saas-erp#4.3`, `syspro-architecture-scope`, `syspro-tech-stack-ownership`); General Motors modular app architecture (`general-motors-navigation#4.4`); Thermo Fisher app architected from scratch (`thermo-fisher-dosimeter#4.1`); Velas React Native Web wallet architecture (`velas-wallet#4.8`).
- Specification-driven development (SDD): pinned first SYSPRO bullet (`syspro-saas-erp#4.2`, `syspro-architecture-scope`), with AI agents described only as governed reviewers (decision `sdd-not-vibe-coding`).
- Micro-frontends and authentication: Login micro-frontend, OIDC in a zero-trust, independently deployable setup (`syspro-saas-erp#4.6`, `#4.7`, `#4.1`); React Native micro-frontend map library (`general-motors-navigation#4.3`).
- State management: XState and Zustand (`syspro-saas-erp#4.5`); MobX (`velas-wallet#4.1`); Redux (`thermo-fisher-dosimeter#4.1`).
- Leadership: team of 8 at General Motors, code reviews and standards (`general-motors-navigation#4.1`, `#4.2`, `calc:team_size_led`); OMO Systems team of about 3 engineers (`omo-systems-smart-home#4.5`); The Admasters team of 3 (`admasters-ecommerce#4.2`); senior technical interviews (`consulting-interviews`).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| Next.js / SSR | Itjet 2019-2020 (`itjet-fintech#4.7`) and The Admasters 2019 (`admasters-ecommerce#4.3`) only; nothing recent | If there is newer Next.js work (side or consulting projects), harvest it with /harvest or add a confirmed fact with /add-experience, only if true |
| Web performance (Core Web Vitals, bundle size) | Mostly mobile or backend results: Velas staking list 12x (`velas-wallet#4.2`), Android first interaction 3x (`velas-wallet#4.9`), Thermo Fisher Realm 20% (`thermo-fisher-dosimeter#4.6`) | Add a confirmed fact if a measured web performance result exists |
| Design systems | Itjet Atomic Design component library (`itjet-fintech#4.3`); SYSPRO shared theme and UI packages (`syspro-saas-erp#4.10`) not selected | If the shared SYSPRO UI packages were extended in a meaningful way, enrich `#4.10` with /harvest |
| Accessibility | WCAG 1.4.4 typography fixes in the Login micro-frontend (`syspro-saas-erp#4.6`) only | Add a confirmed fact if there was broader accessibility work (audits, keyboard navigation, screen readers), only if true |
| E2E testing | Playwright used as the Vitest browser provider (`syspro-saas-erp#4.9`, not selected); Puppeteer and Cucumber at Itjet (`itjet-fintech#4.3`); Detox only in the dropped General Motors stack line | Ask the user whether there are real Playwright E2E suites at SYSPRO; if so, enrich `#4.9` |
| Web React leadership | Team of 8 was on a React Native app; SYSPRO has no direct reports (`team_size_led: 0`) | Nothing to add unless true; prepare an interview answer (decision `keep-title-step`) |
| GraphQL and Docker | GraphQL only at Itjet (`itjet-fintech#4.7`); Docker at Itjet (`itjet-fintech#4.7`) and in the SYSPRO Stack line (`syspro-saas-erp#5`). User-provided context (2026-10-16): GraphQL was also used on the clinical-trials app and other projects (not yet a fact), and Docker on the Jira plugin too (its summary records Docker only as used by the project) | Record the details with /add-experience (or enrich the summaries with /harvest) when the user provides them; until then nothing new goes into the CV |
| Redux on the web | Redux at Thermo Fisher (React Native), Redux Saga only in the General Motors stack line (dropped) | Fine for keywords via Skills; no action |

## Selection disagreements
- SYSPRO: testing (`syspro-saas-erp#4.9`, tag `testing`) and the KendoReact rendering handlers (`#4.4`, the largest body of work) are still cut by the 7-bullet limit; Vitest Browser Mode still appears in the `#4.3` bullet, and Vitest and Playwright in the Stack line and Skills.
- General Motors: the HERE SDK library (`general-motors-navigation#4.3`) is kept although `here-sdk` is de-emphasized, because its `micro-frontends` tag scores. Acceptable, since it is described as a React Native micro-frontend.
- Non-current entries lose their Stack lines (General Motors had Storybook, Detox (E2E), Redux Saga). Keywords still appear in Skills.
