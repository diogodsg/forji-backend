import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';

/**
 * Use Case: Delete Team
 * Soft deletes a team
 */
@Injectable()
export class DeleteTeamUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(id: string, workspaceId: string) {
    // Check if team exists
    const team = await this.teamsRepository.findById(id, workspaceId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Soft delete team
    await this.teamsRepository.softDelete(id);

    return { message: 'Team deleted successfully' };
  }
}
