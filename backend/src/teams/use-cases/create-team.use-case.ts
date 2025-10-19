import { Injectable, ConflictException } from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';
import { CreateTeamDto } from '../dto/create-team.dto';

/**
 * Use Case: Create Team
 * Creates a new team in a workspace
 */
@Injectable()
export class CreateTeamUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(createTeamDto: CreateTeamDto, workspaceId: string) {
    // Check if team name already exists in workspace
    const existing = await this.teamsRepository.findByName(createTeamDto.name, workspaceId);
    if (existing) {
      throw new ConflictException('Team name already exists in this workspace');
    }

    // Create team
    return this.teamsRepository.create({
      name: createTeamDto.name,
      description: createTeamDto.description,
      workspaceId,
      status: 'ACTIVE',
    });
  }
}
