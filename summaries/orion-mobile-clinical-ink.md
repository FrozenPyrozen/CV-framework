---
schema_version: 1
id: orion-mobile-clinical-ink
source: git
# --- the job ---
client: Clinical Ink
role: Senior React Native Engineer
engagement: contract
period: { start: 2024-06, end: 2025-04 }
domain: [Healthcare, Clinical trials]
team_size_led: 0
counts_as_experience: false
# --- harvesting ---
repos:
  - { name: orion-mobile, remote: TODO (needs user input) }
  - { name: MPM_HealthBook_Android, remote: TODO (needs user input) }
author_identities: []
harvested_at: "2026-10-15"
# --- how it appears in the CV ---
show_in_cv: true
cv_section: consulting
cv_order: 1
cv_client_label: Clinical Trials Patient App
cv_location: Remote
---

## 1. Project overview

A patient-facing mobile product for clinical trials (eCOA and patient engagement). Study participants use it to complete trial tasks and questionnaires, view study content, and join visits with their clinic. The engagement covered two repositories of the same product:

- **React Native app** (`orion-mobile`): the current patient app, built with React Native and Expo. The code base mixes modern TypeScript with legacy JavaScript (about 105k lines in the source folder) and has roughly 11,800 commits of history. It uses Expo Continuous Native Generation, so the native iOS and Android projects are generated at build time instead of being stored in the repo.
- **Native Android app** (`MPM_HealthBook_Android`): the long-running native Android counterpart of the same product, written in Java and Kotlin and released since the 2.x versions. It keeps data in an encrypted local database, schedules event notifications, and downloads visits and questionnaires.

My work ran from June 2024 to April 2025 in the React Native app and from August 2024 to April 2025 in the Android app. In the React Native app it was feature refactoring, layout and bug fixing; in the Android app it was mostly platform maintenance: certificate rotation, SQLCipher and Android 14 migrations, and production crash fixes.

Team size and collaborators: TODO (needs user input)

## 2. Main features

React Native app:

- **Patient onboarding and security:** activation and registration codes, account and security questions, password creation and reset, PIN and passcode lock, a returning-user flow, and security walls (PIN, password or security question) before sensitive screens.
- **Tasks and schedule:** Today, Upcoming and Episodic task lists, day, week and month scheduling, timed tasks with expiry and recall periods, task cards and task history.
- **Questionnaires (eCOA):** a dynamic questionnaire engine with many input types (multiple choice, text, date and time, sliders, visual analogue scales, numeric rating scales, weight and height, temperature, blood pressure, image capture and dynamic clinical inputs), review screens, and rule-based logic driven by a rules engine and a calculation engine.
- **Appointments and televisits:** appointment details and cards, and in-app video visits over AWS Chime with camera, mute and speaker controls.
- **Study library:** patient documents and videos, with a PDF viewer, in-app browser, video player, thumbnails and history.
- **Clinic and profile tabs:** clinic details and contact, study details, account, settings and about screens. The four main tabs are Home, Clinic, Library and You.
- **Task metrics:** completion progress and status dashboards.
- **Offline-first sync:** works without a connection (offline banner, persisted state and GraphQL cache, local database and key-value storage) and syncs answers and files later, with automatic sync, recovery of unsynced tasks and an admin backup and sync dashboard.
- **Notifications and reminders:** push notifications, local task reminders and background fetch.
- **Localization:** multi-language translations and localized activity images.
- **Multiple environments:** several app variants (development, early, valid, hotfix, defect, legacy, production) built in the cloud, with crash and error monitoring.

Native Android app:

- Encrypted local storage of study data, scheduled event notifications, and download of visits and questionnaires for the same patient-engagement product.

## 3. My role and responsibilities

Senior React Native Engineer on a contract, working in both repositories:

- **React Native app:** refactoring legacy modules to TypeScript with tests, shared layout and safe-area handling across iOS and Android, navigation changes, fixing patient-facing bugs, and fixing lint, TypeScript and test pipeline failures. Worked through pull request review iterations.
- **Native Android app:** platform maintenance and releases: the Android 14 / SDK 34 migration, the SQLCipher upgrade for Google Play, the rotation of pinned SSL certificates, investigation and fixing of production crashes, and app version bumps.
- **Process:** ticket-driven bug fixing and feature work, pull request reviews, and release version bumps.

Key collaborators: TODO (needs user input)

## 4. My contributions

### 4.1 Patient clinical trial app in React Native and native Android

Developed and maintained the patient-facing clinical trial (eCOA) app across its two code bases: the React Native app built with Expo and TypeScript (39 commits from June 2024 to April 2025), and the native Android app in Java and Kotlin (107 commits from August 2024 to April 2025). Work in the React Native app covered the study library, layout, authentication screens, tasks and questionnaires; work in the Android app covered platform upgrades, encrypted storage, security and crash fixing. Details are in 4.2 to 4.6.

Tags: react-native, expo, typescript, javascript, android, healthcare

### 4.2 Library and documents module refactor to TypeScript with tests

React Native app, February to March 2025, my largest feature there. Reworked the legacy study library flow: removed the old JavaScript library screen, document section container and library utility module (about 290 lines) and replaced them with a new TypeScript patient documents screen built from small components (document item, empty state, "view all" button). Moved the library utilities to TypeScript and greatly expanded their unit tests, added a large test for the new documents screen, and fixed the related snapshot, unit test and TypeScript pipeline failures. Wired up the navigation routes, updated the video screen to use the moved utilities, removed a route and screen that no longer existed, and updated the study reducer, the televisit hook and other consumers. Also updated the Babel and Prettier configuration, and addressed pull request review comments.

Result: about 1,000 lines of new tests (about 385 lines of utility unit tests and about 650 lines of screen tests).
Tags: react-native, typescript, legacy-migration, testing, redux, code-quality

### 4.3 Safe-area migration enforced by an ESLint rule

React Native app, March to April 2025. Replaced every use of the built-in React Native safe-area view with the one from react-native-safe-area-context, a wide change touching questionnaires, the clinic screens, the admin sync screens and more. Centralized the safe-area edge setting in one constant, later removed an unused default, and added an ESLint rule so new code must use the new import. Related layout fixes: the library document title overlapping the status-bar icons (status-bar margin, pinning expo-constants back to version 17.0.6, and no extra safe-area edges on the document viewer, in-app browser and video player), one shared header style for all document screens, and a flex layout for the activity screen.

Result: layout overlaps fixed on iOS and Android, and the new safe-area approach is enforced by lint.
Tags: react-native, expo, ios, android, code-quality, legacy-migration

### 4.4 Android 14 (SDK 34) migration

Native Android app, September to October 2024, my largest effort there. Raised compile and target SDK to 34, moved to Android Gradle Plugin 8.2.2 with a new Gradle distribution and Java 17 source and target compatibility, and updated Kotlin, Jacoco, Dagger and Kotlin metadata libraries. Added namespaces and BuildConfig settings, the Kotlin parcelize plugin, and removed obsolete dex options. Handled Android 14 behavior changes: exact alarms denied by default, regex handling changes in OpenJDK 17 (password validation view) and PendingIntent changes in the event notification receiver. Fixed the QA builds on Jenkins over about 20 iterative commits (R8, Joda-Time, resource IDs, a Kotlin review screen).

Fixed regressions after the upgrade: a login crash on deserialization caused by the Jackson version, found by bisecting Jackson versions from 2.8.x to 2.17.2 and fixed by enabling case-insensitive enums, renaming the numeric question coding enums, and adding a request constructor that takes classes instead of type references (used for questionnaires, content and visits); a missing-method crash fixed by updating androidx.work to 2.9.1; and a logout and cursor issue caused by a cursor package change, which was rolled back. Released as version 2.22.1.

Tags: android, legacy-migration, ci-cd, debugging

### 4.5 SQLCipher upgrade and SSL certificate pinning rotation

Native Android app, August to September 2024. Replaced the pinned backend SSL certificates (main and backup) for the 2024 backend certificate rotation, and released versions 2.21.3 and 2.22.0. Upgraded SQLCipher to meet Google Play requirements: updated the database helper and SQLCipher utilities, moved exception imports to the Android SQLite package as required by SQLCipher 4.5.4, fixed the resulting library loading and database interface build errors, and adjusted androidx.sqlite versions to keep a lower minimum SDK. Released as 2.22.x versions.

Result: the app met the Google Play requirement for the encrypted database library and kept working with the rotated backend certificates.
Tags: android, security

### 4.6 Production crash and bug fixes

Native Android app:

- **Crash when starting screens from login and notifications** (October to November 2024): added the new-task flag when starting screens, error handling in the home screen and the visit manager subscription, and moved the PendingIntent logic for notifications. Added detailed diagnostic logging across login, login failure handling, tasks, app utilities, the event database layer and the study data downloader. Disabled the exact-alarm path on Android 14 and restored the redirect to the permission screen on re-registration; set the version code to 78.
- **Crash after updating to version 2.22.0** (November 2024 to April 2025, still open at my last commit on 2025-04-29): the crash came from encrypted database compatibility on app update. Raised the database version to 32, downgraded SQLCipher to 4.5.1 and tuned androidx.sqlite versions, added a migration hook from 3.x databases in the database helper, added a check that compares cipher settings before and after migration and set the cipher settings to match the previous database, and temporarily allowed backups to extract the database from an emulator for comparison. The last work (April 2025) added logging around the decryption keys and investigated why shared preferences were empty after installing the updated app.

React Native app:

- **Password reset:** removed the extra "passwords do not match" error shown when the password is too short, and fixed the text input top padding on iPhone in the forgot-password flow.
- **Documents:** fixed "Cannot load document" when completing a task that has a document (a wrong file path check).
- **Task scheduling:** stopped rewriting the expiry date of episodic timed tasks, which had moved tasks into the recall period after sign-out.
- **PIN login:** fixed login by PIN on the first attempt.
- **Device deactivation and data sync:** added diagnostic logging to data sync recovery and task utilities, TypeScript path aliases for navigation imports, and ESLint fixes.
- **Questionnaires:** fixed the wrong coded selection in multiple choice questions when the value was a decimal number.
- **Image capture:** fixed the image capture view appearing stretched on Android (three iterations).

Tags: android, react-native, debugging, healthcare, offline-first

## 5. Technologies and frameworks

React Native app (versions from the app's package manifest):

| Category | Technology | Use |
|---|---|---|
| Language | TypeScript ~5.3.3 | **hands-on** |
| Language | JavaScript (legacy code) | **hands-on** |
| Core | React 18.3.1 | **hands-on** |
| Core | React Native 0.76.9 | **hands-on** |
| Core | Expo SDK 52 (dev client, updates, build properties) | **hands-on** (expo-constants version fix); other Expo modules **used by the project** |
| Core | Node 22 or later, Yarn | **used by the project** |
| Navigation | React Navigation 6 (native stack, bottom tabs, compat) | **hands-on** (route changes) |
| Navigation | react-native-screens, react-native-tab-view, react-native-pager-view, react-native-drawer-layout | **used by the project** |
| State | Redux 4.2.1, Redux Toolkit 2, React Redux 7 | **hands-on** (study reducer changes) |
| State | Redux Saga, Redux Thunk, Redux Persist (with sensitive storage and encryption transform), Redux Offline | **used by the project** |
| API and backend | Apollo Client 3, AWS AppSync, GraphQL, axios, apisauce, cross-fetch | **used by the project** |
| API and backend | AWS SDK v3 (S3 with presigner, Cognito Identity Provider, Chime SDK Meetings), AWS Amplify 2.3, Amazon Cognito Identity | **used by the project** |
| Storage and security | MMKV, AsyncStorage, Realm 12, react-native-sensitive-info, react-native-crypto-js, file system, blob and zip libraries | **used by the project** |
| Notifications and background | Firebase app and messaging, react-native-push-notification, iOS push notifications, background fetch, in-call manager (televisit) | **used by the project** |
| UI | react-native-safe-area-context 4.12 | **hands-on** |
| UI | React Native Elements, Reanimated 3.16, Gesture Handler, react-native-svg (with transformer), WebView, react-native-pdf, render-html, expo-image, expo-camera, expo-video, date picker, modal, vector icons | **used by the project** |
| i18n and utilities | i18next and react-i18next, expo-localization, react-native-localize, date-fns, moment (with timezone), lodash, mathjs, json-rules-engine, uuid, use-debounce | **used by the project** |
| Internal packages | private calculation engine and front-end utilities, from a private npm registry on AWS CodeArtifact | **used by the project** |
| Monitoring | Sentry for React Native, Reactotron (development), Expo Atlas | **used by the project** |
| Testing | Jest 29 (jest-expo, ts-jest, babel-jest), unit and snapshot tests | **hands-on** |
| Testing | React Native Testing Library (confirmed by user 2026-10-15) | **hands-on** |
| Testing | redux-mock-store | **used by the project** |
| Code quality | ESLint 8 (expo, standard, prettier, react-native, import, n and promise plugins) | **hands-on** (added a rule, fixed lint errors) |
| Code quality | Prettier 3 (with import sorting), Babel configuration | **hands-on** (configuration updates) |
| Code quality | Husky 9, lint-staged, tsc-files, patch-package | **used by the project** |
| Build and release | EAS Build (profiles: development, preview, early, valid, hotfix, defect, legacy, production), environment and build-config scripts run with ts-node, EAS build hooks, CodeArtifact login | **used by the project** |

Native Android app (from the commit history, not from a manifest):

| Category | Technology | Use |
|---|---|---|
| Language | Java, Kotlin | **hands-on** |
| Build | Gradle, Android Gradle Plugin 8.2.2, Java 17, compile and target SDK 34 | **hands-on** |
| Data and security | SQLCipher (android-database-sqlcipher 4.5.x), androidx.sqlite | **hands-on** |
| Data and security | SSL certificate pinning | **hands-on** |
| Networking and serialization | Volley (custom Jackson request), Jackson | **hands-on** |
| Framework libraries | Dagger, androidx.work (WorkManager) 2.9.1, Joda-Time, Kotlin parcelize | **hands-on** (version updates and build fixes) |
| Framework libraries | RxJava | **used by the project** |
| Platform features | AlarmManager exact alarms, PendingIntent notifications, Android 14 behavior changes | **hands-on** |
| CI and quality | Jenkins, Jacoco, R8 | **hands-on** (build fixes and updates) |

## 6. Skills demonstrated

- React Native: 4.1, 4.2, 4.3, 4.6
- Expo: 4.1, 4.3
- TypeScript, including migration of legacy JavaScript: 4.1, 4.2
- Native Android (Java, Kotlin, Gradle): 4.1, 4.4, 4.5, 4.6
- Android API-level migration (SDK 34, Android 14 behavior changes, Java 17 build modernization): 4.4
- SQLCipher and encrypted database migration: 4.5, 4.6
- SSL certificate pinning: 4.5
- Unit and snapshot testing with Jest: 4.2
- ESLint, Prettier and pipeline fixes: 4.2, 4.3, 4.6
- Cross-platform layout and safe-area handling (iOS and Android): 4.3
- Navigation: 4.2
- Redux: 4.2
- Jackson serialization debugging: 4.4
- PendingIntent, alarm and notification handling: 4.4, 4.6
- Jenkins CI build fixing: 4.4
- Debugging production crashes (dependency version bisecting, targeted logging, CI log-driven fixes): 4.4, 4.6
- Delivery: ticket-driven bug fixing, pull request review iterations, release version bumps: 4.2, 4.4, 4.5, 4.6

## 7. Metrics and outcomes

Harvest notes: counts are non-merge commits across all branches, for the author identities "Kyrylo Kokhan", "Kyrylo_Kokhan" and "FrozenPyrozen" (all the same person). The React Native repo shows no commits of mine after 2025-04-10 apart from a stash entry. Remote data may be stale because a fetch failed during the original harvest.

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Commits, React Native app | 39 (June 2024 to April 2025) | git | exact |
| Lines changed, React Native app | +2,860 / −1,368 across 175 file changes | git | approximate |
| Commits, Android app | 107 (August 2024 to April 2025) | git | exact |
| Lines changed, Android app | +1,403 / −851 across 198 file changes | git | approximate |
| React Native app size | about 105k lines in the source folder | git | approximate |
| React Native app history | about 11,800 commits | git | approximate |
| Legacy library utility code removed (4.2) | about 290 lines | git | approximate |
| Library utility unit tests added (4.2) | +385 lines | git | exact |
| Documents screen test added (4.2) | about 650 lines | git | approximate |
| Total new tests in the library refactor (4.2) | about 1,000 lines | git | approximate |
| expo-constants pinned version (4.3) | ~17.0.6 | git | exact |
| Android target and compile SDK (4.4) | 34 (Android 14) | git | exact |
| Android Gradle Plugin (4.4) | 8.2.2 | git | exact |
| Java version (4.4) | 17 | git | exact |
| Commits fixing Jenkins QA builds (4.4) | about 20, covering builds 267 to 285 | git | approximate |
| Jackson versions bisected (4.4) | 2.8.x to 2.17.2 | git | exact |
| androidx.work version (4.4) | 2.9.1 | git | exact |
| App versions released (4.4, 4.5) | 2.21.3, 2.22.0, 2.22.x, 2.22.1 | git | exact |
| SQLCipher versions (4.5, 4.6) | 4.5.4 (upgrade), downgraded to 4.5.1 | git | exact |
| Android version code (4.6) | 78 | git | exact |
| Database schema version (4.6) | 32 | git | exact |
| Image capture fix iterations (4.6) | 3 | git | exact |
| Last commit on the update-crash investigation (4.6) | 2025-04-29 (still open) | git | exact |

## 8. Portfolio material

TODO (needs user input)

## 9. Confidentiality notes

- term: Clinical Ink
- term: Clinicalink
- term: Orion
- term: orion-mobile
- term: Lumiere
- term: MPM HealthBook
- term: MPM_HealthBook_Android
- term: Centros Health
- term: CentrosHealth
- term: centrospinning
- term: AtHome
- term: com.clinicalink.centroshealth
- term: CentrosHealth_Android_QA
- term: "@orion/calculation-engine"
- term: "@orion/fe-utils"
- term: dev_changes-for-engage-8677-update-android
- prefix: OR-                      # tickets: OR-17664, OR-19372, OR-20094, OR-20172, OR-22045, OR-22126, OR-22199, OR-22439, OR-22441, OR-22478, OR-22511
- prefix: ENGAGE-                  # tickets: ENGAGE-8677, ENGAGE-8689, ENGAGE-8704, ENGAGE-8709, ENGAGE-8713
