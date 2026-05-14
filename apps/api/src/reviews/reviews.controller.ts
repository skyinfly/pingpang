import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import { AuthUser } from '../common/auth/auth-user.decorator';
import type { SessionUser } from '../auth/dev-auth';
import { SubmitReviewDto } from './dto/submit-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(DevBearerGuard)
  create(@AuthUser() user: SessionUser, @Body() body: SubmitReviewDto) {
    return this.reviewsService.create({
      matchId: body.matchId,
      reviewerId: user.id,
      revieweeId: body.revieweeId,
      score: body.score,
      tags: body.tags,
      anonymous: body.anonymous ?? false,
    });
  }

  @Delete(':id')
  @UseGuards(DevBearerGuard)
  withdraw(@AuthUser() user: SessionUser, @Param('id') id: string) {
    return this.reviewsService.withdrawOwnReview(id, user.id);
  }

  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.reviewsService.getProfile(userId);
  }
}
