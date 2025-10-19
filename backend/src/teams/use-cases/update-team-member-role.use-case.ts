import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';
import { UpdateMemberRoleDto } from '../dto/team-member.dto';

/**
 * Use Case: Update Team Member Role
 * Changes a team member's role (MEMBER <-> MANAGER)
 */
@Injectable()
export class UpdateTeamMemberRoleUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(
    teamId: string,
    userId: string,
    updateRoleDto: UpdateMemberRoleDto,
    workspaceId: string,
  ) {
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

    // 3. Update role
    await this.teamsRepository.updateMemberRole(teamId, userId, updateRoleDto.role);

    return { message: 'Member role updated successfully' };
  }
}
