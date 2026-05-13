import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Match } from '../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { toMatchCard } from './matches.mapper';

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

const REJECTED_APPLICATION_REASON = '这场球局当前席位更适合其他安排，你可以换个时间段继续约。';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recommendations: RecommendationsService,
  ) {}

  async list(filters?: { city?: string; level?: string }) {
    const items = await this.prisma.match.findMany({
      where: {
        city: filters?.city || undefined,
        level: filters?.level || undefined,
        status: 'open',
        openSlots: { gt: 0 },
        startTime: { gt: new Date() },
      },
      orderBy: { startTime: 'asc' },
    });

    return {
      items: items
        .map((item) => this.mapMatch(item))
        .sort((a, b) => b.score - a.score),
    };
  }

  async getById(id: string) {
    const match = await this.prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match ${id} not found`);
    }

    return this.mapMatch(match);
  }

  async listMine(hostUserId: string) {
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
        },
      });

      if (!venue) {
        throw new NotFoundException(`Active venue ${payload.venueId} not found`);
      }

      const court = await tx.venueCourt.findFirst({
        where: {
          id: payload.courtId,
          venueId: venue.id,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (!court) {
        throw new NotFoundException(`Active court ${payload.courtId} not found for venue ${venue.id}`);
      }

      const slot = await tx.venueAvailabilitySlot.findFirst({
        where: {
          id: payload.slotId,
          venueId: venue.id,
          isActive: true,
        },
        select: {
          id: true,
          label: true,
          startTime: true,
          endTime: true,
        },
      });

      if (!slot) {
        throw new NotFoundException(`Active slot ${payload.slotId} not found for venue ${venue.id}`);
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
      const scheduledStartTime = buildShanghaiSlotDate(slot.startTime);

      const match = await tx.match.create({
        data: {
          title: payload.title,
          venueName: `${venue.name} ${court.name}`,
          venueId: venue.id,
          courtId: court.id,
          slotId: slot.id,
          startTime: scheduledStartTime,
          city: venue.city,
          level: payload.level,
          maxPlayers: payload.maxPlayers,
          openSlots: Math.max(payload.maxPlayers - 1, 0),
          hostUserId,
          hostCreditScore: hostUser.creditScore,
          distanceKm: venue.distanceKm,
          matchRate,
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

    return this.mapMatch(createdMatch);
  }

  async apply(id: string, userId: string) {
    const match = await this.prisma.match.findUnique({ where: { id } });

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
