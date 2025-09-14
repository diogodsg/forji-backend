import { Injectable } from "@nestjs/common";
import prisma from "../prisma";

export interface PrsMetricsFilters {
  ownerUserId?: number;
  repo?: string;
  since?: string; // ISO date string
  until?: string; // ISO date string
}

@Injectable()
export class PrsMetricsService {
  async basicMetrics(filters: PrsMetricsFilters) {
    const where: any = {};
    if (filters.ownerUserId) where.ownerUserId = filters.ownerUserId as any;
    if (filters.repo) where.repo = filters.repo;
    if (filters.since || filters.until) {
      where.createdAt = {};
      if (filters.since) where.createdAt.gte = new Date(filters.since);
      if (filters.until) where.createdAt.lte = new Date(filters.until);
    }
    const [total, merged, closed] = await Promise.all([
      prisma.pullRequest.count({ where }),
      prisma.pullRequest.count({ where: { ...where, state: "merged" } as any }),
      prisma.pullRequest.count({ where: { ...where, state: "closed" } as any }),
    ]);
    return { total, merged, closed, open: total - merged - closed };
  }
}
