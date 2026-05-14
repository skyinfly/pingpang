import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(reporterId: string, payload: { targetUserId: string; reason: string; matchId?: string }) {
    if (payload.targetUserId === reporterId) {
      throw new BadRequestException('Cannot report yourself');
    }

    const target = await this.prisma.user.findUnique({ where: { id: payload.targetUserId } });
    if (!target) {
      throw new NotFoundException(`User ${payload.targetUserId} not found`);
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        targetUserId: payload.targetUserId,
        matchId: payload.matchId ?? null,
        reason: payload.reason.trim(),
      },
    });

    return {
      id: report.id,
      status: report.status,
      createdAt: report.createdAt.toISOString(),
    };
  }

  async listReports(filters: { status?: string; page?: number; pageSize?: number } = {}) {
    const where = filters.status && ['open', 'reviewed', 'dismissed'].includes(filters.status)
      ? { status: filters.status }
      : undefined;
    const page = Math.max(1, Math.floor(filters.page ?? 1));
    const pageSize = Math.min(200, Math.max(1, Math.floor(filters.pageSize ?? 50)));

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      this.prisma.report.count({ where }),
    ]);

    const userIds = new Set<string>();
    for (const report of reports) {
      userIds.add(report.reporterId);
      userIds.add(report.targetUserId);
    }

    const users = userIds.size
      ? await this.prisma.user.findMany({
          where: { id: { in: [...userIds] } },
          select: { id: true, nickname: true, phone: true },
        })
      : [];
    const userMap = new Map(users.map((user) => [user.id, user]));

    return {
      items: reports.map((report) => ({
        id: report.id,
        reporterId: report.reporterId,
        reporterNickname: userMap.get(report.reporterId)?.nickname ?? '',
        targetUserId: report.targetUserId,
        targetNickname: userMap.get(report.targetUserId)?.nickname ?? '',
        targetPhone: userMap.get(report.targetUserId)?.phone ?? '',
        matchId: report.matchId,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt.toISOString(),
      })),
      page,
      pageSize,
      total,
    };
  }

  async resolveReport(reportId: string, status: 'reviewed' | 'dismissed') {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found`);
    }
    await this.prisma.report.update({ where: { id: reportId }, data: { status } });
    return { ok: true, id: reportId, status };
  }
}
