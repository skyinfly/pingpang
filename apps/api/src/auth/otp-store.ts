import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/redis/redis.service';

const OTP_PREFIX = 'otp:phone:';
const DEFAULT_TTL_SECONDS = 5 * 60;

@Injectable()
export class OtpStore {
  constructor(private readonly redis: RedisService) {}

  generateCode() {
    return String(randomInt(100_000, 1_000_000));
  }

  async issue(phone: string, code: string, ttlSeconds: number = DEFAULT_TTL_SECONDS) {
    await this.redis.set(`${OTP_PREFIX}${phone}`, code, ttlSeconds);
  }

  async consume(phone: string, code: string) {
    const key = `${OTP_PREFIX}${phone}`;
    const stored = await this.redis.get(key);

    if (!stored || stored !== code) {
      return false;
    }

    await this.redis.delete(key);
    return true;
  }
}
