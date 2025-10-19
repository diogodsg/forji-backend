import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

/**
 * Use Case: Find One Workspace
 * Returns workspace details with members
 */
@Injectable()
export class FindOneWorkspaceUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(id: string, includeMembers: boolean = false) {
    const workspace = includeMembers
      ? await this.workspacesRepository.findByIdWithMembers(id)
      : await this.workspacesRepository.findById(id);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }
}
