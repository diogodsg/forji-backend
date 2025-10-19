import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Use Case: Find All Users with Hierarchy
 * Returns paginated users with their managers, subordinates, and managed teams
 * This is the most complex query in the users domain
 */
@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(page: number = 1, limit: number = 20, search?: string, workspaceId?: string) {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    // Search by name or email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by workspace if provided
    if (workspaceId) {
      where.workspaceMemberships = {
        some: {
          workspaceId,
          deletedAt: null,
        },
      };
    }

    // Fetch users and total count
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          position: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    // If no users or no workspace filter, return early
    if (users.length === 0 || !workspaceId) {
      return {
        data: users.map((user) => ({
          ...user,
          isAdmin: false,
          managers: [],
          reports: [],
          managedTeams: [],
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Build hierarchy data
    const hierarchy = await this.buildHierarchyData(
      users.map((u) => u.id),
      workspaceId,
    );

    // Combine users with hierarchy
    const data = users.map((user) => ({
      ...user,
      isAdmin: false, // TODO: Get from WorkspaceMember.role
      managers: hierarchy.managersMap.get(user.id) || [],
      reports: hierarchy.subordinatesMap.get(user.id) || [],
      managedTeams: hierarchy.managedTeamsMap.get(user.id) || [],
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Build hierarchy data (managers, subordinates, teams) for given users
   */
  private async buildHierarchyData(userIds: string[], workspaceId: string) {
    // 1. Find direct manager relationships (INDIVIDUAL rules)
    const managerRules = await this.prisma.managementRule.findMany({
      where: {
        subordinateId: { in: userIds },
        workspaceId,
        deletedAt: null, // ✅ Filtrar regras deletadas
      },
      select: {
        subordinateId: true,
        managerId: true,
      },
    });

    // 2. Find team memberships
    const teamMemberships = await this.prisma.teamMember.findMany({
      where: {
        userId: { in: userIds },
        deletedAt: null, // ✅ Filtrar memberships deletados
        team: {
          workspaceId,
          deletedAt: null, // ✅ Filtrar teams deletados
        },
      },
      select: {
        userId: true,
        teamId: true,
      },
    });

    const teamIds = [...new Set(teamMemberships.map((tm) => tm.teamId))];

    // 3. Find team managers (TEAM rules)
    const teamManagerRules = await this.prisma.managementRule.findMany({
      where: {
        teamId: { in: teamIds },
        ruleType: 'TEAM',
        workspaceId,
        deletedAt: null, // ✅ Filtrar regras deletadas
      },
      select: {
        teamId: true,
        managerId: true,
      },
    });

    // 4. Find subordinates (people who report to these users)
    const subordinateRules = await this.prisma.managementRule.findMany({
      where: {
        managerId: { in: userIds },
        ruleType: 'INDIVIDUAL',
        workspaceId,
        deletedAt: null, // ✅ Filtrar regras deletadas
      },
      select: {
        managerId: true,
        subordinateId: true,
      },
    });

    // 5. Find teams managed by these users
    const managedTeamRules = await this.prisma.managementRule.findMany({
      where: {
        managerId: { in: userIds },
        ruleType: 'TEAM',
        workspaceId,
        deletedAt: null, // ✅ Filtrar regras deletadas
      },
      select: {
        managerId: true,
        teamId: true,
      },
    });

    const managedTeamIds = [...new Set(managedTeamRules.map((r) => r.teamId!))];

    // 6. Find members of managed teams
    const managedTeamMembers = await this.prisma.teamMember.findMany({
      where: {
        teamId: { in: managedTeamIds },
        deletedAt: null, // ✅ Filtrar memberships deletados
      },
      select: {
        teamId: true,
        userId: true,
      },
    });

    // 7. Get team details for managed teams
    const teams = await this.prisma.team.findMany({
      where: {
        id: { in: managedTeamIds },
        deletedAt: null, // ✅ Filtrar teams deletados
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Build maps
    const managersMap = new Map<string, Array<{ id: string }>>();
    const subordinatesMap = new Map<string, Array<{ id: string }>>();
    const managedTeamsMap = new Map<string, Array<{ id: string; name: string }>>();

    // Populate managers from direct rules
    managerRules.forEach((rule) => {
      if (!managersMap.has(rule.subordinateId!)) {
        managersMap.set(rule.subordinateId!, []);
      }
      managersMap.get(rule.subordinateId!)!.push({ id: rule.managerId });
    });

    // Populate managers from teams
    teamMemberships.forEach((membership) => {
      const teamManagers = teamManagerRules
        .filter((rule) => rule.teamId === membership.teamId)
        .map((rule) => ({ id: rule.managerId }));

      if (teamManagers.length > 0) {
        if (!managersMap.has(membership.userId)) {
          managersMap.set(membership.userId, []);
        }
        // Avoid duplicates
        const existing = managersMap.get(membership.userId)!;
        teamManagers.forEach((manager) => {
          if (!existing.some((m) => m.id === manager.id)) {
            existing.push(manager);
          }
        });
      }
    });

    // Populate direct subordinates
    subordinateRules.forEach((rule) => {
      if (!subordinatesMap.has(rule.managerId)) {
        subordinatesMap.set(rule.managerId, []);
      }
      subordinatesMap.get(rule.managerId)!.push({ id: rule.subordinateId! });
    });

    // Populate subordinates from managed teams
    managedTeamRules.forEach((rule) => {
      const teamMembers = managedTeamMembers
        .filter((member) => member.teamId === rule.teamId)
        .map((member) => ({ id: member.userId }));

      if (teamMembers.length > 0) {
        if (!subordinatesMap.has(rule.managerId)) {
          subordinatesMap.set(rule.managerId, []);
        }
        const existing = subordinatesMap.get(rule.managerId)!;
        teamMembers.forEach((member) => {
          // Don't add manager as their own subordinate
          if (member.id !== rule.managerId && !existing.some((s) => s.id === member.id)) {
            existing.push(member);
          }
        });
      }
    });

    // Populate managed teams
    managedTeamRules.forEach((rule) => {
      const team = teams.find((t) => t.id === rule.teamId);
      if (team) {
        if (!managedTeamsMap.has(rule.managerId)) {
          managedTeamsMap.set(rule.managerId, []);
        }
        managedTeamsMap.get(rule.managerId)!.push({
          id: team.id,
          name: team.name,
        });
      }
    });

    return {
      managersMap,
      subordinatesMap,
      managedTeamsMap,
    };
  }
}
