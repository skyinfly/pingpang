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

  async upsertWechatUser(payload: {
    openId: string;
    unionId?: string;
  }): Promise<SessionUser> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { wechatOpenId: payload.openId },
          payload.unionId ? { wechatUnionId: payload.unionId } : { wechatOpenId: payload.openId },
        ],
      },
    });

    if (existing) {
      // Backfill ids if the row was created by a previous flow that did not
      // know one of them.
      if (!existing.wechatOpenId || (payload.unionId && !existing.wechatUnionId)) {
        return this.prisma.user.update({
          where: { id: existing.id },
          data: {
            wechatOpenId: existing.wechatOpenId ?? payload.openId,
            wechatUnionId: existing.wechatUnionId ?? payload.unionId ?? null,
          },
        }) as Promise<SessionUser>;
      }
      return existing as SessionUser;
    }

    const placeholder = `wx_${payload.openId.slice(0, 6)}${Math.random().toString(36).slice(2, 6)}`;
    return this.prisma.user.create({
      data: {
        wechatOpenId: payload.openId,
        wechatUnionId: payload.unionId ?? null,
        phone: null,
        nickname: `球友${placeholder}`,
        city: '上海',
        level: 'intermediate',
        creditScore: 100,
      },
    }) as Promise<SessionUser>;
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

  async updateOwnProfile(
    userId: string,
    payload: { nickname?: string; city?: string; level?: string; avatarUrl?: string | null },
  ) {
    const data: { nickname?: string; city?: string; level?: string; avatarUrl?: string | null } = {};

    if (payload.nickname !== undefined) {
      data.nickname = payload.nickname.trim();
    }

    if (payload.city !== undefined) {
      data.city = payload.city.trim();
    }

    if (payload.level !== undefined) {
      data.level = payload.level;
    }

    if (payload.avatarUrl !== undefined) {
      const trimmed = typeof payload.avatarUrl === 'string' ? payload.avatarUrl.trim() : '';
      data.avatarUrl = trimmed.length > 0 ? trimmed : null;
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