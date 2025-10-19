import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TeamStatus } from '@prisma/client';
import { TeamsRepository } from '../repositories/teams.repository';

/**
 * Use Case: Find All Teams
 * Returns teams with optional member count and sorting
 */
@Injectable()
export class FindAllTeamsUseCase {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async execute(
    workspaceId: string,
    status?: TeamStatus,
    includeMembers: boolean = false,
    includeMemberCount: boolean = false,
  ) {
    const teams = await this.teamsRepository.findMany({
      workspaceId,
      status,
      includeMembers,
      includeMemberCount,
    });

    // Transform and sort if member count is requested
    if (includeMemberCount) {
      const mappedTeams = teams.map((team: any) => {
        const allMembers = team.members || [];
        const managerMember = allMembers.find((m: any) => m.role === 'MANAGER');
        const managers = allMembers.filter((m: any) => m.role === 'MANAGER').length;
        const members = allMembers.length;
        const { members: _, ...teamWithoutMembers } = team;

        return {
          ...teamWithoutMembers,
          memberCount: members,
          managers,
          members,
          leaderName: managerMember ? managerMember.user.name : null,
        };
      });

      // Sort by member count (descending)
      return mappedTeams.sort((a, b) => b.members - a.members);
    }

    return teams;
  }
}
