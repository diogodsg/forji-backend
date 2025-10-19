import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

interface UpdateWorkspaceDto {
  name?: string;
  slug?: string;
}

/**
 * Use Case: Update Workspace
 * Updates workspace information
 */
@Injectable()
export class UpdateWorkspaceUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    // Check if workspace exists
    const workspace = await this.workspacesRepository.findById(id);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Update workspace
    return this.workspacesRepository.update(id, updateWorkspaceDto);
  }
}
