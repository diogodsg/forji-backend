import { Injectable, NotFoundException } from '@nestjs/common';
import { ManagementRepository } from '../repositories/management.repository';

/**
 * Use Case: Delete Management Rule
 * Removes a management rule (soft delete)
 */
@Injectable()
export class DeleteManagementRuleUseCase {
  constructor(private readonly managementRepository: ManagementRepository) {}

  async execute(ruleId: string) {
    // Note: We could add validation here to check if rule exists
    // but the repository will handle the not found case

    await this.managementRepository.deleteRule(ruleId);

    return { message: 'Management rule deleted successfully' };
  }
}
