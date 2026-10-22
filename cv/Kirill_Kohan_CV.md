<!-- generated:header -->
# **Kirill Kohan**

**Senior Software Engineer / Tech Lead (Frontend and Mobile)**

Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment | Working hours overlap with EU, UK and US time zones

+380 97 891 9783 | kiril.kohan@gmail.com | Portfolio: https://drive.google.com/file/d/1-BtpQknjSQ9bxTFAKm6v-r3DQR7IOX6s/view?usp=sharing
<!-- /generated:header -->

# **SUMMARY**

Senior software engineer and tech lead with 7+ years of experience building React, React Native, Node.js and TypeScript applications for enterprise resource planning (ERP) SaaS, automotive, healthcare and clinical trials, fintech and blockchain products. <!-- src: calc:years_experience, profile, syspro-saas-erp#1, general-motors-navigation#1, orion-mobile-clinical-ink#1, thermo-fisher-dosimeter#1, itjet-fintech#1, velas-wallet#1 --> Built core modules of a schema-driven React 19 runtime that renders 1,800+ ERP programs from data-model definitions. <!-- src: syspro-saas-erp#4.1 --> Led a team of 8 engineers delivering in-car navigation features for an automotive manufacturer on the HERE SDK. <!-- src: general-motors-navigation#4.1, general-motors-navigation#4.6, calc:team_size_led --> Experienced in micro-frontend architecture, OpenID Connect (OIDC), OpenTelemetry observability, test automation, native Android migrations and generative AI integrations, delivered through architecture-governed specification-driven development (SDD). <!-- src: syspro-saas-erp#4.2, syspro-saas-erp#4.6, syspro-saas-erp#4.7, syspro-saas-erp#4.8, syspro-saas-erp#4.9, orion-mobile-clinical-ink#4.4, designai-jira-plugin#4.1 -->

# **EXPERIENCE**

<!-- entry: syspro-saas-erp -->
## **Senior Software Engineer**

### **SYSPRO | Remote | December 2025 - Present**

* Delivered the frontend through architecture-governed **specification-driven development (SDD)**, not ad-hoc AI code generation, and helped define it: specification templates, validation and rules for **AI agents** that implement and review code against the specifications, with each subsystem traced from architecture to code across 4 repositories. <!-- src: syspro-saas-erp#4.2, syspro-architecture-scope -->

* Worked with the lead architect on the **platform and solution architecture**: reviewed and co-authored architecture documents and drove open questions to decisions. Owned the **frontend technology stack** for the Login micro-frontend and the schema-driven runtime, including OIDC libraries and the move to **Vitest Browser Mode**. <!-- src: syspro-saas-erp#4.3, syspro-architecture-scope, syspro-tech-stack-ownership -->

* Built core modules of a schema-driven **React 19 / TypeScript** runtime for SYSPRO's **ERP SaaS** modernization platform (25+ person program) that renders **1,800+ ERP programs** from data-model definitions, cutting screen delivery from days to hours, with no per-screen frontend code. <!-- src: syspro-saas-erp#4.1, syspro-team-size, syspro-speed -->

* Authored or maintained ~17 component specifications (view orchestration, navigation, configuration) and validated each against the architecture before and after implementation, with AI agents as reviewers flagging rule violations and specification-to-code drift for human decision. This reduced review cycles; deferred issues went to a **technical-debt register**. <!-- src: syspro-saas-erp#4.2, syspro-saas-erp#4.12, syspro-review-cycles -->

* Implemented the runtime's **KendoReact** rendering handlers (forms, date fields, search grids with filtering, configurable sorting and persisted filter state, smart-tag lookups, predictive search) and the view orchestration layer with **XState** and **Zustand** (view session lifecycle, navigation menu, context-aware related-program navigation, modal overlays). <!-- src: syspro-saas-erp#4.4, syspro-saas-erp#4.5 -->

* Built the **Login micro-frontend** from scratch (sign-in, forgot-password and reset-password flows, reusable form components, schema-based validation, accessible typography per **WCAG**, **Storybook**) and integrated **OpenID Connect (OIDC)** authentication into it and the host application using **oidc-client-ts** and **react-oidc-context** in a **zero-trust**, independently deployable **micro-frontend architecture**. <!-- src: syspro-saas-erp#4.6, syspro-saas-erp#4.7 -->

* Designed and built a browser telemetry module on **OpenTelemetry** from scratch: event bus, event taxonomy, payload contracts, an OpenTelemetry Protocol (OTLP) exporter and a redaction stage that strips sensitive data (PII) before export. <!-- src: syspro-saas-erp#4.8 -->

* Covered implementations with **Vitest** and **Vitest Browser Mode** (**Playwright** provider) tests, maintained a **Node.js** mock backend and the **monorepo** tooling (npm workspaces, ESLint, Prettier, small **Azure Pipelines** changes) and fixed schema-to-TypeScript **code generation** bugs, proposing improvements the lead agreed to add. <!-- src: syspro-saas-erp#4.9, syspro-saas-erp#4.10, syspro-saas-erp#4.11, syspro-codegen-fixes -->

* Stack: **React 19, TypeScript, KendoReact, Zustand, XState, TanStack Router, TanStack Query, WebSockets, Vite, SCSS / CSS Modules, OpenTelemetry, Vitest, Playwright, Storybook, Docker, Azure DevOps**. <!-- src: syspro-saas-erp#5 -->

<!-- entry: general-motors-navigation -->
## **Team Leader**

### **General Motors | Remote | July 2023 - November 2025**

* Led a team of 8 engineers delivering an automotive **React Native** app, working with stakeholders on scope and planning. After release, user engagement rose 20% and app crashes fell 15%. <!-- src: general-motors-navigation#4.1 -->

* Ran **code reviews** and set coding standards for the team, mentoring engineers on architecture and testing. <!-- src: general-motors-navigation#4.2 -->

* Led development of a reusable map library on the **HERE SDK**, packaged as a **React Native micro-frontend** and integrated into several company products. <!-- src: general-motors-navigation#4.3 -->

* Owned the **system design** of the app's modular architecture so that new feature requests from product teams could be added without reworking existing modules. <!-- src: general-motors-navigation#4.4 -->

* Defined the unit-testing strategy that reached 95% coverage and introduced an **Agile** delivery process, which reduced production bugs. <!-- src: general-motors-navigation#4.5 -->

* Implemented in-car navigation features with the **HERE HNav / HNod SDK**, including route-deviation handling and a redesigned search UI. <!-- src: general-motors-navigation#4.6 -->

* Built a proof of concept for in-car navigation combining search, routing, guidance and a **voice AI assistant** that builds routes and finds places from spoken requests. <!-- src: general-motors-navigation#4.7 -->

* Implemented a passenger second-screen feature for a luxury car brand. <!-- src: general-motors-navigation#4.8 -->

* Stack: **React Native, TypeScript, Node.js, Redux Saga, RxJS, Storybook, Detox** (E2E), **Fastlane, Bitrise** (CI/CD), **Bugsnag, Kibana** (monitoring), **Figma**. <!-- src: general-motors-navigation#5 -->

<!-- entry: velas-wallet -->
## **Technical Leader**

### **Velas | Remote | December 2021 - July 2023**

* Developed the Velas **blockchain** wallet for web, mobile and desktop using **React, React Native, Node.js, TypeScript, MobX and Web3.js**. <!-- src: velas-wallet#4.1 -->

* Made the staking list load 12x faster and use 5x less mobile battery by moving filtering to the server and adding a blockchain-node RPC fallback. <!-- src: velas-wallet#4.2 -->

* Added automatic **Web3 provider** failover for testnet and mainnet tokens, switching when the active provider was slow or unreachable. <!-- src: velas-wallet#4.3 -->

* Set up a **GitHub Actions** workflow for code signing and releases on macOS, Linux and Windows, removing the "untrusted source" warning on install. <!-- src: velas-wallet#4.4 -->

* Published the app on **F-Droid** and the **Snapcraft** store, which tripled the number of new users. <!-- src: velas-wallet#4.5 -->

* Redesigned the staking-rewards calculation on the **Node.js** backend for stability and speed; user engagement grew 4x afterward. <!-- src: velas-wallet#4.6 -->

* Fixed a **reverse tabnabbing** vulnerability across several Velas web projects. <!-- src: velas-wallet#4.7 -->

* Built a new cross-platform wallet in **React Native Web** from scratch, including the architecture for managing tokens and assets. <!-- src: velas-wallet#4.8 -->

* Made the first interaction with the Android wallet 3x faster by caching and optimizing wallet and account creation. <!-- src: velas-wallet#4.9 -->

<!-- entry: omo-systems-smart-home -->
## **Team Leader**

### **OMO Systems | Remote | April 2021 - December 2021**

* Delivered the R&D department's core **React Native** app for controlling smart-home **IoT** devices. <!-- src: omo-systems-smart-home#4.1 -->

* Proposed a refactoring of the mobile app architecture that won first place at a local hackathon. <!-- src: omo-systems-smart-home#4.2 -->

* Built an automated monthly payment flow with a payment gate in **React** that restricts features for unpaid users; company income grew 10x after launch. <!-- src: omo-systems-smart-home#4.3 -->

* Fixed insecure face-recognition unlock on specific Android devices by patching in a native **Android biometrics** library. <!-- src: omo-systems-smart-home#4.4 -->

* Led and mentored a team of about 3 engineers: ran **code reviews**, set coding standards and onboarded new engineers. <!-- src: omo-systems-smart-home#4.5 -->

<!-- entry: thermo-fisher-dosimeter -->
## **Software Engineer**

### **Thermo Fisher Scientific | Remote | November 2020 - April 2021**

* Architected an **IoT healthcare** app from scratch using **React Native, TypeScript, Redux** and an offline-first **Realm** database, communicating with radiation dosimeters over Bluetooth. <!-- src: thermo-fisher-dosimeter#4.1 -->

* Rewrote legacy native libraries to use **MQTT over TLS** with client certificates on iOS and Android, making data transfer 30% faster. <!-- src: thermo-fisher-dosimeter#4.2 -->

* Improved the accuracy of **Bluetooth Low Energy (BLE)** communication with the dosimeter (**react-native-ble-plx**) by reworking the buffer-reading logic. <!-- src: thermo-fisher-dosimeter#4.3 -->

* Built dosimeter firmware updates that run as cross-platform **background jobs** on Android and iOS. <!-- src: thermo-fisher-dosimeter#4.4 -->

* Implemented a secure **OAuth 2.0** login flow and local storage of dosimeter data with efficient filtering. <!-- src: thermo-fisher-dosimeter#4.5 -->

* Optimized rendering and offline data access in **Realm** as part of a team-wide **performance** effort that made the app 20% faster. <!-- src: thermo-fisher-dosimeter#4.6 -->

<!-- entry: itjet-fintech -->
## **Full-Stack Engineer**

### **Itjet | Kyiv, Ukraine (Hybrid) | August 2019 - November 2020**

* Built a reusable **React Native Web** signup flow shared by the native mobile and web apps of a fintech product (Forbes top 10), which made building new flows 3x faster. <!-- src: itjet-fintech#4.1 -->

* Integrated **A/B testing** so the marketing team could analyze user engagement. <!-- src: itjet-fintech#4.2 -->

* Doubled delivery speed by introducing **TypeScript**, building an **Atomic Design** component library (**design system**) and setting up **CI/CD** (Bitbucket Pipelines, AWS EC2 / S3) with automated tests (**Puppeteer, Jest, Cucumber**). <!-- src: itjet-fintech#4.3 -->

* Doubled database performance by migrating **PostgreSQL** from EC2 to **AWS RDS** and optimizing slow SQL queries. <!-- src: itjet-fintech#4.4 -->

* Set up **PostgreSQL** schema migrations with **node-pg-migrate**. <!-- src: itjet-fintech#4.5 -->

* Built an automated monthly subscription flow with **Stripe**, **Node.js REST APIs** (**Express**, **Sequelize**), **React** and **React Native**. <!-- src: itjet-fintech#4.6 -->

* Built web features with **Next.js** with server-side rendering (SSR) and **GraphQL**, and containerized services with **Docker**. <!-- src: itjet-fintech#4.7 -->

<!-- entry: admasters-ecommerce -->
## **Full-Stack Engineer and Team Leader**

### **The Admasters | Kyiv, Ukraine (Hybrid) | April 2019 - August 2019**

* Added **A/B testing** to e-commerce products to raise conversion rates. <!-- src: admasters-ecommerce#4.1 -->

* Led a team of 3 software engineers and introduced **Agile** processes. <!-- src: admasters-ecommerce#4.2 -->

* Developed e-commerce sites and landing pages with **Next.js** and server-side rendering (SSR) for SEO. <!-- src: admasters-ecommerce#4.3 -->

* Redesigned a legacy codebase to speed up feature deployment. <!-- src: admasters-ecommerce#4.4 -->

# **CONSULTING AND FREELANCE PROJECTS**

Part-time contract and consulting work, alongside full-time roles

<!-- entry: orion-mobile-clinical-ink -->
## **Senior React Native Engineer (Contract)**

### **Clinical Trials Patient App | Remote**

* Developed and maintained a patient-facing **clinical trial** mobile app for electronic clinical outcome assessment (**eCOA**) built with **React Native, Expo and TypeScript**, and its native **Android (Java / Kotlin)** counterpart. <!-- src: orion-mobile-clinical-ink#4.1 -->

* Refactored the legacy documents library screen from JavaScript into small **TypeScript** components to speed up the app, and added ~1,000 lines of **Jest** and **React Native Testing Library** tests. <!-- src: orion-mobile-clinical-ink#4.2 -->

* Migrated the app to **react-native-safe-area-context** across all screens and enforced it with an **ESLint** rule, fixing layout overlaps on iOS and Android. <!-- src: orion-mobile-clinical-ink#4.3 -->

* Worked with the team on upgrading the app to **React Native 0.76** and **Expo SDK 52** to improve app performance. <!-- src: orion-mobile-clinical-ink#4.7 -->

* Migrated the native Android app to **Android 14 (SDK 34)**: Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes, and **Jenkins** CI build fixes. <!-- src: orion-mobile-clinical-ink#4.4 -->

* Upgraded the **SQLCipher** encrypted database to meet Google Play requirements and rotated **SSL certificate pinning** for a backend certificate change. <!-- src: orion-mobile-clinical-ink#4.5 -->

* Investigated production crashes and fixed patient-facing bugs (login, PIN, task scheduling, document loading) by bisecting dependency versions and adding targeted logging. <!-- src: orion-mobile-clinical-ink#4.6 -->

* Stack: **React Native, Expo, TypeScript, Apollo Client, GraphQL, AWS Amplify, AppSync, Cognito, Redux Toolkit, Redux Saga, Realm, MMKV, Firebase Cloud Messaging, Sentry, Jest**. <!-- src: orion-mobile-clinical-ink#5 -->

<!-- entry: designai-jira-plugin -->
## **Frontend Engineer (Contract)**

### **Generative AI Jira Plugin | Remote**

* Built an **Atlassian Jira Forge** app from scratch with **React, TypeScript** and **Node.js** resolvers, starting with Forge UI Kit and moving to **Forge Custom UI**. The app starts **generative AI** design creation from a Jira issue and adds a Jira subtask for the result. <!-- src: designai-jira-plugin#4.1 -->

* Built the design generation form with multiple inputs: design description, reference images with preview, product requirements document (PRD) and user-flow uploads, website URL, **MCP (Model Context Protocol)** server URL and design-system selection, using **Atlaskit** components, a reusable file-upload component and form validation. <!-- src: designai-jira-plugin#4.2 -->

* Moved file handling to direct **Azure Blob Storage** uploads, working around Forge file-size limits and removing the plugin's dependency on the backend. <!-- src: designai-jira-plugin#4.3 -->

* Added ESLint, TypeScript and a pre-commit lint hook, enabled Atlassian design tokens, and fixed a **SonarQube** TypeScript error. <!-- src: designai-jira-plugin#4.4 -->

<!-- entry: various-clients -->
## **Software Engineering Consultant**

### **Various Clients | Remote**

* Led scaling and optimization engagements for client teams, reducing operational costs by up to 50% through refactoring core apps, adding caching and writing unit tests. <!-- src: consulting-optimization -->

* Conducted senior-level **technical interviews** for **React, React Native, JavaScript and TypeScript** roles for enterprise clients, with technical questions and coding assignments. <!-- src: consulting-interviews -->

* Audited legacy **React Native** codebases to identify the critical parts that needed updating (outdated framework versions, deprecated native libraries, platform requirements) and prepared prioritized upgrade plans with **effort estimates**. <!-- src: consulting-audits -->

* Led **React Native** version upgrades and legacy library migrations for client mobile apps. <!-- src: consulting-rn-upgrades -->

* Provided technical expertise for **presales**: solution proposals, effort estimates and answering technical questions in client calls. <!-- src: consulting-presales -->

* Acted as a JavaScript subject-matter expert for large enterprise clients: technical consulting and educational webinars. <!-- src: consulting-sme -->

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

**Frontend:** React 19, React.js, Next.js, Server-side rendering (SSR), Micro-frontends, Schema-driven UI, Design systems, Web accessibility (WCAG), Web performance optimization, KendoReact, Atlaskit (Atlassian Design System), Storybook, CSS Modules, Styled Components, Atomic Design, Vite, Monorepo (npm workspaces)

**Mobile:** React Native, Expo, React Native Web, Android (Java, Kotlin, Gradle), Native modules (iOS / Android), Realm (realm-js), MMKV, Push notifications (Firebase Cloud Messaging), SQLCipher, Keychain, Fastlane, Bitrise

**State and Data:** Redux (Redux Toolkit, Redux Thunk, Redux Saga, Redux Persist), MobX, Zustand, XState, TanStack Query, TanStack Router, RxJS, REST APIs, GraphQL, Apollo Client, WebSockets

**Backend and Cloud:** Node.js, Express, Sequelize, PM2, Nginx, PostgreSQL, Amazon Web Services (AWS: EC2, S3, RDS, Amplify, AppSync, Cognito), Microsoft Azure (Azure Blob Storage), Stripe, Docker

**Authentication and Security:** OAuth 2.0, OpenID Connect (OIDC), Zero-trust architecture, SSL certificate pinning, PII redaction

**Testing:** Vitest, Vitest Browser Mode, Playwright, Jest, React Testing Library, React Native Testing Library, Detox, Puppeteer, Cucumber, End-to-end (E2E) testing, Unit testing

**DevOps and Observability:** CI/CD, Azure DevOps, Azure Pipelines, GitHub Actions, Bitbucket Pipelines, Jenkins, Git, ESLint, Prettier, Husky, SonarQube, OpenTelemetry, Kibana, Bugsnag, Sentry

**AI:** Generative AI integration, Model Context Protocol (MCP), AI agent governance (SDD), AI-assisted development

**Domain and SDKs:** ERP, Clinical trials (eCOA), HERE SDK (HNav, HNod, HERE API), IoT, Bluetooth Low Energy (BLE), react-native-ble-plx, MQTT, Blockchain, Web3.js, Atlassian Jira Forge (UI Kit, Custom UI)

**Leadership and Methodologies:** Team leadership (up to 8 engineers), Mentoring, Code review, System design, Software architecture, Architecture decision records (ADR), Technology stack selection, Technical interviewing, Technical audits, Effort estimation, Presales, Agile, Specification-driven development (SDD), Figma, Jira
<!-- /generated:skills -->

# **LANGUAGES**

<!-- generated:languages -->
English: C1 (Advanced) | Ukrainian: Native
<!-- /generated:languages -->
