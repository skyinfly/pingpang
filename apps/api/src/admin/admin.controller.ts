import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
}
