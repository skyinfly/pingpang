import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: { matchId: string; reviewerId: string; revieweeId: string; score: number; tags: string[] }) {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: payload,
      });

      const reviewee = await tx.user.update({
        where: { id: payload.revieweeId },
        data: {
          creditScore: {
            increment: payload.score >= 4 ? 1 : -2,
          },
        },
      });

      return {
        review,
        reviewee: {
          id: reviewee.id,
          creditScore: reviewee.creditScore,
        },
      };
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: 'desc' },
    });

    const reviewerIds = [...new Set(reviews.map((item) => item.reviewerId))];
    const reviewers = reviewerIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: reviewerIds } },
        })
      : [];
    const reviewerNameMap = new Map(reviewers.map((reviewer) => [reviewer.id, reviewer.nickname]));

    const totalReviews = reviews.length;
    const positiveReviews = reviews.filter((item) => item.score >= 4).length;
    const averageScore = totalReviews
      ? Number((reviews.reduce((sum, item) => sum + item.score, 0) / totalReviews).toFixed(1))
      : 0;

    const tagCounts = new Map<string, number>();

    for (const review of reviews) {
      for (const tag of review.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }

    return {
      user: {
        id: user.id,
        nickname: user.nickname,
        city: user.city,
        level: user.level,
        creditScore: user.creditScore,
      },
      stats: {
        totalReviews,
        positiveReviews,
        averageScore,
      },
      tags: [...tagCounts.entries()]
        .map(([tag, count]) => ({ tag, count }))
        .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag)),
      items: reviews.map((review) => ({
        id: review.id,
        matchId: review.matchId,
        reviewerId: review.reviewerId,
        reviewerName: reviewerNameMap.get(review.reviewerId) ?? '球友',
        revieweeId: review.revieweeId,
        score: review.score,
        tags: review.tags,
        createdAt: review.createdAt.toISOString(),
      })),
    };
  }
}
