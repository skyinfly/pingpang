# Messages, Reviews, and Migrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the mobile messages/profile/chat pages to persisted API data, add chat send/read persistence, and capture the current Prisma schema as formal migrations.

**Architecture:** Extend the existing `Message` and `Review` persistence with read/query endpoints that keep the current MVP response shapes simple. Reuse the mobile `services/api.ts` layer and Pinia auth state so the pages stay thin, then lock the schema in Prisma migrations after the backend contract is proven by e2e tests.

**Tech Stack:** `uni-app`, `Vue 3`, `TypeScript`, `NestJS`, `Prisma`, `PostgreSQL`, `Jest`, `Vitest`

---

## Planned File Structure

- Plan: `docs/superpowers/plans/2026-04-18-messages-reviews-migrations.md`
- Contracts: `packages/contracts/src/messages.ts`, `packages/contracts/src/reviews.ts`, `packages/contracts/src/index.ts`
- API messages: `apps/api/src/messages/messages.controller.ts`, `apps/api/src/messages/messages.service.ts`, `apps/api/src/messages/messages.module.ts`
- API reviews: `apps/api/src/reviews/reviews.controller.ts`, `apps/api/src/reviews/reviews.service.ts`, `apps/api/src/reviews/reviews.module.ts`
- API tests: `apps/api/test/messages.e2e-spec.ts`, `apps/api/test/reviews.e2e-spec.ts`
- Mobile API/types: `apps/mobile/src/services/api.ts`, `apps/mobile/src/services/types.ts`
- Mobile state/composables: `apps/mobile/src/composables/useMessagesQuery.ts`, `apps/mobile/src/composables/useProfileReviewsQuery.ts`, `apps/mobile/src/composables/useChatMessagesQuery.ts`
- Mobile pages: `apps/mobile/src/pages/messages/index.vue`, `apps/mobile/src/pages/profile/index.vue`, `apps/mobile/src/pages/chat/index.vue`
- Mobile tests: `apps/mobile/src/__tests__/messages-page.spec.ts`, `apps/mobile/src/__tests__/profile-page.spec.ts`, `apps/mobile/src/__tests__/chat-page.spec.ts`
- Prisma migration: `apps/api/prisma/migrations/*`

## Task 1: Persisted message and review query contracts

**Files:**
- Modify: `apps/api/src/messages/messages.controller.ts`
- Modify: `apps/api/src/messages/messages.service.ts`
- Modify: `apps/api/src/reviews/reviews.controller.ts`
- Modify: `apps/api/src/reviews/reviews.service.ts`
- Modify: `packages/contracts/src/messages.ts`
- Modify: `packages/contracts/src/reviews.ts`
- Modify: `packages/contracts/src/index.ts`
- Modify: `apps/api/test/messages.e2e-spec.ts`
- Modify: `apps/api/test/reviews.e2e-spec.ts`

- [ ] Add failing e2e coverage for `GET /messages`, `POST /messages`, `POST /messages/read`, and `GET /reviews/profile/:userId`.
- [ ] Run `corepack pnpm --filter @pingpang/api test:e2e -- messages.e2e-spec.ts` and `corepack pnpm --filter @pingpang/api test:e2e -- reviews.e2e-spec.ts` to verify the new expectations fail for the right reasons.
- [ ] Implement the minimal NestJS controller/service changes so persisted chat send, mark-as-read, and profile review queries pass while preserving simple JSON shapes.
- [ ] Update contract exports so the mobile app can type against the new payloads.
- [ ] Re-run the two e2e files until both are green.

## Task 2: Connect mobile messages, profile, and chat pages to live APIs

**Files:**
- Create: `apps/mobile/src/composables/useMessagesQuery.ts`
- Create: `apps/mobile/src/composables/useProfileReviewsQuery.ts`
- Create: `apps/mobile/src/composables/useChatMessagesQuery.ts`
- Modify: `apps/mobile/src/services/api.ts`
- Modify: `apps/mobile/src/services/types.ts`
- Modify: `apps/mobile/src/pages/messages/index.vue`
- Modify: `apps/mobile/src/pages/profile/index.vue`
- Modify: `apps/mobile/src/pages/chat/index.vue`
- Create: `apps/mobile/src/__tests__/messages-page.spec.ts`
- Create: `apps/mobile/src/__tests__/profile-page.spec.ts`
- Create: `apps/mobile/src/__tests__/chat-page.spec.ts`

- [ ] Write failing mobile tests that assert the three pages render API-backed data instead of hard-coded copy.
- [ ] Run `corepack pnpm --filter @pingpang/mobile test -- messages-page.spec.ts`, `profile-page.spec.ts`, and `chat-page.spec.ts` to confirm the failures are genuine.
- [ ] Add the new client functions and composables, wiring them through the auth store token/user id where needed.
- [ ] Replace static page content with loading/error/data states that preserve the existing visual direction.
- [ ] Re-run the new mobile tests and the existing `create-match.spec.ts` smoke check until all are green.

## Task 3: Formalize Prisma migrations

**Files:**
- Create: `apps/api/prisma/migrations/*`
- Modify: `apps/api/package.json`
- Optionally modify: `apps/api/prisma/seed.ts` if migration application exposes schema assumptions

- [ ] Run `prisma migrate dev --name init-persistence-chat` against the local PostgreSQL workspace database to generate the first committed migration.
- [ ] Verify the migration can be applied cleanly after a reset with `prisma migrate reset --force --skip-generate` and a fresh `db:seed`.
- [ ] Re-run the API e2e suite, mobile tests, and workspace build so the migration state is proven end-to-end.

## Self-review

- Spec coverage: all three requested follow-up tasks map directly to Task 1 through Task 3.
- Placeholder scan: no TODO/TBD placeholders remain.
- Type consistency: message and review changes are constrained to the existing contracts/API/mobile service boundary.
