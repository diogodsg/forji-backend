import { Injectable, ConflictException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';

interface CreateWorkspaceDto {
  name: string;
  slug: string;
}

/**
 * Use Case: Create Workspace
 * Creates a new workspace and adds creator as OWNER
 */
@Injectable()
export class CreateWorkspaceUseCase {
  constructor(private readonly workspacesRepository: WorkspacesRepository) {}

  async execute(createWorkspaceDto: CreateWorkspaceDto, creatorId: string) {
    // Check if slug already exists
    const existing = await this.workspacesRepository.findBySlug(createWorkspaceDto.slug);
    if (existing) {
      throw new ConflictException('Workspace slug already exists');
    }

    // Create workspace and add creator as owner in transaction
    return this.workspacesRepository.transaction(async (tx) => {
      // Create workspace
      const workspace = await tx.workspace.create({
        data: {
          name: createWorkspaceDto.name,
          slug: createWorkspaceDto.slug,
        },
      });

      // Add creator as owner
      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: creatorId,
          role: 'OWNER',
        },
      });

      return workspace;
    });
  }
}
