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
}
