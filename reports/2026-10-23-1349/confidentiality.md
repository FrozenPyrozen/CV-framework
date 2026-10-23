---
schema_version: 1
rubric: confidentiality
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-23T13:49
verdict: pass-with-issues
score: 8.5
---

# Confidentiality review

## Verdict
The CV leaks no internal product or code names, no colleague names, no internal URLs and no Section 9 terms (lint: 0 errors, 0 warnings). The two hidden clients keep their labels, and the feature detail that could narrow them down is covered by decision `hidden-client-details-ok`. The open points are General Motors features that may not have been public, a user count, and security details about named employers' products.

## Hidden clients
- **Clinical Ink** (label "Clinical Trials Patient App", cv/Kirill_Kohan_CV.md:161-177): *possibly identifiable*. The mix of "electronic clinical outcome assessment (eCOA)", "React Native, Expo and TypeScript" with a "native Android (Java / Kotlin) counterpart", "SQLCipher", "SSL certificate pinning" and "AWS Amplify, AppSync, Cognito" fits only a few eCOA vendors. No Section 9 term appears ("Clinical Ink", "Clinicalink", "Clinical inc", "Orion", "Lumiere", "MPM HealthBook", "Centros Health", `OR-`/`ENGAGE-` tickets: none found), and there are no dates. The user chose to keep these details: decisions `hidden-client-details-ok`, `hidden-clients` and `orion-stack-line`.
- **Velocity AI** (label "Generative AI Jira Plugin", cv/Kirill_Kohan_CV.md:182-190): *possibly identifiable*. "Atlassian Jira Forge" + "generative AI design creation from a Jira issue" + "PRD and user-flow uploads" + "MCP server URL" + "Azure Blob Storage" describes one specific product. No Section 9 term appears ("Velocity", "designai", "DesignGenerationForm", `BACKEND_URL`, `VEL-` tickets: none found), and there are no dates. The user chose to keep these details: decisions `hidden-client-details-ok` and `hidden-clients`.
- **Itjet clients** (Aspiration, Wink, RegiStart, Fused): *named on purpose*, decision `itjet-client-names`. Not hidden.
- **Various Clients** (cv/Kirill_Kohan_CV.md:195-207): *safe*. Only generic wording ("enterprise clients", "client mobile apps"), with no product, domain, city or date.

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| confidentiality-1 | medium | cv/Kirill_Kohan_CV.md:59 and :61 (General Motors, bullets 8 and 9) | "Built a proof of concept for in-car navigation combining search, routing, guidance and a **voice AI assistant**…" and "Implemented a passenger second-screen feature for a luxury car brand." describe R&D and features that may not have been released. With General Motors named, "a luxury car brand" points to Cadillac, so this may reveal unannounced product plans. The GM summary's confidentiality notes are empty (`None known`), so nothing confirms these are public. | If they were never announced, use wording that doesn't point to a product, e.g. "Built an in-car navigation proof of concept with a voice assistant for route and place search" and "Implemented a passenger-display feature for a premium vehicle line". You could also drop "luxury car brand". If both features are public, keep them as they are. | yes |
| confidentiality-2 | low | cv/Kirill_Kohan_CV.md:127 (Itjet, bullet 2) | "it reached more than 5 million registered users" is a client's user count. The rubric treats user counts as possibly confidential unless the source marks them public. summaries/itjet-fintech.md:195 cites the April 2025 portfolio but doesn't say the figure is public. | Ask the user to confirm the figure was public, for example from Wink's own announcements or the published portfolio. If it wasn't, use "a consumer app with millions of users". | yes |
| confidentiality-3 | low | cv/Kirill_Kohan_CV.md:82 (Velas, bullet 7) | "Fixed a **reverse tabnabbing** vulnerability across several Velas web projects" discloses a past security weakness in a named company's products. | Make it more general: "Fixed a cross-site security vulnerability (reverse tabnabbing) in web projects", without "several Velas", or keep it if the fix was public. | no |
| confidentiality-4 | low | cv/Kirill_Kohan_CV.md:99 (OMO Systems, bullet 4); :110 (Thermo Fisher, bullet 2); :173 (Clinical Trials Patient App, bullet 6) | Security details about named or nearly identifiable products: "Fixed insecure face-recognition unlock on specific Android devices", "MQTT over TLS with client certificates", "rotated **SSL certificate pinning** for a backend certificate change". Each is minor and already fixed, but together they describe how these apps' security works. | Keep the skill and drop the internal mechanics, e.g. "Hardened biometric unlock on Android with a native biometrics library", "Moved device data transfer to secure MQTT (TLS)", "Maintained SSL certificate pinning". | no |

## Decided (not raised again)
- Feature details in the Clinical Trials Patient App and Generative AI Jira Plugin entries (eCOA, Expo plus native Android, Jira issue to design, PRD uploads, MCP URL, Azure Blob) narrow down the hidden clients: `hidden-client-details-ok`
- Client names Clinical Ink and Velocity AI are missing from the CV: `hidden-clients`
- Itjet entry names its clients Aspiration, Wink, RegiStart and Fused: `itjet-client-names`
- General Motors and Thermo Fisher Scientific are named although the April 2025 portfolio marked the apps "under NDA": `portfolio-client-names` (it says the CV names them)
- AWS Amplify, AppSync, Cognito and the rest of the clinical-trials app's Stack line: `orion-stack-line`
- SYSPRO platform detail ("1,800+ ERP programs", "25+ person program", zero-trust micro-frontend architecture, OpenTelemetry telemetry module, 4 repositories): `keep-erp-programs-figure`
- Outcome numbers from the previous CV ("user engagement rose 20% and app crashes fell 15%", "company income grew 10x", "tripled the number of new users", "user engagement grew 4x", "Forbes top 10") and the empty confidentiality notes in the GM, Velas, OMO, Thermo Fisher, Itjet and Admasters summaries: `keep-previous-cv-metrics`
- Google Drive portfolio link in the header (the only URL, and the profile's own link): `keep-portfolio-link`
