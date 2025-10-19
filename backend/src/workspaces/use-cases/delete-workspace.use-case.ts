import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

/**
 * Use Case: Delete Workspace
 * Soft deletes a workspace
 */
@Injectable()
export class DeleteWorkspaceUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(id: string) {
    // Check if workspace exists
    const workspace = await this.workspacesRepository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Soft delete workspace
    await this.workspacesRepository.softDelete(id);

    return { message: 'Workspace deleted successfully' };
  }
}
