import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

/**
 * Use Case: Add Workspace Member
 * Adds a user to a workspace with a specific role
 */
@Injectable()
export class AddWorkspaceMemberUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(
    workspaceId: string,
    userId: string,
    role: 'OWNER' | 'ADMIN' | 'MEMBER' = 'MEMBER',
  ) {
    // Check if workspace exists
    const workspace = await this.workspacesRepository.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is already a member
    const existingMember = await this.workspacesRepository.findMember(workspaceId, userId);
    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    // Add member
    await this.workspacesRepository.addMember({
      workspaceId,
      userId,
      role,
    });

    return { message: 'Member added successfully' };
  }
}
