import { ConflictException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DEV_LOGIN_CODE, isDevLoginEnabled } from './dev-auth';
import { UsersService } from '../users/users.service';
import { issueSessionToken } from '../common/auth/app-token';
import { OtpStore } from './otp-store';
import { SMS_PROVIDER_TOKEN } from './sms/sms.module';
import type { SmsProvider } from './sms/sms-provider';
import { WechatClient } from './wechat/wechat-client';

// bcrypt cost factor. 10 is the lowest mainstream-secure setting; benchmarks
// to ~70ms per hash on the target hardware which keeps login responsive.
const BCRYPT_ROUNDS = 10;

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly otpStore: OtpStore,
    private readonly wechatClient: WechatClient,
    @Inject(SMS_PROVIDER_TOKEN) private readonly smsProvider: SmsProvider,
  ) {}

  async loginWithWechat(code: string) {
    const session = await this.wechatClient.exchangeCode(code);
    const user = await this.usersService.upsertWechatUser({
      openId: session.openId,
      unionId: session.unionId,
    });
    return {
      token: issueSessionToken(user),
      user,
    };
  }

  async requestCode(phone: string) {
    const devEnabled = isDevLoginEnabled();
    const code = devEnabled ? DEV_LOGIN_CODE : this.otpStore.generateCode();
    await this.otpStore.issue(phone, code);

    if (devEnabled) {
      // Dev shortcut: return the static code so e2e and manual QA can log in
      // without checking SMS. Production has ALLOW_DEV_LOGIN=false and falls
      // through to the real provider.
      return { ok: true, phone, devCode: code };
    }

    try {
      const result = await this.smsProvider.send(phone, code);
      this.logger.log(
        `OTP issued for ${phone} via ${this.smsProvider.name} (delivered=${result.delivered}, messageId=${result.messageId ?? 'n/a'})`,
      );
    } catch (error) {
      this.logger.error(
        `OTP issue failed for ${phone} via ${this.smsProvider.name}: ${(error as Error).message}`,
      );
      // Re-throw so the client sees a real failure instead of a silent ok.
      throw error;
    }

    return { ok: true, phone };
  }

  /**
   * Phone-code verification with branching behavior:
   *
   * - If the phone is already registered, consume the OTP and return a
   *   normal session.
   * - If not registered, we DO NOT consume the OTP — instead return
   *   `requiresRegistration: true` so the client can route the user to
   *   the register form. The same code is then re-used by /auth/register.
   *
   * This split lets the registration form ask for nickname/city/level
   * without making the user request a second SMS.
   */
  async verifyCode(phone: string, code: string) {
    // Validate the code is at least plausibly correct first, without
    // consuming it, so both branches behave consistently.
    if (!(await this.peekCodeMatches(phone, code))) {
      throw new UnauthorizedException('invalid code');
    }

    const existing = await this.usersService.findByPhone(phone);

    if (!existing) {
      // Leave the code in place; /auth/register will consume it.
      return { requiresRegistration: true as const, phone };
    }

    // Login path: consume the code now.
    await this.consumeCode(phone, code);

    return {
      token: issueSessionToken(existing),
      user: existing,
    };
  }

  /**
   * Finalize registration: re-verify the OTP (and consume it), create the
   * user with the form values, and issue a session token so the client
   * proceeds straight into the app — no second login step.
   */
  async register(payload: {
    phone: string;
    code: string;
    nickname: string;
    city?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
  }) {
    if (!(await this.consumeCode(payload.phone, payload.code))) {
      throw new UnauthorizedException('invalid or expired code');
    }

    try {
      const user = await this.usersService.createPhoneUser({
        phone: payload.phone,
        nickname: payload.nickname,
        city: payload.city,
        level: payload.level,
      });
      return {
        token: issueSessionToken(user),
        user,
      };
    } catch (error) {
      // Race: someone else registered between verify and register.
      if ((error as Error).message === 'phone already registered') {
        throw new ConflictException('phone already registered');
      }
      throw error;
    }
  }

  /**
   * Read-only check that the OTP for `phone` equals `code`. Used by the
   * verify path so we can branch on existing-user without consuming the
   * code. In dev (ALLOW_DEV_LOGIN=true) the static DEV_LOGIN_CODE always
   * matches so e2e and manual QA still work end-to-end.
   */
  private async peekCodeMatches(phone: string, code: string) {
    if (isDevLoginEnabled() && code === DEV_LOGIN_CODE) return true;
    const stored = await this.otpStore.peek(phone);
    return stored !== null && stored === code;
  }

  /**
   * Consume the OTP. Returns false if the code is invalid/expired so the
   * caller can react without throwing. Dev shortcut is always accepted.
   */
  private async consumeCode(phone: string, code: string) {
    if (isDevLoginEnabled() && code === DEV_LOGIN_CODE) {
      // Drop any stale OTP under this key so the next request gets a fresh slate.
      await this.otpStore.consume(phone, code).catch(() => undefined);
      return true;
    }
    return this.otpStore.consume(phone, code);
  }

  // ---------------------------------------------------------------------
  //  Email + password auth (H5 primary channel). No OTP — H5 can't get an
  //  SMS reliably and email-code delivery adds latency without security
  //  benefit. We use bcrypt-hashed passwords and a single round-trip per
  //  action.
  // ---------------------------------------------------------------------

  async registerEmailPassword(payload: {
    email: string;
    password: string;
    nickname: string;
    city?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
  }) {
    const email = normalizeEmail(payload.email);
    const passwordHash = await bcrypt.hash(payload.password, BCRYPT_ROUNDS);
    try {
      const user = await this.usersService.createEmailUser({
        email,
        passwordHash,
        nickname: payload.nickname,
        city: payload.city,
        level: payload.level,
      });
      return { token: issueSessionToken(user), user };
    } catch (error) {
      if ((error as Error).message === 'email already registered') {
        throw new ConflictException('email already registered');
      }
      throw error;
    }
  }

  async loginEmailPassword(payload: { email: string; password: string }) {
    const email = normalizeEmail(payload.email);
    const row = await this.usersService.findEmailUserForAuth(email);

    // Trade-off note: returning distinct "user not found" vs "wrong
    // password" responses is friendlier UX but lets a hostile caller
    // enumerate registered emails by spraying random ones. The product
    // wants the friendlier copy on the H5, so we ship it — but still
    // run bcrypt.compare in BOTH branches so the response timing is
    // similar enough that someone can't enumerate by stopwatch alone.
    if (!row || !row.passwordHash) {
      const fakeHash = '$2b$10$abcdefghijklmnopqrstuuusEhT0pLB7nWBN8sBHvDmJh.7HRdC4eW';
      await bcrypt.compare(payload.password, fakeHash);
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'user_not_found',
      });
    }

    const ok = await bcrypt.compare(payload.password, row.passwordHash);
    if (!ok) {
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'invalid_password',
      });
    }

    const { passwordHash: _ignore, ...user } = row;
    return { token: issueSessionToken(user), user };
  }
}
