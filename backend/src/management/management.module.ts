import { Module } from '@nestjs/common';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ManagementRepository } from './repositories/management.repository';
import {
  FindManagementRulesUseCase,
  CreateManagementRuleUseCase,
  DeleteManagementRuleUseCase,
  GetUserHierarchyUseCase,
} from './use-cases';

@Module({
  imports: [PrismaModule],
  controllers: [ManagementController],
  providers: [
    ManagementService,
    ManagementRepository,
    FindManagementRulesUseCase,
    CreateManagementRuleUseCase,
    DeleteManagementRuleUseCase,
    GetUserHierarchyUseCase,
  ],
  exports: [ManagementService],
})
export class ManagementModule {}
