import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ManagementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRule(params: { managerId?: string; subordinateId?: string; workspaceId: string }) {
    return this.prisma.managementRule.findFirst({
      where: {
        ...params,
        deletedAt: null,
      },
    });
  }

  async findRules(params: { managerId?: string; subordinateId?: string; workspaceId: string }) {
    return this.prisma.managementRule.findMany({
      where: {
        ...params,
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
          },
        },
      },
    });
  }

  async createRule(data: {
    managerId: string;
    subordinateId?: string;
    teamId?: string;
    workspaceId: string;
    ruleType: 'INDIVIDUAL' | 'TEAM';
  }) {
    return this.prisma.managementRule.create({
      data,
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
          },
        },
      },
    });
  }

  async deleteRule(id: string) {
    return this.prisma.managementRule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findUserInWorkspace(userId: string, workspaceId: string) {
    return this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
      },
    });
  }

  async findTeam(teamId: string, workspaceId: string) {
    return this.prisma.team.findFirst({
      where: {
        id: teamId,
        workspaceId,
        deletedAt: null,
      },
    });
  }

  async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
