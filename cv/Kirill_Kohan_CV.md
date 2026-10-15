<!-- generated:header -->
# **Kirill Kohan**

**Senior Software Engineer / Tech Lead (Frontend & Mobile)**

Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment | Working hours overlap with EU, UK and US time zones

+380 97 891 9783 | kiril.kohan@gmail.com | Portfolio: https://drive.google.com/file/d/1-BtpQknjSQ9bxTFAKm6v-r3DQR7IOX6s/view?usp=sharing
<!-- /generated:header -->

# **SUMMARY**

Senior software engineer and tech lead with 7+ years of experience building React, React Native and TypeScript applications for enterprise ERP SaaS, automotive, healthcare and clinical trials, fintech and blockchain products. At SYSPRO, builds a schema-driven React 19 runtime that renders 1,800+ ERP programs from data-model definitions. Previously led a team of 8 developers delivering in-car navigation features for General Motors on the HERE SDK. Experienced in micro-frontend architecture, OpenID Connect (OIDC) authentication, OpenTelemetry observability, test automation, native Android migrations, generative AI integrations, frontend technology-stack decisions, and architecture-governed, specification-driven development (SDD).

# **EXPERIENCE**

<!-- entry: syspro-saas-erp -->
## **Senior Software Engineer**

### **SYSPRO | Remote | December 2025 - Present**

* Built core modules of a schema-driven **React 19 / TypeScript** runtime for SYSPRO's **ERP SaaS** modernization platform (25+ person program) that renders **1,800+ ERP programs** from declarative data-model definitions, cutting the time to bring an ERP screen to the web from days to hours with no per-screen frontend code.

* Delivered the frontend through an architecture-governed **specification-driven development (SDD)** process rather than ad-hoc AI code generation, and helped define the process itself: specification templates, the validation routine and the rules for **AI coding agents**. Every subsystem was traced from platform architecture to solution architecture, component specification and implementation across 4 repositories.

* Worked with the lead architect on the **platform and solution architecture**: reviewed and co-authored architecture documents, drove open architecture questions and blockers to decisions, and authored the **frontend technology-stack decision record** (choice of OIDC libraries, move from React Testing Library to **Vitest Browser Mode**).

* Authored ~17 component specifications (view orchestration, telemetry, navigation, overlays, runtime configuration) and validated each for architecture alignment before and after implementation, with AI agents acting as a governed reviewer that flagged constraint violations and spec-to-code drift for human decision. This reduced PR review cycles, and deferred issues were tracked in a reviewed **technical-debt register**.

* Implemented the runtime's **KendoReact** rendering handlers (forms, date fields, search grids with filtering, sorting and persisted filter state, smart-tag lookups, predictive search) and the view orchestration layer with **XState** and **Zustand** (view session lifecycle, navigation menu, context-aware related-program navigation, modal overlays).

* Built the **Login micro-frontend** from scratch (sign-in, forgot and reset password flows, reusable form components, schema-based validation, **WCAG** accessible typography, **Storybook**) and integrated **OpenID Connect (OIDC)** authentication into the host and admin applications using **oidc-client-ts** and **react-oidc-context** in a **zero-trust**, independently deployable **micro-frontend architecture**.

* Designed and built a browser telemetry module on **OpenTelemetry** from scratch: event bus, event taxonomy, payload contracts, OTLP exporter, and a redaction stage that strips sensitive data (PII) before export.

* Covered implementations with **Vitest**, **Vitest Browser Mode** and **Playwright** tests, and maintained a **Node.js** mock backend and the **monorepo** tooling (npm workspaces, ESLint, Prettier, Husky, **Azure Pipelines** CI, schema-to-TypeScript **code generation**).

* Stack: **React 19, TypeScript, KendoReact, Zustand, XState, TanStack Router, TanStack Query, Vite, SCSS / CSS Modules, OpenTelemetry, Vitest, Playwright, Storybook, Docker, Azure DevOps**.

<!-- entry: general-motors-navigation -->
## **Team Leader**

### **General Motors | Remote | July 2023 - November 2025**

* Led a team of 8 developers delivering an automotive **React Native** app, working with stakeholders on scope and planning. After release, user engagement rose 20% and app crashes fell 15%.

* Ran **code reviews** and set coding standards for the team, mentoring developers on architecture and testing.

* Led development of a reusable map library on the **HERE SDK**, packaged as a **React Native micro-frontend** and integrated into several company products.

* Owned the **system design** of the app's modular architecture so that new feature requests from product teams could be added without reworking existing modules.

* Defined the unit-testing strategy that reached 95% coverage and introduced an **Agile** delivery process, which reduced production bugs.

* Implemented in-car navigation features with the **HERE HNav / HNod SDK**, including route-deviation handling and a redesigned search UI.

* Built a proof of concept for in-car navigation combining search, routing, guidance and a **voice AI assistant** that builds routes and finds places from spoken requests.

* Implemented a passenger second-screen feature for a luxury car brand.

* Stack: **React Native, TypeScript, Node.js, Redux Saga, RxJS, Storybook, Detox** (E2E), **Fastlane, Bitrise** (CI/CD), **Bugsnag, Kibana** (monitoring), **Figma**.

<!-- entry: velas-wallet -->
## **Technical Leader**

### **Velas | Remote | December 2021 - July 2023**

* Developed the Velas **blockchain** wallet for web, mobile and desktop using **React, React Native, Node.js, TypeScript, MobX and Web3.js**.

* **Performance optimization:** made the staking list load 12x faster and use 5x less mobile battery by moving filtering to the server and adding a Node RPC fallback.

* Added automatic **Web3 provider** failover for testnet and mainnet tokens, switching when the active provider was slow or unreachable.

* Set up a **GitHub Actions** workflow for code signing and releases on macOS, Linux and Windows, removing the "untrusted source" warning on install.

* Published the app on **F-Droid** and the **Snapcraft** store, which tripled the number of new users.

* Redesigned the staking-rewards calculation on the **Node.js** backend for stability and speed; user engagement grew 4x afterwards.

* Fixed a **reverse tabnabbing** vulnerability across several Velas web projects.

* Built a new cross-platform wallet in **React Native Web** from scratch, including the architecture for managing tokens and assets.

* Made the first interaction with the Android wallet 3x faster by caching and optimizing wallet and account creation.

<!-- entry: omo-systems-smart-home -->
## **Team Leader**

### **OMO Systems | Remote | April 2021 - December 2021**

* Delivered the core mobile app for controlling smart-home **IoT** devices in the R&D department.

* Proposed a refactoring of the mobile app architecture that won 1st place at a local hackathon.

* Built an automated monthly payment flow with a payment gate in **React** that restricts features for unpaid users; company income grew 10x after launch.

* Fixed insecure face-recognition unlock on specific Android devices by patching in a native **Android biometrics** library.

* Led and mentored the development team: ran **code reviews**, set coding standards and onboarded new developers.

<!-- entry: thermo-fisher-dosimeter -->
## **Software Engineer**

### **Thermo Fisher Scientific | Remote | November 2020 - April 2021**

* Architected an **IoT healthcare** app from scratch using **React Native, TypeScript, Redux** and an offline-first **Realm** database, communicating with radiation dosimeters over Bluetooth.

* Rewrote legacy native libraries to use **MQTT over TLS** with client certificates on iOS and Android, making data transfer 30% faster.

* Improved the accuracy of **Bluetooth Low Energy (BLE)** communication with the dosimeter by reworking the buffer-reading logic.

* Built dosimeter firmware updates that run as cross-platform **background jobs** on Android and iOS.

* Implemented a secure login flow with **OAuth 2.0**, and local storage of dosimeter data in **Realm** with efficient filtering.

* Optimized rendering and offline data access in **Realm** as part of a team-wide **performance** effort that made the app 20% faster.

<!-- entry: itjet-fintech -->
## **Full-Stack Engineer**

### **Itjet | Kyiv, Ukraine (Hybrid) | August 2019 - November 2020**

* Built a reusable **React Native Web** signup flow shared by the native mobile and web apps of a fintech product (Forbes top 10), which made building new flows 3x faster.

* Integrated **A/B testing** so the marketing team could analyze user engagement.

* Doubled delivery speed by introducing **TypeScript**, building an **Atomic Design** component library (**design system**), and setting up **CI/CD** (Bitbucket Pipelines, AWS EC2/S3) with automated tests (**Puppeteer, Jest, Cucumber**).

* Doubled database performance by migrating **PostgreSQL** from EC2 to **AWS RDS** and optimizing slow SQL queries.

* Set up **PostgreSQL** schema migrations with **node-pg-migrate**.

* Built an automated monthly subscription flow with **Stripe**, **Node.js REST APIs**, **React** and **React Native**.

* Built web features with **Next.js** (server-side rendering) and **GraphQL**, and containerized services with **Docker**.

<!-- entry: admasters-ecommerce -->
## **Full-Stack Engineer and Team Leader**

### **The Admasters | Kyiv, Ukraine (Hybrid) | April 2019 - August 2019**

* Integrated **A/B testing** into e-commerce products to raise conversion rates.

* Led a team of 3 software engineers and introduced **Agile** processes.

* Developed e-commerce sites and landing pages with **Next.js** and server-side rendering (SSR) for SEO.

* Redesigned a legacy codebase to speed up feature deployment.

# **CONSULTING AND FREELANCE PROJECTS**

Part-time contract and consulting work, alongside full-time roles

<!-- entry: orion-mobile-clinical-ink -->
## **Senior React Native Engineer (Contract)**

### **Clinical Trials Patient App | Remote**

* Developed and maintained a patient-facing **clinical trial (eCOA)** mobile app built with **React Native, Expo and TypeScript**, and its native **Android (Java / Kotlin)** counterpart.

* Refactored the legacy documents library module from JavaScript to **TypeScript** and added ~1,000 lines of **Jest** and **React Native Testing Library** tests.

* Migrated the app to **react-native-safe-area-context** across all screens and enforced it with an **ESLint** rule, fixing layout overlaps on iOS and Android.

* Migrated the native Android app to **Android 14 (SDK 34)**: Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes, and **Jenkins** CI build fixes.

* Upgraded the **SQLCipher** encrypted database to meet Google Play requirements and rotated **SSL certificate pinning** for a backend certificate change.

* Resolved production crashes and patient-facing bugs by bisecting dependency versions and adding targeted logging, including login, PIN, task scheduling and document loading issues.

<!-- entry: designai-jira-plugin -->
## **Frontend Engineer (Contract)**

### **Generative AI Jira Plugin | Remote**

* Built an **Atlassian Jira Forge** app from scratch with **React, TypeScript** and **Node.js** resolvers that starts **generative AI** design generation from a Jira issue and creates a Jira subtask for the result.

* Built the design generation form with multiple inputs: design description, reference images with preview, PRD and user-flow uploads, website URL, **MCP (Model Context Protocol)** server URL and design-system selection, using a reusable file-upload component and form validation.

* Moved file handling to direct **Azure Blob Storage** uploads, working around Forge file-size limits and removing the plugin's dependency on the backend.

* Set up project tooling and quality gates: ESLint, pre-commit hooks, **SonarQube** and Atlassian design tokens.

<!-- entry: various-clients -->
## **Software Engineering Consultant**

### **Various Clients | Remote**

* Led scaling and optimization engagements for client teams, reducing operational costs by up to 50% by refactoring core apps, adding caching and adding unit tests.

* Conducted senior-level **technical interviews** for **React, React Native, JavaScript and TypeScript** roles for enterprise clients, assessing candidates' coding, architecture and problem-solving skills.

* Audited legacy **React Native** codebases to identify the critical parts that needed updating (outdated framework versions, deprecated native libraries, platform requirements) and prepared prioritized upgrade plans with **effort estimations**.

* Led **React Native** version upgrades and legacy library migrations for client mobile apps.

* Provided technical expertise for **presales**: solution proposals, effort estimations and answering technical questions in client calls.

* Acted as a JavaScript subject-matter expert for large enterprise clients: technical consulting and educational webinars.

# **EDUCATION**

<!-- generated:education -->
## **PhD Candidate, Computer Science (in progress)**

National University of Life and Environmental Sciences | Ukraine | 2023 - 2027 (expected)

## **Master of Computer Science**

National University of Life and Environmental Sciences | Ukraine | 2020 - 2022

* Honors Diploma (top 10% of graduates).

## **Bachelor of Computer Science**

National Aviation University | Ukraine | 2016 - 2020
<!-- /generated:education -->

# **SKILLS**

<!-- generated:skills -->
**Languages:** JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS

**Frontend:** React 19, React.js, Next.js, Server-side rendering (SSR), Micro-frontends, Schema-driven UI, Design systems, Web accessibility (WCAG), Web performance optimization, KendoReact, Storybook, CSS Modules, Styled Components, Atomic Design, Vite, Monorepo (npm workspaces)

**Mobile:** React Native, Expo, React Native Web, Android (Java, Kotlin, Gradle), Native Modules (iOS/Android), Realm (realm-js), SQLCipher, Keychain, Fastlane, Bitrise

**State and Data:** Redux (Redux Thunk, Redux Saga), MobX, Zustand, XState, TanStack Query, TanStack Router, RxJS, REST APIs, GraphQL, WebSockets

**Backend and Cloud:** Node.js, PostgreSQL, Amazon Web Services (AWS: EC2, S3, RDS), Microsoft Azure (Azure Blob Storage), Stripe, Docker

**Authentication and Security:** OAuth 2.0, OpenID Connect (OIDC), Zero-trust architecture, SSL certificate pinning, PII redaction

**Testing:** Vitest, Vitest Browser Mode, Playwright, Jest, React Testing Library, React Native Testing Library, Detox, Puppeteer, Cucumber, End-to-end (E2E) testing, Unit testing

**DevOps and Observability:** CI/CD, Azure DevOps, Azure Pipelines, GitHub Actions, Bitbucket Pipelines, Jenkins, Git, ESLint, Prettier, Husky, SonarQube, OpenTelemetry, Kibana, Bugsnag

**AI:** Generative AI integration, Model Context Protocol (MCP), AI coding agents, AI-assisted development

**Domain and SDKs:** ERP, Clinical trials (eCOA), HERE SDK (HNav, HNod, HERE API), IoT, Bluetooth Low Energy (BLE), MQTT, Blockchain, Web3.js, Atlassian Jira Forge

**Leadership and Methodologies:** Team leadership (up to 8 engineers), Mentoring, Code review, System design, Software architecture, Architecture decision records (ADR), Technology stack selection, Technical interviewing, Technical audits, Effort estimation, Presales, Agile, Specification-driven development (SDD), Figma, Jira
<!-- /generated:skills -->

# **LANGUAGES**

<!-- generated:languages -->
English: C1 (Advanced) | Ukrainian: Native
<!-- /generated:languages -->
