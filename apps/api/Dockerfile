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

# node:bookworm-slim already has openssl + ca-certificates. dumb-init comes
# from the Debian apt repo (architecture-agnostic — the previously vendored
# x86-64 binary broke on arm64 with "exec format error").
RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init \
    && rm -rf /var/lib/apt/lists/*

# `pnpm deploy --prod --legacy` strips devDependencies, so the `prisma` CLI
# (a devDependency) never lands in the runtime node_modules. Install it
# globally so the boot-time `prisma migrate deploy` below can run.
RUN npm install -g prisma@6.19.3

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
CMD ["sh", "-c", "if [ \"$SKIP_MIGRATIONS\" != \"1\" ]; then prisma migrate deploy --schema prisma/schema.prisma; fi && node dist/src/main.js"]
