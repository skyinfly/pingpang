import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RedisService } from '../common/redis/redis.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationsService, RedisService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
