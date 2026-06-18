import { Body, Controller, Delete, Get, Header, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
// We avoid pulling in @types/express here (not in deps) by typing the Res
// param against the small shape we actually use.
type CalendarResponse = {
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
};
import { MatchesService } from './matches.service';
import { MatchOptionsService } from './match-options.service';
import { ApplyMatchDto } from './dto/apply-match.dto';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { CheckInDto } from './dto/check-in.dto';
import { RejectMatchApplicationDto } from './dto/reject-match-application.dto';
import { UpsertVenueFromPoiDto } from './dto/upsert-venue-from-poi.dto';
import { AuthUser } from '../common/auth/auth-user.decorator';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import { parseLatLngQuery } from '../common/geo/geo';
import type { SessionUser } from '../auth/dev-auth';

@Controller()
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly matchOptionsService: MatchOptionsService,
  ) {}

  @Get('matches')
  list(
    @Query('city') city?: string,
    @Query('level') level?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
  ) {
    const userLocation = parseLatLngQuery(lat, lng);
    const radius = radiusKm ? Number(radiusKm) : undefined;
    return this.matchesService.list({
      city,
      level,
      lat: userLocation?.lat,
      lng: userLocation?.lng,
      radiusKm: Number.isFinite(radius) && (radius as number) > 0 ? radius : undefined,
    });
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
  getById(@Param('id') id: string, @Query('lat') lat?: string, @Query('lng') lng?: string) {
    return this.matchesService.getById(id, parseLatLngQuery(lat, lng));
  }

  /**
   * RFC 5545 calendar export. We respond with text/calendar so browsers
   * download a .ics file (and macOS / iOS open it directly in Calendar).
   * Returned without auth: the match's id is the only secret here, and
   * the contents mirror what's already public on the detail page.
   */
  @Get('matches/:id/calendar.ics')
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  async calendar(@Param('id') id: string, @Res() res: CalendarResponse) {
    const ics = await this.matchesService.exportCalendar(id);
    res.setHeader('Content-Disposition', `attachment; filename="pingpang-${id}.ics"`);
    res.send(ics);
  }

  @Get('match-options')
  getMatchOptions(@Query('lat') lat?: string, @Query('lng') lng?: string) {
    return this.matchOptionsService.getMatchOptions(parseLatLngQuery(lat, lng));
  }

  /**
   * Find-or-create a Venue from an AMap POI. The client passes whatever
   * `/location/poi/search` gave it; we dedupe by AMap POI id and seed
   * a default court + slot the first time so the new venue is
   * immediately usable in the create-match flow.
   */
  @Post('matches/venues/from-poi')
  @UseGuards(DevBearerGuard)
  upsertVenueFromPoi(@Body() body: UpsertVenueFromPoiDto) {
    return this.matchOptionsService.upsertVenueFromPoi({
      amapPoiId: body.amapPoiId,
      name: body.name,
      city: body.city,
      district: body.district ?? null,
      address: body.address,
      lat: body.lat,
      lng: body.lng,
    });
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

  @Patch('matches/:id')
  @UseGuards(DevBearerGuard)
  updateOwn(
    @Param('id') id: string,
    @Body() body: UpdateMatchDto,
    @AuthUser() user: SessionUser,
  ) {
    return this.matchesService.updateOwnMatch(id, user.id, body);
  }

  @Post('matches/:id/cancel')
  @UseGuards(DevBearerGuard)
  cancel(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @AuthUser() user: SessionUser,
  ) {
    return this.matchesService.cancelMatch(id, user.id, body?.reason);
  }

  /**
   * Host-only hard delete. Only allowed for cancelled matches or for
   * past matches that no one joined — see MatchesService.deleteOwnMatch
   * for the safety rules.
   */
  @Delete('matches/:id')
  @UseGuards(DevBearerGuard)
  delete(@Param('id') id: string, @AuthUser() user: SessionUser) {
    return this.matchesService.deleteOwnMatch(id, user.id);
  }

  @Post('matches/:id/check-in-code')
  @UseGuards(DevBearerGuard)
  ensureCheckInCode(@Param('id') id: string, @AuthUser() user: SessionUser) {
    return this.matchesService.ensureCheckInCode(id, user.id);
  }

  @Get('matches/:id/check-ins')
  @UseGuards(DevBearerGuard)
  listCheckIns(@Param('id') id: string, @AuthUser() user: SessionUser) {
    return this.matchesService.listCheckIns(id, user.id);
  }

  @Post('matches/:id/check-in')
  @UseGuards(DevBearerGuard)
  checkIn(
    @Param('id') id: string,
    @Body() body: CheckInDto,
    @AuthUser() user: SessionUser,
  ) {
    return this.matchesService.checkIn(id, user.id, body.code);
  }
}
