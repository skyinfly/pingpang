import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { getAppConfig } from '../src/common/env/app-config';

describe('Auth flow', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.AUTH_TOKEN_SECRET = 'test-secret';
    process.env.ALLOW_DEV_LOGIN = 'true';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.matchApplication.deleteMany();
    await prisma.match.deleteMany();
    await prisma.user.deleteMany();
  });

  it('updates the authenticated user nickname and rejects out-of-range values', async () => {
    const phone = '13800138000';
    const verifyResponse = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone, code: '123456' })
      .expect(201);
    const token = verifyResponse.body.token as string;

    const updateResponse = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ nickname: '新昵称', city: '杭州', level: 'advanced' })
      .expect(200);

    expect(updateResponse.body.nickname).toBe('新昵称');
    expect(updateResponse.body.city).toBe('杭州');
    expect(updateResponse.body.level).toBe('advanced');

    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ level: 'guru' })
      .expect(400);
  });

  it('returns a public user profile without exposing the phone number', async () => {
    const phone = '13800138000';
    const verifyResponse = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone, code: '123456' })
      .expect(201);

    const userId = verifyResponse.body.user.id as string;
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(response.body.id).toBe(userId);
    expect(response.body.nickname).toBeDefined();
    expect(response.body.phone).toBeUndefined();
    expect(response.body.hostedMatches).toEqual(expect.any(Number));
    expect(response.body.joinedMatches).toEqual(expect.any(Number));
  });

  it('revokes the current session and blocks subsequent token use', async () => {
    const phone = '13800138000';
    await request(app.getHttpServer()).post('/auth/request-code').send({ phone }).expect(201);
    const verifyResponse = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone, code: '123456' })
      .expect(201);
    const token = verifyResponse.body.token as string;

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, { ok: true });

    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  afterAll(async () => {
    process.env.NODE_ENV = originalNodeEnv;
    delete process.env.AUTH_TOKEN_SECRET;
    delete process.env.ALLOW_DEV_LOGIN;
    await app.close();
  });

  it('creates a session for a whitelisted OTP code', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000', code: '123456' })
      .expect(201);

    expect(response.body.token.split('.')).toHaveLength(2);
    expect(response.body.user.nickname).toBe('球友1380013');
  });

  it('rejects an invalid OTP code', async () => {
    await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000', code: '000000' })
      .expect(401);
  });

  it('rejects malformed auth requests with 400', async () => {
    await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000' })
      .expect(400);
  });

  it('returns the seeded profile for a valid token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000', code: '123456' })
      .expect(201);

    const profileResponse = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(profileResponse.body.phone).toBe('13800138000');
    expect(profileResponse.body.nickname).toBe('球友1380013');
  });

  it('protects messages and matches with a bearer token', async () => {
    await request(app.getHttpServer()).get('/messages').expect(401);
    await request(app.getHttpServer())
      .post('/matches')
      .send({
        title: 'auth check',
        venueName: 'venue',
        startTime: '2026-04-17T20:30:00+08:00',
        city: '上海',
        level: 'intermediate',
        maxPlayers: 4,
      })
      .expect(401);
  });

  it('derives identity from the bearer token instead of trusting the query userId', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000', code: '123456' })
      .expect(201);

    await prisma.message.create({
      data: {
        userId: loginResponse.body.user.id,
        kind: 'system',
        title: 'Token-owned message',
        content: 'Visible to the bearer token owner only.',
      },
    });

    const response = await request(app.getHttpServer())
      .get('/messages?userId=user-reviewee-1')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(response.body.items.some((item: { title: string }) => item.title === 'Token-owned message')).toBe(true);
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

  it('disables the dev auth flow when ALLOW_DEV_LOGIN is false', async () => {
    process.env.ALLOW_DEV_LOGIN = 'false';

    await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone: '13800138000', code: '123456' })
      .expect(404);

    process.env.ALLOW_DEV_LOGIN = 'true';
  });

  it('rejects production config when dev login is enabled', () => {
    const previousEnv = process.env.NODE_ENV;
    const previousAllowDevLogin = process.env.ALLOW_DEV_LOGIN;
    const previousAuthTokenSecret = process.env.AUTH_TOKEN_SECRET;

    process.env.NODE_ENV = 'production';
    process.env.ALLOW_DEV_LOGIN = 'true';
    process.env.AUTH_TOKEN_SECRET = 'test-secret';

    expect(() => getAppConfig()).toThrow('ALLOW_DEV_LOGIN must be false in production');

    if (previousEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousEnv;
    }

    if (previousAllowDevLogin === undefined) {
      delete process.env.ALLOW_DEV_LOGIN;
    } else {
      process.env.ALLOW_DEV_LOGIN = previousAllowDevLogin;
    }

    if (previousAuthTokenSecret === undefined) {
      delete process.env.AUTH_TOKEN_SECRET;
    } else {
      process.env.AUTH_TOKEN_SECRET = previousAuthTokenSecret;
    }
  });
});
