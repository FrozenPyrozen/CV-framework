---
schema_version: 1
id: navigation-statistics
source: git
harvest_mode: portable
harvested_at: 2026-10-23
client: HERE Technologies
role: Senior Software Engineer
engagement: full-time
# Provisional commit-based dates; the real period and employer are an open item (user 2026-10-23: decide later; consulting shows no dates).
period: { start: 2024-10, end: 2025-02 }
domain: [Automotive, Navigation]
team_size_led: 0
counts_as_experience: false
repos:
  - { name: hnodapp_old_ben }
  - { name: hnodapp }
author_identities:
  - "Kokhan, Kyrylo"
  - kkokhan
show_in_cv: true
cv_section: consulting
cv_order: 2   # first in consulting, after the PoC (user 2026-10-23)
cv_client_label: HERE Technologies
show_in_portfolio: true
portfolio_order: 3
portfolio_title: "Automotive navigation app under NDA for HERE Technologies (React Native, React, Node.js, Android)"
cv_location: Remote
cv_emphasis:
  - Navigation-services engineering across guidance state, route-change reasons, and service contracts.
  - Substantial implementation responsibility for navigation behavior, not only demo configuration.
  - Cross-layer integration across reactive application models, service interfaces, and diagnostic UI.
---

## 1. Project overview

An automotive navigation platform combining web application components with native navigation services. Its service architecture supports route planning, active guidance, parking approaches, and diagnostic tools for development and integration.

My work focused on making guidance-statistics updates explainable to consuming components: not just which route was active, but why it changed. I worked within the HERE team as an individual contributor. Total team size and specific collaborators: TODO (needs user input).

## 2. Main features

- Route calculation, turn-by-turn guidance, route restoration, and alternative-route handling.
- Route changes initiated through user interaction, commands, route refreshes, or parking approaches.
- Reactive navigation services and typed interfaces connecting application components.
- Developer-facing guidance statistics and dock displays for inspecting navigation state.

These describe product context; my contribution is limited to the authored work below.

## 3. My role and responsibilities

Senior Software Engineer, full-time, working remotely within the HERE team. I implemented guidance-statistics behavior, updated service contracts and integration points, and maintained related models and regression tests. I had no people-management responsibility.

The user requested placement in the consulting CV section despite the full-time engagement. This is a presentation choice, not a claim of contract employment. The project period is provisional and must be checked against the actual assignment dates.

Specific collaborators and responsibility beyond the repository evidence: TODO (needs user input).

## 4. My contributions

### 4.1 Explainable guidance and route changes

Implemented propagation of route-update reasons through the guidance-statistics flow. Connected the reason to the affected route across guidance interaction, command handling, route restoration, dynamic routing, and parking-approach paths. Adjusted observable behavior and route-ID handling so consumers could receive route context without relying on incidental subscription effects or missing identifiers. Updated target-guidance access where the integration required the requested guidance state.

Tags: typescript, rxjs, automotive, architecture, debugging

### 4.2 Service separation and compatible interfaces

Separated developer dock responsibilities from core guidance statistics, moving application models and services to the appropriate packages. Updated Protocol Buffer definitions, service registration, imports, request and response messages, and SDK-facing integration. Retained deprecated dock operations on the older interface for backward compatibility rather than requiring every consumer to migrate immediately. Related generated interface artifacts are included here as contract maintenance, not independent feature development.

Tags: typescript, architecture, monorepo, legacy-migration, automotive

### 4.3 Diagnostic models and developer displays

Adapted the guidance-statistics models, developer menu, and display components to the revised service boundaries. Updated controller wiring and navigation-service configuration so the diagnostic view continued to use the separated statistics and dock responsibilities. This includes the related React diagnostic UI changes, not ownership of the wider navigation interface.

Tags: typescript, react, rxjs, debugging, automotive

### 4.4 Regression tests and integration stability

Added and repaired tests for route-update reasons across guidance, route restoration, route edits, alternative and refreshed routes, command-driven navigation, and parking approaches. Updated service and model tests, controller mocks, and dependent voice-assistant test fixtures as the contracts changed. Addressed build, protocol-formatting, and test failures during integration and review follow-up. These changes supported existing validation pipelines; no authored pipeline definition or independent review record was identified.

Tags: testing, typescript, debugging, code-quality, automotive

### 4.5 In-car navigation features (truck navigation app)

Implemented in-car navigation features with the HERE HNav / HNod SDK, including route-deviation handling on the truck navigation app for HERE Technologies, and a redesigned search UI. Moved from `general-motors-navigation` 4.6 (user 2026-10-23: this work belongs to the HERE consulting entry; project name confirmed for the CV and portfolio, decision gm-project-names).

Tags: here-sdk, automotive, react-native

## 5. Technologies and frameworks

- Languages: TypeScript 5.1.6 and JavaScript, **hands-on**. The version is from the inspected manifest, not a claim that it was constant throughout the assignment.
- Reactive state and services: RxJS and observable-based navigation models, **hands-on**.
- UI: React and diagnostic components, **hands-on**.
- Contracts: Protocol Buffers and generated service interfaces, **hands-on**.
- Navigation: HERE navigation SDK and internal navigation-service integration, **hands-on**.
- Testing: Jest 29 and test mocks, **hands-on**; exact minor versions may have changed.
- Tooling: Node.js, npm, pnpm, monorepo tooling, ESLint, Prettier, Husky, and Git, **hands-on**. Lerna, Yarn, and the native runtime are **used by the project**; specific hands-on use was not separately confirmed.

## 6. Skills demonstrated

- Reactive navigation-service engineering: 4.1, 4.3.
- Cross-module integration and service-contract evolution: 4.1, 4.2, 4.3.
- Backward-compatible migration and separation of responsibilities: 4.2.
- Developer tooling and diagnostic UI integration: 4.3.
- Regression testing, mock maintenance, and integration debugging: 4.4.
- Technical review follow-up and code-quality maintenance: 4.2, 4.4.

## 7. Metrics and outcomes

- Authorship scope: the supplied identities plus the additional names in front matter, confirmed by the user on 2026-10-23. Source: user; confidence: exact.
- hnodapp_old_ben: 68 authored non-merge commits dated 2024-10-15 through 2025-02-12. Source: git branches and remotes; confidence: exact for the available local references.
- hnodapp: 9 authored non-merge commits dated 2024-10-15 through 2024-11-11. Source: git branches and remotes; confidence: exact for the available local references.
- Combined history: 69 distinct authored non-merge commit IDs; 8 IDs are shared between the checkouts. Source: git commit-ID set comparison; confidence: exact. Different IDs may represent repeated versions of the same change, so this is not a count of unique features.
- Project period: October 2024 through February 2025, provisionally accepted by the user on 2026-10-23 from the commit dates. Source: user and git; confidence: approximate. TODO (needs user input): verify the actual assignment start and end.
- People led: 0. Source: user, confirmed 2026-10-23; confidence: exact. Total team size is unknown.
- 4.1: TODO (needs user input): confirmed consumer benefit, delivery status, and any measured improvement in diagnosing route changes.
- 4.2: TODO (needs user input): migration outcome, downstream adoption, and compatibility results.
- 4.3: TODO (needs user input): who used the diagnostic display and what it enabled.
- 4.4: TODO (needs user input): verified test or reliability outcomes. Authored tests do not prove that current or historical pipelines passed.

- Navigation features also used HERE "service packages" (4.5). Source: previous CV, confirmed by user 2026-10-15 (moved from general-motors-navigation). Confidence: exact.

No business-impact, performance, defect-reduction, or adoption numbers are inferred from commit or line counts. No authored commits matched in service-packages; no contribution there is claimed. The Kotlin reference-app history did not establish a connection to this statistics assignment.

## 8. Portfolio material

- image: ../sources/media/portfolio-2025-04/image2.jpeg
  caption: Navigation app, route view
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-04/image3.jpeg
  caption: Navigation app, search
  public: yes, confirmed by user 2026-10-23

Moved from `general-motors-navigation` section 8 (user 2026-10-23). The portfolio page text comes from `doc:portfolio-2025-09`.

## 9. Confidentiality notes

- term: hnodapp_old_ben
- term: hnodapp
- term: fork_hnodapp_ben
- term: service-packages
  allow_in: [portfolio]   # decision portfolio-here-detail-kept (HERE's components on the portfolio pages)
- term: HNoD
  allow_in: [portfolio]   # decision portfolio-here-detail-kept (HERE's components on the portfolio pages)
- term: HNAV
  allow_in: [portfolio]   # decision portfolio-here-detail-kept (HERE's components on the portfolio pages)
- term: GuidanceStatisticsService
- term: GuidanceStatisticsDockService
- term: GuidanceStatisticsModel
- term: GuidanceStatisticsDockModel
- term: GuidanceRouteIdUpdateReason
- term: GuidanceService
- term: GuidanceInteractionService
- term: ParkingApproachService
- term: GenericCommandHandlerPlugin
- term: DRGService
- term: GfatbController
- term: AlexaModel
- term: fs2-gfatb
- term: fs2-gfatb-engine
- term: fs2-gfatb-service-implementation
- term: fs2-gfatb-dev-menu
- term: fsdev-core-service-implementation
- term: fs3-aot-service-implementation
- term: fs-parking-approach-service-implementation
- term: fs-navigation-service-config
- term: fs2-vp-alexa
- term: hnod-sdk
- prefix: BEN-
- prefix: WP3-
- url_pattern: "*main.gitlab.in.here.com*hnod*"
- url_pattern: "*main.gitlab.in.here.com*stashyns*"
- url_pattern: "*main.gitlab.in.here.com*"
- url_pattern: "*artifactory.in.here.com*"