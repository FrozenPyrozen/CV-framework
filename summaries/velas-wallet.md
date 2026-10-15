---
schema_version: 1
id: velas-wallet
source: cv
# --- the job ---
client: Velas
role: Technical Leader
engagement: full-time
period: { start: 2021-12, end: 2023-07 }
domain: [Blockchain, Fintech]
team_size_led: 0
counts_as_experience: true
# --- harvesting ---
repos: []
author_identities: []
harvested_at: null
# --- how it appears in the CV ---
show_in_cv: true
cv_section: experience
cv_client_label: Velas
cv_location: Remote
---

# Velas: blockchain wallet

## 1. Project overview

The Velas blockchain wallet for web, mobile and desktop, with staking and token support on testnet and mainnet. The desktop app ships for macOS, Linux and Windows, and the app is also published on F-Droid and the Snapcraft store. Later work included a new cross-platform wallet built in React Native Web.

TODO (needs user input): who uses the wallet, the business problem, and team size and organization context.

## 2. Main features

Staking with a staking list and staking rewards, token and asset management, and wallet and account creation (from the CV). TODO (needs user input)

## 3. My role and responsibilities

Technical Leader. TODO (needs user input): ownership areas, leadership and process responsibilities, and key collaborators.

## 4. My contributions

### 4.1 Velas blockchain wallet

Developed the Velas blockchain wallet for web, mobile and desktop using React, React Native, Node.js, TypeScript, MobX and Web3.js.

Tags: blockchain, react, react-native, node, typescript, mobx

### 4.2 Staking list performance

Optimized the staking list by moving filtering to the server and adding a Node RPC fallback.

Result: the staking list loaded 12x faster and used 5x less mobile battery.
Tags: performance, blockchain, node

### 4.3 Web3 provider failover

Added automatic Web3 provider failover for testnet and mainnet tokens, switching to another provider when the active one was slow or unreachable.

Tags: blockchain

### 4.4 Desktop code signing and releases

Set up a GitHub Actions workflow for code signing and releases on macOS, Linux and Windows.

Result: the "untrusted source" warning on install was removed.
Tags: ci-cd, security

### 4.5 F-Droid and Snapcraft publishing

Published the app on F-Droid and the Snapcraft store.

Result: the number of new users tripled.
Tags: app-distribution, android

### 4.6 Staking-rewards calculation redesign

Redesigned the staking-rewards calculation on the Node.js backend for stability and speed.

Result: user engagement grew 4x afterwards.
Tags: node, blockchain, performance

### 4.7 Reverse tabnabbing fix

Fixed a reverse tabnabbing vulnerability across several Velas web projects.

Tags: security

### 4.8 New cross-platform wallet in React Native Web

Built a new cross-platform wallet in React Native Web from scratch, including the architecture for managing tokens and assets.

Tags: react-native-web, architecture, blockchain

### 4.9 Faster first interaction on Android

Cached and optimized wallet and account creation in the Android wallet.

Result: the first interaction with the Android wallet became 3x faster.
Tags: performance, android, react-native

## 5. Technologies and frameworks

- **Language:** TypeScript (hands-on)
- **UI and mobile:** React (hands-on), React Native (hands-on), React Native Web (hands-on)
- **State:** MobX (hands-on)
- **Blockchain:** Web3.js (hands-on), Web3 providers (hands-on), Node RPC (hands-on)
- **Backend:** Node.js (hands-on)
- **CI/CD and distribution:** GitHub Actions (hands-on), code signing for macOS, Linux and Windows (hands-on), F-Droid (hands-on), Snapcraft (hands-on)

## 6. Skills demonstrated

- Blockchain and Web3: 4.1, 4.2, 4.3, 4.6, 4.8
- React and React Native: 4.1, 4.9
- React Native Web: 4.8
- Node.js backend: 4.1, 4.2, 4.6
- Performance optimization: 4.2, 4.6, 4.9
- CI/CD and release automation: 4.4
- App store publishing: 4.5
- Web security: 4.4, 4.7
- Software architecture: 4.8

## 7. Metrics and outcomes

- Staking list loaded 12x faster (4.2). Source: cv. Confidence: exact.
- Staking list used 5x less mobile battery (4.2). Source: cv. Confidence: exact.
- New users tripled after F-Droid and Snapcraft publishing (4.5). Source: cv. Confidence: exact.
- User engagement grew 4x after the staking-rewards redesign (4.6). Source: cv. Confidence: exact.
- First interaction with the Android wallet 3x faster (4.9). Source: cv. Confidence: exact.

## 8. Portfolio material

TODO (needs user input)

## 9. Confidentiality notes

None known. TODO (needs user input)
