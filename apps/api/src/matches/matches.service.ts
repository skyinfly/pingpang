import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Match } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { haversineKm, roundDistanceKm } from '../common/geo/geo';
import { CreateMatchDto } from './dto/create-match.dto';
import { toMatchCard } from './matches.mapper';

export type ListMatchesFilters = {
  city?: string;
  level?: string;
  lat?: number;
  lng?: number;
  /** Optional cap on distance; matches beyond this are filtered out. */
  radiusKm?: number;
};

function getShanghaiDateParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const values = new Map(parts.map((part) => [part.type, part.value]));

  return {
    year: values.get('year') ?? '1970',
    month: values.get('month') ?? '01',
    day: values.get('day') ?? '01',
  };
}

function buildShanghaiSlotDate(slotStartMinutes: number, now = new Date()) {
  const { year, month, day } = getShanghaiDateParts(now);
  const hours = String(Math.floor(slotStartMinutes / 60)).padStart(2, '0');
  const minutes = String(slotStartMinutes % 60).padStart(2, '0');
  const todayCandidate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+08:00`);

  if (todayCandidate.getTime() > now.getTime()) {
    return todayCandidate;
  }

  return new Date(todayCandidate.getTime() + 24 * 60 * 60 * 1000);
}

function buildShanghaiDateAtSlot(dateString: string, slotStartMinutes: number) {
  const hours = String(Math.floor(slotStartMinutes / 60)).padStart(2, '0');
  const minutes = String(slotStartMinutes % 60).padStart(2, '0');
  return new Date(`${dateString}T${hours}:${minutes}:00+08:00`);
}

const REJECTED_APPLICATION_REASON = '这场球局当前席位更适合其他安排，你可以换个时间段继续约。';
/**
 * Grace period after startTime before we consider an open match with no
 * joiners "abandoned". 30 minutes is enough that someone who showed up a
 * bit late and just hasn't been approved yet doesn't get auto-cancelled
 * out from under them.
 */
const ABANDON_GRACE_MS = 30 * 60 * 1000;
const ABANDON_REASON = '球局已开始但还没有球友加入，已自动解散。';
/**
 * Assumed duration when a match record predates the slot-required era
 * and slot.endTime isn't available. Long enough to cover the typical
 * 1–2h booking window so the conflict guard errs on the safe side.
 */
const DEFAULT_MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recommendations: RecommendationsService,
  ) {}

  async list(filters?: ListMatchesFilters) {
    const items = await this.prisma.match.findMany({
      where: {
        city: filters?.city || undefined,
        level: filters?.level || undefined,
        status: 'open',
        openSlots: { gt: 0 },
        startTime: { gt: new Date() },
      },
      orderBy: { startTime: 'asc' },
      include: {
        venue: {
          select: { latitude: true, longitude: true, address: true },
        },
      },
    });

    const userLocation =
      filters?.lat != null && filters?.lng != null
        ? { lat: filters.lat, lng: filters.lng }
        : null;

    // For each match, recompute distance live when we have both ends of
    // the coordinate. Stored Match.distanceKm is treated as a default that
    // the user-location-aware path overrides.
    const enriched = items.map((item) => {
      const venueGeo =
        item.venue?.latitude != null && item.venue?.longitude != null
          ? { lat: item.venue.latitude, lng: item.venue.longitude }
          : null;
      const liveDistanceKm =
        userLocation && venueGeo
          ? roundDistanceKm(haversineKm(userLocation, venueGeo))
          : item.distanceKm;
      return { match: item, liveDistanceKm, venueGeo, address: item.venue?.address ?? null };
    });

    // Radius filter: only enforced when both user coords and venue coords
    // were available (otherwise we'd silently drop venues we can't measure).
    const radiusKm = filters?.radiusKm;
    const filtered =
      userLocation && radiusKm != null
        ? enriched.filter((entry) => entry.venueGeo === null || entry.liveDistanceKm <= radiusKm)
        : enriched;

    const cards = filtered.map((entry) => {
      const card = toMatchCard(
        entry.match,
        this.recommendations.score(entry.liveDistanceKm, entry.match.matchRate),
      );
      // Patch the card with the freshly computed distance + geo so the
      // mobile client can render a marker without a follow-up call.
      card.distanceKm = entry.liveDistanceKm;
      card.venueLatitude = entry.venueGeo?.lat ?? null;
      card.venueLongitude = entry.venueGeo?.lng ?? null;
      card.venueAddress = entry.address;
      return card;
    });

    // Sort: when user located, "recommend nearest with best match rate"
    // (score already blends both). Without location, fall back to time asc.
    if (userLocation) {
      cards.sort((a, b) => b.score - a.score);
    }

    return { items: cards };
  }

  /**
   * Build a RFC 5545 .ics document for a single match. We don't include
   * attendees (no need to leak the participant list) — only the match
   * title, scheduled start, venue and a stable UID so the same match
   * dedupes if the user imports twice.
   */
  async exportCalendar(matchId: string): Promise<string> {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        venue: { select: { address: true } },
        slot: { select: { startTime: true, endTime: true } },
      },
    });
    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }

    // Default to 2-hour duration if no slot end is recorded (legacy data).
    const start = match.startTime;
    const durationMin = match.slot ? Math.max(60, match.slot.endTime - match.slot.startTime) : 120;
    const end = new Date(start.getTime() + durationMin * 60_000);
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}T${String(d.getUTCHours()).padStart(2, '0')}${String(d.getUTCMinutes()).padStart(2, '0')}${String(d.getUTCSeconds()).padStart(2, '0')}Z`;
    const escape = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//pingpang//mvp//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:match-${match.id}@pingpang.app`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${escape(match.title)}`,
      `LOCATION:${escape(match.venue?.address || match.venueName)}`,
      `DESCRIPTION:${escape(`${match.venueName} · ${match.city} · 容量 ${match.maxPlayers} 人`)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    // RFC 5545 mandates CRLF line endings.
    return lines.join('\r\n') + '\r\n';
  }

  async getById(id: string, userLocation?: { lat: number; lng: number } | null) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        venue: {
          select: { latitude: true, longitude: true, address: true },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    const venueGeo =
      match.venue?.latitude != null && match.venue?.longitude != null
        ? { lat: match.venue.latitude, lng: match.venue.longitude }
        : null;
    const liveDistanceKm =
      userLocation && venueGeo
        ? roundDistanceKm(haversineKm(userLocation, venueGeo))
        : match.distanceKm;

    const card = toMatchCard(match, this.recommendations.score(liveDistanceKm, match.matchRate));
    card.distanceKm = liveDistanceKm;
    card.venueLatitude = venueGeo?.lat ?? null;
    card.venueLongitude = venueGeo?.lng ?? null;
    card.venueAddress = match.venue?.address ?? null;
    return card;
  }

  /**
   * Lazy garbage-collect open matches that started a while ago and have
   * no one in them. Called from list endpoints so anyone looking at
   * their own matches gets a fresh view without us running a cron job.
   *
   * "No one in them" = openSlots equals maxPlayers (host counts but
   * isn't in openSlots), i.e. no application was ever approved.
   */
  private async sweepAbandonedMatches(scope: { hostUserId?: string } = {}) {
    const cutoff = new Date(Date.now() - ABANDON_GRACE_MS);
    const candidates = await this.prisma.match.findMany({
      where: {
        ...(scope.hostUserId ? { hostUserId: scope.hostUserId } : {}),
        status: 'open',
        startTime: { lt: cutoff },
        // openSlots == maxPlayers means nobody joined. Prisma doesn't
        // support column-column comparison directly, so we filter in JS.
      },
      select: { id: true, openSlots: true, maxPlayers: true },
    });
    const abandonedIds = candidates
      .filter((row) => row.openSlots === row.maxPlayers)
      .map((row) => row.id);
    if (abandonedIds.length === 0) return;
    await this.prisma.match.updateMany({
      where: { id: { in: abandonedIds } },
      data: { status: 'cancelled', openSlots: 0 },
    });
    // Mirror cancelled state onto the chat thread so the UI doesn't show
    // an active chat for what's effectively a dead match.
    await this.prisma.chatThread.updateMany({
      where: { matchId: { in: abandonedIds } },
      data: { status: 'cancelled', latestMessagePreview: ABANDON_REASON },
    });
  }

  async listMine(hostUserId: string) {
    // Run the sweep scoped to this host so they immediately see their
    // own no-shows get auto-disbanded the moment they open "我的".
    await this.sweepAbandonedMatches({ hostUserId }).catch(() => undefined);

    const items = await this.prisma.match.findMany({
      where: {
        hostUserId,
      },
      orderBy: { startTime: 'desc' },
    });

    return {
      items: items.map((item) => this.mapMatch(item)),
    };
  }

  async listJoined(userId: string) {
    const memberships = await this.prisma.chatThreadParticipant.findMany({
      where: {
        userId,
        role: 'member',
      },
      include: {
        thread: {
          include: {
            match: true,
          },
        },
      },
      orderBy: {
        thread: {
          scheduledAt: 'desc',
        },
      },
    });

    return {
      items: memberships.map((membership) => this.mapMatch(membership.thread.match)),
    };
  }

  async listApplications(matchId: string, hostUserId: string) {
    await this.requireHostOwnedMatch(matchId, hostUserId);

    const applications = await this.prisma.matchApplication.findMany({
      where: { matchId },
      orderBy: { createdAt: 'desc' },
    });

    const applicantIds = [...new Set(applications.map((item) => item.userId))];
    const applicants = applicantIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: applicantIds } },
          select: {
            id: true,
            nickname: true,
            city: true,
            level: true,
            creditScore: true,
          },
        })
      : [];

    const applicantMap = new Map(applicants.map((item) => [item.id, item]));

    return {
      items: applications.map((item) => {
        const applicant = applicantMap.get(item.userId);
        return {
          id: item.id,
          matchId: item.matchId,
          userId: item.userId,
          status: item.status,
          createdAt: item.createdAt.toISOString(),
          decisionReason: item.status === 'rejected' ? this.getDecisionReason(item.decisionReason) : undefined,
          applicantNickname: applicant?.nickname ?? '球友',
          applicantCity: applicant?.city ?? '上海',
          applicantLevel: applicant?.level ?? 'intermediate',
          applicantCreditScore: applicant?.creditScore ?? 100,
        };
      }),
    };
  }

  async getMyApplicationStatus(matchId: string, userId: string) {
    await this.requireMatch(matchId);

    const application = await this.prisma.matchApplication.findFirst({
      where: {
        matchId,
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!application) {
      return {
        status: 'none' as const,
      };
    }

    return {
      status: application.status as 'pending' | 'approved' | 'rejected',
      applicationId: application.id,
      matchId: application.matchId,
      userId: application.userId,
      reason: application.status === 'rejected' ? this.getDecisionReason(application.decisionReason) : undefined,
    };
  }

  async create(payload: CreateMatchDto, hostUserId: string) {
    // Captured outside the transaction so the geo can hydrate the returned
    // card after commit (venue is scoped inside the tx callback). The value
    // is always assigned inside the callback before any use, but TS can't
    // see that through the closure, so we type it explicitly.
    let venueGeo: { latitude: number | null; longitude: number | null; address: string | null } = {
      latitude: null,
      longitude: null,
      address: null,
    };
    const createdMatch = await this.prisma.$transaction(async (tx) => {
      const venue = await tx.venue.findFirst({
        where: {
          id: payload.venueId,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          city: true,
          distanceKm: true,
          latitude: true,
          longitude: true,
          address: true,
        },
      });

      if (!venue) {
        throw new NotFoundException(`Active venue ${payload.venueId} not found`);
      }

      venueGeo = {
        latitude: venue.latitude ?? null,
        longitude: venue.longitude ?? null,
        address: venue.address ?? null,
      };

      // Court is now optional at create time — host fills it in via
      // PATCH /matches/:id later when players actually arrive. If a
      // court id IS passed (legacy clients), still validate it.
      let court: { id: string; name: string } | null = null;
      if (payload.courtId) {
        court = await tx.venueCourt.findFirst({
          where: {
            id: payload.courtId,
            venueId: venue.id,
            isActive: true,
          },
          select: { id: true, name: true },
        });
        if (!court) {
          throw new NotFoundException(`Active court ${payload.courtId} not found for venue ${venue.id}`);
        }
      }

      // Slot is also optional — clients can pass a custom ISO startTime
      // instead. Only validate when explicitly provided.
      let slot: { id: string; label: string; startTime: number; endTime: number } | null = null;
      if (payload.slotId) {
        slot = await tx.venueAvailabilitySlot.findFirst({
          where: {
            id: payload.slotId,
            venueId: venue.id,
            isActive: true,
          },
          select: { id: true, label: true, startTime: true, endTime: true },
        });
        if (!slot) {
          throw new NotFoundException(`Active slot ${payload.slotId} not found for venue ${venue.id}`);
        }
      }

      const hostUser = await tx.user.findUnique({
        where: { id: hostUserId },
        select: {
          id: true,
          nickname: true,
          creditScore: true,
        },
      });

      if (!hostUser) {
        throw new NotFoundException(`User ${hostUserId} not found`);
      }

      const matchRate = this.recommendations.estimateMatchRate(venue.distanceKm, hostUser.creditScore);
      let scheduledStartTime: Date;
      if (slot) {
        scheduledStartTime = payload.startDate
          ? buildShanghaiDateAtSlot(payload.startDate, slot.startTime)
          : buildShanghaiSlotDate(slot.startTime);
      } else if (payload.startTime) {
        scheduledStartTime = new Date(payload.startTime);
        if (Number.isNaN(scheduledStartTime.getTime())) {
          throw new ConflictException('startTime is not a valid ISO-8601 datetime');
        }
      } else {
        throw new ConflictException('either slotId or startTime is required');
      }

      if (scheduledStartTime.getTime() <= Date.now()) {
        throw new ConflictException('scheduled start time is in the past');
      }

      // Reject if the host already has another match overlapping this
      // window — otherwise they'd end up double-booked and unable to
      // honour either side.
      const candidateDuration =
        slot && slot.endTime > slot.startTime
          ? (slot.endTime - slot.startTime) * 60_000
          : DEFAULT_MATCH_DURATION_MS;
      await this.assertNoMatchConflict({
        userId: hostUserId,
        startMs: scheduledStartTime.getTime(),
        endMs: scheduledStartTime.getTime() + candidateDuration,
      });

      // venueName composition: prefer typed courtName > linked court > venue only.
      // Lets the host hand-write "3 号台" without a VenueCourt row.
      const courtSuffix = payload.courtName?.trim() || court?.name || '';
      const venueName = courtSuffix ? `${venue.name} · ${courtSuffix}` : venue.name;

      const match = await tx.match.create({
        data: {
          title: payload.title,
          venueName,
          venueId: venue.id,
          courtId: court?.id ?? null,
          slotId: slot?.id ?? null,
          startTime: scheduledStartTime,
          city: venue.city,
          level: payload.level,
          maxPlayers: payload.maxPlayers,
          openSlots: Math.max(payload.maxPlayers - 1, 0),
          hostUserId,
          hostCreditScore: hostUser.creditScore,
          distanceKm: venue.distanceKm,
          matchRate,
          coverUrl: payload.coverUrl?.trim() || null,
        },
      });

      await tx.chatThread.create({
        data: {
          id: match.id,
          matchId: match.id,
          title: match.title,
          venueName: match.venueName,
          scheduledAt: match.startTime,
          hostUserId,
          status: 'active',
          latestMessagePreview: '\u7403\u5c40\u5df2\u521b\u5efa\uff0c\u5feb\u6765\u6c9f\u901a\u4e0a\u573a\u5b89\u6392',
          latestMessageAt: new Date(),
          lastMessageSenderId: hostUser.id,
          lastMessageSenderName: hostUser.nickname,
        },
      });

      await tx.chatThreadParticipant.create({
        data: {
          threadId: match.id,
          userId: hostUserId,
          role: 'host',
          lastReadAt: new Date(),
        },
      });

      return match;
    });

    // Hydrate venue geo on the freshly created card so the client doesn't
    // need a follow-up GET to render the map/distance. venue was already
    // fetched above, so this is free.
    const card = this.mapMatch(createdMatch);
    return {
      ...card,
      venueLatitude: venueGeo.latitude,
      venueLongitude: venueGeo.longitude,
      venueAddress: venueGeo.address,
    };
  }

  async apply(id: string, userId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: { slot: { select: { startTime: true, endTime: true } } },
    });

    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    if (match.hostUserId === userId) {
      throw new ConflictException('host cannot apply to own match');
    }

    if (match.status === 'cancelled') {
      throw new ConflictException(`match ${id} has been cancelled`);
    }

    if (match.startTime.getTime() <= Date.now()) {
      throw new ConflictException(`match ${id} has already started`);
    }

    if (match.openSlots <= 0) {
      throw new ConflictException(`match ${id} has no open slots`);
    }

    // Block double-booking: the applicant shouldn't already be host or
    // member of another match in the same time window.
    const interval = this.matchInterval(match);
    await this.assertNoMatchConflict({
      userId,
      startMs: interval.startMs,
      endMs: interval.endMs,
      excludeMatchId: id,
    });

    const applicant = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
      },
    });

    if (!applicant) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    try {
      const application = await this.prisma.$transaction(async (tx) => {
        const created = await tx.matchApplication.create({
          data: {
            matchId: id,
            userId,
            status: 'pending',
            decisionReason: null,
          },
        });

        await tx.message.create({
          data: {
            userId: match.hostUserId,
            kind: 'invite',
            title: '新的加入申请',
            content: `${applicant.nickname} 申请加入 ${match.title}，等你确认。`,
            senderId: applicant.id,
            senderName: applicant.nickname,
            status: 'pending',
            matchId: id,
          },
        });

        return created;
      });

      return {
        matchId: application.matchId,
        userId: application.userId,
        status: application.status,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('application already exists');
      }

      throw error;
    }
  }

  /**
   * Member-initiated leave / pending-withdraw. Lets the player back out
   * without needing the host to disband the whole match.
   *
   *   - pending application      → delete (no notification needed; host
   *                                hadn't acted yet anyway)
   *   - approved application     → mark withdrawn + remove from
   *                                ChatThreadParticipant + bump
   *                                Match.openSlots back up + system
   *                                message to the host so they can
   *                                source a replacement.
   *   - host trying to "leave"   → 409: hosts use cancelMatch instead
   *   - rejected / none / past   → 409
   */
  async leaveOwnApplication(matchId: string, userId: string) {
    const match = await this.requireMatch(matchId);

    if (match.hostUserId === userId) {
      throw new ConflictException('host cannot leave own match — use cancel instead');
    }
    if (match.status === 'cancelled') {
      throw new ConflictException(`match ${matchId} has been cancelled`);
    }
    if (match.startTime.getTime() <= Date.now()) {
      throw new ConflictException(`match ${matchId} has already started`);
    }

    const application = await this.prisma.matchApplication.findFirst({
      where: { matchId, userId, status: { in: ['pending', 'approved'] } },
      orderBy: { createdAt: 'desc' },
    });
    if (!application) {
      throw new NotFoundException(`No active application for user ${userId} on match ${matchId}`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nickname: true },
    });
    const nickname = user?.nickname ?? '球友';
    const wasApproved = application.status === 'approved';

    await this.prisma.$transaction(async (tx) => {
      await tx.matchApplication.delete({ where: { id: application.id } });

      if (wasApproved) {
        // Drop chat membership and free the slot so the host (or auto
        // listing) can re-fill it.
        await tx.chatThreadParticipant
          .delete({
            where: { threadId_userId: { threadId: matchId, userId } },
          })
          .catch(() => undefined);

        await tx.match.update({
          where: { id: matchId },
          data: { openSlots: { increment: 1 } },
        });

        await tx.message.create({
          data: {
            userId: match.hostUserId,
            kind: 'system',
            title: '有球友退出了球局',
            content: `${nickname} 退出了「${match.title}」，可以在广场上再找一位补位。`,
            senderName: '系统',
            status: 'cancelled',
            matchId,
          },
        });
      }

      // Clean up any prior invite-style notifications the host was
      // looking at for this applicant — they're stale now.
      await tx.message.updateMany({
        where: {
          userId: match.hostUserId,
          matchId,
          senderId: userId,
          kind: 'invite',
          status: 'pending',
        },
        data: { status: 'cancelled', isRead: true },
      });
    });

    return { ok: true as const, matchId, wasApproved };
  }

  async approveApplication(matchId: string, applicationId: string, hostUserId: string) {
    const match = await this.requireHostOwnedMatch(matchId, hostUserId);
    const application = await this.requireApplication(matchId, applicationId);

    if (application.status !== 'pending') {
      throw new ConflictException(`application ${applicationId} is already ${application.status}`);
    }

    if (match.status === 'cancelled') {
      throw new ConflictException(`match ${matchId} has been cancelled`);
    }

    if (match.startTime.getTime() <= Date.now()) {
      throw new ConflictException(`match ${matchId} has already started`);
    }

    if (match.openSlots <= 0) {
      throw new ConflictException(`match ${matchId} has no open slots`);
    }

    // Re-check time conflict at approval time too — the applicant may
    // have joined another overlapping match between applying and the
    // host approving them. The exception bubbles up so the host sees a
    // tidy 409 ("this player now has a conflict") instead of silently
    // double-booking them.
    const matchWithSlot = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { slot: { select: { startTime: true, endTime: true } } },
    });
    if (matchWithSlot) {
      const interval = this.matchInterval(matchWithSlot);
      await this.assertNoMatchConflict({
        userId: application.userId,
        startMs: interval.startMs,
        endMs: interval.endMs,
        excludeMatchId: matchId,
      });
    }

    const applicant = await this.prisma.user.findUnique({
      where: { id: application.userId },
      select: {
        id: true,
        nickname: true,
        city: true,
        level: true,
        creditScore: true,
      },
    });

    if (!applicant) {
      throw new NotFoundException(`User ${application.userId} not found`);
    }

    const approved = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.matchApplication.update({
        where: { id: applicationId },
        data: {
          status: 'approved',
          decisionReason: null,
        },
      });

      await tx.match.update({
        where: { id: matchId },
        data: {
          openSlots: {
            decrement: 1,
          },
        },
      });

      await tx.chatThreadParticipant.upsert({
        where: {
          threadId_userId: {
            threadId: matchId,
            userId: application.userId,
          },
        },
        update: {
          role: 'member',
        },
        create: {
          threadId: matchId,
          userId: application.userId,
          role: 'member',
          lastReadAt: null,
        },
      });

      await tx.message.create({
        data: {
          userId: application.userId,
          kind: 'system',
          title: '申请已通过',
          content: `你申请的${match.title}已通过，去局内聊天确认到场吧。`,
          senderName: '系统',
          status: 'approved',
          matchId,
        },
      });

      await tx.message.updateMany({
        where: {
          userId: hostUserId,
          matchId,
          senderId: application.userId,
          kind: 'invite',
          status: 'pending',
        },
        data: {
          status: 'approved',
          isRead: true,
        },
      });

      return updated;
    });

    return {
      id: approved.id,
      matchId: approved.matchId,
      userId: approved.userId,
      status: approved.status,
      createdAt: approved.createdAt.toISOString(),
      applicantNickname: applicant.nickname,
      applicantCity: applicant.city,
      applicantLevel: applicant.level,
      applicantCreditScore: applicant.creditScore,
    };
  }

  async rejectApplication(matchId: string, applicationId: string, hostUserId: string, reason?: string) {
    const match = await this.requireHostOwnedMatch(matchId, hostUserId);
    const application = await this.requireApplication(matchId, applicationId);
    const decisionReason = this.getDecisionReason(reason);

    if (application.status !== 'pending') {
      throw new ConflictException(`application ${applicationId} is already ${application.status}`);
    }

    const applicant = await this.prisma.user.findUnique({
      where: { id: application.userId },
      select: {
        id: true,
        nickname: true,
        city: true,
        level: true,
        creditScore: true,
      },
    });

    if (!applicant) {
      throw new NotFoundException(`User ${application.userId} not found`);
    }

    const rejected = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.matchApplication.update({
        where: { id: applicationId },
        data: {
          status: 'rejected',
          decisionReason,
        },
      });

      await tx.message.create({
        data: {
          userId: application.userId,
          kind: 'system',
          title: '申请暂未通过',
          content: decisionReason,
          senderName: '系统',
          status: 'rejected',
          matchId,
        },
      });

      await tx.message.updateMany({
        where: {
          userId: hostUserId,
          matchId,
          senderId: application.userId,
          kind: 'invite',
          status: 'pending',
        },
        data: {
          status: 'rejected',
          isRead: true,
        },
      });

      return updated;
    });

    return {
      id: rejected.id,
      matchId: rejected.matchId,
      userId: rejected.userId,
      status: rejected.status,
      createdAt: rejected.createdAt.toISOString(),
      decisionReason: this.getDecisionReason(rejected.decisionReason),
      applicantNickname: applicant.nickname,
      applicantCity: applicant.city,
      applicantLevel: applicant.level,
      applicantCreditScore: applicant.creditScore,
    };
  }

  async ensureCheckInCode(matchId: string, hostUserId: string) {
    const match = await this.requireHostOwnedMatch(matchId, hostUserId);

    if (match.checkInCode) {
      return { code: match.checkInCode };
    }

    const code = this.generateCheckInCode();
    await this.prisma.match.update({
      where: { id: matchId },
      data: { checkInCode: code },
    });

    return { code };
  }

  async listCheckIns(matchId: string, hostUserId: string) {
    await this.requireHostOwnedMatch(matchId, hostUserId);
    const participants = await this.prisma.chatThreadParticipant.findMany({
      where: { threadId: matchId },
      include: {
        user: {
          select: { id: true, nickname: true, level: true, creditScore: true },
        },
      },
      orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
    });

    return {
      items: participants.map((participant) => ({
        userId: participant.userId,
        nickname: participant.user.nickname,
        level: participant.user.level,
        creditScore: participant.user.creditScore,
        role: participant.role,
        checkedInAt: participant.checkedInAt?.toISOString() ?? null,
      })),
    };
  }

  async checkIn(matchId: string, userId: string, code: string) {
    const match = await this.requireMatch(matchId);

    if (match.status === 'cancelled') {
      throw new ConflictException(`match ${matchId} has been cancelled`);
    }

    if (!match.checkInCode || match.checkInCode !== code.trim().toUpperCase()) {
      throw new ForbiddenException('Invalid check-in code');
    }

    const membership = await this.prisma.chatThreadParticipant.findUnique({
      where: { threadId_userId: { threadId: matchId, userId } },
    });

    if (!membership) {
      throw new ForbiddenException(`User ${userId} is not part of match ${matchId}`);
    }

    if (membership.checkedInAt) {
      return {
        ok: true,
        checkedInAt: membership.checkedInAt.toISOString(),
        alreadyCheckedIn: true,
      };
    }

    const now = new Date();
    await this.prisma.chatThreadParticipant.update({
      where: { threadId_userId: { threadId: matchId, userId } },
      data: { checkedInAt: now },
    });

    return { ok: true, checkedInAt: now.toISOString(), alreadyCheckedIn: false };
  }

  private generateCheckInCode() {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i += 1) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    return result;
  }

  /**
   * Hard-delete a match record + its applications, thread, participants
   * and messages. Restricted to the host. Permitted when:
   *
   *   - the match is already cancelled (cleanup), or
   *   - the match's start time is in the past AND nobody ever joined
   *     (host can clear up stale "no one came" entries)
   *
   * Anything else (live, upcoming, or a completed match with
   * participants whose history we want to preserve) is refused with 409.
   */
  async deleteOwnMatch(matchId: string, hostUserId: string) {
    const match = await this.requireHostOwnedMatch(matchId, hostUserId);
    const memberCount = await this.prisma.chatThreadParticipant.count({
      where: { threadId: matchId, role: 'member' },
    });
    const isAbandoned =
      match.status === 'open' &&
      match.startTime.getTime() < Date.now() &&
      memberCount === 0;
    const isCancelled = match.status === 'cancelled';
    if (!isCancelled && !isAbandoned) {
      throw new ConflictException(
        'match still active: only cancelled or empty-finished matches can be deleted',
      );
    }
    // Delete in a single transaction so we never leave dangling
    // applications/messages pointing at a non-existent match.
    await this.prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({ where: { matchId } });
      await tx.matchApplication.deleteMany({ where: { matchId } });
      await tx.chatThreadParticipant.deleteMany({ where: { threadId: matchId } });
      await tx.chatThread.deleteMany({ where: { matchId } });
      await tx.match.delete({ where: { id: matchId } });
    });
    return { ok: true as const, id: matchId };
  }

  /**
   * Host-only metadata patch. Today scoped to the typed court label
   * (e.g. "3 号台") so the host can fill it in once players arrive.
   * Updates venueName + chatThread.venueName so the chip / message
   * subtitle stay consistent.
   */
  async updateOwnMatch(
    matchId: string,
    hostUserId: string,
    patch: { courtName?: string },
  ) {
    const match = await this.requireHostOwnedMatch(matchId, hostUserId);
    if (match.status === 'cancelled') {
      throw new ConflictException(`match ${matchId} is cancelled`);
    }
    const updates: Record<string, unknown> = {};
    if (patch.courtName !== undefined) {
      const baseVenue = match.venueId
        ? await this.prisma.venue.findUnique({
            where: { id: match.venueId },
            select: { name: true },
          })
        : null;
      const baseName = baseVenue?.name ?? match.venueName.split(' · ')[0];
      const trimmed = patch.courtName.trim();
      updates.venueName = trimmed ? `${baseName} · ${trimmed}` : baseName;
    }
    if (Object.keys(updates).length === 0) {
      return this.mapMatch(match);
    }
    const updated = await this.prisma.$transaction(async (tx) => {
      const next = await tx.match.update({
        where: { id: matchId },
        data: updates,
      });
      if (typeof updates.venueName === 'string') {
        await tx.chatThread
          .update({
            where: { matchId },
            data: { venueName: updates.venueName as string },
          })
          .catch(() => undefined);
      }
      return next;
    });
    return this.mapMatch(updated);
  }

  async cancelMatch(matchId: string, hostUserId: string, reason?: string) {
    const match = await this.requireHostOwnedMatch(matchId, hostUserId);
    return this.cancelMatchInternal(match, reason);
  }

  async cancelMatchAsAdmin(matchId: string, reason?: string) {
    const match = await this.requireMatch(matchId);
    return this.cancelMatchInternal(match, reason);
  }

  private async cancelMatchInternal(match: Match, reason?: string) {
    if (match.status === 'cancelled') {
      throw new ConflictException(`match ${match.id} is already cancelled`);
    }

    if (match.startTime.getTime() <= Date.now()) {
      throw new ConflictException(`match ${match.id} has already started`);
    }

    const cancellationReason =
      reason?.trim() || '主理人取消了这场球局，给你带来的不便请见谅，看看广场上有没有其他可以补位的球局。';

    const participants = await this.prisma.chatThreadParticipant.findMany({
      where: { threadId: match.id },
      select: { userId: true },
    });
    const pendingApplications = await this.prisma.matchApplication.findMany({
      where: { matchId: match.id, status: 'pending' },
      select: { id: true, userId: true },
    });
    const recipientIds = new Set<string>([
      ...participants.map((item) => item.userId),
      ...pendingApplications.map((item) => item.userId),
    ]);
    recipientIds.delete(match.hostUserId);

    const cancelled = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.match.update({
        where: { id: match.id },
        data: { status: 'cancelled', openSlots: 0 },
      });

      await tx.chatThread.updateMany({
        where: { matchId: match.id },
        data: { status: 'cancelled' },
      });

      if (pendingApplications.length) {
        await tx.matchApplication.updateMany({
          where: { matchId: match.id, status: 'pending' },
          data: { status: 'rejected', decisionReason: cancellationReason },
        });
      }

      const messages = [...recipientIds].map((userId) => ({
        userId,
        kind: 'system',
        title: '球局已取消',
        content: `「${match.title}」已取消：${cancellationReason}`,
        senderName: '系统',
        status: 'cancelled',
        matchId: match.id,
      }));

      if (messages.length) {
        await tx.message.createMany({ data: messages });
      }

      return updated;
    });

    return this.mapMatch(cancelled);
  }

  private mapMatch(match: Match) {
    return toMatchCard(match, this.recommendations.score(match.distanceKm, match.matchRate));
  }

  /**
   * Throw 409 if the user already has another match whose [start, end]
   * interval overlaps the candidate one. "Already has" means: host of,
   * or has an approved/pending application to.
   *
   * Cancelled and obviously-past matches are excluded so the user can
   * still re-book the same time slot after disbanding the original.
   *
   * Called from create() and apply() so neither path can land a user
   * in two overlapping matches by accident.
   */
  private async assertNoMatchConflict(args: {
    userId: string;
    startMs: number;
    endMs: number;
    excludeMatchId?: string;
  }) {
    const lookahead = new Date(args.startMs - DEFAULT_MATCH_DURATION_MS);
    const lookbehind = new Date(args.endMs + DEFAULT_MATCH_DURATION_MS);
    // Pull host matches + matches where the user has an active
    // application (pending or approved) in one go.
    const [hosted, applications] = await Promise.all([
      this.prisma.match.findMany({
        where: {
          hostUserId: args.userId,
          status: 'open',
          // Filter window: bound the scan to a ±2h envelope around the
          // candidate so we don't pull the user's full history.
          startTime: { gte: lookahead, lte: lookbehind },
          ...(args.excludeMatchId ? { id: { not: args.excludeMatchId } } : {}),
        },
        include: { slot: { select: { startTime: true, endTime: true } } },
      }),
      this.prisma.matchApplication.findMany({
        where: {
          userId: args.userId,
          status: { in: ['pending', 'approved'] },
          match: {
            status: 'open',
            startTime: { gte: lookahead, lte: lookbehind },
            ...(args.excludeMatchId ? { id: { not: args.excludeMatchId } } : {}),
          },
        },
        include: {
          match: { include: { slot: { select: { startTime: true, endTime: true } } } },
        },
      }),
    ]);

    const candidates = [
      ...hosted.map((match) => ({ match, role: 'host' as const })),
      ...applications.map((app) => ({ match: app.match, role: 'member' as const })),
    ];

    for (const { match, role } of candidates) {
      const otherStart = match.startTime.getTime();
      const otherDuration =
        match.slot && match.slot.endTime > match.slot.startTime
          ? (match.slot.endTime - match.slot.startTime) * 60_000
          : DEFAULT_MATCH_DURATION_MS;
      const otherEnd = otherStart + otherDuration;
      // Standard interval-overlap test: [a, b] overlaps [c, d] iff a < d && c < b.
      if (args.startMs < otherEnd && otherStart < args.endMs) {
        const roleLabel = role === 'host' ? '你发起的' : '你已加入的';
        throw new ConflictException({
          statusCode: 409,
          error: 'Conflict',
          // The FE switches on this code to render a friendly toast and
          // optionally link to the conflicting match.
          message: 'match_time_conflict',
          conflictWith: {
            id: match.id,
            title: match.title,
            startTime: match.startTime.toISOString(),
            role,
            roleLabel,
          },
        });
      }
    }
  }

  /** Resolve [startMs, endMs] for a match using slot if available. */
  private matchInterval(match: { startTime: Date; slot?: { startTime: number; endTime: number } | null }) {
    const startMs = match.startTime.getTime();
    const duration =
      match.slot && match.slot.endTime > match.slot.startTime
        ? (match.slot.endTime - match.slot.startTime) * 60_000
        : DEFAULT_MATCH_DURATION_MS;
    return { startMs, endMs: startMs + duration };
  }

  private async requireMatch(matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException(`Match ${matchId} not found`);
    }

    return match;
  }

  private async requireHostOwnedMatch(matchId: string, hostUserId: string) {
    const match = await this.requireMatch(matchId);

    if (match.hostUserId !== hostUserId) {
      throw new ForbiddenException(`User ${hostUserId} does not host match ${matchId}`);
    }

    return match;
  }

  private async requireApplication(matchId: string, applicationId: string) {
    const application = await this.prisma.matchApplication.findFirst({
      where: {
        id: applicationId,
        matchId,
      },
    });

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found for match ${matchId}`);
    }

    return application;
  }

  private getDecisionReason(reason?: string | null) {
    return reason?.trim() || REJECTED_APPLICATION_REASON;
  }
}
