import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRuleDto } from './dto';
import { ManagementRuleType, WorkspaceRole } from '@prisma/client';

@Injectable()
export class ManagementService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all subordinates for the current user (both INDIVIDUAL and TEAM rules)
   */
  async getMySubordinates(userId: string, workspaceId: string, includeTeamMembers = false) {
    // Get direct subordinates (INDIVIDUAL rules)
    const individualRules = await this.prisma.managementRule.findMany({
      where: {
        managerId: userId,
        workspaceId,
        ruleType: ManagementRuleType.INDIVIDUAL,
      },
      include: {
        subordinate: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    const directSubordinates = individualRules.map((rule) => ({
      userId: rule.subordinate!.id,
      name: rule.subordinate!.name,
      email: rule.subordinate!.email,
      ruleId: rule.id,
      ruleType: 'INDIVIDUAL' as const,
      assignedAt: rule.createdAt,
    }));

    // Get team members from managed teams
    let teamMembers: Array<{
      userId: string;
      name: string;
      email: string;
      ruleId: string;
      ruleType: 'TEAM';
      teamId: string;
      teamName: string;
      assignedAt: Date;
    }> = [];

    if (includeTeamMembers) {
      const teamRules = await this.prisma.managementRule.findMany({
        where: {
          managerId: userId,
          workspaceId,
          ruleType: ManagementRuleType.TEAM,
        },
        include: {
          team: {
            include: {
              members: {
                where: {
                  userId: { not: userId }, // Exclude the manager themselves
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      createdAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      teamMembers = teamRules.flatMap((rule) =>
        rule.team!.members.map((member) => ({
          userId: member.user.id,
          name: member.user.name,
          email: member.user.email,
          ruleId: rule.id,
          ruleType: 'TEAM' as const,
          teamId: rule.team!.id,
          teamName: rule.team!.name,
          assignedAt: rule.createdAt,
        })),
      );
    }

    // Combine and deduplicate by userId
    const allSubordinates = [...directSubordinates, ...teamMembers];
    const uniqueSubordinates = allSubordinates.reduce((acc, current) => {
      const existing = acc.find((item: any) => item.userId === current.userId);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as any[]);

    return {
      total: uniqueSubordinates.length,
      directSubordinates: directSubordinates.length,
      teamMembers: teamMembers.length,
      subordinates: uniqueSubordinates,
    };
  }

  /**
   * Get all teams managed by the current user
   */
  async getMyTeams(userId: string, workspaceId: string) {
    const teamRules = await this.prisma.managementRule.findMany({
      where: {
        managerId: userId,
        workspaceId,
        ruleType: ManagementRuleType.TEAM,
      },
      include: {
        team: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
    });

    return teamRules.map((rule) => ({
      ruleId: rule.id,
      teamId: rule.team!.id,
      teamName: rule.team!.name,
      teamDescription: rule.team!.description,
      teamStatus: rule.team!.status,
      memberCount: rule.team!._count.members,
      assignedAt: rule.createdAt,
    }));
  }

  /**
   * Get all management rules (for workspace admins)
   */
  async getAllRules(
    workspaceId: string,
    userRole: WorkspaceRole,
    managerId?: string,
    ruleType?: ManagementRuleType,
  ) {
    // Only workspace admins can see all rules
    if (userRole !== WorkspaceRole.OWNER && userRole !== WorkspaceRole.ADMIN) {
      throw new ForbiddenException('Only workspace admins can view all rules');
    }

    const where: any = { workspaceId };
    if (managerId) where.managerId = managerId;
    if (ruleType) where.ruleType = ruleType;

    const rules = await this.prisma.managementRule.findMany({
      where,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subordinate: {
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
            description: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rules;
  }

  /**
   * Create a new management rule
   */
  async createRule(workspaceId: string, userRole: WorkspaceRole, createRuleDto: CreateRuleDto) {
    const { type, managerId, subordinateId, teamId } = createRuleDto;

    // Only workspace admins can create management rules
    if (userRole !== WorkspaceRole.OWNER && userRole !== WorkspaceRole.ADMIN) {
      throw new ForbiddenException('Only workspace admins can create management rules');
    }

    // Validate based on type
    if (type === ManagementRuleType.INDIVIDUAL) {
      if (!subordinateId) {
        throw new BadRequestException('subordinateId is required for INDIVIDUAL rules');
      }

      // Check if subordinate exists and is in the workspace
      const subordinate = await this.prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId: subordinateId,
        },
      });

      if (!subordinate) {
        throw new NotFoundException('Subordinate not found in this workspace');
      }

      // Prevent self-management
      if (managerId === subordinateId) {
        throw new BadRequestException('Cannot create a rule for yourself');
      }

      // Check for circular hierarchy
      const wouldCreateCycle = await this.checkCircularHierarchy(
        managerId,
        subordinateId,
        workspaceId,
      );
      if (wouldCreateCycle) {
        throw new BadRequestException('This would create a circular hierarchy');
      }

      // Check if rule already exists
      const existingRule = await this.prisma.managementRule.findFirst({
        where: {
          managerId,
          subordinateId,
          workspaceId,
          ruleType: ManagementRuleType.INDIVIDUAL,
        },
      });

      if (existingRule) {
        throw new BadRequestException('This management rule already exists');
      }

      // Create the rule
      return this.prisma.managementRule.create({
        data: {
          ruleType: ManagementRuleType.INDIVIDUAL,
          managerId,
          subordinateId,
          workspaceId,
        },
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          subordinate: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } else if (type === ManagementRuleType.TEAM) {
      if (!teamId) {
        throw new BadRequestException('teamId is required for TEAM rules');
      }

      // Check if team exists and is in the workspace
      const team = await this.prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team || team.workspaceId !== workspaceId) {
        throw new NotFoundException('Team not found in this workspace');
      }

      // Check if rule already exists
      const existingRule = await this.prisma.managementRule.findFirst({
        where: {
          managerId,
          teamId,
          workspaceId,
          ruleType: ManagementRuleType.TEAM,
        },
      });

      if (existingRule) {
        throw new BadRequestException('This management rule already exists');
      }

      // Create the rule
      return this.prisma.managementRule.create({
        data: {
          ruleType: ManagementRuleType.TEAM,
          managerId,
          teamId,
          workspaceId,
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
              description: true,
              status: true,
            },
          },
        },
      });
    }

    throw new BadRequestException('Invalid rule type');
  }

  /**
   * Delete a management rule
   */
  async deleteRule(ruleId: string, userId: string, workspaceId: string, userRole: WorkspaceRole) {
    const rule = await this.prisma.managementRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) {
      throw new NotFoundException('Management rule not found');
    }

    // Check if rule belongs to the workspace
    if (rule.workspaceId !== workspaceId) {
      throw new ForbiddenException('Rule does not belong to this workspace');
    }

    // Only workspace admins or the manager who created the rule can delete it
    if (
      userRole !== WorkspaceRole.OWNER &&
      userRole !== WorkspaceRole.ADMIN &&
      rule.managerId !== userId
    ) {
      throw new ForbiddenException('Not authorized to delete this rule');
    }

    await this.prisma.managementRule.delete({
      where: { id: ruleId },
    });

    return { message: 'Management rule deleted successfully' };
  }

  /**
   * Check if a user is managed by another user (directly or through team)
   */
  async isUserManagedBy(userId: string, managerId: string, workspaceId: string): Promise<boolean> {
    // Check for direct INDIVIDUAL rule
    const individualRule = await this.prisma.managementRule.findFirst({
      where: {
        managerId,
        subordinateId: userId,
        workspaceId,
        ruleType: ManagementRuleType.INDIVIDUAL,
      },
    });

    if (individualRule) return true;

    // Check for TEAM rule
    const teamRule = await this.prisma.managementRule.findFirst({
      where: {
        managerId,
        workspaceId,
        ruleType: ManagementRuleType.TEAM,
        team: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });

    return !!teamRule;
  }

  /**
   * Check if creating a management rule would create a circular hierarchy
   */
  private async checkCircularHierarchy(
    managerId: string,
    subordinateId: string,
    workspaceId: string,
  ): Promise<boolean> {
    // Check if subordinate manages the manager (directly or indirectly)
    const visited = new Set<string>();
    const queue = [subordinateId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (visited.has(currentId)) continue;
      visited.add(currentId);

      // If we reach the manager, there's a cycle
      if (currentId === managerId) return true;

      // Get all people managed by current user
      const rules = await this.prisma.managementRule.findMany({
        where: {
          managerId: currentId,
          workspaceId,
          ruleType: ManagementRuleType.INDIVIDUAL,
        },
        select: {
          subordinateId: true,
        },
      });

      for (const rule of rules) {
        if (rule.subordinateId && !visited.has(rule.subordinateId)) {
          queue.push(rule.subordinateId);
        }
      }
    }

    return false;
  }
}
