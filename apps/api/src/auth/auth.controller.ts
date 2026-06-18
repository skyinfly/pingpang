import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginEmailDto } from './dto/login-email.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterEmailDto } from './dto/register-email.dto';
import { RequestLoginCodeDto } from './dto/request-login-code.dto';
import { VerifyLoginCodeDto } from './dto/verify-login-code.dto';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { isDevLoginEnabled } from './dev-auth';

const isProduction = process.env.NODE_ENV === 'production';
const AUTH_LIMITS = {
  requestCode: { ttl: 60_000, limit: isProduction ? 3 : 1_000_000 },
  verifyCode: { ttl: 60_000, limit: isProduction ? 10 : 1_000_000 },
  // Register shares the verify-code budget (legitimate flows hit at most
  // a handful per phone per minute; anything more is abuse).
  register: { ttl: 60_000, limit: isProduction ? 10 : 1_000_000 },
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

  @Post('register')
  @Throttle({ default: AUTH_LIMITS.register })
  register(@Body() body: RegisterDto) {
    if (!isDevLoginEnabled()) {
      // Same gate as request-code / verify-code: phone+OTP registration
      // is only exposed in dev/staging; production should ship the
      // WeChat-only flow.
      throw new NotFoundException();
    }
    return this.authService.register(body);
  }

  // ---- Email + password auth (H5 web) ----
  //
  // The primary login path for the web client. Two endpoints:
  //   POST /auth/email/register  — create account, return session token
  //   POST /auth/email/login     — verify password, return session token
  // No OTP / verification email — passwords carry the security here.

  @Post('email/register')
  @Throttle({ default: AUTH_LIMITS.register })
  registerEmail(@Body() body: RegisterEmailDto) {
    return this.authService.registerEmailPassword(body);
  }

  @Post('email/login')
  @Throttle({ default: AUTH_LIMITS.verifyCode })
  loginEmail(@Body() body: LoginEmailDto) {
    return this.authService.loginEmailPassword(body);
  }

  @Post('wechat-login')
  @Throttle({ default: AUTH_LIMITS.wechatLogin })
  wechatLogin(@Body() body: WechatLoginDto) {
    return this.authService.loginWithWechat(body.code);
  }
}