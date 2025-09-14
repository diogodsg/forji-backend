import { Injectable, NotFoundException } from "@nestjs/common";
import prisma from "../prisma";

export interface PdiTask {
  id: string;
  title: string;
  done?: boolean;
}
export interface PdiKeyResult {
  id: string;
  description: string;
  successCriteria: string;
  currentStatus?: string;
  improvementActions?: string[];
}
export interface PdiMilestone {
  id: string;
  date: string;
  title: string;
  summary: string;
  improvements?: string[];
  positives?: string[];
  resources?: string[];
  tasks?: PdiTask[];
  suggestions?: string[];
}
export interface PdiCompetencyRecord {
  area: string;
  levelBefore?: number;
  levelAfter?: number;
  evidence?: string;
}
export interface PdiPlanDto {
  competencies: string[];
  milestones: PdiMilestone[];
  krs?: PdiKeyResult[];
  records: PdiCompetencyRecord[];
}

@Injectable()
export class PdiService {
  async getByUser(userId: number) {
    return prisma.pdiPlan.findUnique({ where: { userId } });
  }
  async upsert(userId: number, data: PdiPlanDto) {
    const existing = await prisma.pdiPlan.findUnique({ where: { userId } });
    if (!existing) {
      return prisma.pdiPlan.create({
        data: {
          userId,
          competencies: data.competencies || [],
          milestones: (data.milestones || []) as any,
          krs: (data.krs || []) as any,
          records: (data.records || []) as any,
        },
      });
    }
    return prisma.pdiPlan.update({
      where: { userId },
      data: {
        competencies: data.competencies ?? existing.competencies,
        milestones: (data.milestones ?? existing.milestones) as any,
        krs: (data.krs ?? existing.krs) as any,
        records: (data.records ?? existing.records) as any,
      },
    });
  }
  async patch(userId: number, partial: Partial<PdiPlanDto>) {
    const existing = await prisma.pdiPlan.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundException("PDI plan not found");
    return prisma.pdiPlan.update({
      where: { userId },
      data: {
        competencies: partial.competencies ?? existing.competencies,
        milestones: (partial.milestones ?? existing.milestones) as any,
        krs: (partial.krs ?? existing.krs) as any,
        records: (partial.records ?? existing.records) as any,
      },
    });
  }
  async delete(userId: number) {
    await prisma.pdiPlan.delete({ where: { userId } });
    return { deleted: true };
  }
}
