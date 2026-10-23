# Gap report: react-native

Built: 2026-10-23 · Profile: react-native · Job ad: no

## Strong evidence
- **React Native:** General Motors map team, HERE SDK library as a React Native micro-frontend, in-car navigation and the delivery and testing process for nested apps (`general-motors-navigation#4.1`, `#4.3`, `#4.4`, `#4.6`, `#4.9`); Velas wallet (`velas-wallet#4.1`, `#4.10`); Thermo Fisher Scientific (`thermo-fisher-dosimeter#4.1`, `#4.4`, `#4.8`); Wink, 5M+ registered users, and Golfuture built from scratch, Oroscopo features (`itjet-fintech#4.8`, `#4.9`, `#4.10`); Clinical Trials Patient App, including the React Native 0.76 and Expo SDK 52 upgrade (`orion-mobile-clinical-ink#4.1`, `#4.3`, `#4.6`, `#4.7`); consulting audits, upgrades and interviews (`consulting-audits`, `consulting-rn-upgrades`, `consulting-interviews`).
- **Android:** native Android (Java / Kotlin) and the Android 14 (SDK 34) migration (`orion-mobile-clinical-ink#4.1`, `#4.4`), SQLCipher and SSL certificate pinning only in the Skills list (`#4.5` is dropped by the profile, so the summary no longer names them), Android biometrics fix (`omo-systems-smart-home#4.4`), 3x faster first interaction (`velas-wallet#4.9`).
- **Native libraries:** patched react-native-vlcplayer for video stream issues (`omo-systems-smart-home#4.6`) and an Android biometrics library (`#4.4`); rewrote legacy native libraries for MQTT over TLS (`thermo-fisher-dosimeter#4.2`).
- **Offline-first, IoT and BLE:** Realm, MQTT over TLS, background jobs and concurrent sync of many dosimeters (`thermo-fisher-dosimeter#4.1`, `#4.2`, `#4.4`, `#4.6`, `#4.8`), BLE in the summary (`#4.3`), smart-home IoT app (`omo-systems-smart-home#4.1`).
- **Performance with numbers:** staking page loading from 2 minutes to 5 seconds with 5x less battery (`velas-wallet#4.2`), 3x (`velas-wallet#4.9`), 30% and 20% (`thermo-fisher-dosimeter#4.2`, `#4.6`), 20% engagement and 15% fewer crashes (`general-motors-navigation#4.1`), up to 50% lower costs (`consulting-optimization`).
- **Leadership:** team of 8 (`general-motors-navigation#4.1`, `calc:team_size_led`), OMO Systems team of about 3 with code reviews (`omo-systems-smart-home#4.5`), team of 3 (`admasters-ecommerce#4.2`).
- **App distribution:** F-Droid and Snapcraft, which tripled new users (`velas-wallet#4.5`); GitHub Actions signing for desktop and mobile (`velas-wallet#4.4`, not selected).

## Weak or missing evidence
| Area | What exists | Suggestion |
|---|---|---|
| iOS-specific work | iOS appears alongside Android (`thermo-fisher-dosimeter#4.2`, `#4.4`; `orion-mobile-clinical-ink#4.3`; `general-motors-navigation#4.9`); native modules for iOS / Android are a Skills-only item (decision `skills-only-in-skills-list`); no Swift / Objective-C or TestFlight work in any summary | Add iOS native work as a contribution with /add-experience, only if true |
| App Store and Google Play releases | Wink, Golfuture and Oroscopo were published on Google Play and the App Store (`itjet-fintech` section 3), but store publishing stays in Skills only (decision `skills-only-in-skills-list`); Fastlane and Bitrise in the General Motors Stack line; Jenkins build fixes (`orion-mobile-clinical-ink#4.4`) | Revisit the decision if mobile release work matters for a role |
| Expo | Expo SDK 52 upgrade and the Expo app (`orion-mobile-clinical-ink#4.1`, `#4.7`); EAS Build was used by the project, not hands-on | Enrich the summary if there was hands-on EAS or OTA update work, only if true |
| Code reviews at General Motors | `general-motors-navigation#4.2` (code reviews, standards, mentoring) is no longer selected; reviews show at OMO Systems (`omo-systems-smart-home#4.5`) | Pin `general-motors-navigation#4.2` if review leadership matters (see disagreements) |
| Recent mobile work at the current job | SYSPRO is web-only (React 19), so its Stack line is dropped in this variant (profile override `syspro-saas-erp#5`); the latest mobile work is General Motors (to December 2025) and the clinical-trials contract | Nothing to add; be ready to explain the move to web in interviews |

## Selection disagreements
- **General Motors:** `#4.9` (delivery and testing process for nested apps) replaces `#4.2` (code reviews and standards). For a tech-lead profile `#4.2` is stronger; `#4.8` (passenger second screen, no outcome) would be the better one to drop.
- **OMO Systems:** `#4.6` (patched react-native-vlcplayer, no outcome) now ranks first in the entry, above the core smart-home app (`#4.1`).
- **Thermo Fisher Scientific:** `#4.8` (concurrent dosimeter sync) replaces `#4.3` (BLE buffer-reading accuracy); BLE still appears in the summary.
- **Velas:** `#4.8` (React Native Web wallet from scratch) drops out for `#4.10` (fewer re-renders, lighter API responses, no number).
- **Itjet `#4.4`** (PostgreSQL to AWS RDS) and **Velas `#4.6`** (Node.js staking-rewards backend) are backend work picked for their performance tag; less relevant to mobile roles.
- **Clinical Trials:** the crash-fixing bullet (`#4.6`) no longer cites `#4.4`, which has its own bullet (tailoring-spec 2, step 3).
- **Length:** about 1,786 of 1,800 words; any new bullet needs a drop elsewhere. The summary now names each performance result with its project (Android wallet, staking page, IoT app).
- **Clinical Trials:** `#4.5` (SQLCipher and SSL certificate pinning) stays dropped by the profile; if those keywords matter for a role, un-drop it and drop a lower bullet instead.
