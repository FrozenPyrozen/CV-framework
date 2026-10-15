# Full Work Summary — Application Studio Platform (ASP) Frontend

_Derived from git history across 4 repositories, Jan 2026 – Sep 2026 (ongoing). 270+ non-merge commits in `saas-frontend-repo`, plus activity in `saas-arch-repo` and `saas-application-mapping-repo`._

---

## 0. What this project is

**Application Studio Platform (ASP)** is SYSPRO's web-based modernization layer for its ERP product: rather than hand-building a web page per ERP screen, the platform stores each ERP program's form, grid, and toolbar as a declarative **Federated Data Model (FDM)** definition, and a single frontend runtime renders whatever definition it is given at the moment a user opens that program. This repository (`saas-frontend-repo`) is the frontend monorepo implementing that runtime, plus the supporting identity and administration applications around it.

**What it does:**

- Serves as the web client an ERP operator uses to open and work with SYSPRO business programs (e.g., Bill of Materials maintenance, Accounts Payable, Inventory, Purchase Orders) — in real local testing, a single mock backend instance exposed **1,891 distinct ERP menu items** this way, each resolvable to a live, rendered screen without any program-specific frontend code.
- Authenticates operators through a shared identity flow (OIDC) before any ERP data is reachable.
- Separates concerns across three independently deployable applications (per the repository's **Zero-Trust / no-cross-app-import** architecture): a **host runtime** that renders ERP screens, a **identity app** that only ever sees credentials, and an **administration app** for operator/role management — each able to be split into its own repository without touching the others.

**Main features:**

1. **Dynamic, schema-driven screen rendering** (`apps/studio-shell`) — given an FDM view definition for any ERP program, the runtime renders it live using KendoReact: forms, search grids with filtering/sorting/column rendering, date fields, smart-tag lookup fields, and predictive search — with no per-program code written on the frontend.
2. **Shell View Coordinator / Bridge / Manager** — the orchestration layer that creates and tracks a view's session lifecycle, mediates communication with backend services, and manages which view is active.
3. **Correlated Menu** — contextual navigation surfaced directly from a record's smart-tag fields, letting an operator jump to a related ERP program for the item they're looking at (e.g., from a Bill of Materials line to the related stock code program).
4. **Overlay Chrome** — modal/dialog-style UI chrome for nested views, with lifecycle management including a "soft teardown" that closes an overlay without discarding the underlying view's state.
5. **Navigation Manager** — the main application menu, built from the full ERP program menu tree.
6. **OIDC/IDAM authentication** (`apps/login`, shared by `apps/studio-shell` and `apps/admin-portal`) — a dedicated, minimal identity application that is the only part of the system ever exposed to a user's password, hosted separately on the identity domain, with the other apps acting purely as OIDC clients.
7. **Admin Portal** (`apps/admin-portal`) — a separate application for SYSPRO operator and role administration, reaching backend data only through APIs, never a direct database connection.
8. **Browser telemetry module** — an OpenTelemetry-based observability layer built into the host runtime, with event taxonomy, payload contracts, and a redaction stage that scrubs sensitive data before any trace or log leaves the browser.
9. **A full local mock-backend stack** for frontend development without a live ERP or identity provider — a mock shell-view/service backend, a mock mediation/business-object backend, and a mock-auth mode, all independently toggleable via runtime configuration.
10. **Specification-Driven Development (SDD) process** underpinning all of the above — every subsystem above is backed by a realization specification that states its required behavior and the architecture constraints it inherits, validated and implemented with the assistance of a configured AI coding agent before being considered done (see Section 4).

---

## 1. Detailed description of work

### 1.1 Login micro-frontend (`apps/login`) — built from scratch

- Initialized the `@asp/login` workspace (Vite + React 19 + TypeScript) and its full page/component/hook structure.
- Built `LoginPage`, `ForgotPasswordPage`, `CheckEmailPage`, `ResetPasswordPage`, with routing (`@tanstack/react-router`) and `routePaths`.
- Built reusable UI primitives: `AuthLayout`, `TextInput`, `PasswordInput`, `DropdownInput`, `Divider`, `ErrorBanner`, `Logo`, social-login buttons, icon set.
- Implemented `useLogin` and `usePasswordReset` hooks, an `authService`, and form validation schemas (`loginSchema`, `passwordSchema`, `signupSchema`) — validation layer under `@validation`.
- Migrated plain `.scss` files to `.module.scss` (CSS Modules) across the app for component-scoped styling; removed `!important` usage; fixed heading line-height and typography to follow WCAG 1.4.4 (`rem`/Kendo font tokens instead of `px`).
- Replaced a manual error banner with the KendoReact notification component.
- Configured path aliases (`@/*`, `@hooks`, `@services`, `@utils`, `@validation`, `@ui`, `@pages`).
- Set up Storybook stories for the component library and wrote unit tests (Vitest) plus browser tests (Vitest Browser Mode + Playwright provider).
- Iterated the flow based on PR review feedback across several review cycles.

### 1.2 Studio Shell host application (`apps/studio-shell`) — primary focus

**Authentication**

- Set up OIDC/IDAM authentication for the host shell using `oidc-client-ts` and `react-oidc-context`, including session/config wiring under `src/auth`.

**Shell View Runtime** (`src/shell-view-runtime/`) — the dynamic, FDM-driven view rendering pipeline

- **Shell View Coordinator**: authored the realization specification and implemented the component end to end — the piece that orchestrates view lifecycle/state across the runtime. Iterated through several specification revisions aligned to upstream solution-architecture changes, open-question resolution (`OQ-5`), and validation passes.
- **Shell View Bridge**: implemented against its realization specification (inter-service/host communication layer).
- **Shell View Manager**: implemented against its realization specification.
- **Shell View Renderer**: the largest body of work, covering the KendoReact rendering handlers that turn FDM view definitions into live UI:
  - `kendo-react-form` and `kendo-react-date-field` handlers — fixed a default-date rendering defect (was rendering `1/1/2000` instead of the correct value).
  - `kendo-react-search-grid`, `kendo-react-search-grid-filter`, and `kendo-react-search-grid-results` handlers — implemented render-readiness gating, filter-panel visibility behavior, per-descriptor filter-state persistence via renderer-state writes, and typed filter controls rendered from category metadata; fixed row-click search-value computation and column rendering.
  - `smart-tag-field` handler — implemented and integrated with backend-driven correlated-menu data (see below), including BE integration for ERP smart-tag fixtures (`bomprt`).
  - `predictive-search` handler — implemented against its realization specification.
- **Correlated Menu** (present both under `shell-view-runtime/correlated-menu` and `studio-shell-runtime/correlated-menu-manager`): implemented the menu correlation behavior tying smart-tag fields to contextual navigation options, with its own realization specification.

**Studio Shell Runtime** (`src/studio-shell-runtime/`)

- Implemented runtime-level orchestration (its own realization spec) alongside the correlated-menu-manager above.

**Overlay Chrome** (`src/overlay-chrome/`)

- Implemented handler-instantiated overlay chrome lifecycle management: portal-based rendering and "soft teardown" behavior (tearing down an overlay without destroying underlying state), governed by its realization specification.

**Global Store** (`src/global-store/`)

- Implemented global state-store behavior and a `trace-context` subsystem (each with its own realization specification) used to correlate state/telemetry across the runtime.
- Worked with the `service-invocation`/`provisional-contracts` mocked-integration layer (session-invalidity and ended-session predicates) while keeping the documented mock behavior intact.

**Runtime Config** (`src/config/`)

- Implemented configuration loading/validation against its realization specification.

**Navigation Manager** (`src/navigation-manager/`)

- Authored the realization specification and implemented the navigation-management behavior for the shell.

**Telemetry module** (`src/telemetry/`) — built from scratch

- Designed and implemented a full browser telemetry module: `TelemetryManager`, `TelemetryEventBus`, event taxonomy, payload contracts, shell-view scoping, a self-diagnostic mode, and a dev handle for local inspection.
- Implemented an **OpenTelemetry (OTel)** sink (`telemetry/otel/`) and a redaction layer (`telemetry/redaction/`) for scrubbing sensitive data before export, each with its own realization specification; added an `ambient` telemetry concern area.
- Wrote and iterated the `telemetry-realization-spec.md` across several rounds of architecture-blocker resolution (including an ERP `_producer` field issue tracked as `TM-16`) and technical-debt follow-up.
- Documented how to run telemetry locally with a browser (`README`-level how-to), and stood up a local OTLP receiver script (`scripts/otlp-receiver.mjs`) for inspecting exported spans/traces during development.

**Cross-cutting**

- Authored/maintained ~17 realization specifications in total across the above subsystems, each validated against governing solution/platform architecture documents using the repository's `validate-realization-spec` routine.
- Opened and maintained numerous `TECHNICAL-DEBT.md` register entries (`technical-debt/SFR-TD-*`) for deferred issues surfaced during implementation and review.
- Authored structured session changelogs (`changelogs/feature-*/CHANGELOG-session*.md`) documenting multi-session feature work (e.g., the telemetry module build-out across 5 sessions).
- Worked on the repository's own steward/audit tooling (`meta/saas-frontend-agent/`), including shell scripts that check schema-mirror freshness (`check-schema-mirrors.sh`, `checks/schema.sh`) and the steward's own audit realization specification.
- Set up and maintained CI pipeline realization material under `.azure-pipelines/realization/`.

### 1.3 Admin Portal (`apps/admin-portal`)

- Touched as part of shared package integration (minor, package-level changes shared via `@asp/theme`).

### 1.4 Shared packages

- `@asp/theme`, `@asp/ui`: consumed and extended as the shared component/styling layer behind Login, Studio Shell, and Admin Portal.
- Dependency and config maintenance across the monorepo: `package.json` upgrades, ESLint import-ordering rule setup, Prettier formatting rules, `tsconfig` project-reference wiring (`tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`), Vite/Vitest config files (unit and browser test configs) for `studio-shell`.

### 1.5 Backend-mock and application-mapping work (`saas-application-mapping-repo`)

- Maintained and used the `studio-shell-mock-server` (its usage docs and `.env` example) to develop the frontend without the real backend.
- Edited ERP application-mapping output (`shell-view-configuration/*.yaml` — form and toolbar definitions for specific ERP programs) to support frontend feature testing.
- Added mock-server support for ERP smart-tag handling (`bomprt` fixtures), touching `backend-mock/fixtures/menu-detail-canonical.yaml`, `backend-mock/fixtures/service-registry.json`, and `backend-mock/src/routes/shell-view-management.ts`.
- Corrected a mock-server field mismatch (`searchKey` vs `keyFieldCode`) and an ERP location-input-field mapping issue.

### 1.6 Platform architecture repo (`saas-arch-repo`)

- Contributed to the frontend technology-stack decision record (`reference/tech-stack/fe-tech-stack/`): added `oidc-client-ts` and `react-oidc-context` as the identity-management libraries, and recommended replacing React Testing Library with Vitest Browser Mode for component testing.

### 1.7 Recurring process work (all repos)

- Ran the repository's `validate-realization-spec` routine repeatedly across the project to check specs for structural compliance, SDD authoring-constraint compliance, and architecture alignment before/after implementation.
- Resolved PR review findings as a standing, recurring task across nearly every feature branch.
- Maintained the `TECHNICAL-DEBT.md` and backlog registers as issues were discovered during implementation and review.

---

## 2. Full technology stack / libraries / frameworks touched

### Core framework and language

| Technology     | Version             | Where used                                |
| -------------- | ------------------- | ----------------------------------------- |
| React          | 19.x                | All apps                                  |
| TypeScript     | 5.9.x (strict mode) | All apps/packages                         |
| Vite           | 7.x                 | Build tool/dev server, all apps           |
| npm workspaces | —                   | Monorepo structure (`saas-frontend-repo`) |

### Routing, state, data

| Technology                              | Where used                                                      |
| --------------------------------------- | --------------------------------------------------------------- |
| `@tanstack/react-router` (+ devtools)   | Login, Studio Shell, Admin Portal routing                       |
| `@tanstack/react-query`                 | Studio Shell server-state management                            |
| `zustand`                               | Studio Shell global store                                       |
| `xstate` (v5)                           | Studio Shell state-machine logic (shell view lifecycle)         |
| `eventemitter3`                         | Studio Shell internal event bus (telemetry, shell-view runtime) |
| `axios` (+ `axios-mock-adapter` in dev) | HTTP client and test mocking                                    |
| `@jmespath-community/jmespath`          | FDM/view-definition data querying                               |

### Authentication / identity

| Technology           | Where used                                          |
| -------------------- | --------------------------------------------------- |
| `oidc-client-ts`     | OIDC protocol client, Studio Shell & Admin Portal   |
| `react-oidc-context` | React OIDC integration, Studio Shell & Admin Portal |

### UI component library

| Technology                                                                                                                                                                                                                                          | Where used                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| KendoReact 14.4.x (`@progress/kendo-react-*`: buttons, common, dateinputs, dialogs, dropdowns, form, grid, labels, notification, layout, popup, animation, charts, conversational-ui, data-tools, indicators, intl, progressbars, treeview, upload) | Login, Studio Shell, Admin Portal                                     |
| `@progress/kendo-theme-default`                                                                                                                                                                                                                     | Theming, via `@asp/theme`                                             |
| `@progress/kendo-svg-icons`                                                                                                                                                                                                                         | Iconography                                                           |
| `@progress/kendo-data-query`, `kendo-date-math`, `kendo-intl`, `kendo-drawing`, `kendo-popup-common`, `kendo-inputs-common`, `kendo-dateinputs-common`                                                                                              | Supporting Kendo data/formatting utilities in the Shell View Renderer |
| `@progress/kendo-licensing`                                                                                                                                                                                                                         | License activation tooling                                            |

### Styling

| Technology                                        | Where used                         |
| ------------------------------------------------- | ---------------------------------- |
| Sass/SCSS with CSS Modules (`.module.scss`)       | All apps, component-scoped styling |
| `@fontsource/inter`, `@fontsource/material-icons` | Typography/iconography             |
| `clsx`                                            | Conditional class composition      |

### Telemetry / observability

| Technology                                               | Where used                                                     |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| OpenTelemetry concepts (custom OTel sink implementation) | Studio Shell telemetry module                                  |
| `@microsoft/signalr`                                     | Real-time transport (Studio Shell runtime)                     |
| `@noble/hashes`                                          | Hashing utility (telemetry/redaction or trace-context support) |
| Custom OTLP receiver script (Node)                       | Local telemetry development                                    |

### Testing

| Technology                                                      | Where used                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------ |
| Vitest 4.x                                                      | Unit tests, all apps                                               |
| Vitest Browser Mode (`@vitest/browser`, `vitest-browser-react`) | Browser-level component tests                                      |
| Playwright 1.58.x                                               | Browser test provider                                              |
| `@vitest/coverage-v8`                                           | Coverage reporting (Login)                                         |
| `jsdom`                                                         | DOM environment for unit tests (Studio Shell, Admin Portal)        |
| Jest, `ts-jest`                                                 | Unit/integration tests for the `fdm-to-typescript` codegen package |

### Component development / documentation

| Technology                                                                                                                      | Where used              |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Storybook 10.x (`@storybook/react-vite`, `addon-a11y`, `addon-docs`, `addon-vitest`, `addon-onboarding`, Chromatic integration) | Login component library |

### Code quality / tooling

| Technology                                                                                                                                                    | Where used                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| ESLint 9.x (flat config), `typescript-eslint`, `eslint-config-sheriff`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-storybook` | All workspaces                           |
| Prettier 3.x, `@ianvs/prettier-plugin-sort-imports`                                                                                                           | Formatting and import ordering           |
| Husky 9.x                                                                                                                                                     | Git pre-commit hook enforcement          |
| `npm-run-all`                                                                                                                                                 | Script orchestration across the monorepo |

### Code generation / schemas

| Technology                                                                             | Where used                                                                               |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `@asp/fdm-codegen` (internal pipeline, `@hey-api/openapi-ts`, `zod`, `yaml`, `semver`) | FDM schema-to-TypeScript generation feeding `apps/studio-shell/src/types/fdm-generated/` |
| YAML (ERP application-mapping output, shell-view configuration)                        | `saas-application-mapping-repo`                                                          |

### Backend-mock / supporting services touched

| Technology                                                             | Where used                                   |
| ---------------------------------------------------------------------- | -------------------------------------------- |
| Node.js mock server (`studio-shell-mock-server`, Express-style routes) | `saas-application-mapping-repo/backend-mock` |

---

## 3. Skills demonstrated

**Frontend engineering**

- React 19 component architecture (functional components, hooks, `memo`/`displayName` discipline, named prop interfaces with JSDoc)
- TypeScript in strict mode across a large codebase with project references (composite builds)
- Micro-frontend / host-shell architecture: building an independent identity app (Login) and a dynamic, schema-driven host runtime (Studio Shell) that renders UI from a Federated Data Model
- State management with Zustand and state machines with XState
- Form handling and schema-based validation
- CSS Modules/Sass component-scoped styling, accessibility-aware typography (WCAG 1.4.4)
- OpenID Connect authentication integration end to end (client setup, session handling, route protection)

**Dynamic/schema-driven rendering**

- Building renderer "handlers" that map a declarative, backend-authored view definition (FDM) onto live KendoReact components (forms, grids, filters, date fields, smart tags, predictive search)
- Implementing stateful UI behaviors driven by descriptor/category metadata rather than hardcoded markup

**Observability**

- Designing a telemetry module from requirements through implementation: event taxonomy design, payload-contract definition, OTel-compatible exporting, PII/sensitive-data redaction, and local developer tooling (OTLP receiver) for verifying traces

**Testing**

- Unit testing with Vitest, browser-level component testing with Vitest Browser Mode and Playwright, coverage reporting
- Writing and maintaining realization-spec-driven test scenarios used as acceptance criteria

**Tooling and DevEx**

- Monorepo management with npm workspaces across apps and shared packages
- Build/config maintenance: Vite, TypeScript project references, ESLint flat config, Prettier, Husky hooks
- CI pipeline specification work (`.azure-pipelines/realization/`)
- Code-generation pipeline consumption (FDM-to-TypeScript codegen) and schema-mirror freshness auditing

**Specification-Driven Development (SDD) and AI-assisted engineering**

- Authoring and validating realization specifications against platform and solution architecture documents (multi-repo traceability: platform architecture, solution architecture, application-mapping, frontend implementation)
- Running structured specification-validation routines (structural compliance, architecture alignment, internal consistency) before and after implementation
- Working with a configured AI coding agent in a "steward" role to keep code traceable to its architectural source of truth, catch constraint violations early, and reduce spec-to-code drift
- Technical-debt and backlog register discipline: identifying, classifying, and tracking deferred issues as first-class, reviewable artifacts rather than ad hoc TODOs

**Cross-functional / backend-adjacent**

- Maintaining a Node.js mock backend and its fixture data (YAML/JSON) to unblock frontend development ahead of real backend availability
- Editing ERP application-mapping configuration (form/toolbar YAML definitions) to align mock data with frontend feature needs
- Contributing to platform-level technology-stack decisions (authentication library selection, test-tooling direction) in the architecture repository

---

## 4. Specification-Driven Development (SDD) — how it was used here

Work was organized around machine-readable "realization specifications" — one per component or subsystem (e.g., Shell View Coordinator, Telemetry module, Overlay Chrome) — that stated what the component must do and which constraints it inherited from the platform and solution architecture before any code was written. An AI coding agent, configured with the repository's own conventions and acting as a steward, was used throughout to: validate each specification's structure and its alignment with upstream architecture documents, implement and review code against the specification, and surface constraint violations, technical debt, and open questions for human decision rather than resolving them silently. This created a traceable chain from platform architecture → solution architecture → component specification → implementation across four separate repositories, and made specification-validation and PR-review remediation a routine, recurring part of the engineering cycle rather than a one-off audit.
