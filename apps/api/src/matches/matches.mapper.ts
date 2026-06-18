import type { Match } from '../generated/prisma';

/**
 * Derived match phase, computed from the persisted `status` + `startTime`.
 * Lets the UI group matches into "上来就能加入" / "正在打" / "已结束" / "已解散"
 * without re-running the same time math on every card.
 */
export type MatchLifecycle = 'upcoming' | 'live' | 'completed' | 'cancelled';

/** How long after startTime we still consider the match "live". */
export const LIVE_WINDOW_MS = 2 * 60 * 60 * 1000;

export function computeLifecycle(
  match: { status: string; startTime: Date },
  now: Date = new Date(),
): MatchLifecycle {
  if (match.status === 'cancelled') return 'cancelled';
  const startMs = match.startTime.getTime();
  const nowMs = now.getTime();
  if (startMs > nowMs) return 'upcoming';
  if (nowMs - startMs <= LIVE_WINDOW_MS) return 'live';
  return 'completed';
}

/**
 * Match card returned to clients. venueLatitude/Longitude/Address come from
 * the joined Venue and are populated by callers that include() it; older
 * callers (getById, listMine) leave them undefined to avoid an extra query
 * — the match-detail endpoint hydrates them separately.
 */
export type MatchCardDto = {
  id: string;
  title: string;
  hostUserId: string;
  courtId: string | null;
  slotId: string | null;
  venueName: string;
  startTime: string;
  distanceKm: number;
  maxPlayers: number;
  openSlots: number;
  status: string;
  /** Derived state: 'upcoming' | 'live' | 'completed' | 'cancelled'. */
  lifecycle: MatchLifecycle;
  coverUrl: string | null;
  hostCreditScore: number;
  level: string;
  matchRate: number;
  city: string;
  score: number;
  venueLatitude?: number | null;
  venueLongitude?: number | null;
  venueAddress?: string | null;
};

export function toMatchCard(match: Match, score: number, now: Date = new Date()): MatchCardDto {
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
    lifecycle: computeLifecycle(match, now),
    coverUrl: match.coverUrl ?? null,
    hostCreditScore: match.hostCreditScore,
    level: match.level,
    matchRate: match.matchRate,
    city: match.city,
    score,
  };
}
