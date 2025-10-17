import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto, UpdateTeamDto, AddMemberDto, UpdateMemberRoleDto } from './dto';
import { TeamStatus, WorkspaceRole } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all teams (filtered by workspace)
   */
  async findAll(
    workspaceId: string,
    status?: TeamStatus,
    includeMembers: boolean = false,
    includeMemberCount: boolean = false,
  ) {
    const where: any = {
      workspaceId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    const teams = await this.prisma.team.findMany({
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
                },
              },
            },
          },
        }),
        ...(includeMemberCount && {
          _count: {
            select: { members: true },
          },
        }),
      },
    });

    return teams;
  }

  /**
   * Search teams by name
   */
  async search(workspaceId: string, query: string) {
    return this.prisma.team.findMany({
      where: {
        workspaceId,
        deletedAt: null,
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });
  }

  /**
   * Find team by ID
   */
  async findOne(id: string, workspaceId: string, includeMembers: boolean = false) {
    const team = await this.prisma.team.findFirst({
      where: {
        id,
        workspaceId,
        deletedAt: null,
      },
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
                  bio: true,
                },
              },
            },
          },
        }),
        _count: {
          select: { members: true },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  /**
   * Create new team
   */
  async create(workspaceId: string, createTeamDto: CreateTeamDto, userId: string) {
    // Check if team name already exists in this workspace
    const existing = await this.prisma.team.findFirst({
      where: {
        workspaceId,
        name: createTeamDto.name,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('Team name already exists in this workspace');
    }

    // Verify user has permission (must be OWNER or ADMIN in workspace)
    await this.checkWorkspacePermission(userId, workspaceId, ['OWNER', 'ADMIN']);

    return this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        description: createTeamDto.description,
        workspaceId,
        status: 'ACTIVE',
      },
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
  async update(id: string, workspaceId: string, updateTeamDto: UpdateTeamDto, userId: string) {
    // Check if team exists
    const team = await this.findOne(id, workspaceId);

    // Check if user is team manager or workspace admin
    const canManage = await this.canManageTeam(userId, id, workspaceId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to update this team');
    }

    // If updating name, check for conflicts
    if (updateTeamDto.name && updateTeamDto.name !== team.name) {
      const existing = await this.prisma.team.findFirst({
        where: {
          workspaceId,
          name: updateTeamDto.name,
          deletedAt: null,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException('Team name already exists in this workspace');
      }
    }

    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
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
   * Delete team (soft delete)
   */
  async remove(id: string, workspaceId: string, userId: string) {
    // Check if team exists
    await this.findOne(id, workspaceId);

    // Only workspace OWNER or ADMIN can delete teams
    await this.checkWorkspacePermission(userId, workspaceId, ['OWNER', 'ADMIN']);

    await this.prisma.team.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Team deleted successfully' };
  }

  /**
   * Get team members
   */
  async getMembers(id: string, workspaceId: string) {
    // Check if team exists
    await this.findOne(id, workspaceId);

    return this.prisma.teamMember.findMany({
      where: {
        teamId: id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            position: true,
            bio: true,
          },
        },
      },
      orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
    });
  }

  /**
   * Add member to team
   */
  async addMember(
    teamId: string,
    workspaceId: string,
    addMemberDto: AddMemberDto,
    requesterId: string,
  ) {
    // Check if team exists
    await this.findOne(teamId, workspaceId);

    // Check permissions
    const canManage = await this.canManageTeam(requesterId, teamId, workspaceId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to add members to this team');
    }

    // Verify user exists and is in the same workspace
    const userInWorkspace = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: addMemberDto.userId,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!userInWorkspace) {
      throw new BadRequestException('User not found in this workspace');
    }

    // Check if already a member
    const existing = await this.prisma.teamMember.findFirst({
      where: {
        userId: addMemberDto.userId,
        teamId,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this team');
    }

    return this.prisma.teamMember.create({
      data: {
        userId: addMemberDto.userId,
        teamId,
        role: addMemberDto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            position: true,
          },
        },
      },
    });
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    workspaceId: string,
    updateRoleDto: UpdateMemberRoleDto,
    requesterId: string,
  ) {
    // Check if team exists
    await this.findOne(teamId, workspaceId);

    // Check permissions
    const canManage = await this.canManageTeam(requesterId, teamId, workspaceId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to update member roles');
    }

    // Check if member exists
    const member = await this.prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
        deletedAt: null,
      },
    });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    return this.prisma.teamMember.update({
      where: { id: member.id },
      data: { role: updateRoleDto.role },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            position: true,
          },
        },
      },
    });
  }

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, userId: string, workspaceId: string, requesterId: string) {
    // Check if team exists
    await this.findOne(teamId, workspaceId);

    // Check permissions
    const canManage = await this.canManageTeam(requesterId, teamId, workspaceId);
    if (!canManage) {
      throw new ForbiddenException('You do not have permission to remove members from this team');
    }

    // Check if member exists
    const member = await this.prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
        deletedAt: null,
      },
    });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    await this.prisma.teamMember.update({
      where: { id: member.id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Member removed successfully' };
  }

  /**
   * Helper: Check if user has workspace permission
   */
  private async checkWorkspacePermission(
    userId: string,
    workspaceId: string,
    allowedRoles: WorkspaceRole[],
  ) {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
        role: {
          in: allowedRoles,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return membership;
  }

  /**
   * Helper: Check if user can manage team (is manager or workspace admin)
   */
  private async canManageTeam(
    userId: string,
    teamId: string,
    workspaceId: string,
  ): Promise<boolean> {
    // Check if user is workspace OWNER or ADMIN
    const workspaceMembership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
        role: {
          in: ['OWNER', 'ADMIN'],
        },
      },
    });

    if (workspaceMembership) {
      return true;
    }

    // Check if user is team MANAGER
    const teamMembership = await this.prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
        deletedAt: null,
        role: 'MANAGER',
      },
    });

    return !!teamMembership;
  }
}
