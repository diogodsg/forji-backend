import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';
import { AddMemberDto } from '../dto/team-member.dto';

/**
 * Use Case: Add Team Member
 * Adds a user to a team with a specific role
 */
@Injectable()
export class AddTeamMemberUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(teamId: string, addMemberDto: AddMemberDto, workspaceId: string) {
    // 1. Verify team exists
    const team = await this.teamsRepository.findById(teamId, workspaceId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // 2. Verify user exists in workspace
    const userInWorkspace = await this.teamsRepository.findUserInWorkspace(
      addMemberDto.userId,
      workspaceId,
    );
    if (!userInWorkspace) {
      throw new BadRequestException('User not found in workspace');
    }

    // 3. Check if user is already a member
    const existingMember = await this.teamsRepository.findTeamMember(teamId, addMemberDto.userId);
    if (existingMember) {
      throw new ConflictException('User is already a member of this team');
    }

    // 4. Add member
    await this.teamsRepository.addMember({
      teamId,
      userId: addMemberDto.userId,
      role: addMemberDto.role || 'MEMBER',
    });

    return { message: 'Member added successfully' };
  }
}
