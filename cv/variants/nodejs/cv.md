<!-- generated:header -->
# **Kirill Kohan**

**Senior Full-Stack Engineer (TypeScript, Node.js, React)**

Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment | Working hours overlap with EU, UK and US time zones

+380 97 891 9783 | kiril.kohan@gmail.com | Portfolio: https://drive.google.com/file/d/1-BtpQknjSQ9bxTFAKm6v-r3DQR7IOX6s/view?usp=sharing
<!-- /generated:header -->

# **SUMMARY**

Senior full-stack engineer and tech lead with 7+ years of TypeScript and JavaScript experience building Node.js REST APIs on PostgreSQL and AWS for fitness and non-profit projects, plus Node.js backends for a blockchain wallet and a Jira Forge app, and React and React Native frontends. <!-- src: calc:years_experience, profile, itjet-fintech#1, itjet-fintech#4.6, itjet-fintech#4.4, itjet-fintech#4.14, velas-wallet#4.6, designai-jira-plugin#4.1 --> Built Node.js REST APIs for Stripe subscriptions, set up PostgreSQL schema migrations, moved PostgreSQL to AWS RDS with query tuning that doubled database performance, and redesigned a Node.js staking-rewards calculation. <!-- src: itjet-fintech#1, itjet-fintech#4.6, itjet-fintech#4.5, itjet-fintech#4.4, velas-wallet#4.6 --> Built core modules of a schema-driven React 19 and TypeScript runtime that renders 1,800+ enterprise resource planning (ERP) programs, working with the lead architect on platform and solution architecture in an architecture-governed, specification-driven development (SDD) process. <!-- src: syspro-saas-erp#4.1, syspro-architecture-scope, syspro-saas-erp#4.2 --> Also integrated OpenID Connect (OIDC) authentication and built OpenTelemetry instrumentation with personally identifiable information (PII) redaction. <!-- src: syspro-saas-erp#4.7, syspro-saas-erp#4.8 --> Led a team of 8 engineers on an automotive app, running code reviews, setting coding standards and owning its modular architecture. <!-- src: general-motors-navigation#4.1, general-motors-navigation#4.2, general-motors-navigation#4.4, calc:team_size_led -->

# **EXPERIENCE**

<!-- entry: syspro-saas-erp -->
## **Senior Software Engineer**

### **SYSPRO | Remote | December 2025 - Present**

* Built core modules of a schema-driven **React 19 / TypeScript** runtime for SYSPRO's **ERP software-as-a-service (SaaS)** modernization platform (25+ person program) that renders **1,800+ ERP programs** from data-model definitions, cutting screen delivery from days to hours without per-screen frontend code. <!-- src: syspro-saas-erp#4.1, syspro-team-size, syspro-speed -->

* Delivered the frontend through architecture-governed **specification-driven development (SDD)**, not ad-hoc AI code generation, and helped define it: specification templates, validation and rules for **AI agents** that implement and review code against the specifications across 4 repositories. <!-- src: syspro-saas-erp#4.2, syspro-architecture-scope -->

* Reviewed and co-authored **platform and solution architecture** documents with the lead architect and drove open questions to a decision; owned the **frontend technology stack**, recorded in an **architecture decision record (ADR)**, for the Login micro-frontend and schema-driven runtime, including OIDC libraries and **Vitest Browser Mode**. <!-- src: syspro-saas-erp#4.3, syspro-architecture-scope, syspro-tech-stack-ownership -->

* Maintained a **Node.js** mock backend, adding ERP smart-tag fixtures and view-management routes, so frontend features could be built and tested ahead of the real backend. <!-- src: syspro-saas-erp#4.11 -->

* Designed and built a browser telemetry module on **OpenTelemetry** from scratch that records app events and traces and removes personally identifiable information (**PII**) before sending them, plus a local **Node.js** receiver for inspecting traces. <!-- src: syspro-saas-erp#4.8 -->

* Integrated **OIDC** authentication into the **Login micro-frontend** and the host application using **oidc-client-ts** and **react-oidc-context** in a secure, independently released **micro-frontend architecture**. <!-- src: syspro-saas-erp#4.7 -->

* Stack: **React 19, TypeScript, Node.js, KendoReact, Zustand, XState, TanStack Router, TanStack Query, WebSockets, Vite, SCSS / CSS Modules, OpenTelemetry, Vitest, Playwright, Storybook, Docker, Azure DevOps**. <!-- src: syspro-saas-erp#5 -->

<!-- entry: general-motors-navigation -->
## **Team Leader**

### **General Motors | Remote | July 2023 - December 2025**

* Led the map team of 8 engineers (6 React Native, 1 iOS, 1 Android) for the General Motors vehicle companion app in **React Native**, working with stakeholders on scope and planning; after release, user engagement rose 20% and crashes fell 15%. <!-- src: general-motors-navigation#4.1 -->

* Ran **code reviews** and set coding standards for the team, mentoring engineers on architecture and testing. <!-- src: general-motors-navigation#4.2 -->

* Created and documented the delivery and testing process for the map feature across three nested apps, down to a **React Native** map provider app with native code and the **HERE SDK**. <!-- src: general-motors-navigation#4.9 -->

* Owned the **system design** of the modular app architecture, so product teams' new features were added without reworking existing modules. <!-- src: general-motors-navigation#4.4 -->

* Defined the unit-testing strategy that reached 95% coverage and introduced an **Agile** delivery process, which reduced production bugs. <!-- src: general-motors-navigation#4.5 -->

* At the client's request, moved a reusable feature app into the host app and planned moving its logic and components to the host's **clean architecture** and **domain-driven design** patterns. <!-- src: general-motors-navigation#4.10 -->
<!-- entry: velas-wallet -->
## **Technical Leader**

### **Velas | Remote | December 2021 - July 2023**

* Sped up **REST API** responses on the backend by removing unused fields and adding filters and pagination, and made the app smoother by removing unnecessary component re-renders. <!-- src: velas-wallet#4.10 -->

* Developed the Velas **blockchain** wallet for web, mobile and desktop using **Node.js, TypeScript, React, React Native, MobX and Web3.js**. <!-- src: velas-wallet#4.1 -->

* Set up **GitHub Actions** workflows to build and sign the desktop (macOS, Linux, Windows) and mobile wallets, removing the "untrusted source" warning on desktop install. <!-- src: velas-wallet#4.4 -->

* Cut staking page loading from 2 minutes to 5 seconds and made it use 5x less mobile battery by moving filtering to the server and adding a backup blockchain remote procedure call (RPC) connection. <!-- src: velas-wallet#4.2 -->

* Redesigned the staking-rewards calculation on the **Node.js** backend for stability and speed; user engagement grew 4x afterward. <!-- src: velas-wallet#4.6 -->

* Fixed a **reverse tabnabbing** vulnerability (tab hijacking) across several Velas web projects. <!-- src: velas-wallet#4.7 -->

<!-- entry: omo-systems-smart-home -->
## **Team Leader**

### **OMO Systems | Remote | April 2021 - December 2021**

* Built an automated monthly payment flow with a payment gate in **React** that restricts features for unpaid users; company income grew 10x after launch. <!-- src: omo-systems-smart-home#4.3 -->

* Proposed a refactoring of the mobile app architecture that won first place at a local hackathon. <!-- src: omo-systems-smart-home#4.2 -->

* Led and mentored a team of about 3 engineers: ran **code reviews**, set coding standards and onboarded new engineers. <!-- src: omo-systems-smart-home#4.5 -->

<!-- entry: thermo-fisher-dosimeter -->
## **Software Engineer**

### **Thermo Fisher Scientific | Remote | November 2020 - April 2021**

* Built an Internet of Things (**IoT**) healthcare app from scratch and designed its architecture with **React Native, TypeScript, Redux** and an offline-first **Realm** database, communicating with radiation dosimeters over Bluetooth. <!-- src: thermo-fisher-dosimeter#4.1 -->

* Implemented a secure **OAuth 2.0** login flow and local storage of dosimeter data with efficient filtering. <!-- src: thermo-fisher-dosimeter#4.5 -->

<!-- entry: itjet-fintech -->
## **Full-Stack Engineer**

### **Itjet | Kyiv, Ukraine (Hybrid) | August 2019 - November 2020**

* Implemented the automated monthly subscription flow for Fused with **Node.js REST APIs** (**Express**, **Sequelize**), **Stripe**, **React** and **React Native**, then moved all payment logic to the web app with card-removal endpoints. <!-- src: itjet-fintech#4.6, itjet-fintech#4.15 -->

* Built the Wink social app from scratch in **React Native** (Snapchat and phone sign-in, **push notifications**, continuous integration and delivery (**CI/CD**), image optimization on a **Node.js** backend); it reached more than 5 million registered users. <!-- src: itjet-fintech#4.8 -->

* Developed the RegiStart voter-registration minimum viable product (MVP) from sketches: a **React** and **Material UI** frontend, a **Node.js** backend with **Sequelize** and **PostgreSQL** on **AWS RDS**, **node-pg-migrate** migrations, and an algorithm that distributes students among organizers. <!-- src: itjet-fintech#4.14 -->

* Raised database performance 2x for Fused by migrating **PostgreSQL** from EC2 to **AWS RDS** and optimizing slow SQL queries. <!-- src: itjet-fintech#4.4 -->

* Doubled delivery speed for Aspiration by introducing **TypeScript** and an **Atomic Design** component library with automated tests (**Puppeteer, Jest, Cucumber**), and set up **CI/CD** for RegiStart (Bitbucket Pipelines, **AWS EC2 / S3**). <!-- src: itjet-fintech#4.3 -->

* Containerized Fused and RegiStart services with **Docker**, and built web features for Aspiration in **Next.js** with server-side rendering (SSR) and **GraphQL**. <!-- src: itjet-fintech#4.7 -->

<!-- entry: admasters-ecommerce -->
## **Full-Stack Engineer and Team Leader**

### **The Admasters | Kyiv, Ukraine (Hybrid) | April 2019 - August 2019**

* Led a team of 3 software engineers and introduced **Agile** processes. <!-- src: admasters-ecommerce#4.2 -->

* Redesigned a legacy codebase to speed up feature deployment. <!-- src: admasters-ecommerce#4.4 -->

# **CONSULTING AND FREELANCE PROJECTS**

Contract, consulting and project work

<!-- entry: navigation-poc -->
## **Senior Software Engineer**

### **HERE Technologies | Remote**

* Reworked the client integration of the **voice AI assistant** in **React** and **RxJS** for a car navigation proof of concept (PoC) built in HERE's R&D team, adding text input alongside voice, and presenting processing, completion and error states. <!-- src: navigation-poc#4.1, navigation-poc#1, navigation-poc#3 -->

* Implemented a passenger second-screen feature in **React** for Bentley, showing live trip data. <!-- src: navigation-poc#4.3 -->

* Built driver warning cards and extended their service contracts to the **Android** layer for confirming, rejecting and dismissing warnings. <!-- src: navigation-poc#4.2 -->

* Added route-progress markers with clustering and migrated assisted-driving status icons and notifications. <!-- src: navigation-poc#4.4 -->

* Added Daimler truck-parking details and search ratings to the demo UI, and refined a QR-code booking card. <!-- src: navigation-poc#4.6 -->

<!-- entry: navigation-statistics -->
## **Senior Software Engineer**

### **HERE Technologies | Remote**

* Propagated route-change reasons through the guidance flow of a **truck navigation app** in **TypeScript** and **RxJS**, covering dynamic routing, route restoration and parking approach. <!-- src: navigation-statistics#4.1, navigation-statistics#4.5 -->

* Separated developer diagnostics from core guidance services, updating **protobuf.js**-generated contracts and keeping older operations backward compatible. <!-- src: navigation-statistics#4.2, navigation-statistics#5 -->

* Adapted the **React** diagnostic display and developer menu to the new service boundaries. <!-- src: navigation-statistics#4.3 -->

<!-- entry: orion-mobile-clinical-ink -->
## **Senior React Native Engineer (Contract)**

### **Clinical Ink | Remote**

* Migrated the native Android app to **Android 14 (SDK 34)**: Gradle 8, Java 17, alarm and notification changes, and **Jenkins** build fixes. <!-- src: orion-mobile-clinical-ink#4.4 -->

* Upgraded the **SQLCipher** encrypted database to meet Google Play requirements and rotated **SSL certificate pinning** for a backend certificate change. <!-- src: orion-mobile-clinical-ink#4.5 -->
<!-- entry: designai-jira-plugin -->
## **Full-Stack Engineer (Contract)**

### **Generative AI Jira Plugin | Remote**

* Built an **Atlassian Jira Forge** app from scratch with **React**, **TypeScript** and **Node.js** resolvers (Forge UI Kit, then **Forge Custom UI**) that triggered **generative AI** design generation from a Jira issue and tracked the result in a subtask. <!-- src: designai-jira-plugin#4.1 -->

* Moved file handling to direct **Azure Blob Storage** uploads, removing the app's backend dependency and allowing larger images. <!-- src: designai-jira-plugin#4.3 -->

* Created the **Atlaskit** design generation form: description, reference images, product requirements document (PRD) and user-flow uploads, website URL, **Model Context Protocol (MCP)** server URL and design-system selection. <!-- src: designai-jira-plugin#4.2 -->

* Sent image data to Azure Blob Storage in chunks to work around Atlassian Forge's file upload limits. <!-- src: jira-blob-chunks -->
<!-- entry: various-clients -->
## **Software Engineering Consultant**

### **Various Clients | Remote**

* Conducted senior-level **technical interviews** for **React, React Native, JavaScript and TypeScript** roles at enterprise clients, using coding assignments and technical questions. <!-- src: consulting-interviews -->

* Led scaling and optimization work for client teams, cutting operational costs by up to 50% through refactoring, caching and unit tests. <!-- src: consulting-optimization -->

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

**Backend and Cloud:** Node.js, Express, Sequelize, PM2, Nginx, PostgreSQL, Amazon Web Services (AWS: EC2, S3, RDS, Amplify, AppSync, Cognito), Microsoft Azure (Azure Blob Storage), Stripe, Docker

**DevOps and Observability:** CI/CD, Azure DevOps, Azure Pipelines, GitHub Actions, Bitbucket Pipelines, Jenkins, Git, ESLint, Prettier, Husky, SonarQube, OpenTelemetry, Kibana, Bugsnag, Sentry

**Authentication and Security:** OAuth 2.0, OpenID Connect (OIDC), Zero-trust architecture, SSL certificate pinning, PII (personal data) redaction

**State and Data:** Redux (Redux Toolkit, Redux Thunk, Redux Saga, Redux Persist), MobX, Zustand, XState, TanStack Query, TanStack Router, RxJS, REST APIs, GraphQL, Apollo Client, WebSockets

**Testing:** Vitest, Vitest Browser Mode, Playwright, Jest, React Testing Library, React Native Testing Library, Detox, Puppeteer, Cucumber, End-to-end (E2E) testing, Unit testing

**AI:** Generative AI integration, Model Context Protocol (MCP), AI agent governance (SDD), AI-assisted development

**Frontend:** React 19, React.js, Next.js, Server-side rendering (SSR), Micro-frontends, Schema-driven UI, Design systems, Web accessibility (WCAG), Web performance optimization, KendoReact, Atlaskit (Atlassian Design System), Storybook, CSS Modules, Styled Components, Atomic Design, Vite, Monorepo (npm workspaces)

**Mobile:** React Native, Expo, React Native Web, Android (Java, Kotlin, Gradle), Native modules (iOS / Android), Realm (realm-js), MMKV, Push notifications (Firebase Cloud Messaging), SQLCipher, Keychain, Fastlane, Bitrise

**Leadership and Methodologies:** Team leadership (up to 8 engineers), Mentoring, Code review, System design, Software architecture, Architecture decision records (ADR), Technology stack selection, Technical interviewing, Technical audits, Effort estimation, Presales, Agile, Specification-driven development (SDD), Figma, Jira

**Domain and SDKs:** ERP, Clinical trials (electronic clinical outcome assessment, eCOA), HERE SDK (HNav, HNod, HERE API), IoT, Bluetooth Low Energy (BLE), react-native-ble-plx, MQTT, Blockchain, Web3.js, Atlassian Jira Forge (UI Kit, Custom UI)
<!-- /generated:skills -->

# **LANGUAGES**

<!-- generated:languages -->
English: C1 (Advanced) | Ukrainian: Native
<!-- /generated:languages -->
