import { Module, forwardRef } from '@nestjs/common';
import { ManagementController } from './management.controller';
import { SubordinatesManagementController } from './subordinates-management.controller';
import { ManagementService } from './management.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ManagementRepository } from './repositories/management.repository';
import { CyclesModule } from '../cycles/cycles.module';
import { GoalsModule } from '../goals/goals.module';
import { CompetenciesModule } from '../competencies/competencies.module';
import { ActivitiesModule } from '../activities/activities.module';
import {
  FindManagementRulesUseCase,
  CreateManagementRuleUseCase,
  DeleteManagementRuleUseCase,
  GetUserHierarchyUseCase,
} from './use-cases';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => CyclesModule),
    forwardRef(() => GoalsModule),
    forwardRef(() => CompetenciesModule),
    forwardRef(() => ActivitiesModule),
  ],
  controllers: [ManagementController, SubordinatesManagementController],
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
