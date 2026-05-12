import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import { AuthUser } from '../common/auth/auth-user.decorator';
import type { SessionUser } from '../auth/dev-auth';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(DevBearerGuard)
  create(
    @AuthUser() user: SessionUser,
    @Body() body: { matchId: string; revieweeId: string; score: number; tags: string[] },
  ) {
    return this.reviewsService.create({
      matchId: body.matchId,
      reviewerId: user.id,
      revieweeId: body.revieweeId,
      score: body.score,
      tags: body.tags,
    });
  }

  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.reviewsService.getProfile(userId);
  }
}
