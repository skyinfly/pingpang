# Deployment guide

## Prerequisites

* Node 20 + pnpm 10.8 (CI uses these exact versions).
* PostgreSQL 16 with WAL archiving + nightly snapshot in production.
* Redis 7 (single instance is fine to start; cluster later).
* SMS provider account (Aliyun by default; replace with your carrier of choice — see "Pluggable SMS").
* Optional: Sentry DSN, log aggregation backend.

## Required env vars

See `.env.example`. Production must set, at minimum:

| Variable | Why |
|----------|-----|
| `NODE_ENV=production` | Locks down dev shortcuts. |
| `DATABASE_URL` | Postgres connection (use a long-lived role with read/write only). |
| `REDIS_URL` | Real Redis (not the in-memory fallback). |
| `AUTH_TOKEN_SECRET` | HMAC secret for session JWT. Rotate independently per env. |
| `ADMIN_TOKEN` | X-Admin-Token guard for /admin/*. Rotate quarterly. |
| `ALLOW_DEV_LOGIN=false` | Required, the bootstrap throws otherwise. |
| `SMS_PROVIDER=aliyun` (or your provider) | `log` is rejected in production. |
| `ALIYUN_SMS_*` | Aliyun-specific keys when using the bundled provider. |
| `CORS_ALLOW_ORIGIN` | Comma-separated allowlist; empty = permissive (dev only). |
| `SENTRY_DSN` | Production error tracking. Leave empty in non-prod to skip. |

## Database migrations

* Local dev: `pnpm --filter @pingpang/api db:migrate -- --name <change>`
* Production deploy: `pnpm --filter @pingpang/api db:migrate:deploy`
* Never run `db push` against staging/production. The Dockerfile entrypoint
  runs `prisma migrate deploy` automatically; set `SKIP_MIGRATIONS=1` if a
  separate operator job owns migrations (recommended for k8s).

See `apps/api/prisma/README.md` for the day-to-day workflow.

## Container build

A multi-stage Dockerfile lives next to each deployable:

* `apps/api/Dockerfile` — NestJS API, runs migrations + `node dist/main.js`.
* `apps/admin/Dockerfile` — Vite SPA served by nginx on port 80.
* `apps/mobile/Dockerfile` — uni-app H5 bundle served by nginx on port 80.

Build from the repo root so the workspace lockfile is in scope:

```bash
docker build -f apps/api/Dockerfile -t pingpang-api .
docker build -f apps/admin/Dockerfile --build-arg VITE_API_BASE_URL=https://api.example.com -t pingpang-admin .
docker build -f apps/mobile/Dockerfile --build-arg VITE_API_BASE_URL_H5=https://api.example.com -t pingpang-h5 .
```

## Local prod-like rehearsal

```bash
cp .env.example .env
# fill in AUTH_TOKEN_SECRET, ADMIN_TOKEN, ALIYUN_SMS_*, optionally SENTRY_DSN
docker compose --env-file .env up --build
```

This brings up Postgres, Redis, the API (with migrations), admin on
http://localhost:8080 and the mobile H5 on http://localhost:8081. Use it to
catch container-only issues (missing env vars, openssl, file permissions)
before pushing to staging.

## Kubernetes hints

* Run `prisma migrate deploy` in an `initContainer` rather than the main
  container start command (`SKIP_MIGRATIONS=1`).
* Liveness probe: `GET /health/live`.
* Readiness probe: `GET /health/ready` (probes DB + Redis).
* Set `LOG_LEVEL=info` in production; pino emits JSON for the cluster log
  shipper.
* Inject secrets via your platform's secret manager; never bake them into
  images.

## Pluggable SMS

The auth flow talks to a `SmsProvider` interface in
`apps/api/src/auth/sms/sms-provider.ts`. Two implementations ship today:

* `LogSmsProvider` — dev-only fallback that logs the OTP. Selected when
  `SMS_PROVIDER` is unset and `NODE_ENV !== 'production'`. Production
  bootstrap throws if you try to keep this on.
* `AliyunSmsProvider` — talks to Aliyun dysmsapi via signed HTTP, no SDK
  dependency. Selected with `SMS_PROVIDER=aliyun` plus the four `ALIYUN_SMS_*`
  env vars.

Adding a new carrier (e.g. Tencent Cloud, Twilio):
1. Create `apps/api/src/auth/sms/<carrier>-sms.provider.ts` implementing
   `SmsProvider`.
2. Register it in `apps/auth/sms/sms.module.ts` and add the lookup branch
   in `smsProviderFactory`.
3. Document the env vars in `.env.example`.

## Checklist before flipping DNS

- [ ] ICP filing complete for the production domain.
- [ ] WeChat mini-program audited and approved.
- [ ] Privacy policy + ToS pages live.
- [ ] Customer service contact in product.
- [ ] Real venue catalogue seeded (staging looks like production).
- [ ] `pnpm verify` green on the latest commit.
- [ ] `release:verify` green against staging Postgres.
- [ ] Backups configured (Postgres WAL archive, snapshot schedule).
- [ ] Sentry receives a test exception.
- [ ] Health probes wired into the platform load balancer.
- [ ] Admin token + AUTH_TOKEN_SECRET rotated and stored in secret manager.
