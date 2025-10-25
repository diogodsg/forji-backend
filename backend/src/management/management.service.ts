import { Injectable } from '@nestjs/common';
import {
  FindManagementRulesUseCase,
  CreateManagementRuleUseCase,
  DeleteManagementRuleUseCase,
  GetUserHierarchyUseCase,
} from './use-cases';

/**
 * Management Service - Refactored
 * Facade pattern that delegates to use cases
 */
@Injectable()
export class ManagementService {
  constructor(
    private readonly findManagementRulesUseCase: FindManagementRulesUseCase,
    private readonly createManagementRuleUseCase: CreateManagementRuleUseCase,
    private readonly deleteManagementRuleUseCase: DeleteManagementRuleUseCase,
    private readonly getUserHierarchyUseCase: GetUserHierarchyUseCase,
  ) {}

  async findRules(workspaceId: string, userId?: string) {
    return this.findManagementRulesUseCase.execute({
      workspaceId,
      managerId: userId,
    });
  }

  async createRule(workspaceId: string, data: any) {
    return this.createManagementRuleUseCase.execute(data, workspaceId);
  }

  async deleteRule(id: string) {
    return this.deleteManagementRuleUseCase.execute(id);
  }

  async getUserHierarchy(userId: string, workspaceId: string) {
    return this.getUserHierarchyUseCase.execute(userId, workspaceId);
  }

  // Additional methods needed by controller
  async getMySubordinates(userId: string, workspaceId: string, includeTeamMembers: boolean) {
    const hierarchy = await this.getUserHierarchyUseCase.execute(userId, workspaceId);
    // Return subordinates from hierarchy
    return hierarchy.subordinates || [];
  }

  async getUserManagers(userId: string, workspaceId: string) {
    const hierarchy = await this.getUserHierarchyUseCase.execute(userId, workspaceId);
    // Return managers from hierarchy
    return hierarchy.managers || [];
  }

  async getMyTeams(userId: string, workspaceId: string) {
    const rules = await this.findManagementRulesUseCase.execute({
      workspaceId,
      managerId: userId,
    });
    // Filter for TEAM type rules
    return rules.filter((rule: any) => rule.ruleType === 'TEAM');
  }

  async getAllRules(
    workspaceId: string,
    workspaceRole: string,
    managerId?: string,
    subordinateId?: string,
    type?: string,
  ) {
    return this.findManagementRulesUseCase.execute({
      workspaceId,
      managerId,
      subordinateId,
    });
  }

  async isUserManagedBy(userId: string, managerId: string, workspaceId: string) {
    console.log('🔍 [ManagementService] isUserManagedBy chamado:', {
      userId,
      managerId,
      workspaceId,
    });

    const hierarchy = await this.getUserHierarchyUseCase.execute(userId, workspaceId);

    console.log('🔍 [ManagementService] Hierarquia retornada:', {
      userId,
      managers: hierarchy.managers,
      managersCount: hierarchy.managers?.length || 0,
    });

    // Check if managerId is in the user's managers list
    // Note: hierarchy.managers contains objects with { id: ruleId, manager: { id: managerId, ... } }
    const result = hierarchy.managers?.some((m: any) => m.manager?.id === managerId) || false;

    console.log('🔍 [ManagementService] Resultado da verificação:', {
      result,
      managerId,
      managerIds: hierarchy.managers?.map((m: any) => m.manager?.id) || [],
    });

    return result;
  }
}
