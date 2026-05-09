import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DEV_LOGIN_CODE } from './dev-auth';
import { UsersService } from '../users/users.service';
import { issueSessionToken } from '../common/auth/app-token';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  requestCode(phone: string) {
    return {
      ok: true,
      phone,
      devCode: DEV_LOGIN_CODE,
    };
  }

  async verifyCode(phone: string, code: string) {
    if (code !== DEV_LOGIN_CODE) {
      throw new UnauthorizedException('invalid code');
    }

    const user = await this.usersService.upsertDevUser(phone);

    return {
      token: issueSessionToken(user),
      user,
    };
  }
}