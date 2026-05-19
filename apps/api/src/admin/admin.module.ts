import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAnalyticsService } from './admin-analytics.service';
import { MatchesModule } from '../matches/matches.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [MatchesModule, ReportsModule],
  controllers: [AdminController],
  providers: [AdminService, AdminAnalyticsService],
})
export class AdminModule {}
