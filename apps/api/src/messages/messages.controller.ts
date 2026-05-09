import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { MessagesService } from './messages.service';
import { AuthUser } from '../common/auth/auth-user.decorator';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import type { SessionUser } from '../auth/dev-auth';

@Controller('messages')
@UseGuards(DevBearerGuard)
export class MessagesController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get()
  list(@AuthUser() user: SessionUser, @Query('kind') kind?: string, @Query('matchId') matchId?: string) {
    return this.messagesService.listForUser(user.id, { kind, matchId });
  }

  @Get('summary')
  summary(@AuthUser() user: SessionUser) {
    return this.notificationsService.summary(user.id);
  }

  @Post()
  create(
    @AuthUser() user: SessionUser,
    @Body()
    body: {
      userId?: string;
      kind: string;
      title: string;
      content: string;
      senderId?: string;
      senderName?: string;
      status?: string;
      matchId?: string;
      threadId?: string;
    },
  ) {
    return this.messagesService.create({
      ...body,
      userId: user.id,
      senderId: body.senderId ?? user.id,
      senderName: body.senderName ?? user.nickname,
    });
  }

  @Post('read')
  markRead(@AuthUser() user: SessionUser, @Body() body: { kind?: string; matchId?: string }) {
    return this.messagesService.markRead({
      userId: user.id,
      kind: body.kind,
      matchId: body.matchId,
    });
  }
}
