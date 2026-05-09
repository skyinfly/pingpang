# Chat Threads, Message Center, and Mini Program Prep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add lightweight chat threads, message center filters with read synchronization, and WeChat Mini Program build preparation.

**Architecture:** Compute chat threads from existing persisted messages grouped by `matchId`, keeping the database lean while exposing a thread-oriented API. Reuse the current mobile services and Vue Query caches so message center and chat views stay synchronized, then add environment-aware API base URL handling and mp-weixin scripts on top of the existing uni-app setup.

**Tech Stack:** `NestJS`, `Prisma`, `uni-app`, `Vue 3`, `TypeScript`, `Vitest`, `Jest`

---

## Planned File Structure

- Specs: `docs/superpowers/specs/2026-04-19-chat-threads-message-center-mini-program-design.md`
- Plan: `docs/superpowers/plans/2026-04-19-chat-threads-message-center-mini-program.md`
- API: `apps/api/src/messages/messages.controller.ts`, `apps/api/src/messages/messages.service.ts`, `apps/api/src/notifications/notifications.service.ts`
- API tests: `apps/api/test/messages.e2e-spec.ts`
- Mobile services: `apps/mobile/src/services/api.ts`, `apps/mobile/src/services/http.ts`, `apps/mobile/src/services/types.ts`
- Mobile composables/pages: `apps/mobile/src/composables/useMessagesQuery.ts`, `apps/mobile/src/composables/useChatMessagesQuery.ts`, `apps/mobile/src/pages/messages/index.vue`, `apps/mobile/src/pages/chat/index.vue`
- Mobile tests: `apps/mobile/src/__tests__/messages-page.spec.ts`, `apps/mobile/src/__tests__/chat-page.spec.ts`, `apps/mobile/src/__tests__/http.spec.ts`
- Mini program config: `apps/mobile/package.json`, `apps/mobile/src/manifest.json`, root `package.json`

### Task 1: Add chat thread API support

**Files:**
- Modify: `apps/api/src/messages/messages.controller.ts`
- Modify: `apps/api/src/messages/messages.service.ts`
- Modify: `apps/api/src/notifications/notifications.service.ts`
- Modify: `apps/api/test/messages.e2e-spec.ts`

- [ ] Write the failing e2e tests for `GET /chat-threads` and `POST /chat-threads/read`.
- [ ] Run `corepack pnpm --filter @pingpang/api test:e2e -- messages.e2e-spec.ts` and confirm the new thread expectations fail.
- [ ] Implement the minimal thread summary and thread-read logic on top of existing `Message` rows grouped by `matchId`.
- [ ] Re-run `corepack pnpm --filter @pingpang/api test:e2e -- messages.e2e-spec.ts` until it passes.

### Task 2: Upgrade message center and chat page behavior

**Files:**
- Modify: `apps/mobile/src/services/api.ts`
- Modify: `apps/mobile/src/services/types.ts`
- Modify: `apps/mobile/src/composables/useMessagesQuery.ts`
- Modify: `apps/mobile/src/composables/useChatMessagesQuery.ts`
- Modify: `apps/mobile/src/pages/messages/index.vue`
- Modify: `apps/mobile/src/pages/chat/index.vue`
- Modify: `apps/mobile/src/__tests__/messages-page.spec.ts`
- Modify: `apps/mobile/src/__tests__/chat-page.spec.ts`

- [ ] Add failing mobile tests for category filters in the message center and thread-level read synchronization in chat.
- [ ] Run `corepack pnpm --filter @pingpang/mobile test -- messages-page.spec.ts` and confirm the new expectations fail.
- [ ] Implement thread list fetches, message-center filters, navigation to chat, and cache invalidation after reads/sends.
- [ ] Re-run `corepack pnpm --filter @pingpang/mobile test -- messages-page.spec.ts` until the page behavior is green.

### Task 3: Prepare mp-weixin builds

**Files:**
- Modify: `apps/mobile/src/services/http.ts`
- Modify: `apps/mobile/package.json`
- Modify: `apps/mobile/src/manifest.json`
- Modify: `package.json`
- Create: `apps/mobile/src/__tests__/http.spec.ts`

- [ ] Add a failing test that verifies API base URL selection supports H5 and mp-weixin environments.
- [ ] Run `corepack pnpm --filter @pingpang/mobile test -- http.spec.ts` and verify the environment test fails first.
- [ ] Implement environment-aware base URL resolution and add mp-weixin build scripts/config.
- [ ] Re-run `corepack pnpm --filter @pingpang/mobile test -- http.spec.ts`, `D:\CODE\pingpang\apps\mobile\node_modules\.bin\vue-tsc.cmd --noEmit -p D:\CODE\pingpang\apps\mobile\tsconfig.json`, and `corepack pnpm build`.

## Self-review

- Spec coverage: thread API, message center filters, read sync, and mp-weixin preparation are each mapped to a dedicated task.
- Placeholder scan: no TODO or TBD placeholders remain.
- Type consistency: mobile service types and API endpoints stay aligned around existing `matchId`-based thread semantics.
