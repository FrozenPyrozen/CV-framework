---
schema_version: 1
id: omo-systems-smart-home
source: cv
# --- the job ---
client: OMO Systems
role: Team Leader
engagement: full-time              # confirmed by user 2026-10-15 (earlier recorded as contract)
period: { start: 2021-04, end: 2021-12 }
domain: [IoT, Smart home]
team_size_led: 3                   # about 3 engineers (user, 2026-10-16)
counts_as_experience: true
# --- harvesting ---
repos: []
author_identities: []
harvested_at: null
# --- how it appears in the CV ---
show_in_cv: true
show_in_portfolio: true   # all jobs, decided by user 2026-10-23
portfolio_order: 8
portfolio_title: "Smart-home ecosystem IoT device management app for OMO Systems (React Native)"
cv_section: experience
cv_client_label: OMO Systems
cv_location: Remote
---

# OMO Systems: smart-home mobile app

## 1. Project overview

The core mobile app for controlling smart-home IoT devices, built in the R&D department. The app has paid features behind an automated monthly payment flow.

A smart-home app for residents of multi-apartment buildings, sold in several countries. It combines access control, security and home automation for the whole building and each apartment (doc:portfolio-2025-04, approved by user 2026-10-22).

TODO (needs user input): organization context.

## 2. Main features

Control of smart-home IoT devices, a monthly paid subscription that unlocks features, and face-recognition unlock on Android (from the CV). Opening entrances, doors, barriers, elevators, gates and waste bins from the app; live cameras and video archives synced with motion sensors; apartment security with door and window sensors and automatic gas and water shut-off on leaks; automation scenarios (for example, start recording when a motion sensor fires); sharing the home with family members; face recognition for cameras; and a security mode that raises an alarm and calls a security team (doc:portfolio-2025-04, approved by user 2026-10-22).

## 3. My role and responsibilities

Team Leader in the R&D department. Led and mentored a team of about 3 engineers (team size confirmed by user 2026-10-16): ran code reviews, set coding standards and onboarded new engineers.

Feature owner of the app's subscription billing (doc:portfolio-2025-04, approved by user 2026-10-22).

TODO (needs user input): key collaborators.

## 4. My contributions

### 4.1 Core smart-home mobile app

Delivered the core mobile app for controlling smart-home IoT devices in the R&D department, built with React Native (confirmed by user 2026-10-20).

Tags: iot, react-native

### 4.2 Mobile architecture refactoring proposal

Proposed a refactoring of the mobile app architecture.

Result: the proposal won 1st place at a local hackathon.
Tags: architecture

### 4.3 Automated monthly payment flow

Built an automated monthly payment flow with a payment gate in React that restricts features for users who have not paid. The payment flow was a React single-page app built from scratch and shown in a web view inside the mobile app, and unpaid devices and features were blocked in the app (doc:portfolio-2025-04, approved by user 2026-10-22).

Result: company income grew 10x after launch.
Tags: payments, react

### 4.4 Secure face-recognition unlock on Android

Fixed insecure face-recognition unlock on specific Android devices by patching in a native Android biometrics library. The fix was a patch to react-native-keychain for face and fingerprint biometric login on Samsung devices (doc:portfolio-2025-04, approved by user 2026-10-22).

Tags: security, android, native-modules

### 4.5 Team leadership and mentoring

Led and mentored a team of about 3 engineers (team size confirmed by user 2026-10-16): ran code reviews, set coding standards and onboarded new engineers.

Tags: leadership, mentoring, code-review

### 4.6 Video stream fixes in the video player library

Fixed video stream issues in react-native-vlcplayer by patching the library.

Tags: react-native, native-modules, debugging, iot
Source: doc:portfolio-2025-04

## 5. Technologies and frameworks

- **Language:** TypeScript (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **UI:** React (hands-on)
- **Mobile:** React Native (hands-on, confirmed by user 2026-10-20), native Android biometrics library, applied as a patch (hands-on)
- **Domain:** IoT smart-home devices (hands-on)
- **Connectivity:** MQTT (used in the project, confirmed by user 2026-10-22; hands-on not stated). The April 2025 portfolio's second OMO technology list was a copy of the dosimeter app's list and is ignored (user 2026-10-22).
- **Payments:** payment gate in a React web view with react-native-webview (hands-on; WebView confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **Navigation and state:** React Navigation and Wix React Native Navigation, Redux (react-redux), Reselect, Redux Saga (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **Libraries patched:** react-native-vlcplayer (video streams), react-native-keychain (biometric login) (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **Release:** Fastlane (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **Access and identity:** Amazon Cognito (react-native-aws-cognito-js), NFC card emulation (react-native-nfc-hce) (used by the project, confirmed by user 2026-10-22, from doc:portfolio-2025-04)

TODO (needs user input): state management and other tools used.

## 6. Skills demonstrated

- IoT: 4.1
- Software architecture: 4.2
- Payments: 4.3
- React: 4.3
- Mobile security: 4.4
- Android native modules: 4.4
- Team leadership: 4.5
- Mentoring and onboarding: 4.5
- Code review and coding standards: 4.5

## 7. Metrics and outcomes

- 1st place at a local hackathon for the architecture refactoring proposal (4.2). Source: cv. Confidence: exact.
- Company income grew 10x after the payment flow launched (4.3). Source: cv. Confidence: exact.
- 20% increase in team efficiency from leading and mentoring the team (4.5). Source: previous CV, confirmed by user 2026-10-15. Confidence: exact.

## 8. Portfolio material

- image: ../sources/media/portfolio-2025-04/image1.tif
  caption: Smart-home app
  public: yes, confirmed by user 2026-10-23

TODO (needs user input)

## 9. Confidentiality notes

None known. TODO (needs user input)
