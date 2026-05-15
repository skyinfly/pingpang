import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  getHealth() {
    return { status: 'ok', service: 'pingpang-api' };
  }

  @Get('live')
  live() {
    // Liveness probe: container is not deadlocked. Cheap, no I/O.
    return { status: 'live', service: 'pingpang-api' };
  }

  @Get('ready')
  async ready() {
    // Readiness probe: dependencies are reachable. K8s should NOT route
    // traffic to a pod that fails this.
    const checks: Record<string, { ok: boolean; detail?: string }> = {
      db: { ok: false },
      redis: { ok: false },
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.db.ok = true;
    } catch (error) {
      checks.db.detail = (error as Error).message;
    }

    try {
      checks.redis = { ok: true, detail: this.redis.getStatus() };
    } catch (error) {
      checks.redis = { ok: false, detail: (error as Error).message };
    }

    const allOk = Object.values(checks).every((entry) => entry.ok);

    if (!allOk) {
      throw new ServiceUnavailableException({ status: 'unhealthy', checks });
    }

    return { status: 'ready', checks };
  }
}
