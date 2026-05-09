import { Module } from '@nestjs/common';
import { ChatThreadsController } from './chat-threads.controller';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';

@Module({
  imports: [PrismaModule, NotificationsModule, UsersModule],
  controllers: [MessagesController, ChatThreadsController],
  providers: [MessagesService, DevBearerGuard],
})
export class MessagesModule {}
