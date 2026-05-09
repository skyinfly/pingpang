import { z } from 'zod';

export const matchLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const matchCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  venueName: z.string(),
  startTime: z.string(),
  distanceKm: z.number(),
  maxPlayers: z.number(),
  openSlots: z.number(),
  hostCreditScore: z.number(),
  level: matchLevelSchema,
  matchRate: z.number(),
});

export type MatchCard = z.infer<typeof matchCardSchema>;
