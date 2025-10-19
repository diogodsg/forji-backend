import { Module, forwardRef } from '@nestjs/common';
import { CompetenciesService } from './competencies.service';
import { CompetenciesController } from './competencies.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [PrismaModule, GamificationModule, forwardRef(() => ActivitiesModule)],
  controllers: [CompetenciesController],
  providers: [CompetenciesService],
  exports: [CompetenciesService],
})
export class CompetenciesModule {}
