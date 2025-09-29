import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { ManagementRuleType } from "@prisma/client";
import { SoftDeleteService } from "../common/prisma/soft-delete.extension";

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
export class ManagementService extends SoftDeleteService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

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
      where: this.addSoftDeleteFilter({
        id: BigInt(ruleId),
        managerId: BigInt(managerId),
      }),
    });

    if (!rule) {
      throw new Error("Management rule not found or not owned by this manager");
    }

    return this.softDelete("managementRule", BigInt(ruleId));
  }

  // Listar todas as regras de um gerente
  async getManagerRules(managerId: number) {
    return this.prisma.managementRule.findMany({
      where: this.addSoftDeleteFilter({ managerId: BigInt(managerId) }),
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

    // Separar regras por tipo para processamento otimizado
    const individualRules = rules.filter(r => r.ruleType === ManagementRuleType.INDIVIDUAL && r.subordinate);
    const teamRules = rules.filter(r => r.ruleType === ManagementRuleType.TEAM && r.team);

    // Processar regras individuais (já temos os dados)
    individualRules.forEach(rule => {
      subordinatesMap.set(Number(rule.subordinate!.id), {
        id: Number(rule.subordinate!.id),
        name: rule.subordinate!.name,
        email: rule.subordinate!.email,
        source: "individual",
      });
    });

    // Processar regras de equipe em batch se houver
    if (teamRules.length > 0) {
      const teamIds = teamRules.map(rule => rule.team!.id);
      
      // Buscar todos os membros de todas as equipes em uma única consulta
      const allTeamMembers = await this.prisma.teamMembership.findMany({
        where: this.addSoftDeleteFilter({ teamId: { in: teamIds } }),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Processar membros encontrados
      allTeamMembers.forEach(membership => {
        const userId = Number(membership.user.id);
        // Não incluir o próprio gerente como subordinado
        if (userId !== managerId) {
          subordinatesMap.set(userId, {
            id: userId,
            name: membership.user.name,
            email: membership.user.email,
            source: "team",
            teamName: membership.team.name,
          });
        }
      });
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
          where: this.addSoftDeleteFilter({
            teamId: rule.team.id,
            userId: BigInt(userId),
          }),
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
    
    if (subordinates.length === 0) {
      return {
        reports: [],
        metrics: {
          totalReports: 0,
          pdiActive: 0,
          avgPdiProgress: 0,
        },
      };
    }

    const subordinateIds = subordinates.map(sub => BigInt(sub.id));

    // Buscar todos os dados necessários em paralelo com consultas bulk
    const [usersData, teamMemberships, pdiPlans] = await Promise.all([
      // Buscar dados completos de todos os usuários de uma vez
      this.prisma.user.findMany({
        where: { id: { in: subordinateIds } },
        select: {
          id: true,
          position: true,
          bio: true,
        },
      }),
      
      // Buscar todos os times dos subordinados de uma vez
      this.prisma.teamMembership.findMany({
        where: this.addSoftDeleteFilter({ userId: { in: subordinateIds } }),
        include: {
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      
      // Buscar todos os PDIs de uma vez
      this.prisma.pdiPlan.findMany({
        where: { userId: { in: subordinateIds } },
        select: {
          userId: true,
          milestones: true,
          updatedAt: true,
        },
      }),
    ]);

    // Criar maps para lookup rápido
    const usersMap = new Map(usersData.map(user => [Number(user.id), user]));
    const teamsMap = new Map<number, Array<{id: number, name: string}>>();
    const pdiMap = new Map(pdiPlans.map(pdi => [Number(pdi.userId), pdi]));

    // Agrupar times por usuário
    teamMemberships.forEach(tm => {
      const userId = Number(tm.userId);
      if (!teamsMap.has(userId)) {
        teamsMap.set(userId, []);
      }
      teamsMap.get(userId)!.push({
        id: Number(tm.team.id),
        name: tm.team.name,
      });
    });

    // Montar reports com dados já carregados
    const reports = subordinates.map(sub => {
      const user = usersMap.get(sub.id);
      const teams = teamsMap.get(sub.id) || [];
      const pdi = pdiMap.get(sub.id);
      
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
        teams,
        pdi: pdiInfo,
      };
    });

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

  // Obter dados consolidados do dashboard + times para o manager
  async getManagerDashboardComplete(managerId: number) {
    // Executar dashboard e teams em paralelo para máxima performance
    const [dashboardData, allTeams] = await Promise.all([
      this.getManagerDashboard(managerId),
      this.prisma.team.findMany({
        where: this.addSoftDeleteFilter({}),
        include: {
          memberships: {
            where: this.addSoftDeleteFilter({}),
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Formatar dados dos times
    const teams = allTeams.map((team) => ({
      id: Number(team.id),
      name: team.name,
      description: team.description,
      createdAt: team.createdAt,
      memberships: team.memberships.map((m) => ({
        user: {
          id: Number(m.user.id),
          name: m.user.name,
          email: m.user.email,
        },
        role: m.role,
      })),
    }));

    return {
      ...dashboardData,
      teams,
    };
  }

  // ============ ADMIN METHODS ============

  // Admin: Obter todas as regras do sistema
  async getAllRules() {
    return this.prisma.managementRule.findMany({
      where: this.addSoftDeleteFilter({}),
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
    const rule = await this.prisma.managementRule.findFirst({
      where: this.addSoftDeleteFilter({ id: BigInt(ruleId) }),
    });

    if (!rule) {
      throw new Error("Management rule not found");
    }

    return this.softDelete("managementRule", BigInt(ruleId));
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
