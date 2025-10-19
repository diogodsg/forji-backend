import { Injectable } from '@nestjs/common';
import {
  FindAllWorkspacesUseCase,
  FindOneWorkspaceUseCase,
  CreateWorkspaceUseCase,
  UpdateWorkspaceUseCase,
  DeleteWorkspaceUseCase,
  AddWorkspaceMemberUseCase,
  RemoveWorkspaceMemberUseCase,
  UpdateWorkspaceMemberRoleUseCase,
} from './use-cases';

/**
 * Workspaces Service - Refactored
 * Facade pattern that delegates to use cases
 */
@Injectable()
export class WorkspacesService {
  constructor(
    private readonly findAllWorkspacesUseCase: FindAllWorkspacesUseCase,
    private readonly findOneWorkspaceUseCase: FindOneWorkspaceUseCase,
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
    private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase,
    private readonly deleteWorkspaceUseCase: DeleteWorkspaceUseCase,
    private readonly addWorkspaceMemberUseCase: AddWorkspaceMemberUseCase,
    private readonly removeWorkspaceMemberUseCase: RemoveWorkspaceMemberUseCase,
    private readonly updateWorkspaceMemberRoleUseCase: UpdateWorkspaceMemberRoleUseCase,
  ) {}

  async findAll(userId: string) {
    return this.findAllWorkspacesUseCase.execute(userId);
  }

  async findOne(id: string) {
    return this.findOneWorkspaceUseCase.execute(id);
  }

  async create(data: any, creatorId: string) {
    return this.createWorkspaceUseCase.execute(data, creatorId);
  }

  async update(id: string, data: any) {
    return this.updateWorkspaceUseCase.execute(id, data);
  }

  async delete(id: string) {
    return this.deleteWorkspaceUseCase.execute(id);
  }

  async addMember(workspaceId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
    return this.addWorkspaceMemberUseCase.execute(workspaceId, userId, role);
  }

  async removeMember(workspaceId: string, userId: string) {
    return this.removeWorkspaceMemberUseCase.execute(workspaceId, userId);
  }

  async updateMemberRole(workspaceId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
    return this.updateWorkspaceMemberRoleUseCase.execute(workspaceId, userId, role);
  }

  // Additional methods needed by controller
  async getUserWorkspaces(userId: string) {
    return this.findAllWorkspacesUseCase.execute(userId);
  }

  async createWorkspace(userId: string, data: any) {
    return this.createWorkspaceUseCase.execute(data, userId);
  }

  async getWorkspace(workspaceId: string, userId: string) {
    // TODO: Add permission check for userId
    return this.findOneWorkspaceUseCase.execute(workspaceId);
  }

  async updateWorkspace(workspaceId: string, userId: string, data: any) {
    // TODO: Add permission check for userId
    return this.updateWorkspaceUseCase.execute(workspaceId, data);
  }

  async deleteWorkspace(workspaceId: string, userId: string) {
    // TODO: Add permission check for userId
    return this.deleteWorkspaceUseCase.execute(workspaceId);
  }

  async getWorkspaceMembers(workspaceId: string, userId: string) {
    // TODO: Add permission check and return members
    const workspace: any = await this.findOneWorkspaceUseCase.execute(workspaceId);
    return workspace.members || [];
  }

  async inviteToWorkspace(workspaceId: string, userId: string, inviteDto: any) {
    // TODO: Add permission check
    return this.addWorkspaceMemberUseCase.execute(workspaceId, inviteDto.userId, inviteDto.role);
  }

  async leaveWorkspace(workspaceId: string, userId: string) {
    return this.removeWorkspaceMemberUseCase.execute(workspaceId, userId);
  }
}
