import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import { SessionRevocationService } from '../common/auth/session-revocation.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, DevBearerGuard, SessionRevocationService],
  exports: [UsersService, SessionRevocationService],
})
export class UsersModule {}
