import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { seedDatabase } from '../prisma/seed';

describe('Reviews and credit', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
    const response = await request(app.getHttpServer())
      .post('/reviews')
      .send({
        matchId: 'match-seed-1',
        reviewerId: 'user-13800138000',
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
    expect(response.body.reviewee.creditScore).toBe(101);
    expect(storedReview.score).toBe(5);
    expect(storedReview.tags).toEqual(['on_time', 'great_communication']);
    expect(reviewee.creditScore).toBe(101);
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
