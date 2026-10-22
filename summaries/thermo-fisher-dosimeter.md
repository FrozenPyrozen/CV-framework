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
cv_section: experience
cv_client_label: Thermo Fisher Scientific
cv_location: Remote
---

# Thermo Fisher Scientific: radiation dosimeter app

## 1. Project overview

An IoT healthcare mobile app for iOS and Android that communicates with radiation dosimeters over Bluetooth, stores dosimeter data offline-first in Realm, and transfers data over MQTT.

TODO (needs user input): who uses the app, the business problem, and team size and organization context.

## 2. Main features

Bluetooth connection to radiation dosimeters, secure login, local storage and filtering of dosimeter data, and dosimeter firmware updates (from the CV). TODO (needs user input)

## 3. My role and responsibilities

Software Engineer. Architected the app from scratch and took part in a team-wide performance effort.

TODO (needs user input): ownership areas and key collaborators.

## 4. My contributions

### 4.1 App architecture from scratch

Architected an IoT healthcare app from scratch using React Native, TypeScript, Redux and an offline-first Realm database. The app communicates with radiation dosimeters over Bluetooth.

Tags: architecture, react-native, typescript, redux, realm, offline-first, iot

### 4.2 MQTT over TLS in native libraries

Rewrote legacy native libraries on iOS and Android to use MQTT over TLS with client certificates.

Result: data transfer became 30% faster.
Tags: mqtt, security, native-modules, ios, android, iot

### 4.3 BLE communication accuracy

Improved the accuracy of Bluetooth Low Energy (BLE) communication with the dosimeter, built on react-native-ble-plx, by reworking the buffer-reading logic.

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

## 5. Technologies and frameworks

- **Language:** TypeScript (hands-on)
- **Mobile:** React Native (hands-on), native iOS and Android libraries (hands-on), cross-platform background jobs (hands-on)
- **State:** Redux (hands-on)
- **Data:** Realm, offline-first (hands-on)
- **Connectivity:** Bluetooth Low Energy (BLE) (hands-on), react-native-ble-plx (hands-on, confirmed by user 2026-10-22), MQTT over TLS with client certificates (hands-on)
- **Authentication:** OAuth 2.0 (hands-on)

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
