# Real Data Full Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将移动端页面上的展示数据和发起约球候选项全部接入数据库，建立 Venue / VenueCourt / VenueAvailabilitySlot / OptionPreset 完整模型，并让发局、首页、广场、我的、聊天使用统一真实数据链路。

**Architecture:** 在现有 `Match + ChatThread + Message + Review` 基础上新增场馆与候选项模型，后端增加 `/match-options` 聚合接口，并把 `POST /matches` 从写死派生值改成基于 `User + Venue + Recommendation` 的真实生成。前端只保留展示逻辑，`create-match` 页面通过新接口拉取候选项，并将 `venueId` 而不是 `venueName` 作为创建输入。

**Tech Stack:** NestJS, Prisma, PostgreSQL, Jest e2e, Vue 3, uni-app, Pinia, TanStack Vue Query, Vitest

---

## File Structure

### Backend

- Create: `apps/api/prisma/migrations/20260422_real_data_full_model/migration.sql`
- Modify: `apps/api/prisma/schema.prisma`
- Modify: `apps/api/prisma/seed.ts`
- Modify: `apps/api/src/matches/dto/create-match.dto.ts`
- Create: `apps/api/src/matches/match-options.service.ts`
- Modify: `apps/api/src/matches/matches.controller.ts`
- Modify: `apps/api/src/matches/matches.module.ts`
- Modify: `apps/api/src/matches/matches.service.ts`
- Test: `apps/api/test/matches.e2e-spec.ts`

### Frontend

- Create: `apps/mobile/src/composables/useMatchOptionsQuery.ts`
- Modify: `apps/mobile/src/services/types.ts`
- Modify: `apps/mobile/src/services/api.ts`
- Modify: `apps/mobile/src/pages/create-match/index.vue`
- Modify: `apps/mobile/src/stores/match-draft.ts`
- Test: `apps/mobile/src/__tests__/create-match.spec.ts`
- Test: `apps/mobile/src/__tests__/home.spec.ts`
- Test: `apps/mobile/src/__tests__/profile-page.spec.ts`

---

### Task 1: 建立数据库完整模型并暴露 `/match-options`

**Files:**
- Create: `apps/api/prisma/migrations/20260422_real_data_full_model/migration.sql`
- Modify: `apps/api/prisma/schema.prisma`
- Modify: `apps/api/prisma/seed.ts`
- Create: `apps/api/src/matches/match-options.service.ts`
- Modify: `apps/api/src/matches/matches.controller.ts`
- Modify: `apps/api/src/matches/matches.module.ts`
- Test: `apps/api/test/matches.e2e-spec.ts`

- [ ] **Step 1: 写出 `/match-options` 的失败 e2e 测试**

```ts
it('returns database-backed match options for create-match page', async () => {
  const response = await request(app.getHttpServer()).get('/match-options').expect(200);

  expect(response.body).toEqual({
    venues: expect.arrayContaining([
      expect.objectContaining({
        id: 'venue-xujiahui',
        name: '徐家汇活力馆',
        city: '上海',
      }),
    ]),
    timeSlots: expect.arrayContaining([
      expect.objectContaining({
        id: 'slot-xujiahui-1930',
        venueId: 'venue-xujiahui',
        label: '今晚 19:30',
      }),
    ]),
    levels: expect.arrayContaining([
      expect.objectContaining({ value: 'intermediate', label: '中级' }),
    ]),
    playerCounts: expect.arrayContaining([
      expect.objectContaining({ value: '4', label: '4 人局' }),
    ]),
  });
});
```

- [ ] **Step 2: 运行测试，确认它先失败**

Run:
```bash
corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json matches.e2e-spec.ts
```

Expected: `GET /match-options` 返回 `404`，或者响应体中没有 `venues/timeSlots/levels/playerCounts`。

- [ ] **Step 3: 扩展 Prisma schema，加入场馆与候选项模型**

```prisma
model Venue {
  id                String                 @id
  name              String
  city              String
  address           String
  status            String                 @default("active")
  displayDistanceKm Float
  createdAt         DateTime               @default(now())
  updatedAt         DateTime               @updatedAt
  courts            VenueCourt[]
  slots             VenueAvailabilitySlot[]
  matches           Match[]
}

model VenueCourt {
  id        String   @id
  venueId   String
  name      String
  status    String   @default("active")
  sortOrder Int
  venue     Venue    @relation(fields: [venueId], references: [id], onDelete: Cascade)
}

model VenueAvailabilitySlot {
  id        String   @id
  venueId   String
  label     String
  startTime DateTime
  endTime   DateTime
  status    String   @default("active")
  sortOrder Int
  venue     Venue    @relation(fields: [venueId], references: [id], onDelete: Cascade)
}

model OptionPreset {
  id        String   @id
  kind      String
  label     String
  value     String
  sortOrder Int
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Match {
  id              String   @id
  title           String
  venueId         String
  venueName       String
  startTime       DateTime
  city            String
  level           String
  maxPlayers      Int
  openSlots       Int
  hostUserId      String
  hostCreditScore Int
  distanceKm      Float
  matchRate       Int
  createdAt       DateTime @default(now())
  venue           Venue    @relation(fields: [venueId], references: [id], onDelete: Restrict)
  hostUser        User     @relation("HostedMatches", fields: [hostUserId], references: [id], onDelete: Cascade)
  applications    MatchApplication[]
  thread          ChatThread?
}
```

- [ ] **Step 4: 生成 migration 并补真实 seed 数据**

```sql
CREATE TABLE "Venue" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "displayDistanceKm" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

ALTER TABLE "Match" ADD COLUMN "venueId" TEXT;
ALTER TABLE "Match" ADD CONSTRAINT "Match_venueId_fkey"
  FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

```ts
for (const venue of [
  {
    id: 'venue-xujiahui',
    name: '徐家汇活力馆',
    city: '上海',
    address: '徐汇区漕溪北路 188 号',
    status: 'active',
    displayDistanceKm: 1.8,
  },
  {
    id: 'venue-jingan',
    name: '静安白领馆',
    city: '上海',
    address: '静安区南京西路 818 号',
    status: 'active',
    displayDistanceKm: 3.2,
  },
]) {
  await prisma.venue.upsert({ where: { id: venue.id }, update: venue, create: venue });
}

for (const option of [
  { id: 'level-beginner', kind: 'level', label: '新手', value: 'beginner', sortOrder: 1, status: 'active' },
  { id: 'level-intermediate', kind: 'level', label: '中级', value: 'intermediate', sortOrder: 2, status: 'active' },
  { id: 'player-4', kind: 'player_count', label: '4 人局', value: '4', sortOrder: 2, status: 'active' },
]) {
  await prisma.optionPreset.upsert({ where: { id: option.id }, update: option, create: option });
}
```

Run:
```bash
corepack pnpm --filter @pingpang/api db:migrate --name real_data_full_model
corepack pnpm --filter @pingpang/api db:seed
```

Expected: migration 成功，seed 不报错。

- [ ] **Step 5: 实现 `/match-options` 接口最小版本**

```ts
@Injectable()
export class MatchOptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCreateOptions() {
    const [venues, timeSlots, presets] = await Promise.all([
      this.prisma.venue.findMany({
        where: { status: 'active' },
        orderBy: [{ city: 'asc' }, { name: 'asc' }],
      }),
      this.prisma.venueAvailabilitySlot.findMany({
        where: { status: 'active', venue: { status: 'active' } },
        orderBy: [{ venueId: 'asc' }, { sortOrder: 'asc' }],
      }),
      this.prisma.optionPreset.findMany({
        where: { status: 'active' },
        orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }],
      }),
    ]);

    return {
      venues: venues.map((item) => ({
        id: item.id,
        name: item.name,
        city: item.city,
        address: item.address,
        displayDistanceKm: item.displayDistanceKm,
      })),
      timeSlots: timeSlots.map((item) => ({
        id: item.id,
        venueId: item.venueId,
        label: item.label,
        startTime: item.startTime.toISOString(),
        endTime: item.endTime.toISOString(),
      })),
      levels: presets
        .filter((item) => item.kind === 'level')
        .map((item) => ({ id: item.id, label: item.label, value: item.value })),
      playerCounts: presets
        .filter((item) => item.kind === 'player_count')
        .map((item) => ({ id: item.id, label: item.label, value: item.value })),
    };
  }
}
```

```ts
@Controller()
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly matchOptionsService: MatchOptionsService,
  ) {}

  @Get('match-options')
  listCreateOptions() {
    return this.matchOptionsService.getCreateOptions();
  }
}
```

- [ ] **Step 6: 重新运行 e2e，确认转绿**

Run:
```bash
corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json matches.e2e-spec.ts
```

Expected: 新增的 `/match-options` 用例通过，原有 matches 用例不回退。

- [ ] **Step 7: Commit**

```bash
git add apps/api/prisma/schema.prisma apps/api/prisma/seed.ts apps/api/prisma/migrations/20260422_real_data_full_model/migration.sql apps/api/src/matches/match-options.service.ts apps/api/src/matches/matches.controller.ts apps/api/src/matches/matches.module.ts apps/api/test/matches.e2e-spec.ts
git commit -m "feat: add database-backed match option models"
```

---

### Task 2: 让 `POST /matches` 基于真实用户、场馆和规则创建球局

**Files:**
- Modify: `apps/api/src/matches/dto/create-match.dto.ts`
- Modify: `apps/api/src/matches/matches.service.ts`
- Modify: `apps/api/prisma/seed.ts`
- Test: `apps/api/test/matches.e2e-spec.ts`

- [ ] **Step 1: 写出创建球局真实派生字段的失败测试**

```ts
it('creates a match from venue-backed data instead of hard-coded values', async () => {
  const token = await login();

  const response = await request(app.getHttpServer())
    .post('/matches')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: '静安白领馆 今晚 20:00 约球',
      venueId: 'venue-jingan',
      startTime: '2026-04-22T20:00:00+08:00',
      city: '上海',
      level: 'intermediate',
      maxPlayers: 4,
    })
    .expect(201);

  expect(response.body).toMatchObject({
    venueName: '静安白领馆',
    hostCreditScore: 100,
    distanceKm: 3.2,
  });

  const thread = await prisma.chatThread.findUnique({ where: { id: response.body.id } });
  expect(thread?.latestMessagePreview).toBe('球局已创建，快来沟通上场安排');
  expect(thread?.lastMessageSenderName).toBe('系统');
});
```

- [ ] **Step 2: 运行测试，确认当前实现先失败**

Run:
```bash
corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json matches.e2e-spec.ts
```

Expected: 失败原因包括 `venueId` 未被接受、`hostCreditScore` 仍是写死值、线程摘要仍是英文占位文案。

- [ ] **Step 3: 收紧 DTO 和服务实现**

```ts
export class CreateMatchDto {
  @IsString()
  title!: string;

  @IsString()
  venueId!: string;

  @IsISO8601()
  startTime!: string;

  @IsString()
  city!: string;

  @IsString()
  level!: string;

  @IsInt()
  @Min(2)
  @Max(8)
  maxPlayers!: number;
}
```

```ts
async create(payload: CreateMatchDto, hostUserId: string) {
  const [hostUser, venue] = await Promise.all([
    this.prisma.user.findUniqueOrThrow({ where: { id: hostUserId } }),
    this.prisma.venue.findFirstOrThrow({ where: { id: payload.venueId, status: 'active' } }),
  ]);

  const matchId = `match-${Date.now()}`;
  const matchRate = Math.round(this.recommendations.score(venue.displayDistanceKm, 85));

  const createdMatch = await this.prisma.$transaction(async (tx) => {
    const match = await tx.match.create({
      data: {
        id: matchId,
        title: payload.title,
        venueId: venue.id,
        venueName: venue.name,
        startTime: new Date(payload.startTime),
        city: payload.city,
        level: payload.level,
        maxPlayers: payload.maxPlayers,
        openSlots: Math.max(payload.maxPlayers - 1, 0),
        hostUserId,
        hostCreditScore: hostUser.creditScore,
        distanceKm: venue.displayDistanceKm,
        matchRate,
      },
    });

    await tx.chatThread.create({
      data: {
        id: match.id,
        matchId: match.id,
        title: match.title,
        venueName: match.venueName,
        scheduledAt: match.startTime,
        hostUserId,
        status: 'active',
        latestMessagePreview: '球局已创建，快来沟通上场安排',
        latestMessageAt: new Date(),
        lastMessageSenderId: null,
        lastMessageSenderName: '系统',
      },
    });

    await tx.chatThreadParticipant.create({
      data: {
        threadId: match.id,
        userId: hostUserId,
        role: 'host',
        lastReadAt: new Date(),
      },
    });

    return match;
  });

  return this.mapMatch(createdMatch);
}
```

- [ ] **Step 4: 调整 seed 与旧测试数据，让 Match 记录补齐 `venueId`**

```ts
await prisma.match.upsert({
  where: { id: 'match-seed-1' },
  update: {
    venueId: 'venue-xujiahui',
    venueName: '徐家汇活力馆',
  },
  create: {
    id: 'match-seed-1',
    venueId: 'venue-xujiahui',
    venueName: '徐家汇活力馆',
    title: '徐汇晚间上分局',
    startTime: new Date('2026-04-17T19:30:00+08:00'),
    city: '上海',
    level: 'intermediate',
    maxPlayers: 4,
    openSlots: 2,
    hostUserId: 'user-reviewee-1',
    hostCreditScore: 97,
    distanceKm: 1.8,
    matchRate: 93,
  },
});
```

- [ ] **Step 5: 重新运行 API e2e，确认创建链路转绿**

Run:
```bash
corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json matches.e2e-spec.ts messages.e2e-spec.ts
```

Expected: 新建球局用例通过，消息线程摘要相关回归不失败。

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/matches/dto/create-match.dto.ts apps/api/src/matches/matches.service.ts apps/api/prisma/seed.ts apps/api/test/matches.e2e-spec.ts
git commit -m "feat: create matches from real venue and user data"
```

---

### Task 3: 让发起约球页面通过真实接口加载候选项并创建球局

**Files:**
- Create: `apps/mobile/src/composables/useMatchOptionsQuery.ts`
- Modify: `apps/mobile/src/services/types.ts`
- Modify: `apps/mobile/src/services/api.ts`
- Modify: `apps/mobile/src/pages/create-match/index.vue`
- Modify: `apps/mobile/src/stores/match-draft.ts`
- Test: `apps/mobile/src/__tests__/create-match.spec.ts`

- [ ] **Step 1: 写出前端失败测试，要求页面从接口渲染候选项**

```ts
it('loads create-match options from the API instead of local constants', async () => {
  vi.stubGlobal('uni', {
    request: vi.fn(({ url, success }) => {
      if (url === 'http://localhost:3000/match-options') {
        success({
          statusCode: 200,
          data: {
            venues: [{ id: 'venue-jingan', name: '静安白领馆', city: '上海', address: '静安区南京西路 818 号', displayDistanceKm: 3.2 }],
            timeSlots: [{ id: 'slot-jingan-2000', venueId: 'venue-jingan', label: '今晚 20:00', startTime: '2026-04-22T20:00:00+08:00', endTime: '2026-04-22T22:00:00+08:00' }],
            levels: [{ id: 'level-intermediate', value: 'intermediate', label: '中级' }],
            playerCounts: [{ id: 'player-4', value: '4', label: '4 人局' }],
          },
        });
      }
    }),
    navigateTo: vi.fn(),
    setStorageSync: vi.fn(),
    getStorageSync: vi.fn(() => ''),
    removeStorageSync: vi.fn(),
  });

  const wrapper = mount(CreateMatchPage);
  await flushPromises();

  expect(wrapper.text()).toContain('静安白领馆');
  expect(wrapper.text()).not.toContain('徐家汇活力馆 3 号台');
});
```

- [ ] **Step 2: 运行测试，确认它先失败**

Run:
```bash
corepack pnpm --filter @pingpang/mobile test -- run create-match.spec.ts
```

Expected: 当前页面仍显示本地常量，且没有请求 `/match-options`。

- [ ] **Step 3: 扩展类型与 API 层**

```ts
export type MatchOptionVenue = {
  id: string;
  name: string;
  city: string;
  address: string;
  displayDistanceKm: number;
};

export type MatchOptionTimeSlot = {
  id: string;
  venueId: string;
  label: string;
  startTime: string;
  endTime: string;
};

export type MatchOptionsResponse = {
  venues: MatchOptionVenue[];
  timeSlots: MatchOptionTimeSlot[];
  levels: Array<{ id: string; value: string; label: string }>;
  playerCounts: Array<{ id: string; value: string; label: string }>;
};

export type CreateMatchPayload = {
  title: string;
  venueId: string;
  startTime: string;
  city: string;
  level: string;
  maxPlayers: number;
};
```

```ts
export function fetchMatchOptions() {
  return http<MatchOptionsResponse>('/match-options');
}

export const apiClient = {
  ...,
  fetchMatchOptions,
};
```

- [ ] **Step 4: 实现 `useMatchOptionsQuery` 和页面异步加载逻辑**

```ts
export function useMatchOptionsQuery() {
  return useQuery({
    queryKey: ['match-options'],
    queryFn: fetchMatchOptions,
    staleTime: 60_000,
  });
}
```

```ts
const optionsQuery = useMatchOptionsQuery();
const venues = computed(() => optionsQuery.data.value?.venues ?? []);
const timeSlots = computed(() => {
  const currentVenueId = selectedVenueId.value;
  return (optionsQuery.data.value?.timeSlots ?? []).filter((item) => item.venueId === currentVenueId);
});

watchEffect(() => {
  if (!selectedVenueId.value && venues.value.length) {
    selectedVenueId.value = venues.value[0].id;
  }
  if (!selectedTimeId.value && timeSlots.value.length) {
    selectedTimeId.value = timeSlots.value[0].id;
  }
});
```

```ts
await createMatch({
  title: generatedTitle.value,
  venueId: selectedVenue.value.id,
  startTime: selectedTime.value.startTime,
  city: selectedVenue.value.city,
  level: selectedLevel.value.value,
  maxPlayers: Number(selectedPlayers.value.value),
});
```

- [ ] **Step 5: 保留错误态和加载态，避免页面空白**

```vue
<view v-if="optionsQuery.isLoading.value" class="panel">
  <text class="panel-title">正在加载可约球馆</text>
  <text class="panel-copy">稍等一下，正在从数据库同步场馆和时段。</text>
</view>

<view v-else-if="optionsQuery.isError.value" class="panel">
  <text class="panel-title">候选项加载失败</text>
  <text class="panel-copy">请稍后重试，或检查接口服务是否已启动。</text>
</view>
```

- [ ] **Step 6: 重新运行前端测试，确认页面转绿**

Run:
```bash
corepack pnpm --filter @pingpang/mobile test -- run create-match.spec.ts
```

Expected: create-match 用例通过，且请求体改为 `venueId` 驱动。

- [ ] **Step 7: Commit**

```bash
git add apps/mobile/src/composables/useMatchOptionsQuery.ts apps/mobile/src/services/types.ts apps/mobile/src/services/api.ts apps/mobile/src/pages/create-match/index.vue apps/mobile/src/stores/match-draft.ts apps/mobile/src/__tests__/create-match.spec.ts
git commit -m "feat: load create-match options from database"
```

---

### Task 4: 做页面回归，确认首页、我的和构建链全部使用真实数据

**Files:**
- Modify: `apps/mobile/src/__tests__/home.spec.ts`
- Modify: `apps/mobile/src/__tests__/profile-page.spec.ts`
- Modify: `apps/api/test/matches.e2e-spec.ts`

- [ ] **Step 1: 写出首页和我的回归测试，确认显示真实场馆快照字段**

```ts
it('renders the featured match returned by the backend feed', async () => {
  vi.stubGlobal('uni', {
    request: vi.fn(({ url, success }) => {
      if (url.includes('/matches?city=')) {
        success({
          statusCode: 200,
          data: {
            items: [
              {
                id: 'match-seed-1',
                title: '徐汇晚间上分局',
                venueName: '徐家汇活力馆',
                distanceKm: 1.8,
                openSlots: 2,
                maxPlayers: 4,
                hostCreditScore: 97,
                matchRate: 93,
                city: '上海',
                level: 'intermediate',
                score: 66,
                startTime: '2026-04-17T19:30:00+08:00',
              },
            ],
          },
        });
      }
    }),
    switchTab: vi.fn(),
    navigateTo: vi.fn(),
  });

  const wrapper = mount(HomePage);
  await flushPromises();

  expect(wrapper.text()).toContain('徐汇晚间上分局');
  expect(wrapper.text()).toContain('徐家汇活力馆');
});
```

```ts
it('shows hosted matches created by the authenticated user', async () => {
  vi.stubGlobal('uni', {
    request: vi.fn(({ url, success }) => {
      if (url === 'http://localhost:3000/matches/mine') {
        success({
          statusCode: 200,
          data: {
            items: [
              {
                id: 'match-hosted-1',
                title: '我发起的静安晚场',
                venueName: '静安白领馆',
                distanceKm: 3.2,
                openSlots: 3,
                maxPlayers: 4,
                hostCreditScore: 100,
                matchRate: 88,
                city: '上海',
                level: 'intermediate',
                score: 64,
                startTime: '2026-04-22T20:00:00+08:00',
              },
            ],
          },
        });
      }
    }),
    navigateTo: vi.fn(),
    switchTab: vi.fn(),
    setStorageSync: vi.fn(),
    getStorageSync: vi.fn(() => ''),
    removeStorageSync: vi.fn(),
  });

  const wrapper = mount(ProfilePage);
  await flushPromises();

  expect(wrapper.text()).toContain('我发起的球局');
  expect(wrapper.text()).toContain('我发起的静安晚场');
  expect(wrapper.text()).toContain('静安白领馆');
});
```

- [ ] **Step 2: 运行前端测试，确认新增断言先失败或暴露不一致**

Run:
```bash
corepack pnpm --filter @pingpang/mobile test -- run home.spec.ts profile-page.spec.ts
```

Expected: 如果有旧的 `venueName` 常量或字段不一致，这里会先暴露出来。

- [ ] **Step 3: 最小修正首页/我的的接口字段依赖**

```ts
const featuredMatch = computed(() => matchesQuery.data.value?.items[0] ?? null);
const myMatches = computed(() => myMatchesQuery.data.value?.items ?? []);
```

```vue
<text class="card-caption">{{ featuredMatch.venueName }} · 主理人信用 {{ featuredMatch.hostCreditScore }}</text>
```

```vue
<text class="hosted-match-meta">{{ item.venueName }} · {{ item.openSlots }} 个空位</text>
```

- [ ] **Step 4: 运行全量验证，确认整条链路成立**

Run:
```bash
corepack pnpm --filter @pingpang/api db:seed
corepack pnpm --filter @pingpang/api exec jest --runInBand --config ./test/jest-e2e.json
corepack pnpm --filter @pingpang/mobile test
D:\CODE\pingpang\apps\api\node_modules\.bin\tsc.CMD --noEmit -p D:\CODE\pingpang\apps\api\tsconfig.json
D:\CODE\pingpang\apps\mobile\node_modules\.bin\vue-tsc.CMD --noEmit -p D:\CODE\pingpang\apps\mobile\tsconfig.json
D:\CODE\pingpang\apps\mobile\node_modules\.bin\uni.CMD build -p h5
```

Expected:
- API e2e 全绿
- mobile tests 全绿
- API TypeScript 编译通过
- `vue-tsc` 通过
- H5 build 成功

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/src/__tests__/home.spec.ts apps/mobile/src/__tests__/profile-page.spec.ts apps/api/test/matches.e2e-spec.ts
git commit -m "test: verify real-data pages across home and profile"
```

---

## Self-Review

- Spec coverage: 已覆盖场馆模型、候选项接口、创建球局真实派生逻辑、发局页接线和页面回归。
- Placeholder scan: 计划中没有 `TODO/TBD` 或“后续再补”型占位步骤。
- Type consistency: 前后端统一使用 `venueId` 作为创建输入，展示仍统一使用 `venueName` 快照，避免字段漂移。

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-22-real-data-full-model.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
