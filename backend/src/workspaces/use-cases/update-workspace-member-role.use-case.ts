import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

/**
 * Use Case: Update Workspace Member Role
 * Changes a workspace member's role
 */
@Injectable()
export class UpdateWorkspaceMemberRoleUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(workspaceId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
    // Check if workspace exists
    const workspace = await this.workspacesRepository.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is a member
    const member = await this.workspacesRepository.findMember(workspaceId, userId);
    if (!member) {
      throw new NotFoundException('User is not a member of this workspace');
    }

    // Update role
    await this.workspacesRepository.updateMemberRole(workspaceId, userId, role);

    return { message: 'Member role updated successfully' };
  }
}
