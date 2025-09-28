import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { ManagementRuleType } from "@prisma/client";

export interface ManagementRuleDto {
  ruleType: ManagementRuleType;
  teamId?: number;
  subordinateId?: number;
}

export interface SubordinateInfo {
  id: number;
  name: string;
  email: string;
  source: "individual" | "team";
  teamName?: string;
}

@Injectable()
export class ManagementService {
  constructor(private prisma: PrismaService) {}

  // Criar uma nova regra de gerenciamento
  async createRule(managerId: number, rule: ManagementRuleDto) {
    // Validação
    if (rule.ruleType === ManagementRuleType.TEAM && !rule.teamId) {
      throw new Error("Team ID is required for team management rules");
    }
    if (
      rule.ruleType === ManagementRuleType.INDIVIDUAL &&
      !rule.subordinateId
    ) {
      throw new Error(
        "Subordinate ID is required for individual management rules"
      );
    }

    return this.prisma.managementRule.create({
      data: {
        managerId: BigInt(managerId),
        ruleType: rule.ruleType,
        teamId: rule.teamId ? BigInt(rule.teamId) : null,
        subordinateId: rule.subordinateId ? BigInt(rule.subordinateId) : null,
      },
      include: {
        team: true,
        subordinate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Remover uma regra de gerenciamento
  async removeRule(managerId: number, ruleId: number) {
    const rule = await this.prisma.managementRule.findFirst({
      where: {
        id: BigInt(ruleId),
        managerId: BigInt(managerId),
      },
    });

    if (!rule) {
      throw new Error("Management rule not found or not owned by this manager");
    }

    return this.prisma.managementRule.delete({
      where: { id: BigInt(ruleId) },
    });
  }

  // Listar todas as regras de um gerente
  async getManagerRules(managerId: number) {
    return this.prisma.managementRule.findMany({
      where: { managerId: BigInt(managerId) },
      include: {
        team: true,
        subordinate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Obter todos os subordinados efetivos de um gerente
  async getEffectiveSubordinates(
    managerId: number
  ): Promise<SubordinateInfo[]> {
    const rules = await this.getManagerRules(managerId);
    const subordinatesMap = new Map<number, SubordinateInfo>();

    for (const rule of rules) {
      if (rule.ruleType === ManagementRuleType.INDIVIDUAL && rule.subordinate) {
        subordinatesMap.set(Number(rule.subordinate.id), {
          id: Number(rule.subordinate.id),
          name: rule.subordinate.name,
          email: rule.subordinate.email,
          source: "individual",
        });
      } else if (rule.ruleType === ManagementRuleType.TEAM && rule.team) {
        // Buscar todos os membros da equipe
        const teamMembers = await this.prisma.teamMembership.findMany({
          where: { teamId: rule.team.id },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        for (const membership of teamMembers) {
          // Não incluir o próprio gerente como subordinado
          if (Number(membership.user.id) !== managerId) {
            subordinatesMap.set(Number(membership.user.id), {
              id: Number(membership.user.id),
              name: membership.user.name,
              email: membership.user.email,
              source: "team",
              teamName: rule.team.name,
            });
          }
        }
      }
    }

    return Array.from(subordinatesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  // Verificar se uma pessoa é subordinada de um gerente
  async isSubordinate(managerId: number, userId: number): Promise<boolean> {
    const subordinates = await this.getEffectiveSubordinates(managerId);
    return subordinates.some((sub) => sub.id === userId);
  }

  // Obter informações sobre por que alguém é subordinado
  async getSubordinateSource(managerId: number, userId: number) {
    const rules = await this.getManagerRules(managerId);
    const sources: any[] = [];

    for (const rule of rules) {
      if (
        rule.ruleType === ManagementRuleType.INDIVIDUAL &&
        rule.subordinate &&
        Number(rule.subordinate.id) === userId
      ) {
        sources.push({
          type: "individual",
          rule: rule,
        });
      } else if (rule.ruleType === ManagementRuleType.TEAM && rule.team) {
        const isMember = await this.prisma.teamMembership.findFirst({
          where: {
            teamId: rule.team.id,
            userId: BigInt(userId),
          },
        });

        if (isMember) {
          sources.push({
            type: "team",
            rule: rule,
            team: rule.team,
          });
        }
      }
    }

    return sources;
  }

  // Obter dados completos do dashboard do manager
  async getManagerDashboard(managerId: number) {
    const subordinates = await this.getEffectiveSubordinates(managerId);

    // Buscar dados completos para cada subordinado incluindo cargo e times
    const reports = await Promise.all(
      subordinates.map(async (sub) => {
        // Buscar dados completos do usuário incluindo cargo
        const user = await this.prisma.user.findUnique({
          where: { id: BigInt(sub.id) },
          select: {
            position: true,
            bio: true,
          },
        });

        // Buscar times do usuário
        const teamMemberships = await this.prisma.teamMembership.findMany({
          where: { userId: BigInt(sub.id) },
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Buscar PDI do subordinado
        const pdi = await this.prisma.pdiPlan.findUnique({
          where: { userId: BigInt(sub.id) },
        });

        const pdiInfo = {
          exists: !!pdi,
          progress: pdi ? this.calculatePdiProgress(pdi) : 0,
          updatedAt: pdi?.updatedAt.toISOString(),
        };

        return {
          userId: sub.id,
          name: sub.name,
          email: sub.email,
          position: user?.position || null,
          bio: user?.bio || null,
          teams: teamMemberships.map((tm) => ({
            id: Number(tm.team.id),
            name: tm.team.name,
          })),
          pdi: pdiInfo,
        };
      })
    );

    // Calcular métricas agregadas
    const totalReports = reports.length;
    const pdiActive = reports.filter((r) => r.pdi.exists).length;
    const avgPdiProgress =
      totalReports > 0
        ? reports.reduce((sum, r) => sum + r.pdi.progress, 0) / totalReports
        : 0;

    return {
      reports,
      metrics: {
        totalReports,
        pdiActive,
        avgPdiProgress,
      },
    };
  }

  // ============ ADMIN METHODS ============

  // Admin: Obter todas as regras do sistema
  async getAllRules() {
    return this.prisma.managementRule.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: true,
        subordinate: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Admin: Remover qualquer regra (sem verificação de ownership)
  async adminRemoveRule(ruleId: number) {
    const rule = await this.prisma.managementRule.findUnique({
      where: { id: BigInt(ruleId) },
    });

    if (!rule) {
      throw new Error("Management rule not found");
    }

    return this.prisma.managementRule.delete({
      where: { id: BigInt(ruleId) },
    });
  }

  // Método auxiliar para calcular progresso do PDI
  private calculatePdiProgress(pdi: any): number {
    // Implementação simples - pode ser refinada
    if (!pdi.milestones || !Array.isArray(pdi.milestones)) return 0;

    const completedMilestones = pdi.milestones.filter(
      (m: any) => m.status === "completed" || m.completed === true
    ).length;

    return pdi.milestones.length > 0
      ? completedMilestones / pdi.milestones.length
      : 0;
  }
}
