import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(userId: string) {
    const [unreadSystemCount, unreadChatCount, pendingInvitesCount] = await Promise.all([
      this.prisma.message.count({
        where: {
          userId,
          kind: 'system',
          isRead: false,
        },
      }),
      this.prisma.message.count({
        where: {
          userId,
          kind: 'chat',
          isRead: false,
        },
      }),
      this.prisma.message.count({
        where: {
          userId,
          kind: 'invite',
          status: 'pending',
        },
      }),
    ]);

    return {
      unreadSystemCount,
      unreadChatCount,
      pendingInvitesCount,
    };
  }
}
