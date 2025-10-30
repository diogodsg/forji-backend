import { Injectable } from '@nestjs/common';
import { ManagementRepository } from '../repositories/management.repository';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Use Case: Get User Hierarchy
 * Returns managers and subordinates for a specific user
 * Expands TEAM rules to include individual team members
 */
@Injectable()
export class GetUserHierarchyUseCase {
  constructor(
    private readonly managementRepository: ManagementRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(userId: string, workspaceId: string) {
    const startTime = Date.now();

    // 🚀 OTIMIZAÇÃO: Executar consultas em paralelo
    const [managerRules, subordinateRules, userTeams] = await Promise.all([
      // Get direct management rules where user is subordinate
      this.managementRepository.findRules({
        subordinateId: userId,
        workspaceId,
      }),
      // Get direct management rules where user is manager
      this.managementRepository.findRules({
        managerId: userId,
        workspaceId,
      }),
      // Get teams where user is a member (to find TEAM-based managers)
      this.prisma.teamMember.findMany({
        where: {
          userId,
          deletedAt: null,
          team: {
            workspaceId,
            deletedAt: null,
          },
        },
        select: {
          teamId: true,
        },
      }),
    ]);

    // Get team-based management rules for teams the user belongs to
    const teamIds = userTeams.map((tm) => tm.teamId);
    const teamManagerRules =
      teamIds.length > 0
        ? await this.prisma.managementRule.findMany({
            where: {
              teamId: { in: teamIds },
              ruleType: 'TEAM',
              workspaceId,
              deletedAt: null,
            },
            include: {
              manager: {
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
          })
        : [];

    // Combine direct and team-based managers
    const allManagers = [
      ...managerRules.map((rule) => ({
        id: rule.id,
        manager: rule.manager,
        ruleType: rule.ruleType,
        team: rule.team,
      })),
      ...teamManagerRules.map((rule) => ({
        id: rule.id,
        manager: rule.manager,
        ruleType: rule.ruleType,
        team: rule.team,
      })),
    ];

    // For subordinates, expand TEAM rules to include all team members
    const expandedSubordinates = await this.expandTeamRules(subordinateRules, workspaceId);

    const executionTime = Date.now() - startTime;
    console.log(
      `[GetUserHierarchyUseCase] Hierarchy query executed in ${executionTime}ms for user ${userId} (${allManagers.length} managers, ${expandedSubordinates.length} subordinates including team members)`,
    );

    return {
      managers: allManagers,
      subordinates: expandedSubordinates,
    };
  }

  /**
   * Expands TEAM rules to include individual team members
   */
  private async expandTeamRules(
    rules: any[],
    workspaceId: string,
  ): Promise<
    Array<{
      id: string;
      subordinate: any;
      team: any;
      ruleType: string;
    }>
  > {
    const result: Array<{
      id: string;
      subordinate: any;
      team: any;
      ruleType: string;
    }> = [];

    // Add direct individual rules
    result.push(
      ...rules
        .filter((rule) => rule.ruleType === 'INDIVIDUAL')
        .map((rule) => ({
          id: rule.id,
          subordinate: rule.subordinate,
          team: rule.team,
          ruleType: rule.ruleType,
        })),
    );

    // Expand TEAM rules
    const teamRules = rules.filter((rule) => rule.ruleType === 'TEAM' && rule.teamId);
    if (teamRules.length > 0) {
      const teamIds = teamRules.map((rule) => rule.teamId);

      // Get all members of these teams
      const teamMembers = await this.prisma.teamMember.findMany({
        where: {
          teamId: { in: teamIds },
          deletedAt: null,
        },
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

      // Map team members to subordinate format
      for (const member of teamMembers) {
        const originalRule = teamRules.find((rule) => rule.teamId === member.teamId);
        result.push({
          id: originalRule.id, // Keep original rule ID for reference
          subordinate: member.user,
          team: member.team,
          ruleType: 'TEAM', // Indicate this came from a TEAM rule
        });
      }
    }

    return result;
  }
}
