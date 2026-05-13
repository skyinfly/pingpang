import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthUser } from '../common/auth/auth-user.decorator';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import type { SessionUser } from '../auth/dev-auth';
import { CreateThreadMessageDto } from './dto/create-thread-message.dto';

@Controller('chat-threads')
@UseGuards(DevBearerGuard)
export class ChatThreadsController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  list(@AuthUser() user: SessionUser, @Query('status') status?: string) {
    return this.messagesService.listThreads(user.id, { status });
  }

  @Get(':threadId')
  getDetail(@Param('threadId') threadId: string, @AuthUser() user: SessionUser) {
    return this.messagesService.getThreadDetail(user.id, threadId);
  }

  @Get(':threadId/messages')
  listMessages(@Param('threadId') threadId: string, @AuthUser() user: SessionUser) {
    return this.messagesService.listThreadMessages(user.id, threadId);
  }

  @Post(':threadId/messages')
  createMessage(
    @Param('threadId') threadId: string,
    @AuthUser() user: SessionUser,
    @Body() body: CreateThreadMessageDto,
  ) {
    return this.messagesService.createThreadMessage(threadId, user, body.content);
  }

  @Post(':threadId/read')
  markRead(@Param('threadId') threadId: string, @AuthUser() user: SessionUser) {
    return this.messagesService.markThreadRead({ userId: user.id, threadId });
  }
}
