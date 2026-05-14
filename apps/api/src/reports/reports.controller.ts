import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import { AuthUser } from '../common/auth/auth-user.decorator';
import type { SessionUser } from '../auth/dev-auth';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(DevBearerGuard)
  create(@AuthUser() user: SessionUser, @Body() body: CreateReportDto) {
    return this.reportsService.createReport(user.id, body);
  }
}
