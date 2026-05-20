import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { MatchesService } from '../matches/matches.service';
import { ReportsService } from '../reports/reports.service';

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

function normalizePagination(input: { page?: number; pageSize?: number } = {}) {
  const page = Math.max(1, Math.floor(input.page ?? 1));
  const pageSize = Math.min(200, Math.max(1, Math.floor(input.pageSize ?? 50)));
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
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

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchesService: MatchesService,
    private readonly reportsService: ReportsService,
  ) {}

  listReports(filters: { status?: string; page?: number; pageSize?: number }) {
    return this.reportsService.listReports(filters);
  }

  resolveReport(reportId: string, action: 'reviewed' | 'dismissed') {
    return this.reportsService.resolveReport(reportId, action);
  }

  async listReviews(
    filters: {
      revieweeId?: string;
      reviewerId?: string;
      minScore?: number;
      maxScore?: number;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const where: Prisma.ReviewWhereInput = {};

    if (filters.revieweeId) {
      where.revieweeId = filters.revieweeId;
    }

    if (filters.reviewerId) {
      where.reviewerId = filters.reviewerId;
    }

    if (filters.minScore !== undefined || filters.maxScore !== undefined) {
      where.score = {
        gte: filters.minScore,
        lte: filters.maxScore,
      };
    }

    const { take, skip, page, pageSize } = normalizePagination({
      page: filters.page,
      pageSize: filters.pageSize,
    });

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.review.count({ where }),
    ]);

    const userIds = new Set<string>();
    for (const review of reviews) {
      userIds.add(review.reviewerId);
      userIds.add(review.revieweeId);
    }
    const matchIds = [...new Set(reviews.map((review) => review.matchId))];

    const [users, matches] = await Promise.all([
      userIds.size
        ? this.prisma.user.findMany({
            where: { id: { in: [...userIds] } },
            select: { id: true, nickname: true, phone: true, creditScore: true },
          })
        : Promise.resolve([]),
      matchIds.length
        ? this.prisma.match.findMany({
            where: { id: { in: matchIds } },
            select: { id: true, title: true, venueName: true, startTime: true },
          })
        : Promise.resolve([]),
    ]);

    const userMap = new Map(users.map((user) => [user.id, user]));
    const matchMap = new Map(matches.map((match) => [match.id, match]));

    return {
      items: reviews.map((review) => {
        const reviewer = userMap.get(review.reviewerId);
        const reviewee = userMap.get(review.revieweeId);
        const match = matchMap.get(review.matchId);

        return {
          id: review.id,
          matchId: review.matchId,
          matchTitle: match?.title ?? '已删除球局',
          matchVenueName: match?.venueName ?? '',
          matchStartTime: match?.startTime.toISOString() ?? null,
          reviewerId: review.reviewerId,
          reviewerNickname: reviewer?.nickname ?? '已删除用户',
          reviewerPhone: reviewer?.phone ?? '',
          revieweeId: review.revieweeId,
          revieweeNickname: reviewee?.nickname ?? '已删除用户',
          revieweePhone: reviewee?.phone ?? '',
          revieweeCreditScore: reviewee?.creditScore ?? 0,
          score: review.score,
          tags: review.tags,
          createdAt: review.createdAt.toISOString(),
        };
      }),
      page,
      pageSize,
      total,
    };
  }

  async deleteReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review ${reviewId} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      const reviewee = await tx.user.findUnique({
        where: { id: review.revieweeId },
        select: { creditScore: true },
      });

      await tx.review.delete({ where: { id: reviewId } });

      if (reviewee) {
        // Roll back the credit-score delta the review applied (+1 for >=4, -2 otherwise),
        // clamped to [0, 100] so reversing an already-clamped delta cannot leak out of range.
        const delta = review.score >= 4 ? -1 : 2;
        const nextScore = Math.max(0, Math.min(100, reviewee.creditScore + delta));
        await tx.user.update({
          where: { id: review.revieweeId },
          data: { creditScore: nextScore },
        });
      }
    });

    return { ok: true, id: reviewId };
  }

  async cancelMatch(matchId: string, payload: unknown) {
    const body = payload === undefined || payload === null ? {} : asRecord(payload);
    await this.matchesService.cancelMatchAsAdmin(matchId, optionalString(body.reason));
    return this.getMatchRow(matchId);
  }

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

  async listMatches(filters: { page?: number; pageSize?: number; search?: string } = {}) {
    const { take, skip, page, pageSize } = normalizePagination(filters);
    const search = filters.search?.trim();
    const where: Prisma.MatchWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { venueName: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { level: { contains: search, mode: 'insensitive' } },
            { hostUser: { nickname: { contains: search, mode: 'insensitive' } } },
            { hostUser: { phone: { contains: search } } },
          ],
        }
      : {};

    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where,
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
        take,
        skip,
      }),
      this.prisma.match.count({ where }),
    ]);

    const matchIds = matches.map((match) => match.id);
    const applications = matchIds.length
      ? await this.prisma.matchApplication.findMany({
          where: { matchId: { in: matchIds } },
          select: { matchId: true, status: true },
        })
      : [];
    const countsByMatch = toApplicationCounts(applications);

    return {
      items: matches.map((match) => this.mapMatch(match, countsByMatch.get(match.id))),
      page,
      pageSize,
      total,
    };
  }

  async listUsers(filters: { page?: number; pageSize?: number; search?: string } = {}) {
    const { take, skip, page, pageSize } = normalizePagination(filters);
    const search = filters.search?.trim();
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { nickname: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
            { city: { contains: search, mode: 'insensitive' } },
            { level: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, joinedCounts, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
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
        take,
        skip,
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
      this.prisma.user.count({ where }),
    ]);
    const joinedCountMap = new Map(joinedCounts.map((item) => [item.userId, item._count._all]));

    return {
      items: users.map((user) => this.mapUser(user, joinedCountMap.get(user.id) ?? 0)),
      page,
      pageSize,
      total,
    };
  }

  async listVenues(filters: { page?: number; pageSize?: number; search?: string } = {}) {
    const { take, skip, page, pageSize } = normalizePagination(filters);
    const search = filters.search?.trim();
    const where: Prisma.VenueWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { district: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [venues, total] = await Promise.all([
      this.prisma.venue.findMany({
        where,
        include: this.venueDetailInclude(),
        orderBy: [{ isActive: 'desc' }, { sortOrder: 'asc' }],
        take,
        skip,
      }),
      this.prisma.venue.count({ where }),
    ]);

    return {
      items: venues.map((venue) => this.mapVenue(venue)),
      page,
      pageSize,
      total,
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
      include: this.venueDetailInclude(),
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
      include: this.venueDetailInclude(),
    });

    return this.mapVenue(venue);
  }

  async deleteVenue(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: this.venueDetailInclude(),
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

  async createCourt(venueId: string, payload: unknown) {
    await this.requireVenue(venueId);
    const body = asRecord(payload);
    await this.prisma.venueCourt.create({
      data: {
        venueId,
        name: requiredString(body, 'name'),
        sortOrder: optionalInteger(body.sortOrder) ?? 0,
        isActive: optionalBoolean(body.isActive) ?? true,
      },
    });

    return this.getVenueDetail(venueId);
  }

  async updateCourt(courtId: string, payload: unknown) {
    const existing = await this.prisma.venueCourt.findUnique({ where: { id: courtId } });

    if (!existing) {
      throw new NotFoundException(`Court ${courtId} not found`);
    }

    const body = asRecord(payload);
    await this.prisma.venueCourt.update({
      where: { id: courtId },
      data: {
        name: optionalString(body.name),
        sortOrder: optionalInteger(body.sortOrder),
        isActive: optionalBoolean(body.isActive),
      },
    });

    return this.getVenueDetail(existing.venueId);
  }

  async deleteCourt(courtId: string) {
    const existing = await this.prisma.venueCourt.findUnique({
      where: { id: courtId },
      include: { _count: { select: { matches: true } } },
    });

    if (!existing) {
      throw new NotFoundException(`Court ${courtId} not found`);
    }

    if (existing._count.matches > 0) {
      throw new ConflictException('Cannot delete a court that is used by matches');
    }

    await this.prisma.venueCourt.delete({ where: { id: courtId } });

    return this.getVenueDetail(existing.venueId);
  }

  async createSlot(venueId: string, payload: unknown) {
    await this.requireVenue(venueId);
    const body = asRecord(payload);
    const startTime = this.parseSlotMinutes(body.startTime, 'startTime');
    const endTime = this.parseSlotMinutes(body.endTime, 'endTime');

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be greater than startTime');
    }

    await this.prisma.venueAvailabilitySlot.create({
      data: {
        venueId,
        label: requiredString(body, 'label'),
        startTime,
        endTime,
        sortOrder: optionalInteger(body.sortOrder) ?? 0,
        isActive: optionalBoolean(body.isActive) ?? true,
      },
    });

    return this.getVenueDetail(venueId);
  }

  async updateSlot(slotId: string, payload: unknown) {
    const existing = await this.prisma.venueAvailabilitySlot.findUnique({ where: { id: slotId } });

    if (!existing) {
      throw new NotFoundException(`Slot ${slotId} not found`);
    }

    const body = asRecord(payload);
    const startTime = body.startTime === undefined ? undefined : this.parseSlotMinutes(body.startTime, 'startTime');
    const endTime = body.endTime === undefined ? undefined : this.parseSlotMinutes(body.endTime, 'endTime');
    const nextStart = startTime ?? existing.startTime;
    const nextEnd = endTime ?? existing.endTime;

    if (nextEnd <= nextStart) {
      throw new BadRequestException('endTime must be greater than startTime');
    }

    await this.prisma.venueAvailabilitySlot.update({
      where: { id: slotId },
      data: {
        label: optionalString(body.label),
        startTime,
        endTime,
        sortOrder: optionalInteger(body.sortOrder),
        isActive: optionalBoolean(body.isActive),
      },
    });

    return this.getVenueDetail(existing.venueId);
  }

  async deleteSlot(slotId: string) {
    const existing = await this.prisma.venueAvailabilitySlot.findUnique({
      where: { id: slotId },
      include: { _count: { select: { matches: true } } },
    });

    if (!existing) {
      throw new NotFoundException(`Slot ${slotId} not found`);
    }

    if (existing._count.matches > 0) {
      throw new ConflictException('Cannot delete a slot that is used by matches');
    }

    await this.prisma.venueAvailabilitySlot.delete({ where: { id: slotId } });

    return this.getVenueDetail(existing.venueId);
  }

  private async getVenueDetail(venueId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
      include: this.venueDetailInclude(),
    });

    if (!venue) {
      throw new NotFoundException(`Venue ${venueId} not found`);
    }

    return this.mapVenue(venue);
  }

  private parseSlotMinutes(value: unknown, field: string) {
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < 24 * 60) {
      return value;
    }

    if (typeof value === 'string') {
      const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);

      if (match) {
        const hours = Number(match[1]);
        const minutes = Number(match[2]);

        if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
          return hours * 60 + minutes;
        }
      }
    }

    throw new BadRequestException(`${field} must be an integer minute count or "HH:MM" string`);
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

  async listApplications(status?: string, pagination: { page?: number; pageSize?: number } = {}) {
    const normalizedStatus = status?.trim();
    const where =
      normalizedStatus && ['pending', 'approved', 'rejected'].includes(normalizedStatus)
        ? { status: normalizedStatus }
        : undefined;
    const { take, skip, page, pageSize } = normalizePagination(pagination);

    const [applications, total] = await Promise.all([
      this.prisma.matchApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          match: {
            select: {
              id: true,
              title: true,
              venueName: true,
              startTime: true,
              openSlots: true,
              maxPlayers: true,
              hostUserId: true,
              hostUser: {
                select: {
                  nickname: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.matchApplication.count({ where }),
    ]);

    const applicantIds = [...new Set(applications.map((item) => item.userId))];
    const applicants = applicantIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: applicantIds } },
          select: {
            id: true,
            nickname: true,
            phone: true,
            city: true,
            level: true,
            creditScore: true,
          },
        })
      : [];

    const applicantMap = new Map(applicants.map((item) => [item.id, item]));

    return {
      items: applications.map((item) => ({
        id: item.id,
        matchId: item.matchId,
        userId: item.userId,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
        decisionReason: item.decisionReason ?? undefined,
        matchTitle: item.match.title,
        matchVenueName: item.match.venueName,
        matchStartTime: item.match.startTime.toISOString(),
        matchOpenSlots: item.match.openSlots,
        matchMaxPlayers: item.match.maxPlayers,
        hostUserId: item.match.hostUserId,
        hostNickname: item.match.hostUser.nickname,
        hostPhone: item.match.hostUser.phone,
        applicantNickname: applicantMap.get(item.userId)?.nickname ?? '球友',
        applicantPhone: applicantMap.get(item.userId)?.phone ?? '',
        applicantCity: applicantMap.get(item.userId)?.city ?? '',
        applicantLevel: applicantMap.get(item.userId)?.level ?? '',
        applicantCreditScore: applicantMap.get(item.userId)?.creditScore ?? 0,
      })),
      page,
      pageSize,
      total,
    };
  }

  async approveApplication(applicationId: string) {
    const application = await this.prisma.matchApplication.findUnique({
      where: { id: applicationId },
      include: { match: true },
    });

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    if (application.status !== 'pending') {
      throw new ConflictException(`application ${applicationId} is already ${application.status}`);
    }

    if (application.match.startTime.getTime() <= Date.now()) {
      throw new ConflictException(`match ${application.matchId} has already started`);
    }

    if (application.match.openSlots <= 0) {
      throw new ConflictException(`match ${application.matchId} has no open slots`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.matchApplication.update({
        where: { id: applicationId },
        data: { status: 'approved', decisionReason: null },
      });

      await tx.match.update({
        where: { id: application.matchId },
        data: { openSlots: { decrement: 1 } },
      });

      await tx.chatThreadParticipant.upsert({
        where: {
          threadId_userId: {
            threadId: application.matchId,
            userId: application.userId,
          },
        },
        update: { role: 'member' },
        create: {
          threadId: application.matchId,
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
          content: `你申请的${application.match.title}已通过，去局内聊天确认到场吧。`,
          senderName: '系统',
          status: 'approved',
          matchId: application.matchId,
        },
      });

      await tx.message.updateMany({
        where: {
          userId: application.match.hostUserId,
          matchId: application.matchId,
          senderId: application.userId,
          kind: 'invite',
          status: 'pending',
        },
        data: { status: 'approved', isRead: true },
      });
    });

    return this.listApplications('pending');
  }

  async rejectApplication(applicationId: string, payload: unknown) {
    const application = await this.prisma.matchApplication.findUnique({
      where: { id: applicationId },
      include: { match: { select: { id: true, title: true, hostUserId: true } } },
    });

    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    if (application.status !== 'pending') {
      throw new ConflictException(`application ${applicationId} is already ${application.status}`);
    }

    const body = payload === undefined || payload === null ? {} : asRecord(payload);
    const decisionReason =
      optionalString(body.reason) || '这场球局当前席位更适合其他安排，你可以换个时间段继续约。';

    await this.prisma.$transaction(async (tx) => {
      await tx.matchApplication.update({
        where: { id: applicationId },
        data: { status: 'rejected', decisionReason },
      });

      await tx.message.create({
        data: {
          userId: application.userId,
          kind: 'system',
          title: '申请暂未通过',
          content: decisionReason,
          senderName: '系统',
          status: 'rejected',
          matchId: application.matchId,
        },
      });

      await tx.message.updateMany({
        where: {
          userId: application.match.hostUserId,
          matchId: application.matchId,
          senderId: application.userId,
          kind: 'invite',
          status: 'pending',
        },
        data: { status: 'rejected', isRead: true },
      });
    });

    return this.listApplications('pending');
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
          id: created.id,
          matchId: created.id,
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
          threadId: created.id,
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
      status: string;
      startTime: Date;
      hostUserId: string;
      hostUser: {
        nickname: string;
        phone: string | null;
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
      status: match.status,
      startTime: match.startTime.toISOString(),
      hostUserId: match.hostUserId,
      hostNickname: match.hostUser.nickname,
      hostPhone: match.hostUser.phone ?? '',
      applicationCounts: counts ?? emptyApplicationCounts(),
    };
  }

  private mapUser(
    user: {
      id: string;
      phone: string | null;
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
      phone: user.phone ?? '',
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
    courts: Array<{ id: string; name: string; sortOrder: number; isActive: boolean }>;
    availabilitySlots: Array<{
      id: string;
      label: string;
      startTime: number;
      endTime: number;
      sortOrder: number;
      isActive: boolean;
    }>;
    _count: {
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
      courtCount: venue.courts.length,
      slotCount: venue.availabilitySlots.length,
      matchCount: venue._count.matches,
      courts: venue.courts.map((court) => ({
        id: court.id,
        name: court.name,
        sortOrder: court.sortOrder,
        isActive: court.isActive,
      })),
      slots: venue.availabilitySlots.map((slot) => ({
        id: slot.id,
        label: slot.label,
        startTime: slot.startTime,
        endTime: slot.endTime,
        sortOrder: slot.sortOrder,
        isActive: slot.isActive,
      })),
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

  private venueDetailInclude() {
    return {
      courts: {
        orderBy: [{ isActive: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
      availabilitySlots: {
        orderBy: [{ isActive: 'desc' }, { sortOrder: 'asc' }, { startTime: 'asc' }],
      },
      _count: {
        select: {
          matches: true,
        },
      },
    } satisfies Prisma.VenueInclude;
  }
}
