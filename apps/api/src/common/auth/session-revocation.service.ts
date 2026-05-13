import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import type { SessionTokenPayload } from './app-token';

const BLOCKLIST_PREFIX = 'session-revoke:';
const USER_INVALIDATION_PREFIX = 'session-invalidate-before:';

@Injectable()
export class SessionRevocationService {
  constructor(private readonly redis: RedisService) {}

  async revokeToken(payload: SessionTokenPayload) {
    const now = Math.floor(Date.now() / 1000);
    const ttlSeconds = Math.max(1, payload.exp - now);
    await this.redis.set(`${BLOCKLIST_PREFIX}${payload.jti}`, '1', ttlSeconds);
  }

  async revokeAllForUser(userId: string, validForSeconds: number) {
    const now = Math.floor(Date.now() / 1000);
    await this.redis.set(`${USER_INVALIDATION_PREFIX}${userId}`, String(now), validForSeconds);
  }

  async isRevoked(payload: SessionTokenPayload) {
    if (!payload.jti) {
      return false;
    }

    if (await this.redis.exists(`${BLOCKLIST_PREFIX}${payload.jti}`)) {
      return true;
    }

    const cutoff = await this.redis.get(`${USER_INVALIDATION_PREFIX}${payload.sub}`);

    if (cutoff && Number(cutoff) >= payload.iat) {
      return true;
    }

    return false;
  }
}
