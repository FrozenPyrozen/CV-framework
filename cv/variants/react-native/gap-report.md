# Gap report: react-native

Built: 2026-10-16 · Profile: react-native · Job ad: no

## Strong evidence
- React Native: General Motors (general-motors-navigation#4.1, #4.3, #4.4, #4.6), Velas (velas-wallet#4.1, #4.8), Thermo Fisher Scientific (thermo-fisher-dosimeter#4.1, #4.4), Clinical Trials Patient App (orion-mobile-clinical-ink#4.1, #4.3, #4.6), consulting (consulting-audits, consulting-rn-upgrades, consulting-interviews).
- Android: native Android (Java / Kotlin) and the Android 14 (SDK 34) migration (orion-mobile-clinical-ink#4.1, #4.4), SQLCipher and SSL certificate pinning (orion-mobile-clinical-ink#4.5), Android biometrics native module (omo-systems-smart-home#4.4), 3x faster first interaction (velas-wallet#4.9).
- Offline-first, IoT and BLE: Realm, BLE, MQTT over TLS, background jobs (thermo-fisher-dosimeter#4.1 to #4.6), smart-home IoT app (omo-systems-smart-home#4.1).
- Performance with numbers: 12x / 5x (velas-wallet#4.2), 3x (velas-wallet#4.9), 30% and 20% (thermo-fisher-dosimeter#4.2, #4.6), 20% engagement / 15% fewer crashes (general-motors-navigation#4.1), up to 50% lower costs (consulting-optimization).
- Leadership: team of 8 (general-motors-navigation#4.1, calc:team_size_led), code reviews and mentoring (general-motors-navigation#4.2, omo-systems-smart-home#4.5), team of 3 (admasters-ecommerce#4.2).
- App distribution: F-Droid and Snapcraft (velas-wallet#4.5).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| iOS-specific work | iOS appears only alongside Android (thermo-fisher-dosimeter#4.2, #4.4; orion-mobile-clinical-ink#4.3); no Swift / Objective-C, App Store or TestFlight work in any summary | user context (2026-10-16): the user says they created iOS native modules and rewrote existing logic for iOS; details to come via /add-experience. Not a confirmed fact yet, so the CV doesn't claim it |
| Mobile CI/CD and store releases | Fastlane, Bitrise (CI/CD) and Detox (E2E) in the General Motors Stack line (general-motors-navigation#5, now pinned); Jenkins build fixes (orion-mobile-clinical-ink#4.4); no bullet describes building a mobile release pipeline or App Store / Google Play releases | add a contribution for mobile release pipelines with /harvest or /add-experience, only if true |
| Expo | named once (orion-mobile-clinical-ink#4.1) | enrich that summary if there was more Expo work (EAS, OTA updates), only if true |
| Recent mobile work at the current job | SYSPRO is web-only (React 19); the latest mobile work is General Motors (to November 2025) and the consulting contract | nothing to add; be ready to explain the move to web in interviews |

## Selection disagreements
- **General Motors:** would take `general-motors-navigation#4.5` (unit-testing strategy, 95% coverage) over `#4.8` (passenger second screen, no outcome); #4.5 carries a number and shows testing leadership.
- **Itjet `#4.4`** (PostgreSQL to AWS RDS) and **Velas `#4.6`** (Node.js staking-rewards backend) are backend work, picked for their performance tag; they're fine as filler, but less relevant to mobile roles.
