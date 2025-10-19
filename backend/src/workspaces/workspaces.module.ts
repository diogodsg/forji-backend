import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspacesRepository } from './repositories/workspaces.repository';
import {
  FindAllWorkspacesUseCase,
  FindOneWorkspaceUseCase,
  CreateWorkspaceUseCase,
  UpdateWorkspaceUseCase,
  DeleteWorkspaceUseCase,
  AddWorkspaceMemberUseCase,
  RemoveWorkspaceMemberUseCase,
  UpdateWorkspaceMemberRoleUseCase,
} from './use-cases';

@Module({
  imports: [PrismaModule],
  controllers: [WorkspacesController],
  providers: [
    WorkspacesService,
    WorkspacesRepository,
    FindAllWorkspacesUseCase,
    FindOneWorkspaceUseCase,
    CreateWorkspaceUseCase,
    UpdateWorkspaceUseCase,
    DeleteWorkspaceUseCase,
    AddWorkspaceMemberUseCase,
    RemoveWorkspaceMemberUseCase,
    UpdateWorkspaceMemberRoleUseCase,
  ],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
