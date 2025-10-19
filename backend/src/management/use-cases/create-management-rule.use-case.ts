import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { ManagementRepository } from '../repositories/management.repository';

interface CreateManagementRuleDto {
  managerId: string;
  subordinateId?: string;
  teamId?: string;
  ruleType: 'INDIVIDUAL' | 'TEAM';
}

/**
 * Use Case: Create Management Rule
 * Creates a manager-subordinate or manager-team relationship
 */
@Injectable()
export class CreateManagementRuleUseCase {
  constructor(private readonly managementRepository: ManagementRepository) {}

  async execute(createRuleDto: CreateManagementRuleDto, workspaceId: string) {
    // Validate: must have either subordinateId or teamId, not both
    if (createRuleDto.ruleType === 'INDIVIDUAL' && !createRuleDto.subordinateId) {
      throw new BadRequestException('subordinateId is required for INDIVIDUAL rule type');
    }

    if (createRuleDto.ruleType === 'TEAM' && !createRuleDto.teamId) {
      throw new BadRequestException('teamId is required for TEAM rule type');
    }

    // Validate manager exists in workspace
    const managerInWorkspace = await this.managementRepository.findUserInWorkspace(
      createRuleDto.managerId,
      workspaceId,
    );
    if (!managerInWorkspace) {
      throw new BadRequestException('Manager not found in workspace');
    }

    // Validate subordinate exists in workspace (if INDIVIDUAL)
    if (createRuleDto.ruleType === 'INDIVIDUAL' && createRuleDto.subordinateId) {
      const subordinateInWorkspace = await this.managementRepository.findUserInWorkspace(
        createRuleDto.subordinateId,
        workspaceId,
      );
      if (!subordinateInWorkspace) {
        throw new BadRequestException('Subordinate not found in workspace');
      }

      // Check if rule already exists
      const existing = await this.managementRepository.findRule({
        managerId: createRuleDto.managerId,
        subordinateId: createRuleDto.subordinateId,
        workspaceId,
      });
      if (existing) {
        throw new ConflictException('Management rule already exists');
      }
    }

    // Validate team exists in workspace (if TEAM)
    if (createRuleDto.ruleType === 'TEAM' && createRuleDto.teamId) {
      const team = await this.managementRepository.findTeam(createRuleDto.teamId, workspaceId);
      if (!team) {
        throw new BadRequestException('Team not found in workspace');
      }
    }

    // Create rule
    return this.managementRepository.createRule({
      managerId: createRuleDto.managerId,
      subordinateId: createRuleDto.subordinateId,
      teamId: createRuleDto.teamId,
      workspaceId,
      ruleType: createRuleDto.ruleType,
    });
  }
}
