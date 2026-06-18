import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpStore } from './otp-store';
import { SmsModule } from './sms/sms.module';
import { WechatModule } from './wechat/wechat.module';
import { UsersModule } from '../users/users.module';

@Module({
  // EmailModule (SMTP provider) is intentionally not imported here —
  // email auth is now password-based and doesn't send mail. The module
  // is kept around in apps/api/src/auth/email/ for a future
  // password-reset flow.
  imports: [UsersModule, SmsModule, WechatModule],
  controllers: [AuthController],
  providers: [AuthService, OtpStore],
  exports: [AuthService],
})
export class AuthModule {}
