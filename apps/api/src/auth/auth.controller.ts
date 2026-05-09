import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestLoginCodeDto } from './dto/request-login-code.dto';
import { VerifyLoginCodeDto } from './dto/verify-login-code.dto';
import { isDevLoginEnabled } from './dev-auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-code')
  requestCode(@Body() body: RequestLoginCodeDto) {
    if (!isDevLoginEnabled()) {
      throw new NotFoundException();
    }

    return this.authService.requestCode(body.phone);
  }

  @Post('verify-code')
  verifyCode(@Body() body: VerifyLoginCodeDto) {
    if (!isDevLoginEnabled()) {
      throw new NotFoundException();
    }

    return this.authService.verifyCode(body.phone, body.code);
  }
}