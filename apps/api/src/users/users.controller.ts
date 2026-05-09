import { UseGuards } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { AuthUser } from '../common/auth/auth-user.decorator';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import type { SessionUser } from '../auth/dev-auth';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(DevBearerGuard)
  getProfile(@AuthUser() user: SessionUser) {
    return user;
  }
}
