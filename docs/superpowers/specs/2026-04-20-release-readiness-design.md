# Release Readiness Design

## Goal

Push the MVP one step closer to real deployment by improving three weak spots together: miniapp real-device debugging, richer chat conversation metadata, and auth/deploy behavior that is no longer purely development-only.

## Scope

This phase covers:

1. Miniapp device-debug readiness for H5 and `mp-weixin`
2. Richer persisted chat conversation metadata and participant detail
3. Signed session tokens, environment-driven auth toggles, and release helper scripts

This phase does not add a real SMS provider, payment, or cloud-specific IaC.

## Approach Options

### Option A: Incremental release-readiness hardening

Keep the current MVP structure, extend `ChatThread` with metadata and participant details, switch dev login sessions to signed tokens, and add helper scripts/docs for H5 and miniapp release workflows.

Pros:
- Reuses the current data model and UI flow
- Low regression risk
- Improves both product behavior and developer ergonomics in one pass

Cons:
- Still uses a development OTP gate instead of a real identity provider
- Release scripts stay local-first rather than cloud-specific

### Option B: Full production platform pass

Introduce JWT refresh flows, external auth, cloud deployment manifests, and a generalized messaging domain.

Pros:
- More complete production architecture

Cons:
- Too large for the current MVP cadence
- High regression risk

### Option C: Docs-only release prep

Only add documentation and scripts for miniapp debugging and deployment.

Pros:
- Fastest path

Cons:
- Leaves the backend auth and chat domain underpowered

## Recommended Option

Option A is the right fit. It fixes the places where the MVP is already feeling transitional without dragging the project into a full platform rewrite.

## Design

### 1. Miniapp device debugging and release ergonomics

We will keep the existing `VITE_API_BASE_URL` resolution order, but make local device usage easier with two additions:

- helper scripts that accept `--api-host`, `--api-port`, and produce the correct H5 or miniapp API base URL
- a small device-debug guide that explains WeChat DevTools import, LAN host setup, and the current `urlCheck` development behavior

This keeps source code clean while making “build and open on device” much more repeatable.

### 2. Chat conversation metadata

`ChatThread` should carry enough product information to be useful on its own instead of acting like a thin grouping key. We will add:

- `status`
- `venueName`
- `scheduledAt`
- `hostUserId`
- `lastMessageSenderId`
- `lastMessageSenderName`

We will also expose a `GET /chat-threads/:threadId` detail endpoint that returns:

- thread metadata
- participant list with role, nickname, city, level, joined time, and last read time
- unread count for the current user

This gives the mobile chat page a real header and gives the message center richer chat cards.

### 3. Participant and receipt model

We will keep receipts lightweight in this phase:

- participant-level `lastReadAt`
- user-scoped unread message rows

The participant list becomes the canonical source for who is in the conversation and what their current role is.

### 4. Signed session auth

The current bearer token shape is development-only and easy to spoof. We will switch to signed session tokens that:

- include user identity and expiry
- are signed with `AUTH_TOKEN_SECRET`
- have a configurable TTL

The dev OTP flow still creates the session, but the session token itself becomes environment-aware and server-verifiable.

We will also replace the “production means 404” auth rule with an explicit toggle:

- `ALLOW_DEV_LOGIN=true|false`

That gives us a cleaner staging story and avoids wiring environment behavior to `NODE_ENV` alone.

### 5. Release helpers

We will add:

- API build/start scripts for non-watch mode
- a release verification script that runs migrations, tests, and builds in the right order
- a short deployment guide covering env vars, Prisma migrate deploy, and miniapp build output

## Testing Strategy

- API e2e for signed session behavior and conversation detail endpoints
- API e2e for thread metadata updates after message sends
- Mobile page tests for richer thread metadata rendering
- Helper script smoke checks for H5 and miniapp build wrappers
- Final full verification:
  - API typecheck
  - API e2e
  - mobile tests
  - `vue-tsc`
  - H5 build
  - `mp-weixin` build
  - root workspace smoke check

## Risks and Mitigations

### Risk: Signed-token rollout breaks existing auth assumptions

Mitigation: keep the login API contract unchanged (`{ token, user }`) and update tests first.

### Risk: Chat metadata duplication drifts from matches

Mitigation: populate metadata from match creation/update paths only and keep thread IDs match-centered for this phase.

### Risk: Miniapp device guidance becomes stale

Mitigation: keep the guide focused on project-owned scripts and current WeChat import steps rather than broad ecosystem instructions.
