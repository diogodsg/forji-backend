import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service responsible for permission checks and authorization
 * - Check if user is admin in workspace
 * - Check if user can perform actions
 */
@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if requester is admin (OWNER or ADMIN) in same workspace as target user
   */
  async isWorkspaceAdmin(requesterId: string, targetUserId: string): Promise<boolean> {
    // Get requester's workspace memberships where they are OWNER or ADMIN
    const requesterMemberships = await this.prisma.workspaceMember.findMany({
      where: {
        userId: requesterId,
        role: {
          in: ['OWNER', 'ADMIN'],
        },
        deletedAt: null,
      },
      select: { workspaceId: true },
    });

    if (requesterMemberships.length === 0) {
      return false;
    }

    const adminWorkspaceIds = requesterMemberships.map((m) => m.workspaceId);

    // Check if target user is in any of these workspaces
    const targetInWorkspace = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: targetUserId,
        workspaceId: {
          in: adminWorkspaceIds,
        },
        deletedAt: null,
      },
    });

    return !!targetInWorkspace;
  }

  /**
   * Ensure requester is admin, throw if not
   */
  async ensureWorkspaceAdmin(requesterId: string, targetUserId: string): Promise<void> {
    const isAdmin = await this.isWorkspaceAdmin(requesterId, targetUserId);
    if (!isAdmin) {
      throw new ForbiddenException('Only workspace admins can perform this action');
    }
  }

  /**
   * Check if user can edit another user (self or admin)
   */
  async canEditUser(requesterId: string, targetUserId: string): Promise<boolean> {
    // Users can always edit themselves
    if (requesterId === targetUserId) {
      return true;
    }

    // Otherwise, must be admin
    return this.isWorkspaceAdmin(requesterId, targetUserId);
  }

  /**
   * Ensure user can edit target, throw if not
   */
  async ensureCanEditUser(requesterId: string, targetUserId: string): Promise<void> {
    const canEdit = await this.canEditUser(requesterId, targetUserId);
    if (!canEdit) {
      throw new ForbiddenException('You can only edit your own profile or must be an admin');
    }
  }

  /**
   * Get user's active workspace memberships
   */
  async getUserWorkspaces(userId: string): Promise<string[]> {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        workspaceId: true,
      },
    });

    return memberships.map((m) => m.workspaceId);
  }

  /**
   * Get user's most recent workspace
   */
  async getUserPrimaryWorkspace(userId: string): Promise<string | null> {
    const membership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        joinedAt: 'desc',
      },
      select: {
        workspaceId: true,
      },
    });

    return membership?.workspaceId || null;
  }
}
