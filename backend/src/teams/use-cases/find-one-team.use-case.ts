import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';

/**
 * Use Case: Find One Team
 * Returns team details with members
 */
@Injectable()
export class FindOneTeamUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(id: string, workspaceId: string, includeMembers: boolean = true) {
    const team = includeMembers
      ? await this.teamsRepository.findByIdWithMembers(id, workspaceId)
      : await this.teamsRepository.findById(id, workspaceId);

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }
}
