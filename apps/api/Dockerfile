# ----- Build stage -----
FROM node:20-bookworm-slim AS builder

ENV PNPM_HOME=/usr/local/share/pnpm \
    PATH=/usr/local/share/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

# Copy lockfile/manifests + .npmrc (mirror config) first so this layer
# caches as long as no manifest changes.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY .npmrc ./.npmrc
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/mobile/package.json apps/mobile/
COPY packages/contracts/package.json packages/contracts/

RUN pnpm install --frozen-lockfile --filter @pingpang/api...

# Copy the source needed for the api build only.
COPY packages/contracts packages/contracts
COPY apps/api apps/api

# Generate the Prisma client + compile NestJS to dist/. Keep dev deps
# around for the build; the runtime stage uses pnpm deploy --legacy below
# to flatten only the production set.
RUN pnpm --filter @pingpang/api exec prisma generate \
    && pnpm --filter @pingpang/api build

# `pnpm deploy --legacy` produces a *flat* node_modules so node's require()
# can resolve every transitive dep without the workspace symlinks pnpm 10
# normally emits. Without it the runtime container crashes immediately on
# `Cannot find module 'reflect-metadata'`.
RUN pnpm --filter @pingpang/api deploy --prod --legacy /deploy/api

# ----- Runtime stage -----
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=3000

# node:bookworm-slim already has openssl + ca-certificates; we only need a
# tiny init wrapper to forward signals. We ship the static binary in the
# repo (apps/api/vendor/dumb-init) instead of `ADD`-ing from GitHub at
# build time — connections to github.com from mainland China time out
# unpredictably and break otherwise-clean rebuilds.
COPY apps/api/vendor/dumb-init /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

WORKDIR /app

# Pull the flattened deploy bundle from the builder. /deploy/api contains
# package.json + a complete flat node_modules; we layer dist/ + prisma on
# top of that.
COPY --from=builder /deploy/api/package.json     ./package.json
COPY --from=builder /deploy/api/node_modules     ./node_modules
COPY --from=builder /workspace/apps/api/dist     ./dist
COPY --from=builder /workspace/apps/api/prisma   ./prisma
# nest build keeps generated/prisma/* outside dist; mount it where the
# compiled JS does `require('../../generated/prisma')` from
# dist/src/common/prisma/prisma.service.js, i.e. dist/src/generated/prisma.
COPY --from=builder /workspace/apps/api/src/generated ./dist/src/generated

EXPOSE 3000
USER node

# Apply migrations on boot unless the operator runs them in a separate
# job (SKIP_MIGRATIONS=1). Nest compiles to dist/src/main.js, not
# dist/main.js — keep the path in sync with the source layout.
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "if [ \"$SKIP_MIGRATIONS\" != \"1\" ]; then ./node_modules/.bin/prisma migrate deploy; fi && node dist/src/main.js"]
