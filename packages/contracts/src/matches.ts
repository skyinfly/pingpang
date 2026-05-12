import { z } from 'zod';

export const matchLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const matchStatusSchema = z.enum(['open', 'cancelled']);

export const matchCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  venueName: z.string(),
  startTime: z.string(),
  distanceKm: z.number(),
  maxPlayers: z.number(),
  openSlots: z.number(),
  status: matchStatusSchema.optional(),
  hostCreditScore: z.number(),
  level: matchLevelSchema,
  matchRate: z.number(),
});

export type MatchCard = z.infer<typeof matchCardSchema>;
export type MatchStatus = z.infer<typeof matchStatusSchema>;
