import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ManagementModule } from './management/management.module';
import { GamificationModule } from './gamification/gamification.module';
import { CyclesModule } from './cycles/cycles.module';
import { GoalsModule } from './goals/goals.module';
import { CompetenciesModule } from './competencies/competencies.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    // Rate limiting: 10 requests per 10 seconds
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    WorkspacesModule,
    UsersModule,
    TeamsModule,
    ManagementModule,
    GamificationModule,
    CyclesModule,
    GoalsModule,
    CompetenciesModule,
    ActivitiesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
