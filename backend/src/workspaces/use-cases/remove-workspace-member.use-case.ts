import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

/**
 * Use Case: Remove Workspace Member
 * Removes a user from a workspace (soft delete)
 */
@Injectable()
export class RemoveWorkspaceMemberUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(workspaceId: string, userId: string) {
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

    // Remove member
    await this.workspacesRepository.removeMember(workspaceId, userId);

    return { message: 'Member removed successfully' };
  }
}
