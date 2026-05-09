# Release Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add miniapp real-device helpers, richer conversation metadata, and signed session auth so the MVP is closer to release-ready.

**Architecture:** Extend the existing match-centered chat model instead of replacing it. Keep the current login API but switch bearer verification to signed session tokens with env-driven toggles, and expose richer thread detail APIs that mobile can consume directly.

**Tech Stack:** `NestJS`, `Prisma`, `uni-app`, `Vue 3`, `Pinia`, `Vitest`, `Jest`, Node `crypto`

---

### Task 1: Rich conversation metadata and thread detail

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Modify: `apps/api/prisma/seed.ts`
- Modify: `apps/api/src/messages/messages.service.ts`
- Modify: `apps/api/src/messages/chat-threads.controller.ts`
- Modify: `apps/api/src/matches/matches.service.ts`
- Modify: `apps/api/test/messages.e2e-spec.ts`
- Modify: `apps/mobile/src/services/types.ts`
- Modify: `apps/mobile/src/services/api.ts`
- Create: `apps/mobile/src/composables/useThreadDetailQuery.ts`
- Modify: `apps/mobile/src/pages/chat/index.vue`
- Modify: `apps/mobile/src/pages/messages/index.vue`
- Modify: `apps/mobile/src/__tests__/chat-page.spec.ts`
- Modify: `apps/mobile/src/__tests__/messages-page.spec.ts`

- [ ] Add failing API and mobile tests for thread detail metadata, participant lists, and richer chat card rendering.
- [ ] Run the targeted API and mobile commands and confirm the new assertions fail.
- [ ] Extend Prisma thread metadata and seed data.
- [ ] Implement `GET /chat-threads/:threadId`, richer thread summaries, and metadata updates on match creation and chat send.
- [ ] Wire the mobile chat page and message center to render thread metadata and participants.
- [ ] Re-run the targeted API/mobile tests until they pass.

### Task 2: Signed session tokens and env-driven auth behavior

**Files:**
- Create: `apps/api/src/common/env/app-config.ts`
- Create: `apps/api/src/common/auth/app-token.ts`
- Modify: `apps/api/src/auth/dev-auth.ts`
- Modify: `apps/api/src/auth/auth.service.ts`
- Modify: `apps/api/src/common/auth/dev-bearer.guard.ts`
- Modify: `apps/api/src/users/users.service.ts`
- Modify: `apps/api/src/auth/auth.controller.ts`
- Modify: `apps/api/test/auth.e2e-spec.ts`
- Modify: `apps/mobile/src/__tests__/auth-services.spec.ts`
- Modify: `.env.example`

- [ ] Add failing auth tests for signed session token resolution and `ALLOW_DEV_LOGIN` behavior.
- [ ] Run the targeted auth test command and confirm the new assertions fail.
- [ ] Implement signed token issue/verify helpers and move auth gating to env-driven config.
- [ ] Keep the session response shape stable while updating token semantics.
- [ ] Re-run the targeted auth tests until they pass.

### Task 3: Miniapp device helpers and release scripts

**Files:**
- Modify: `tools/mobile/run-mobile-with-api.mjs`
- Create: `tools/release/verify-release.mjs`
- Modify: `apps/api/package.json`
- Modify: `package.json`
- Create: `docs/superpowers/specs/2026-04-20-miniapp-device-debug-guide.md`
- Create: `docs/superpowers/specs/2026-04-20-release-playbook.md`

- [ ] Add a failing smoke check for `run-mobile-with-api.mjs` support for `--api-host` and `--api-port`.
- [ ] Run the helper script with the new flags and confirm it fails before implementation.
- [ ] Implement host/port-based API URL construction, API build scripts, and release verification helpers.
- [ ] Write the miniapp device-debug guide and release playbook.
- [ ] Re-run helper smoke checks and then run full project verification.

## Self-review

- Spec coverage: miniapp device guidance, conversation metadata, signed sessions, and release helpers each map to a task.
- Placeholder scan: no TODO/TBD markers remain.
- Type consistency: thread IDs remain match-centered, session payload shape stays `{ token, user }`, and mobile thread detail flows read from the same API contracts defined in Task 1.
