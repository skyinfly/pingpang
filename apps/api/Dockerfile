# syntax=docker/dockerfile:1.7

# ----- Build stage -----
FROM node:20-bookworm-slim AS builder

ENV PNPM_HOME=/usr/local/share/pnpm \
    PATH=/usr/local/share/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

# Copy workspace manifest + lockfile + every package manifest first so this
# layer caches as long as no manifest changes.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/mobile/package.json apps/mobile/
COPY packages/contracts/package.json packages/contracts/

RUN pnpm install --frozen-lockfile --filter @pingpang/api...

# Copy the source needed for the api build only.
COPY packages/contracts packages/contracts
COPY apps/api apps/api

# Generate the Prisma client + compile NestJS to dist/
RUN pnpm --filter @pingpang/api exec prisma generate \
    && pnpm --filter @pingpang/api build

# Prune dev dependencies for the runtime image.
RUN pnpm install --frozen-lockfile --filter @pingpang/api --prod \
    && pnpm store prune

# ----- Runtime stage -----
FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=3000

# OpenSSL is required by Prisma's query engine.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates dumb-init \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Bring over the compiled output, runtime deps, prisma assets, and migrations.
COPY --from=builder /workspace/apps/api/dist ./dist
COPY --from=builder /workspace/apps/api/node_modules ./node_modules
COPY --from=builder /workspace/apps/api/package.json ./package.json
COPY --from=builder /workspace/apps/api/prisma ./prisma
COPY --from=builder /workspace/node_modules ./root_node_modules

# nest build keeps generated/prisma/* outside dist; mount it next to dist so
# the runtime require('../generated/prisma') still resolves.
COPY --from=builder /workspace/apps/api/src/generated ./src/generated

EXPOSE 3000

USER node

# Run prisma migrate deploy as part of the entry so the schema is always in
# sync with the binary. Skip with SKIP_MIGRATIONS=1 if your operator runs
# migrations in a separate job (recommended for k8s).
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "if [ \"$SKIP_MIGRATIONS\" != \"1\" ]; then ./node_modules/.bin/prisma migrate deploy; fi && node dist/main.js"]
