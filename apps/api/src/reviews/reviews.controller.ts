import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() body: { matchId: string; reviewerId: string; revieweeId: string; score: number; tags: string[] }) {
    return this.reviewsService.create(body);
  }

  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.reviewsService.getProfile(userId);
  }
}
