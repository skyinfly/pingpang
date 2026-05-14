import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';

const CREDIT_MIN = 0;
const CREDIT_MAX = 100;
const WITHDRAW_WINDOW_HOURS = 24;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: {
    matchId: string;
    reviewerId: string;
    revieweeId: string;
    score: number;
    tags: string[];
    anonymous?: boolean;
  }) {
    if (!Number.isInteger(payload.score) || payload.score < 1 || payload.score > 5) {
      throw new BadRequestException('score must be an integer between 1 and 5');
    }

    if (!Array.isArray(payload.tags)) {
      throw new BadRequestException('tags must be an array of strings');
    }

    if (payload.reviewerId === payload.revieweeId) {
      throw new BadRequestException('reviewer and reviewee must be different users');
    }

    if (!payload.revieweeId || !payload.matchId) {
      throw new BadRequestException('matchId and revieweeId are required');
    }

    const [match, reviewee] = await Promise.all([
      this.prisma.match.findUnique({ where: { id: payload.matchId } }),
      this.prisma.user.findUnique({ where: { id: payload.revieweeId } }),
    ]);

    if (!match) {
      throw new NotFoundException(`Match ${payload.matchId} not found`);
    }

    if (!reviewee) {
      throw new NotFoundException(`User ${payload.revieweeId} not found`);
    }

    const reviewerParticipates =
      match.hostUserId === payload.reviewerId ||
      (await this.prisma.chatThreadParticipant.findUnique({
        where: {
          threadId_userId: {
            threadId: payload.matchId,
            userId: payload.reviewerId,
          },
        },
      })) !== null;

    if (!reviewerParticipates) {
      throw new ForbiddenException(`Reviewer ${payload.reviewerId} is not a participant of match ${payload.matchId}`);
    }

    const revieweeParticipates =
      match.hostUserId === payload.revieweeId ||
      (await this.prisma.chatThreadParticipant.findUnique({
        where: {
          threadId_userId: {
            threadId: payload.matchId,
            userId: payload.revieweeId,
          },
        },
      })) !== null;

    if (!revieweeParticipates) {
      throw new ForbiddenException(`Reviewee ${payload.revieweeId} is not a participant of match ${payload.matchId}`);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const review = await tx.review.create({ data: payload });

        const delta = payload.score >= 4 ? 1 : -2;
        const nextScore = Math.max(CREDIT_MIN, Math.min(CREDIT_MAX, reviewee.creditScore + delta));
        const updated = await tx.user.update({
          where: { id: payload.revieweeId },
          data: { creditScore: nextScore },
        });

        return {
          review,
          reviewee: {
            id: updated.id,
            creditScore: updated.creditScore,
          },
        };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('You have already reviewed this user for this match');
      }

      throw error;
    }
  }

  async withdrawOwnReview(reviewId: string, reviewerId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }

    if (review.reviewerId !== reviewerId) {
      throw new ForbiddenException('You can only withdraw your own reviews');
    }

    const cutoff = Date.now() - WITHDRAW_WINDOW_HOURS * 60 * 60 * 1000;
    if (review.createdAt.getTime() < cutoff) {
      throw new ConflictException(
        `Reviews can only be withdrawn within ${WITHDRAW_WINDOW_HOURS} hours of submission`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const reviewee = await tx.user.findUnique({
        where: { id: review.revieweeId },
        select: { creditScore: true },
      });

      await tx.review.delete({ where: { id: reviewId } });

      if (reviewee) {
        const delta = review.score >= 4 ? -1 : 2;
        const next = Math.max(CREDIT_MIN, Math.min(CREDIT_MAX, reviewee.creditScore + delta));
        await tx.user.update({
          where: { id: review.revieweeId },
          data: { creditScore: next },
        });
      }
    });

    return { ok: true, id: reviewId };
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
        reviewerId: review.anonymous ? '' : review.reviewerId,
        reviewerName: review.anonymous ? '匿名球友' : reviewerNameMap.get(review.reviewerId) ?? '球友',
        revieweeId: review.revieweeId,
        score: review.score,
        tags: review.tags,
        anonymous: review.anonymous,
        createdAt: review.createdAt.toISOString(),
      })),
    };
  }
}
