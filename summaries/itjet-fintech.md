---
schema_version: 1
id: itjet-fintech
source: cv
# --- the job ---
client: Itjet
role: Full-Stack Engineer
engagement: full-time
period: { start: 2019-08, end: 2020-11 }
domain: [Fintech, Non-profit, Fitness, Social, Sports, Entertainment]
team_size_led: 0
counts_as_experience: true
# --- harvesting ---
repos: []
author_identities: []
harvested_at: null
# --- how it appears in the CV ---
show_in_cv: true
cv_section: experience
cv_client_label: Itjet
cv_location: "Kyiv, Ukraine (Hybrid)"
---

# Itjet: client projects (fintech, non-profit, fitness, social, golf, astrology)

## 1. Project overview

Itjet was a services company; my work there was on six client projects (client split confirmed by user 2026-10-22, project details from doc:portfolio-2025-04):

- **Aspiration**, a US eco-focused bank and fintech product (Forbes top 10): the React Native Web signup flow shared by its native mobile and web apps, and a new React web app for its tree-planting and profile flows.
- **RegiStart**, a non-profit start-up raising voter registration among high-school seniors: a React web app with a Node.js backend and PostgreSQL on AWS.
- **Fused**, a coach and athlete fitness app on web and mobile, with Stripe subscriptions and a Node.js backend.
- **Wink**, a social React Native app (swipe to like or pass, in-app currency earned through actions), published on Google Play and the App Store.
- **Golfuture**, a golf concept with a smartphone app that guides players through the course at their own pace, with Stripe payments; published on Google Play and the App Store.
- **Oroscopo**, a tarot and astrology app (zodiac predictions, tarot layouts, zodiac compatibility); published on Google Play and the App Store.

Client names may appear in the CV (decided by user 2026-10-22).

TODO (needs user input): who uses the product, the business problem, and team size and organization context.

## 2. Main features

Signup shared by the mobile and web apps, and an automated monthly subscription (from the CV). Aspiration: signup with bank-account linking (Plaid), address autocomplete (Google Places) and bot protection (reCAPTCHA v3), and a banking web flow for planting trees from transactions and for profile and settings (doc:portfolio-2025-04, approved by user 2026-10-22).

## 3. My role and responsibilities

Full-Stack Engineer working across the mobile and web frontends, the Node.js backend, the database and the CI/CD setup.

Worked with the client's native mobile developers on integrating React Native Web into the native apps, with US developers and product managers, and with the marketing team on A/B tests. Took part in grooming and retrospectives, planned task scope for upcoming periods and helped resolve communication problems between the remote teams (doc:portfolio-2025-04, approved by user 2026-10-22).

## 4. My contributions

### 4.1 Reusable cross-platform signup flow

Aspiration. Built a reusable React Native Web signup flow shared by the native mobile and web apps of a fintech product (Forbes top 10).

Result: building new flows became 3x faster.
Tags: react-native-web, react-native, react

### 4.2 A/B testing for marketing

Aspiration. Integrated A/B testing so the marketing team could analyze user engagement.

Tags: ab-testing

### 4.3 TypeScript, design system and CI/CD

Introduced TypeScript and built an Atomic Design component library (design system) for Aspiration, with automated tests in Puppeteer, Jest and Cucumber, and set up CI/CD with Bitbucket Pipelines and AWS EC2/S3 for RegiStart (client split confirmed by user 2026-10-22).

Result: delivery speed doubled.
Tags: typescript, design-systems, ci-cd, aws, testing, e2e

### 4.4 PostgreSQL migration to AWS RDS

Fused. Migrated PostgreSQL from EC2 to AWS RDS and optimized slow SQL queries.

Result: database performance doubled.
Tags: postgres, aws, performance

### 4.5 Database schema migrations

RegiStart. Set up PostgreSQL schema migrations with node-pg-migrate.

Tags: postgres, node

### 4.6 Automated monthly subscription

Fused. Built an automated monthly subscription flow with Stripe, Node.js REST APIs (Express, Sequelize), React and React Native.

Tags: payments, node, rest-api, react, react-native

### 4.7 Next.js, GraphQL and Docker

Built web features with Next.js and server-side rendering and used GraphQL for Aspiration, and containerized services with Docker for Fused (client split confirmed by user 2026-10-22).

Tags: nextjs, ssr, graphql, docker

### 4.8 Wink social app from scratch

Wink. Built the React Native app from scratch from the designs: sign-in with Snapchat or a phone number, integration with the backend API, push notifications, CI/CD for app deployment, and image optimization on the Node.js backend; also did code reviews and worked directly with the client. The app was published on Google Play and the App Store (Itjet project confirmed by user 2026-10-22).

Result: more than 5 million registered users.
Tags: react-native, typescript, node, ci-cd, mobile-ci, app-distribution
Source: doc:portfolio-2025-04

### 4.9 Golfuture app from scratch

Golfuture. Built the React Native app from scratch from the designs: planned and built the components and screens, the business logic and the Stripe and API integrations, optimized and tested the app, and presented results directly to the client. The app was published on Google Play and the App Store (Itjet project confirmed by user 2026-10-22).

Tags: react-native, typescript, redux, payments, app-distribution
Source: doc:portfolio-2025-04

### 4.10 Oroscopo features

Oroscopo. Added features to the existing React Native app: API work, UI components, an animated card circle, the zodiac compatibility logic, banner ads (AdMob) and new tarot layout screens; optimized and tested the app and presented results directly to the client (Itjet project confirmed by user 2026-10-22).

Tags: react-native, typescript, redux
Source: doc:portfolio-2025-04

### 4.11 Signup integrations: bank linking, address search and bot protection

Aspiration. Integrated Plaid (bank-account linking), Google Places (address autocomplete) and reCAPTCHA v3 into the signup flow, and added new signup screens and components.

Tags: react-native-web, react, rest-api, security
Source: doc:portfolio-2025-04

### 4.12 Developer onboarding: PR style guide, docs and E2E test utility

Aspiration. Wrote a pull request style guide and documentation to make onboarding easier, and built a utility for end-to-end tests.

Tags: code-quality, code-review, e2e, testing
Source: doc:portfolio-2025-04

### 4.13 Banking web flow built from scratch

Aspiration. Built a new React web flow from scratch from the designs, mobile-first, with reusable components following Atomic Design, and added a scaffolding generator (Plop) that creates the file structure for new components.

Tags: react, nextjs, design-systems, storybook, build-tooling
Source: doc:portfolio-2025-04

### 4.14 Voter-registration MVP: React frontend, Node.js backend and AWS

RegiStart. Built the MVP from sketches: a React and Material UI frontend, the database tables and relations, and a Node.js backend using Sequelize with PostgreSQL on AWS RDS. Set up CI/CD to AWS EC2 and S3 and database migrations with node-pg-migrate, and designed an algorithm that distributes students among student organizers.

Tags: react, node, postgres, aws, ci-cd, rest-api
Source: doc:portfolio-2025-04

### 4.15 Fused web app for athletes and payments

Fused. Built the athlete flow in the web app (previously coach-only), moved all payment logic from the mobile app to the web app, added backend endpoints for removing cards, made the web app fully responsive and fixed mobile bugs. Created the dev backend on AWS EC2, configured CI/CD and wrote documentation, working directly with the client.

Tags: react, node, payments, aws, ci-cd, react-native
Source: doc:portfolio-2025-04

## 5. Technologies and frameworks

- **Language:** TypeScript (hands-on)
- **Frontend and mobile:** React (hands-on), React Native (hands-on), React Native Web (hands-on), Next.js with SSR (hands-on), Atomic Design component library (hands-on)
- **API:** Node.js REST APIs (hands-on), Express (hands-on, confirmed by user 2026-10-22), GraphQL (hands-on)
- **Data:** PostgreSQL (hands-on), node-pg-migrate (hands-on), Sequelize ORM (hands-on, confirmed by user 2026-10-22)
- **Payments:** Stripe (hands-on)
- **Cloud and infrastructure:** AWS EC2, S3 and RDS (hands-on), Docker (hands-on), PM2 process manager and Nginx for running and serving the Node.js services (hands-on, confirmed by user 2026-10-22)
- **CI/CD:** Bitbucket Pipelines (hands-on)
- **Testing:** Puppeteer (hands-on), Jest (hands-on), Cucumber (hands-on), React Testing Library (hands-on, confirmed by user 2026-10-16)
- **Styling, state and security:** Styled Components, Redux Thunk, Keychain (hands-on, confirmed by user 2026-10-16)
- **Analytics:** A/B testing (hands-on)
- **Client projects, from the portfolio:** Apollo Client (GraphQL), React Navigation, Plaid, Google Places API, reCAPTCHA v3, PlanOut A/B testing, Storybook, Plop scaffolding, CSS Grid, component-driven development and domain-driven design (Aspiration); Redux, Formik, Material UI (RegiStart) (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04). CircleCI, Segment, Rollbar and Crashlytics (Aspiration) (used by the project, confirmed by user 2026-10-22, from doc:portfolio-2025-04)

## 6. Skills demonstrated

- React Native Web and cross-platform code sharing: 4.1
- React and React Native: 4.1, 4.6
- A/B testing: 4.2
- TypeScript: 4.3
- Design systems (Atomic Design): 4.3
- CI/CD: 4.3
- Automated testing (unit and E2E): 4.3
- PostgreSQL and SQL optimization: 4.4, 4.5
- AWS: 4.3, 4.4
- Node.js and REST APIs: 4.5, 4.6
- Payments (Stripe): 4.6
- Next.js and SSR: 4.7
- GraphQL: 4.7
- Docker: 4.7

## 7. Metrics and outcomes

- The fintech product is a Forbes top 10 (4.1). Source: cv. Confidence: exact.
- Building new flows 3x faster with the shared signup flow (4.1). Source: cv. Confidence: exact.
- Delivery speed doubled (4.3). Source: cv. Confidence: exact.
- Database performance doubled (4.4). Source: cv. Confidence: exact.
- Database stability also doubled with the RDS migration (4.4). Source: previous CV, confirmed by user 2026-10-15. Confidence: exact.
- The previous CV credits a 2x delivery speedup separately to TypeScript plus Atomic Design and to CI/CD plus automated tests (4.3). Source: previous CV, confirmed by user 2026-10-15. Confidence: exact.
- Project income increased after the Stripe subscription flow (4.6), no number. Source: previous CV, confirmed by user 2026-10-15. Confidence: exact.
- More than 5 million registered users in the Wink database (4.8). Source: user 2026-10-22 (doc:portfolio-2025-04 said "more than 5 million users"; the user confirmed they were registered users). Confidence: approximate.

## 8. Portfolio material

- image: ../sources/media/portfolio-2025-04/image30.png
  caption: Fused web app, coach subscriptions an athlete can connect to (Stripe, 4.6)
  public: yes, confirmed by user 2026-10-22
- image: ../sources/media/portfolio-2025-04/image32.png
  caption: Fused web app, the coach's workout schedule
  public: yes, confirmed by user 2026-10-22

Both screenshots are Fused (confirmed by user 2026-10-22) and show test data only; both may be public (confirmed by user 2026-10-22). Other Itjet screenshots in doc:portfolio-2025-04 (Wink) are still to be gone through.

TODO (needs user input)

## 9. Confidentiality notes

None known. TODO (needs user input)
