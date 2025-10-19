import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaModule } from '../prisma/prisma.module';

// Repository
import { TeamsRepository } from './repositories/teams.repository';

// Use Cases
import {
  FindAllTeamsUseCase,
  FindOneTeamUseCase,
  CreateTeamUseCase,
  UpdateTeamUseCase,
  DeleteTeamUseCase,
  AddTeamMemberUseCase,
  RemoveTeamMemberUseCase,
  UpdateTeamMemberRoleUseCase,
} from './use-cases';

@Module({
  imports: [PrismaModule],
  controllers: [TeamsController],
  providers: [
    // Main Service (Facade)
    TeamsService,

    // Repository
    TeamsRepository,

    // Use Cases
    FindAllTeamsUseCase,
    FindOneTeamUseCase,
    CreateTeamUseCase,
    UpdateTeamUseCase,
    DeleteTeamUseCase,
    AddTeamMemberUseCase,
    RemoveTeamMemberUseCase,
    UpdateTeamMemberRoleUseCase,
  ],
  exports: [TeamsService, TeamsRepository],
})
export class TeamsModule {}
