import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';
import { UpdateTeamDto } from '../dto/update-team.dto';

/**
 * Use Case: Update Team
 * Updates team information
 */
@Injectable()
export class UpdateTeamUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(id: string, updateTeamDto: UpdateTeamDto, workspaceId: string) {
    // Check if team exists
    const team = await this.teamsRepository.findById(id, workspaceId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Update team
    return this.teamsRepository.update(id, updateTeamDto);
  }
}
