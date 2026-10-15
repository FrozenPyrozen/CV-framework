# Work Summary — Mobile (Orion) and Android (MPM HealthBook / Centros Health)

_Derived from git history of two repositories, matching the author identities `Kyrylo Kokhan`, `Kyrylo_Kokhan` and `FrozenPyrozen` (all the same person). Commit counts are non-merge commits across all branches._

| Repository | Period | Commits | Churn (approx.) | Stack |
| --- | --- | --- | --- | --- |
| `orion-mobile` (Lumiere app) | Jun 2024 – Apr 2025 | 39 | +2,860 / −1,368 across 175 file-changes | React Native, JS/TS, Expo |
| `MPM_HealthBook_Android` (Centros Health) | Aug 2024 – Apr 2025 | 107 | +1,403 / −851 across 198 file-changes | Native Android, Java/Kotlin, Gradle |

---

## 0. About the projects

### Orion Mobile — "Lumiere" (Clinical Ink)
**What it is:** the patient-facing mobile app of Clinical Ink's clinical-trial platform (eCOA / patient engagement). Study participants use it to complete trial tasks, view study content, and join visits with their clinic. It is a React Native + Expo app (mixed modern TypeScript and legacy JavaScript, about 105k lines in `src`) using Expo Continuous Native Generation, so the native iOS and Android code is generated rather than stored. Roughly 11,800 commits of history.

**What it does and its main features:**
- **Patient onboarding and security:** activation/registration codes, account and security questions, password create/reset, PIN and passcode lock, "returning user" flow, and biometric-style security walls (PIN, password, security question) before sensitive screens.
- **Tasks and schedule:** Today, Upcoming and Episodic task lists, week/day/month scheduling, timed tasks with expiry and recall periods, task cards, and task history.
- **Activities / questionnaires (eCOA):** a dynamic questionnaire engine with many input types: multiple choice, text, date/time, sliders, visual analogue scales (VAS), numeric rating scales, weight/height, temperature, blood pressure, image capture, and dynamic clinical inputs. It also has review screens and rule-based logic (`json-rules-engine`, `calculation-engine`).
- **Appointments and televisit:** appointment details and cards, and in-app video visits over AWS Chime, with camera, mute and speaker controls.
- **Study library:** patient documents and videos (PDF viewer, in-app browser, video player, thumbnails, history).
- **Your Clinic / You tabs:** clinic details and contact, study details, account, settings and about screens. The four main tabs are Home, Clinic, Library and You.
- **Task metrics:** completion progress and status dashboards.
- **Offline-first sync:** works without a connection (offline banner, persisted Redux and Apollo cache, Realm/MMKV storage) and syncs answers and files later (auto-sync, unsynced-task recovery, admin backup/sync dashboard).
- **Notifications and reminders:** Firebase push notifications, local task reminders and background fetch.
- **Localisation and accessibility:** multi-language translations (i18next) and localized activity images.
- **Multiple environments:** app variants (development, early, valid, hotfix, defect, legacy, production) built through EAS Build, with Sentry for monitoring.

### MPM HealthBook Android — Centros Health
**What it is:** the native Android counterpart for the same clinical-trial patient-engagement product (package `com.clinicalink.centroshealth`, "Centros Health" / AtHome). It is a long-running Java/Kotlin app, since 2.x releases, with encrypted local storage, scheduled event notifications and visit/questionnaire downloads. Your work there was mostly platform maintenance: certificate rotation, SQLCipher and Android 14 migrations, and production crash fixes.

---

## 1. Orion Mobile (`orion-mobile` / `Lumiere`)

### 1.1 Library / Documents module refactor (Feb – Mar 2025) — largest feature
- Reworked the legacy Library flow: removed `LibraryScreen.js`, `DocumentSectionContainer.js` and the old `studyLib/libUtil.js` (~290 lines), replacing them with a TypeScript `PatientLibraryDocumentsScreen` plus small components (`DocumentItem`, `NoDocuments`, `ViewAllBtn`).
- Moved `libUtil` into TypeScript and greatly expanded its unit tests (`libUtil.test.ts`, +385 lines), added a ~650-line `PatientLibraryDocumentsScreen` test, and fixed related snapshot, unit-test and TS pipeline failures.
- Wired up navigation routes, updated the `libUtil` path on the video screen, removed a non-existent `RegisterUserCode` route/screen, and addressed PR review comments.
- Touched `studyReducer.ts`, `useTelevisit.ts` and other consumers, and added Babel/Prettier config updates.

### 1.2 Safe-area and layout fixes (Mar – Apr 2025)
- **OR-22199**: replaced every `SafeAreaView` from `react-native` with the one from `react-native-safe-area-context`. This was a wide change touching activities, YourClinic, adminSync and more. Centralised the `edges` setting in a constant, later removed the unused `SAFE_AREA_EDGES_DEFAULT`, and added an ESLint rule to enforce the new import.
- **OR-22045**: fixed the library document name overlapping notification-bar icons (status-bar margin, `expo-constants` pinned back to ~17.0.6, no extra edges on DocumentViewer / InAppBrowserScreen / VideoPlayer).
- **OR-22511**: made the document screens share one header style.
- Made the Activity screen use a flex layout.

### 1.3 Auth / forgot-password UX (Apr 2025)
- **OR-22441**: removed the extra "passwords do not match" error when the password is too short. This included comparing the two fields even when one is invalid and ignoring `password1Valid` for the mismatch message.
- **OR-22439**: fixed text-input top padding on iPhone in the forgot-password flow.

### 1.4 Other bug fixes
- **OR-22478**: fixed "Cannot load document" when completing a task that has a document (removed path concatenation inside `fileExists`).
- **OR-22126**: stopped re-writing `expireDate` for episodic timed tasks, which had caused tasks to land in the recall period after sign-out.
- **OR-20172**: fixed login by PIN on the first attempt (`APIDataManager`).
- **OR-20094**: device-deactivation / data-sync diagnostics (logging in `RecoverDataSync`, `TaskUtility`, `UnsyncTaskUtility`), TS path aliases for navigation imports, ESLint fixes.
- **OR-19372**: multichoice `codedSelection` was wrong when the value was a float.
- **OR-17664**: image capture appeared stretched on Android; fixed by wrapping it in a `View` (3 iterations).

---

## 2. MPM HealthBook Android (Centros Health)

### 2.1 ENGAGE-8689 — Certificate update (Aug – Sep 2024)
- Replaced the pinned backend SSL certificates (`centrospinning.cer` and the backup) for the 2024 backend rotation.
- Bumped the app to 2.21.3 and then 2.22.0.

### 2.2 ENGAGE-8704 — SQLCipher update for Play Store (Sep 2024)
- Upgraded SQLCipher to meet Play Store requirements. Updated `DatabaseHelper` and `SQLCipherUtils`, moved exception imports from `net.sqlcipher.database` to `android.database.sqlite` (per the sqlcipher 4.5.4 release), and resolved the `loadLibs` / `SupportSQLiteDatabase` build errors.
- Adjusted `androidx.sqlite` versions to keep a lower min SDK; version bumps to 2.22.x.

### 2.3 ENGAGE-8677 — Android 14 / SDK 34 migration (Sep – Oct 2024) — largest effort
- Raised `compileSdk` / `targetSdk` to 34, Gradle plugin to 8.2.2, new Gradle distribution, Java 17 source/target compatibility, Kotlin / Jacoco / Dagger / `kotlinx-metadata-jvm` updates, namespaces, BuildConfig, `kotlin-parcelize`, and removal of `dexOptions`.
- Android 14 behaviour changes: scheduled exact alarms are denied by default (`AppUtils`), regex handling changes for OpenJDK 17 (`PasswordView`), PendingIntent fixes in `EventNotificationReceiver`.
- About 20 iterative commits fixing Jenkins `CentrosHealth_Android_QA` builds 267–285 (R8, Joda-Time, resource IDs, `ReviewFragment.kt`).
- Post-upgrade regressions:
  - Login crash `Cannot deserialize value` / "TypeReference constructed without actual type information", caused by the Jackson version. Bisected versions (2.8.x → 2.17.2), then enabled case-insensitive enums, renamed the `NumberQuestionCodingMode` enums, and added a `JacksonRequest` constructor taking classes instead of `TypeReference` (questionnaires, content, visits).
  - `androidx.work` update to 2.9.1 for a `NoSuchMethodError`.
  - Logout/cursor issue from the cursor package change (rolled back); release bumped to 2.22.1.

### 2.4 ENGAGE-8709 — `startActivity` crash on login/notifications (Oct – Nov 2024)
- Added `FLAG_ACTIVITY_NEW_TASK`, error handling in `CentrosHomeActivity`, `VisitManagerImpl` subscribe errors, and moved `PendingIntent` logic in `setNotificationOn`.
- Added extensive diagnostic logging across `LoginActivity`, `LoginFailHandler`, `TasksFragment`, `AppUtils`, `EventDaoImpl` and `ReactiveStudyAndDataDownloader`.
- Disabled the exact-alarm path for Android 14 and restored redirect-to-permission on re-register; version code set to 78.

### 2.5 ENGAGE-8713 — Crash after updating to 2.22.0 (Nov 2024 – Apr 2025, still in progress)
- Crash on app update came from encrypted-DB compatibility. Steps taken:
  - Raised `DATABASE_VERSION` to 32.
  - Downgraded `android-database-sqlcipher` to 4.5.1 and tuned `androidx.sqlite` versions.
  - Added a 3.x→current migration hook (`postKey`) in the `DatabaseHelper` constructor.
  - Added `checkCipherSettings` to compare cipher config before and after migration, and set cipher settings to match the previous DB.
  - Toggled `allowBackup` to extract the DB from an emulator for comparison.
- April 2025 work (the latest commits): logging around decrypt keys, and why `SharedPreference` is empty after installing the updated app.
- Branch: `dev_changes-for-engage-8677-update-android`.

---

## 3. Tech stack

### 3.1 Orion Mobile (from `Lumiere/package.json`)

| Area | Technologies |
| --- | --- |
| Core | React 18.3.1, React Native 0.76.9, Expo SDK 52 (`expo` ^52.0.44, dev-client, updates, build-properties), TypeScript ~5.3.3, Node ≥ 22, Yarn |
| Navigation | `@react-navigation/native` 6, `native-stack`, `bottom-tabs`, `compat`; `react-native-screens`, `react-native-tab-view`, `react-native-pager-view`, `react-native-drawer-layout` |
| State / data flow | Redux 4.2.1, `@reduxjs/toolkit` 2, `react-redux` 7, `redux-saga`, `redux-thunk`, `redux-persist` (+ sensitive-storage and encrypt transform), `@redux-offline/redux-offline` |
| API / backend | Apollo Client 3, `aws-appsync`, GraphQL, `axios`, `apisauce`, `cross-fetch`; AWS SDK v3 (S3 + presigner, Cognito Identity Provider, Chime SDK Meetings), `aws-amplify` 2.3, `amazon-cognito-identity-js` |
| Storage / security | `react-native-mmkv`, `@react-native-async-storage/async-storage`, `realm` 12, `react-native-sensitive-info`, `react-native-crypto-js`, `react-native-fs` / `blob-util` / `zip-archive` |
| Notifications / background | `@react-native-firebase/app` + `messaging`, `react-native-push-notification`, `push-notification-ios`, `react-native-background-fetch`, `react-native-incall-manager` (televisit) |
| UI | `react-native-elements`, `react-native-reanimated` 3.16, `gesture-handler`, `react-native-svg` (+ transformer), `safe-area-context` 4.12, `react-native-webview`, `react-native-pdf`, `react-native-render-html`, `expo-image`, `expo-camera`, `expo-video`, `react-native-date-picker`, `react-native-modal`, `vector-icons` |
| i18n / utilities | `i18next` / `react-i18next`, `expo-localization`, `react-native-localize`, `date-fns`, `moment` (+ timezone), `lodash`, `mathjs`, `json-rules-engine`, `uuid`, `use-debounce` |
| Internal packages | `@orion/calculation-engine`, `@orion/fe-utils` (from the private AWS CodeArtifact npm repo) |
| Monitoring | `@sentry/react-native`, `reactotron-react-native` / `reactotron-redux` (dev), `expo-atlas` |
| Testing | Jest 29 (`jest-expo`, `ts-jest`, `babel-jest`), `@testing-library/react-native`, `redux-mock-store` |
| Code quality | ESLint 8 (expo, standard, prettier, react-native, import/n/promise plugins), Prettier 3 (`@ianvs` import sorting), Husky 9, `lint-staged`, `tsc-files`, `patch-package` |
| Build / release | EAS Build (profiles: development, preview, early, valid, hotfix, defect, legacy, production), custom `set-env` / `generate-eas-json` scripts via `ts-node`, EAS build hooks, AWS CodeArtifact login |

### 3.2 MPM HealthBook Android (from the commit history, not a manifest)

| Area | Technologies |
| --- | --- |
| Language / build | Java and Kotlin, Gradle (Android Gradle Plugin 8.2.2), Java 17, compileSdk / targetSdk 34 |
| Data / security | SQLCipher (`net.zetetic:android-database-sqlcipher` 4.5.x), `androidx.sqlite`, SSL certificate pinning |
| Networking / serialization | Volley (`JacksonRequest`), Jackson (`ObjectMapper`) |
| Framework libraries | Dagger, `androidx.work` (WorkManager) 2.9.1, RxJava, Joda-Time, `kotlin-parcelize` |
| Platform features | AlarmManager exact alarms, PendingIntent notifications, Android 14 behaviour changes |
| CI / quality | Jenkins (`CentrosHealth_Android_QA`), Jacoco, R8 |

---

## 4. Skills demonstrated
- **React Native**: large refactors with TypeScript migration, shared-layout / safe-area handling across iOS and Android, navigation, Jest unit and snapshot testing, ESLint / Prettier / CI pipeline fixes.
- **Native Android**: API-level migrations (SDK 34, Android 14 behaviour changes), Gradle and Java 17 build modernisation, SQLCipher / encrypted database migration, Jackson serialization debugging, PendingIntent / alarm / notification handling.
- **Debugging**: version bisecting of dependencies, adding targeted logging to isolate production-only crashes, CI log-driven fixes.
- **Delivery**: Jira-keyed bug fixing (OR-*, ENGAGE-*), PR review iterations, release version bumps.

---

_Note: ENGAGE-8713 was still open at the last commit (2025-04-29), and `orion-mobile` shows no commits of yours after 2025-04-10 apart from a stash entry. Remote data may be stale because `git fetch` failed earlier._
