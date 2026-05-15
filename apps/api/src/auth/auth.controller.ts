import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RequestLoginCodeDto } from './dto/request-login-code.dto';
import { VerifyLoginCodeDto } from './dto/verify-login-code.dto';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { isDevLoginEnabled } from './dev-auth';

const isProduction = process.env.NODE_ENV === 'production';
const AUTH_LIMITS = {
  requestCode: { ttl: 60_000, limit: isProduction ? 3 : 1_000_000 },
  verifyCode: { ttl: 60_000, limit: isProduction ? 10 : 1_000_000 },
  wechatLogin: { ttl: 60_000, limit: isProduction ? 30 : 1_000_000 },
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-code')
  @Throttle({ default: AUTH_LIMITS.requestCode })
  requestCode(@Body() body: RequestLoginCodeDto) {
    if (!isDevLoginEnabled()) {
      throw new NotFoundException();
    }

    return this.authService.requestCode(body.phone);
  }

  @Post('verify-code')
  @Throttle({ default: AUTH_LIMITS.verifyCode })
  verifyCode(@Body() body: VerifyLoginCodeDto) {
    if (!isDevLoginEnabled()) {
      throw new NotFoundException();
    }

    return this.authService.verifyCode(body.phone, body.code);
  }

  @Post('wechat-login')
  @Throttle({ default: AUTH_LIMITS.wechatLogin })
  wechatLogin(@Body() body: WechatLoginDto) {
    return this.authService.loginWithWechat(body.code);
  }
}