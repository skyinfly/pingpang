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

  async function loginAs(phone: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone, code: '123456' })
      .expect(201);

    return response.body.token as string;
  }

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
          courts: expect.arrayContaining([
            expect.objectContaining({ id: 'venue-court-1', name: '3号台', isActive: true }),
            expect.objectContaining({ id: 'venue-court-2', name: '5号台', isActive: true }),
          ]),
          slots: expect.arrayContaining([
            expect.objectContaining({
              id: 'venue-slot-1',
              label: '工作日晚间',
              startTime: 19 * 60 + 30,
              endTime: 20 * 60 + 30,
              isActive: true,
            }),
          ]),
        }),
      ]),
    );
  });

  it('creates, updates, and deletes a court for an existing venue', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/admin/venues/venue-seed-1/courts')
      .set('X-Admin-Token', adminToken)
      .send({ name: '7号台', sortOrder: 3, isActive: true })
      .expect(201);

    const created = createResponse.body.courts.find((court: { name: string }) => court.name === '7号台');
    expect(created).toBeDefined();
    expect(createResponse.body.courtCount).toBe(3);

    const updateResponse = await request(app.getHttpServer())
      .patch(`/admin/courts/${created.id}`)
      .set('X-Admin-Token', adminToken)
      .send({ name: '7号台 Pro', isActive: false })
      .expect(200);

    const updated = updateResponse.body.courts.find((court: { id: string }) => court.id === created.id);
    expect(updated).toMatchObject({ name: '7号台 Pro', isActive: false });

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/admin/courts/${created.id}`)
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(deleteResponse.body.courtCount).toBe(2);
    expect(await prisma.venueCourt.findUnique({ where: { id: created.id } })).toBeNull();
  });

  it('rejects deleting a court that is still bound to a match', async () => {
    await request(app.getHttpServer())
      .delete('/admin/courts/venue-court-1')
      .set('X-Admin-Token', adminToken)
      .expect(409);
  });

  it('creates, updates, and deletes a slot with HH:MM time parsing', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/admin/venues/venue-seed-1/slots')
      .set('X-Admin-Token', adminToken)
      .send({ label: '清晨练习', startTime: '07:00', endTime: '08:30', sortOrder: 5 })
      .expect(201);

    const created = createResponse.body.slots.find((slot: { label: string }) => slot.label === '清晨练习');
    expect(created).toMatchObject({ startTime: 7 * 60, endTime: 8 * 60 + 30, isActive: true });
    expect(createResponse.body.slotCount).toBe(3);

    const updateResponse = await request(app.getHttpServer())
      .patch(`/admin/slots/${created.id}`)
      .set('X-Admin-Token', adminToken)
      .send({ label: '清晨续场', endTime: '09:00', isActive: false })
      .expect(200);

    const updated = updateResponse.body.slots.find((slot: { id: string }) => slot.id === created.id);
    expect(updated).toMatchObject({ label: '清晨续场', endTime: 9 * 60, isActive: false });

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/admin/slots/${created.id}`)
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(deleteResponse.body.slotCount).toBe(2);
    expect(await prisma.venueAvailabilitySlot.findUnique({ where: { id: created.id } })).toBeNull();
  });

  it('rejects creating a slot whose end is before its start', async () => {
    await request(app.getHttpServer())
      .post('/admin/venues/venue-seed-1/slots')
      .set('X-Admin-Token', adminToken)
      .send({ label: '错误时段', startTime: '21:00', endTime: '20:00' })
      .expect(400);
  });

  it('rejects deleting a slot that is still bound to a match', async () => {
    await request(app.getHttpServer())
      .delete('/admin/slots/venue-slot-1')
      .set('X-Admin-Token', adminToken)
      .expect(409);
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

  it('lists pending applications with applicant and host context', async () => {
    const applicantToken = await loginAs('13800138000');
    await request(app.getHttpServer())
      .post('/matches/match-seed-1/applications')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/admin/applications?status=pending')
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          matchId: 'match-seed-1',
          status: 'pending',
          matchTitle: '徐汇今晚练球局',
          hostNickname: '球友里卡',
          applicantNickname: '球友1380013',
          applicantPhone: '13800138000',
        }),
      ]),
    );
  });

  it('approves a pending application via admin and decrements open slots', async () => {
    const matchBefore = await prisma.match.findUnique({ where: { id: 'match-seed-1' } });
    const applicantToken = await loginAs('13800138000');
    const applyResponse = await request(app.getHttpServer())
      .post('/matches/match-seed-1/applications')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);
    const applicationId = (
      await prisma.matchApplication.findFirst({
        where: { matchId: 'match-seed-1', userId: 'user-13800138000' },
      })
    )?.id as string;

    const response = await request(app.getHttpServer())
      .post(`/admin/applications/${applicationId}/approve`)
      .set('X-Admin-Token', adminToken)
      .expect(201);

    expect(applyResponse.body.status).toBe('pending');
    expect(response.body.items.every((item: { status: string }) => item.status === 'pending')).toBe(true);

    const matchAfter = await prisma.match.findUnique({ where: { id: 'match-seed-1' } });
    expect(matchAfter?.openSlots).toBe((matchBefore?.openSlots ?? 0) - 1);

    const participant = await prisma.chatThreadParticipant.findUnique({
      where: { threadId_userId: { threadId: 'match-seed-1', userId: 'user-13800138000' } },
    });
    expect(participant?.role).toBe('member');

    const approvedMessage = await prisma.message.findFirst({
      where: { userId: 'user-13800138000', matchId: 'match-seed-1', status: 'approved' },
    });
    expect(approvedMessage?.title).toBe('申请已通过');
  });

  it('rejects a pending application via admin with a custom reason', async () => {
    const applicantToken = await loginAs('13800138000');
    await request(app.getHttpServer())
      .post('/matches/match-seed-1/applications')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);
    const applicationId = (
      await prisma.matchApplication.findFirst({
        where: { matchId: 'match-seed-1', userId: 'user-13800138000' },
      })
    )?.id as string;

    await request(app.getHttpServer())
      .post(`/admin/applications/${applicationId}/reject`)
      .set('X-Admin-Token', adminToken)
      .send({ reason: '已与主理人约定换时段' })
      .expect(201);

    const rejected = await prisma.matchApplication.findUnique({ where: { id: applicationId } });
    expect(rejected?.status).toBe('rejected');
    expect(rejected?.decisionReason).toBe('已与主理人约定换时段');

    const matchAfter = await prisma.match.findUnique({ where: { id: 'match-seed-1' } });
    expect(matchAfter?.openSlots).toBe(2);
  });

  it('rejects approving an already-decided application', async () => {
    const applicantToken = await loginAs('13800138000');
    await request(app.getHttpServer())
      .post('/matches/match-seed-1/applications')
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);
    const applicationId = (
      await prisma.matchApplication.findFirst({
        where: { matchId: 'match-seed-1', userId: 'user-13800138000' },
      })
    )?.id as string;

    await request(app.getHttpServer())
      .post(`/admin/applications/${applicationId}/approve`)
      .set('X-Admin-Token', adminToken)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/admin/applications/${applicationId}/approve`)
      .set('X-Admin-Token', adminToken)
      .expect(409);
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
