import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { seedDatabase } from '../prisma/seed';

describe('Reviews and credit', () => {
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

  it('submits a review, stores it, and updates the reviewee credit score', async () => {
    const token = await login();
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: ['on_time', 'great_communication'],
      })
      .expect(201);

    const storedReview = await prisma.review.findFirstOrThrow({
      where: {
        matchId: 'match-seed-1',
        reviewerId: 'user-13800138000',
        revieweeId: 'user-reviewee-1',
      },
    });

    const reviewee = await prisma.user.findUniqueOrThrow({
      where: { id: 'user-reviewee-1' },
    });

    expect(response.body.review.id).toEqual(expect.any(String));
    expect(response.body.review.score).toBe(5);
    expect(storedReview.score).toBe(5);
    expect(storedReview.tags).toEqual(['on_time', 'great_communication']);
    expect(reviewee.creditScore).toBe(100);
  });

  it('rejects unauthenticated review submissions', async () => {
    await request(app.getHttpServer())
      .post('/reviews')
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: [],
      })
      .expect(401);
  });

  it('rejects self-review attempts', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-13800138000',
        score: 5,
        tags: [],
      })
      .expect(400);
  });

  it('rejects out-of-range scores', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 6,
        tags: [],
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 0,
        tags: [],
      })
      .expect(400);
  });

  it('rejects review when reviewer was not part of the match', async () => {
    const outsiderToken = await login('13700137000');
    await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${outsiderToken}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: [],
      })
      .expect(403);
  });

  it('rejects duplicate reviews for the same match pairing', async () => {
    const token = await login();
    await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: [],
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 4,
        tags: [],
      })
      .expect(409);
  });

  it('clamps creditScore at the upper bound on positive reviews', async () => {
    await prisma.user.update({
      where: { id: 'user-reviewee-1' },
      data: { creditScore: 100 },
    });
    const token = await login();
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: [],
      })
      .expect(201);

    expect(response.body.reviewee.creditScore).toBe(100);
  });

  it('clamps creditScore at the lower bound on negative reviews', async () => {
    await prisma.user.update({
      where: { id: 'user-reviewee-1' },
      data: { creditScore: 1 },
    });
    const token = await login();
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 2,
        tags: [],
      })
      .expect(201);

    expect(response.body.reviewee.creditScore).toBe(0);
  });

  it('keeps the review anonymous when submitted with the anonymous flag', async () => {
    const token = await login();
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: ['on_time'],
        anonymous: true,
      })
      .expect(201);

    const profileResponse = await request(app.getHttpServer())
      .get('/reviews/profile/user-reviewee-1')
      .expect(200);
    const anonymous = profileResponse.body.items.find((item: { id: string }) => item.id === response.body.review.id);
    expect(anonymous.reviewerId).toBe('');
    expect(anonymous.reviewerName).toBe('匿名球友');
    expect(anonymous.anonymous).toBe(true);
  });

  it('lets the reviewer withdraw their own review within the 24 hour window', async () => {
    const token = await login();
    const submit = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: [],
      })
      .expect(201);
    const reviewId = submit.body.review.id as string;
    const beforeCredit = submit.body.reviewee.creditScore as number;

    await request(app.getHttpServer())
      .delete(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, { ok: true, id: reviewId });

    expect(await prisma.review.findUnique({ where: { id: reviewId } })).toBeNull();
    const after = await prisma.user.findUniqueOrThrow({ where: { id: 'user-reviewee-1' } });
    expect(after.creditScore).toBe(Math.max(0, beforeCredit - 1));
  });

  it('rejects a withdraw attempt from a different user', async () => {
    const ownerToken = await login();
    const submit = await request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        matchId: 'match-seed-1',
        revieweeId: 'user-reviewee-1',
        score: 5,
        tags: [],
      })
      .expect(201);
    const reviewId = submit.body.review.id as string;

    const otherToken = await login('13700137000');
    await request(app.getHttpServer())
      .delete(`/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('returns a persisted profile review summary for a user', async () => {
    await prisma.review.deleteMany({
      where: { revieweeId: 'user-13800138000' },
    });

    await prisma.review.createMany({
      data: [
        {
          id: 'review-seed-1',
          matchId: 'match-seed-1',
          reviewerId: 'user-reviewee-1',
          revieweeId: 'user-13800138000',
          score: 5,
          tags: ['on_time', 'great_communication'],
          createdAt: new Date('2026-04-17T21:30:00+08:00'),
        },
        {
          id: 'review-seed-2',
          matchId: 'match-seed-2',
          reviewerId: 'user-reviewee-1',
          revieweeId: 'user-13800138000',
          score: 4,
          tags: ['positive_energy'],
          createdAt: new Date('2026-04-18T21:30:00+08:00'),
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/reviews/profile/user-13800138000')
      .expect(200);

    expect(response.body.user).toMatchObject({
      id: 'user-13800138000',
      creditScore: 100,
    });
    expect(response.body.stats).toEqual({
      totalReviews: 2,
      positiveReviews: 2,
      averageScore: 4.5,
    });
    expect(response.body.tags).toContainEqual({
      tag: 'on_time',
      count: 1,
    });
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0]).toMatchObject({
      id: 'review-seed-2',
      revieweeId: 'user-13800138000',
      reviewerName: '球友里卡',
    });
  });
});
