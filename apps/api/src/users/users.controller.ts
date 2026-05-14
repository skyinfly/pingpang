import { Body, Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '../common/auth/auth-user.decorator';
import { BearerToken } from '../common/auth/bearer-token.decorator';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import type { SessionUser } from '../auth/dev-auth';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(DevBearerGuard)
  getProfile(@AuthUser() user: SessionUser) {
    return user;
  }

  @Patch('me')
  @UseGuards(DevBearerGuard)
  updateProfile(@AuthUser() user: SessionUser, @Body() body: UpdateProfileDto) {
    return this.usersService.updateOwnProfile(user.id, body);
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(DevBearerGuard)
  logout(@BearerToken() token: string) {
    return this.usersService.revokeCurrentSession(token);
  }
}
