import { z } from 'zod';

export const reviewSummarySchema = z.object({
  id: z.string(),
  matchId: z.string(),
  reviewerId: z.string(),
  reviewerName: z.string(),
  revieweeId: z.string(),
  score: z.number().int().min(1).max(5),
  tags: z.array(z.string()),
  createdAt: z.string(),
});

export const reviewProfileSchema = z.object({
  user: z.object({
    id: z.string(),
    nickname: z.string(),
    city: z.string(),
    level: z.string(),
    creditScore: z.number().int(),
  }),
  stats: z.object({
    totalReviews: z.number().int().nonnegative(),
    positiveReviews: z.number().int().nonnegative(),
    averageScore: z.number().nonnegative(),
  }),
  tags: z.array(
    z.object({
      tag: z.string(),
      count: z.number().int().positive(),
    }),
  ),
  items: z.array(reviewSummarySchema),
});

export type ReviewSummary = z.infer<typeof reviewSummarySchema>;
export type ReviewProfile = z.infer<typeof reviewProfileSchema>;
