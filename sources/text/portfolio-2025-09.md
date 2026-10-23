<!-- extracted from sources/files/portfolio-2025-09.pdf by npm run import-doc on 2026-10-23; regenerated, never edited -->

<!-- page 1 -->
My Portfolio
Kyrylo Kohan
GITHUB.COM/FROZENPYROZEN | WWW.LINKEDIN.COM/IN/KYRYLO-KOHAN

<!-- page 2 -->
Car automotive management app under
NDA General Motors(React Native)
Car automotive management app allow user to fully control his car from phone, there was
features like running engine, get pressure in tears. User manage a lot of GM
Responsibilities
I was responsible for leading Map team of 8 developers ( 6 RN, 1 IOS, 1 Android) for
huge and complex high load app for managing your car (ICE/EV), based on React Native
and HereSDK and on reusable map provider module (display map/search/drawer/
markers/charging stations) RN micro frontend app, which integrated in multiple company
productsCommunicated about dependencies with ui/backend(EV/ICE vehicle service, LBS
service)/3rd part apps teams(HereSDK/HereApi) (giving scope/deadlines/priorities,
leading plannings, solving blockers, creation of integration strategy, automation testing
Technologies and frameworks
React native, HereSDK, Here api, Redux toolkit, Typescript, Azure, React hooks, git, Azure
pipelines, jest, browser stack, domain driving design, clean architecture
Created and documented process of delivering and testing our apps inside parent (parent
app -> reusable feature app -> map provider app (RN +native IOS/Android +
hereSdk))By feature request of client changed architecture of reusable feature app to
migrated it into parent (parent app+ feature app -> map provider app (RN +native IOS/
Android + hereSdk)). Created plan how to migrate all logic and components from
reusable feature to parent app according parent app patterns and practices ( clean
architecture, domain driven architecture, abstract services, pure components) During the
migration changed reusable feature weak architecture points to speed up the integration
and development processes( different map instances used global ref; map-provider map
events listener was global and caused bugs when multiple instances were running.
for each map separately; separated logic for map to map provider from reusable feature;
designed an architecture for complex reused search functionality on the different screens,
normalised state structure to store markers and search result)

<!-- page 3 -->
Car automotive navigation app under NDA
(React native/React, NodeJs, Android) Here
(HERE Technologies)
Customer connected with package delivery which works based on Here solutions (hnod,
Hnac, hereSDK, hereAPI). We got customsable Android app based on Js (NodeJs+React
Native/React) and Android (Kotlin, Java) tools connected by gRPC. It’s navigation app
which installed on drivers tablet, based on hereMap but for large truck drivers. You could
see route to desired place, restrictions (set your truck params like width, height) to show
restrictions. These app could be extended by custom logic and features functionality based
on service packages which connected to gRPC bundler and allows to add menu items,
screens, popup, routing logic based on React Native/React + NodeJs. Generally project
structure is hnod library + service packages + Android native/Web app.
Responsibilities
I was responsible for handling truck driver deviations where he goes off from desired
route, collect such cases and sent them to report endpoint. I worked in Here Hnod library
to extend functionality with adding route changes events submitting (New route started,
Previous route restored, Route edited, Alternative route selected,Driver deviated from
route, Route refresh, Driver parking ). Then I’m handling needed events and comparing
route data to understand if there was a deviation and sending that data to customer
Technologies and frameworks
Javascript, Typescript, NodeJs, gRPC, React Native, React, custom Here solutions (hnod
library, here bundler, here runner, here api, here sdk, hnav library), RxJs, jest, Gitlab
pipelines

<!-- page 4 -->
Car navigation PoC (Node.JS, React) NDA
Automotive app designed to show possibilities of latest HERE technology on Volkswagen
AG cars (Audi, Porsche, Volkswagen, etc.) and integrate latest features (Hugo AI assistant,
L3 interaction, ADAS, Kurviger, ODD, custom theme, layout support etc.
Responsibilities
Implemented L3 interaction feature, Hugo AI assistant feature to build routes and display
nearby places, Porsche theme and layout implementation, adding debug car data settings
for EV cars, created script to optimise inefficient manual steps to make a build faster 3x
Technologies and frameworks
Javascript, Node.JS, Typescript, React, Rx.Js, gRPC, Kotlin, Java, Hnav, Hnod, Hugo AI,
L3, Kurviger, protobuf.js.

<!-- page 5 -->
Velas Wallet (React/React Native/Electron)
Fully open source non-custodial multi-language crypto wallet which supports Velas,
Ethereum, BSC, Heco, BTC networks. You can stake VLX and earn rewards, swap tokens
from one network to another via bridges, send/receive different crypto by QR code.
Includes web, mobile and desktop version.
Responsibilities
Elimination of problem areas with performance in wallet, reduced downloading speed of
staking page loading from 2 mins to 5sec, get rid from extra re-renders of components for
improving app usability and performance, optimised responses from BE side to improve
speed removed unusable fields, added filters and paginations, configured building and
signing on CI/CD on GitHub actions for wallets, added e2e testing for mobile wallet with
detox, deployment app to F-droid and snap stores, designing architecture of new wallet,
set up unit tests on jest
Technologies and frameworks
React-native-web, React native, Web3, Mobx, Typescript, Github Actions, React hooks, git,
Expo eject, rn-cli, Javascript, Livescript, jest.

<!-- page 6 -->
Jira design generation plugin (Node.JS,
React, Android) NDA
This Generative AI application is designed to drastically accelerate the workflow for
designers, enabling them to rapidly create MVP, Proof of Concept (PoC), and presale
designs for customers. The tool offers seamless integration with the client's Jira board.
Users can input their requirements via text prompts, provide a URL link, and upload
specific photos or style schemas. The system then processes this input to instantly
generate a design (e.g., in a Figma format), automatically creates a new Jira ticket
detailing the request, and returns the finished design, thus streamlining the initial design
and project planning phases.
Responsibilities
Engineered a specialized Generative AI Jira Plugin using Jira Forge Custom UI and
Atlaskit with TypeScript to automate website design generation. A key architectural
challenge was bypassing Jira Forge's strict file upload limitations; this was achieved by
integrating Azure Blob Storage to manage chunked image data transfer. The solution
provided full end-to-end functionality, including interacting with the Jira API to
automatically create tickets with the generated design and specifications, with successful
and on-time project delivery realized through effective collaboration with Backend and
ML teams.
Technologies and frameworks
Javascript, Node.JS, Typescript, React, Jira, Atlaskit, Forge CustomUI

<!-- page 7 -->
Clinical Inc app (React native, React,
Android) Clinical inc
App designed to make it easier to be a participant in a clinical trial. Depending on the
clinical trial, Clinical ink may provide some or all of the following capabilities: · Assistance
with addresses and/or directions for your upcoming visits · Reminders to take medications
or perform tasks that are part of your clinical trial · Relevant videos or content to help you
understand more about the trial that you are part of, or to help you prepare for upcoming
tasks or appointments · Questionnaires about how you are feeling etc. trial tasks ·
Responsibilities
Refactored and optimized the core application flow, integrating it with the patient
document library for company healthcare app. Ensured full unit test coverage using
TypeScript and modern React Hooks best practices to boost maintainability and
performance. Migrated Android app from version 13 to 14 to comply with Google Play
Store requirements. Upgraded key dependencies and resolved complex migration issues
(e.g., net.zetetic:sqlcipher-android, SQLite, Android 14 compatibility).
Technologies and frameworks
Javascript, Typescript,, React Native, Expo, React, Kotlin, Sqlcipher, Redux toolkit, aws sdk
s3, was cognito, GraphQl, i18next, Apollo, aws-amplify, bitbucket pipelines, Jenkins

<!-- page 8 -->
Smart home eco-system IOT devices
management app (React Native) OMO
Systems
App provides access control, security & home automation built for the multi-apartment
buildings for worldwide. Key features of application are:
1. Access to apartment - control and open any entrances and
doors from a single app, it may be entrance doors, barriers,
elevators, gates and garbage cans.
2. Video surveillance - observe objects and territories from a
single app, it includes online access to cameras and video archive
from them, syncing with motion sensors with scenarios.
3. Security - protect your apartment from thieves, damage from
breakdowns and accidents, which includes traffic monitoring, doors
and windows opening, video surveillance in apartments, automatic
shut-off of gas and water in case of leaks.
Also you can set up scenarios when you can trigger some devices on
events, like start camera when motion sensor detect movement etc.
You can manage your house, share it with family and enable face recognition for your
cameras in your house. About security you can set all house for security guard and if
there will be breakdown, there will be alert and auto call for security squad team.
Responsibilities
Feature owner of key monetization billing logic of application by tariff subscription,
created SPA architecture and logic from scratch based on React for handling payments in
web view of application and added blocking of unpaid devices and features on
application. Implementing login by biometry with fixes of react-native-keychain library
for Android Samsung device with FaceID and TouchID. fixed video streams issues in react-
native-vlcplayer library with patches. Techlead for sprint of Frontend team.
Technologies and frameworks
React-native, Typescript , React navigation, React Native Navigation, React hooks, git,
react-redux, reselect, redux-saga, Fastlane, react-native-vlcplayer, react-native-keychain,
react-native-aws-cognito-js, react-native-webview, react-native-nfc-hce

<!-- page 9 -->
IoT app with dosimeter (React Native)
under NDA
This app helps doctors which works with radiation around the world to prevent
overdose of it. There are three roles in the app: user, admin and superuser. Login
process implemented by Oauth2. App consists of 10 screens and Rest API, Mqtt,
Bluetooth requests. In general we read the information from radiation dosimeter by
Bluetooth and send data to IoT server by Mqtt protocol. App can synchronize many
dosimeters at the same time. There are main swipeable menu with bottom pagination
with main screen where user can see progress of syncing, how many dosimeters synced
with errors and time of sync. Then there are screen with showing details of current sync
if sync is active now and the last sync if not. The last screen contains history of all
syncs, which can be filtered by options from full screen modal. History stored in local
Realm database. All secure values stored in keychain. Also app can update the
dosimeter firmware. There are two menus in the left and right sides of the app, from
where user can go to Profile, Settings and Logs(superuser only) page. On the filter
modal user can sort syncs by date(from to), by username who wears it, by errors and
id.
Responsibilities
Initializing and creating API communication logic with UI screens for application,
investigating, fixing and rewriting react-native and native libraries to work properly and
serve our purposes. Active participation in meetings of the project, providing the most
effective solutions for business, making a code reviews, adding logic for connecting to an
app API, cover code with unit tests, working with TDD approach, Mqtt logic integration,
creating login authorization flow with Oauth2, providing ideas of how to improve UI
experience, working with background jobs on Android and IOS, improved dosimeter data
parsing, which prevents overriding data, adding and creating Native Modules, setting up
the Realm db connection and writing filter logic.
Technologies and frameworks
React-native, Typescript , React navigation, React hooks, git, Fastlane, react-native-ble-plx,
Jira, react-native-app-auth, formik, @react-native-async-storage/async-storage, redux-
saga, react-native-fs, react-native-keychain, react-native-native-mqtt, realm, eslint, husky

<!-- page 10 -->
Aspiration signup(React Native Web)
Aspiration is a huge company which develop banking app ecosystem targeting on USA
customers. It’s a eco bank which help our planet by planting trees and investing money in
reusable energy sources and fossil fuel. They moved signup flow from Angular to React.
Responsibilities
Fix and refactor an existing signup flow for application, add new screens and components.
collaborating with native mobile developers for helping with react-native to native app
integration, communication with American developers. Active participation in meetings of
the project, providing the most effective solutions for business, making a code reviews,
adding logic for connecting to an app API, cover code with unit tests, creation of e2e test
utility, using CDD architecture across the project, Plaid/Google places/ReCaptcha v3/
integration, communication with product managers, manual react-native libraries linking,
writing a PR style guide and documentation for easier onboarding, adding A/B tests and
providing ideas of how to improve UI experience.
Technologies and frameworks
React-native-web, Apollo GraphQL, Typescript , React navigation, React hooks, git, Circle
CI, Plaid, Cucumber, Puppeteer, Jest, Planaout, Segment, Rollbar, Crashlytics, Scaffolding,
Smarty sheets, CDD, DDD, Next.js, Storybook, Eslint, CSS Grid, Jira

<!-- page 11 -->
Aspiration PYC(React)
Flow for Banking web app of planting trees from your transaction, changing profile,
settings etc. Currently in progress, so got not enough info about it.
Responsibilities
Create the application from scratch based on design, with mobile first approach, creating
reusable components using Atomic design, added auto scaffolding file structure generator,
communication with remote team from USA, active participation in grooming/
retrospectives of the project, solving communication problems between remote teams,
planning scope of task for next period.
Technologies and frameworks
React, Apollo GraphQL, React hooks, git, Plaid, Jest, Atomic, Next.js, Storybook, Eslint,
CSS Grid, Atomic design, CDD, UI Patterns, Jira, styled-components, Plop

<!-- page 12 -->
RegiStart(React Web, Node.js Backend, CI/CD)
RegiStart is a start-up non-profit that is leveraging the power of social networks and technology
to systematically increase voter registration among 18-year-olds. The main goal of application is
to increase in voter registration rates in schools using RegiStart by distributing seniors between
student organisers which will motivate them to vote. Their slogan: “Strengthening America by
registering voters, educating students on citizenship, and shaping students into citizens”.
Responsibilities
Development the MVP of frontend application from scratch based on sketches with React,
MaterialUI, planning DB tables and relationships, creation of backend server for app on
Node.Js with connection for DB using sequelize, adding DB on AWS RDS(postgresql),
configuring CI/CD for deployment process on AWS EC2 and S3, adding migrations for DB
with node-pg-migrate, creation of optimize distribution algorithm of students between
organizers.
Technologies and frameworks
React, Redux, Typescript , AWS EC2 S3 RDS, CI/CD with Bitbucket pipelines, PostgreSQL,
sequelize, node-pg-migrate, Formik, React Material UI, Ngnix, pm2, Jira

<!-- page 13 -->
Fused(Web, mobile and backend)
The application has two roles - Coach and Athlete. Coach can invite athletes, create
workouts, exercises, for athletes. User can change his role on settings screen Also create a
teams from athletes and check their workout progress. For creating subscription coach
should add card information and bank account hosted. App was published in Google play
Responsibilities
Add new functionality in application, work with API, creating flow for Athlete in Web
version(previously it was only for Coach), moving all payment logic from mobile into Web
version and added some endpoints on backend for removing card, making the web
version fully responsible, fixing existing bugs on mobile. Web and backend side, added
migration of dev and prod DB to AWS RDS, fully configured CI/CD process and created
dev backend EC2 instance. Creating documentation . Direct communication with client
Technologies and frameworks
React native, React, React router, React navigation, NodeJs, sequelize, PostgreSQL, React
hooks, Redux, RxJs, Stripe, Docker, AWS, Bugsnag, Bitbucket Pipelines, Fastlane, Git,
Ngnix, pm2, Jira

<!-- page 14 -->
Wink(React Native)
The application has a user, which can like/dislike others by swiping left/right for
Gems(game currency), get notifications that he was liked by others, change his profile
settings, and also earn gems by making actions like share link app with friends, claim daily
price and left comment about app in google play. The app was successfully published in
Google Play and App Store and connected more than 5 minion users.
Responsibilities
Development of application from scratch based on design, login using Snapchat/Mobile number,
integration with BackendAPI, adding push notifications, Optimization and testing, configuring of CI/
CD deployment, adding image optimize logic on backend side on Node.js, direct communication
with customer. Making a code reviews
Few screens of application:
Technologies and frameworks
React native, Typescript , React hooks, React navigation , Redux, Thunk, Firebase, Bugsnag, Fastlane,
Bitrise, AWS, NodeJs, git, CSS Grid, Flexbox, Jira

<!-- page 15 -->
Golfuture(React native)
Golfuture is a proprietary new concept of golf that allows players to enjoy many of the
best elements of traditional golf in a more time-efficient, eco-friendly and affordable way.
Players use our smartphone application to select a course and their playing partners, and
are guided through the facility at their own pace—no waiting on others. We have
combined innovative course design with modern ball-tracking technology to create an
exciting environment for golfers. App was published in Google play and app store.
Responsibilities
Development of application from scratch based on design, planning and creating
Components and pages, adding business logic and add connection for to Stripe and
different API’s. Optimization and testing of the application, active participation in
meetings and plannings of the project. Directly presentation the results of job for
customer and communication with him.
Technologies and frameworks
React native, Redux, Typescript , Thunk, React navigation , Fastlane, Bugsnag, React
hooks, Stripe, Bitrise, git, CSS Grid, Jira

<!-- page 16 -->
Oroscopo(React Native)
Oroscopo is a tarot, astrology mobile app which can make predictions for zodiac signs,
make different tarot layouts for future and calculating a zodiac compatibility between
signs. App was published in Google play and app store
Responsibilities
Add new functionality in application, work with app API, adding UI components,
animated card circle, zodiac compatibility logic, add banners integration and creating new
screens with tarot layouts. Optimization and testing of the application, active participation
in meetings of the project, directly presentation the results of job for customer.
Technologies and frameworks
React native, Redux, Typescript , Thunk, React navigation , React hooks, git, Firebase,
AdMob, Jira
