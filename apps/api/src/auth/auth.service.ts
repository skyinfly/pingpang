import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DEV_LOGIN_CODE, isDevLoginEnabled } from './dev-auth';
import { UsersService } from '../users/users.service';
import { issueSessionToken } from '../common/auth/app-token';
import { OtpStore } from './otp-store';
import { SMS_PROVIDER_TOKEN } from './sms/sms.module';
import type { SmsProvider } from './sms/sms-provider';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly otpStore: OtpStore,
    @Inject(SMS_PROVIDER_TOKEN) private readonly smsProvider: SmsProvider,
  ) {}

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

  async verifyCode(phone: string, code: string) {
    const devEnabled = isDevLoginEnabled();
    const devShortcut = devEnabled && code === DEV_LOGIN_CODE;
    const accepted = devShortcut ? true : await this.otpStore.consume(phone, code);

    if (!accepted) {
      throw new UnauthorizedException('invalid code');
    }

    if (devShortcut) {
      // Drop any matching OTP that may still be sitting in the store so a dev
      // login does not leave a stale code behind for the next request.
      await this.otpStore.consume(phone, code).catch(() => undefined);
    }

    const user = await this.usersService.upsertDevUser(phone);

    return {
      token: issueSessionToken(user),
      user,
    };
  }
}
