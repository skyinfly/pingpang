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