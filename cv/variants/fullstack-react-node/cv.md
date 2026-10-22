<!-- generated:header -->
# **Kirill Kohan**

**Senior Full-Stack Engineer (React / Node.js)**

Kyiv, Ukraine (Remote) | Open to B2B contract or full-time employment | Working hours overlap with EU, UK and US time zones

+380 97 891 9783 | kiril.kohan@gmail.com | Portfolio: https://drive.google.com/file/d/1-BtpQknjSQ9bxTFAKm6v-r3DQR7IOX6s/view?usp=sharing
<!-- /generated:header -->

# **SUMMARY**

Senior software engineer and tech lead with 7+ years of experience building **React**, **TypeScript** and **Node.js** applications for enterprise resource planning (ERP) SaaS, fintech, blockchain, automotive and healthcare products. <!-- src: calc:years_experience, profile, syspro-saas-erp#1, itjet-fintech#1, velas-wallet#1, general-motors-navigation#1, thermo-fisher-dosimeter#1 --> Built core modules of a schema-driven React 19 runtime that renders 1,800+ ERP programs from data-model definitions, inside a micro-frontend architecture with OpenID Connect (OIDC) authentication. <!-- src: syspro-saas-erp#4.1, syspro-saas-erp#4.6, syspro-saas-erp#4.7 --> Full-stack work at a fintech company and on a blockchain wallet covered Node.js REST APIs with Stripe subscriptions, PostgreSQL on AWS RDS, Next.js with GraphQL, Docker and Node.js backend logic. <!-- src: itjet-fintech#4.6, itjet-fintech#4.4, itjet-fintech#4.7, velas-wallet#4.2, velas-wallet#4.6 --> Worked with the lead architect on platform and solution architecture and delivered through an architecture-governed specification-driven development (SDD) process, with AI agents implementing and reviewing code against the specifications under human review. <!-- src: syspro-architecture-scope, syspro-saas-erp#4.2, syspro-saas-erp#4.3 --> Led a team of 8 engineers on an automotive app, running code reviews, setting coding standards and owning the system design of a modular app architecture. <!-- src: calc:team_size_led, general-motors-navigation#4.1, general-motors-navigation#4.2, general-motors-navigation#4.4 -->

# **EXPERIENCE**

<!-- entry: syspro-saas-erp -->
## **Senior Software Engineer**

### **SYSPRO | Remote | December 2025 - Present**

* Delivered the frontend through architecture-governed **specification-driven development (SDD)**, not ad-hoc AI code generation, and helped define it: specification templates, validation and rules for **AI agents** that implement and review code against the specifications, with each subsystem traced from architecture to code across 4 repositories. <!-- src: syspro-saas-erp#4.2, syspro-architecture-scope -->

* Worked with the lead architect on the **platform and solution architecture**: reviewed and co-authored architecture documents and drove open questions to decisions. Owned the **frontend technology stack** for the Login micro-frontend and the schema-driven runtime, including OIDC libraries and the move to **Vitest Browser Mode**. <!-- src: syspro-saas-erp#4.3, syspro-architecture-scope, syspro-tech-stack-ownership -->

* Built core modules of a schema-driven **React 19 / TypeScript** runtime for SYSPRO's **ERP SaaS** modernization platform (25+ person program) that renders **1,800+ ERP programs** from data-model definitions, cutting screen delivery from days to hours, with no per-screen frontend code. <!-- src: syspro-saas-erp#4.1, syspro-team-size, syspro-speed -->

* Implemented the runtime's view orchestration layer with **XState** state machines and a **Zustand** global store: view session lifecycle, communication with backend services, main navigation, context-aware related-program navigation and modal overlays that keep the underlying view's state. <!-- src: syspro-saas-erp#4.5 -->

* Integrated **OpenID Connect (OIDC)** authentication into the Login micro-frontend and the host application using **oidc-client-ts** and **react-oidc-context**, in a **zero-trust**, independently deployable **micro-frontend architecture** where only the identity app sees credentials. <!-- src: syspro-saas-erp#4.7, syspro-saas-erp#1 -->

* Built the **Login micro-frontend** from scratch with **Vite** and **TanStack Router**: sign-in, forgot-password and reset-password flows, reusable form components, schema-based validation, accessible typography per **WCAG** and **Storybook** stories. <!-- src: syspro-saas-erp#4.6 -->

* Stack: **React 19, TypeScript, KendoReact, Zustand, XState, TanStack Router, TanStack Query, WebSockets, Vite, SCSS / CSS Modules, OpenTelemetry, Vitest, Playwright, Storybook, Docker, Azure DevOps**. <!-- src: syspro-saas-erp#5 -->

<!-- entry: general-motors-navigation -->
## **Team Leader**

### **General Motors | Remote | July 2023 - November 2025**

* Led the map team of 8 engineers (6 React Native, 1 iOS, 1 Android) for the General Motors vehicle companion app, built in **React Native**, working with stakeholders on scope and planning. After release, user engagement rose 20% and app crashes fell 15%. <!-- src: general-motors-navigation#4.1 -->

* Ran **code reviews** and set coding standards for the team, mentoring engineers on architecture and testing. <!-- src: general-motors-navigation#4.2 -->

* Owned the **system design** of the app's modular architecture so that new feature requests from product teams could be added without reworking existing modules. <!-- src: general-motors-navigation#4.4 -->

* Led development of a reusable map library, packaged as a **React Native micro-frontend** and integrated into several company products. <!-- src: general-motors-navigation#4.3 -->

* Defined the unit-testing strategy that reached 95% coverage and introduced an **Agile** delivery process, which reduced production bugs. <!-- src: general-motors-navigation#4.5 -->

<!-- entry: velas-wallet -->
## **Technical Leader**

### **Velas | Remote | December 2021 - July 2023**

* Developed the Velas **blockchain** wallet for web, mobile and desktop using **React, React Native, Node.js, TypeScript, MobX and Web3.js**. <!-- src: velas-wallet#4.1 -->

* Cut staking list loading from 2 minutes to 5 seconds and made it use 5x less mobile battery by moving filtering to the server and adding a blockchain-node RPC fallback. <!-- src: velas-wallet#4.2 -->

* Redesigned the staking-rewards calculation on the **Node.js** backend for stability and speed; user engagement grew 4x afterward. <!-- src: velas-wallet#4.6 -->

* Built a new cross-platform wallet in **React Native Web** from scratch, including the architecture for managing tokens and assets. <!-- src: velas-wallet#4.8 -->

* Set up **GitHub Actions** workflows to build and sign the desktop (macOS, Linux, Windows) and mobile wallets, removing the "untrusted source" warning on desktop install. <!-- src: velas-wallet#4.4 -->

<!-- entry: omo-systems-smart-home -->
## **Team Leader**

### **OMO Systems | Remote | April 2021 - December 2021**

* Built an automated monthly payment flow with a payment gate in **React** that restricts features for unpaid users; company income grew 10x after launch. <!-- src: omo-systems-smart-home#4.3 -->

* Proposed a refactoring of the mobile app architecture that won first place at a local hackathon. <!-- src: omo-systems-smart-home#4.2 -->

* Led and mentored a team of about 3 engineers: ran **code reviews**, set coding standards and onboarded new engineers. <!-- src: omo-systems-smart-home#4.5 -->

<!-- entry: thermo-fisher-dosimeter -->
## **Software Engineer**

### **Thermo Fisher Scientific | Remote | November 2020 - April 2021**

* Built an **IoT healthcare** app from scratch and designed its architecture with **React Native, TypeScript, Redux** and an offline-first **Realm** database, communicating with radiation dosimeters over Bluetooth. <!-- src: thermo-fisher-dosimeter#4.1 -->

* Built dosimeter firmware updates that run as cross-platform **background jobs** on Android and iOS. <!-- src: thermo-fisher-dosimeter#4.4 -->

<!-- entry: itjet-fintech -->
## **Full-Stack Engineer**

### **Itjet | Kyiv, Ukraine (Hybrid) | August 2019 - November 2020**

* Built the automated monthly subscription flow for Fused with **Stripe**, **Node.js REST APIs** (**Express**, **Sequelize**), **React** and **React Native**. <!-- src: itjet-fintech#4.6 -->

* Built the Wink social app from scratch in **React Native** (Snapchat and phone sign-in, **push notifications**, **CI/CD**, image optimization on a **Node.js** backend); it reached more than 5 million registered users. <!-- src: itjet-fintech#4.8 -->

* Doubled delivery speed by introducing **TypeScript** and an **Atomic Design** component library (**design system**) with automated tests (**Puppeteer, Jest, Cucumber**) for Aspiration, and by setting up **CI/CD** (Bitbucket Pipelines, AWS EC2 / S3) for RegiStart. <!-- src: itjet-fintech#4.3 -->

* Built web features for Aspiration with **Next.js** with server-side rendering (SSR) and **GraphQL**, and containerized Fused services with **Docker**. <!-- src: itjet-fintech#4.7 -->

* Doubled database performance for Fused by migrating **PostgreSQL** from EC2 to **AWS RDS** and optimizing slow SQL queries. <!-- src: itjet-fintech#4.4 -->

* Built a reusable **React Native Web** signup flow shared by the native mobile and web apps of Aspiration, a fintech product (Forbes top 10), which made building new flows 3x faster. <!-- src: itjet-fintech#4.1 -->

<!-- entry: admasters-ecommerce -->
## **Full-Stack Engineer and Team Leader**

### **The Admasters | Kyiv, Ukraine (Hybrid) | April 2019 - August 2019**

* Redesigned a legacy codebase to speed up feature deployment. <!-- src: admasters-ecommerce#4.4 -->

* Developed e-commerce sites and landing pages with **Next.js** and server-side rendering (SSR) for SEO. <!-- src: admasters-ecommerce#4.3 -->

* Led a team of 3 software engineers and introduced **Agile** processes. <!-- src: admasters-ecommerce#4.2 -->

# **CONSULTING AND FREELANCE PROJECTS**

Part-time contract and consulting work, alongside full-time roles

<!-- entry: orion-mobile-clinical-ink -->
## **Senior React Native Engineer (Contract)**

### **Clinical Trials Patient App | Remote**

* Developed and maintained a patient-facing **clinical trial** mobile app for electronic clinical outcome assessment (**eCOA**) built with **React Native, Expo and TypeScript**, and its native **Android (Java / Kotlin)** counterpart. <!-- src: orion-mobile-clinical-ink#4.1 -->

* Refactored the legacy documents library screen from JavaScript into small **TypeScript** components to speed up the app, and added ~1,000 lines of **Jest** and **React Native Testing Library** tests. <!-- src: orion-mobile-clinical-ink#4.2 -->

* Migrated the native Android app to **Android 14 (SDK 34)**: Gradle 8, Java 17, exact-alarm and PendingIntent behavior changes, and **Jenkins** CI build fixes. <!-- src: orion-mobile-clinical-ink#4.4 -->

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

* Conducted senior-level **technical interviews** for **React, React Native, JavaScript and TypeScript** roles for enterprise clients, with technical questions and coding assignments. <!-- src: consulting-interviews -->

* Led scaling and optimization engagements for client teams, reducing operational costs by up to 50% through refactoring core apps, adding caching and writing unit tests. <!-- src: consulting-optimization -->

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

**Backend and Cloud:** Node.js, Express, Sequelize, PM2, Nginx, PostgreSQL, Amazon Web Services (AWS: EC2, S3, RDS, Amplify, AppSync, Cognito), Microsoft Azure (Azure Blob Storage), Stripe, Docker

**State and Data:** Redux (Redux Toolkit, Redux Thunk, Redux Saga, Redux Persist), MobX, Zustand, XState, TanStack Query, TanStack Router, RxJS, REST APIs, GraphQL, Apollo Client, WebSockets

**DevOps and Observability:** CI/CD, Azure DevOps, Azure Pipelines, GitHub Actions, Bitbucket Pipelines, Jenkins, Git, ESLint, Prettier, Husky, SonarQube, OpenTelemetry, Kibana, Bugsnag, Sentry

**Testing:** Vitest, Vitest Browser Mode, Playwright, Jest, React Testing Library, React Native Testing Library, Detox, Puppeteer, Cucumber, End-to-end (E2E) testing, Unit testing

**Authentication and Security:** OAuth 2.0, OpenID Connect (OIDC), Zero-trust architecture, SSL certificate pinning, PII redaction

**AI:** Generative AI integration, Model Context Protocol (MCP), AI agent governance (SDD), AI-assisted development

**Mobile:** React Native, Expo, React Native Web, Android (Java, Kotlin, Gradle), Native modules (iOS / Android), Realm (realm-js), MMKV, Push notifications (Firebase Cloud Messaging), SQLCipher, Keychain, Fastlane, Bitrise

**Leadership and Methodologies:** Team leadership (up to 8 engineers), Mentoring, Code review, System design, Software architecture, Architecture decision records (ADR), Technology stack selection, Technical interviewing, Technical audits, Effort estimation, Presales, Agile, Specification-driven development (SDD), Figma, Jira

**Domain and SDKs:** ERP, Clinical trials (eCOA), HERE SDK (HNav, HNod, HERE API), IoT, Bluetooth Low Energy (BLE), react-native-ble-plx, MQTT, Blockchain, Web3.js, Atlassian Jira Forge (UI Kit, Custom UI)
<!-- /generated:skills -->

# **LANGUAGES**

<!-- generated:languages -->
English: C1 (Advanced) | Ukrainian: Native
<!-- /generated:languages -->
