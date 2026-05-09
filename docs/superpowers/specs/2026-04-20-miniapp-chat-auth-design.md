# Miniapp Runtime, Chat Participants, and Auth Hardening Design

## Goal

Stabilize the project for the next MVP phase by making mini program API routing configurable for device debugging, upgrading chat from a computed thread summary to a persisted thread-participant model with read receipts, and hardening API access around bearer-token authentication instead of open `userId` query parameters.

## Scope

This design covers three linked upgrades:

1. Miniapp runtime configuration for H5 and WeChat device debugging.
2. Persisted chat thread metadata, participant membership, and participant-level read receipts.
3. Shared bearer-token authentication for protected API routes, mobile token persistence, and basic local deployment scripts.

This phase does not add payment, real SMS, or a production identity provider. The existing dev login flow remains the bootstrap mechanism.

## Approach Options

### Option A: Incremental hardening on top of current MVP data model

Keep the current product shape, add persisted `ChatThread` and `ChatThreadParticipant` tables, fan out chat messages per participant, and secure current routes with a simple dev bearer token guard.

Pros:
- Lowest risk to the existing pages and tests.
- Preserves current mobile flow while making backend boundaries much cleaner.
- Gives us a stable base for later real auth provider migration.

Cons:
- Still uses dev token semantics rather than JWT or external auth.
- Chat remains match-centered rather than a general messaging system.

### Option B: Full conversation domain and JWT rollout

Introduce JWT issuance, refresh tokens, generic conversation IDs, participant roles, and a more formal message receipt model in one step.

Pros:
- More production-like architecture.
- Less future migration in the auth layer.

Cons:
- Too large for the current MVP cadence.
- Higher regression risk across mobile and API.

### Option C: Frontend-only runtime config plus docs

Only add miniapp base URL configuration and documentation, deferring chat/auth changes.

Pros:
- Fastest delivery.

Cons:
- Leaves the most important data and security gaps open.

## Recommended Option

Option A is the right fit. It upgrades the architecture where the MVP is already straining, but stays within the existing product boundaries.

## Design

### 1. Miniapp runtime configuration

The mobile app should resolve API base URLs in this order:

1. Explicit `VITE_API_BASE_URL`
2. Platform-specific `VITE_API_BASE_URL_MP_WEIXIN` or `VITE_API_BASE_URL_H5`
3. Safe defaults (`127.0.0.1` for miniapp, `localhost` for H5)

We will also add root helper scripts that let local developers pass a LAN API host when starting or building the miniapp. This avoids editing source files just to debug on a phone or in WeChat DevTools.

### 2. Chat thread domain

Chat will move from “messages grouped by `matchId`” to an explicit persisted domain:

- `ChatThread`: one thread per match for now.
- `ChatThreadParticipant`: membership, role, and `lastReadAt` timestamp.
- `Message.threadId`: links each persisted chat message to its thread.

Thread IDs will stay aligned with match IDs for this phase to keep the frontend transition small, but thread metadata becomes explicit and queryable. Thread summaries will come from `ChatThread` plus unread counts derived from participant read state.

When a match is created, the backend also creates the thread and enrolls the host as an owner participant. When a user applies to a match, the backend enrolls the applicant as a participant. Sending a chat message creates per-user message rows for every participant so the current notification feed stays intact.

### 3. Read receipts

Thread reads will update both:

- participant `lastReadAt`
- unread message rows for that user in the thread

This keeps feed counts backward-compatible while also giving us a real receipt checkpoint for future UI such as “last seen” or message separators.

### 4. Authentication hardening

Protected routes will stop trusting caller-supplied `userId` as the source of identity. Instead:

- a reusable bearer-token guard reads the dev token from `Authorization`
- request context exposes the authenticated user
- protected controllers derive `userId` from auth context

The dev login flow still returns the existing dev token, so we do not break onboarding. We are only moving identity resolution server-side.

Protected endpoints in this phase:

- `GET /users/me`
- `GET /messages`
- `GET /messages/summary`
- `GET /chat-threads`
- `GET /chat-threads/:threadId/messages`
- `POST /chat-threads/:threadId/messages`
- `POST /chat-threads/:threadId/read`
- `POST /matches`
- `POST /matches/:id/applications`
- `GET /reviews/profile/:userId` stays public for now because profiles are user-facing.

### 5. Mobile auth state

The mobile auth store will persist session data to local storage and restore it during app boot. API helpers will centralize auth headers so protected calls do not manually pass tokens one-by-one.

### 6. Local deploy scripts

We will add simple root-level scripts for:

- starting the API in dev mode
- starting H5 against an explicit API host
- starting miniapp against an explicit API host
- building miniapp against an explicit API host

These scripts are for local/dev deployment ergonomics, not cloud provisioning.

## Testing Strategy

- Prisma migration and seed coverage for new thread models.
- API e2e tests for thread membership, message fan-out, read receipts, and protected-route auth failures.
- Mobile tests for persisted auth store bootstrap and auth header injection.
- Miniapp/H5 base URL resolution tests.
- Final verification must run API e2e in band because tests share the same local database.

## Risks and Mitigations

### Risk: Message fan-out changes unread counts

Mitigation: keep summary endpoints based on user-scoped message rows and add thread participant tests that verify counts after send/read cycles.

### Risk: Route protection breaks existing mobile pages

Mitigation: centralize auth headers in the mobile HTTP layer and add auth store bootstrap before switching endpoints.

### Risk: WeChat local debugging still points at unreachable localhost

Mitigation: add explicit platform env variables and helper scripts that accept LAN API URLs.
