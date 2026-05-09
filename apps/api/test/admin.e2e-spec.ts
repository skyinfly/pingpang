import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { seedDatabase } from '../prisma/seed';

describe('Admin API', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const adminToken = 'dev-admin-token';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.matchApplication.deleteMany();
    await prisma.match.deleteMany();
    await prisma.user.deleteMany();
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects admin requests without the admin token', async () => {
    await request(app.getHttpServer()).get('/admin/summary').expect(401);
  });

  it('returns operating summary metrics', async () => {
    const response = await request(app.getHttpServer())
      .get('/admin/summary')
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(response.body).toEqual({
      users: 2,
      matches: 2,
      pendingApplications: 0,
      activeVenues: 2,
      unreadMessages: 6,
      reviews: 2,
    });
  });

  it('returns admin match rows with host and application counts', async () => {
    const response = await request(app.getHttpServer())
      .get('/admin/matches')
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'match-seed-1',
          title: '徐汇今晚练球局',
          venueName: '徐家汇活力馆 3 号台',
          city: '上海',
          level: 'intermediate',
          maxPlayers: 4,
          openSlots: 2,
          hostNickname: '球友里卡',
          applicationCounts: {
            pending: 0,
            approved: 0,
            rejected: 0,
          },
        }),
      ]),
    );
  });

  it('returns admin user rows with activity counts', async () => {
    const response = await request(app.getHttpServer())
      .get('/admin/users')
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'user-reviewee-1',
          phone: '13900139000',
          nickname: '球友里卡',
          city: '上海',
          level: 'intermediate',
          creditScore: 100,
          hostedMatches: 2,
          joinedMatches: 0,
        }),
        expect.objectContaining({
          id: 'user-13800138000',
          joinedMatches: 1,
        }),
      ]),
    );
  });

  it('returns admin venue rows with courts, slots, and usage counts', async () => {
    const response = await request(app.getHttpServer())
      .get('/admin/venues')
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'venue-seed-1',
          name: '徐家汇活力馆',
          city: '上海',
          district: '徐汇',
          isActive: true,
          courtCount: 2,
          slotCount: 2,
          matchCount: 1,
        }),
      ]),
    );
  });

  it('creates, updates, and deletes an unused venue', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/admin/venues')
      .set('X-Admin-Token', adminToken)
      .send({
        name: '虹口训练馆',
        city: '上海',
        district: '虹口',
        distanceKm: 5.6,
        isActive: true,
      })
      .expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        name: '虹口训练馆',
        city: '上海',
        district: '虹口',
        distanceKm: 5.6,
        isActive: true,
        courtCount: 0,
        slotCount: 0,
        matchCount: 0,
      }),
    );

    const updateResponse = await request(app.getHttpServer())
      .patch(`/admin/venues/${createResponse.body.id}`)
      .set('X-Admin-Token', adminToken)
      .send({
        name: '虹口训练馆 Pro',
        isActive: false,
      })
      .expect(200);

    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: createResponse.body.id,
        name: '虹口训练馆 Pro',
        isActive: false,
      }),
    );

    await request(app.getHttpServer())
      .delete(`/admin/venues/${createResponse.body.id}`)
      .set('X-Admin-Token', adminToken)
      .expect(200, {
        ok: true,
        id: createResponse.body.id,
      });

    expect(await prisma.venue.findUnique({ where: { id: createResponse.body.id } })).toBeNull();
  });

  it('rejects deleting a venue that is still used by matches', async () => {
    await request(app.getHttpServer())
      .delete('/admin/venues/venue-seed-1')
      .set('X-Admin-Token', adminToken)
      .expect(409);
  });

  it('creates, updates, and deletes an inactive user without activity', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/admin/users')
      .set('X-Admin-Token', adminToken)
      .send({
        phone: '13700137000',
        nickname: '后台测试球友',
        city: '上海',
        level: 'beginner',
        creditScore: 88,
      })
      .expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        phone: '13700137000',
        nickname: '后台测试球友',
        city: '上海',
        level: 'beginner',
        creditScore: 88,
        hostedMatches: 0,
        joinedMatches: 0,
      }),
    );

    const updateResponse = await request(app.getHttpServer())
      .patch(`/admin/users/${createResponse.body.id}`)
      .set('X-Admin-Token', adminToken)
      .send({
        nickname: '后台改名球友',
        creditScore: 96,
      })
      .expect(200);

    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: createResponse.body.id,
        nickname: '后台改名球友',
        creditScore: 96,
      }),
    );

    await request(app.getHttpServer())
      .delete(`/admin/users/${createResponse.body.id}`)
      .set('X-Admin-Token', adminToken)
      .expect(200, {
        ok: true,
        id: createResponse.body.id,
      });

    expect(await prisma.user.findUnique({ where: { id: createResponse.body.id } })).toBeNull();
  });

  it('rejects deleting a user with existing activity', async () => {
    await request(app.getHttpServer())
      .delete('/admin/users/user-reviewee-1')
      .set('X-Admin-Token', adminToken)
      .expect(409);
  });

  it('creates, updates, and deletes an admin managed match', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/admin/matches')
      .set('X-Admin-Token', adminToken)
      .send({
        title: '后台创建测试局',
        hostUserId: 'user-13800138000',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId: 'venue-slot-2',
        level: 'advanced',
        maxPlayers: 4,
      })
      .expect(201);

    expect(createResponse.body).toEqual(
      expect.objectContaining({
        title: '后台创建测试局',
        venueName: '徐家汇活力馆 5号台',
        hostUserId: 'user-13800138000',
        hostNickname: '球友1380013',
        level: 'advanced',
        maxPlayers: 4,
        openSlots: 3,
      }),
    );

    const updateResponse = await request(app.getHttpServer())
      .patch(`/admin/matches/${createResponse.body.id}`)
      .set('X-Admin-Token', adminToken)
      .send({
        title: '后台更新测试局',
        level: 'intermediate',
        maxPlayers: 6,
      })
      .expect(200);

    expect(updateResponse.body).toEqual(
      expect.objectContaining({
        id: createResponse.body.id,
        title: '后台更新测试局',
        level: 'intermediate',
        maxPlayers: 6,
        openSlots: 5,
      }),
    );

    await request(app.getHttpServer())
      .delete(`/admin/matches/${createResponse.body.id}`)
      .set('X-Admin-Token', adminToken)
      .expect(200, {
        ok: true,
        id: createResponse.body.id,
      });

    expect(await prisma.match.findUnique({ where: { id: createResponse.body.id } })).toBeNull();
    expect(await prisma.chatThread.findUnique({ where: { id: createResponse.body.id } })).toBeNull();
  });

  it('deletes a match and clears related operational records', async () => {
    await request(app.getHttpServer())
      .delete('/admin/matches/match-seed-2')
      .set('X-Admin-Token', adminToken)
      .expect(200, {
        ok: true,
        id: 'match-seed-2',
      });

    expect(await prisma.match.findUnique({ where: { id: 'match-seed-2' } })).toBeNull();
    expect(await prisma.chatThread.findUnique({ where: { id: 'match-seed-2' } })).toBeNull();
    expect(await prisma.review.count({ where: { matchId: 'match-seed-2' } })).toBe(0);
    expect(await prisma.message.count({ where: { matchId: 'match-seed-2' } })).toBe(0);
  });
});
