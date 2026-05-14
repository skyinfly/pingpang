import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { seedDatabase } from '../prisma/seed';

describe('Reports flow', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const adminToken = 'dev-admin-token';

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
    await prisma.report.deleteMany();
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

  it('rejects self-reports', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({ targetUserId: 'user-13800138000', reason: 'cannot self report' })
      .expect(400);
  });

  it('creates a report and exposes it to admins', async () => {
    const token = await login();
    const create = await request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({ targetUserId: 'user-reviewee-1', reason: '到场后并未约球，疑似刷分行为' })
      .expect(201);

    expect(create.body.id).toEqual(expect.any(String));
    expect(create.body.status).toBe('open');

    const list = await request(app.getHttpServer())
      .get('/admin/reports?status=open')
      .set('X-Admin-Token', adminToken)
      .expect(200);

    expect(list.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: create.body.id,
          targetUserId: 'user-reviewee-1',
          reporterId: 'user-13800138000',
          status: 'open',
        }),
      ]),
    );
  });

  it('resolves a report and removes it from the open queue', async () => {
    const token = await login();
    const create = await request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({ targetUserId: 'user-reviewee-1', reason: '骚扰球友' })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/admin/reports/${create.body.id}/resolve`)
      .set('X-Admin-Token', adminToken)
      .send({ status: 'reviewed' })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/admin/reports?status=open')
      .set('X-Admin-Token', adminToken)
      .expect(200);
    expect(list.body.items.find((item: { id: string }) => item.id === create.body.id)).toBeUndefined();

    const resolved = await request(app.getHttpServer())
      .get('/admin/reports?status=reviewed')
      .set('X-Admin-Token', adminToken)
      .expect(200);
    expect(resolved.body.items[0]?.id).toBe(create.body.id);
  });

  it('rejects unauthenticated report submissions', async () => {
    await request(app.getHttpServer())
      .post('/reports')
      .send({ targetUserId: 'user-reviewee-1', reason: 'no auth' })
      .expect(401);
  });

  it('rejects a report against a missing target user', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({ targetUserId: 'user-does-not-exist', reason: 'ghost' })
      .expect(404);
  });
});
