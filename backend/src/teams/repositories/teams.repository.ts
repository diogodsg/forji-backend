import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, TeamStatus } from '@prisma/client';

/**
 * Repository for Team data access
 * Encapsulates all Prisma queries related to teams
 */
@Injectable()
export class TeamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find team by ID
   */
  async findById(id: string, workspaceId?: string) {
    const where: any = { id, deletedAt: null };
    if (workspaceId) {
      where.workspaceId = workspaceId;
    }

    return this.prisma.team.findFirst({ where });
  }

  /**
   * Find team by ID with members
   */
  async findByIdWithMembers(id: string, workspaceId?: string) {
    const where: any = { id, deletedAt: null };
    if (workspaceId) {
      where.workspaceId = workspaceId;
    }

    return this.prisma.team.findFirst({
      where,
      include: {
        members: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                position: true,
                avatarId: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find team by name in workspace
   */
  async findByName(name: string, workspaceId: string) {
    return this.prisma.team.findFirst({
      where: {
        name,
        workspaceId,
        deletedAt: null,
      },
    });
  }

  /**
   * Find all teams with filters
   */
  async findMany(params: {
    workspaceId: string;
    status?: TeamStatus;
    includeMembers?: boolean;
    includeMemberCount?: boolean;
  }) {
    const { workspaceId, status, includeMembers, includeMemberCount } = params;

    const where: any = {
      workspaceId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.team.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true,
        ...(includeMembers && {
          members: {
            where: { deletedAt: null },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  position: true,
                  avatarId: true,
                },
              },
            },
          },
        }),
        ...(includeMemberCount && {
          members: {
            where: { deletedAt: null },
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarId: true,
                },
              },
            },
          },
        }),
      },
    });
  }

  /**
   * Create team
   */
  async create(data: {
    name: string;
    description?: string;
    workspaceId: string;
    status?: TeamStatus;
  }) {
    return this.prisma.team.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update team
   */
  async update(id: string, data: Prisma.TeamUpdateInput) {
    return this.prisma.team.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Soft delete team
   */
  async softDelete(id: string) {
    return this.prisma.team.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Find team member
   */
  async findTeamMember(teamId: string, userId: string) {
    return this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
        deletedAt: null,
      },
    });
  }

  /**
   * Create team membership
   */
  async addMember(data: { teamId: string; userId: string; role: 'MANAGER' | 'MEMBER' }) {
    return this.prisma.teamMember.create({
      data,
    });
  }

  /**
   * Update team member role
   */
  async updateMemberRole(teamId: string, userId: string, role: 'MANAGER' | 'MEMBER') {
    return this.prisma.teamMember.updateMany({
      where: {
        teamId,
        userId,
        deletedAt: null,
      },
      data: { role },
    });
  }

  /**
   * Remove team member (soft delete)
   */
  async removeMember(teamId: string, userId: string) {
    return this.prisma.teamMember.updateMany({
      where: {
        teamId,
        userId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Find user in workspace
   */
  async findUserInWorkspace(userId: string, workspaceId: string) {
    return this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
      },
    });
  }

  /**
   * Execute transaction
   */
  async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
