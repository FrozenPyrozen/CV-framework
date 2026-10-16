<!-- generated:header -->
# **Kirill Kohan**

**Senior Full-Stack Engineer (TypeScript, Node.js, React)**

Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment | Working hours overlap with EU, UK and US time zones

+380 97 891 9783 | kiril.kohan@gmail.com | Portfolio: https://drive.google.com/file/d/1-BtpQknjSQ9bxTFAKm6v-r3DQR7IOX6s/view?usp=sharing
<!-- /generated:header -->

# **SUMMARY**

Senior software engineer and tech lead with 7+ years of experience building TypeScript and JavaScript products, mostly React and React Native frontends, with hands-on Node.js backend work in fintech, blockchain and Jira integration projects. <!-- src: calc:years_experience, profile, itjet-fintech#4.6, velas-wallet#4.6, designai-jira-plugin#4.1 --> At Itjet, built Node.js REST APIs for a Stripe subscription flow, set up PostgreSQL schema migrations and moved PostgreSQL to AWS RDS, doubling database performance; at Velas, redesigned a Node.js staking-rewards calculation. <!-- src: itjet-fintech#4.6, itjet-fintech#4.5, itjet-fintech#4.4, velas-wallet#4.6 --> At SYSPRO, builds a schema-driven React 19 and TypeScript runtime that renders 1,800+ ERP programs, working with the lead architect on platform and solution architecture in an architecture-governed, specification-driven development (SDD) process. <!-- src: syspro-saas-erp#4.1, syspro-architecture-scope, syspro-saas-erp#4.2 --> The work there also covers OpenID Connect (OIDC) authentication, OpenTelemetry browser telemetry with PII redaction, and a Node.js mock backend. <!-- src: syspro-saas-erp#4.7, syspro-saas-erp#4.8, syspro-saas-erp#4.11 --> Previously led a team of 8 developers at General Motors, running code reviews, setting coding standards and owning the app's modular architecture. <!-- src: general-motors-navigation#4.1, general-motors-navigation#4.2, general-motors-navigation#4.4, calc:team_size_led -->

# **EXPERIENCE**

<!-- entry: syspro-saas-erp -->
## **Senior Software Engineer**

### **SYSPRO | Remote | December 2025 - Present**

* Delivered the frontend through an architecture-governed **specification-driven development (SDD)** process, not ad-hoc AI code generation, and helped define it: specification templates, the validation routine and rules for **AI coding agents**. Every subsystem was traced from architecture through component specification to implementation across 4 repositories. <!-- src: syspro-saas-erp#4.2, syspro-architecture-scope -->

* Worked with the lead architect on the **platform and solution architecture**: reviewed and co-authored architecture documents, drove open architecture questions and blockers to decisions, and authored the **frontend technology-stack decision record** (choice of OIDC libraries, move from React Testing Library to **Vitest Browser Mode**). <!-- src: syspro-saas-erp#4.3, syspro-architecture-scope -->

* Built core modules of a schema-driven **React 19 / TypeScript** runtime for SYSPRO's **ERP SaaS** modernization platform (25+ person program) that renders **1,800+ ERP programs** from data-model definitions, cutting screen delivery from days to hours, with no per-screen frontend code. <!-- src: syspro-saas-erp#4.1, syspro-team-size, syspro-speed -->

* Maintained a **Node.js** mock backend, adding ERP smart-tag fixtures and view-management routes, so frontend features could be built and tested ahead of the real backend. <!-- src: syspro-saas-erp#4.11 -->

* Designed and built a browser telemetry module on **OpenTelemetry** from scratch: event bus, event taxonomy, payload contracts, OTLP exporter, a redaction stage that strips sensitive data (PII) before export, and a local **Node.js** OTLP receiver for inspecting exported traces. <!-- src: syspro-saas-erp#4.8 -->

* Integrated **OpenID Connect (OIDC)** authentication into the host and admin applications using **oidc-client-ts** and **react-oidc-context** in a **zero-trust**, independently deployable **micro-frontend architecture**, with a **Login micro-frontend** built from scratch as the only app that handles passwords. <!-- src: syspro-saas-erp#4.7, syspro-saas-erp#4.6 -->

* Stack: **React 19, TypeScript, Node.js, KendoReact, Zustand, XState, TanStack Router, TanStack Query, Vite, SCSS / CSS Modules, OpenTelemetry, Vitest, Playwright, Storybook, Docker, Azure DevOps**. <!-- src: syspro-saas-erp#5 -->

<!-- entry: general-motors-navigation -->
## **Team Leader**

### **General Motors | Remote | July 2023 - November 2025**

* Led a team of 8 developers delivering an automotive **React Native** app, working with stakeholders on scope and planning. After release, user engagement rose 20% and app crashes fell 15%. <!-- src: general-motors-navigation#4.1 -->

* Ran **code reviews** and set coding standards for the team, mentoring developers on architecture and testing. <!-- src: general-motors-navigation#4.2 -->

* Owned the **system design** of the app's modular architecture so that new feature requests from product teams could be added without reworking existing modules. <!-- src: general-motors-navigation#4.4 -->

* Defined the unit-testing strategy that reached 95% coverage and introduced an **Agile** delivery process, which reduced production bugs. <!-- src: general-motors-navigation#4.5 -->

<!-- entry: velas-wallet -->
## **Technical Leader**

### **Velas | Remote | December 2021 - July 2023**

* Developed the Velas **blockchain** wallet for web, mobile and desktop using **Node.js, TypeScript, React, React Native, MobX and Web3.js**. <!-- src: velas-wallet#4.1 -->

* Set up a **GitHub Actions** workflow for code signing and releases on macOS, Linux and Windows, removing the "untrusted source" warning on install. <!-- src: velas-wallet#4.4 -->

* Made the staking list load 12x faster and use 5x less mobile battery by moving filtering to the server and adding a Node RPC fallback. <!-- src: velas-wallet#4.2 -->

* Redesigned the staking-rewards calculation on the **Node.js** backend for stability and speed; user engagement grew 4x afterwards. <!-- src: velas-wallet#4.6 -->

* Fixed a **reverse tabnabbing** vulnerability across several Velas web projects. <!-- src: velas-wallet#4.7 -->

* Built a new cross-platform wallet in **React Native Web** from scratch, including the architecture for managing tokens and assets. <!-- src: velas-wallet#4.8 -->

<!-- entry: omo-systems-smart-home -->
## **Team Leader**

### **OMO Systems | Remote | April 2021 - December 2021**

* Built an automated monthly payment flow with a payment gate in **React** that restricts features for unpaid users; company income grew 10x after launch. <!-- src: omo-systems-smart-home#4.3 -->

* Proposed a refactoring of the mobile app architecture that won 1st place at a local hackathon. <!-- src: omo-systems-smart-home#4.2 -->

* Led and mentored the development team: ran **code reviews**, set coding standards and onboarded new developers. <!-- src: omo-systems-smart-home#4.5 -->

<!-- entry: thermo-fisher-dosimeter -->
## **Software Engineer**

### **Thermo Fisher Scientific | Remote | November 2020 - April 2021**

* Architected an **IoT healthcare** app from scratch using **React Native, TypeScript, Redux** and an offline-first **Realm** database, communicating with radiation dosimeters over Bluetooth. <!-- src: thermo-fisher-dosimeter#4.1 -->

* Implemented a secure login flow with **OAuth 2.0**, and local storage of dosimeter data in **Realm** with efficient filtering. <!-- src: thermo-fisher-dosimeter#4.5 -->

<!-- entry: itjet-fintech -->
## **Full-Stack Engineer**

### **Itjet | Kyiv, Ukraine (Hybrid) | August 2019 - November 2020**

* Built an automated monthly subscription flow with **Node.js REST APIs**, **Stripe**, **React** and **React Native**. <!-- src: itjet-fintech#4.6 -->

* Doubled database performance by migrating **PostgreSQL** from EC2 to **AWS RDS** and optimizing slow SQL queries. <!-- src: itjet-fintech#4.4 -->

* Set up **PostgreSQL** schema migrations with **node-pg-migrate**. <!-- src: itjet-fintech#4.5 -->

* Doubled delivery speed by introducing **TypeScript** and an **Atomic Design** component library, and setting up **CI/CD** (Bitbucket Pipelines, **AWS EC2/S3**) with automated tests (**Puppeteer, Jest, Cucumber**). <!-- src: itjet-fintech#4.3 -->

* Containerized services with **Docker**, used **GraphQL**, and built web features with **Next.js** and server-side rendering (SSR). <!-- src: itjet-fintech#4.7 -->

<!-- entry: admasters-ecommerce -->
## **Full-Stack Engineer and Team Leader**

### **The Admasters | Kyiv, Ukraine (Hybrid) | April 2019 - August 2019**

* Led a team of 3 software engineers and introduced **Agile** processes. <!-- src: admasters-ecommerce#4.2 -->

* Redesigned a legacy codebase to speed up feature deployment. <!-- src: admasters-ecommerce#4.4 -->

# **CONSULTING AND FREELANCE PROJECTS**

Part-time contract and consulting work, alongside full-time roles

<!-- entry: orion-mobile-clinical-ink -->
## **Senior React Native Engineer (Contract)**

### **Clinical Trials Patient App | Remote**

* Migrated the native Android app to **Android 14 (SDK 34)**: Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes, and **Jenkins** CI build fixes. <!-- src: orion-mobile-clinical-ink#4.4 -->

* Upgraded the **SQLCipher** encrypted database to meet Google Play requirements and rotated **SSL certificate pinning** for a backend certificate change. <!-- src: orion-mobile-clinical-ink#4.5 -->

* Developed and maintained a patient-facing **clinical trial (eCOA)** mobile app built with **React Native, Expo and TypeScript**, and its native **Android (Java / Kotlin)** counterpart. <!-- src: orion-mobile-clinical-ink#4.1 -->

* Refactored the legacy documents library module from JavaScript to **TypeScript** and added ~1,000 lines of **Jest** and **React Native Testing Library** tests. <!-- src: orion-mobile-clinical-ink#4.2 -->

<!-- entry: designai-jira-plugin -->
## **Frontend Engineer (Contract)**

### **Generative AI Jira Plugin | Remote**

* Built an **Atlassian Jira Forge** app from scratch with **Node.js** resolvers in **TypeScript** and a **React** UI that starts **generative AI** design generation from a Jira issue and creates a Jira subtask for the result. <!-- src: designai-jira-plugin#4.1 -->

* Built the design generation form with multiple inputs: design description, reference images with preview, PRD and user-flow uploads, website URL, **MCP (Model Context Protocol)** server URL and design-system selection, using a reusable file-upload component and form validation. <!-- src: designai-jira-plugin#4.2 -->

* Moved file handling to direct **Azure Blob Storage** uploads, working around Forge file-size limits and removing the plugin's dependency on the backend. <!-- src: designai-jira-plugin#4.3 -->

<!-- entry: various-clients -->
## **Software Engineering Consultant**

### **Various Clients | Remote**

* Conducted senior-level **technical interviews** for **React, React Native, JavaScript and TypeScript** roles for enterprise clients, assessing candidates' coding, architecture and problem-solving skills. <!-- src: consulting-interviews -->

* Led scaling and optimization engagements for client teams, reducing operational costs by up to 50% by refactoring core apps, adding caching and adding unit tests. <!-- src: consulting-optimization -->

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

**Backend and Cloud:** Node.js, PostgreSQL, Amazon Web Services (AWS: EC2, S3, RDS), Microsoft Azure (Azure Blob Storage), Stripe, Docker

**DevOps and Observability:** CI/CD, Azure DevOps, Azure Pipelines, GitHub Actions, Bitbucket Pipelines, Jenkins, Git, ESLint, Prettier, Husky, SonarQube, OpenTelemetry, Kibana, Bugsnag

**Authentication and Security:** OAuth 2.0, OpenID Connect (OIDC), Zero-trust architecture, SSL certificate pinning, PII redaction

**State and Data:** Redux (Redux Thunk, Redux Saga), MobX, Zustand, XState, TanStack Query, TanStack Router, RxJS, REST APIs, GraphQL, WebSockets

**Testing:** Vitest, Vitest Browser Mode, Playwright, Jest, React Testing Library, React Native Testing Library, Detox, Puppeteer, Cucumber, End-to-end (E2E) testing, Unit testing

**AI:** Generative AI integration, Model Context Protocol (MCP), AI coding agents, AI-assisted development

**Frontend:** React 19, React.js, Next.js, Server-side rendering (SSR), Micro-frontends, Schema-driven UI, Design systems, Web accessibility (WCAG), Web performance optimization, KendoReact, Storybook, CSS Modules, Styled Components, Atomic Design, Vite, Monorepo (npm workspaces)

**Mobile:** React Native, Expo, React Native Web, Android (Java, Kotlin, Gradle), Native Modules (iOS/Android), Realm (realm-js), SQLCipher, Keychain, Fastlane, Bitrise

**Leadership and Methodologies:** Team leadership (up to 8 engineers), Mentoring, Code review, System design, Software architecture, Architecture decision records (ADR), Technology stack selection, Technical interviewing, Technical audits, Effort estimation, Presales, Agile, Specification-driven development (SDD), Figma, Jira

**Domain and SDKs:** ERP, Clinical trials (eCOA), HERE SDK (HNav, HNod, HERE API), IoT, Bluetooth Low Energy (BLE), MQTT, Blockchain, Web3.js, Atlassian Jira Forge
<!-- /generated:skills -->

# **LANGUAGES**

<!-- generated:languages -->
English: C1 (Advanced) | Ukrainian: Native
<!-- /generated:languages -->
