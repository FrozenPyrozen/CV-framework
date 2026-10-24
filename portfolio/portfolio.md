<!-- generated:portfolio-cover -->
[github.com/FrozenPyrozen](https://github.com/FrozenPyrozen) | [www.linkedin.com/in/kyrylo-kohan](https://www.linkedin.com/in/kyrylo-kohan/)

# **My Portfolio**

## **Kirill Kohan**
<!-- /generated:portfolio-cover -->

<!-- project: syspro-saas-erp -->

<!-- generated:project-syspro-saas-erp -->
## **Schema-driven ERP web platform for SYSPRO (React 19, TypeScript)**
<!-- /generated:project-syspro-saas-erp -->

SYSPRO is bringing its ERP product to the web with a schema-driven platform. <!-- src: syspro-saas-erp#1 --> Instead of a hand-built web page for each ERP screen, the platform stores each program's form, grid and toolbar as a declarative definition, which a single React runtime renders when a user opens the program. <!-- src: syspro-saas-erp#1 --> ERP operators use business programs such as Bill of Materials and Inventory on the web, and administrators manage operators and roles. <!-- src: syspro-saas-erp#1 --> The frontend consists of three independently deployable apps (a host runtime, an identity app and an administration app) in a zero-trust micro-frontend architecture where apps never import from each other. <!-- src: syspro-saas-erp#1 -->

<!-- generated:media-syspro-saas-erp -->
![The ERP program menu with program search](assets/syspro-saas-erp/program-menu.png)

![A purchase order program rendered from its definition](assets/syspro-saas-erp/purchase-order.png)

![A lookup grid for sales branches with filters](assets/syspro-saas-erp/branch-lookup.png)

![A route code lookup with a search panel and sample data](assets/syspro-saas-erp/route-code-lookup.png)
<!-- /generated:media-syspro-saas-erp -->

**Responsibilities**

I built core modules of the host runtime in React 19 and TypeScript: KendoReact rendering handlers for forms, search grids with filtering and sorting, date fields, smart-tag lookups and predictive search, plus view orchestration, related-program navigation, overlays and a global store. <!-- src: syspro-saas-erp#4.4, syspro-saas-erp#4.5 --> In local testing, one mock backend exposed more than 1,800 ERP menu items, each rendered as a live screen without program-specific frontend code, and the runtime cut the time to bring an ERP screen to the web from days to hours. <!-- src: syspro-saas-erp#4.1, syspro-speed --> I also built the login micro-frontend from scratch with OpenID Connect sign-in, and an OpenTelemetry browser telemetry module that redacts sensitive data before export. <!-- src: syspro-saas-erp#4.6, syspro-saas-erp#4.7, syspro-saas-erp#4.8 -->

The work followed architecture-governed specification-driven development (SDD). <!-- src: syspro-saas-erp#4.2 --> I wrote and maintained about 17 component specifications, each stating what the component must do and the architecture constraints it inherits, and validated them before and after implementation. <!-- src: syspro-saas-erp#4.2 --> AI coding agents implemented and reviewed code against these specifications under human review, raising constraint violations, technical debt and open questions for a human decision. <!-- src: syspro-saas-erp#4.2 --> I worked with the lead architect on platform and solution architecture, helped define the SDD process itself, and owned the frontend technology stack for the login app and the host runtime. <!-- src: syspro-architecture-scope, syspro-tech-stack-ownership --> The process reduced pull request review cycles. <!-- src: syspro-review-cycles -->

**Technologies and frameworks**

React 19, TypeScript, Vite, KendoReact, TanStack Router, Zustand, XState, OpenID Connect (oidc-client-ts, react-oidc-context), OpenTelemetry, Vitest, Vitest Browser Mode, Playwright, Storybook, CSS Modules, ESLint, Node.js, Azure Pipelines. <!-- src: syspro-saas-erp#5 -->

<!-- project: general-motors-navigation/companion -->

<!-- generated:project-general-motors-navigation/companion -->
## **Car management app for General Motors (React Native)**
<!-- /generated:project-general-motors-navigation/companion -->

The car management app lets owners control their car from their phone, with features such as starting the engine remotely and checking tire pressure. <!-- src: doc:portfolio-2025-09 --> It serves gas and electric vehicles across the Chevrolet, Buick, GMC and Cadillac brands. <!-- src: general-motors-navigation#1 -->

<!-- generated:media-general-motors-navigation/companion -->
![Car management app, map screen](../sources/media/portfolio-2025-04/image1.png)

![Car management app, map search](../sources/media/portfolio-2025-04/image2.png)

![Car management app, charging stations](../sources/media/portfolio-2025-04/image1.jpeg)

![Car management app, place details](../sources/media/portfolio-2025-04/image3.png)
<!-- /generated:media-general-motors-navigation/companion -->

**Responsibilities**

I led the map team of 8 developers (6 React Native, 1 iOS, 1 Android) for a large, complex, high-load app for managing gas and electric cars, built on React Native and the HERE SDK. <!-- src: doc:portfolio-2025-09 --> The team built a reusable map provider module (map display, search, a bottom drawer, markers and charging stations) as a React Native micro-frontend that is integrated into several company products. <!-- src: doc:portfolio-2025-09 --> I coordinated dependencies with the UI team, the backend teams (EV and gas vehicle services, location-based services) and the HERE SDK and HERE API teams: I set scope, deadlines and priorities, led planning, removed blockers, created the integration strategy and set up test automation. <!-- src: doc:portfolio-2025-09 -->

I created and documented the process for delivering and testing our apps inside the parent app (parent app, reusable feature app, map provider app). <!-- src: doc:portfolio-2025-09 --> At the client's request, I changed the architecture to migrate the reusable feature app into the parent app, and planned the move of its logic and components to the parent app's patterns (clean architecture, domain-driven design, abstract services, pure components). <!-- src: doc:portfolio-2025-09 --> During the migration, I fixed weak points in the reusable feature app's architecture to speed up integration and development: map instances no longer share a global ref. <!-- src: doc:portfolio-2025-09 --> The map provider's global event listener, which caused bugs when several instances were running, became one listener per map. <!-- src: doc:portfolio-2025-09 --> The map logic also moved from the reusable feature app into the map provider. <!-- src: doc:portfolio-2025-09 --> I also designed the architecture of a complex search feature reused on different screens, and normalized the state structure that stores markers and search results. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native, HERE SDK, HERE API, Redux Toolkit, TypeScript, React Hooks, Git, Azure, Azure Pipelines, Jest, BrowserStack, domain-driven design, clean architecture. <!-- src: doc:portfolio-2025-09 -->

<!-- project: navigation-statistics -->

<!-- generated:project-navigation-statistics -->
## **Automotive navigation app for HERE Technologies (React Native, React, Node.js, Android)**
<!-- /generated:project-navigation-statistics -->

A customizable Android navigation app for large-truck drivers, installed on the driver's tablet and based on HERE maps. <!-- src: doc:portfolio-2025-09 --> HERE's customer, a package delivery company, builds on HERE solutions (HNav, HNod, HERE SDK, HERE API). <!-- src: doc:portfolio-2025-09 --> The app is built with JavaScript tools (Node.js, React Native, React) and Android tools (Kotlin, Java), connected through gRPC. <!-- src: doc:portfolio-2025-09 --> Drivers see the route to their destination and set their truck's parameters, such as width and height, to see the restrictions that apply to it. <!-- src: doc:portfolio-2025-09 --> The app can be extended with custom logic and features through service packages connected to the HERE bundler, which add menu items, screens, pop-ups and routing logic with React Native, React and Node.js. <!-- src: doc:portfolio-2025-09 --> In short, the project consists of the HNod library, service packages and an Android app, native or web-based. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-navigation-statistics -->
![Navigation app, route view](../sources/media/portfolio-2025-04/image2.jpeg)

![Navigation app, search](../sources/media/portfolio-2025-04/image3.jpeg)
<!-- /generated:media-navigation-statistics -->

**Responsibilities**

I worked on route deviations, the cases when a truck driver leaves the planned route: I collected them and sent them to a reporting endpoint. <!-- src: doc:portfolio-2025-09 --> I extended the HNod library to submit route-change events (new route started, previous route restored, route edited, alternative route selected, driver deviated from route, route refreshed, driver parking). <!-- src: doc:portfolio-2025-09 --> I then processed these events, compared the route data to detect deviations, and sent that data to the customer. <!-- src: doc:portfolio-2025-09 --> I also built a redesigned search UI. <!-- src: navigation-statistics#4.5 --> Both pieces used HERE's HNav and HNod SDKs, written in TypeScript and Kotlin, with HERE's service packages. <!-- src: navigation-statistics#4.5, navigation-statistics#5, navigation-statistics#7 -->

I made route changes explainable: the guidance statistics report not only which route is active but why it changed, such as a driver's choice, a route refresh or a parking approach. <!-- src: navigation-statistics#1, navigation-statistics#4.1 --> I separated the developer tools and their React diagnostic displays from the core statistics service and updated the shared contracts (Protocol Buffers), keeping the old operations for existing users. <!-- src: navigation-statistics#4.2, navigation-statistics#4.3 --> I added regression tests for each route-change reason and fixed integration failures. <!-- src: navigation-statistics#4.4 -->

**Technologies and frameworks**

JavaScript, TypeScript, Node.js, React Native, React, Android, RxJS, Protocol Buffers, HNav and HNod SDKs, Kotlin, Jest, Git. <!-- src: navigation-statistics#5, doc:portfolio-2025-09 -->

<!-- project: navigation-poc -->

<!-- generated:project-navigation-poc -->
## **Car navigation PoC for HERE Technologies (Node.js, React)**
<!-- /generated:project-navigation-poc -->

This proof of concept (PoC) is an automotive app that demonstrated what new HERE technology can do in Volkswagen AG cars (Audi, Porsche, Volkswagen and others). <!-- src: doc:portfolio-2025-09 --> It integrated features such as the Hugo AI assistant, Level 3 automated driving (L3) interaction, advanced driver-assistance systems, the Kurviger route planner, custom themes and layout support. <!-- src: doc:portfolio-2025-09 --> It combined a React and TypeScript layer with HERE's HNav and HNod SDKs on Android, so it could be tried across car brands and in-car displays. <!-- src: navigation-poc#1, navigation-poc#5 -->

<!-- generated:media-navigation-poc -->
![Car navigation PoC on the in-car display](../sources/media/portfolio-2025-09/p04-1.png)
<!-- /generated:media-navigation-poc -->

**Responsibilities**

I implemented the L3 interaction feature and the Hugo AI assistant feature, which builds routes and shows nearby places. <!-- src: doc:portfolio-2025-09 --> For the assistant, I added typed input next to voice and built clear processing, completion and error states, so a conversation could run alongside the map. <!-- src: navigation-poc#4.1 --> I built the driver warning cards, which let the driver confirm, reject or dismiss a warning. <!-- src: navigation-poc#4.2 --> For a luxury car brand, I built a second screen for the passenger with live trip data from the car, nearby places and a recenter control. <!-- src: navigation-poc#4.3 --> I added route-progress markers that highlight the next one ahead, and the icons and notifications that show the assisted-driving status. <!-- src: navigation-poc#4.4 -->

I also implemented the Porsche theme and layout, and added debug car-data settings for electric cars. <!-- src: doc:portfolio-2025-09 --> I built brand themes with day and night variants and kept the shared cockpit layout consistent across brands. <!-- src: navigation-poc#4.7 -->

I added curvy-route controls and fixed alternative-route selection from the map. <!-- src: navigation-poc#4.5 --> In a separate Kotlin reference app for motorcycle navigation, I built a curviness slider and screen orientation handling during guidance. <!-- src: navigation-poc#4.5 --> For search and parking demos, I added ratings, parking details and a QR-code booking card. <!-- src: navigation-poc#4.6 --> For the web control panel that runs the demos, I moved its settings and scenarios into a configuration that is checked when it loads and can change without rebuilding the app. <!-- src: navigation-poc#4.10 --> I wrote a script that replaced inefficient manual steps and made the build 3x faster. <!-- src: doc:portfolio-2025-09, gm-poc-build-3x -->

**Technologies and frameworks**

JavaScript, TypeScript, Node.js, React, RxJS, Protocol Buffers, gRPC, HNav and HNod SDKs, Kotlin, Android, Jetpack Compose, Jest, Git. <!-- src: navigation-poc#5 -->

<!-- project: velas-wallet -->

<!-- generated:project-velas-wallet -->
## **Velas Wallet (React, React Native, Electron)**
<!-- /generated:project-velas-wallet -->

Velas Wallet is a fully open-source, non-custodial, multi-language crypto wallet that supports the Velas, Ethereum, BNB Smart Chain (BSC), HECO and Bitcoin networks. <!-- src: doc:portfolio-2025-09 --> Users can stake VLX and earn rewards, swap tokens between networks through bridges, and send and receive crypto by QR code. <!-- src: doc:portfolio-2025-09 --> The wallet has web, mobile and desktop versions. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-velas-wallet -->
![Velas Wallet on mobile](../sources/media/portfolio-2025-09/p05-1.png)

![Velas Wallet on desktop](../sources/media/portfolio-2025-09/p05-3.png)
<!-- /generated:media-velas-wallet -->

**Responsibilities**

I removed performance bottlenecks across the wallet: staking page loading went from 2 minutes to 5 seconds, and I eliminated unnecessary component re-renders to make the app faster and easier to use. <!-- src: doc:portfolio-2025-09, velas-wallet#4.2 --> I optimized backend responses for speed by removing unused fields and adding filters and pagination. <!-- src: doc:portfolio-2025-09 --> I configured wallet builds and signing in CI/CD with GitHub Actions, added end-to-end tests for the mobile wallet with Detox, and published the app to the F-Droid and Snap stores. <!-- src: doc:portfolio-2025-09 --> I also designed the architecture of the new wallet and set up unit tests with Jest. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native Web, React Native, Web3, MobX, TypeScript, GitHub Actions, React Hooks, Git, Expo (ejected), React Native CLI, JavaScript, LiveScript, Jest. <!-- src: doc:portfolio-2025-09 -->

<!-- project: designai-jira-plugin -->

<!-- generated:project-designai-jira-plugin -->
## **Jira design generation plugin under NDA (Node.js, React)**
<!-- /generated:project-designai-jira-plugin -->

This generative AI application speeds up designers' work, letting them quickly create presales designs for customers, as well as designs for a minimum viable product (MVP) or a proof of concept (PoC). <!-- src: doc:portfolio-2025-09 --> It integrates with the client's Jira board. <!-- src: doc:portfolio-2025-09 --> Users describe their requirements in a text prompt, provide a URL and upload photos or style schemas. <!-- src: doc:portfolio-2025-09 --> The system then generates a design (for example, in Figma format), creates a Jira subtask that tracks the request and returns the finished design for the early design and project-planning phases. <!-- src: doc:portfolio-2025-09, designai-jira-plugin#2 -->

<!-- generated:media-designai-jira-plugin -->
![The plugin's design request form with an attached wireframe (plugin name covered)](assets/designai-jira-plugin/form-image-attached.png)

![The design request form with four wireframes, a reference URL and an error message (plugin name covered)](assets/designai-jira-plugin/form-images-and-url.png)
<!-- /generated:media-designai-jira-plugin -->

**Responsibilities**

I built a generative AI Jira plugin with Atlassian Forge Custom UI, Atlaskit and TypeScript that automates website design generation. <!-- src: doc:portfolio-2025-09 --> A key architectural challenge was working around Atlassian Forge's strict file upload limits, which I solved by integrating Azure Blob Storage to transfer image data in chunks. <!-- src: doc:portfolio-2025-09, jira-blob-chunks --> The solution works end to end, including calls to the Jira API that automatically create a subtask for each generated design. <!-- src: doc:portfolio-2025-09, designai-jira-plugin#4.1 --> I worked closely with the backend and ML teams, and the plugin was delivered on time. <!-- src: doc:portfolio-2025-09, jira-on-time-delivery -->

**Technologies and frameworks**

JavaScript, Node.js, TypeScript, React, Jira, Atlaskit, Forge Custom UI, Docker. <!-- src: doc:portfolio-2025-09, designai-jira-plugin#5 -->

<!-- project: orion-mobile-clinical-ink -->

<!-- generated:project-orion-mobile-clinical-ink -->
## **Clinical trial app for Clinical Ink (React Native, React, Android)**
<!-- /generated:project-orion-mobile-clinical-ink -->

The app makes it easier to take part in a clinical trial. <!-- src: doc:portfolio-2025-09 --> Depending on the trial, it may provide some or all of the following: help with addresses and directions for upcoming visits; reminders to take medication or complete trial tasks; videos and other content that explain the trial or help participants prepare for upcoming tasks and appointments; and questionnaires about how they are feeling, along with other trial tasks. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-orion-mobile-clinical-ink -->
![Clinical trial app, dashboard with test tasks](../sources/media/portfolio-2025-04/image4.jpeg)

![Clinical trial app, study documents](../sources/media/portfolio-2025-04/image5.jpeg)

![Clinical trial app, task completion](../sources/media/portfolio-2025-04/image6.jpeg)
<!-- /generated:media-orion-mobile-clinical-ink -->

**Responsibilities**

I refactored the legacy study library flow into a new TypeScript patient documents screen built from small components. <!-- src: doc:portfolio-2025-09, orion-mobile-clinical-ink#4.2 --> I raised unit test coverage and applied TypeScript and modern React Hooks best practices to improve maintainability and performance. <!-- src: orion-mobile-clinical-ink#4.2 --> I migrated the Android app from Android 13 to Android 14 to meet Google Play Store requirements, upgraded key dependencies and resolved complex migration issues (for example, the SQLCipher for Android library, SQLite and Android 14 compatibility). <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

JavaScript, TypeScript, React Native, Expo, React, Kotlin, SQLCipher, Redux Toolkit, AWS SDK (S3), Amazon Cognito, GraphQL, i18next, Apollo, AWS Amplify, Bitbucket Pipelines, Jenkins. <!-- src: doc:portfolio-2025-09 -->

<!-- project: omo-systems-smart-home -->

<!-- generated:project-omo-systems-smart-home -->
## **Smart-home ecosystem IoT device management app for OMO Systems (React Native)**
<!-- /generated:project-omo-systems-smart-home -->

The app provides access control, security and home automation for multi-apartment buildings in several countries. <!-- src: doc:portfolio-2025-09, omo-systems-smart-home#1 --> Access to the apartment: residents control and open entrances, doors, barriers, elevators, gates and waste bins from a single app. <!-- src: doc:portfolio-2025-09 --> Video surveillance: they watch buildings and grounds from the same app, with live access to cameras and their video archive, synced with motion sensors through scenarios. <!-- src: doc:portfolio-2025-09 --> Security: the app protects the apartment from burglary and from damage caused by breakdowns and accidents, with traffic monitoring, door and window opening sensors, video surveillance inside the apartment, and automatic gas and water shut-off when a leak occurs. <!-- src: doc:portfolio-2025-09 -->

Residents can also set up scenarios that trigger devices on events, for example starting a camera when a motion sensor detects movement. <!-- src: doc:portfolio-2025-09 --> They manage their home, share it with family members and enable face recognition for their cameras. <!-- src: doc:portfolio-2025-09 --> In security mode the whole home is guarded: if an incident occurs, the app raises an alarm and automatically calls a security team. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-omo-systems-smart-home -->
![Smart-home app](../sources/media/portfolio-2025-04/image1.tif)
<!-- /generated:media-omo-systems-smart-home -->

**Responsibilities**

I owned the app's key monetization feature, billing by tariff subscription. <!-- src: doc:portfolio-2025-09 --> I designed and built from scratch a React single-page app that handles payments in the app's web view, and added blocking of unpaid devices and features in the app. <!-- src: doc:portfolio-2025-09 --> I implemented biometric login and fixed the react-native-keychain library for face and fingerprint login on Samsung Android devices. <!-- src: doc:portfolio-2025-09, omo-systems-smart-home#4.4 --> I fixed video stream issues in the react-native-vlcplayer library with patches, and was the tech lead of the frontend team for a sprint. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native, TypeScript, React Navigation, React Native Navigation, React Hooks, Git, React Redux, Reselect, Redux Saga, Fastlane, react-native-vlcplayer, react-native-keychain, react-native-aws-cognito-js, react-native-webview, react-native-nfc-hce. <!-- src: doc:portfolio-2025-09 -->

<!-- project: thermo-fisher-dosimeter -->

<!-- generated:project-thermo-fisher-dosimeter -->
## **Dosimeter IoT app under NDA (React Native)**
<!-- /generated:project-thermo-fisher-dosimeter -->

The app helps medical staff who work with radiation avoid overexposure. <!-- src: doc:portfolio-2025-09, thermo-fisher-dosimeter#1 --> It has three roles (user, admin and superuser), OAuth 2.0 login, 10 screens, and REST API, MQTT and Bluetooth communication. <!-- src: doc:portfolio-2025-09, dosimeter-10-screens --> The app reads data from radiation dosimeters over Bluetooth, sends it to an IoT server over MQTT, and can sync many dosimeters at the same time. <!-- src: doc:portfolio-2025-09 --> A main menu with swipe navigation and bottom pagination leads to the main screen, which shows sync progress, how many dosimeters synced with errors, and the sync time. <!-- src: doc:portfolio-2025-09 --> Another screen shows the details of the current sync, or of the last one when no sync is running, and the last screen holds the history of all syncs, filterable in a full-screen modal by date range, wearer, errors and ID. <!-- src: doc:portfolio-2025-09 --> The history is stored in a local Realm database, and all secure values in the keychain. <!-- src: doc:portfolio-2025-09 --> The app can also update the dosimeter firmware, and menus on the left and right lead to the Profile, Settings and Logs pages (Logs for superusers only). <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-thermo-fisher-dosimeter -->

<!-- /generated:media-thermo-fisher-dosimeter -->

**Responsibilities**

I built the API communication logic between the backend and the UI screens, and investigated, fixed and rewrote React Native and native libraries so they worked properly for our needs. <!-- src: doc:portfolio-2025-09 --> In project meetings, I proposed solutions for the business and ideas for a better user experience. <!-- src: doc:portfolio-2025-09 --> I reviewed code and covered it with unit tests following a test-driven development (TDD) approach. <!-- src: doc:portfolio-2025-09 --> I integrated MQTT, built the OAuth 2.0 login flow, worked with background jobs on Android and iOS, and added native modules. <!-- src: doc:portfolio-2025-09 --> I also improved the dosimeter data parsing so data is no longer overwritten, and set up the Realm database connection with its filter logic. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native, TypeScript, React Navigation, React Hooks, Git, Fastlane, react-native-ble-plx, Jira, react-native-app-auth, Formik, AsyncStorage, Redux Saga, react-native-fs, react-native-keychain, react-native-native-mqtt, Realm, ESLint, Husky. <!-- src: doc:portfolio-2025-09 -->

<!-- project: itjet-fintech/aspiration-signup -->

<!-- generated:project-itjet-fintech/aspiration-signup -->
## **Aspiration signup (React Native Web)**
<!-- /generated:project-itjet-fintech/aspiration-signup -->

Aspiration is a large company that develops a banking app ecosystem for customers in the US. <!-- src: doc:portfolio-2025-09 --> It is an eco-friendly bank that helps the planet by planting trees and investing in renewable energy sources and fossil fuel. <!-- src: doc:portfolio-2025-09 --> I started with the migration of the web app from Angular to React, and the team then built a new signup flow in React Native Web as a separate project. <!-- src: doc:portfolio-2025-09, aspiration-angular-to-rnw -->

<!-- generated:media-itjet-fintech/aspiration-signup -->
![Aspiration signup, screen 1](../sources/media/portfolio-2025-09/p10-1.png)

![Aspiration signup, screen 2](../sources/media/portfolio-2025-09/p10-3.png)

![Aspiration signup, screen 3](../sources/media/portfolio-2025-09/p10-5.png)
<!-- /generated:media-itjet-fintech/aspiration-signup -->

**Responsibilities**

I fixed and refactored the existing signup flow, added new screens and components, and helped native mobile developers integrate React Native into the native apps. <!-- src: doc:portfolio-2025-09 --> I worked with the US developers and product managers, brought solution proposals for the business to project meetings, and took part in code reviews. <!-- src: doc:portfolio-2025-09 --> I added the API connection logic, covered code with unit tests, created an end-to-end test utility and applied component-driven development (CDD) across the project. <!-- src: doc:portfolio-2025-09 --> I integrated Plaid, Google Places and reCAPTCHA v3, linked React Native libraries manually, wrote a pull request style guide and documentation for easier onboarding, added A/B tests and suggested user experience improvements. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native Web, Apollo GraphQL, TypeScript, React Navigation, React Hooks, Git, CircleCI, Plaid, Cucumber, Puppeteer, Jest, PlanOut, Segment, Rollbar, Crashlytics, scaffolding, CDD, domain-driven design (DDD), Next.js, Storybook, ESLint, CSS Grid, Jira. <!-- src: doc:portfolio-2025-09 -->

<!-- project: itjet-fintech/aspiration-web -->

<!-- generated:project-itjet-fintech/aspiration-web -->
## **Aspiration banking web app (React)**
<!-- /generated:project-itjet-fintech/aspiration-web -->

The banking web app lets customers plant trees with their transactions and change their profile, settings and more. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-itjet-fintech/aspiration-web -->
![Aspiration banking web app, screen 1](../sources/media/portfolio-2025-09/p11-1.png)

![Aspiration banking web app, screen 2](../sources/media/portfolio-2025-09/p11-3.png)

![Aspiration banking web app, screen 3](../sources/media/portfolio-2025-09/p11-5.png)
<!-- /generated:media-itjet-fintech/aspiration-web -->

**Responsibilities**

I wrote the application from the ground up to match the designs, with a mobile-first approach and reusable components following Atomic Design, and added a scaffolding generator for the file structure. <!-- src: doc:portfolio-2025-09 --> I worked with the remote team in the US, contributed to backlog grooming sessions and retrospectives, solved communication problems between the remote teams, and planned the scope of tasks for the next period. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React, Apollo GraphQL, React Hooks, Git, Plaid, Jest, Next.js, Storybook, ESLint, CSS Grid, Atomic Design, component-driven development (CDD), UI patterns, Jira, styled-components, Plop. <!-- src: doc:portfolio-2025-09 -->

<!-- project: itjet-fintech/registart -->

<!-- generated:project-itjet-fintech/registart -->
## **RegiStart (React web, Node.js backend, CI/CD)**
<!-- /generated:project-itjet-fintech/registart -->

RegiStart is a nonprofit startup that uses social networks and technology to systematically increase voter registration among 18-year-olds. <!-- src: doc:portfolio-2025-09 --> The app's main goal is to raise voter registration rates in schools that use RegiStart by distributing high school seniors among student organizers, who motivate them to vote. <!-- src: doc:portfolio-2025-09, itjet-fintech#1 --> Its slogan is "Strengthening America by registering voters, educating students on citizenship, and shaping students into citizens." <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-itjet-fintech/registart -->
![RegiStart, screen 1](../sources/media/portfolio-2025-09/p12-1.png)

![RegiStart, screen 2](../sources/media/portfolio-2025-09/p12-3.png)

![RegiStart, screen 3](../sources/media/portfolio-2025-09/p12-5.png)

![RegiStart, screen 4](../sources/media/portfolio-2025-09/p12-7.png)
<!-- /generated:media-itjet-fintech/registart -->

**Responsibilities**

Starting from sketches, I developed the frontend minimum viable product (MVP) with React and Material UI, planned the database tables and relationships, and built the Node.js backend, connected to the database with Sequelize. <!-- src: doc:portfolio-2025-09 --> I set up the PostgreSQL database on AWS RDS, configured CI/CD for deployment to AWS EC2 and S3, added database migrations with node-pg-migrate, and created an optimized algorithm that distributes students among organizers. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React, Redux, TypeScript, AWS (EC2, S3, RDS), CI/CD with Bitbucket Pipelines, PostgreSQL, Sequelize, node-pg-migrate, Formik, Material UI, Nginx, PM2, Docker, Jira. <!-- src: doc:portfolio-2025-09, itjet-fintech#4.7 -->

<!-- project: itjet-fintech/fused -->

<!-- generated:project-itjet-fintech/fused -->
## **Fused (React Native, React, Node.js)**
<!-- /generated:project-itjet-fintech/fused -->

Fused is a fitness coaching app where coaches plan workouts for their athletes. <!-- src: fused-product --> It has two roles, coach and athlete, and users can switch roles on the settings screen. <!-- src: doc:portfolio-2025-09 --> Coaches invite athletes, create workouts and exercises for them, build teams from athletes and track their workout progress. <!-- src: doc:portfolio-2025-09 --> To create a subscription, a coach adds card details and a bank account. <!-- src: doc:portfolio-2025-09 --> The app was published on Google Play. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-itjet-fintech/fused -->
![Fused mobile app, screen 1](../sources/media/portfolio-2025-09/p13-1.png)

![Fused mobile app, screen 2](../sources/media/portfolio-2025-09/p13-3.png)

![Fused mobile app, screen 3](../sources/media/portfolio-2025-09/p13-5.png)

![Fused mobile app, screen 4](../sources/media/portfolio-2025-09/p13-7.png)

![Fused web app, coach subscriptions an athlete can connect to (Stripe)](../sources/media/portfolio-2025-04/image30.png)

![Fused web app, the coach's workout schedule](../sources/media/portfolio-2025-04/image32.png)
<!-- /generated:media-itjet-fintech/fused -->

**Responsibilities**

I added new features and worked with the API: I built the athlete flow in the web version (previously coach-only), moved all payment logic from the mobile app to the web version, added backend endpoints for removing cards, made the web version fully responsive, and fixed existing bugs in the mobile app. <!-- src: doc:portfolio-2025-09 --> On the web and backend side, I migrated the development and production databases to AWS RDS, fully configured the CI/CD process and created the development backend EC2 instance. <!-- src: doc:portfolio-2025-09 --> I also wrote documentation and communicated directly with the client. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native, React, React Router, React Navigation, Node.js, Sequelize, PostgreSQL, React Hooks, Redux, RxJS, Stripe, Docker, AWS, Bugsnag, Bitbucket Pipelines, Fastlane, Git, Nginx, PM2, Jira. <!-- src: doc:portfolio-2025-09 -->

<!-- project: itjet-fintech/wink -->

<!-- generated:project-itjet-fintech/wink -->
## **Wink (React Native)**
<!-- /generated:project-itjet-fintech/wink -->

Wink is a social app for meeting new friends on Snapchat. <!-- src: wink-product --> Users like or dislike other users by swiping right or left, and each swipe costs gems, the in-app currency. <!-- src: doc:portfolio-2025-09, wink-product --> Users also get notifications when someone likes them and change their profile settings. <!-- src: doc:portfolio-2025-09 --> They earn gems through actions such as sharing the app link with friends, claiming a daily prize and leaving a review on Google Play. <!-- src: doc:portfolio-2025-09 --> The app was published on Google Play and the App Store and reached more than 5 million registered users. <!-- src: doc:portfolio-2025-09, itjet-fintech#4.8 -->

<!-- generated:media-itjet-fintech/wink -->
![Wink, swiping through profiles](../sources/media/portfolio-2025-04/image8.tif)

![Wink, chats](../sources/media/portfolio-2025-09/p14-3.png)

![Wink, settings](../sources/media/portfolio-2025-04/image9.tif)

![Wink, the user's profile](../sources/media/portfolio-2025-04/image10.tif)
<!-- /generated:media-itjet-fintech/wink -->

**Responsibilities**

I built the whole app from the designs, including login through Snapchat or a mobile number, integration with the backend API, and push notifications. <!-- src: doc:portfolio-2025-09 --> I optimized and tested the app, configured CI/CD for deployment, added image optimization on the Node.js backend, reviewed code and worked with the customer. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native, TypeScript, React Hooks, React Navigation, Redux, Redux Thunk, Firebase, Bugsnag, Fastlane, Bitrise, AWS, Node.js, Git, CSS Grid, Flexbox, Jira. <!-- src: doc:portfolio-2025-09 -->

<!-- project: itjet-fintech/golfuture -->

<!-- generated:project-itjet-fintech/golfuture -->
## **Golfuture (React Native)**
<!-- /generated:project-itjet-fintech/golfuture -->

Golfuture is a form of golf that keeps many elements of traditional golf but takes less time, costs less and is more eco-friendly. <!-- src: doc:portfolio-2025-09 --> Players use the smartphone app to choose a course and their playing partners, and the app guides them through the facility at their own pace, with no waiting for others. <!-- src: doc:portfolio-2025-09 --> Golfuture combines its own course design with ball-tracking technology. <!-- src: doc:portfolio-2025-09 --> The app was published on Google Play and the App Store. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-itjet-fintech/golfuture -->
![Golfuture, screen 1](../sources/media/portfolio-2025-09/p15-1.png)

![Golfuture, screen 2](../sources/media/portfolio-2025-09/p15-3.png)

![Golfuture, screen 3](../sources/media/portfolio-2025-09/p15-5.png)

![Golfuture, screen 4](../sources/media/portfolio-2025-09/p15-7.png)
<!-- /generated:media-itjet-fintech/golfuture -->

**Responsibilities**

I developed the app from scratch based on the designs: I planned and built the components and pages, added the business logic, and connected Stripe and other APIs. <!-- src: doc:portfolio-2025-09 --> I handled optimization and testing, joined project meetings and planning, and presented the results to the customer. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native, Redux, TypeScript, Redux Thunk, React Navigation, Fastlane, Bugsnag, React Hooks, Stripe, Bitrise, Git, CSS Grid, Jira. <!-- src: doc:portfolio-2025-09 -->

<!-- project: itjet-fintech/oroscopo -->

<!-- generated:project-itjet-fintech/oroscopo -->
## **Oroscopo (React Native)**
<!-- /generated:project-itjet-fintech/oroscopo -->

Oroscopo is a tarot and astrology mobile app that makes predictions for zodiac signs, lays out different tarot spreads for the future, and calculates the compatibility between signs. <!-- src: doc:portfolio-2025-09 --> The app was published on Google Play and the App Store. <!-- src: doc:portfolio-2025-09 -->

<!-- generated:media-itjet-fintech/oroscopo -->
![Oroscopo, screen 1](../sources/media/portfolio-2025-09/p16-1.png)

![Oroscopo, screen 2](../sources/media/portfolio-2025-09/p16-3.png)
<!-- /generated:media-itjet-fintech/oroscopo -->

**Responsibilities**

I added new features: UI components, an animated card circle, the zodiac compatibility logic, banner ads and new screens with tarot layouts. <!-- src: doc:portfolio-2025-09 --> I worked with the app's API, optimization and testing, took part in project meetings and demonstrated my work to the customer. <!-- src: doc:portfolio-2025-09 -->

**Technologies and frameworks**

React Native, Redux, TypeScript, Redux Thunk, React Navigation, React Hooks, Git, Firebase, AdMob, Jira. <!-- src: doc:portfolio-2025-09 -->
