import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import type { SessionUser } from '../auth/dev-auth';

type ThreadRecord = {
  id: string;
  matchId: string;
  title: string;
  venueName: string;
  scheduledAt: Date;
  hostUserId: string;
  status: string;
  latestMessagePreview: string;
  latestMessageAt: Date;
  lastMessageSenderId: string | null;
  lastMessageSenderName: string | null;
};

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string, filters: { kind?: string; matchId?: string } = {}) {
    const items = await this.prisma.message.findMany({
      where: {
        userId,
        ...(filters.kind ? { kind: filters.kind } : {}),
        ...(filters.matchId ? { matchId: filters.matchId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      items: items.map((item) => this.toMessagePreview(item)),
    };
  }

  async create(payload: {
    userId: string;
    kind: string;
    title: string;
    content: string;
    senderId?: string;
    senderName?: string;
    status?: string;
    matchId?: string;
    threadId?: string;
  }) {
    const created = await this.prisma.message.create({
      data: payload,
    });

    return this.toMessagePreview(created);
  }

  async markRead(payload: { userId: string; kind?: string; matchId?: string }) {
    const result = await this.prisma.message.updateMany({
      where: {
        userId: payload.userId,
        isRead: false,
        ...(payload.kind ? { kind: payload.kind } : {}),
        ...(payload.matchId ? { matchId: payload.matchId } : {}),
      },
      data: { isRead: true },
    });

    return {
      updatedCount: result.count,
    };
  }

  async listThreads(userId: string, filters: { status?: string } = {}) {
    const normalizedStatus = filters.status?.trim();
    const threadStatusFilter =
      normalizedStatus && ['active', 'cancelled'].includes(normalizedStatus)
        ? { status: normalizedStatus }
        : undefined;

    const memberships = await this.prisma.chatThreadParticipant.findMany({
      where: {
        userId,
        ...(threadStatusFilter ? { thread: threadStatusFilter } : {}),
      },
      include: {
        thread: true,
      },
      orderBy: {
        thread: {
          latestMessageAt: 'desc',
        },
      },
    });

    const items = await Promise.all(
      memberships.map(async (membership) => {
        const [participantCount, unreadCount] = await Promise.all([
          this.prisma.chatThreadParticipant.count({ where: { threadId: membership.threadId } }),
          this.prisma.message.count({
            where: {
              userId,
              threadId: membership.threadId,
              kind: 'chat',
              isRead: false,
            },
          }),
        ]);

        return this.toThreadSummary(membership.thread, {
          participantCount,
          unreadCount,
          lastReadAt: membership.lastReadAt,
        });
      }),
    );

    return { items };
  }

  async getThreadDetail(userId: string, threadId: string) {
    const membership = await this.requireParticipant(threadId, userId);
    const [participants, participantCount, unreadCount] = await Promise.all([
      this.prisma.chatThreadParticipant.findMany({
        where: { threadId },
        include: { user: true },
        orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
      }),
      this.prisma.chatThreadParticipant.count({ where: { threadId } }),
      this.prisma.message.count({
        where: {
          userId,
          threadId,
          kind: 'chat',
          isRead: false,
        },
      }),
    ]);

    return {
      thread: this.toThreadSummary(membership.thread, {
        participantCount,
        unreadCount,
        lastReadAt: membership.lastReadAt,
      }),
      participants: participants.map((participant) => ({
        userId: participant.userId,
        nickname: participant.user.nickname,
        city: participant.user.city,
        level: participant.user.level,
        creditScore: participant.user.creditScore,
        role: participant.role,
        joinedAt: participant.joinedAt.toISOString(),
        lastReadAt: participant.lastReadAt?.toISOString() ?? null,
      })),
    };
  }

  async listThreadMessages(userId: string, threadId: string) {
    await this.requireParticipant(threadId, userId);

    const [participantCount, items] = await Promise.all([
      this.prisma.chatThreadParticipant.count({ where: { threadId } }),
      this.prisma.message.findMany({
        where: {
          userId,
          threadId,
          kind: 'chat',
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      participantCount,
      items: items.map((item) => this.toMessagePreview(item)),
    };
  }

  async createThreadMessage(threadId: string, sender: SessionUser, content: string) {
    const membership = await this.requireParticipant(threadId, sender.id);

    if (membership.thread.status === 'cancelled') {
      throw new ConflictException(`thread ${threadId} is cancelled`);
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const participants = await tx.chatThreadParticipant.findMany({
        where: { threadId },
      });

      let senderCopy: Awaited<ReturnType<typeof tx.message.create>> | null = null;

      for (const participant of participants) {
        const createdMessage = await tx.message.create({
          data: {
            userId: participant.userId,
            kind: 'chat',
            title: membership.thread.title,
            content,
            senderId: sender.id,
            senderName: sender.nickname,
            matchId: membership.thread.matchId,
            threadId,
            isRead: false,
          },
        });

        if (participant.userId === sender.id) {
          senderCopy = createdMessage;
        }
      }

      await tx.chatThread.update({
        where: { id: threadId },
        data: {
          latestMessagePreview: content,
          latestMessageAt: new Date(),
          lastMessageSenderId: sender.id,
          lastMessageSenderName: sender.nickname,
        },
      });

      if (!senderCopy) {
        throw new NotFoundException(`Sender copy for thread ${threadId} not found`);
      }

      return senderCopy;
    });

    return {
      ...this.toMessagePreview(created),
      threadId,
    };
  }

  async markThreadRead(payload: { userId: string; threadId: string }) {
    const membership = await this.requireParticipant(payload.threadId, payload.userId);
    const lastReadAt = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedMessages = await tx.message.updateMany({
        where: {
          userId: payload.userId,
          threadId: payload.threadId,
          kind: 'chat',
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      await tx.chatThreadParticipant.update({
        where: {
          threadId_userId: {
            threadId: membership.threadId,
            userId: payload.userId,
          },
        },
        data: {
          lastReadAt,
        },
      });

      return updatedMessages;
    });

    return {
      threadId: payload.threadId,
      updatedCount: result.count,
      lastReadAt: lastReadAt.toISOString(),
    };
  }

  private async requireParticipant(threadId: string, userId: string) {
    const membership = await this.prisma.chatThreadParticipant.findUnique({
      where: {
        threadId_userId: {
          threadId,
          userId,
        },
      },
      include: {
        thread: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException(`User ${userId} is not a participant of thread ${threadId}`);
    }

    return membership;
  }

  private toThreadSummary(
    thread: ThreadRecord,
    state: { participantCount: number; unreadCount: number; lastReadAt: Date | null },
  ) {
    return {
      id: thread.id,
      matchId: thread.matchId,
      title: thread.title,
      venueName: thread.venueName,
      scheduledAt: thread.scheduledAt.toISOString(),
      hostUserId: thread.hostUserId,
      status: thread.status,
      latestMessagePreview: thread.latestMessagePreview,
      latestMessageAt: thread.latestMessageAt.toISOString(),
      lastMessageSenderId: thread.lastMessageSenderId,
      lastMessageSenderName: thread.lastMessageSenderName,
      unreadCount: state.unreadCount,
      participantCount: state.participantCount,
      lastReadAt: state.lastReadAt?.toISOString() ?? null,
    };
  }

  private toMessagePreview(item: {
    id: string;
    kind: string;
    title: string;
    content: string;
    senderId: string | null;
    senderName: string | null;
    isRead: boolean;
    status: string | null;
    matchId: string | null;
    threadId?: string | null;
    createdAt: Date;
  }) {
    return {
      id: item.id,
      kind: item.kind,
      title: item.title,
      content: item.content,
      senderId: item.senderId,
      senderName: item.senderName,
      isRead: item.isRead,
      status: item.status,
      matchId: item.matchId,
      threadId: item.threadId ?? null,
      createdAt: item.createdAt.toISOString(),
    };
  }
}