import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchOptionsService } from './match-options.service';
import { MatchesService } from './matches.service';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { PrismaModule } from '../common/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';

@Module({
  imports: [PrismaModule, RecommendationsModule, UsersModule],
  controllers: [MatchesController],
  providers: [MatchesService, MatchOptionsService, DevBearerGuard],
})
export class MatchesModule {}
