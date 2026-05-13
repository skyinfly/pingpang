import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DEV_LOGIN_CODE, isDevLoginEnabled } from './dev-auth';
import { UsersService } from '../users/users.service';
import { issueSessionToken } from '../common/auth/app-token';
import { OtpStore } from './otp-store';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly otpStore: OtpStore,
  ) {}

  async requestCode(phone: string) {
    const devEnabled = isDevLoginEnabled();
    const code = devEnabled ? DEV_LOGIN_CODE : this.otpStore.generateCode();
    await this.otpStore.issue(phone, code);

    if (!devEnabled) {
      // Production path: the OTP needs to leave the process via an SMS / WeChat
      // provider. We log instead of returning the code so the route stays safe
      // to expose. Wire a real provider here (see docs/otp-provider.md).
      this.logger.log(`OTP issued for ${phone}`);
      return { ok: true, phone };
    }

    return { ok: true, phone, devCode: code };
  }

  async verifyCode(phone: string, code: string) {
    const devEnabled = isDevLoginEnabled();
    const devShortcut = devEnabled && code === DEV_LOGIN_CODE;
    const accepted = devShortcut ? true : await this.otpStore.consume(phone, code);

    if (!accepted) {
      throw new UnauthorizedException('invalid code');
    }

    if (devShortcut) {
      // Consume any matching OTP that may also be stored so a dev login does
      // not leave a stale code around for the next request.
      await this.otpStore.consume(phone, code).catch(() => undefined);
    }

    const user = await this.usersService.upsertDevUser(phone);

    return {
      token: issueSessionToken(user),
      user,
    };
  }
}
