# Work Summary — designai repo (Jira plugin)

**Author:** Kyrylo Kohan
**Period:** 2025-05-22 → 2025-08-12 (40 non-merge commits)
**Area:** `plugins/jira` (Atlassian Forge app, "Velocity AI" Jira plugin). It replaced the earlier `velocity-ai-jira-plugin` folder.

## About the project

**What it is.** `designai` is a repo for an AI design-generation product (Velocity AI). It holds the backend pieces (`api`, `agents`, `pipelines`, Docker/Helm deployment config) and the plugins that connect the product to other tools. I worked on the **Jira plugin** (`plugins/jira`).

**What the Jira plugin does.** It is an Atlassian Forge app. It adds a panel to Jira issues where a user can start AI design generation directly from a ticket. The user supplies context, and the plugin packages it and hands it to the design-generation pipeline. The generated result is tracked in Jira as a subtask.

**Main features**
- A Jira issue panel (Forge Custom UI) with a Design Generation form.
- Multiple input types:
  - design description
  - reference images, with preview
  - PRD upload
  - flow upload
  - website URL
  - MCP URL
  - design system selection
- Large file support: files go straight to Azure Blob Storage from the plugin, without passing through the backend.
- A generate-design config JSON uploaded to blob storage, which triggers generation.
- Automatic Jira subtask creation for the generated design.
- Form validation and error handling, in the UI and in the resolver.

**How it works**
- **Frontend:** a React + TypeScript UI built with Atlassian design tokens and rendered inside Jira.
- **Resolver:** a Forge function (Node.js 22, TypeScript) that calls the Jira API (`read:jira-work` and `write:jira-work` scopes).
- **Storage:** Azure Blob Storage, configured through Forge environment variables.
- **Deployment:** `forge deploy` and `forge install`.

## Overview
I built the Jira plugin from scratch. It adds a **Design Generation form** inside Jira. Users describe a design, attach inputs (images, PRD files, flow files, website/MCP URLs, a design system), and the plugin kicks off design generation and creates a Jira subtask for the result. Over time I moved file handling off the backend and onto direct Azure Blob Storage.

## Features implemented

### 1. Project setup and tooling (May 2025) — VEL-2874
- Set up the Jira (Forge) plugin project and manifest.
- Initialised the Custom UI project (`static/design-generation-form`) with React + TypeScript.
- Added ESLint, TypeScript and a pre-commit ESLint hook.
- Enabled Atlassian design styling and design tokens.

### 2. Design Generation form (June 2025)
- **Image upload**: preview container, hover re-render optimisation, fixed preview heights.
- **Enter website URL** and **design description** fields, with minimum rows.
- **Form validation** and a bypass for the large-image error.
- **Generate design** action and **create subtask** in Jira (including route/error fixes).
- Design creation popup.

### 3. Resolver layer (June 2025)
- Converted the Jira plugin resolver to TypeScript.
- Separated API utils and improved resolver error handling.
- Replaced nested-string error handling with an error util.
- Fixed a SonarQube TS error.
- Moved types to devDependencies.

### 4. Azure Blob uploads (July 2025) — VEL-5486, VEL-6145, VEL-5846
- Upload images directly to Azure Blob Storage so larger images work.
- Upload the generate-design JSON config file to blob storage when generating a design, instead of calling the backend.
- Delete images from Azure Blob Storage instead of via the backend.
- Removed `BACKEND_URL`, since the plugin no longer uses the backend.

### 5. Reusable components and new inputs (Aug 2025) — VEL-7051, VEL-7451, VEL-6948
- Built a **reusable file-upload component** and used it across the upload flows (PRD upload, flow upload).
- Added the **Enter MCP URL** component (VEL-7451).
- Cleaned up leftover backend upload and generate-design logic (VEL-6948).
- Fixed image upload spacing.

### 6. Documentation and process
- Updated the plugin README and the "how to deploy Jira plugin" doc. Removed the "run backend" instructions.
- Formatted the Azure DevOps PR template.

## Plugin structure
- `src/`: Forge resolver (TypeScript) with `utils/` and `types/`.
- `static/design-generation-form/src/`: React UI.
  - `components/`: DesignSystemSelect, FileUpload, URLUpload
  - `features/`: DesignDescription, EnterMcpURL, EnterWebsiteURL, FlowUpload, ImageUpload, PrdUpload
  - `forms/DesignGenerationForm`
  - `api/`, `utils/` (apiUtils, jiraUtils), `types/`

## Tech
React, TypeScript, Atlassian Forge (Custom UI + resolvers), Atlassian design tokens, Azure Blob Storage, ESLint, SonarQube.

## Tickets referenced
VEL-2874, VEL-5486, VEL-5846, VEL-6145, VEL-6948, VEL-7051, VEL-7451
