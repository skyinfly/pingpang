import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { UploadsService } from '../src/uploads/uploads.service';
import { seedDatabase } from '../prisma/seed';

describe('Uploads flow', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let uploadsRoot: string;

  async function login(phone = '13800138000') {
    const response = await request(app.getHttpServer())
      .post('/auth/verify-code')
      .send({ phone, code: '123456' })
      .expect(201);
    return response.body.token as string;
  }

  beforeAll(async () => {
    uploadsRoot = mkdtempSync(join(tmpdir(), 'pingpang-uploads-'));
    process.env.UPLOADS_LOCAL_ROOT = uploadsRoot;
    process.env.UPLOADS_PUBLIC_BASE = '/static/uploads';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    const uploads = app.get(UploadsService);
    const localInfo = uploads.getLocalStorageInfo();
    if (localInfo) {
      (app as NestExpressApplication).useStaticAssets(localInfo.rootPath, {
        prefix: localInfo.publicBase,
      });
    }
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
    delete process.env.UPLOADS_LOCAL_ROOT;
    delete process.env.UPLOADS_PUBLIC_BASE;
    await app.close();
    rmSync(uploadsRoot, { recursive: true, force: true });
  });

  // A 1x1 transparent PNG (smallest valid PNG, ~70 bytes).
  const tinyPngBuffer = Buffer.from(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
    'hex',
  );

  it('rejects unauthenticated uploads', async () => {
    await request(app.getHttpServer())
      .post('/uploads/avatar')
      .attach('file', tinyPngBuffer, { filename: 'a.png', contentType: 'image/png' })
      .expect(401);
  });

  it('uploads an avatar, persists it on the user, and serves the URL', async () => {
    const token = await login();

    const upload = await request(app.getHttpServer())
      .post('/uploads/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', tinyPngBuffer, { filename: 'avatar.png', contentType: 'image/png' })
      .expect(201);

    expect(upload.body.key).toMatch(/^avatar\//);
    expect(upload.body.url).toMatch(/^\/static\/uploads\/avatar\//);

    const diskPath = join(uploadsRoot, upload.body.key);
    expect(existsSync(diskPath)).toBe(true);
    expect(readFileSync(diskPath).length).toBe(tinyPngBuffer.length);

    const patched = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ avatarUrl: upload.body.url })
      .expect(200);
    expect(patched.body.avatarUrl).toBe(upload.body.url);

    const served = await request(app.getHttpServer()).get(upload.body.url).expect(200);
    expect(served.body.length).toBe(tinyPngBuffer.length);
  });

  it('uploads a match cover and stores it via POST /matches', async () => {
    const token = await login('13900139000');

    const upload = await request(app.getHttpServer())
      .post('/uploads/match-cover')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', tinyPngBuffer, { filename: 'cover.png', contentType: 'image/png' })
      .expect(201);

    expect(upload.body.key).toMatch(/^match-cover\//);
    expect(upload.body.url).toMatch(/^\/static\/uploads\/match-cover\//);

    const created = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '带封面的局',
        venueId: 'venue-seed-1',
        courtId: 'venue-court-2',
        slotId: 'venue-slot-2',
        level: 'intermediate',
        maxPlayers: 4,
        coverUrl: upload.body.url,
      })
      .expect(201);

    expect(created.body.coverUrl).toBe(upload.body.url);
  });

  it('rejects non-image uploads with 400', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/uploads/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('not an image'), { filename: 'a.txt', contentType: 'text/plain' })
      .expect(400);
  });

  it('rejects an unknown upload kind', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/uploads/passport')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', tinyPngBuffer, { filename: 'a.png', contentType: 'image/png' })
      .expect(400);
  });

  it('rejects payloads above the per-kind size limit (avatar > 2MB)', async () => {
    const token = await login();
    const oversized = Buffer.alloc(2 * 1024 * 1024 + 100, 0);
    // Pretend it is a PNG; we are exercising the size guard, not the magic bytes.
    await request(app.getHttpServer())
      .post('/uploads/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', oversized, { filename: 'big.png', contentType: 'image/png' })
      .expect(413);
  });
});
