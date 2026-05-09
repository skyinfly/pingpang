# Admin Web System Design

## Goal

Build a separate web admin system for Pingpang while keeping the existing user-facing H5 app focused on player workflows.

## Chosen Approach

Use `apps/admin` as an independent Vue 3 + Vite app. It talks to the existing NestJS API through dedicated `/admin/*` endpoints and can be built, previewed, and deployed separately from `apps/mobile`.

## Scope

- Admin dashboard with key operating metrics.
- Match management list with status, capacity, host, venue, and application counts.
- User management list with credit score and activity counts.
- Venue management list with active/inactive status, courts, slots, and usage counts.
- Admin auth guard based on a configurable admin token for this release stage.
- Build and test scripts for the new admin app.

## Out Of Scope

- WeChat mini program release work.
- Full role-based access control.
- Complex moderation workflows such as message deletion and user banning.
- Visual charting libraries. The first version uses cards and tables to keep the release small.

## API Design

- `GET /admin/summary` returns aggregate metrics for operations.
- `GET /admin/matches` returns match rows with host and application counts.
- `GET /admin/users` returns user rows with hosted and joined counts.
- `GET /admin/venues` returns venue rows with courts, slots, and match counts.
- Every `/admin/*` endpoint requires `X-Admin-Token`.
- In non-production, the default token is `dev-admin-token`.
- In production, `ADMIN_TOKEN` must be explicitly configured.

## Frontend Design

The admin app has one release-ready page:

- Top header with product name, API connection status, and token state.
- Metric cards for users, matches, pending applications, venues, unread messages, and reviews.
- Tabbed operating tables for matches, users, and venues.
- Empty, loading, and error states in Chinese.
- Local token input saved to `localStorage`.

## Testing

- API e2e tests cover admin guard behavior and each admin endpoint shape.
- Admin unit tests cover token storage, API client headers, summary rendering, and error text.
- Build verification includes `tsc`, `vitest`, and `vite build` for `apps/admin`.

## Release Notes

This is a first publishable admin version. It prioritizes operational visibility and safe access over deep editing features. Editing and moderation actions can be added after the data dashboard is stable.
