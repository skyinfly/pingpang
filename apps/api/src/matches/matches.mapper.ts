import type { Match } from '../generated/prisma';

export function toMatchCard(match: Match, score: number) {
  return {
    id: match.id,
    title: match.title,
    hostUserId: match.hostUserId,
    courtId: match.courtId ?? null,
    slotId: match.slotId ?? null,
    venueName: match.venueName,
    startTime: match.startTime.toISOString(),
    distanceKm: match.distanceKm,
    maxPlayers: match.maxPlayers,
    openSlots: match.openSlots,
    status: match.status,
    coverUrl: match.coverUrl ?? null,
    hostCreditScore: match.hostCreditScore,
    level: match.level,
    matchRate: match.matchRate,
    city: match.city,
    score,
  };
}
