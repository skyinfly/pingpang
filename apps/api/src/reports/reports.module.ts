import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ReportsController],
  providers: [ReportsService, DevBearerGuard],
  exports: [ReportsService],
})
export class ReportsModule {}
