import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, DevBearerGuard],
})
export class ReviewsModule {}
