# Admin Web System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a separately deployable Vue admin web app and the API endpoints it needs.

**Architecture:** Add a NestJS `AdminModule` exposing guarded read-only operating endpoints. Create `apps/admin` as a standalone Vue 3 + Vite app that consumes those endpoints with an admin token.

**Tech Stack:** NestJS, Prisma, Vue 3, Vite, Vitest, TypeScript.

---

### Task 1: Admin API

**Files:**
- Create: `apps/api/src/admin/admin-token.guard.ts`
- Create: `apps/api/src/admin/admin.service.ts`
- Create: `apps/api/src/admin/admin.controller.ts`
- Create: `apps/api/src/admin/admin.module.ts`
- Modify: `apps/api/src/app.module.ts`
- Modify: `apps/api/src/common/env/app-config.ts`
- Test: `apps/api/test/admin.e2e-spec.ts`

- [ ] Write e2e tests for unauthorized access, summary, matches, users, and venues.
- [ ] Run the admin e2e test and confirm it fails because `/admin/*` does not exist.
- [ ] Implement the admin config, guard, module, controller, and service.
- [ ] Run the admin e2e test and confirm it passes.

### Task 2: Admin Frontend

**Files:**
- Create: `apps/admin/package.json`
- Create: `apps/admin/index.html`
- Create: `apps/admin/tsconfig.json`
- Create: `apps/admin/vite.config.ts`
- Create: `apps/admin/src/main.ts`
- Create: `apps/admin/src/App.vue`
- Create: `apps/admin/src/services/admin-api.ts`
- Create: `apps/admin/src/services/admin-token.ts`
- Create: `apps/admin/src/__tests__/admin-api.spec.ts`
- Create: `apps/admin/src/__tests__/app.spec.ts`

- [ ] Write Vitest coverage for token persistence and admin API request headers.
- [ ] Write a Vue test that renders the dashboard with fake admin data.
- [ ] Run admin tests and confirm they fail before implementation.
- [ ] Implement the admin app, API client, token persistence, and dashboard UI.
- [ ] Run admin tests and confirm they pass.

### Task 3: Workspace Scripts And Verification

**Files:**
- Modify: `package.json`
- Modify: `tools/verify-workspace.mjs`
- Modify: `tools/release/verify-release.mjs`
- Modify: `tools/mobile/start-preview-stack.mjs`
- Modify: `tools/mobile/stop-preview-stack.mjs`

- [ ] Add `dev:admin`, `build:admin`, `test:admin`, and admin preview support.
- [ ] Include admin required files in workspace smoke verification.
- [ ] Include admin tests, typecheck, and build in release verification.
- [ ] Run the full release verification.
- [ ] Restart preview services and confirm API, H5, and admin URLs are healthy.
