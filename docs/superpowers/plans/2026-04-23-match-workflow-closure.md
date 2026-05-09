# Match Workflow Closure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the core match workflow so hosts can review applications, players can see joined matches only after approval, and unauthenticated users get clear page states instead of broken-looking screens.

**Architecture:** Extend the existing `MatchApplication` flow instead of inventing a new workflow model. Approval remains match-owned in the API, messages stay the system of record for user notifications, and the mobile app consumes two new match endpoints plus explicit unauthenticated/empty states.

**Tech Stack:** NestJS, Prisma, PostgreSQL, Vue 3, uni-app, Pinia, TanStack Query, Vitest, Jest e2e

---

### Task 1: Lock the approval workflow with failing backend tests

**Files:**
- Modify: `D:/CODE/pingpang/apps/api/test/matches.e2e-spec.ts`
- Modify: `D:/CODE/pingpang/apps/api/test/messages.e2e-spec.ts`

- [ ] **Step 1: Write the failing tests**

Add e2e coverage for:
- applicant cannot access `/chat-threads/:threadId` while application is still `pending`
- host can fetch `/matches/:id/applications`
- host can `POST /matches/:id/applications/:applicationId/approve`
- approval adds thread membership, decrements `openSlots`, and creates a result message for the applicant
- `GET /matches/joined` returns only approved applications

- [ ] **Step 2: Run the backend tests to verify red**

Run: `corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json matches.e2e-spec.ts messages.e2e-spec.ts`
Expected: FAIL with missing route / forbidden behavior mismatch.

### Task 2: Implement host review + joined matches in the API

**Files:**
- Modify: `D:/CODE/pingpang/apps/api/src/matches/matches.controller.ts`
- Modify: `D:/CODE/pingpang/apps/api/src/matches/matches.service.ts`
- Modify: `D:/CODE/pingpang/apps/api/src/messages/messages.service.ts`
- Modify: `D:/CODE/pingpang/apps/api/src/messages/chat-threads.controller.ts`
- Modify: `D:/CODE/pingpang/apps/api/src/messages/messages.controller.ts`

- [ ] **Step 1: Add host review endpoints**
- `GET /matches/:id/applications`
- `POST /matches/:id/applications/:applicationId/approve`
- `POST /matches/:id/applications/:applicationId/reject`

- [ ] **Step 2: Move thread membership to approval time**
- keep `apply()` creating only a `pending` application
- do not upsert `chatThreadParticipant` during apply
- on approve, create the participant record and mark status `approved`
- on reject, keep participant absent and mark status `rejected`

- [ ] **Step 3: Add joined-match listing**
- add `listJoined(userId)` using approved `MatchApplication` rows
- expose it at `GET /matches/joined`

- [ ] **Step 4: Emit decision messages**
- on apply, send the host a pending-action message
- on approve/reject, send the applicant a result message
- ensure message payloads include `matchId` so the mobile app can navigate to details

- [ ] **Step 5: Re-run backend tests**

Run: `corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json matches.e2e-spec.ts messages.e2e-spec.ts`
Expected: PASS.

### Task 3: Add mobile data hooks for hosted applications and joined matches

**Files:**
- Modify: `D:/CODE/pingpang/apps/mobile/src/services/types.ts`
- Modify: `D:/CODE/pingpang/apps/mobile/src/services/api.ts`
- Create: `D:/CODE/pingpang/apps/mobile/src/composables/useHostedMatchApplicationsQuery.ts`
- Create: `D:/CODE/pingpang/apps/mobile/src/composables/useJoinedMatchesQuery.ts`

- [ ] **Step 1: Write the failing mobile tests**
- add coverage for joined matches rendering in profile
- add coverage for host application cards and approve action in match detail
- add coverage for unauthenticated empty/login states in profile/messages/chat

- [ ] **Step 2: Run the mobile tests to verify red**

Run: `corepack pnpm --filter @pingpang/mobile test -- profile-page.spec.ts messages-page.spec.ts match-detail-page.spec.ts chat-page.spec.ts`
Expected: FAIL with missing sections/actions.

- [ ] **Step 3: Implement typed API helpers**
- `listHostedApplications(matchId)`
- `approveHostedApplication(matchId, applicationId)`
- `rejectHostedApplication(matchId, applicationId)`
- `listJoinedMatches()`

### Task 4: Close the host and player UI workflows

**Files:**
- Modify: `D:/CODE/pingpang/apps/mobile/src/pages/match-detail/index.vue`
- Modify: `D:/CODE/pingpang/apps/mobile/src/pages/profile/index.vue`
- Modify: `D:/CODE/pingpang/apps/mobile/src/pages/messages/index.vue`
- Modify: `D:/CODE/pingpang/apps/mobile/src/pages/chat/index.vue`
- Modify: `D:/CODE/pingpang/apps/mobile/src/pages/square/index.vue`
- Modify: `D:/CODE/pingpang/apps/mobile/src/utils/copy.ts`

- [ ] **Step 1: Host view in match detail**
- when viewer is host, replace join CTA copy with pending applications list
- render approve/reject buttons for each application
- show success state after decision

- [ ] **Step 2: Profile workflow**
- add `我参加的球局`
- show explicit unauthenticated state with login CTA instead of loading placeholders
- keep `我发起的球局` visible only for authenticated users

- [ ] **Step 3: Messages workflow**
- make system/invite cards navigable by `matchId`
- add unauthenticated state and empty state copy
- keep chat cards navigating to chat threads

- [ ] **Step 4: Chat gating**
- remove default fallback `match-seed-1`
- if no `threadId`, render an instructional empty state
- if unauthenticated, render login guidance instead of fake conversation shell

- [ ] **Step 5: Square time formatting**
- replace hardcoded “今晚” wording with relative date formatting based on actual date

### Task 5: Full regression verification

**Files:**
- Modify: `D:/CODE/pingpang/apps/mobile/src/__tests__/profile-page.spec.ts`
- Modify: `D:/CODE/pingpang/apps/mobile/src/__tests__/messages-page.spec.ts`
- Modify: `D:/CODE/pingpang/apps/mobile/src/__tests__/match-detail-page.spec.ts`
- Modify: `D:/CODE/pingpang/apps/mobile/src/__tests__/chat-page.spec.ts`
- Modify: `D:/CODE/pingpang/apps/mobile/src/__tests__/square-page.spec.ts`

- [ ] **Step 1: Run targeted backend verification**

Run: `corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json matches.e2e-spec.ts messages.e2e-spec.ts`
Expected: PASS.

- [ ] **Step 2: Run targeted mobile verification**

Run: `corepack pnpm --filter @pingpang/mobile test -- profile-page.spec.ts messages-page.spec.ts match-detail-page.spec.ts chat-page.spec.ts square-page.spec.ts`
Expected: PASS.

- [ ] **Step 3: Run type and build verification**

Run:
- `D:\CODE\pingpang\apps\mobile\node_modules\.bin\vue-tsc.CMD --noEmit -p D:\CODE\pingpang\apps\mobile\tsconfig.json`
- `corepack pnpm --filter @pingpang/api exec tsc --noEmit -p tsconfig.json`
- `D:\CODE\pingpang\apps\mobile\node_modules\.bin\uni.CMD build -p h5`
- `corepack pnpm build`

Expected: PASS.
