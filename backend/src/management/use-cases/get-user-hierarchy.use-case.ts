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
    const startTime = Date.now();

    // 🚀 OTIMIZAÇÃO: Executar consultas em paralelo
    const [managers, subordinates] = await Promise.all([
      // Get user's managers
      this.managementRepository.findRules({
        subordinateId: userId,
        workspaceId,
      }),
      // Get user's subordinates
      this.managementRepository.findRules({
        managerId: userId,
        workspaceId,
      }),
    ]);

    const executionTime = Date.now() - startTime;
    console.log(
      `[GetUserHierarchyUseCase] Hierarchy query executed in ${executionTime}ms for user ${userId} (${managers.length} managers, ${subordinates.length} subordinates)`,
    );

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
