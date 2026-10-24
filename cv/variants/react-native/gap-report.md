# Gap report: react-native

Built: 2026-10-24 · Profile: react-native · Job ad: no

## Strong evidence
- **React Native:** General Motors map team, HERE SDK library as a React Native micro-frontend, modular architecture, multi-instance map and shared search architecture, and the delivery and testing process for nested apps (`general-motors-navigation#4.1`, `#4.3`, `#4.4`, `#4.9`, `#4.10`, `#4.11`); Velas wallet (`velas-wallet#4.1`, `#4.10`); Thermo Fisher Scientific (`thermo-fisher-dosimeter#4.1`, `#4.4`, `#4.8`); Wink, 5M+ registered users, and Golfuture built from scratch (`itjet-fintech#4.8`, `#4.9`); Clinical Ink, including the React Native 0.76 and Expo SDK 52 upgrade (`orion-mobile-clinical-ink#4.1`, `#4.3`, `#4.6`, `#4.7`); consulting audits, upgrades and interviews (`consulting-audits`, `consulting-rn-upgrades`, `consulting-interviews`).
- **HERE Technologies navigation work (consulting entries):** voice AI assistant client integration in React and RxJS for the PoC built in HERE's R&D team, driver warnings with Android service contracts, passenger second screen for Bentley (`navigation-poc#4.1`, `#4.2`, `#4.3`); in-car navigation features of a truck navigation app with the HNav and HNod SDKs, and route-change reasons (`navigation-statistics#4.5`, `#4.1`).
- **Android:** native Android (Java / Kotlin) and the Android 14 (SDK 34) migration (`orion-mobile-clinical-ink#4.1`, `#4.4`), SQLCipher and SSL certificate pinning only in the Skills list (`#4.5` is dropped by the profile, so the summary no longer names them), Android biometrics fix (`omo-systems-smart-home#4.4`), 3x faster first interaction (`velas-wallet#4.9`).
- **Native libraries:** patched react-native-vlcplayer for video stream issues (`omo-systems-smart-home#4.6`) and react-native-keychain to use a native Android biometrics library (`#4.4`, master wording since review 2026-10-24-1044 fact-check-7); rewrote legacy native libraries for MQTT over TLS (`thermo-fisher-dosimeter#4.2`).
- **Offline-first, IoT and BLE:** Realm, MQTT over TLS, background jobs and concurrent sync of many dosimeters (`thermo-fisher-dosimeter#4.1`, `#4.2`, `#4.4`, `#4.6`, `#4.8`), BLE in the summary (`#4.3`), smart-home IoT app (`omo-systems-smart-home#4.1`).
- **Performance with numbers:** staking page loading from 2 minutes to 5 seconds with 5x less battery (`velas-wallet#4.2`; the summary keeps only the time), 3x (`velas-wallet#4.9`), 30% and 20% (`thermo-fisher-dosimeter#4.2`, `#4.6`), 20% engagement and 15% fewer crashes (`general-motors-navigation#4.1`), up to 50% lower costs (`consulting-optimization`).
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
- **Master wording carried over (2026-10-24):** the first PoC bullet now says the PoC was built in HERE's R&D team and that the work was the client integration of its voice AI assistant (`navigation-poc#4.1`, `#1`, `#3`; team work, user); the passenger second screen is "for Bentley" (`navigation-poc#4.3`, decision `portfolio-poc-names-public`); the truck-app route-change bullet also cites `navigation-statistics#4.5`, which names the app. The truck-app SDK bullet now says "in-car navigation features" (`navigation-statistics#4.5`).
- **General Motors:** `#4.6` and `#4.8` moved to the HERE entries (now `navigation-statistics#4.5` and `navigation-poc#4.3`), so `#4.10` and `#4.11` fill the entry. `#4.2` (code reviews and standards) is still not selected; for a tech-lead profile it is stronger than `#4.11`. The summary's team-of-8 sentence no longer cites `#4.6`; its HERE SDK map features rest on `#4.3`.
- **OMO Systems:** `#4.6` (patched react-native-vlcplayer, no outcome) now ranks first in the entry, above the core smart-home app (`#4.1`).
- **Thermo Fisher Scientific:** `#4.8` (concurrent dosimeter sync) replaces `#4.3` (BLE buffer-reading accuracy); BLE still appears in the summary.
- **Velas:** `#4.8` (React Native Web wallet from scratch) drops out for `#4.10` (fewer re-renders, lighter API responses, no number).
- **Velas `#4.6`** (Node.js staking-rewards backend) and **Itjet `#4.4`** (PostgreSQL to AWS RDS) were backend work picked for their performance tag; both are now cut (see *Fit on 2 pages*).
- **Clinical Trials:** the crash-fixing bullet (`#4.6`) no longer cites `#4.4`, which has its own bullet (tailoring-spec 2, step 3).
- **Clinical Trials:** `#4.5` (SQLCipher and SSL certificate pinning) stays dropped by the profile; if those keywords matter for a role, un-drop it and drop a lower bullet instead.

- **Fit on 2 pages (user, reports/2026-10-24-1044 layout-1):** page 3 held 89 words. Profile changes in `profiles/react-native.yaml`:
  - `entry_max_bullets: navigation-poc: 3` drops `#4.5` (Kotlin curviness slider), `#4.8` (electric-vehicle data) and `#4.9` (build script, 3x faster); `navigation-statistics: 2` was already the count.
  - `itjet-fintech#4.4: { drop: true }` with `entry_max_bullets: itjet-fintech: 4` drops the PostgreSQL to AWS RDS bullet and Oroscopo (`#4.10`) with no replacement.
  - `entry_max_bullets: velas-wallet: 5` drops `#4.6` (Node.js staking-rewards backend).
  - `entry_max_bullets: thermo-fisher-dosimeter: 5` drops `#4.5` (OAuth 2.0 login and local storage); a rebuild without this cap went back to 3 pages.
  - Summary tightened (2 lines): no "(including clinical trials)", "from scratch", "companion", "Also", "a", and the summary keeps only the time for the staking page (the 5x battery stays in the Velas bullet); the truck-app SDK bullet drops "HERE's" to fit on one line.
  - The page break keeps The Admasters together, so the cuts had to free page 1 for it; a Clinical Ink cap (`orion-mobile-clinical-ink: 5`) was tried and was not needed, so it is not in the profile.
  - Result: **2 pages** (both markets), about 1,765 of 1,920 words.
