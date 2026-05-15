# syntax=docker/dockerfile:1.7

# ----- Build stage -----
FROM node:20-bookworm-slim AS builder

ENV PNPM_HOME=/usr/local/share/pnpm \
    PATH=/usr/local/share/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/admin/package.json apps/admin/
COPY apps/mobile/package.json apps/mobile/
COPY packages/contracts/package.json packages/contracts/

RUN pnpm install --frozen-lockfile --filter @pingpang/admin...

COPY packages/contracts packages/contracts
COPY apps/admin apps/admin

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN pnpm --filter @pingpang/admin build

# ----- Runtime stage: nginx serving the built bundle -----
FROM nginx:1.27-alpine AS runtime

COPY --from=builder /workspace/apps/admin/dist /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
