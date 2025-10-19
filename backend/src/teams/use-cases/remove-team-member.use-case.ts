import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';

/**
 * Use Case: Remove Team Member
 * Removes a user from a team (soft delete)
 */
@Injectable()
export class RemoveTeamMemberUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(teamId: string, userId: string, workspaceId: string) {
    // 1. Verify team exists
    const team = await this.teamsRepository.findById(teamId, workspaceId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // 2. Verify user is a member
    const member = await this.teamsRepository.findTeamMember(teamId, userId);
    if (!member) {
      throw new NotFoundException('User is not a member of this team');
    }

    // 3. Remove member
    await this.teamsRepository.removeMember(teamId, userId);

    return { message: 'Member removed successfully' };
  }
}
