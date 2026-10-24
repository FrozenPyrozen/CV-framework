---
schema_version: 1
rubric: confidentiality
cv: cv/Kirill_Kohan_CV.md
job_ad: null
market: worldwide
reviewed_at: 2026-10-24T10:44
verdict: pass-with-issues
score: 9.0
---

# Confidentiality review

## Verdict
The master CV and all 4 role variants leak no Section 9 term outside its allowed scope, no internal URL, no colleague name and no hidden client name (lint: 0 errors, 0 warnings over 10 CV files). The new HERE Technologies entries paraphrase internal services instead of naming them, and HNav and HNod are allowed. Only low findings remain: a few paraphrases in the HERE entries that hint at a hidden OEM or at internal architecture, plus three low points carried over from reports/2026-10-23-1349 that no decision has closed yet. Nothing blocks sending.

## Hidden clients
- **Velocity AI** (label "Generative AI Jira Plugin", cv/Kirill_Kohan_CV.md:202-212): *possibly identifiable*. "Atlassian Jira Forge" + "generative AI design generation from a Jira issue" + "PRD and user-flow uploads" + "Model Context Protocol (MCP) server URL" + "Azure Blob Storage" describes one specific product. No Section 9 term appears ("Velocity", "designai", "DesignGenerationForm", "BACKEND_URL", "VEL-": none found), there are no dates, and the label gives no company hint. The user chose to keep these details (decisions `hidden-client-details-ok`, `hidden-clients`). The same holds for all 4 variants.
- **Clinical Ink** (cv/Kirill_Kohan_CV.md:180-199): *named on purpose* since 2026-10-24 (decision `hidden-clients`). No other Section 9 term of that summary appears ("Orion", "Lumiere", "MPM HealthBook", "Centros Health", "AtHome", "OR-"/"ENGAGE-" tickets: none found).
- **HERE Technologies car-brand customers** (navigation-poc, cv/Kirill_Kohan_CV.md:152-167): *possibly identifiable*. Section 9 lists Audi, Porsche, VW (allowed in the portfolio only), Bentley and Daimler (allowed nowhere). The CV names none of them. "a luxury car brand" (:161) points to Porsche or Bentley, which is decided (see below). In the fullstack-react-node and nodejs variants, "truck-parking details ... in the demo UI" in the same PoC entry hints at the hidden "daimler-truck-parking" demo (finding confidentiality-1).
- **Itjet clients** (Aspiration, Wink, RegiStart, Fused): *named on purpose*, decision `itjet-client-names`.
- **Various Clients** (cv/Kirill_Kohan_CV.md:214-229): *safe*. Only generic wording ("enterprise clients", "client mobile apps"), with no product, domain or date.

## Role variants
- `cv/variants/fullstack-react-node/cv.md`: clean of high and medium issues. Has the "truck-parking details" bullet (:134, confidentiality-1), "Protocol Buffers" (:145, confidentiality-2) and "5 million registered users" (:96, confidentiality-3).
- `cv/variants/nodejs/cv.md`: clean of high and medium issues. Has "truck-parking details" (:132, confidentiality-1), "Protocol Buffers" (:143, confidentiality-2), "5 million" (:96, confidentiality-3), "reverse tabnabbing ... across several Velas web projects" (:67, confidentiality-4) and the Clinical Ink "rotated SSL certificate pinning" bullet (confidentiality-5).
- `cv/variants/react/cv.md`: clean of high and medium issues. Has "Protocol Buffers" (:149, confidentiality-2) and "5 million" (:98, confidentiality-3).
- `cv/variants/react-native/cv.md`: clean of high and medium issues. Has "5 million" (:100, confidentiality-3), "Fixed insecure face-recognition unlock" (:74) and "MQTT over TLS with client certificates" (:87) (confidentiality-5). Its "route-curviness slider to a Kotlin reference app" (:136) points to Kurviger, which decision `portfolio-poc-names-public` treats as public: safe.

All 4 variants carry only the profile's own portfolio link as a URL, and "demo control panel" (nodejs :134, react :136) is a generic paraphrase of the internal "HNAV Control Panel Web" name: safe.

## Findings
| id | severity | location | issue | suggestion | needs_user_input |
|---|---|---|---|---|---|
| confidentiality-1 | low | cv/variants/fullstack-react-node/cv.md:134 and cv/variants/nodejs/cv.md:132 (HERE Technologies car navigation PoC, "truck-parking" bullet); cv/Kirill_Kohan_CV.md:174 (HERE Technologies truck navigation, bullet 1) | "Added truck-parking details, a QR-code booking card and search ratings to the demo UI." paraphrases the hidden "daimler-truck-parking" demo (Section 9 of navigation-poc; Daimler is allowed nowhere). Next to "a luxury car brand" in the same PoC entry, it suggests which OEMs the PoC was built for. The master's "truck navigation app ... parking approach" adds a little to the same inference, though the truck navigation app itself is decided (`gm-project-names`). | Make the demo generic: "Added parking-facility details, a QR-code booking card and search ratings to the demo UI." Keep the truck navigation bullet as it is unless the user considers the truck OEM confidential. | yes |
| confidentiality-2 | low | cv/Kirill_Kohan_CV.md:178 (HERE Technologies truck navigation, bullet 3); fullstack-react-node :145, nodejs :143, react :149 | "Separated developer diagnostics from core guidance services, updating **Protocol Buffers** contracts while keeping older operations backward compatible." describes the internal service architecture of an unreleased HERE product (guidance services talking over Protobuf contracts). No internal name appears, so the risk is small. | Keep the skill, drop the internal structure: "Refactored navigation services and their **Protocol Buffers** interfaces with backward compatibility." | no |
| confidentiality-3 | low | cv/Kirill_Kohan_CV.md:121 (Itjet, bullet 2); all 4 variants (~:96-100) | Carried over from reports/2026-10-23-1349 (confidentiality-2), no decision since: "it reached more than 5 million registered users" is a client's user count; summaries/itjet-fintech.md doesn't mark it public. | Confirm the figure was public (e.g. Wink's own announcements). If not: "a consumer app with millions of users". | yes |
| confidentiality-4 | low | cv/Kirill_Kohan_CV.md:76 (Velas, bullet 7); nodejs :67 | Carried over (confidentiality-3): "Fixed a **reverse tabnabbing** vulnerability (tab hijacking) across several Velas web projects" discloses a past security weakness in a named company's products. | "Fixed a reverse tabnabbing (tab hijacking) vulnerability in web projects", without "several Velas", or keep it if the fix was public. | no |
| confidentiality-5 | low | cv/Kirill_Kohan_CV.md:93 (OMO Systems, bullet 4); :104 (Thermo Fisher, bullet 2); :195 (Clinical Ink, bullet 6); react-native :74, :87; nodejs (Clinical Ink, SQLCipher bullet) | Carried over (confidentiality-4): "Fixed insecure face-recognition unlock on specific Android devices", "MQTT over TLS with client certificates", "rotated **SSL certificate pinning** for a backend certificate change" together describe how named products' security works. Each is minor and fixed. | "Hardened biometric unlock on Android with a native biometrics library", "Moved device data transfer to secure MQTT (TLS)", "Maintained SSL certificate pinning". | no |

## Decided (not raised again)
- HNav and HNod SDK names in the HERE entries (:176) and skills (:270): `here-sdk-names-in-skills`
- HERE Technologies named, with the truck navigation app and the car navigation PoC as two consulting entries: `gm-project-names`
- Voice AI assistant PoC and "a passenger second-screen feature for a luxury car brand" (:157, :161; all variants): `gm-features-public`. Note: the decision was taken while the bullet sat under General Motors (where "luxury" pointed to Cadillac); under HERE Technologies it now points to Porsche or Bentley, and Bentley is allowed nowhere. The user may want to reconfirm the decision in its new context.
- Route-curviness slider (:165, react-native :136) pointing to Kurviger: `portfolio-poc-names-public`
- Clinical Ink named in the CV: `hidden-clients`
- Feature details that narrow down the Generative AI Jira Plugin client (Jira issue to design, PRD uploads, MCP URL, Azure Blob): `hidden-client-details-ok`
- Itjet clients Aspiration, Wink, RegiStart and Fused named: `itjet-client-names`
- SYSPRO platform detail ("1,800+ ERP programs", "25+ person program", "4 repositories", "data-model definitions", Login micro-frontend, telemetry module): `keep-erp-programs-figure`
- Outcome numbers from the previous CV ("user engagement rose 20% and app crashes fell 15%", "company income grew 10x", "tripled the number of new users", "user engagement grew 4x", "Forbes top 10"): `keep-previous-cv-metrics`
- Google Drive portfolio link in the header (the only URL, the profile's own link): `keep-portfolio-link`
