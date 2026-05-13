import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { seedDatabase, seedDatabaseInTransaction } from '../prisma/seed';

describe('Matches listing', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const SHANGHAI = '\u4e0a\u6d77';

  async function login(phone = '13800138000') {
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

  it('returns ranked cards for the home feed', async () => {
    const response = await request(app.getHttpServer())
      .get(`/matches?city=${encodeURIComponent(SHANGHAI)}&level=intermediate`)
      .expect(200);

    expect(response.body.items[0]).toMatchObject({
      id: 'match-seed-1',
      title: '徐汇今晚练球局',
      venueName: '徐家汇活力馆 3 号台',
      matchRate: 93,
    });
  });

  it('returns active match options from the database', async () => {
    const response = await request(app.getHttpServer()).get('/match-options').expect(200);

    expect(response.body.venues).toHaveLength(2);
    expect(response.body.venues.map((venue: { id: string }) => venue.id)).toEqual([
      'venue-seed-1',
      'venue-seed-2',
    ]);
    expect(response.body.venues[0]).toMatchObject({
      id: 'venue-seed-1',
      name: '徐家汇活力馆',
      city: SHANGHAI,
      distanceKm: 1.8,
      courts: [
        { id: 'venue-court-1', name: '3号台' },
        { id: 'venue-court-2', name: '5号台' },
      ],
    });
    expect(response.body.timeSlots.map((slot: { id: string }) => slot.id)).toEqual([
      'venue-slot-1',
      'venue-slot-2',
      'venue-slot-3',
      'venue-slot-4',
    ]);
    expect(response.body.levels.map((level: { value: string }) => level.value)).toEqual([
      'beginner',
      'intermediate',
      'advanced',
    ]);
    expect(response.body.playerCounts.map((count: { value: number }) => count.value)).toEqual([
      2,
      4,
      6,
    ]);
    expect(response.body.venues.some((venue: { id: string }) => venue.id === 'venue-inactive-1')).toBe(false);
    expect(response.body.timeSlots).toHaveLength(4);
    expect(response.body.timeSlots[0]).toMatchObject({
      slotId: 'venue-slot-1',
      id: 'venue-slot-1',
      startTime: '19:30',
      endTime: '20:30',
    });
    expect(response.body.levels.some((level: { id: string }) => level.id === 'level-expert-archived')).toBe(false);
    expect(response.body.playerCounts.some((count: { id: string }) => count.id === 'player-count-8-archived')).toBe(false);
  });

  it('rejects invalid venue availability minutes at the database boundary', async () => {
    const invalidSlotId = 'venue-slot-invalid-minute-guard';

    await expect(
      prisma.venueAvailabilitySlot.create({
        data: {
          id: invalidSlotId,
          venueId: 'venue-seed-1',
          label: 'invalid',
          startTime: -1,
          endTime: 30,
          sortOrder: 999,
          isActive: true,
        },
      }),
    ).rejects.toThrow();

    await prisma.venueAvailabilitySlot.deleteMany({
      where: { id: invalidSlotId },
    });
  });

  it('seeds match venue links directly in the transaction payload', async () => {
    const matchUpserts: Array<{
      where: { id: string };
      update: { venueId: string | null };
      create: { venueId: string | null };
    }> = [];

    const tx = {
      chatThreadParticipant: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      chatThread: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      review: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      message: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      matchApplication: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      match: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn(async (payload) => {
          matchUpserts.push(payload);
          return undefined;
        }),
        update: jest.fn(async () => {
          throw new Error('Match repair updates are not allowed during seed');
        }),
      },
      venueAvailabilitySlot: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      venueCourt: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      optionPreset: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      venue: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
      user: {
        deleteMany: jest.fn().mockResolvedValue(undefined),
        upsert: jest.fn().mockResolvedValue(undefined),
      },
    };

    await seedDatabaseInTransaction(tx as any);

    expect(matchUpserts).toHaveLength(3);
    expect(matchUpserts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          where: { id: 'match-seed-1' },
          create: expect.objectContaining({ venueId: 'venue-seed-1' }),
          update: expect.objectContaining({ venueId: 'venue-seed-1' }),
        }),
        expect.objectContaining({
          where: { id: 'match-seed-past-1' },
          create: expect.objectContaining({ venueId: 'venue-seed-1' }),
          update: expect.objectContaining({ venueId: 'venue-seed-1' }),
        }),
        expect.objectContaining({
          where: { id: 'match-seed-2' },
          create: expect.objectContaining({ venueId: 'venue-seed-2' }),
          update: expect.objectContaining({ venueId: 'venue-seed-2' }),
        }),
      ]),
    );
    expect(tx.match.update).not.toHaveBeenCalled();
  });

  it('returns a direct detail payload for a match id', async () => {
    const response = await request(app.getHttpServer())
      .get('/matches/match-seed-1')
      .expect(200);

    expect(response.body).toMatchObject({
      id: 'match-seed-1',
      title: '徐汇今晚练球局',
      venueName: '徐家汇活力馆 3 号台',
      distanceKm: 1.8,
      matchRate: 93,
    });
  });

  it('creates a new match with a host-owned thread participant', async () => {
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const selectedSlot = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-4');
    const selectedCourt = options.body.venues
      .find((venue: { id: string }) => venue.id === 'venue-seed-2')
      ?.courts.find((court: { id: string }) => court.id === 'venue-court-3');

    const token = await login();
    const response = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '龙华晚间补位局',
        venueId: 'venue-seed-2',
        courtId: selectedCourt.id,
        slotId: selectedSlot.slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    const storedMatch = await prisma.match.findUnique({
      where: { id: response.body.id },
    });
    const hostParticipant = await prisma.chatThreadParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId: response.body.id,
          userId: 'user-13800138000',
        },
      },
    });

    expect(response.body).toMatchObject({
      title: '龙华晚间补位局',
      courtId: 'venue-court-3',
      slotId: 'venue-slot-4',
      venueName: '静安寺白领馆 2号台',
      city: '上海',
      level: 'intermediate',
      maxPlayers: 4,
      openSlots: 3,
      hostCreditScore: 100,
      distanceKm: 3.2,
      matchRate: 89,
    });
    expect(storedMatch?.hostUserId).toBe('user-13800138000');
    expect(storedMatch?.venueId).toBe('venue-seed-2');
    expect((storedMatch as typeof storedMatch & { courtId?: string | null })?.courtId).toBe('venue-court-3');
    expect(storedMatch?.slotId).toBe('venue-slot-4');
    expect(storedMatch?.venueName).toBe('静安寺白领馆 2号台');
    expect(storedMatch?.hostCreditScore).toBe(100);
    expect(storedMatch?.distanceKm).toBe(3.2);
    expect(storedMatch?.matchRate).toBe(89);
    expect(hostParticipant?.role).toBe('host');

    const thread = await prisma.chatThread.findUnique({
      where: { id: response.body.id },
    });

    expect(thread).toMatchObject({
      latestMessagePreview: '球局已创建，快来沟通上场安排',
      lastMessageSenderId: 'user-13800138000',
      lastMessageSenderName: '球友1380013',
    });
  });

  it('rejects a slot that does not belong to the selected venue', async () => {
    const token = await login();

    await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '跨馆错位局',
        venueId: 'venue-seed-2',
        courtId: 'venue-court-3',
        slotId: 'venue-slot-1',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(404);
  });

  it('rejects a court that does not belong to the selected venue', async () => {
    const token = await login();

    await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '跨馆错台局',
        venueId: 'venue-seed-2',
        courtId: 'venue-court-1',
        slotId: 'venue-slot-4',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(404);
  });

  it('returns the authenticated user hosted matches', async () => {
    const token = await login();
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const selectedSlot = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2');

    await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '我发起的徐汇晚场',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId: selectedSlot.slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/matches/mine')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: '我发起的徐汇晚场',
          venueName: '徐家汇活力馆 5号台',
          openSlots: 3,
        }),
      ]),
    );
  });

  it('creates a pending application without enrolling the applicant in the thread', async () => {
    const hostToken = await login('13900139000');
    const applicantToken = await login();

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '待审核申请测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-1',
        slotId: 'venue-slot-1',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const participant = await prisma.chatThreadParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId: createResponse.body.id,
          userId: 'user-13800138000',
        },
      },
    });

    expect(response.body).toEqual({
      matchId: createResponse.body.id,
      userId: 'user-13800138000',
      status: 'pending',
    });
    expect(participant).toBeNull();
  });

  it('rejects applying to a match with no open slots', async () => {
    const hostToken = await login('13900139000');
    const applicantToken = await login();
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const slotId = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2').slotId;

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '满员测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await prisma.match.update({
      where: { id: createResponse.body.id },
      data: { openSlots: 0 },
    });

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(409);
  });

  it('rejects applying to a match that has already started', async () => {
    const hostToken = await login('13900139000');
    const applicantToken = await login();
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const slotId = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2').slotId;

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '过期测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await prisma.match.update({
      where: { id: createResponse.body.id },
      data: { startTime: new Date(Date.now() - 60 * 60 * 1000) },
    });

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(409);
  });

  it('rejects creating a match whose maxPlayers is out of bounds via global validation', async () => {
    const hostToken = await login('13900139000');
    await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '越界测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId: 'venue-slot-2',
        level: 'intermediate',
        maxPlayers: 99,
      })
      .expect(400);
  });

  it('strips unknown fields from match creation payloads via validation whitelist', async () => {
    const hostToken = await login('13900139000');
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const slotId = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2').slotId;

    await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '禁字段局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId,
        level: 'intermediate',
        maxPlayers: 4,
        sneakyAdminFlag: true,
      })
      .expect(400);
  });

  it('cancels a hosted match, fans out system messages, and hides it from the home feed', async () => {
    const hostToken = await login('13900139000');
    const applicantToken = await login();
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const slotId = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2').slotId;

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '取消测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const cancelResponse = await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/cancel`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({ reason: '场馆临时维护' })
      .expect(201);

    expect(cancelResponse.body).toMatchObject({
      id: createResponse.body.id,
      status: 'cancelled',
      openSlots: 0,
    });

    const cancelMessage = await prisma.message.findFirst({
      where: {
        matchId: createResponse.body.id,
        userId: 'user-13800138000',
        status: 'cancelled',
      },
    });
    expect(cancelMessage?.title).toBe('球局已取消');
    expect(cancelMessage?.content).toContain('场馆临时维护');

    const pendingApplication = await prisma.matchApplication.findFirstOrThrow({
      where: { matchId: createResponse.body.id, userId: 'user-13800138000' },
    });
    expect(pendingApplication.status).toBe('rejected');

    const listResponse = await request(app.getHttpServer())
      .get(`/matches?city=${encodeURIComponent('上海')}&level=intermediate`)
      .expect(200);
    expect(listResponse.body.items.map((item: { id: string }) => item.id)).not.toContain(createResponse.body.id);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(409);
  });

  it('rejects cancellation by a non-host user', async () => {
    const hostToken = await login('13900139000');
    const otherToken = await login();
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const slotId = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2').slotId;

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '权限测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/cancel`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({})
      .expect(403);
  });

  it('rejects approving an application for a match that already started', async () => {
    const hostToken = await login('13900139000');
    const applicantToken = await login();
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const slotId = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2').slotId;

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '过期审核测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const application = await prisma.matchApplication.findFirstOrThrow({
      where: { matchId: createResponse.body.id, userId: 'user-13800138000' },
    });

    await prisma.match.update({
      where: { id: createResponse.body.id },
      data: { startTime: new Date(Date.now() - 60 * 60 * 1000) },
    });

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications/${application.id}/approve`)
      .set('Authorization', `Bearer ${hostToken}`)
      .expect(409);
  });

  it('lets the host review applications and approve one applicant into the thread', async () => {
    const hostToken = await login();
    const applicantToken = await login('13900139000');
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const selectedSlot = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-2');

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '主理人审核测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId: selectedSlot.slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const pendingParticipant = await prisma.chatThreadParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId: createResponse.body.id,
          userId: 'user-reviewee-1',
        },
      },
    });

    expect(pendingParticipant).toBeNull();

    const listResponse = await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${hostToken}`)
      .expect(200);

    expect(listResponse.body.items).toEqual([
      expect.objectContaining({
        userId: 'user-reviewee-1',
        status: 'pending',
        applicantNickname: '球友里卡',
      }),
    ]);

    const approveResponse = await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications/${listResponse.body.items[0].id}/approve`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({})
      .expect(201);

    const approvedParticipant = await prisma.chatThreadParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId: createResponse.body.id,
          userId: 'user-reviewee-1',
        },
      },
    });
    const storedMatch = await prisma.match.findUnique({
      where: { id: createResponse.body.id },
    });

    expect(approveResponse.body).toEqual(
      expect.objectContaining({
        id: listResponse.body.items[0].id,
        matchId: createResponse.body.id,
        userId: 'user-reviewee-1',
        status: 'approved',
      }),
    );
    expect(approvedParticipant?.role).toBe('member');
    expect(storedMatch?.openSlots).toBe(2);
  });

  it('returns approved joined matches for the authenticated applicant', async () => {
    const hostToken = await login();
    const applicantToken = await login('13900139000');
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const selectedSlot = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-4');

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '我参加的测试局',
        venueId: 'venue-seed-2',
        courtId: 'venue-court-3',
        slotId: selectedSlot.slotId,
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const applications = await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${hostToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications/${applications.body.items[0].id}/approve`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({})
      .expect(201);

    const joinedResponse = await request(app.getHttpServer())
      .get('/matches/joined')
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(200);

    expect(joinedResponse.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createResponse.body.id,
          title: '我参加的测试局',
        }),
      ]),
    );
  });

  it('returns the authenticated user application status for a match', async () => {
    const hostToken = await login();
    const applicantToken = await login('13900139000');

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '申请状态测试局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-1',
        slotId: 'venue-slot-1',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/my-application`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(200, {
        status: 'none',
      });

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const pendingResponse = await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/my-application`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(200);

    expect(pendingResponse.body).toEqual(
      expect.objectContaining({
        matchId: createResponse.body.id,
        userId: 'user-reviewee-1',
        status: 'pending',
      }),
    );

    const applications = await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${hostToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications/${applications.body.items[0].id}/reject`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        reason: '这场局更适合中高级球友',
      })
      .expect(201);

    const rejectedResponse = await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/my-application`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(200);

    expect(rejectedResponse.body).toEqual(
      expect.objectContaining({
        matchId: createResponse.body.id,
        userId: 'user-reviewee-1',
        status: 'rejected',
        reason: '这场局更适合中高级球友',
      }),
    );
  });

  it('rejects the host applying to their own match', async () => {
    const token = await login('13900139000');

    await request(app.getHttpServer())
      .post('/matches/match-seed-1/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(409);

    const applicationCount = await prisma.matchApplication.count({
      where: {
        matchId: 'match-seed-1',
        userId: 'user-reviewee-1',
      },
    });

    expect(applicationCount).toBe(0);
  });

  it('persists new matches and prevents duplicate applications', async () => {
    const options = await request(app.getHttpServer()).get('/match-options').expect(200);
    const selectedSlot = options.body.timeSlots.find((slot: { slotId: string }) => slot.slotId === 'venue-slot-4');

    const token = await login();
    const applicantToken = await login('13900139000');
    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '龙华晚间补位局',
        venueId: 'venue-seed-2',
        courtId: 'venue-court-3',
        slotId: selectedSlot.slotId,
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
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(409);

    const applicationCount = await prisma.matchApplication.count({
      where: {
        matchId: createResponse.body.id,
        userId: 'user-reviewee-1',
      },
    });

    expect(applicationCount).toBe(1);
  });
  it('rejects protected match mutations without a bearer token', async () => {
    await request(app.getHttpServer())
      .post('/matches')
      .send({
        title: 'No auth match',
        venueId: 'venue-seed-2',
        courtId: 'venue-court-3',
        slotId: 'venue-slot-4',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(401);

    await request(app.getHttpServer()).post('/matches/match-seed-1/applications').send({}).expect(401);
  });
});
