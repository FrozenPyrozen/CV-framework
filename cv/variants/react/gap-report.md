# Gap report: react

Built: 2026-10-24 · Profile: react · Job ad: no

## Strong evidence
- **React and TypeScript (current, hands-on):** SYSPRO React 19 schema-driven runtime that renders 1,800+ ERP programs (`syspro-saas-erp#4.1`, `syspro-team-size`, `syspro-speed`), screen management with XState and Zustand (`#4.5`), Login micro-frontend (`#4.6`); Jira Forge app and its design generation form (`designai-jira-plugin#4.1`, `#4.2`); Velas React / React Native Web wallets and fewer React re-renders (`velas-wallet#4.1`, `#4.8`, `#4.10`); Aspiration React banking web flow and React Native Web signup (`itjet-fintech#4.13`, `#4.1`).
- **HERE Technologies navigation work (new consulting entries, first in the section):** voice assistant client integration in React and RxJS, passenger second screen, brand themes, a configuration-driven React / TypeScript demo control panel with schema validation, driver warnings and route progress (`navigation-poc#4.1`, `#4.3`, `#4.7`, `#4.10`, `#4.2`, `#4.4`); route-change reasons in TypeScript and RxJS, Protocol Buffers contracts kept backward compatible, React diagnostic display and Jest regression tests on a truck navigation app, and car navigation features with HERE's HNav and HNod SDKs (`navigation-statistics#4.1` to `#4.5`).
- **Architecture:** platform and solution architecture with the lead architect and ownership of the frontend stack (`syspro-saas-erp#4.3`, `syspro-architecture-scope`, `syspro-tech-stack-ownership`); General Motors modular architecture and the move of a feature app into the host app (clean architecture, domain-driven design) (`general-motors-navigation#4.4`, `#4.10`); Thermo Fisher app architected from scratch (`thermo-fisher-dosimeter#4.1`).
- **Specification-driven development (SDD):** second SYSPRO bullet after the runtime (decision `syspro-runtime-bullet-first`), with AI agents implementing and reviewing code against the specifications under human review (decisions `sdd-not-vibe-coding`, `ai-agents-wording`).
- **Micro-frontends and authentication:** Login micro-frontend and OIDC in a secure, independently released setup (`syspro-saas-erp#4.6`, `#4.7`, `#4.1`).
- **Observability:** OpenTelemetry browser telemetry that removes PII before sending events (`syspro-saas-erp#4.8`).
- **Testing:** 95% unit-test coverage strategy (`general-motors-navigation#4.5`), delivery and testing process for nested apps (`#4.9`), Detox E2E and Jest at Velas (`velas-wallet#4.11`), TDD at Thermo Fisher (`thermo-fisher-dosimeter#4.7`), Puppeteer / Jest / Cucumber and an E2E test utility at Itjet (`itjet-fintech#4.3`, `#4.12`); CI/CD spelled out in the Wink bullet (`itjet-fintech#4.8`), Jest and React Native Testing Library (`orion-mobile-clinical-ink#4.2`).
- **Design systems:** Atomic Design component library and a Plop scaffolding generator (`itjet-fintech#4.3`, `#4.13`).
- **Leadership:** team of 8 at General Motors with code reviews and standards (`general-motors-navigation#4.1`, `#4.2`, `calc:team_size_led`); OMO Systems team of about 3 (`omo-systems-smart-home#4.5`); The Admasters team of 3 (`admasters-ecommerce#4.2`); senior technical interviews (`consulting-interviews`).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| Next.js / SSR | Only The Admasters 2019 (`admasters-ecommerce#4.3`) in this variant; the Itjet Next.js and GraphQL bullet (`itjet-fintech#4.7`) is no longer selected (see disagreements); Next.js stays in Skills | If there is newer Next.js work, add it with /add-experience, only if true; or pin `itjet-fintech#4.7` in the profile |
| Web performance (Core Web Vitals, bundle size) | Fewer React re-renders and lighter API responses at Velas (`velas-wallet#4.10`, no number); staking page loading from 2 minutes to 5 seconds (`velas-wallet#4.2`); Thermo Fisher 20% (`thermo-fisher-dosimeter#4.6`, mobile) | Add a confirmed fact if a measured web performance result exists |
| Accessibility | WCAG typography fixes in the Login micro-frontend (`syspro-saas-erp#4.6`) only | Add a confirmed fact if there was broader accessibility work (audits, keyboard navigation, screen readers), only if true |
| E2E testing on the web | Playwright is only the browser provider under Vitest Browser Mode at SYSPRO (decision `playwright-browser-mode-only`); Puppeteer, Cucumber and an E2E test utility at Itjet (`itjet-fintech#4.3`, `#4.12`); Detox on mobile (`velas-wallet#4.11`) | Nothing to add unless there are real web E2E suites |
| Web React leadership | The team of 8 worked on a React Native app; SYSPRO has no direct reports (`team_size_led: 0`) | Nothing to add unless true; prepare an interview answer (decision `keep-title-step`) |
| GraphQL | Hands-on at Itjet (`itjet-fintech#4.7`, not selected here) and on the clinical-trials app (Apollo Client 3 and GraphQL, hands-on, confirmed by user 2026-10-22, `orion-mobile-clinical-ink#5`); this variant shows it only in Skills | Kept out of bullets for now (decision `skills-only-in-skills-list` covers Apollo Client); pin `itjet-fintech#4.7` if GraphQL matters for a role |
| Redux on the web | Redux at Thermo Fisher (React Native); Redux Toolkit, Saga and Persist hands-on on the clinical-trials app (`orion-mobile-clinical-ink#5`, confirmed 2026-10-22) | Covered by Skills; no action |

## Selection disagreements
- **Itjet:** the new contributions (`itjet-fintech#4.13` banking web flow, `#4.10` Oroscopo, `#4.12` onboarding docs and E2E utility) push out `#4.7` (Next.js with SSR and GraphQL), `#4.6` (Stripe subscription flow) and `#4.4` (PostgreSQL to AWS RDS, 2x). For React roles `#4.7` is worth more than `#4.10` (Oroscopo React Native features); consider pinning `itjet-fintech#4.7`.
- **General Motors:** `#4.10` and `#4.9` (both from the April 2025 portfolio) replace `#4.3` (HERE SDK map library as a React Native micro-frontend). Acceptable, since `here-sdk` is de-emphasized.
- **Jira plugin:** `jira-blob-chunks` is selected as its own bullet, so it is written separately from `designai-jira-plugin#4.3` (tailoring-spec 2, step 3); the two bullets are short and close in meaning. A `drop` override for the fact in this profile would save about 15 words.
- **SYSPRO:** the OIDC bullet still cites `syspro-saas-erp#4.1` for "apps never import from each other"; that part appears only there, so no claim is repeated. Testing (`#4.9`) and the KendoReact rendering handlers (`#4.4`) are still cut by the 7-bullet limit.
- **Itjet CI/CD:** the RegiStart CI/CD setup moved out of the Aspiration bullet (`itjet-fintech#4.3`) into the RegiStart MVP bullet in the master CV; that bullet (`#4.14`, `#4.5`) isn't selected here, so this variant shows CI/CD only in the Wink bullet and Skills.
- **HERE truck navigation app:** `navigation-statistics#4.5` (HNav and HNod SDKs) is now selected although `here-sdk` is de-emphasized: the entry has five contributions under a six-bullet limit. A `drop` override would save 20 words.
- **HERE and Clinical Ink (2026-10-24):** Clinical Ink is now named (`cv_client_label`, decision `hidden-clients`); the bullets kept their wording. The HERE entries name the HNav and HNod SDKs instead of "HERE SDK" (decision `here-sdk-names-in-skills`); the General Motors map library keeps "HERE SDK".
- **HERE PoC context:** `navigation-poc#4.11` (the car navigation PoC itself) isn't selected here, so the first PoC bullet names the project from the summary's overview and cites `navigation-poc#1` with `#4.1`.
- **Length (needs a decision):** the two new HERE entries add 10 bullets. After shortening the wording (the in-scope entries, the summary, the new bullets) the variant was at 1,884 words when the limit was 1,800; the profile now allows 1,920 (user 2026-10-23), and with `navigation-statistics#4.5` and the Clinical Ink label the variant is at **1,898 of 1,920 words**, so the proposal below is no longer needed. Unchanged entries were copied as they are. Proposed profile change, not applied (the user decides), saving about 91 words to about 1,793:
  ```yaml
  entry_max_bullets:
    navigation-poc: 4            # keeps #4.1, #4.3, #4.7, #4.10; drops #4.2 (driver warnings) and #4.4 (route progress), ~28 words
    navigation-statistics: 2     # keeps #4.1, #4.2; drops #4.3 (diagnostic display) and #4.4 (Jest tests), ~28 words
    designai-jira-plugin: 3      # keeps #4.2, #4.1, #4.4; drops #4.3 and jira-blob-chunks (Azure Blob uploads), ~35 words
  ```
  Alternative for the Jira plugin: keep `designai-jira-plugin#4.3` and add `also: [jira-blob-chunks]` with one merged `text`, as in the master CV.
