---
schema_version: 1
id: designai-jira-plugin
source: git
# --- the job ---
client: Velocity AI
role: Frontend Engineer
engagement: contract
period: { start: 2025-05, end: 2025-08 }
domain: [Generative AI, Developer tools]
team_size_led: 0
counts_as_experience: false
# --- harvesting ---
repos:
  - { name: designai }
author_identities: []
harvested_at: "2026-10-15"
# --- how it appears in the CV ---
show_in_cv: true
show_in_portfolio: true   # all jobs, decided by user 2026-10-23
portfolio_order: 4
portfolio_title: "Jira design generation plugin under NDA (Node.js, React)"
cv_section: consulting
cv_order: 2
cv_client_label: Generative AI Jira Plugin
cv_location: Remote
---

## 1. Project overview

An AI design-generation product. Its repository holds the backend pieces (API, agents, pipelines, and Docker and Helm deployment configuration) and the plugins that connect the product to other tools. I worked only on the Jira plugin, an Atlassian Forge app that lets a user start AI design generation directly from a Jira issue. The user supplies context, the plugin packages it and hands it to the design-generation pipeline, and the generated result is tracked in Jira as a subtask. The plugin lives in its own folder of the repository and replaced an earlier plugin folder.

How the plugin is built:

- **Frontend:** a React and TypeScript Custom UI rendered inside Jira, styled with Atlassian design tokens. The UI is organized into shared components (design system select, file upload, URL upload), feature components (design description, MCP URL, website URL, flow upload, image upload, PRD upload), the design generation form, and API, utility (API and Jira helpers) and type modules.
- **Resolver:** a Forge function in TypeScript on Node.js 22 that calls the Jira API with read and write access to Jira work items, split into utilities and types.
- **Storage:** Azure Blob Storage, configured through Forge environment variables.
- **Deployment:** deployed and installed with the Forge CLI.

Team size and collaborators: TODO (needs user input)

## 2. Main features

- A panel on Jira issues with a design generation form.
- Many kinds of input for the design: a design description, reference images with preview, a product requirements document (PRD) upload, a user-flow upload, a website URL, an MCP server URL, and a design system selection.
- Support for large files: files go straight from the plugin to Azure Blob Storage instead of through the backend.
- Design generation starts when the plugin uploads a design configuration file to blob storage.
- A Jira subtask is created automatically for the generated design.
- Form validation and error handling, both in the UI and in the resolver.

## 3. My role and responsibilities

Frontend Engineer on a contract. I built the Jira plugin from scratch and owned it from May to August 2025: project setup and tooling, the Forge manifest, the Custom UI, the resolver layer, the move of file handling from the backend to direct Azure Blob Storage, and the plugin's documentation (README and deployment guide). I also formatted the team's pull request template in Azure DevOps.

Key collaborators: TODO (needs user input)

## 4. My contributions

### 4.1 Jira Forge app for AI design generation, built from scratch

Built the Atlassian Forge app that starts AI design generation from a Jira issue. Set up the plugin project and its manifest with Forge UI Kit (May 22, 2025), then moved it to the Forge Custom UI approach, a separate React and TypeScript app rendered inside Jira (May 28, 2025; confirmed by user 2026-10-22), and built the generate-design action and automatic Jira subtask creation for the result, including fixes to routes and errors. Converted the resolver to TypeScript on Node.js, separated the API utilities, improved resolver error handling, and replaced nested-string error handling with a shared error utility. Added a design creation popup.

Result: users can start design generation from a Jira ticket and get a subtask that tracks the result.
Tags: jira-forge, react, typescript, node, generative-ai

### 4.2 Design generation form with multiple inputs

Built the design generation form in the Jira issue panel with Atlaskit components (form, text field, text area, select, button, modal dialog, heading, image, badge and layout primitives; confirmed by user 2026-10-22): a design description field and a website URL field (with minimum rows), image upload with a preview container (fixed preview heights, fewer re-renders on hover, fixed spacing), PRD upload and user-flow upload built on a reusable file-upload component, an MCP server URL input, and design system selection. Added form validation, including a way past the large-image error.

Tags: react, typescript, jira-forge, mcp, generative-ai, design-systems

### 4.3 Direct uploads to Azure Blob Storage

Moved file handling off the backend. Forge limits the size of image uploads, so images are uploaded straight from the plugin to Azure Blob Storage, which bypasses that limit and lets larger images work (Forge limit confirmed by user 2026-10-15), and they are deleted there instead of through the backend. When the user generates a design, the plugin uploads the generation configuration file to blob storage instead of calling the backend. Removed the backend URL setting, since the plugin no longer uses the backend, and cleaned up the leftover backend upload and generation logic.

Result: the plugin no longer depends on the backend, and larger images can be uploaded.
Tags: azure, jira-forge, typescript

### 4.4 Project tooling, quality gates and documentation

Added ESLint, TypeScript and a pre-commit ESLint hook to the plugin project, and enabled Atlassian design styling and design tokens, with the Atlaskit design-system ESLint plugin. Fixed a SonarQube TypeScript error and moved type packages to development dependencies. Updated the plugin README and the Jira plugin deployment guide, removing the now-unneeded backend instructions, and formatted the Azure DevOps pull request template.

Tags: code-quality, typescript, design-systems

## 5. Technologies and frameworks

| Category | Technology | Use |
|---|---|---|
| Language | TypeScript | **hands-on** |
| UI | React | **hands-on** |
| UI | Atlaskit (Atlassian Design System): form, textfield, textarea, select, button, modal-dialog, heading, image, badge, primitives, css-reset | **hands-on** (confirmed by user 2026-10-22) |
| UI | Atlassian design tokens (@atlaskit/tokens) and styling | **hands-on** |
| UI | React 18 with Create React App (react-scripts) for the Custom UI static app | **hands-on** (confirmed by user 2026-10-22) |
| UI | Styled Components | **hands-on** (confirmed by user 2026-10-16) |
| Platform | Atlassian Forge (UI Kit at the start, then Custom UI; resolvers, environment variables, CLI deploy and install) | **hands-on** |
| Platform | @forge/bridge (Custom UI to resolver and Jira calls) | **hands-on** (confirmed by user 2026-10-22) |
| Platform | Jira API (read and write access to work items) | **hands-on** |
| Backend runtime | Node.js 22 (Forge resolver) | **hands-on** |
| Cloud | Azure Blob Storage with the Azure Storage Blob SDK (@azure/storage-blob) | **hands-on** |
| AI | MCP server URL as a design input | **hands-on** (UI input only) |
| Code quality | ESLint with typescript-eslint, eslint-plugin-react and the Atlaskit design-system plugin, pre-commit hook | **hands-on** (plugins confirmed by user 2026-10-22) |
| Code quality | SonarQube | **hands-on** (fixed a reported error) |
| Process | Azure DevOps pull requests | **hands-on** (PR template) |
| Product backend | API, agents and design-generation pipelines | **used by the project** |
| Deployment | Docker (**hands-on**, confirmed by user 2026-10-23), Helm | Docker hands-on; Helm **used by the project** |

## 6. Skills demonstrated

- Atlassian Jira Forge: 4.1, 4.2, 4.3
- React: 4.1, 4.2
- TypeScript: 4.1, 4.2, 4.3, 4.4
- Node.js (Forge resolver): 4.1
- Generative AI integration: 4.1, 4.2
- Model Context Protocol (MCP) input: 4.2
- Microsoft Azure (Azure Blob Storage): 4.3
- Form design and validation: 4.2
- Reusable component design: 4.2
- Design tokens: 4.4
- ESLint, pre-commit hooks and SonarQube: 4.4
- Technical documentation: 4.4

## 7. Metrics and outcomes

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Commits | 40 non-merge commits | git | exact |
| Period of commits | 2025-05-22 to 2025-08-12 | git | exact |
| Node.js version of the resolver | 22 | git | exact |
| Kinds of input in the design generation form (4.2) | 7 | git | exact |

## 8. Portfolio material

- image: assets/designai-jira-plugin/form-image-attached.png
  caption: The plugin's design request form with an attached wireframe (plugin name covered)
  public: yes, confirmed by user 2026-10-23
- image: assets/designai-jira-plugin/form-images-and-url.png
  caption: The design request form with four wireframes, a reference URL and an error message (plugin name covered)
  public: yes, confirmed by user 2026-10-23

TODO (needs user input)

## 9. Confidentiality notes

- url_pattern: "*gl-velocityai*"
- term: Velocity AI
- term: Velocity
- term: designai
- term: plugins/jira
- term: velocity-ai-jira-plugin
- term: design-generation-form
- term: DesignGenerationForm
- term: BACKEND_URL
- prefix: VEL-                     # tickets: VEL-2874, VEL-5486, VEL-5846, VEL-6145, VEL-6948, VEL-7051, VEL-7451
