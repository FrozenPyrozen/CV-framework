---
schema_version: 1
id: syspro-saas-erp
source: git
# --- the job ---
client: SYSPRO
role: Senior Software Engineer
engagement: full-time
period: { start: 2025-12, end: present }
domain: [ERP, SaaS]
team_size_led: 0
counts_as_experience: true
# --- harvesting ---
repos:
  - { name: saas-frontend-repo, remote: git@ssh.dev.azure.com:v3/SYSPRO-Product/Engineering/saas-frontend-repo }
  - { name: saas-arch-repo, remote: git@ssh.dev.azure.com:v3/SYSPRO-Product/Engineering/saas-arch-repo }
  - { name: saas-application-mapping-repo, remote: git@ssh.dev.azure.com:v3/SYSPRO-Product/Engineering/saas-application-mapping-repo }
  - { name: saas-frontend-architecture-repo, remote: git@ssh.dev.azure.com:v3/SYSPRO-Product/Engineering/saas-frontend-architecture-repo }   # solution architecture specs for the host shell
author_identities: []
harvested_at: "2026-10-15"
# --- how it appears in the CV ---
show_in_cv: true
cv_section: experience
cv_order: 1
cv_client_label: SYSPRO
cv_location: Remote
cv_emphasis:
  - Architecture-governed specification-driven development (SDD), not ad-hoc AI code generation
  - Helped define the SDD process and worked with the lead architect on platform and solution architecture
  - Owned the frontend technology stack (tech-stack decision record)
cv_max_bullets: 8
---

## 1. Project overview

SYSPRO is modernizing its ERP product for the web. Instead of hand-building a web page for each ERP screen, the platform (internally called Application Studio Platform, ASP) stores each ERP program's form, grid and toolbar as a declarative definition in a Federated Data Model (FDM). A single frontend runtime renders whatever definition it receives at the moment a user opens that program.

The main repository is a frontend monorepo that implements this runtime plus the identity and administration applications around it. Work also touched the platform architecture repository and the ERP application-mapping repository (which holds the mock backend and per-program view configuration).

Users are ERP operators who open and work with SYSPRO business programs (for example Bill of Materials maintenance, Accounts Payable, Inventory and Purchase Orders) in the browser, and administrators who manage operators and roles.

The frontend is split into three independently deployable applications under a zero-trust, no-cross-app-import architecture, so each can be moved into its own repository without touching the others:

- a host runtime that renders ERP screens,
- an identity app, the only part of the system that ever sees credentials,
- an administration app for operator and role management.

Evidence comes from git history across 4 repositories from January 2026 to September 2026 (ongoing): 270+ non-merge commits in the frontend monorepo, plus activity in the architecture and application-mapping repositories.

Team and organization context: TODO (needs user input) in this summary; program size is recorded as fact `syspro-team-size`.

## 2. Main features

1. **Schema-driven screen rendering.** Given a view definition for any ERP program, the runtime renders it live with KendoReact: forms, search grids with filtering, sorting and column rendering, date fields, smart-tag lookup fields and predictive search, with no program-specific frontend code. In local testing, one mock backend instance exposed 1,891 distinct ERP menu items, each resolvable to a live, rendered screen.
2. **View orchestration.** A coordinator, bridge and manager create and track each view's session lifecycle, mediate communication with backend services, and manage which view is active.
3. **Related-program navigation (correlated menu).** Contextual navigation from a record's smart-tag fields lets an operator jump to a related ERP program for the item in front of them (for example, from a Bill of Materials line to the related stock code program).
4. **Overlays for nested views.** Modal, dialog-style chrome for nested views, with a "soft teardown" that closes an overlay without discarding the underlying view's state.
5. **Main navigation menu.** Built from the full ERP program menu tree.
6. **Single sign-on through OpenID Connect.** A dedicated, minimal identity application, hosted separately on the identity domain, is the only part of the system exposed to a user's password; the host and admin apps act purely as OIDC clients.
7. **Administration portal.** A separate app for operator and role administration that reaches backend data only through APIs, never through a direct database connection.
8. **Browser telemetry.** An OpenTelemetry-based observability layer in the host runtime with an event taxonomy, payload contracts and a redaction stage that scrubs sensitive data before any trace or log leaves the browser.
9. **Local mock-backend stack.** Frontend development without a live ERP or identity provider: a mock view/service backend, a mock mediation/business-object backend and a mock-auth mode, each toggled independently through runtime configuration.
10. **Specification-driven development.** Every subsystem is backed by a specification that states its required behavior and the architecture constraints it inherits, validated and implemented with a configured AI coding agent before it counts as done.

## 3. My role and responsibilities

- **Title:** Senior Software Engineer.
- **Main focus:** the host runtime (schema-driven rendering, view orchestration, navigation, overlays, global store, runtime configuration, telemetry), plus the Login micro-frontend built from scratch.
- **Specifications and process:** authored and maintained about 17 component specifications, validated each against the governing platform and solution architecture before and after implementation, and worked with a configured AI coding agent acting as a "steward" to keep code traceable to its architectural source of truth.
- **Architecture and tech stack:** contributed to the frontend technology-stack decision record in the platform architecture repository (identity libraries, component-testing direction). Broader architecture responsibilities with the lead architect are recorded as fact `syspro-architecture-scope`.
- **Quality and process:** resolved PR review findings on nearly every feature branch, kept the technical-debt and backlog registers, and wrote structured session changelogs for multi-session features.
- **Cross-functional:** maintained the Node.js mock backend and edited ERP application-mapping configuration so frontend features could be built and tested ahead of the real backend.
- **Leadership:** no direct reports (team_size_led: 0).
- **Key collaborators:** TODO (needs user input).

## 4. My contributions

### 4.1 Schema-driven runtime for ERP screens

Built core modules of the React 19 and TypeScript host runtime that turns declarative, backend-authored view definitions into live ERP screens. Instead of one hand-built page per ERP program, the runtime reads a program's form, grid and toolbar definition when the user opens it and renders it through a pipeline of rendering handlers, view orchestration, navigation and overlays (detailed in 4.4 and 4.5). The runtime sits inside a three-app, zero-trust micro-frontend setup (host, identity, admin) where apps never import from each other.

Result: in local testing, one mock backend instance exposed 1,891 distinct ERP menu items, each resolvable to a rendered screen without program-specific frontend code.
Tags: react, typescript, schema-driven-ui, erp, micro-frontends, architecture

### 4.2 Specification-driven development process and component specifications

Delivered the frontend through specification-driven development. Each component or subsystem had a machine-readable specification stating what it must do and which constraints it inherits from the platform and solution architecture, written before any code. Authored and maintained about 17 such specifications (view coordinator, bridge and manager, rendering handlers, related-program navigation, runtime orchestration, overlays, global store, trace context, runtime configuration, navigation, telemetry with its exporter and redaction parts). Revised specifications several times as the upstream solution architecture changed, as open questions were resolved, and after validation passes.

Ran the repository's specification-validation routine before and after implementation to check structure, compliance with the SDD authoring constraints, internal consistency and architecture alignment. A configured AI coding agent, set up with the repository's conventions and acting as a steward, validated specifications, implemented and reviewed code against them, and surfaced constraint violations, technical debt and open questions for human decision instead of resolving them silently. Also worked on the steward's own audit specification.

Result: a traceable chain from platform architecture to solution architecture, component specification and implementation across 4 repositories; specification validation became a routine part of the engineering cycle rather than a one-off audit.
Tags: sdd, architecture, ai-agents, code-review, typescript

### 4.3 Frontend technology-stack decision record

Contributed to the frontend technology-stack decision record in the platform architecture repository. Added oidc-client-ts and react-oidc-context as the identity-management libraries, and recommended replacing React Testing Library with Vitest Browser Mode for component testing.

Tags: tech-stack, architecture, oidc, testing

### 4.4 KendoReact rendering handlers

Built the rendering handlers that map view definitions onto live KendoReact components, the largest body of work in the runtime:

- Form and date-field handlers; fixed a defect where date fields showed a fixed placeholder date (1/1/2000) instead of the correct default value.
- Search grid, search-grid filter and search-grid results handlers: render-readiness gating, filter-panel visibility, per-descriptor filter state persisted through renderer-state writes, and typed filter controls generated from category metadata; fixed the row-click search-value computation and column rendering.
- Smart-tag field handler, integrated with backend-driven related-program navigation data, including backend integration for ERP smart-tag fixtures.
- Predictive search handler, implemented against its specification.

All behavior is driven by descriptor and category metadata rather than hardcoded markup.

Tags: kendo, schema-driven-ui, react, typescript, erp

### 4.5 View orchestration, navigation, overlays and global store

Implemented the orchestration layer around the rendering handlers, each part against its own specification:

- **View coordinator:** authored the specification and implemented it end to end; it orchestrates view lifecycle and state across the runtime.
- **View bridge** (communication between the host and backend services) and **view manager** (which view is active).
- **Related-program navigation (correlated menu):** ties smart-tag fields to contextual navigation options, in both the view runtime and the runtime-level menu manager.
- **Runtime-level orchestration** alongside the related-program menu manager.
- **Navigation manager:** authored the specification and implemented the main navigation behavior.
- **Overlays:** lifecycle management for handler-created overlays, with portal-based rendering and a soft teardown that removes an overlay without destroying the underlying state.
- **Global store** (Zustand) and a **trace-context** subsystem that correlates state and telemetry across the runtime. Worked with the mocked service-invocation and provisional-contract layer (session-invalid and ended-session checks) while keeping its documented mock behavior intact.
- **Runtime configuration:** loading and validation of configuration.

State machines with XState and state management with Zustand underpin the lifecycle work.

Tags: react, typescript, state-machines, zustand, schema-driven-ui, architecture

### 4.6 Login micro-frontend

Built the login app from scratch with Vite, React 19 and TypeScript: the workspace, page, component and hook structure; sign-in, forgot-password, check-email and reset-password pages with TanStack Router routing; reusable UI primitives (auth layout, text, password and dropdown inputs, divider, error banner, logo, social-login buttons, icon set); login and password-reset hooks with an auth service; and schema-based validation for login, password and sign-up forms. Configured path aliases for the app's layers.

Moved styling from plain SCSS to CSS Modules for component-scoped styles, removed `!important` usage, and fixed heading line height and typography to meet WCAG 1.4.4 (rem and Kendo font tokens instead of px). Replaced a hand-made error banner with the KendoReact notification component. Set up Storybook stories for the component library, wrote unit and browser tests (see 4.9), and iterated the flow through several PR review cycles.

Result: one shared identity app that is the only part of the system ever exposed to a user's password.
Tags: react, typescript, micro-frontends, accessibility, storybook, tanstack, kendo, html-css, testing

### 4.7 OpenID Connect authentication

Set up OIDC authentication for the host runtime with oidc-client-ts and react-oidc-context, including session and configuration wiring. The identity app is hosted separately on the identity domain, and the host and admin apps act purely as OIDC clients.

Tags: oidc, security, micro-frontends, react, typescript

### 4.8 Browser telemetry module

Designed and built a browser telemetry module from scratch: a telemetry manager and event bus, an event taxonomy, payload contracts, scoping per view, a self-diagnostic mode, and a developer handle for local inspection. Implemented an OpenTelemetry exporter and a redaction stage that scrubs sensitive data (PII) before export, each with its own specification, and added an ambient telemetry area.

Wrote and iterated the telemetry specification over several rounds of architecture-blocker resolution (including an ERP producer-field issue) and technical-debt follow-up. Documented how to run telemetry locally in a browser and wrote a local OTLP receiver script in Node.js for inspecting exported spans and traces. The build-out ran over 5 documented sessions.

Tags: observability, security, typescript, node

### 4.9 Testing

Wrote unit tests with Vitest and browser-level component tests with Vitest Browser Mode using the Playwright provider, with coverage reporting for the login app. Set up Vite and Vitest configuration (unit and browser test configs) for the host runtime. Used specification test scenarios as acceptance criteria.

Tags: testing, react, typescript

### 4.10 Monorepo tooling, shared packages and CI

Maintained the npm workspaces monorepo: dependency upgrades, an ESLint import-ordering rule, Prettier formatting rules, TypeScript project references (composite builds) and Vite/Vitest config files. Consumed and extended the shared theme and UI packages behind the login, host and admin apps, including minor package-level changes in the admin app. Worked on the repository's steward audit tooling, including shell scripts that check whether mirrored schemas are up to date, and set up and maintained the CI pipeline specification material for Azure Pipelines. Consumed the schema-to-TypeScript code generation pipeline.

Tags: monorepo, build-tooling, code-quality, ci-cd, azure, typescript

### 4.11 Mock backend and ERP application mapping

Maintained and used the Node.js mock server (its usage docs and example environment file) to build the frontend without the real backend. Added mock-server support for ERP smart-tag handling (menu-detail and service-registry fixtures, view-management routes). Fixed a mock-server field mismatch between the search key and key field code, and an ERP location input field mapping issue. Edited ERP application-mapping output (form and toolbar YAML definitions for specific ERP programs) to support frontend feature testing.

Tags: node, erp, testing

### 4.12 PR review remediation and technical-debt register

Resolved PR review findings as a standing task on nearly every feature branch. Opened and maintained entries in the technical-debt and backlog registers for deferred issues found during implementation and review, treating them as reviewable artifacts rather than ad hoc TODOs. Wrote structured session changelogs for multi-session feature work.

Tags: code-review, code-quality, sdd

## 5. Technologies and frameworks

### Core framework and language

| Technology | Version | Where used | Use |
|---|---|---|---|
| React | 19.x | All apps | **hands-on** |
| TypeScript | 5.9.x (strict mode, project references) | All apps and packages | **hands-on** |
| Vite | 7.x | Build tool and dev server, all apps | **hands-on** |
| npm workspaces | — | Monorepo structure | **hands-on** |

### Routing, state, data

| Technology | Where used | Use |
|---|---|---|
| TanStack Router (+ devtools) | Login, host and admin routing | **hands-on** (login) |
| TanStack Query | Host server-state management | **used by the project** |
| Zustand | Host global store | **hands-on** |
| XState (v5) | Host state machines (view lifecycle) | **hands-on** |
| eventemitter3 | Host internal event bus (telemetry, view runtime) | **hands-on** (telemetry) |
| axios (+ axios-mock-adapter in dev) | HTTP client and test mocking | **used by the project** |
| JMESPath (community) | Querying view-definition data | **used by the project** |

### Authentication and identity

| Technology | Where used | Use |
|---|---|---|
| oidc-client-ts | OIDC protocol client, host and admin apps | **hands-on** |
| react-oidc-context | React OIDC integration, host and admin apps | **hands-on** |

### UI components

| Technology | Where used | Use |
|---|---|---|
| KendoReact 14.4.x (buttons, common, dateinputs, dialogs, dropdowns, form, grid, labels, notification, layout, popup, animation, charts, conversational-ui, data-tools, indicators, intl, progressbars, treeview, upload) | Login, host, admin | **hands-on** |
| Kendo default theme | Theming through the shared theme package | **used by the project** |
| Kendo SVG icons | Iconography | **used by the project** |
| Kendo supporting utilities (data query, date math, intl, drawing, popup/inputs/dateinputs common) | Rendering handlers | **used by the project** |
| Kendo licensing | License activation tooling | **used by the project** |

### Styling

| Technology | Where used | Use |
|---|---|---|
| Sass/SCSS with CSS Modules | All apps, component-scoped styling | **hands-on** |
| Fontsource Inter and Material Icons | Typography and iconography | **used by the project** |
| clsx | Conditional class composition | **used by the project** |

### Telemetry and observability

| Technology | Where used | Use |
|---|---|---|
| OpenTelemetry (custom exporter implementation) | Host telemetry module | **hands-on** |
| Custom OTLP receiver script (Node.js) | Local telemetry development | **hands-on** |
| Microsoft SignalR client | Real-time transport in the host runtime | **used by the project** |
| WebSockets | Real-time communication in the host runtime (confirmed by user 2026-10-15) | **hands-on** |
| @noble/hashes | Hashing utility (telemetry, redaction or trace-context support) | **used by the project** |

### Testing

| Technology | Where used | Use |
|---|---|---|
| Vitest 4.x | Unit tests, all apps | **hands-on** |
| Vitest Browser Mode (@vitest/browser, vitest-browser-react) | Browser-level component tests | **hands-on** |
| Playwright 1.58.x | Browser test provider | **hands-on** |
| @vitest/coverage-v8 | Coverage reporting (login) | **hands-on** |
| jsdom | DOM environment for unit tests (host, admin) | **used by the project** |
| Jest, ts-jest | Tests for the schema-to-TypeScript code generation package | **used by the project** |

### Component development and documentation

| Technology | Where used | Use |
|---|---|---|
| Storybook 10.x (react-vite, a11y, docs, vitest and onboarding addons, Chromatic integration) | Login component library | **hands-on** |

### Code quality and tooling

| Technology | Where used | Use |
|---|---|---|
| ESLint 9.x (flat config), typescript-eslint, eslint-config-sheriff, react-hooks, react-refresh and storybook plugins | All workspaces | **hands-on** |
| Prettier 3.x with an import-sorting plugin | Formatting and import ordering | **hands-on** |
| Husky 9.x | Pre-commit hooks | **hands-on** |
| npm-run-all | Script orchestration across the monorepo | **used by the project** |

### CI/CD

| Technology | Where used | Use |
|---|---|---|
| Azure Pipelines | CI pipeline specification material | **hands-on** |
| Azure DevOps | repos, pull requests and pipelines (confirmed by user 2026-10-15) | **hands-on** |
| Docker | local development and services (confirmed by user 2026-10-15) | **hands-on** |

### Code generation and schemas

| Technology | Where used | Use |
|---|---|---|
| Internal schema-to-TypeScript code generation pipeline (hey-api openapi-ts, zod, yaml, semver) | Generates host types from the data-model schema | **used by the project** |
| YAML (ERP application-mapping output, view configuration) | Application-mapping repository | **hands-on** |

### Backend mock and supporting services

| Technology | Where used | Use |
|---|---|---|
| Node.js mock server (Express-style routes, YAML/JSON fixtures) | Application-mapping repository | **hands-on** |

### AI and agents

| Technology | Where used | Use |
|---|---|---|
| Configured AI coding agent in a steward role | Specification validation, implementation and review | **hands-on** |

## 6. Skills demonstrated

- React 19 component architecture (functional components, hooks, memo and displayName discipline, named prop interfaces with JSDoc): 4.1, 4.4, 4.5, 4.6
- TypeScript in strict mode with project references: 4.1, 4.10
- Micro-frontends and zero-trust host/identity/admin split: 4.1, 4.6, 4.7
- Schema-driven UI (rendering live components from backend-authored view definitions): 4.1, 4.4, 4.5
- KendoReact: 4.4, 4.6
- State machines (XState) and state management (Zustand): 4.5
- TanStack Router: 4.6
- Form handling and schema-based validation: 4.6
- CSS Modules / SCSS and accessible typography (WCAG 1.4.4): 4.6
- Storybook: 4.6
- OpenID Connect (OIDC): 4.3, 4.6, 4.7
- Observability with OpenTelemetry (event taxonomy, payload contracts, exporter, local OTLP tooling): 4.8
- PII and sensitive-data redaction: 4.8
- Unit and browser component testing (Vitest, Vitest Browser Mode, Playwright, coverage): 4.6, 4.9
- Specification-driven development (SDD), specification authoring and validation: 4.2, 4.12
- AI coding agents in a governed steward role: 4.2
- Software architecture and multi-repo traceability: 4.1, 4.2, 4.3
- Technology stack selection: 4.3
- Monorepo management (npm workspaces), build tooling (Vite, TypeScript project references): 4.10
- Code quality tooling (ESLint, Prettier, Husky) and schema-mirror auditing: 4.10
- CI pipelines (Azure Pipelines): 4.10
- Node.js mock backend and fixture data (YAML/JSON): 4.8, 4.11
- ERP domain (application-mapping configuration, smart tags): 4.4, 4.11
- Code review remediation and technical-debt register discipline: 4.12

## 7. Metrics and outcomes

| Number | Meaning | Source | Confidence |
|---|---|---|---|
| 1,891 | Distinct ERP menu items exposed by one mock backend instance, each resolvable to a rendered screen (CV rounds to 1,800+) | git | exact |
| 270+ | Non-merge commits in the frontend monorepo | git | approximate |
| ~17 | Component specifications authored or maintained | git | approximate |
| 4 | Repositories with activity and traceability chain | git | exact |
| 3 | Independently deployable apps (host, identity, admin) | git | exact |
| 5 | Documented sessions for the telemetry module build-out | git | exact |
| Jan 2026 – Sep 2026 | Date range of the harvested git history (ongoing) | git | exact |

Program size, delivery speed and review-cycle outcomes are confirmed facts, not harvested metrics: see `syspro-team-size`, `syspro-speed` and `syspro-review-cycles` in facts/confirmed.yaml.

## 8. Portfolio material

TODO (needs user input)

## 9. Confidentiality notes

- term: Application Studio Platform
- term: ASP
- term: Studio Shell
- term: Studio Shell Runtime
- term: Shell View
- term: Shell View Runtime
- term: Shell View Coordinator
- term: Shell View Bridge
- term: Shell View Manager
- term: Shell View Renderer
- term: Federated Data Model
- term: FDM
- term: "@asp/"
- term: fdm-codegen
- term: fdm-to-typescript
- term: studio-shell
- term: studio-shell-mock-server
- term: admin-portal
- term: Overlay Chrome
- term: Correlated Menu
- term: realization specification
- term: validate-realization-spec
- term: saas-frontend-agent
- term: bomprt
- term: saas-frontend-repo
- term: saas-arch-repo
- url_pattern: "*dev.azure.com*SYSPRO-Product*"
- term: SYSPRO-Product
- term: saas-frontend-architecture-repo
- term: saas-application-mapping-repo
- prefix: OQ-
- prefix: TM-
- prefix: SFR-TD-
