---
schema_version: 1
id: navigation-poc
source: git
harvest_mode: portable
harvested_at: 2026-10-23
client: HERE Technologies
role: Senior Software Engineer
engagement: full-time
# Provisional commit-based dates; the real period and employer are an open item (user 2026-10-23: decide later; consulting shows no dates).
period: { start: 2025-07, end: 2026-10 }
domain: [Automotive, Navigation]
team_size_led: 0
counts_as_experience: false
repos:
  - { name: audipoc-v2 }
  - { name: refappkotlin }
  - { name: hnav-control-panel-web }
author_identities:
  - "Kokhan, Kyrylo"
  - kkokhan
show_in_cv: true
cv_section: consulting
cv_order: 1   # first in consulting (user 2026-10-23)
cv_client_label: HERE Technologies
show_in_portfolio: true
portfolio_order: 4
portfolio_title: "Car navigation PoC for HERE Technologies (Node.js, React)"   # user 2026-10-24
cv_location: Remote
cv_emphasis:
  - Substantial ownership of automotive proof-of-concept application logic, not only demo assembly.
  - Navigation-services engineering with reactive state and typed integration contracts.
  - Cross-layer delivery across React and TypeScript features, Android services, and Kotlin reference UI.
---

## 1. Project overview

An automotive navigation proof of concept for exploring integrated cockpit experiences across vehicle brands and display layouts. It combines a React and TypeScript customization layer with an Android-hosted navigation SDK and service interfaces. The product provides a setting for evaluating navigation, assistant interaction, warnings, passenger information, and vehicle-specific presentation rather than establishing a production-release claim.

A companion browser-based control panel lets demo operators configure navigation and assisted-driving presentation, select location-specific scenarios, and control demo playback. My work on this application is included alongside the navigation PoC.

I worked within the HERE PoC R&D team as an individual contributor. This summary also includes my bounded changes to a separate Kotlin motorcycle-navigation reference app, grouped here at the user's request. That grouping does not establish shared implementation or dependency between the applications. Total team size and specific collaborators: TODO (needs user input).

## 2. Main features

- Map-based navigation, route selection, guidance, and route-progress information.
- Voice and text interaction with a navigation assistant.
- Driver warnings, incident interactions, and assisted-driving status and notifications.
- Passenger-display layouts with live trip information and nearby places.
- Vehicle-brand themes, day and night presentation, and display-specific controls.
- Search-result details, ratings, parking information, and a booking handoff demonstration.
- Reference-app route preferences and guidance presentation for motorcycle navigation; its wider capabilities include offline maps and voice guidance.
- A demo control panel with configurable labels and settings, location-specific scenarios, playback controls, and a close-demo action.

These are product features, not a claim that I built every subsystem.

## 3. My role and responsibilities

Senior Software Engineer, full-time, working remotely in the HERE PoC R&D team. I implemented substantial feature logic and UI behavior, connected reactive models to navigation and Android service data, evolved Protocol Buffer contracts, and maintained integration and demo tooling. My changes span application behavior as well as visual customization. I had no people-management responsibility.

In the companion demo control panel, I implemented configuration-driven controls, location-specific scenario handling, and validated runtime configuration loading.

The user requested the consulting CV section while confirming full-time engagement. The project period is provisional and must be checked against actual assignment dates. Specific collaborators and broader ownership boundaries: TODO (needs user input).

## 4. My contributions

### 4.1 Navigation-assistant interaction and state

Reworked the assistant integration around revised Android-side behavior, separating service, model, and UI responsibilities. Added text-input support alongside voice interaction, updated synchronization contracts and response handling, and implemented processing, completion, inactive, and error presentation. Refined dismissal, mode changes, and card-stack behavior so assistant interactions could coexist with the navigation UI. This is client-side integration and interaction work, not a claim to have built the assistant backend or its speech models.

Tags: typescript, react, rxjs, android, voice-ai, architecture, debugging

### 4.2 Driver warnings and incident interaction

Built and refined warning cards, indicators, and their reactive state. Connected vehicle position and warning data to display calculations, localized distance and unit presentation, and supported custom status text and icons. Evolved service contracts and Android event exchanges for opening, confirming, rejecting, dismissing, and automatically closing warnings, including success and failure feedback. Added presentation fixes such as warning animation and stable map-marker updates. No safety certification or production safety outcome is asserted.

Tags: typescript, react, rxjs, android, automotive, debugging

### 4.3 Passenger-display features and live trip data

Implemented passenger-oriented layouts and trip-summary UI, connected them to live Android trip data, and added recentering, nearby-place content, icons, and compass-related handling. Separated passenger-display responsibilities from the trip-summary service and evolved the corresponding protocol definitions and feature configuration. Adapted brand-specific integration, including weather-feature configuration and later cockpit controls, while repairing card visibility and layout behavior. This is the passenger second-screen feature for a luxury car brand (moved from `general-motors-navigation` 4.8; user 2026-10-23).

Tags: typescript, react, rxjs, android, architecture, automotive

### 4.4 Route progress and assisted-driving presentation

Added route-progress markers, ordering, clustering, and next-marker emphasis. Refined selected-route synchronization, route-state cleanup, and minimap visibility when assisted-driving conditions changed. Migrated assisted-driving status icons and notifications, adjusted their placement and duration, incorporated Android-provided notification text, and maintained planning-panel presentation. The implementation concerns information and interaction in the PoC, not ownership of autonomous-driving algorithms.

Tags: typescript, react, rxjs, automotive, debugging

### 4.5 Route controls and native reference-app features

Integrated curvy-route controls into selected PoC variants and repaired route-alternative selection when changes originated on the map. In the separate Kotlin reference app, implemented a route-curviness slider and its settings integration, and adjusted orientation handling for active guidance. Updated associated Android manifest and build dependencies for the orientation behavior. The reference-app history contains repeated versions of the orientation change, not separate delivered features.

Tags: typescript, react, android, here-sdk, automotive

### 4.6 Search and parking demonstrations

Adapted search attribution and ratings presentation, including icon placement, review styling, and integration with updated SDK layout support. Added truck-parking detail integration to expose facility information in the demo UI, and refined a QR-code booking card and its configuration path. These are presentation and integration contributions; transaction processing, booking completion, and end-user adoption are not established by git.

Tags: typescript, react, automotive

### 4.7 Brand themes and shared cockpit layout

Implemented and refined brand-specific themes, including day and night variants, map-theme integration, colors, scaling, and icons. Updated shared layouts, card-stack visibility, overlays, speed-limit badges, warning presentation, and widget placement across variants. Applied spacing tokens and relative sizing where required by the interface. Bulk theme assets are included as integration work, not represented as individually authored application logic or an impact metric.

Tags: typescript, react, html-css, design-systems, automotive

### 4.8 Service data and SDK integration maintenance

Connected electric-vehicle data to the TypeScript presentation layer through Android model and protocol updates, including data freshness metadata. Maintained navigation SDK artifacts and related version records needed by evolving feature integrations. This covers SDK consumption and compatibility work, not authorship of the SDK itself. Feature-specific contract changes for assistant, warning, and passenger flows are described with those contributions rather than counted again here.

Tags: typescript, android, here-sdk, architecture, build-tooling

### 4.9 Development workflow and testability

Added and maintained pre-commit hooks scoped to the TypeScript workflow, introduced stable UI test identifiers, and consolidated identifiers used by assistant components. Updated device build/install and reload tooling, SDK preparation scripts, and local setup guidance, including dependency-recovery notes and configuration preparation. Addressed integration regressions and review feedback during feature delivery. Test identifiers support automation but do not establish authorship of an end-to-end suite. No authored CI pipeline definition, formal specification, or architecture decision record was identified.

Tags: build-tooling, git, code-quality, testing, debugging, android

### 4.10 Configurable demo control panel

Extended the browser-based demo control panel so its headings, control labels, navigation and assisted-driving settings, location/time controls, and scenario timeline could be driven by configuration rather than fixed UI content. Added location-specific scenario selection and default-scene handling when starting playback, a close-demo action with configurable confirmation text, and debounced settings handling. Updated shared configuration context, types, parsing helpers, and settings synchronization to support these flows.

Moved custom configuration outside the application bundle so demo definitions could be changed without rebuilding. Added schema validation and fallback to bundled defaults, then adapted loading to a JavaScript runtime configuration file to address local browser cross-origin restrictions and development/deployment path differences. This contribution includes the related dependency and configuration maintenance; no authored control-panel documentation, tests, or pipeline definitions were identified in the inspected history.

Tags: typescript, react, schema-driven-ui, debugging, automotive

### 4.11 Car navigation PoC

Built the car navigation PoC (proof of concept), an in-car navigation app that combined search, routing, guidance and a voice AI assistant able to build routes and find places from spoken requests. Moved from `general-motors-navigation` 4.7 (user 2026-10-23: this work belongs to the HERE consulting entry).

Tags: here-sdk, automotive, voice-ai

## 5. Technologies and frameworks

- Languages: TypeScript 5.1.6 in the navigation PoC and 5.9 in the control panel, JavaScript, and Kotlin, **hands-on**. Versions reflect inspected manifests where available, not the entire assignment history.
- Web UI: React 18 in the navigation PoC and React 19 in the control panel, CSS, and Stitches 1.2, **hands-on**. Material UI 7 and Emotion 11 in the control panel are **used by the project**; personal hands-on use was not separately confirmed.
- Control-panel configuration and builds: Zod 4 schema validation and Vite 7, **used by the project**; personal hands-on use of these libraries and tools was not separately confirmed.
- Reactive models: RxJS 7.8 and observable service integration, **hands-on**.
- Contracts: Protocol Buffers and generated service interfaces, **hands-on**. gRPC is **used by the project**; independent hands-on use beyond the generated interfaces was not separately confirmed.
- Navigation: HERE's HNav and HNod SDKs, written in TypeScript and Kotlin, **hands-on** (SDK names and languages: user 2026-10-24). The reference-app README identifies SDK 4.25; authored dependency versions may differ by revision.
- Native UI and builds: Android, Jetpack Compose, Kotlin, and Gradle, **hands-on**.
- Tooling: Node.js, npm, pnpm, monorepo tooling, ESLint, Prettier, Husky, and Git, **hands-on** where used in the respective repositories.
- Testing: Jest and test mocks, **hands-on**, as confirmed by the user. PoC-specific authored evidence chiefly establishes UI test identifiers and validation hooks, not a complete authored Jest suite.
- Supporting libraries: QR-code rendering, carousel and sorting utilities, **used by the project**. Koin, Room, Voyager, and JaCoCo in the reference app are **used by the project**; broader personal ownership is not established by the scoped commits.
- Assistant architecture: backend language-model and speech capabilities are **used by the project**. My evidenced work is the application-facing voice/text integration, not model development.

## 6. Skills demonstrated

- Reactive application architecture and cross-layer service integration: 4.1, 4.2, 4.3, 4.8.
- Voice and text assistant UX integration: 4.1.
- Stateful warning interactions and localized navigation information: 4.2.
- Multi-display UI and separation of service responsibilities: 4.3.
- Route-state synchronization and information-dense visualization: 4.4, 4.5.
- Android and native Compose UI integration: 4.5.
- External-feature demonstration and data presentation: 4.6.
- Shared theming, component styling, and vehicle-variant adaptation: 4.7.
- SDK compatibility and typed contract maintenance: 4.8.
- Development tooling, testability, debugging, and review follow-up: 4.9.
- Configuration-driven UI, runtime configuration validation, and demo-scenario orchestration: 4.10.

## 7. Metrics and outcomes

- Authorship scope: the supplied identities plus the additional names in front matter, confirmed by the user on 2026-10-23. Source: user; confidence: exact.
- Main audipoc-v2 checkout: 194 authored non-merge commits dated 2025-07-17 through 2026-10-23. Source: git branches and remotes; confidence: exact for available local references.
- Secondary audipoc-v2 checkout: 14 authored non-merge commits dated 2025-07-17 through 2025-09-17; 13 commit IDs also occur in the main checkout. Combined PoC history contains 195 distinct authored non-merge IDs. Source: git commit-ID set comparison; confidence: exact. The secondary checkout is not an additional repository entry because its root folder has the same repository name.
- refappkotlin: 3 authored non-merge commits dated 2026-03-20 through 2026-04-02. Source: git branches and remotes; confidence: exact. Repeated orientation work is described as a single functional contribution.
- hnav-control-panel-web: 9 authored non-merge commits dated 2025-11-14 through 2025-12-01, plus 5 authored merge commits excluded from the non-merge total. Source: git branches and remotes; confidence: exact for available local references. All non-merge commit IDs are additional to the previously covered repositories.
- Combined summary scope: 207 distinct authored non-merge commit IDs across the PoC checkouts, reference app, and demo control panel. Source: git commit-ID set union; confidence: exact. Rewritten or repeated changes can have distinct IDs, so this is not a unique-feature or productivity measure.
- Project period: July 2025 through October 2026, provisionally accepted by the user on 2026-10-23 from the commit dates. Source: user and git; confidence: approximate. TODO (needs user input): verify the actual assignment dates and whether the assignment is ongoing.
- People led: 0. Source: user, confirmed 2026-10-23; confidence: exact. Total team size is unknown.
- 4.1: TODO (needs user input): assistant interaction outcome, demonstration use, and any confirmed usability benefit.
- 4.2: TODO (needs user input): warning workflow outcome, validation status, and any measured defect reduction.
- 4.3: TODO (needs user input): passenger-display demonstration outcome, audience, and adoption.
- 4.4: TODO (needs user input): route-progress and assisted-driving presentation outcome or evaluation feedback.
- 4.5: TODO (needs user input): route-control and orientation outcome, including any reference-app demonstration use.
- 4.6: TODO (needs user input): search/parking demo outcome and whether any booking handoff was validated.
- 4.7: TODO (needs user input): confirmed variant coverage and any design or demonstration acceptance.
- 4.8: TODO (needs user input): integration outcome and confirmed use of the electric-vehicle data view.
- 4.9: TODO (needs user input): measured setup, build/install, or debugging improvements and automation adoption.
- 4.10: TODO (needs user input): confirmed demo use, operator feedback, configuration-maintenance benefit, and any measured preparation-time savings.

No release, customer, performance, safety, or delivery-speed metrics are inferred from git. Line counts are omitted because imported theme assets and repeated revisions would distort the interpretation. No matched authored commits were found in service-packages, and the reference-app work does not establish a connection to the earlier guidance-statistics assignment.

## 8. Portfolio material

- image: ../sources/media/portfolio-2025-09/p04-1.png
  caption: Car navigation PoC on the in-car display
  public: yes, confirmed by user 2026-10-23

Moved from `general-motors-navigation` section 8 (user 2026-10-23). The portfolio page text comes from `doc:portfolio-2025-09`.

## 9. Confidentiality notes

- term: audipoc-v2
- term: android-audipoc2
- term: refappkotlin
- term: service-packages
- term: HNAV
  allow_in: [portfolio, skills, navigation-poc, navigation-statistics]   # decisions portfolio-here-detail-kept and here-sdk-names-in-skills
- term: HNoD
  allow_in: [portfolio, skills, navigation-poc, navigation-statistics]   # decisions portfolio-here-detail-kept and here-sdk-names-in-skills
- term: HUGO
  allow_in: [portfolio]   # decision portfolio-poc-names-public
- term: HERE PoC R&D
- term: Audi
  allow_in: [portfolio]   # decision portfolio-poc-names-public
- term: Porsche
  allow_in: [portfolio]   # decision portfolio-poc-names-public
- term: Bentley
- term: Daimler
- term: VW
  allow_in: [portfolio]   # decision portfolio-poc-names-public
- term: Kurviger
  allow_in: [portfolio]   # decision portfolio-poc-names-public
- term: HERE Moto HMI
- term: HugoVoiceManager
- term: HugoSyncService
- term: HugoCard
- term: WarningsService
- term: PassengerScreenService
- term: TripSummaryService
- term: PassengerLiveTripSummaryCard
- term: IsmWidgetContainer
- term: hnav-SDK
- term: sdk-v2-example
- term: porsche-poc-theme
- term: audi-poc-theme
- term: bentley-poc-theme
- term: vw-poc-theme
- term: daimler-poc-theme
- term: hnav-theme
- term: l3-planning
- term: l3-status
- term: l3-notifications
- term: passenger-screen-layout
- term: trip-summary
- term: google-web-search
- term: daimler-truck-parking
- prefix: PSPOC-
- url_pattern: "*main.gitlab.in.here.com*professional-services*"
- url_pattern: "*main.gitlab.in.here.com*"
- url_pattern: "*artifactory.in.here.com*"
- term: hnav-control-panel-web
- term: HNAV Control Panel Web