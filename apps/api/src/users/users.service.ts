import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { buildDevUserData, type SessionUser } from '../auth/dev-auth';
import { verifySessionToken } from '../common/auth/app-token';
import { SessionRevocationService } from '../common/auth/session-revocation.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionRevocation: SessionRevocationService,
  ) {}

  async upsertDevUser(phone: string): Promise<SessionUser> {
    return this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: buildDevUserData(phone),
    });
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        city: true,
        level: true,
        creditScore: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const [hostedCount, joinedCount] = await Promise.all([
      this.prisma.match.count({ where: { hostUserId: userId } }),
      this.prisma.chatThreadParticipant.count({ where: { userId, role: 'member' } }),
    ]);

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      hostedMatches: hostedCount,
      joinedMatches: joinedCount,
    };
  }

  async updateOwnProfile(userId: string, payload: { nickname?: string; city?: string; level?: string }) {
    const data: { nickname?: string; city?: string; level?: string } = {};

    if (payload.nickname !== undefined) {
      data.nickname = payload.nickname.trim();
    }

    if (payload.city !== undefined) {
      data.city = payload.city.trim();
    }

    if (payload.level !== undefined) {
      data.level = payload.level;
    }

    if (Object.keys(data).length === 0) {
      return this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    }

    return this.prisma.user.update({ where: { id: userId }, data });
  }

  async getProfileByToken(token: string): Promise<SessionUser> {
    const session = verifySessionToken(token);

    if (await this.sessionRevocation.isRevoked(session)) {
      throw new UnauthorizedException('session has been revoked');
    }

    const user = await this.prisma.user.findUnique({ where: { id: session.sub } });

    if (!user) {
      throw new NotFoundException(`User ${session.sub} not found`);
    }

    return user;
  }

  async revokeCurrentSession(token: string) {
    const session = verifySessionToken(token);
    await this.sessionRevocation.revokeToken(session);
    return { ok: true };
  }
}