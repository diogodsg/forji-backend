import { Injectable, NotFoundException } from "@nestjs/common";
import { PdiCycleStatus } from "@prisma/client";
import { logger } from "../common/logger/pino";
import { PrismaService } from "../core/prisma/prisma.service";
import { SoftDeleteService } from "../common/prisma/soft-delete.extension";
import { GamificationService } from "../gamification/gamification.service";

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
  workActivities?: string;
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
  constructor(
    prisma: PrismaService,
    private readonly gamificationService: GamificationService
  ) {
    super(prisma);
  }
  async getByUser(userId: number) {
    const plan = await this.prisma.pdiPlan.findFirst({
      where: this.addSoftDeleteFilter({ userId }),
    });
    if (!plan) return null;
    // Anexar ciclos do usuário para permitir derivação no frontend
    const cycles = await this.prisma.pdiCycle.findMany({
      where: { userId, deleted_at: null },
      orderBy: { startDate: "desc" },
    });
    return { ...plan, cycles } as any;
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
      // Se já existir ciclo ACTIVE, atualizar snapshot dele
      const active = await this.prisma.pdiCycle.findFirst({
        where: { userId, status: PdiCycleStatus.ACTIVE, deleted_at: null },
        select: { id: true },
      });
      if (active) {
        await this.prisma.pdiCycle.update({
          where: { id: active.id },
          data: {
            competencies: data.competencies || [],
            milestones: (data.milestones || []) as any,
            krs: (data.krs || []) as any,
            records: (data.records || []) as any,
          },
        });
      }
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
      const cycles = await this.prisma.pdiCycle.findMany({
        where: { userId, deleted_at: null },
        orderBy: { startDate: "desc" },
      });
      return { ...created, cycles } as any;
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
    // Sincronizar também ciclo ACTIVE
    const active = await this.prisma.pdiCycle.findFirst({
      where: { userId, status: PdiCycleStatus.ACTIVE, deleted_at: null },
      select: { id: true },
    });
    if (active) {
      await this.prisma.pdiCycle.update({
        where: { id: active.id },
        data: {
          competencies: data.competencies ?? existing.competencies,
          milestones: (data.milestones ?? existing.milestones) as any,
          krs: (data.krs ?? existing.krs) as any,
          records: (data.records ?? existing.records) as any,
        },
      });
    }
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
    const cycles = await this.prisma.pdiCycle.findMany({
      where: { userId, deleted_at: null },
      orderBy: { startDate: "desc" },
    });
    return { ...updated, cycles } as any;
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
    // Sincronizar snapshot no ciclo ACTIVE
    const active = await this.prisma.pdiCycle.findFirst({
      where: { userId, status: PdiCycleStatus.ACTIVE, deleted_at: null },
      select: { id: true },
    });
    if (active) {
      await this.prisma.pdiCycle.update({
        where: { id: active.id },
        data: {
          competencies: partial.competencies ?? existing.competencies,
          milestones: (partial.milestones ?? existing.milestones) as any,
          krs: (partial.krs ?? existing.krs) as any,
          records: (partial.records ?? existing.records) as any,
        },
      });
    }
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
    const cycles = await this.prisma.pdiCycle.findMany({
      where: { userId, deleted_at: null },
      orderBy: { startDate: "desc" },
    });

    // Check for milestone progress and trigger gamification
    await this.checkMilestoneProgress(userId, existing, partial);

    return { ...updated, cycles } as any;
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
      where: { userId, deleted_at: { not: null } },
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

  /**
   * 🎮 Verificar progresso e disparar eventos de gamificação
   */
  private async checkMilestoneProgress(
    userId: number,
    existing: any,
    partial: Partial<PdiPlanDto>
  ) {
    // Detectar milestones completados
    if (partial.milestones) {
      const oldMilestones = (existing.milestones as PdiMilestone[]) || [];
      const newMilestones = partial.milestones;

      const newCompletedMilestones = this.findNewCompletedMilestones(
        oldMilestones,
        newMilestones
      );

      // Disparar XP para cada milestone completado
      for (const milestone of newCompletedMilestones) {
        try {
          await this.gamificationService.addXP({
            userId,
            action: "pdi_milestone_completed",
            description: `Completed milestone: ${milestone.title}`,
          });

          logger.info(
            {
              msg: "pdi.milestone.completed",
              userId,
              milestoneId: milestone.id,
              milestoneTitle: milestone.title,
            },
            "PDI milestone completed - XP awarded: userId=%d, milestone=%s",
            userId,
            milestone.title
          );
        } catch (error) {
          logger.error(
            {
              msg: "pdi.milestone.gamification.error",
              userId,
              milestoneId: milestone.id,
              error: error.message,
            },
            "Failed to award XP for milestone completion"
          );
        }
      }
    }

    // Detectar competências que subiram de nível
    if (partial.records) {
      const oldRecords = (existing.records as PdiCompetencyRecord[]) || [];
      const newRecords = partial.records;

      const competencyLevelUps = this.findCompetencyLevelUps(
        oldRecords,
        newRecords
      );

      for (const competency of competencyLevelUps) {
        try {
          await this.gamificationService.addXP({
            userId,
            action: "competency_level_up",
            description: `Competency ${competency.area} improved: Level ${competency.levelBefore} → ${competency.levelAfter}`,
          });

          logger.info(
            {
              msg: "pdi.competency.levelup",
              userId,
              area: competency.area,
              fromLevel: competency.levelBefore,
              toLevel: competency.levelAfter,
            },
            "Competency level up - XP awarded: userId=%d, competency=%s",
            userId,
            competency.area
          );
        } catch (error) {
          logger.error(
            {
              msg: "pdi.competency.gamification.error",
              userId,
              area: competency.area,
              error: error.message,
            },
            "Failed to award XP for competency level up"
          );
        }
      }
    }

    // Detectar Key Results alcançados
    if (partial.krs) {
      const oldKRs = (existing.krs as PdiKeyResult[]) || [];
      const newKRs = partial.krs;

      const achievedKRs = this.findAchievedKeyResults(oldKRs, newKRs);

      for (const kr of achievedKRs) {
        try {
          await this.gamificationService.addXP({
            userId,
            action: "key_result_achieved",
            description: `Achieved key result: ${kr.description}`,
          });

          logger.info(
            {
              msg: "pdi.kr.achieved",
              userId,
              krId: kr.id,
              krDescription: kr.description,
            },
            "Key result achieved - XP awarded: userId=%d, kr=%s",
            userId,
            kr.description
          );
        } catch (error) {
          logger.error(
            {
              msg: "pdi.kr.gamification.error",
              userId,
              krId: kr.id,
              error: error.message,
            },
            "Failed to award XP for key result achievement"
          );
        }
      }
    }
  }

  /**
   * Detectar competências que subiram de nível
   */
  private findCompetencyLevelUps(
    oldRecords: PdiCompetencyRecord[],
    newRecords: PdiCompetencyRecord[]
  ): PdiCompetencyRecord[] {
    const levelUps: PdiCompetencyRecord[] = [];

    for (const newRecord of newRecords) {
      const oldRecord = oldRecords.find((r) => r.area === newRecord.area);

      // Se a competência tinha um nível antes e agora tem um nível maior
      if (
        oldRecord?.levelAfter &&
        newRecord.levelAfter &&
        newRecord.levelAfter > oldRecord.levelAfter
      ) {
        levelUps.push({
          ...newRecord,
          levelBefore: oldRecord.levelAfter,
        });
      }
      // Se é uma nova competência com nível definido
      else if (!oldRecord && newRecord.levelAfter && newRecord.levelAfter > 0) {
        levelUps.push({
          ...newRecord,
          levelBefore: 0,
        });
      }
    }

    return levelUps;
  }

  /**
   * Detectar Key Results que foram alcançados
   */
  private findAchievedKeyResults(
    oldKRs: PdiKeyResult[],
    newKRs: PdiKeyResult[]
  ): PdiKeyResult[] {
    const achieved: PdiKeyResult[] = [];

    for (const newKR of newKRs) {
      const oldKR = oldKRs.find((kr) => kr.id === newKR.id);

      // Se o status mudou para "Concluído" ou similar
      const wasCompleted = this.isKRCompleted(oldKR?.currentStatus);
      const isNowCompleted = this.isKRCompleted(newKR.currentStatus);

      if (isNowCompleted && !wasCompleted) {
        achieved.push(newKR);
      }
    }

    return achieved;
  }

  /**
   * Verificar se um Key Result está completo baseado no status
   */
  private isKRCompleted(status?: string): boolean {
    if (!status) return false;

    const completedStatuses = [
      "concluído",
      "completo",
      "atingido",
      "alcançado",
      "100%",
      "finalizado",
    ];

    return completedStatuses.some((s) =>
      status.toLowerCase().includes(s.toLowerCase())
    );
  }

  /**
   * Encontra milestones que foram marcados como completados
   */
  private findNewCompletedMilestones(
    oldMilestones: PdiMilestone[],
    newMilestones: PdiMilestone[]
  ): PdiMilestone[] {
    const completed: PdiMilestone[] = [];

    for (const newMilestone of newMilestones) {
      const oldMilestone = oldMilestones.find((m) => m.id === newMilestone.id);

      // Se milestone não existia antes ou agora tem tarefas marcadas como done
      const wasCompleted = oldMilestone?.tasks?.some((t) => t.done) || false;
      const isNowCompleted = newMilestone.tasks?.some((t) => t.done) || false;

      // Se agora está completado e antes não estava
      if (isNowCompleted && !wasCompleted) {
        completed.push(newMilestone);
      }
    }

    return completed;
  }
}
