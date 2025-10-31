import { Module, forwardRef } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
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
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
