import { Injectable } from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto, AddMemberDto, UpdateMemberRoleDto } from './dto';
import { TeamStatus } from '@prisma/client';
import {
  FindAllTeamsUseCase,
  FindOneTeamUseCase,
  CreateTeamUseCase,
  UpdateTeamUseCase,
  DeleteTeamUseCase,
  AddTeamMemberUseCase,
  RemoveTeamMemberUseCase,
  UpdateTeamMemberRoleUseCase,
} from './use-cases';

/**
 * Teams Service - Facade Pattern
 * Delegates all operations to specialized use cases
 */
@Injectable()
export class TeamsService {
  constructor(
    private readonly findAllTeamsUseCase: FindAllTeamsUseCase,
    private readonly findOneTeamUseCase: FindOneTeamUseCase,
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly updateTeamUseCase: UpdateTeamUseCase,
    private readonly deleteTeamUseCase: DeleteTeamUseCase,
    private readonly addTeamMemberUseCase: AddTeamMemberUseCase,
    private readonly removeTeamMemberUseCase: RemoveTeamMemberUseCase,
    private readonly updateTeamMemberRoleUseCase: UpdateTeamMemberRoleUseCase,
  ) {}

  /**
   * Find all teams (filtered by workspace)
   */
  async findAll(
    workspaceId: string,
    status?: TeamStatus,
    includeMembers: boolean = false,
    includeMemberCount: boolean = false,
  ) {
    return this.findAllTeamsUseCase.execute(
      workspaceId,
      status,
      includeMembers,
      includeMemberCount,
    );
  }

  /**
   * Find team by ID
   */
  async findOne(id: string, workspaceId: string, includeMembers: boolean = true) {
    return this.findOneTeamUseCase.execute(id, workspaceId, includeMembers);
  }

  /**
   * Create new team
   */
  async create(createTeamDto: CreateTeamDto, workspaceId: string) {
    return this.createTeamUseCase.execute(createTeamDto, workspaceId);
  }

  /**
   * Update team
   */
  async update(id: string, updateTeamDto: UpdateTeamDto, workspaceId: string) {
    return this.updateTeamUseCase.execute(id, updateTeamDto, workspaceId);
  }

  /**
   * Delete team (soft delete)
   */
  async remove(id: string, workspaceId: string) {
    return this.deleteTeamUseCase.execute(id, workspaceId);
  }

  /**
   * Add member to team
   */
  async addMember(teamId: string, addMemberDto: AddMemberDto, workspaceId: string) {
    return this.addTeamMemberUseCase.execute(teamId, addMemberDto, workspaceId);
  }

  /**
   * Remove member from team
   */
  async removeMember(teamId: string, userId: string, workspaceId: string) {
    return this.removeTeamMemberUseCase.execute(teamId, userId, workspaceId);
  }

  /**
   * Update team member role
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    updateRoleDto: UpdateMemberRoleDto,
    workspaceId: string,
  ) {
    return this.updateTeamMemberRoleUseCase.execute(teamId, userId, updateRoleDto, workspaceId);
  }

  /**
   * Search teams by name
   */
  async search(workspaceId: string, query: string) {
    return this.findAllTeamsUseCase.execute(workspaceId, undefined, true, true);
    // TODO: Implement proper search in use case or filter results here
  }

  /**
   * Get team members
   */
  async getMembers(teamId: string, workspaceId: string) {
    const team: any = await this.findOneTeamUseCase.execute(teamId, workspaceId, true);
    return team.members || [];
  }
}
