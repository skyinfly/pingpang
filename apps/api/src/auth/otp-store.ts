import { randomInt } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../common/redis/redis.service';

/**
 * Namespaced OTP storage. Phone and email share the same store but are
 * kept under separate prefixes so a user with both identifiers can have
 * an in-flight code on each channel without one clobbering the other.
 */
type OtpChannel = 'phone' | 'email';
const OTP_PREFIX: Record<OtpChannel, string> = {
  phone: 'otp:phone:',
  email: 'otp:email:',
};
const DEFAULT_TTL_SECONDS = 5 * 60;

@Injectable()
export class OtpStore {
  constructor(private readonly redis: RedisService) {}

  generateCode() {
    return String(randomInt(100_000, 1_000_000));
  }

  async issue(target: string, code: string, ttlSeconds: number = DEFAULT_TTL_SECONDS) {
    await this.issueFor('phone', target, code, ttlSeconds);
  }

  async consume(target: string, code: string) {
    return this.consumeFor('phone', target, code);
  }

  async peek(target: string) {
    return this.peekFor('phone', target);
  }

  /** Channel-aware variants for the email login path. */
  async issueFor(channel: OtpChannel, target: string, code: string, ttlSeconds: number = DEFAULT_TTL_SECONDS) {
    await this.redis.set(`${OTP_PREFIX[channel]}${target}`, code, ttlSeconds);
  }

  async consumeFor(channel: OtpChannel, target: string, code: string) {
    const key = `${OTP_PREFIX[channel]}${target}`;
    const stored = await this.redis.get(key);
    if (!stored || stored !== code) return false;
    await this.redis.delete(key);
    return true;
  }

  async peekFor(channel: OtpChannel, target: string) {
    return this.redis.get(`${OTP_PREFIX[channel]}${target}`);
  }
}
