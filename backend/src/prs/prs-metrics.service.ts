import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";

export interface PrsMetricsFilters {
  ownerUserId?: number;
  repo?: string;
  since?: string; // ISO date string
  until?: string; // ISO date string
}

@Injectable()
export class PrsMetricsService {
  constructor(private prisma: PrismaService) {}
  async basicMetrics(filters: PrsMetricsFilters) {
    // Build base where with optional ownerUserId/githubId fallback similar ao list()
    const where: any = {};
    if (filters.ownerUserId) {
      const user = await this.prisma.user.findFirst({
        where: { id: filters.ownerUserId as any },
        select: { githubId: true },
      });
      const gh = (user as any)?.githubId?.trim?.();
      if (gh) {
        // Combine PRs owned explicitamente ou cujo login GitHub corresponde
        where.OR = [{ ownerUserId: filters.ownerUserId as any }, { user: gh }];
      } else {
        where.ownerUserId = filters.ownerUserId as any;
      }
    }
    if (filters.repo) where.repo = filters.repo;
    if (filters.since || filters.until) {
      where.createdAt = {};
      if (filters.since) where.createdAt.gte = new Date(filters.since);
      if (filters.until) where.createdAt.lte = new Date(filters.until);
    }
    const [total, merged, closed] = await Promise.all([
      this.prisma.pullRequest.count({ where }),
      this.prisma.pullRequest.count({
        where: { ...where, state: "merged" } as any,
      }),
      this.prisma.pullRequest.count({
        where: { ...where, state: "closed" } as any,
      }),
    ]);
    return { total, merged, closed, open: total - merged - closed };
  }
}
