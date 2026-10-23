---
schema_version: 1
id: thermo-fisher-dosimeter
source: cv
# --- the job ---
client: Thermo Fisher Scientific
role: Software Engineer
engagement: full-time              # confirmed by user 2026-10-15 (earlier recorded as contract)
period: { start: 2020-11, end: 2021-04 }
domain: [Healthcare, IoT]
team_size_led: 0
counts_as_experience: true
# --- harvesting ---
repos: []
author_identities: []
harvested_at: null
# --- how it appears in the CV ---
show_in_cv: true
show_in_portfolio: true   # all jobs, decided by user 2026-10-23
portfolio_order: 7
portfolio_title: "Dosimeter IoT app under NDA (React Native)"
cv_section: experience
cv_client_label: Thermo Fisher Scientific
cv_location: Remote
---

# Thermo Fisher Scientific: radiation dosimeter app

## 1. Project overview

An IoT healthcare mobile app for iOS and Android that communicates with radiation dosimeters over Bluetooth, stores dosimeter data offline-first in Realm, and transfers data over MQTT.

Medical staff who work with radiation use the app to track their dose and prevent overexposure. The app reads radiation dosimeters over Bluetooth and sends the data to an IoT server over MQTT (doc:portfolio-2025-04, approved by user 2026-10-22).

TODO (needs user input): team size and organization context.

## 2. Main features

Bluetooth connection to radiation dosimeters, secure login, local storage and filtering of dosimeter data, and dosimeter firmware updates (from the CV). Three roles (user, admin, superuser); syncing many dosimeters at once, with a main screen showing sync progress, sync errors and sync time; details of the current or last sync; a sync history stored locally and filterable by date range, wearer, errors and ID; profile, settings and a logs screen for superusers; secure values kept in the device keychain (doc:portfolio-2025-04, approved by user 2026-10-22).

## 3. My role and responsibilities

Software Engineer (not an architect role). Built the app from scratch and designed its overall architecture (confirmed by user 2026-10-22), and took part in a team-wide performance effort.

Built the API layer between the screens and the backend (REST, MQTT and Bluetooth), the OAuth 2.0 login, MQTT integration, background jobs on Android and iOS, native modules and the Realm database setup with filtering. Fixed and rewrote React Native and native libraries where needed. Took part in project meetings and code reviews, and suggested UI improvements (doc:portfolio-2025-04, approved by user 2026-10-22).

TODO (needs user input): key collaborators.

## 4. My contributions

### 4.1 App architecture from scratch

Built an IoT healthcare app from scratch and designed its architecture, as a software engineer rather than in an architect role (confirmed by user 2026-10-22), using React Native, TypeScript, Redux and an offline-first Realm database. The app communicates with radiation dosimeters over Bluetooth.

Tags: architecture, react-native, typescript, redux, realm, offline-first, iot

### 4.2 MQTT over TLS in native libraries

Rewrote legacy native libraries on iOS and Android to use MQTT over TLS with client certificates.

Result: data transfer became 30% faster.
Tags: mqtt, security, native-modules, ios, android, iot

### 4.3 BLE communication accuracy

Improved the accuracy of Bluetooth Low Energy (BLE) communication with the dosimeter, built on react-native-ble-plx, by reworking the buffer-reading logic, and improved the dosimeter data parsing so data is no longer overwritten (doc:portfolio-2025-04, approved by user 2026-10-22).

Tags: ble, iot

### 4.4 Dosimeter firmware updates

Built dosimeter firmware updates that run as cross-platform background jobs on Android and iOS.

Tags: iot, background-jobs, android, ios, react-native

### 4.5 Secure login and local data storage

Implemented a secure login flow with OAuth 2.0, and local storage of dosimeter data in Realm with efficient filtering.

Tags: oauth, security, realm, offline-first

### 4.6 Realm rendering and offline performance

Optimized rendering and offline data access in Realm as part of a team-wide performance effort.

Result: the app became 20% faster.
Tags: performance, realm, offline-first

### 4.7 Test-driven development and code reviews

Worked test-first (TDD), covered the code with unit tests, and reviewed teammates' code.

Tags: testing, code-review
Source: doc:portfolio-2025-04

### 4.8 Concurrent sync of many dosimeters

Built the sync flow that reads many dosimeters at the same time and shows progress, errors and timing for each sync, with a sync history filterable by date range, wearer, errors and ID (built by the user, confirmed 2026-10-22).

Tags: iot, ble, react-native, realm
Source: doc:portfolio-2025-04

## 5. Technologies and frameworks

- **Language:** TypeScript (hands-on)
- **Mobile:** React Native (hands-on), native iOS and Android libraries (hands-on), cross-platform background jobs (hands-on)
- **State:** Redux (hands-on)
- **Data:** Realm, offline-first (hands-on)
- **Connectivity:** Bluetooth Low Energy (BLE) (hands-on), react-native-ble-plx (hands-on, confirmed by user 2026-10-22), MQTT over TLS with client certificates (hands-on)
- **Authentication:** OAuth 2.0 (hands-on)
- **Libraries and tools:** Redux Saga, React Navigation, react-native-keychain, react-native-app-auth (OAuth 2.0), a React Native MQTT library, Formik, AsyncStorage, react-native-fs, REST API (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04); Fastlane, ESLint and Husky (used by the project, confirmed by user 2026-10-22, from doc:portfolio-2025-04)

## 6. Skills demonstrated

- Software architecture: 4.1
- React Native: 4.1, 4.4
- IoT: 4.1, 4.2, 4.3, 4.4
- Bluetooth Low Energy (BLE): 4.3
- MQTT: 4.2
- Native modules (iOS/Android): 4.2
- Offline-first data with Realm: 4.1, 4.5, 4.6
- OAuth 2.0 and security: 4.2, 4.5
- Performance optimization: 4.6

## 7. Metrics and outcomes

- Data transfer 30% faster after the MQTT over TLS rewrite (4.2). Source: cv. Confidence: exact.
- App 20% faster after the team-wide performance effort (4.6). Source: cv. Confidence: exact.
- 15% increase in customer satisfaction from the team's scalable solutions (4.6). Source: previous CV, confirmed by user 2026-10-15. Confidence: exact.

## 8. Portfolio material

TODO (needs user input)

## 9. Confidentiality notes

None known. TODO (needs user input)
