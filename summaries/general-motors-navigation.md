---
schema_version: 1
id: general-motors-navigation
source: cv
# --- the job ---
client: General Motors
role: Team Leader
engagement: full-time
period: { start: 2023-07, end: 2025-12 }   # end confirmed by user 2026-10-23 (overlaps the SYSPRO start in December 2025)
domain: [Automotive, Navigation]
team_size_led: 8
counts_as_experience: true
# --- harvesting ---
repos: []
author_identities: []
harvested_at: null
# --- how it appears in the CV ---
show_in_cv: true
show_in_portfolio: true   # all jobs, decided by user 2026-10-23
portfolio_order: 2
portfolio_projects:                # the three pages of the published portfolio (user 2026-10-23: keep its structure)
  - { id: companion, title: "Car management app for General Motors (React Native)" }
  - { id: navigation, title: "Automotive navigation app under NDA for HERE Technologies (React Native, React, Node.js, Android)" }
  - { id: poc, title: "Car navigation PoC under NDA (Node.js, React)" }
cv_section: experience
cv_client_label: General Motors
cv_location: Remote
---

# General Motors: automotive navigation app

## 1. Project overview

A vehicle companion app for General Motors owners: from their phone, drivers control and check their car, for example by starting the engine remotely or checking tire pressure, for gas and electric vehicles across the Chevrolet, Buick, GMC and Cadillac brands. Inside it, a reusable map feature (map display, search, a bottom drawer, markers and EV charging stations) ships as a React Native micro-frontend built on the HERE SDK and is reused by several company products. The map team had 8 developers: 6 React Native, 1 iOS and 1 Android. It worked with the UI team, the backend teams for the EV and gas vehicle services and the location-based services, and with HERE as the vendor of the map SDK and APIs (doc:portfolio-2025-04; the user confirmed on 2026-10-22 that the portfolio is the more detailed description for now). The work also included in-car navigation features on the HERE SDK and a passenger second-screen feature for a luxury car brand (from the CV).

TODO (needs user input): the wider organization context; more detail the user will add later.

## 2. Main features

In-car navigation, including route-deviation handling and search (from the CV). Remote vehicle control and status from the phone (for example remote engine start and tire pressure), for gas and electric vehicles; a map with search, a bottom drawer, markers and EV charging stations (doc:portfolio-2025-04).

## 3. My role and responsibilities

Team Leader of a team of 8 developers. Worked with stakeholders on scope and planning, ran code reviews, set coding standards, and mentored developers on architecture and testing. Owned the system design of the app's modular architecture, defined the unit-testing strategy, and introduced an Agile delivery process.

Led the map team and coordinated its dependencies with the UI team, the backend teams (EV and gas vehicle services, location-based services) and the HERE SDK and API vendor teams: set scope, deadlines and priorities, ran planning, removed blockers, defined the integration strategy and set up test automation (doc:portfolio-2025-04).

## 4. My contributions

### 4.1 Team leadership and delivery

Led the map team of 8 developers (6 React Native, 1 iOS, 1 Android) of the General Motors vehicle companion app for car owners, built in React Native, and worked with stakeholders on scope and planning (team split and app type from doc:portfolio-2025-04, confirmed as the current description by user 2026-10-22).

Result: after release, user engagement rose 20% and app crashes fell 15%.
Tags: leadership, react-native, automotive

### 4.2 Code reviews and coding standards

Ran code reviews and set coding standards for the team, and mentored developers on architecture and testing.

Tags: code-review, mentoring, leadership, architecture, testing

### 4.3 Reusable HERE SDK map library

Led development of a reusable map library built on the HERE SDK, packaged as a React Native micro-frontend and integrated into several company products.

Result: the library was integrated into several company products.
Tags: here-sdk, react-native, micro-frontends, automotive, leadership

### 4.4 Modular app architecture

Owned the system design of the app's modular architecture, so that new feature requests from product teams could be added without reworking existing modules.

Tags: architecture, react-native

### 4.5 Unit-testing strategy and Agile process

Defined the unit-testing strategy for the app and introduced an Agile delivery process.

Result: unit-test coverage reached 95%, and production bugs fell by 50%.
Tags: testing, agile, leadership

### 4.6 In-car navigation features (truck navigation app for HERE Technologies)

Implemented in-car navigation features with the HERE HNav / HNod SDK, including route-deviation handling on the truck navigation app for HERE Technologies, and a redesigned search UI (project name confirmed for the CV and portfolio by user 2026-10-23, decision gm-project-names).

Tags: here-sdk, automotive, react-native

### 4.7 Car navigation PoC

Built the car navigation PoC (proof of concept), an in-car navigation app that combined search, routing, guidance and a voice AI assistant able to build routes and find places from spoken requests.

Tags: here-sdk, automotive, voice-ai

### 4.8 Passenger second screen

Implemented a passenger second-screen feature for a luxury car brand.

Tags: automotive, react-native

### 4.9 Delivery and testing process for nested apps

Created and documented the process for delivering and testing the map feature inside the host app. The chain had three levels: the host app, a reusable feature app, and a map provider app built in React Native with native iOS and Android code and the HERE SDK.

Tags: ci-cd, testing, micro-frontends, react-native
Source: doc:portfolio-2025-04

### 4.10 Migrating the reusable feature app into the host app

At the client's request, changed the architecture so the reusable feature app moved into the host app, with the map provider app still separate. Planned how to move all of its logic and components into the host app's patterns: clean architecture, domain-driven design, abstract services and pure components.

Tags: architecture, micro-frontends, react-native, legacy-migration
Source: doc:portfolio-2025-04

### 4.11 Map architecture fixes for multiple map instances

During the migration, fixed weak points that slowed integration and caused bugs. Map instances no longer shared one global reference, and each map got its own event listener, because a single global listener had caused bugs when several maps ran at once. Separated the map-specific logic into the map provider, designed the architecture for a complex search feature reused on several screens, and normalized the state that stores markers and search results.

Tags: architecture, react-native, here-sdk, redux, debugging
Source: doc:portfolio-2025-04

## 5. Technologies and frameworks

- **Language:** TypeScript (hands-on)
- **Mobile and UI:** React Native (hands-on), Storybook (hands-on), Figma (hands-on), Styled Components (hands-on, confirmed by user 2026-10-16)
- **Maps and navigation:** HERE SDK, HERE HNav / HNod SDK (hands-on), HERE API (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **Architecture:** React Native micro-frontends (hands-on), clean architecture and domain-driven design (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **State and data:** Redux Saga (hands-on), Redux Toolkit (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04), RxJS (hands-on)
- **Backend:** Node.js (hands-on)
- **Testing:** unit testing with Jest (hands-on; Jest confirmed by user 2026-10-22, from doc:portfolio-2025-04), Detox for E2E (hands-on), BrowserStack device testing (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **CI/CD:** Fastlane (hands-on), Bitrise (hands-on), Azure and Azure Pipelines (used by the project, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **Native code:** native iOS and Android modules of the map provider (used by the project; built by the team's iOS and Android developers)
- **Monitoring:** Bugsnag (hands-on), Kibana (hands-on)
- **AI:** voice AI assistant (hands-on, proof of concept)

## 6. Skills demonstrated

- Team leadership: 4.1, 4.2, 4.3, 4.5
- Code review and coding standards: 4.2
- Mentoring: 4.2
- System design and software architecture: 4.2, 4.4
- Micro-frontends: 4.3
- HERE SDK and in-car navigation: 4.3, 4.6, 4.7
- React Native: 4.1, 4.3, 4.4, 4.6, 4.8
- Testing strategy: 4.2, 4.5
- Agile: 4.5
- Voice AI: 4.7

## 7. Metrics and outcomes

- Team of 8 developers led (4.1). Source: cv. Confidence: exact.
- User engagement rose 20% after release (4.1). Source: cv. Confidence: exact.
- App crashes fell 15% after release (4.1). Source: cv. Confidence: exact.
- Unit-test coverage reached 95% (4.5). Source: cv. Confidence: exact.
- Production bugs reduced by 50% after the testing strategy and Agile process (4.5). Source: previous CV, confirmed by user 2026-10-15. Confidence: exact.
- Navigation features also used HERE "service packages" (4.6). Source: previous CV, confirmed by user 2026-10-15. Confidence: exact.

## 8. Portfolio material

- image: ../sources/media/portfolio-2025-04/image1.png
  caption: Car management app, map screen
  project: companion
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-04/image2.png
  caption: Car management app, map search
  project: companion
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-04/image1.jpeg
  caption: Car management app, charging stations
  project: companion
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-04/image3.png
  caption: Car management app, place details
  project: companion
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-04/image2.jpeg
  caption: Navigation app, route view
  project: navigation
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-04/image3.jpeg
  caption: Navigation app, search
  project: navigation
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-09/p04-1.png
  caption: Car navigation PoC on the head unit
  project: poc
  public: yes, confirmed by user 2026-10-23

TODO (needs user input)

## 9. Confidentiality notes

None known. TODO (needs user input)
