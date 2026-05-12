import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminTokenGuard } from './admin-token.guard';

@Controller('admin')
@UseGuards(AdminTokenGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('summary')
  getSummary() {
    return this.adminService.getSummary();
  }

  @Get('matches')
  listMatches() {
    return this.adminService.listMatches();
  }

  @Post('matches')
  createMatch(@Body() body: unknown) {
    return this.adminService.createMatch(body);
  }

  @Patch('matches/:id')
  updateMatch(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateMatch(id, body);
  }

  @Delete('matches/:id')
  deleteMatch(@Param('id') id: string) {
    return this.adminService.deleteMatch(id);
  }

  @Post('matches/:id/cancel')
  cancelMatch(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.cancelMatch(id, body);
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post('users')
  createUser(@Body() body: unknown) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('venues')
  listVenues() {
    return this.adminService.listVenues();
  }

  @Post('venues')
  createVenue(@Body() body: unknown) {
    return this.adminService.createVenue(body);
  }

  @Patch('venues/:id')
  updateVenue(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateVenue(id, body);
  }

  @Delete('venues/:id')
  deleteVenue(@Param('id') id: string) {
    return this.adminService.deleteVenue(id);
  }

  @Post('venues/:venueId/courts')
  createCourt(@Param('venueId') venueId: string, @Body() body: unknown) {
    return this.adminService.createCourt(venueId, body);
  }

  @Patch('courts/:id')
  updateCourt(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateCourt(id, body);
  }

  @Delete('courts/:id')
  deleteCourt(@Param('id') id: string) {
    return this.adminService.deleteCourt(id);
  }

  @Post('venues/:venueId/slots')
  createSlot(@Param('venueId') venueId: string, @Body() body: unknown) {
    return this.adminService.createSlot(venueId, body);
  }

  @Patch('slots/:id')
  updateSlot(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.updateSlot(id, body);
  }

  @Delete('slots/:id')
  deleteSlot(@Param('id') id: string) {
    return this.adminService.deleteSlot(id);
  }

  @Get('applications')
  listApplications(@Query('status') status?: string) {
    return this.adminService.listApplications(status);
  }

  @Get('reviews')
  listReviews(
    @Query('revieweeId') revieweeId?: string,
    @Query('reviewerId') reviewerId?: string,
    @Query('minScore') minScore?: string,
    @Query('maxScore') maxScore?: string,
  ) {
    return this.adminService.listReviews({
      revieweeId,
      reviewerId,
      minScore: minScore !== undefined ? Number(minScore) : undefined,
      maxScore: maxScore !== undefined ? Number(maxScore) : undefined,
    });
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }

  @Post('applications/:id/approve')
  approveApplication(@Param('id') id: string) {
    return this.adminService.approveApplication(id);
  }

  @Post('applications/:id/reject')
  rejectApplication(@Param('id') id: string, @Body() body: unknown) {
    return this.adminService.rejectApplication(id, body);
  }
}
