# Release Playbook

## Required Environment Variables

- `DATABASE_URL`
- `REDIS_URL`
- `AUTH_TOKEN_SECRET`
- `AUTH_TOKEN_TTL_SECONDS`
- `ALLOW_DEV_LOGIN`
- `VITE_API_BASE_URL_H5`
- `VITE_API_BASE_URL_MP_WEIXIN`

## API Release Steps

1. Build the API:

```bash
pnpm build:api
```

2. Apply Prisma migrations:

```bash
pnpm --filter @pingpang/api db:migrate:deploy
```

3. Start the API in production mode:

```bash
pnpm start:api:prod
```

## Verification Before Release

Run the consolidated verification script:

```bash
pnpm release:verify
```

This runs:

- Prisma client generation
- database sync
- database seed
- API typecheck
- API e2e
- mobile tests
- mobile typecheck
- H5 build
- `mp-weixin` build
- workspace smoke check

## Miniapp Release Output

Miniapp build directory:

`apps/mobile/dist/build/mp-weixin`

## Notes

- `ALLOW_DEV_LOGIN` should be `false` outside development and staging workflows
- `AUTH_TOKEN_SECRET` must be a real secret in non-local environments