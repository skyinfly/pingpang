import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, DevBearerGuard],
  exports: [UsersService],
})
export class UsersModule {}
