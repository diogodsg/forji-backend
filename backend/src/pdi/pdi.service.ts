import { Injectable, NotFoundException } from "@nestjs/common";
import { logger } from "../common/logger/pino";
import { PrismaService } from "../core/prisma/prisma.service";
import { SoftDeleteService } from "../common/prisma/soft-delete.extension";

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
export class PdiService extends SoftDeleteService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
  async getByUser(userId: number) {
    return this.prisma.pdiPlan.findFirst({
      where: this.addSoftDeleteFilter({ userId }),
    });
  }
  async upsert(userId: number, data: PdiPlanDto) {
    const existing = await this.prisma.pdiPlan.findFirst({
      where: this.addSoftDeleteFilter({ userId }),
    });
    if (!existing) {
      const created = await this.prisma.pdiPlan.create({
        data: {
          userId,
          competencies: data.competencies || [],
          milestones: (data.milestones || []) as any,
          krs: (data.krs || []) as any,
          records: (data.records || []) as any,
        },
      });
      logger.info(
        {
          msg: "pdi.create",
          userId,
          competencies: Array.isArray(created.competencies)
            ? created.competencies.length
            : 0,
          milestones: Array.isArray(created.milestones)
            ? created.milestones.length
            : 0,
          krs: Array.isArray(created.krs) ? created.krs.length : 0,
          records: Array.isArray(created.records) ? created.records.length : 0,
        },
        "pdi.create userId=%d",
        userId
      );
      return created;
    }
    const updated = await this.prisma.pdiPlan.update({
      where: { userId },
      data: {
        competencies: data.competencies ?? existing.competencies,
        milestones: (data.milestones ?? existing.milestones) as any,
        krs: (data.krs ?? existing.krs) as any,
        records: (data.records ?? existing.records) as any,
      },
    });
    logger.info(
      {
        msg: "pdi.upsert.update",
        userId,
        competencies: Array.isArray(updated.competencies)
          ? updated.competencies.length
          : 0,
        milestones: Array.isArray(updated.milestones)
          ? updated.milestones.length
          : 0,
      },
      "pdi.update userId=%d",
      userId
    );
    return updated;
  }
  async patch(userId: number, partial: Partial<PdiPlanDto>) {
    const existing = await this.prisma.pdiPlan.findFirst({
      where: this.addSoftDeleteFilter({ userId }),
    });
    if (!existing) throw new NotFoundException("PDI plan not found");
    const updated = await this.prisma.pdiPlan.update({
      where: { userId },
      data: {
        competencies: partial.competencies ?? existing.competencies,
        milestones: (partial.milestones ?? existing.milestones) as any,
        krs: (partial.krs ?? existing.krs) as any,
        records: (partial.records ?? existing.records) as any,
      },
    });
    logger.debug(
      {
        msg: "pdi.patch",
        userId,
        competencies: Array.isArray(updated.competencies)
          ? updated.competencies.length
          : 0,
        milestones: Array.isArray(updated.milestones)
          ? updated.milestones.length
          : 0,
      },
      "pdi.patch userId=%d",
      userId
    );
    return updated;
  }
  async delete(userId: number) {
    const existing = await this.prisma.pdiPlan.findFirst({
      where: this.addSoftDeleteFilter({ userId }),
    });
    if (!existing) throw new NotFoundException("PDI plan not found");

    await this.softDelete("pdiPlan", existing.id);
    logger.warn(
      { msg: "pdi.softDelete", userId },
      "pdi.softDelete userId=%d",
      userId
    );
    return { deleted: true };
  }

  // Método para hard delete (apenas para admin ou casos especiais)
  async hardDeletePdi(userId: number) {
    await this.prisma.pdiPlan.delete({ where: { userId } });
    logger.warn(
      { msg: "pdi.hardDelete", userId },
      "pdi.hardDelete userId=%d",
      userId
    );
    return { deleted: true };
  }

  // Método para restaurar PDI soft deleted
  async restorePdi(userId: number) {
    const existing = await this.prisma.pdiPlan.findFirst({
      where: { userId, deletedAt: { not: null } },
    });
    if (!existing) throw new NotFoundException("Deleted PDI plan not found");

    await super.restore("pdiPlan", existing.id);
    logger.info(
      { msg: "pdi.restore", userId },
      "pdi.restore userId=%d",
      userId
    );
    return { restored: true };
  }
}
