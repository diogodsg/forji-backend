import { Injectable } from '@nestjs/common';
import { ManagementRepository } from '../repositories/management.repository';

/**
 * Use Case: Get User Hierarchy
 * Returns managers and subordinates for a specific user
 */
@Injectable()
export class GetUserHierarchyUseCase {
  constructor(private readonly managementRepository: ManagementRepository) {}

  async execute(userId: string, workspaceId: string) {
    // Get user's managers
    const managers = await this.managementRepository.findRules({
      subordinateId: userId,
      workspaceId,
    });

    // Get user's subordinates
    const subordinates = await this.managementRepository.findRules({
      managerId: userId,
      workspaceId,
    });

    return {
      managers: managers.map((rule) => ({
        id: rule.id,
        manager: rule.manager,
        ruleType: rule.ruleType,
        team: rule.team,
      })),
      subordinates: subordinates.map((rule) => ({
        id: rule.id,
        subordinate: rule.subordinate,
        team: rule.team,
        ruleType: rule.ruleType,
      })),
    };
  }
}
