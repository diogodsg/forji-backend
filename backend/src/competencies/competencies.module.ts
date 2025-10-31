import { Module, forwardRef } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CompetenciesController } from './competencies.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';
import { ActivitiesModule } from '../activities/activities.module';
import { ManagementModule } from '../management/management.module';

@Module({
  imports: [
    PrismaModule,
    GamificationModule,
    forwardRef(() => ActivitiesModule),
    forwardRef(() => ManagementModule),
  ],
  controllers: [CompetenciesController],
  providers: [CompetenciesService],
  exports: [CompetenciesService],
})
export class CompetenciesModule {}
