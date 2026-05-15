import { randomUUID } from 'node:crypto';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MatchesModule } from './matches/matches.module';
import { MessagesModule } from './messages/messages.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : isTest ? 'silent' : 'debug'),
        autoLogging: !isTest,
        // Pretty-print in dev so console output is readable; raw JSON in prod
        // for log aggregators (Loki, CloudWatch, ELK).
        transport: !isProduction && !isTest
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'HH:MM:ss.l',
                ignore: 'pid,hostname,req,res,responseTime',
                messageFormat: '{req.method} {req.url} -> {res.statusCode} ({responseTime}ms)',
              },
            }
          : undefined,
        genReqId: (req: IncomingMessage, res: ServerResponse) => {
          const headerId = req.headers['x-request-id'];
          const id =
            (Array.isArray(headerId) ? headerId[0] : headerId) ?? randomUUID();
          res.setHeader('x-request-id', id);
          return id;
        },
        customProps: () => ({ service: 'pingpang-api' }),
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            remoteAddress: req.remoteAddress,
          }),
          res: (res) => ({ statusCode: res.statusCode }),
        },
        redact: ['req.headers.authorization', 'req.headers["x-admin-token"]'],
      },
    }),
    PrismaModule,
    RedisModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: isProduction ? 120 : 1_000_000,
      },
    ]),
    AuthModule,
    UsersModule,
    MatchesModule,
    MessagesModule,
    ReviewsModule,
    ReportsModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
