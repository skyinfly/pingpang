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

  /** Lookup by phone without side effects. Returns null when not registered. */
  async findByPhone(phone: string): Promise<SessionUser | null> {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    return (user as SessionUser) ?? null;
  }

  /** Lookup by email (case-normalized) without side effects. */
  async findByEmail(email: string): Promise<SessionUser | null> {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    return (user as SessionUser) ?? null;
  }

  /**
   * Email registration with a bcrypt password hash. Caller is expected
   * to have already hashed the password — this service only persists,
   * so the AuthService owns the bcrypt cost factor in one place.
   */
  async createEmailUser(payload: {
    email: string;
    passwordHash: string;
    nickname: string;
    city?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<SessionUser> {
    const email = payload.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('email already registered');
    }
    const created = await this.prisma.user.create({
      data: {
        email,
        passwordHash: payload.passwordHash,
        phone: null,
        nickname: payload.nickname.trim(),
        city: (payload.city ?? '上海').trim(),
        level: payload.level ?? 'intermediate',
        creditScore: 100,
      },
      // Explicit select keeps the bcrypt hash off the response — callers
      // never need it, and JSON.stringify on the raw row would happily
      // leak it through to the client.
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        city: true,
        level: true,
        avatarUrl: true,
        creditScore: true,
      },
    });
    return created as SessionUser;
  }

  /**
   * Return the raw user row (incl. passwordHash) for login verification.
   * Separate from findByEmail so the SessionUser type stays clean of the
   * hash, which we never want to leak to callers other than AuthService.
   */
  async findEmailUserForAuth(email: string) {
    const normalized = email.toLowerCase().trim();
    return this.prisma.user.findUnique({
      where: { email: normalized },
      select: {
        id: true,
        email: true,
        phone: true,
        nickname: true,
        city: true,
        level: true,
        avatarUrl: true,
        creditScore: true,
        passwordHash: true,
      },
    });
  }

  /**
   * Create a brand-new user from the registration form. Caller is
   * responsible for verifying the OTP before invoking this — this method
   * only persists the chosen profile. Throws if the phone is already in
   * use so the controller can return a tidy 409 instead of leaking the
   * Prisma unique-constraint error.
   */
  async createPhoneUser(payload: {
    phone: string;
    nickname: string;
    city?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<SessionUser> {
    const existing = await this.prisma.user.findUnique({ where: { phone: payload.phone } });
    if (existing) {
      throw new Error('phone already registered');
    }
    const created = await this.prisma.user.create({
      data: {
        phone: payload.phone,
        nickname: payload.nickname.trim(),
        city: (payload.city ?? '上海').trim(),
        level: payload.level ?? 'intermediate',
        creditScore: 100,
      },
    });
    return created as SessionUser;
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
        avatarUrl: true,
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