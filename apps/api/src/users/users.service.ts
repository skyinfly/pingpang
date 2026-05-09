import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { buildDevUserData, type SessionUser } from '../auth/dev-auth';
import { verifySessionToken } from '../common/auth/app-token';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertDevUser(phone: string): Promise<SessionUser> {
    return this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: buildDevUserData(phone),
    });
  }

  async getProfileByToken(token: string): Promise<SessionUser> {
    const session = verifySessionToken(token);
    const user = await this.prisma.user.findUnique({ where: { id: session.sub } });

    if (!user) {
      throw new NotFoundException(`User ${session.sub} not found`);
    }

    return user;
  }
}