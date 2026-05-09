import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';

type ApplicationCounts = {
  pending: number;
  approved: number;
  rejected: number;
};

function emptyApplicationCounts(): ApplicationCounts {
  return {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
}

function toApplicationCounts(items: Array<{ matchId: string; status: string }>) {
  const counts = new Map<string, ApplicationCounts>();

  for (const item of items) {
    const current = counts.get(item.matchId) ?? emptyApplicationCounts();

    if (item.status === 'pending' || item.status === 'approved' || item.status === 'rejected') {
      current[item.status] += 1;
    }

    counts.set(item.matchId, current);
  }

  return counts;
}

function asRecord(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BadRequestException('Invalid request body');
  }

  return value as Record<string, unknown>;
}

function optionalString(value: unknown) {
  return typeof value === 'string' ? value.trim() : undefined;
}

function requiredString(body: Record<string, unknown>, key: string) {
  const value = optionalString(body[key]);

  if (!value) {
    throw new BadRequestException(`${key} is required`);
  }

  return value;
}

function optionalPositiveNumber(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new BadRequestException('Expected a positive number');
  }

  return parsed;
}

function optionalInteger(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new BadRequestException('Expected an integer');
  }

  return parsed;
}

function optionalBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

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

  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00+08:00`);
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [users, matches, pendingApplications, activeVenues, unreadMessages, reviews] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.match.count(),
      this.prisma.matchApplication.count({ where: { status: 'pending' } }),
      this.prisma.venue.count({ where: { isActive: true } }),
      this.prisma.message.count({ where: { isRead: false } }),
      this.prisma.review.count(),
    ]);

    return {
      users,
      matches,
      pendingApplications,
      activeVenues,
      unreadMessages,
      reviews,
    };
  }

  async listMatches() {
    const [matches, applications] = await Promise.all([
      this.prisma.match.findMany({
        include: {
          hostUser: {
            select: {
              nickname: true,
              phone: true,
            },
          },
        },
        orderBy: {
          startTime: 'desc',
        },
      }),
      this.prisma.matchApplication.findMany({
        select: {
          matchId: true,
          status: true,
        },
      }),
    ]);
    const countsByMatch = toApplicationCounts(applications);

    return {
      items: matches.map((match) => this.mapMatch(match, countsByMatch.get(match.id))),
    };
  }

  async listUsers() {
    const [users, joinedCounts] = await Promise.all([
      this.prisma.user.findMany({
        include: {
          _count: {
            select: {
              hostedMatches: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.chatThreadParticipant.groupBy({
        by: ['userId'],
        where: {
          role: 'member',
        },
        _count: {
          _all: true,
        },
      }),
    ]);
    const joinedCountMap = new Map(joinedCounts.map((item) => [item.userId, item._count._all]));

    return {
      items: users.map((user) => this.mapUser(user, joinedCountMap.get(user.id) ?? 0)),
    };
  }

  async listVenues() {
    const venues = await this.prisma.venue.findMany({
      include: {
        _count: {
          select: {
            courts: true,
            availabilitySlots: true,
            matches: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { sortOrder: 'asc' }],
    });

    return {
      items: venues.map((venue) => this.mapVenue(venue)),
    };
  }

  async createVenue(payload: unknown) {
    const body = asRecord(payload);
    const venue = await this.prisma.venue.create({
      data: {
        name: requiredString(body, 'name'),
        city: requiredString(body, 'city'),
        district: optionalString(body.district) ?? null,
        distanceKm: optionalPositiveNumber(body.distanceKm) ?? 0,
        isActive: optionalBoolean(body.isActive) ?? true,
      },
      include: this.venueCountsInclude(),
    });

    return this.mapVenue(venue);
  }

  async updateVenue(id: string, payload: unknown) {
    await this.requireVenue(id);
    const body = asRecord(payload);
    const venue = await this.prisma.venue.update({
      where: { id },
      data: {
        name: optionalString(body.name),
        city: optionalString(body.city),
        district: body.district === null ? null : optionalString(body.district),
        distanceKm: optionalPositiveNumber(body.distanceKm),
        isActive: optionalBoolean(body.isActive),
      },
      include: this.venueCountsInclude(),
    });

    return this.mapVenue(venue);
  }

  async deleteVenue(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: this.venueCountsInclude(),
    });

    if (!venue) {
      throw new NotFoundException(`Venue ${id} not found`);
    }

    if (venue._count.matches > 0) {
      throw new ConflictException('Cannot delete a venue that is used by matches');
    }

    await this.prisma.venue.delete({ where: { id } });

    return { ok: true, id };
  }

  async createUser(payload: unknown) {
    const body = asRecord(payload);

    try {
      const user = await this.prisma.user.create({
        data: {
          phone: requiredString(body, 'phone'),
          nickname: requiredString(body, 'nickname'),
          city: requiredString(body, 'city'),
          level: requiredString(body, 'level'),
          creditScore: optionalInteger(body.creditScore) ?? 100,
        },
        include: this.userCountsInclude(),
      });

      return this.mapUser(user, 0);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Phone already exists');
      }

      throw error;
    }
  }

  async updateUser(id: string, payload: unknown) {
    await this.requireUser(id);
    const body = asRecord(payload);
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        phone: optionalString(body.phone),
        nickname: optionalString(body.nickname),
        city: optionalString(body.city),
        level: optionalString(body.level),
        creditScore: optionalInteger(body.creditScore),
      },
      include: this.userCountsInclude(),
    });
    const joinedMatches = await this.prisma.chatThreadParticipant.count({
      where: { userId: id, role: 'member' },
    });

    return this.mapUser(user, joinedMatches);
  }

  async deleteUser(id: string) {
    await this.requireUser(id);
    const [hostedMatches, joinedMatches, reviews, messages] = await Promise.all([
      this.prisma.match.count({ where: { hostUserId: id } }),
      this.prisma.chatThreadParticipant.count({ where: { userId: id } }),
      this.prisma.review.count({ where: { OR: [{ reviewerId: id }, { revieweeId: id }] } }),
      this.prisma.message.count({ where: { OR: [{ userId: id }, { senderId: id }] } }),
    ]);

    if (hostedMatches + joinedMatches + reviews + messages > 0) {
      throw new ConflictException('Cannot delete a user with existing activity');
    }

    await this.prisma.matchApplication.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });

    return { ok: true, id };
  }

  async createMatch(payload: unknown) {
    const body = asRecord(payload);
    const title = requiredString(body, 'title');
    const hostUserId = requiredString(body, 'hostUserId');
    const venueId = requiredString(body, 'venueId');
    const courtId = requiredString(body, 'courtId');
    const slotId = requiredString(body, 'slotId');
    const level = requiredString(body, 'level');
    const maxPlayers = optionalInteger(body.maxPlayers) ?? 4;
    const id = `match-admin-${Date.now()}`;

    const match = await this.prisma.$transaction(async (tx) => {
      const venue = await tx.venue.findFirst({
        where: { id: venueId, isActive: true },
      });
      const court = await tx.venueCourt.findFirst({
        where: { id: courtId, venueId, isActive: true },
      });
      const slot = await tx.venueAvailabilitySlot.findFirst({
        where: { id: slotId, venueId, isActive: true },
      });
      const host = await tx.user.findUnique({ where: { id: hostUserId } });

      if (!venue) {
        throw new NotFoundException(`Active venue ${venueId} not found`);
      }

      if (!court) {
        throw new NotFoundException(`Active court ${courtId} not found`);
      }

      if (!slot) {
        throw new NotFoundException(`Active slot ${slotId} not found`);
      }

      if (!host) {
        throw new NotFoundException(`User ${hostUserId} not found`);
      }

      const created = await tx.match.create({
        data: {
          id,
          title,
          venueName: `${venue.name} ${court.name}`,
          venueId,
          courtId,
          slotId,
          startTime: buildShanghaiSlotDate(slot.startTime),
          city: venue.city,
          level,
          maxPlayers,
          openSlots: Math.max(maxPlayers - 1, 0),
          hostUserId,
          hostCreditScore: host.creditScore,
          distanceKm: venue.distanceKm,
          matchRate: 80,
        },
      });

      await tx.chatThread.create({
        data: {
          id,
          matchId: id,
          title,
          venueName: created.venueName,
          scheduledAt: created.startTime,
          hostUserId,
          latestMessagePreview: '后台已创建球局，请及时确认场地与人员安排',
          latestMessageAt: new Date(),
          lastMessageSenderId: host.id,
          lastMessageSenderName: host.nickname,
        },
      });

      await tx.chatThreadParticipant.create({
        data: {
          threadId: id,
          userId: hostUserId,
          role: 'host',
          lastReadAt: new Date(),
        },
      });

      return created;
    });

    return this.getMatchRow(match.id);
  }

  async updateMatch(id: string, payload: unknown) {
    const current = await this.requireMatch(id);
    const body = asRecord(payload);
    const nextMaxPlayers = optionalInteger(body.maxPlayers);
    const occupiedPlayers = current.maxPlayers - current.openSlots;

    if (nextMaxPlayers !== undefined && nextMaxPlayers < occupiedPlayers) {
      throw new ConflictException('Cannot set max players below occupied seats');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const match = await tx.match.update({
        where: { id },
        data: {
          title: optionalString(body.title),
          level: optionalString(body.level),
          maxPlayers: nextMaxPlayers,
          openSlots: nextMaxPlayers === undefined ? undefined : Math.max(nextMaxPlayers - occupiedPlayers, 0),
        },
      });

      if (body.title !== undefined) {
        await tx.chatThread.updateMany({
          where: { matchId: id },
          data: {
            title: match.title,
          },
        });
      }

      return match;
    });

    return this.getMatchRow(updated.id);
  }

  async deleteMatch(id: string) {
    await this.requireMatch(id);

    await this.prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({ where: { matchId: id } });
      await tx.message.deleteMany({ where: { matchId: id } });
      await tx.matchApplication.deleteMany({ where: { matchId: id } });
      await tx.chatThread.deleteMany({ where: { matchId: id } });
      await tx.match.delete({ where: { id } });
    });

    return { ok: true, id };
  }

  private async getMatchRow(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        hostUser: {
          select: {
            nickname: true,
            phone: true,
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    const applications = await this.prisma.matchApplication.findMany({
      where: { matchId: id },
      select: { matchId: true, status: true },
    });

    return this.mapMatch(match, toApplicationCounts(applications).get(id));
  }

  private async requireMatch(id: string) {
    const match = await this.prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    return match;
  }

  private async requireUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  private async requireVenue(id: string) {
    const venue = await this.prisma.venue.findUnique({ where: { id } });

    if (!venue) {
      throw new NotFoundException(`Venue ${id} not found`);
    }

    return venue;
  }

  private mapMatch(
    match: {
      id: string;
      title: string;
      venueName: string;
      city: string;
      level: string;
      maxPlayers: number;
      openSlots: number;
      startTime: Date;
      hostUserId: string;
      hostUser: {
        nickname: string;
        phone: string;
      };
    },
    counts?: ApplicationCounts,
  ) {
    return {
      id: match.id,
      title: match.title,
      venueName: match.venueName,
      city: match.city,
      level: match.level,
      maxPlayers: match.maxPlayers,
      openSlots: match.openSlots,
      startTime: match.startTime.toISOString(),
      hostUserId: match.hostUserId,
      hostNickname: match.hostUser.nickname,
      hostPhone: match.hostUser.phone,
      applicationCounts: counts ?? emptyApplicationCounts(),
    };
  }

  private mapUser(
    user: {
      id: string;
      phone: string;
      nickname: string;
      city: string;
      level: string;
      creditScore: number;
      createdAt: Date;
      _count: {
        hostedMatches: number;
      };
    },
    joinedMatches: number,
  ) {
    return {
      id: user.id,
      phone: user.phone,
      nickname: user.nickname,
      city: user.city,
      level: user.level,
      creditScore: user.creditScore,
      createdAt: user.createdAt.toISOString(),
      hostedMatches: user._count.hostedMatches,
      joinedMatches,
    };
  }

  private mapVenue(venue: {
    id: string;
    name: string;
    city: string;
    district: string | null;
    distanceKm: number;
    isActive: boolean;
    _count: {
      courts: number;
      availabilitySlots: number;
      matches: number;
    };
  }) {
    return {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      district: venue.district,
      distanceKm: venue.distanceKm,
      isActive: venue.isActive,
      courtCount: venue._count.courts,
      slotCount: venue._count.availabilitySlots,
      matchCount: venue._count.matches,
    };
  }

  private userCountsInclude() {
    return {
      _count: {
        select: {
          hostedMatches: true,
        },
      },
    } as const;
  }

  private venueCountsInclude() {
    return {
      _count: {
        select: {
          courts: true,
          availabilitySlots: true,
          matches: true,
        },
      },
    } as const;
  }
}
