# Persistence Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `users`, `matches`, and `match_applications` from in-memory behavior to `PostgreSQL + Prisma` while keeping the current API contracts stable for the mobile app.

**Architecture:** Introduce a shared `PrismaModule`, persist the dev-login user on successful OTP verification, and replace the in-memory `MatchesService` store with Prisma reads and writes. Seed the database with deterministic local fixtures so H5 and e2e work without empty states.

**Tech Stack:** `NestJS`, `Prisma`, `PostgreSQL`, `TypeScript`, `Jest`, `Supertest`, `pnpm`

---

## Planned File Structure

- Root env docs: `.env.example`
- API package scripts: `apps/api/package.json`
- Prisma bootstrap: `apps/api/prisma/schema.prisma`, `apps/api/prisma/seed.ts`
- Prisma DI: `apps/api/src/common/prisma/prisma.service.ts`, `apps/api/src/common/prisma/prisma.module.ts`
- Auth persistence: `apps/api/src/auth/dev-auth.ts`, `apps/api/src/auth/auth.module.ts`, `apps/api/src/auth/auth.service.ts`
- User persistence: `apps/api/src/users/users.module.ts`, `apps/api/src/users/users.service.ts`
- Match persistence: `apps/api/src/matches/matches.module.ts`, `apps/api/src/matches/matches.service.ts`, `apps/api/src/matches/matches.mapper.ts`
- App wiring: `apps/api/src/app.module.ts`
- Regression tests: `apps/api/test/auth.e2e-spec.ts`, `apps/api/test/matches.e2e-spec.ts`

## Scope

- Persist the login user by phone number on `POST /auth/verify-code`
- Read `/users/me` from the database instead of rebuilding a synthetic profile in memory
- Persist seeded matches and applications in PostgreSQL
- Persist `POST /matches` and `POST /matches/:id/applications`
- Keep `messages` and `reviews` on their current simplified implementation for this phase

## Out of Scope

- Realtime messaging
- Review record persistence
- Approval workflow for applications
- Concurrent slot reservation logic

### Task 1: Persist Dev Login Users

**Files:**
- Create: `apps/api/src/common/prisma/prisma.module.ts`
- Modify: `apps/api/src/app.module.ts`
- Modify: `apps/api/src/auth/dev-auth.ts`
- Modify: `apps/api/src/auth/auth.module.ts`
- Modify: `apps/api/src/auth/auth.service.ts`
- Modify: `apps/api/src/users/users.module.ts`
- Modify: `apps/api/src/users/users.service.ts`
- Modify: `apps/api/test/auth.e2e-spec.ts`
- Test: `apps/api/test/auth.e2e-spec.ts`

- [ ] **Step 1: Write the failing auth persistence test**

```ts
// apps/api/test/auth.e2e-spec.ts
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Auth flow', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    // existing app bootstrap...
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.matchApplication.deleteMany();
    await prisma.match.deleteMany();
    await prisma.user.deleteMany();
  });

  it('persists the session user and reads the profile from the database', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000', code: '123456' })
      .expect(201);

    const savedUser = await prisma.user.findUniqueOrThrow({
      where: { phone: '13800138000' },
    });

    await prisma.user.update({
      where: { id: savedUser.id },
      data: { creditScore: 109 },
    });

    const profileResponse = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(profileResponse.body.id).toBe(savedUser.id);
    expect(profileResponse.body.creditScore).toBe(109);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- auth.e2e-spec.ts`  
Expected: FAIL because `/users/me` still returns the synthetic in-memory user with `creditScore: 100`

- [ ] **Step 3: Write the minimal Prisma-backed auth and user implementation**

```ts
// apps/api/src/common/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```ts
// apps/api/src/auth/dev-auth.ts
import { UnauthorizedException } from '@nestjs/common';

export type SessionUser = {
  id: string;
  phone: string;
  nickname: string;
  city: string;
  level: string;
  creditScore: number;
};

export const DEV_LOGIN_CODE = '123456';

export function isDevAuthEnabled() {
  return process.env.NODE_ENV !== 'production';
}

export function buildDevToken(phone: string) {
  return `dev-token-${phone}`;
}

export function buildDevUserData(phone: string) {
  return {
    phone,
    nickname: `球友${phone.slice(0, 7)}`,
    city: '上海',
    level: 'intermediate',
    creditScore: 100,
  };
}

export function buildDevSession(phone: string, user: SessionUser) {
  return {
    token: buildDevToken(phone),
    user,
  };
}

export function readPhoneFromDevToken(token: string) {
  const phone = token.replace(/^dev-token-/, '');

  if (!phone || buildDevToken(phone) !== token) {
    throw new UnauthorizedException('invalid token');
  }

  return phone;
}
```

```ts
// apps/api/src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { buildDevUserData, readPhoneFromDevToken, type SessionUser } from '../auth/dev-auth';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertDevUser(phone: string): Promise<SessionUser> {
    return this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: buildDevUserData(phone),
    });
  }

  async getProfileByToken(token: string): Promise<SessionUser> {
    const phone = readPhoneFromDevToken(token);
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      throw new NotFoundException(`User for ${phone} not found`);
    }

    return user;
  }
}
```

```ts
// apps/api/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { buildDevSession, DEV_LOGIN_CODE } from './dev-auth';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  requestCode(phone: string) {
    return {
      ok: true,
      phone,
      devCode: DEV_LOGIN_CODE,
    };
  }

  async verifyCode(phone: string, code: string) {
    if (code !== DEV_LOGIN_CODE) {
      throw new UnauthorizedException('invalid code');
    }

    const user = await this.usersService.upsertDevUser(phone);

    return buildDevSession(phone, user);
  }
}
```

```ts
// apps/api/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

```ts
// apps/api/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

```ts
// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MatchesModule } from './matches/matches.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MatchesModule, MessagesModule, ReviewsModule],
  controllers: [HealthController],
})
export class AppModule {}
```

- [ ] **Step 4: Run the auth test again**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- auth.e2e-spec.ts`  
Expected: PASS with the new persistence assertion and the existing auth checks all green

- [ ] **Step 5: Commit**

```bash
# If git is initialized in this workspace:
git add apps/api/src/common/prisma/prisma.module.ts apps/api/src/app.module.ts apps/api/src/auth/dev-auth.ts apps/api/src/auth/auth.module.ts apps/api/src/auth/auth.service.ts apps/api/src/users/users.module.ts apps/api/src/users/users.service.ts apps/api/test/auth.e2e-spec.ts
git commit -m "feat: persist dev auth users in prisma"
```

### Task 2: Seed and Read Matches from PostgreSQL

**Files:**
- Modify: `.env.example`
- Modify: `apps/api/package.json`
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/seed.ts`
- Modify: `apps/api/src/matches/matches.module.ts`
- Create: `apps/api/src/matches/matches.mapper.ts`
- Modify: `apps/api/src/matches/matches.service.ts`
- Modify: `apps/api/test/matches.e2e-spec.ts`
- Test: `apps/api/test/matches.e2e-spec.ts`

- [ ] **Step 1: Write the failing seeded-match regression test**

```ts
// apps/api/test/matches.e2e-spec.ts
import { PrismaService } from '../src/common/prisma/prisma.service';
import { seedDatabase } from '../prisma/seed';

describe('Matches listing', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    // existing app bootstrap...
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.matchApplication.deleteMany();
    await prisma.match.deleteMany();
    await prisma.user.deleteMany();
    await seedDatabase(prisma);
  });

  it('returns the seeded prisma matches for the home feed', async () => {
    const response = await request(app.getHttpServer())
      .get('/matches?city=上海&level=intermediate')
      .expect(200);

    expect(response.body.items[0]).toMatchObject({
      id: 'match-seed-1',
      title: '徐汇晚间上分局',
      venueName: '徐家汇活力馆 3 号台',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: FAIL because the current in-memory `MatchesService` still returns the old hard-coded mock titles

- [ ] **Step 3: Write the schema, seed, and Prisma read path**

```env
# .env.example
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pingpang
REDIS_URL=redis://localhost:6379
```

```json
// apps/api/package.json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "test": "jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

```prisma
// apps/api/prisma/schema.prisma
model User {
  id          String   @id @default(cuid())
  phone       String   @unique
  nickname    String
  city        String
  level       String
  creditScore Int      @default(100)
  createdAt   DateTime @default(now())
}

model Match {
  id              String             @id
  title           String
  venueName       String
  startTime       DateTime
  city            String
  level           String
  maxPlayers      Int
  openSlots       Int
  hostCreditScore Int
  distanceKm      Float
  matchRate       Int
  createdAt       DateTime           @default(now())
  applications    MatchApplication[]
}

model MatchApplication {
  id        String   @id @default(cuid())
  matchId   String
  userId    String
  status    String
  createdAt DateTime @default(now())
  match     Match    @relation(fields: [matchId], references: [id], onDelete: Cascade)

  @@unique([matchId, userId])
}
```

```ts
// apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { buildDevUserData } from '../src/auth/dev-auth';

type SeedPrisma = Pick<PrismaClient, 'user' | 'match' | 'matchApplication'>;

export async function seedDatabase(prisma: SeedPrisma) {
  await prisma.matchApplication.deleteMany();
  await prisma.match.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: buildDevUserData('13800138000'),
  });

  await prisma.match.createMany({
    data: [
      {
        id: 'match-seed-1',
        title: '徐汇晚间上分局',
        venueName: '徐家汇活力馆 3 号台',
        startTime: new Date('2026-04-17T19:30:00+08:00'),
        city: '上海',
        level: 'intermediate',
        maxPlayers: 4,
        openSlots: 2,
        hostCreditScore: 97,
        distanceKm: 1.8,
        matchRate: 93,
      },
      {
        id: 'match-seed-2',
        title: '静安午休快打局',
        venueName: '静安寺白领馆 2 号台',
        startTime: new Date('2026-04-17T12:30:00+08:00'),
        city: '上海',
        level: 'intermediate',
        maxPlayers: 2,
        openSlots: 1,
        hostCreditScore: 95,
        distanceKm: 3.2,
        matchRate: 87,
      },
    ],
  });
}

const prisma = new PrismaClient();

seedDatabase(prisma)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```ts
// apps/api/src/matches/matches.mapper.ts
import type { Match } from '@prisma/client';

export function toMatchCard(match: Match, score: number) {
  return {
    id: match.id,
    title: match.title,
    venueName: match.venueName,
    startTime: match.startTime.toISOString(),
    distanceKm: match.distanceKm,
    maxPlayers: match.maxPlayers,
    openSlots: match.openSlots,
    hostCreditScore: match.hostCreditScore,
    level: match.level,
    matchRate: match.matchRate,
    city: match.city,
    score,
  };
}
```

```ts
// apps/api/src/matches/matches.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { toMatchCard } from './matches.mapper';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recommendations: RecommendationsService,
  ) {}

  async list(filters?: { city?: string; level?: string }) {
    const items = await this.prisma.match.findMany({
      where: {
        city: filters?.city || undefined,
        level: filters?.level || undefined,
      },
      orderBy: { startTime: 'asc' },
    });

    return {
      items: items
        .map((item) =>
          toMatchCard(item, this.recommendations.score(item.distanceKm, item.matchRate)),
        )
        .sort((a, b) => b.score - a.score),
    };
  }

  async getById(id: string) {
    const match = await this.prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    return toMatchCard(match, this.recommendations.score(match.distanceKm, match.matchRate));
  }
}
```

```ts
// apps/api/src/matches/matches.module.ts
import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule, RecommendationsModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
```

- [ ] **Step 4: Generate Prisma client, push schema, seed data, and rerun matches test**

Run: `corepack pnpm --filter @pingpang/api prisma:generate && corepack pnpm --filter @pingpang/api db:push && corepack pnpm --filter @pingpang/api db:seed && corepack pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: Prisma client generates, schema push and seed complete, and the seeded-match assertion passes

- [ ] **Step 5: Commit**

```bash
# If git is initialized in this workspace:
git add .env.example apps/api/package.json apps/api/prisma/schema.prisma apps/api/prisma/seed.ts apps/api/src/matches/matches.module.ts apps/api/src/matches/matches.mapper.ts apps/api/src/matches/matches.service.ts apps/api/test/matches.e2e-spec.ts
git commit -m "feat: seed and read matches from prisma"
```

### Task 3: Persist Match Creation and Applications

**Files:**
- Modify: `apps/api/src/matches/matches.service.ts`
- Modify: `apps/api/test/matches.e2e-spec.ts`
- Test: `apps/api/test/matches.e2e-spec.ts`

- [ ] **Step 1: Write the failing persistence-and-duplicate-guard test**

```ts
// apps/api/test/matches.e2e-spec.ts
it('persists new matches and prevents duplicate applications', async () => {
  const createResponse = await request(app.getHttpServer())
    .post('/matches')
    .send({
      title: '龙华晚间补位局',
      venueName: '龙华活力馆 2 号台',
      startTime: '2026-04-17T20:30:00+08:00',
      city: '上海',
      level: 'intermediate',
      maxPlayers: 4,
    })
    .expect(201);

  const storedMatch = await prisma.match.findUnique({
    where: { id: createResponse.body.id },
  });

  expect(storedMatch?.title).toBe('龙华晚间补位局');

  await request(app.getHttpServer())
    .post(`/matches/${createResponse.body.id}/applications`)
    .send({ userId: 'user-13800138000' })
    .expect(201);

  await request(app.getHttpServer())
    .post(`/matches/${createResponse.body.id}/applications`)
    .send({ userId: 'user-13800138000' })
    .expect(409);

  const applicationCount = await prisma.matchApplication.count({
    where: {
      matchId: createResponse.body.id,
      userId: 'user-13800138000',
    },
  });

  expect(applicationCount).toBe(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: FAIL because the current `create` and `apply` paths are not yet writing to Prisma and do not reject duplicate applications

- [ ] **Step 3: Write the minimal Prisma-backed create/apply implementation**

```ts
// apps/api/src/matches/matches.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { ApplyMatchDto } from './dto/apply-match.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { toMatchCard } from './matches.mapper';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recommendations: RecommendationsService,
  ) {}

  // keep list/getById from Task 2

  async create(payload: CreateMatchDto) {
    const createdMatch = await this.prisma.match.create({
      data: {
        id: `match-${Date.now()}`,
        title: payload.title,
        venueName: payload.venueName,
        startTime: new Date(payload.startTime),
        city: payload.city,
        level: payload.level,
        maxPlayers: payload.maxPlayers,
        openSlots: Math.max(payload.maxPlayers - 1, 0),
        hostCreditScore: 98,
        distanceKm: 2.8,
        matchRate: 82,
      },
    });

    return toMatchCard(
      createdMatch,
      this.recommendations.score(createdMatch.distanceKm, createdMatch.matchRate),
    );
  }

  async apply(id: string, payload: ApplyMatchDto) {
    const match = await this.prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    try {
      return await this.prisma.matchApplication.create({
        data: {
          matchId: id,
          userId: payload.userId,
          status: 'pending',
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('application already exists');
      }

      throw error;
    }
  }
}
```

- [ ] **Step 4: Run the matches suite again**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: PASS with seeded reads, persisted create, and duplicate-application conflict coverage all green

- [ ] **Step 5: Commit**

```bash
# If git is initialized in this workspace:
git add apps/api/src/matches/matches.service.ts apps/api/test/matches.e2e-spec.ts
git commit -m "feat: persist match creation and applications"
```

### Task 4: Final Regression and Environment Verification

**Files:**
- No file changes expected
- Test: `apps/api/test/auth.e2e-spec.ts`
- Test: `apps/api/test/matches.e2e-spec.ts`
- Test: `apps/api/test/reviews.e2e-spec.ts`
- Test: `tools/verify-workspace.mjs`

- [ ] **Step 1: Run the workspace smoke check**

Run: `node tools/verify-workspace.mjs`  
Expected: `workspace smoke check passed`

- [ ] **Step 2: Run auth regression**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- auth.e2e-spec.ts`  
Expected: PASS with all auth/profile checks green

- [ ] **Step 3: Run match regression**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- matches.e2e-spec.ts`  
Expected: PASS with all seeded read, create, and application assertions green

- [ ] **Step 4: Run review regression**

Run: `corepack pnpm --filter @pingpang/api test:e2e -- reviews.e2e-spec.ts`  
Expected: PASS to confirm the persistence changes did not break the existing review slice

- [ ] **Step 5: Run the root build**

Run: `corepack pnpm build`  
Expected: PASS with `workspace smoke check passed`

- [ ] **Step 6: Commit**

```bash
# If git is initialized in this workspace:
git add -A
git commit -m "chore: verify persistence phase 1 regressions"
```

## Environment Notes

- Copy `.env.example` to a local `.env` before running Prisma commands
- Use `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pingpang`
- Run `corepack pnpm --filter @pingpang/api prisma:generate` before the first Nest boot after schema changes
- Run `corepack pnpm --filter @pingpang/api db:push` any time `schema.prisma` changes during this phase
- Run `corepack pnpm --filter @pingpang/api db:seed` after a local reset so H5 and e2e have stable fixtures

## Self-Review

### Spec coverage

- Persistent users on login: Task 1
- Database seed for local development: Task 2
- Database-backed match list/detail: Task 2
- Database-backed match creation/application: Task 3
- Fresh regression evidence: Task 4

### Placeholder scan

- No `TODO`, `TBD`, or “fill this in later” placeholders remain
- Every task includes exact files, commands, expected failures, and expected green states

### Type consistency

- User session payload remains `{ token, user }`
- Match responses keep `distanceKm`, `maxPlayers`, `openSlots`, `hostCreditScore`, `level`, `matchRate`, `city`, `score`
- Application payload remains `{ userId }`
