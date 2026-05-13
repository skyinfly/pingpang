import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '../common/auth/auth-user.decorator';
import { BearerToken } from '../common/auth/bearer-token.decorator';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import type { SessionUser } from '../auth/dev-auth';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(DevBearerGuard)
  getProfile(@AuthUser() user: SessionUser) {
    return user;
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(DevBearerGuard)
  logout(@BearerToken() token: string) {
    return this.usersService.revokeCurrentSession(token);
  }
}
