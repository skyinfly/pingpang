# Miniapp Runtime, Chat Participants, and Auth Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add device-friendly miniapp API configuration, persisted chat participants/read receipts, and bearer-token protection for the current MVP API.

**Architecture:** Persist chat thread metadata in Prisma and derive thread summaries from participant membership plus per-user message rows. Use a reusable auth guard to resolve the current user server-side, then move the mobile app to token persistence and centralized auth headers so both H5 and WeChat flows keep working.

**Tech Stack:** `NestJS`, `Prisma`, `uni-app`, `Vue 3`, `Pinia`, `Vitest`, `Jest`

---

## Planned File Structure

- Spec: `docs/superpowers/specs/2026-04-20-miniapp-chat-auth-design.md`
- Plan: `docs/superpowers/plans/2026-04-20-miniapp-chat-auth-hardening.md`
- Prisma: `apps/api/prisma/schema.prisma`, `apps/api/prisma/seed.ts`
- API auth: `apps/api/src/auth/dev-auth.ts`, `apps/api/src/auth/auth.service.ts`, `apps/api/src/common/auth/*`, `apps/api/src/users/users.controller.ts`
- API chat: `apps/api/src/messages/chat-threads.controller.ts`, `apps/api/src/messages/messages.controller.ts`, `apps/api/src/messages/messages.service.ts`, `apps/api/src/matches/matches.service.ts`
- API tests: `apps/api/test/auth.e2e-spec.ts`, `apps/api/test/messages.e2e-spec.ts`, `apps/api/test/matches.e2e-spec.ts`
- Mobile auth/runtime: `apps/mobile/src/services/http.ts`, `apps/mobile/src/services/api.ts`, `apps/mobile/src/stores/auth.ts`, `apps/mobile/src/main.ts`, `apps/mobile/src/services/types.ts`
- Mobile tests: `apps/mobile/src/__tests__/auth-services.spec.ts`, `apps/mobile/src/__tests__/http.spec.ts`
- Tooling: `tools/mobile/run-mobile-with-api.mjs`, root `package.json`, `.env.example`

### Task 1: Persist chat threads, participants, and receipts

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Modify: `apps/api/prisma/seed.ts`
- Modify: `apps/api/src/messages/messages.service.ts`
- Modify: `apps/api/src/messages/chat-threads.controller.ts`
- Modify: `apps/api/src/messages/messages.controller.ts`
- Modify: `apps/api/src/matches/matches.service.ts`
- Modify: `apps/api/test/messages.e2e-spec.ts`
- Modify: `apps/api/test/matches.e2e-spec.ts`

- [ ] Add failing e2e coverage for persisted participants, thread message send fan-out, and thread-level read receipts.
- [ ] Run `corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json messages.e2e-spec.ts matches.e2e-spec.ts` and confirm the new assertions fail.
- [ ] Extend Prisma with `ChatThread` and `ChatThreadParticipant`, plus `Message.threadId` and `Match.hostUserId`.
- [ ] Implement thread creation on match creation, participant enrollment on apply, authenticated thread message send, and participant receipt updates.
- [ ] Re-run the targeted in-band API e2e command until it passes.

### Task 2: Protect MVP API routes with bearer-token auth

**Files:**
- Create: `apps/api/src/common/auth/auth-user.decorator.ts`
- Create: `apps/api/src/common/auth/dev-bearer.guard.ts`
- Modify: `apps/api/src/auth/dev-auth.ts`
- Modify: `apps/api/src/auth/auth.service.ts`
- Modify: `apps/api/src/users/users.controller.ts`
- Modify: `apps/api/src/messages/messages.controller.ts`
- Modify: `apps/api/src/messages/chat-threads.controller.ts`
- Modify: `apps/api/src/matches/matches.controller.ts`
- Modify: `apps/api/test/auth.e2e-spec.ts`
- Modify: `apps/api/test/messages.e2e-spec.ts`
- Modify: `apps/api/test/matches.e2e-spec.ts`

- [ ] Add failing auth tests that prove protected routes reject missing bearer tokens and ignore spoofed caller `userId` values.
- [ ] Run `corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json auth.e2e-spec.ts messages.e2e-spec.ts matches.e2e-spec.ts` and confirm the new auth expectations fail.
- [ ] Implement reusable bearer-token resolution and switch protected controllers to derive the current user from request auth context.
- [ ] Re-run the targeted API auth/e2e command until it passes.

### Task 3: Persist mobile session and add miniapp runtime/deploy helpers

**Files:**
- Modify: `apps/mobile/src/services/http.ts`
- Modify: `apps/mobile/src/services/api.ts`
- Modify: `apps/mobile/src/services/types.ts`
- Modify: `apps/mobile/src/stores/auth.ts`
- Modify: `apps/mobile/src/main.ts`
- Modify: `apps/mobile/src/pages/login/index.vue`
- Modify: `apps/mobile/src/__tests__/auth-services.spec.ts`
- Modify: `apps/mobile/src/__tests__/http.spec.ts`
- Modify: `.env.example`
- Create: `tools/mobile/run-mobile-with-api.mjs`
- Modify: `package.json`

- [ ] Add failing mobile tests for auth session restore, centralized auth headers, and platform-specific API base URL resolution.
- [ ] Run `corepack pnpm --filter @pingpang/mobile test -- auth-services.spec.ts http.spec.ts` and confirm the new expectations fail.
- [ ] Implement auth persistence, shared auth header injection, platform-aware API base URL fallbacks, and helper scripts for H5/miniapp LAN debugging.
- [ ] Re-run `corepack pnpm --filter @pingpang/mobile test`, `D:\CODE\pingpang\apps\mobile\node_modules\.bin\vue-tsc.CMD --noEmit -p D:\CODE\pingpang\apps\mobile\tsconfig.json`, `corepack pnpm --filter @pingpang/api exec tsc --noEmit -p tsconfig.json`, `corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json`, `D:\CODE\pingpang\apps\mobile\node_modules\.bin\uni.CMD build -p h5`, `D:\CODE\pingpang\apps\mobile\node_modules\.bin\uni.CMD build -p mp-weixin`, and `corepack pnpm build`.

## Self-review

- Spec coverage: miniapp runtime config, persisted chat participants/receipts, protected routes, mobile token persistence, and local deploy helpers each map to a task.
- Placeholder scan: no TODO/TBD markers remain.
- Type consistency: thread identity stays match-centered for this phase, while auth moves to bearer-token derived user context across both API and mobile layers.
