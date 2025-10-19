import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

/**
 * Use Case: Find All Workspaces
 * Returns all workspaces for a user
 */
@Injectable()
export class FindAllWorkspacesUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(userId?: string) {
    if (userId) {
      // Filter workspaces where user is a member
      return this.workspacesRepository.findAll({
        where: {
          members: {
            some: {
              userId,
              deletedAt: null,
            },
          },
        },
      });
    }

    return this.workspacesRepository.findAll();
  }
}
