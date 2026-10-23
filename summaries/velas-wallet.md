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
show_in_portfolio: true   # all jobs, decided by user 2026-10-23
portfolio_order: 5
portfolio_title: "Velas Wallet (React, React Native, Electron)"
cv_section: experience
cv_client_label: Velas
cv_location: Remote
---

# Velas: blockchain wallet

## 1. Project overview

The Velas blockchain wallet for web, mobile and desktop, with staking and token support on testnet and mainnet. The desktop app ships for macOS, Linux and Windows, and the app is also published on F-Droid and the Snapcraft store. Later work included a new cross-platform wallet built in React Native Web.

An open-source, non-custodial, multi-language crypto wallet for the Velas, Ethereum, BNB Smart Chain (BSC), Heco and Bitcoin networks, available for web, mobile and desktop (doc:portfolio-2025-04, approved by user 2026-10-22).

TODO (needs user input): team size and organization context.

## 2. Main features

Staking with a staking list and staking rewards, token and asset management, and wallet and account creation (from the CV). Staking VLX and earning rewards, swapping tokens between networks through bridges, and sending and receiving crypto by QR code (doc:portfolio-2025-04, approved by user 2026-10-22).

## 3. My role and responsibilities

Technical Leader. Owned performance work across the wallet, CI/CD builds and signing, end-to-end and unit test setup, store publishing, and the architecture of the new wallet (doc:portfolio-2025-04, approved by user 2026-10-22).

TODO (needs user input): leadership (people led) and key collaborators.

## 4. My contributions

### 4.1 Velas blockchain wallet

Developed the Velas blockchain wallet for web, mobile and desktop using React, React Native, Node.js, TypeScript, MobX and Web3.js.

Tags: blockchain, react, react-native, node, typescript, mobx

### 4.2 Staking list performance

Optimized the staking list by moving filtering to the server and adding a Node RPC fallback.

Result: staking page loading went from 2 minutes to 5 seconds, and the list used 5x less mobile battery.
Tags: performance, blockchain, node

### 4.3 Web3 provider failover

Added automatic Web3 provider failover for testnet and mainnet tokens, switching to another provider when the active one was slow or unreachable.

Tags: blockchain

### 4.4 Code signing and releases

Set up GitHub Actions workflows to build, sign and release the wallets: the desktop app on macOS, Linux and Windows, and the mobile app (mobile confirmed by user 2026-10-22).

Result: the "untrusted source" warning on desktop install was removed.
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

### 4.10 Fewer re-renders and lighter API responses

Removed unnecessary component re-renders to make the app faster and smoother. On the backend side, sped up responses by removing unused fields and adding filters and pagination.

Tags: performance, react, react-native, rest-api, node
Source: doc:portfolio-2025-04

### 4.11 Mobile end-to-end and unit test setup

Added end-to-end tests for the mobile wallet with Detox and set up unit tests with Jest.

Tags: testing, e2e, react-native
Source: doc:portfolio-2025-04

## 5. Technologies and frameworks

- **Language:** TypeScript (hands-on), JavaScript and LiveScript in the legacy wallet code (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **UI and mobile:** React (hands-on), React Native (hands-on), React Native Web (hands-on), Electron for the desktop wallet, Expo (ejected) and the React Native CLI (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **State:** MobX (hands-on)
- **Blockchain:** Web3.js (hands-on), Web3 providers (hands-on), Node RPC (hands-on)
- **Backend:** Node.js (hands-on)
- **Testing:** Detox for mobile E2E, Jest unit tests (hands-on, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
- **Networks:** Velas, Ethereum, BNB Smart Chain, Heco and Bitcoin, with cross-network bridges (used by the project, confirmed by user 2026-10-22, from doc:portfolio-2025-04)
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

- Staking page loading went from 2 minutes to 5 seconds (4.2), replacing the previous CV's "12x faster". Source: user 2026-10-22 (doc:portfolio-2025-04 is right). Confidence: exact.
- Staking list used 5x less mobile battery (4.2). Source: cv. Confidence: exact.
- New users tripled after F-Droid and Snapcraft publishing (4.5). Source: cv. Confidence: exact.
- User engagement grew 4x after the staking-rewards redesign (4.6). Source: cv. Confidence: exact.
- First interaction with the Android wallet 3x faster (4.9). Source: cv. Confidence: exact.

## 8. Portfolio material

- image: ../sources/media/portfolio-2025-09/p05-1.png
  caption: Velas Wallet on mobile
  public: yes, confirmed by user 2026-10-23
- image: ../sources/media/portfolio-2025-09/p05-3.png
  caption: Velas Wallet on desktop
  public: yes, confirmed by user 2026-10-23

TODO (needs user input)

## 9. Confidentiality notes

None known. TODO (needs user input)
