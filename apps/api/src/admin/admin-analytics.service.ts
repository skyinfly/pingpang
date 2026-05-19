import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

type DayBucket = { date: string; count: number };

function clampDays(value: number | undefined, fallback: number, max: number) {
  if (value === undefined || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.min(max, Math.floor(value)));
}

function startOfShanghaiDay(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const dateString = `${values.get('year')}-${values.get('month')}-${values.get('day')}`;
  return { iso: dateString, midnight: new Date(`${dateString}T00:00:00+08:00`) };
}

function buildEmptyTimeline(days: number): DayBucket[] {
  const out: DayBucket[] = [];
  const today = startOfShanghaiDay(new Date()).midnight.getTime();

  for (let i = days - 1; i >= 0; i -= 1) {
    const ts = today - i * 24 * 60 * 60 * 1000;
    const date = startOfShanghaiDay(new Date(ts)).iso;
    out.push({ date, count: 0 });
  }

  return out;
}

function bucketIntoTimeline<T extends { createdAt: Date }>(rows: T[], days: number) {
  const timeline = buildEmptyTimeline(days);
  const lookup = new Map(timeline.map((bucket, index) => [bucket.date, index]));

  for (const row of rows) {
    const day = startOfShanghaiDay(row.createdAt).iso;
    const index = lookup.get(day);
    if (index !== undefined) {
      timeline[index].count += 1;
    }
  }

  return timeline;
}

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const sevenDaysAgo = new Date(now - 7 * day);
    const previousSevenStart = new Date(now - 14 * day);
    const thirtyDaysAgo = new Date(now - 30 * day);

    const [
      totalUsers,
      totalMatches,
      totalApplications,
      approvedApplications,
      rejectedApplications,
      totalReviews,
      totalReports,
      newUsers7d,
      newUsersPrev7d,
      newUsers30d,
      newMatches7d,
      newMatchesPrev7d,
      newMatches30d,
      cancelledMatches30d,
      openReportsCount,
      averageScoreAgg,
      averageCreditAgg,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.match.count(),
      this.prisma.matchApplication.count(),
      this.prisma.matchApplication.count({ where: { status: 'approved' } }),
      this.prisma.matchApplication.count({ where: { status: 'rejected' } }),
      this.prisma.review.count(),
      this.prisma.report.count(),
      this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.user.count({
        where: { createdAt: { gte: previousSevenStart, lt: sevenDaysAgo } },
      }),
      this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.match.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.match.count({
        where: { createdAt: { gte: previousSevenStart, lt: sevenDaysAgo } },
      }),
      this.prisma.match.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.match.count({
        where: { status: 'cancelled', createdAt: { gte: thirtyDaysAgo } },
      }),
      this.prisma.report.count({ where: { status: 'open' } }),
      this.prisma.review.aggregate({ _avg: { score: true } }),
      this.prisma.user.aggregate({ _avg: { creditScore: true } }),
    ]);

    const decidedApplications = approvedApplications + rejectedApplications;
    const approvalRate = decidedApplications === 0 ? 0 : Number((approvedApplications / decidedApplications).toFixed(3));

    return {
      totals: {
        users: totalUsers,
        matches: totalMatches,
        applications: totalApplications,
        reviews: totalReviews,
        reports: totalReports,
        openReports: openReportsCount,
      },
      growth: {
        newUsers7d,
        newUsers30d,
        newUsersDelta: newUsers7d - newUsersPrev7d,
        newMatches7d,
        newMatches30d,
        newMatchesDelta: newMatches7d - newMatchesPrev7d,
        cancelledMatches30d,
      },
      operations: {
        approvalRate,
        approvedApplications,
        rejectedApplications,
        averageReviewScore: averageScoreAgg._avg.score ?? 0,
        averageCreditScore: averageCreditAgg._avg.creditScore ?? 0,
      },
    };
  }

  async getMatchTimeline(days?: number) {
    const range = clampDays(days, 14, 90);
    const since = new Date(startOfShanghaiDay(new Date()).midnight.getTime() - (range - 1) * 24 * 60 * 60 * 1000);
    const rows = await this.prisma.match.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
    return { days: range, buckets: bucketIntoTimeline(rows, range) };
  }

  async getUserTimeline(days?: number) {
    const range = clampDays(days, 14, 90);
    const since = new Date(startOfShanghaiDay(new Date()).midnight.getTime() - (range - 1) * 24 * 60 * 60 * 1000);
    const rows = await this.prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
    return { days: range, buckets: bucketIntoTimeline(rows, range) };
  }

  async getTopVenues(limit?: number) {
    const take = clampDays(limit, 10, 50);
    const groups = await this.prisma.match.groupBy({
      by: ['venueId'],
      where: { venueId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { venueId: 'desc' } },
      take,
    });
    const venues = await this.prisma.venue.findMany({
      where: { id: { in: groups.map((g) => g.venueId as string) } },
      select: { id: true, name: true, city: true, district: true },
    });
    const map = new Map(venues.map((v) => [v.id, v]));
    return {
      items: groups.map((g) => ({
        venueId: g.venueId as string,
        venueName: map.get(g.venueId as string)?.name ?? '已删除球馆',
        district: map.get(g.venueId as string)?.district ?? null,
        matchCount: g._count._all,
      })),
    };
  }

  async getTopHosts(limit?: number) {
    const take = clampDays(limit, 10, 50);
    const groups = await this.prisma.match.groupBy({
      by: ['hostUserId'],
      _count: { _all: true },
      orderBy: { _count: { hostUserId: 'desc' } },
      take,
    });
    const users = await this.prisma.user.findMany({
      where: { id: { in: groups.map((g) => g.hostUserId) } },
      select: { id: true, nickname: true, phone: true, creditScore: true },
    });
    const map = new Map(users.map((u) => [u.id, u]));
    return {
      items: groups.map((g) => ({
        hostUserId: g.hostUserId,
        hostNickname: map.get(g.hostUserId)?.nickname ?? '已删除用户',
        hostPhone: map.get(g.hostUserId)?.phone ?? '',
        creditScore: map.get(g.hostUserId)?.creditScore ?? 0,
        hostedMatches: g._count._all,
      })),
    };
  }
}
