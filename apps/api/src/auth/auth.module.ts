import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpStore } from './otp-store';
import { SmsModule } from './sms/sms.module';
import { WechatModule } from './wechat/wechat.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, SmsModule, WechatModule],
  controllers: [AuthController],
  providers: [AuthService, OtpStore],
  exports: [AuthService],
})
export class AuthModule {}
