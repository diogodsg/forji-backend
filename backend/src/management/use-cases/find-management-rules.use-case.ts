import { Injectable } from '@nestjs/common';
import { ManagementRepository } from '../repositories/management.repository';

/**
 * Use Case: Find Management Rules
 * Returns management rules (hierarchy) for a workspace
 */
@Injectable()
export class FindManagementRulesUseCase {
  constructor(private readonly managementRepository: ManagementRepository) {}

  async execute(params: { managerId?: string; subordinateId?: string; workspaceId: string }) {
    return this.managementRepository.findRules(params);
  }
}
