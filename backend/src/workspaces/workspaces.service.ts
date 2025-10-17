import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteToWorkspaceDto } from './dto';
import { WorkspaceEntity, toWorkspaceWithRole } from '../auth/entities/workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all workspaces for a user
   */
  async getUserWorkspaces(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId: userId },
      include: { workspace: true },
    });

    return memberships.map(toWorkspaceWithRole);
  }

  /**
   * Get workspace details (user must be a member)
   */
  async getWorkspace(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        unique_user_workspace: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
      include: { workspace: true },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    const workspace = membership.workspace;

    // Get member count
    const memberCount = await this.prisma.workspaceMember.count({
      where: { workspaceId: workspaceId },
    });

    return {
      ...workspace,
      role: membership.role,
      memberCount,
    };
  }

  /**
   * Create a new workspace
   */
  async createWorkspace(userId: string, createDto: CreateWorkspaceDto) {
    const slug = this.generateSlug(createDto.name);

    // Check if slug already exists
    const existing = await this.prisma.workspace.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('A workspace with this name already exists');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // Create workspace
      const workspace = await tx.workspace.create({
        data: {
          name: createDto.name,
          slug,
          description: createDto.description,
          avatarUrl: createDto.avatarUrl,
          status: 'ACTIVE',
        },
      });

      // Add creator as owner
      await tx.workspaceMember.create({
        data: {
          userId: userId,
          workspaceId: workspace.id,
          role: 'OWNER',
        },
      });

      return workspace;
    });

    return result;
  }

  /**
   * Update workspace (only OWNER and ADMIN can update)
   */
  async updateWorkspace(workspaceId: string, userId: string, updateDto: UpdateWorkspaceDto) {
    // Check permissions
    const membership = await this.checkWorkspaceAccess(workspaceId, userId, ['OWNER', 'ADMIN']);

    // Update slug if name changed
    const updateData: any = { ...updateDto };
    if (updateDto.name) {
      updateData.slug = this.generateSlug(updateDto.name);
    }

    const workspace = await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name: updateData.name,
        slug: updateData.slug,
        description: updateData.description,
        avatarUrl: updateData.avatarUrl,
      },
    });

    return workspace;
  }

  /**
   * Delete workspace (only OWNER)
   */
  async deleteWorkspace(workspaceId: string, userId: string) {
    await this.checkWorkspaceAccess(workspaceId, userId, ['OWNER']);

    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        status: 'ARCHIVED',
        deletedAt: new Date(),
      },
    });

    return { message: 'Workspace archived successfully' };
  }

  /**
   * Get workspace members
   */
  async getWorkspaceMembers(workspaceId: string, userId: string) {
    // Check if user has access to workspace
    await this.checkWorkspaceAccess(workspaceId, userId);

    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId: workspaceId },
      include: {
        user: true,
      },
    });

    return members.map((member) => ({
      id: member.user.id,
      email: member.user.email,
      name: member.user.name,
      position: member.user.position,
      role: member.role,
      joinedAt: member.joinedAt,
    }));
  }

  /**
   * Invite user to workspace (OWNER and ADMIN only)
   */
  async inviteToWorkspace(
    workspaceId: string,
    adminUserId: string,
    inviteDto: InviteToWorkspaceDto,
  ) {
    // Check admin permissions
    await this.checkWorkspaceAccess(workspaceId, adminUserId, ['OWNER', 'ADMIN']);

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: inviteDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already a member
    const existing = await this.prisma.workspaceMember.findUnique({
      where: {
        unique_user_workspace: {
          userId: inviteDto.userId,
          workspaceId: workspaceId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this workspace');
    }

    // Add member
    const membership = await this.prisma.workspaceMember.create({
      data: {
        userId: inviteDto.userId,
        workspaceId: workspaceId,
        role: inviteDto.role,
      },
      include: {
        user: true,
      },
    });

    return {
      id: membership.user.id,
      email: membership.user.email,
      name: membership.user.name,
      role: membership.role,
      joinedAt: membership.joinedAt,
    };
  }

  /**
   * Remove member from workspace (OWNER and ADMIN only)
   */
  async removeMember(workspaceId: string, adminUserId: string, memberUserId: string) {
    // Check admin permissions
    const adminMembership = await this.checkWorkspaceAccess(workspaceId, adminUserId, [
      'OWNER',
      'ADMIN',
    ]);

    // Check if member exists
    const memberMembership = await this.prisma.workspaceMember.findUnique({
      where: {
        unique_user_workspace: {
          userId: memberUserId,
          workspaceId: workspaceId,
        },
      },
    });

    if (!memberMembership) {
      throw new NotFoundException('Member not found in this workspace');
    }

    // Prevent removing the last owner
    if (memberMembership.role === 'OWNER') {
      const ownerCount = await this.prisma.workspaceMember.count({
        where: {
          workspaceId: workspaceId,
          role: 'OWNER',
        },
      });

      if (ownerCount === 1) {
        throw new ForbiddenException('Cannot remove the last owner of the workspace');
      }
    }

    // ADMIN cannot remove OWNER
    if (adminMembership.role === 'ADMIN' && memberMembership.role === 'OWNER') {
      throw new ForbiddenException('Admins cannot remove owners');
    }

    await this.prisma.workspaceMember.delete({
      where: {
        unique_user_workspace: {
          userId: memberUserId,
          workspaceId: workspaceId,
        },
      },
    });

    return { message: 'Member removed successfully' };
  }

  /**
   * Leave workspace
   */
  async leaveWorkspace(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        unique_user_workspace: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('You are not a member of this workspace');
    }

    // Prevent last owner from leaving
    if (membership.role === 'OWNER') {
      const ownerCount = await this.prisma.workspaceMember.count({
        where: {
          workspaceId: workspaceId,
          role: 'OWNER',
        },
      });

      if (ownerCount === 1) {
        throw new ForbiddenException('Cannot leave as the last owner. Transfer ownership first.');
      }
    }

    await this.prisma.workspaceMember.delete({
      where: {
        unique_user_workspace: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });

    return { message: 'Left workspace successfully' };
  }

  /**
   * Helper: Check if user has access to workspace with specific roles
   */
  private async checkWorkspaceAccess(workspaceId: string, userId: string, allowedRoles?: string[]) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        unique_user_workspace: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    if (allowedRoles && !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return membership;
  }

  /**
   * Helper: Generate URL-safe slug from name
   */
  private generateSlug(name: string): string {
    return `${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}-${Date.now()}`;
  }
}
