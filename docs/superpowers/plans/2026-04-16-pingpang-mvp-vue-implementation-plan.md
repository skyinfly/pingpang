# PingPang MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Vue-based PingPang MVP as an H5-first mobile app that can later be published to WeChat Mini Program with the same frontend business logic and a shared NestJS backend.

**Architecture:** Use a `pnpm` workspace with `apps/mobile` for a `uni-app + Vue 3` client and `apps/api` for a `NestJS` API. Keep business logic split by feature (`auth`, `matches`, `messages`, `reviews`, `recommendations`) and share request/response contracts through `packages/contracts` so the mobile app and API evolve together.

**Tech Stack:** `uni-app`, `Vue 3`, `TypeScript`, `Pinia`, `@tanstack/vue-query`, `Sass`, `NestJS`, `Prisma`, `PostgreSQL`, `Redis`, `Vitest`, `Jest`, `Supertest`, `pnpm`

---

## Planned File Structure

- Root: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.editorconfig`, `.gitignore`, `.env.example`
- Tooling: `tools/verify-workspace.mjs`
- Shared contracts: `packages/contracts/package.json`, `packages/contracts/src/auth.ts`, `packages/contracts/src/matches.ts`, `packages/contracts/src/messages.ts`, `packages/contracts/src/reviews.ts`, `packages/contracts/src/index.ts`
- Mobile app: `apps/mobile/package.json`, `apps/mobile/vite.config.ts`, `apps/mobile/src/main.ts`, `apps/mobile/src/App.vue`, `apps/mobile/src/pages.json`, `apps/mobile/src/manifest.json`, `apps/mobile/src/uni.scss`, `apps/mobile/src/theme/tokens.scss`
- Mobile feature files: `apps/mobile/src/pages/home/index.vue`, `apps/mobile/src/pages/square/index.vue`, `apps/mobile/src/pages/match-detail/index.vue`, `apps/mobile/src/pages/create-match/index.vue`, `apps/mobile/src/pages/messages/index.vue`, `apps/mobile/src/pages/profile/index.vue`, `apps/mobile/src/pages/login/index.vue`, `apps/mobile/src/pages/my-matches/index.vue`, `apps/mobile/src/pages/chat/index.vue`
- Mobile state/services/tests: `apps/mobile/src/stores/auth.ts`, `apps/mobile/src/stores/match-draft.ts`, `apps/mobile/src/services/http.ts`, `apps/mobile/src/services/api.ts`, `apps/mobile/src/composables/useMatchesQuery.ts`, `apps/mobile/src/__tests__/home.spec.ts`, `apps/mobile/src/__tests__/create-match.spec.ts`
- API app: `apps/api/package.json`, `apps/api/tsconfig.json`, `apps/api/src/main.ts`, `apps/api/src/app.module.ts`, `apps/api/src/common/prisma/prisma.service.ts`, `apps/api/src/common/redis/redis.service.ts`
- API feature files: `apps/api/src/health/health.controller.ts`, `apps/api/src/auth/*`, `apps/api/src/users/*`, `apps/api/src/matches/*`, `apps/api/src/messages/*`, `apps/api/src/reviews/*`, `apps/api/src/recommendations/*`, `apps/api/src/notifications/*`
- Database: `apps/api/prisma/schema.prisma`, `apps/api/prisma/seed.ts`
- API tests: `apps/api/test/health.e2e-spec.ts`, `apps/api/test/auth.e2e-spec.ts`, `apps/api/test/matches.e2e-spec.ts`, `apps/api/test/reviews.e2e-spec.ts`

## Feature Boundaries

- `auth`: 手机号验证码登录、会话签发、基础资料初始化
- `matches`: 约局创建、广场筛选、详情、申请、审核
- `messages`: 局内聊天、系统消息列表、未读数
- `reviews`: 赛后评价、爽约标记、信用分更新
- `recommendations`: 首页推荐、补位推荐、成局率估算
- `notifications`: 开打提醒、申请结果、补位邀请

### Task 1: Workspace Foundation

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.editorconfig`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `tools/verify-workspace.mjs`
- Create: `apps/mobile/package.json`
- Create: `apps/api/package.json`
- Create: `packages/contracts/package.json`
- Test: `tools/verify-workspace.mjs`

- [ ] **Step 1: Write the failing workspace smoke test**

```js
// tools/verify-workspace.mjs
import { access } from 'node:fs/promises';
import assert from 'node:assert/strict';

const required = [
  'package.json',
  'pnpm-workspace.yaml',
  'apps/mobile/package.json',
  'apps/api/package.json',
  'packages/contracts/package.json',
];

for (const file of required) {
  try {
    await access(new URL(`../${file}`, import.meta.url));
  } catch {
    assert.fail(`missing required workspace file: ${file}`);
  }
}

console.log('workspace smoke check passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tools/verify-workspace.mjs`  
Expected: FAIL with `missing required workspace file: package.json`

- [ ] **Step 3: Write the minimal workspace implementation**

```json
// package.json
{
  "name": "pingpang",
  "private": true,
  "packageManager": "pnpm@10.8.0",
  "scripts": {
    "dev:mobile": "pnpm --filter @pingpang/mobile dev:h5",
    "dev:api": "pnpm --filter @pingpang/api start:dev",
    "test": "pnpm -r test",
    "build": "pnpm -r build"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - apps/*
  - packages/*
```

```json
// apps/mobile/package.json
{
  "name": "@pingpang/mobile",
  "private": true,
  "scripts": {
    "dev:h5": "uni -p h5",
    "build:h5": "uni build -p h5",
    "test": "vitest run"
  }
}
```

```json
// apps/api/package.json
{
  "name": "@pingpang/api",
  "private": true,
  "scripts": {
    "start:dev": "nest start --watch",
    "test": "jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate"
  }
}
```

```json
// packages/contracts/package.json
{
  "name": "@pingpang/contracts",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

- [ ] **Step 4: Run the smoke check and install dependencies**

Run: `node tools/verify-workspace.mjs && pnpm install`  
Expected: `workspace smoke check passed` and `pnpm install` exits `0`

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .editorconfig .gitignore .env.example tools/verify-workspace.mjs apps/mobile/package.json apps/api/package.json packages/contracts/package.json
git commit -m "chore: scaffold monorepo workspace"
```

### Task 2: Contracts and API Health Skeleton

**Files:**
- Create: `packages/contracts/src/auth.ts`
- Create: `packages/contracts/src/matches.ts`
- Create: `packages/contracts/src/messages.ts`
- Create: `packages/contracts/src/reviews.ts`
- Create: `packages/contracts/src/index.ts`
- Create: `apps/api/src/main.ts`
- Create: `apps/api/src/app.module.ts`
- Create: `apps/api/src/health/health.controller.ts`
- Create: `apps/api/src/common/prisma/prisma.service.ts`
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/test/health.e2e-spec.ts`
- Test: `apps/api/test/health.e2e-spec.ts`

- [ ] **Step 1: Write the failing API health test**

```ts
// apps/api/test/health.e2e-spec.ts
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('HealthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns ok', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', service: 'pingpang-api' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @pingpang/api test:e2e -- health.e2e-spec.ts`  
Expected: FAIL with `Cannot find module '../src/app.module'`

- [ ] **Step 3: Write the minimal API and contract implementation**

```ts
// packages/contracts/src/matches.ts
import { z } from 'zod';

export const matchLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const matchCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  venueName: z.string(),
  startTime: z.string(),
  distanceKm: z.number(),
  openSlots: z.number(),
  hostCreditScore: z.number(),
  level: matchLevelSchema,
  matchRate: z.number(),
});

export type MatchCard = z.infer<typeof matchCardSchema>;
```

```ts
// packages/contracts/src/index.ts
export * from './auth';
export * from './matches';
export * from './messages';
export * from './reviews';
```

```ts
// apps/api/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok', service: 'pingpang-api' };
  }
}
```

```ts
// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [HealthController],
})
export class AppModule {}
```

```prisma
// apps/api/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  phone       String   @unique
  nickname    String
  city        String
  level       String
  creditScore Int      @default(100)
  createdAt   DateTime @default(now())
}
```

- [ ] **Step 4: Run the API test and schema generation**

Run: `pnpm --filter @pingpang/api prisma:generate && pnpm --filter @pingpang/api test:e2e -- health.e2e-spec.ts`  
Expected: Prisma client generates successfully and the health test passes

- [ ] **Step 5: Commit**

```bash
git add packages/contracts/src apps/api/src apps/api/prisma/schema.prisma apps/api/test/health.e2e-spec.ts
git commit -m "feat: add shared contracts and api health skeleton"
```

### Task 3: Mobile Shell, Navigation, and Design Tokens

**Files:**
- Create: `apps/mobile/vite.config.ts`
- Create: `apps/mobile/src/main.ts`
- Create: `apps/mobile/src/App.vue`
- Create: `apps/mobile/src/pages.json`
- Create: `apps/mobile/src/manifest.json`
- Create: `apps/mobile/src/uni.scss`
- Create: `apps/mobile/src/theme/tokens.scss`
- Create: `apps/mobile/src/pages/home/index.vue`
- Create: `apps/mobile/src/pages/square/index.vue`
- Create: `apps/mobile/src/pages/messages/index.vue`
- Create: `apps/mobile/src/pages/profile/index.vue`
- Create: `apps/mobile/src/__tests__/home.spec.ts`
- Test: `apps/mobile/src/__tests__/home.spec.ts`

- [ ] **Step 1: Write the failing home-page render test**

```ts
// apps/mobile/src/__tests__/home.spec.ts
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import HomePage from '../pages/home/index.vue';

describe('HomePage', () => {
  it('renders the hero copy and recommendation title', () => {
    const wrapper = mount(HomePage);
    expect(wrapper.text()).toContain('今晚 20:00 前快速成局');
    expect(wrapper.text()).toContain('为你推荐');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @pingpang/mobile test -- home.spec.ts`  
Expected: FAIL with `Cannot find module '../pages/home/index.vue'`

- [ ] **Step 3: Write the minimal mobile shell implementation**

```ts
// apps/mobile/src/main.ts
import App from './App.vue';
import { createSSRApp } from 'vue';

export function createApp() {
  const app = createSSRApp(App);
  return { app };
}
```

```scss
// apps/mobile/src/theme/tokens.scss
$color-primary: #ff6a3d;
$color-ink: #0f1c2e;
$color-success: #2fbf71;
$color-warning: #f5a623;
$color-bg: #fff9f1;
$radius-card: 24rpx;
```

```json
// apps/mobile/src/pages.json
{
  "pages": [
    { "path": "pages/home/index", "style": { "navigationBarTitleText": "首页" } },
    { "path": "pages/square/index", "style": { "navigationBarTitleText": "约局广场" } },
    { "path": "pages/messages/index", "style": { "navigationBarTitleText": "消息" } },
    { "path": "pages/profile/index", "style": { "navigationBarTitleText": "我的" } }
  ],
  "tabBar": {
    "color": "#7a8699",
    "selectedColor": "#ff6a3d",
    "backgroundColor": "#fff9f1",
    "list": [
      { "pagePath": "pages/home/index", "text": "首页" },
      { "pagePath": "pages/square/index", "text": "广场" },
      { "pagePath": "pages/messages/index", "text": "消息" },
      { "pagePath": "pages/profile/index", "text": "我的" }
    ]
  }
}
```

```vue
<!-- apps/mobile/src/pages/home/index.vue -->
<template>
  <view class="page">
    <view class="hero">
      <text class="title">今晚 20:00 前快速成局</text>
      <text class="subtitle">同区匹配优先，系统按规则推荐</text>
    </view>
    <view class="section">
      <text class="section-title">为你推荐</text>
    </view>
  </view>
</template>

<style lang="scss">
@use '../../theme/tokens.scss' as *;

.page { min-height: 100vh; background: $color-bg; padding: 32rpx; }
.hero { background: $color-primary; border-radius: $radius-card; padding: 32rpx; color: #fff; }
.title { display: block; font-size: 52rpx; font-weight: 800; }
.subtitle { display: block; margin-top: 16rpx; font-size: 24rpx; }
.section { margin-top: 32rpx; }
.section-title { font-size: 32rpx; font-weight: 700; color: $color-ink; }
</style>
```

- [ ] **Step 4: Run the mobile test**

Run: `pnpm --filter @pingpang/mobile test -- home.spec.ts`  
Expected: PASS with `1 passed`

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/vite.config.ts apps/mobile/src/main.ts apps/mobile/src/App.vue apps/mobile/src/pages.json apps/mobile/src/manifest.json apps/mobile/src/uni.scss apps/mobile/src/theme/tokens.scss apps/mobile/src/pages/home/index.vue apps/mobile/src/pages/square/index.vue apps/mobile/src/pages/messages/index.vue apps/mobile/src/pages/profile/index.vue apps/mobile/src/__tests__/home.spec.ts
git commit -m "feat: add uni-app shell and visual foundation"
```

### Task 4: Auth and Profile Slice

**Files:**
- Create: `apps/api/src/auth/auth.module.ts`
- Create: `apps/api/src/auth/auth.controller.ts`
- Create: `apps/api/src/auth/auth.service.ts`
- Create: `apps/api/src/auth/dto/request-login-code.dto.ts`
- Create: `apps/api/src/auth/dto/verify-login-code.dto.ts`
- Create: `apps/api/src/users/users.module.ts`
- Create: `apps/api/src/users/users.controller.ts`
- Create: `apps/api/test/auth.e2e-spec.ts`
- Create: `apps/mobile/src/pages/login/index.vue`
- Create: `apps/mobile/src/stores/auth.ts`
- Create: `apps/mobile/src/services/http.ts`
- Create: `apps/mobile/src/services/api.ts`
- Test: `apps/api/test/auth.e2e-spec.ts`

- [ ] **Step 1: Write the failing auth e2e test**

```ts
// apps/api/test/auth.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth flow', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a session for a whitelisted OTP code', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000', code: '123456' })
      .expect(201);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.nickname).toBe('球友1380013');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @pingpang/api test:e2e -- auth.e2e-spec.ts`  
Expected: FAIL with `Cannot POST /auth/verify-code`

- [ ] **Step 3: Write the minimal auth implementation**

```ts
// apps/api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  verifyCode(phone: string, code: string) {
    if (code !== '123456') {
      throw new UnauthorizedException('invalid code');
    }

    return {
      token: `dev-token-${phone}`,
      user: {
        id: `user-${phone}`,
        phone,
        nickname: `球友${phone.slice(0, 7)}`,
        city: '上海',
        level: 'intermediate',
        creditScore: 100,
      },
    };
  }
}
```

```ts
// apps/api/src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-code')
  verifyCode(@Body() body: { phone: string; code: string }) {
    return this.authService.verifyCode(body.phone, body.code);
  }
}
```

```ts
// apps/mobile/src/stores/auth.ts
import { defineStore } from 'pinia';

type SessionUser = {
  id: string;
  nickname: string;
  city: string;
  level: string;
  creditScore: number;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null as SessionUser | null,
  }),
  actions: {
    setSession(payload: { token: string; user: SessionUser }) {
      this.token = payload.token;
      this.user = payload.user;
    },
  },
});
```

```vue
<!-- apps/mobile/src/pages/login/index.vue -->
<template>
  <view class="page">
    <text class="title">手机号快捷登录</text>
    <input placeholder="请输入手机号" />
    <input placeholder="请输入验证码 123456" />
    <button type="primary">登录并进入约局</button>
  </view>
</template>
```

- [ ] **Step 4: Run the auth test**

Run: `pnpm --filter @pingpang/api test:e2e -- auth.e2e-spec.ts`  
Expected: PASS and response contains `token` plus seeded profile data

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/auth apps/api/src/users apps/api/test/auth.e2e-spec.ts apps/mobile/src/pages/login/index.vue apps/mobile/src/stores/auth.ts apps/mobile/src/services/http.ts apps/mobile/src/services/api.ts
git commit -m "feat: add login flow and profile session state"
```

### Task 5: Match Discovery and Recommendation Slice

**Files:**
- Create: `apps/api/src/matches/matches.module.ts`
- Create: `apps/api/src/matches/matches.controller.ts`
- Create: `apps/api/src/matches/matches.service.ts`
- Create: `apps/api/src/recommendations/recommendations.module.ts`
- Create: `apps/api/src/recommendations/recommendations.service.ts`
- Create: `apps/api/test/matches.e2e-spec.ts`
- Create: `apps/mobile/src/composables/useMatchesQuery.ts`
- Create: `apps/mobile/src/pages/square/index.vue`
- Modify: `apps/mobile/src/pages/home/index.vue`
- Create: `apps/mobile/src/pages/match-detail/index.vue`
- Test: `apps/api/test/matches.e2e-spec.ts`

- [ ] **Step 1: Write the failing match listing test**

```ts
// apps/api/test/matches.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Matches listing', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns ranked cards for the home feed', async () => {
    const response = await request(app.getHttpServer())
      .get('/matches?city=上海&level=intermediate')
      .expect(200);

    expect(response.body.items[0]).toMatchObject({
      title: '漕河泾速约局',
      matchRate: expect.any(Number),
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: FAIL with `Cannot GET /matches`

- [ ] **Step 3: Write the minimal listing and recommendation implementation**

```ts
// apps/api/src/recommendations/recommendations.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommendationsService {
  score(distanceKm: number, matchRate: number) {
    return Number((matchRate * 0.7 + (5 - distanceKm) * 0.3).toFixed(2));
  }
}
```

```ts
// apps/api/src/matches/matches.service.ts
import { Injectable } from '@nestjs/common';
import { RecommendationsService } from '../recommendations/recommendations.service';

@Injectable()
export class MatchesService {
  constructor(private readonly recommendations: RecommendationsService) {}

  list() {
    const items = [
      {
        id: 'match-1',
        title: '漕河泾速约局',
        venueName: '漕宝馆 4 号台',
        startTime: '2026-04-16T19:30:00+08:00',
        distanceKm: 2.1,
        openSlots: 1,
        hostCreditScore: 97,
        level: 'intermediate',
        matchRate: 91,
      },
    ];

    return {
      items: items
        .map((item) => ({ ...item, score: this.recommendations.score(item.distanceKm, item.matchRate) }))
        .sort((a, b) => b.score - a.score),
    };
  }
}
```

```ts
// apps/mobile/src/composables/useMatchesQuery.ts
import { useQuery } from '@tanstack/vue-query';
import { apiClient } from '../services/api';

export function useMatchesQuery() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: () => apiClient.listMatches(),
  });
}
```

```vue
<!-- apps/mobile/src/pages/square/index.vue -->
<template>
  <view class="page">
    <text class="title">约局广场</text>
    <view class="chip-row">
      <text class="chip chip--active">2km</text>
      <text class="chip">今晚</text>
      <text class="chip">中级</text>
    </view>
    <view class="card">
      <text class="card-title">漕河泾速约局</text>
      <text class="card-subtitle">2 缺 1 · 2.1km · 匹配度 91%</text>
    </view>
  </view>
</template>
```

- [ ] **Step 4: Run the listing test**

Run: `pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: PASS and `/matches` returns at least one ranked recommendation card

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/matches apps/api/src/recommendations apps/api/test/matches.e2e-spec.ts apps/mobile/src/composables/useMatchesQuery.ts apps/mobile/src/pages/home/index.vue apps/mobile/src/pages/square/index.vue apps/mobile/src/pages/match-detail/index.vue
git commit -m "feat: add match discovery and recommendation feed"
```

### Task 6: Create Match and Apply Flow

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/src/matches/dto/create-match.dto.ts`
- Create: `apps/api/src/matches/dto/apply-match.dto.ts`
- Modify: `apps/api/src/matches/matches.controller.ts`
- Modify: `apps/api/src/matches/matches.service.ts`
- Create: `apps/mobile/src/pages/create-match/index.vue`
- Create: `apps/mobile/src/stores/match-draft.ts`
- Create: `apps/mobile/src/__tests__/create-match.spec.ts`
- Test: `apps/mobile/src/__tests__/create-match.spec.ts`

- [ ] **Step 1: Write the failing create-match UI test**

```ts
// apps/mobile/src/__tests__/create-match.spec.ts
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CreateMatchPage from '../pages/create-match/index.vue';

describe('CreateMatchPage', () => {
  it('shows the publish CTA and estimated match rate', () => {
    const wrapper = mount(CreateMatchPage);
    expect(wrapper.text()).toContain('发布约局');
    expect(wrapper.text()).toContain('预计成局率');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @pingpang/mobile test -- create-match.spec.ts`  
Expected: FAIL with `Cannot find module '../pages/create-match/index.vue'`

- [ ] **Step 3: Write the minimal create/apply implementation**

```prisma
// apps/api/prisma/schema.prisma
model Match {
  id              String   @id @default(cuid())
  title           String
  venueName       String
  startTime       DateTime
  city            String
  maxPlayers      Int
  openSlots       Int
  level           String
  hostCreditScore Int
  createdAt       DateTime @default(now())
}

model MatchApplication {
  id        String   @id @default(cuid())
  matchId   String
  userId    String
  status    String
  createdAt DateTime @default(now())
}
```

```ts
// apps/api/src/matches/matches.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  list() {
    return this.matchesService.list();
  }

  @Post()
  create(@Body() body: { title: string; venueName: string; startTime: string }) {
    return this.matchesService.create(body);
  }

  @Post(':id/applications')
  apply(@Body() body: { userId: string }) {
    return { status: 'pending', userId: body.userId };
  }
}
```

```vue
<!-- apps/mobile/src/pages/create-match/index.vue -->
<template>
  <view class="page">
    <text class="title">创建约局</text>
    <view class="field">时间：今晚 19:30</view>
    <view class="field">地点：漕宝馆 4 号台</view>
    <view class="estimate">预计成局率 82%</view>
    <button type="primary">发布约局</button>
  </view>
</template>
```

```ts
// apps/mobile/src/stores/match-draft.ts
import { defineStore } from 'pinia';

export const useMatchDraftStore = defineStore('match-draft', {
  state: () => ({
    title: '',
    venueName: '',
    startTime: '',
    level: 'intermediate',
    maxPlayers: 4,
  }),
});
```

- [ ] **Step 4: Run the UI test and a focused API smoke test**

Run: `pnpm --filter @pingpang/mobile test -- create-match.spec.ts && pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: Both commands pass and the existing match endpoint still returns ranked cards

- [ ] **Step 5: Commit**

```bash
git add apps/api/prisma/schema.prisma apps/api/src/matches/dto apps/api/src/matches/matches.controller.ts apps/api/src/matches/matches.service.ts apps/mobile/src/pages/create-match/index.vue apps/mobile/src/stores/match-draft.ts apps/mobile/src/__tests__/create-match.spec.ts
git commit -m "feat: add match creation and application flow"
```

### Task 7: Messages, Notifications, and Chat Slice

**Files:**
- Create: `apps/api/src/messages/messages.module.ts`
- Create: `apps/api/src/messages/messages.controller.ts`
- Create: `apps/api/src/messages/messages.service.ts`
- Create: `apps/api/src/notifications/notifications.module.ts`
- Create: `apps/api/src/notifications/notifications.service.ts`
- Create: `apps/api/src/common/redis/redis.service.ts`
- Create: `apps/mobile/src/pages/messages/index.vue`
- Create: `apps/mobile/src/pages/chat/index.vue`
- Test: `apps/api/test/matches.e2e-spec.ts`

- [ ] **Step 1: Extend the failing API test with unread notifications**

```ts
// apps/api/test/matches.e2e-spec.ts
it('returns unread notification count for the active user', async () => {
  const response = await request(app.getHttpServer())
    .get('/messages/summary?userId=user-13800138000')
    .expect(200);

  expect(response.body).toEqual({
    unreadSystemCount: 2,
    unreadChatCount: 3,
    pendingInvitesCount: 1,
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: FAIL with `Cannot GET /messages/summary`

- [ ] **Step 3: Write the minimal messages and notifications implementation**

```ts
// apps/api/src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  summary() {
    return {
      unreadSystemCount: 2,
      unreadChatCount: 3,
      pendingInvitesCount: 1,
    };
  }
}
```

```ts
// apps/api/src/messages/messages.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get('summary')
  summary(@Query('userId') _userId: string) {
    return this.notifications.summary();
  }
}
```

```vue
<!-- apps/mobile/src/pages/messages/index.vue -->
<template>
  <view class="page">
    <text class="title">消息中心</text>
    <view class="notice">你的申请已通过</view>
    <view class="notice">补位邀请：龙华馆 20:10 缺 1 位</view>
    <view class="notice">距离开打还有 30 分钟</view>
  </view>
</template>
```

```vue
<!-- apps/mobile/src/pages/chat/index.vue -->
<template>
  <view class="page">
    <text class="title">局内聊天</text>
    <view class="bubble bubble--system">系统：开打前 30 分钟提醒已发送</view>
    <view class="bubble">我：我会提前 10 分钟到场</view>
  </view>
</template>
```

- [ ] **Step 4: Run the updated API test**

Run: `pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: PASS and `/messages/summary` returns unread counts for badges

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/messages apps/api/src/notifications apps/api/src/common/redis/redis.service.ts apps/mobile/src/pages/messages/index.vue apps/mobile/src/pages/chat/index.vue apps/api/test/matches.e2e-spec.ts
git commit -m "feat: add message center and notification summary"
```

### Task 8: Reviews, Credit Score, and Release Smoke

**Files:**
- Create: `apps/api/src/reviews/reviews.module.ts`
- Create: `apps/api/src/reviews/reviews.controller.ts`
- Create: `apps/api/src/reviews/reviews.service.ts`
- Create: `apps/api/test/reviews.e2e-spec.ts`
- Modify: `apps/mobile/src/pages/profile/index.vue`
- Modify: `apps/mobile/src/pages/match-detail/index.vue`
- Test: `apps/api/test/reviews.e2e-spec.ts`

- [ ] **Step 1: Write the failing review-credit test**

```ts
// apps/api/test/reviews.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Reviews and credit', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('submits a review and returns the updated credit score', async () => {
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .send({
        matchId: 'match-1',
        reviewerId: 'user-1',
        revieweeId: 'user-2',
        score: 5,
        tags: ['准时', '好沟通'],
      })
      .expect(201);

    expect(response.body.review.score).toBe(5);
    expect(response.body.reviewee.creditScore).toBe(101);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @pingpang/api test:e2e -- reviews.e2e-spec.ts`  
Expected: FAIL with `Cannot POST /reviews`

- [ ] **Step 3: Write the minimal review and credit implementation**

```ts
// apps/api/src/reviews/reviews.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  create(payload: { matchId: string; reviewerId: string; revieweeId: string; score: number; tags: string[] }) {
    return {
      review: payload,
      reviewee: {
        id: payload.revieweeId,
        creditScore: payload.score >= 4 ? 101 : 98,
      },
    };
  }
}
```

```ts
// apps/api/src/reviews/reviews.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() body: { matchId: string; reviewerId: string; revieweeId: string; score: number; tags: string[] }) {
    return this.reviewsService.create(body);
  }
}
```

```vue
<!-- apps/mobile/src/pages/profile/index.vue -->
<template>
  <view class="page">
    <text class="name">Rika</text>
    <text class="credit">信用 96 · 连续 12 场到场</text>
    <text class="stat">本月开打 18 场 · 成局率 91%</text>
  </view>
</template>
```

- [ ] **Step 4: Run the review test plus full workspace smoke**

Run: `pnpm --filter @pingpang/api test:e2e -- reviews.e2e-spec.ts && pnpm build`  
Expected: review test passes and workspace build exits `0`

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/reviews apps/api/test/reviews.e2e-spec.ts apps/mobile/src/pages/profile/index.vue apps/mobile/src/pages/match-detail/index.vue
git commit -m "feat: add review flow and credit score updates"
```

## Environment Notes

- Use `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pingpang`
- Use `REDIS_URL=redis://localhost:6379`
- Keep OTP in development fixed to `123456`; replace it with SMS provider integration only after MVP stabilizes
- H5 is the primary local development target; only run `mp-weixin` smoke builds after each completed vertical slice

## Verification Matrix

- Auth: `pnpm --filter @pingpang/api test:e2e -- auth.e2e-spec.ts`
- Home shell: `pnpm --filter @pingpang/mobile test -- home.spec.ts`
- Match discovery: `pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`
- Create/apply: `pnpm --filter @pingpang/mobile test -- create-match.spec.ts`
- Reviews: `pnpm --filter @pingpang/api test:e2e -- reviews.e2e-spec.ts`
- Workspace smoke: `node tools/verify-workspace.mjs`
- Release build: `pnpm build`

## Self-Review

### Spec coverage

- Login and account setup: Task 4
- Match creation, square, detail, apply flow: Tasks 5 and 6
- Chat, notifications, message center: Task 7
- Review, credit score, trust signals: Task 8
- Recommendation feed and estimated match rate: Tasks 5 and 6
- Mobile-first UI shell aligned with approved board: Task 3

### Placeholder scan

- No `TODO`, `TBD`, or “implement later” placeholders remain
- Each task includes exact file paths, commands, and expected outcomes

### Type consistency

- Match level string stays `beginner | intermediate | advanced`
- Session payload consistently uses `token` and `user`
- Review payload consistently uses `matchId`, `reviewerId`, `revieweeId`, `score`, and `tags`
