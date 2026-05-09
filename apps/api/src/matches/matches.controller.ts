import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchOptionsService } from './match-options.service';
import { ApplyMatchDto } from './dto/apply-match.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { RejectMatchApplicationDto } from './dto/reject-match-application.dto';
import { AuthUser } from '../common/auth/auth-user.decorator';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import type { SessionUser } from '../auth/dev-auth';

@Controller()
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly matchOptionsService: MatchOptionsService,
  ) {}

  @Get('matches')
  list(@Query('city') city?: string, @Query('level') level?: string) {
    return this.matchesService.list({ city, level });
  }

  @Get('matches/mine')
  @UseGuards(DevBearerGuard)
  listMine(@AuthUser() user: SessionUser) {
    return this.matchesService.listMine(user.id);
  }

  @Get('matches/joined')
  @UseGuards(DevBearerGuard)
  listJoined(@AuthUser() user: SessionUser) {
    return this.matchesService.listJoined(user.id);
  }

  @Get('matches/:id/applications')
  @UseGuards(DevBearerGuard)
  listApplications(@Param('id') id: string, @AuthUser() user: SessionUser) {
    return this.matchesService.listApplications(id, user.id);
  }

  @Get('matches/:id/my-application')
  @UseGuards(DevBearerGuard)
  getMyApplicationStatus(@Param('id') id: string, @AuthUser() user: SessionUser) {
    return this.matchesService.getMyApplicationStatus(id, user.id);
  }

  @Get('matches/:id')
  getById(@Param('id') id: string) {
    return this.matchesService.getById(id);
  }

  @Get('match-options')
  getMatchOptions() {
    return this.matchOptionsService.getMatchOptions();
  }

  @Post('matches')
  @UseGuards(DevBearerGuard)
  create(@Body() body: CreateMatchDto, @AuthUser() user: SessionUser) {
    return this.matchesService.create(body, user.id);
  }

  @Post('matches/:id/applications')
  @UseGuards(DevBearerGuard)
  apply(@Param('id') id: string, @Body() _body: ApplyMatchDto, @AuthUser() user: SessionUser) {
    return this.matchesService.apply(id, user.id);
  }

  @Post('matches/:id/applications/:applicationId/approve')
  @UseGuards(DevBearerGuard)
  approve(
    @Param('id') id: string,
    @Param('applicationId') applicationId: string,
    @AuthUser() user: SessionUser,
  ) {
    return this.matchesService.approveApplication(id, applicationId, user.id);
  }

  @Post('matches/:id/applications/:applicationId/reject')
  @UseGuards(DevBearerGuard)
  reject(
    @Param('id') id: string,
    @Param('applicationId') applicationId: string,
    @Body() body: RejectMatchApplicationDto,
    @AuthUser() user: SessionUser,
  ) {
    return this.matchesService.rejectApplication(id, applicationId, user.id, body.reason);
  }
}
