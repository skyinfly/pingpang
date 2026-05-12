import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { seedDatabase } from '../prisma/seed';

describe('Messages API', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  async function login(phone = '13800138000') {
    const response = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone, code: '123456' })
      .expect(201);

    return response.body.token as string;
  }

  beforeAll(async () => {
    process.env.AUTH_TOKEN_SECRET = 'test-secret';
    process.env.ALLOW_DEV_LOGIN = 'true';
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
    delete process.env.AUTH_TOKEN_SECRET;
    delete process.env.ALLOW_DEV_LOGIN;
    await app.close();
  });

  it('returns unread notification counts from persisted messages', async () => {
    const token = await login();
    const response = await request(app.getHttpServer())
      .get('/messages/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      unreadSystemCount: 2,
      unreadChatCount: 3,
      pendingInvitesCount: 1,
    });
  });

  it('returns the latest persisted message list for the authenticated user', async () => {
    const token = await login();
    const response = await request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.items[0]).toMatchObject({
      id: 'message-seed-1',
      kind: 'system',
      title: '申请已通过',
      isRead: false,
    });
    expect(response.body.items).toHaveLength(6);
  });

  it('rejects thread access without a bearer token', async () => {
    await request(app.getHttpServer()).get('/chat-threads').expect(401);
  });

  it('returns persisted thread details for the authenticated user', async () => {
    const token = await login();

    const response = await request(app.getHttpServer())
      .get('/chat-threads')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0]).toMatchObject({
      id: 'match-seed-1',
      matchId: 'match-seed-1',
      participantCount: 2,
      unreadCount: 3,
    });
  });

  it('returns conversation metadata and participants for one thread', async () => {
    const token = await login();
    const response = await request(app.getHttpServer())
      .get('/chat-threads/match-seed-1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.thread).toMatchObject({
      id: 'match-seed-1',
      matchId: 'match-seed-1',
      venueName: '徐家汇活力馆 3 号台',
      status: 'active',
      hostUserId: 'user-reviewee-1',
    });
    expect(response.body.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: 'user-reviewee-1',
          role: 'host',
          nickname: '球友里卡',
        }),
        expect.objectContaining({
          userId: 'user-13800138000',
          role: 'member',
          nickname: '球友1380013',
        }),
      ]),
    );
  });

  it('blocks posting to a cancelled chat thread', async () => {
    const token = await login();
    await prisma.chatThread.update({
      where: { id: 'match-seed-1' },
      data: { status: 'cancelled' },
    });

    await request(app.getHttpServer())
      .post('/chat-threads/match-seed-1/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Should be rejected.' })
      .expect(409);
  });

  it('persists a chat message and fans it out to thread participants', async () => {
    const token = await login();
    const createResponse = await request(app.getHttpServer())
      .post('/chat-threads/match-seed-1/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'I am downstairs now.',
      })
      .expect(201);

    const listResponse = await request(app.getHttpServer())
      .get('/chat-threads/match-seed-1/messages')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const storedCopies = await prisma.message.count({
      where: {
        threadId: 'match-seed-1',
        content: 'I am downstairs now.',
      },
    });

    expect(createResponse.body).toMatchObject({
      threadId: 'match-seed-1',
      content: 'I am downstairs now.',
      senderId: 'user-13800138000',
      senderName: '球友1380013',
      isRead: false,
    });
    expect(storedCopies).toBe(2);
    expect(listResponse.body.participantCount).toBe(2);
    expect(listResponse.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'I am downstairs now.',
          senderName: '球友1380013',
        }),
      ]),
    );

    const threadResponse = await request(app.getHttpServer())
      .get('/chat-threads/match-seed-1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(threadResponse.body.thread).toMatchObject({
      latestMessagePreview: 'I am downstairs now.',
      lastMessageSenderName: '球友1380013',
    });
  });

  it('marks persisted chat messages as read for the authenticated thread participant', async () => {
    const token = await login();
    const response = await request(app.getHttpServer())
      .post('/chat-threads/match-seed-1/read')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.updatedCount).toBe(3);
    expect(response.body.threadId).toBe('match-seed-1');
    expect(response.body.lastReadAt).toEqual(expect.any(String));

    const summaryResponse = await request(app.getHttpServer())
      .get('/messages/summary')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(summaryResponse.body).toEqual({
      unreadSystemCount: 2,
      unreadChatCount: 0,
      pendingInvitesCount: 1,
    });
  });

  it('marks one chat thread as read and updates thread unread counts', async () => {
    const token = await login();
    const response = await request(app.getHttpServer())
      .post('/chat-threads/match-seed-1/read')
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(response.body.threadId).toBe('match-seed-1');
    expect(response.body.updatedCount).toBe(3);

    const threadResponse = await request(app.getHttpServer())
      .get('/chat-threads')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(threadResponse.body.items[0]).toMatchObject({
      matchId: 'match-seed-1',
      unreadCount: 0,
    });
  });

  it('blocks a pending applicant from opening chat before host approval', async () => {
    const hostToken = await login();
    const applicantToken = await login('13900139000');

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '待审核聊天门禁局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-1',
        slotId: 'venue-slot-1',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    await request(app.getHttpServer())
      .get(`/chat-threads/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(403);
  });

  it('creates review messages for hosts and applicants during the approval workflow', async () => {
    const hostToken = await login();
    const applicantToken = await login('13900139000');

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '消息闭环测试局',
        venueId: 'venue-seed-2',
        courtId: 'venue-court-3',
        slotId: 'venue-slot-4',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .send({})
      .expect(201);

    const hostMessages = await request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', `Bearer ${hostToken}`)
      .expect(200);

    expect(hostMessages.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'invite',
          status: 'pending',
          matchId: createResponse.body.id,
        }),
      ]),
    );

    const applications = await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/applications`)
      .set('Authorization', `Bearer ${hostToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .post(`/matches/${createResponse.body.id}/applications/${applications.body.items[0].id}/approve`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({})
      .expect(201);

    const applicantMessages = await request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(200);

    expect(applicantMessages.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'system',
          title: '申请已通过',
          matchId: createResponse.body.id,
        }),
      ]),
    );
  });

  it('returns a clear rejection reason in applicant messages and application status', async () => {
    const hostToken = await login();
    const applicantToken = await login('13900139000');

    const createResponse = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title: '拒绝原因测试局',
        venueId: 'venue-seed-2',
        courtId: 'venue-court-3',
        slotId: 'venue-slot-4',
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
      .post(`/matches/${createResponse.body.id}/applications/${applications.body.items[0].id}/reject`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        reason: '这场局更适合中高级球友',
      })
      .expect(201);

    const applicantMessages = await request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(200);

    expect(applicantMessages.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'system',
          title: '申请暂未通过',
          status: 'rejected',
          matchId: createResponse.body.id,
          content: '这场局更适合中高级球友',
        }),
      ]),
    );

    const statusResponse = await request(app.getHttpServer())
      .get(`/matches/${createResponse.body.id}/my-application`)
      .set('Authorization', `Bearer ${applicantToken}`)
      .expect(200);

    expect(statusResponse.body).toEqual(
      expect.objectContaining({
        status: 'rejected',
        matchId: createResponse.body.id,
        userId: 'user-reviewee-1',
        reason: '这场局更适合中高级球友',
      }),
    );
  });
});
