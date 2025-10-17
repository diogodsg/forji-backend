import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateWorkspaceDto, UpdateWorkspaceDto, InviteToWorkspaceDto } from './dto';

@ApiTags('workspaces')
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  /**
   * GET /workspaces - Get all workspaces for current user
   */
  @Get()
  getUserWorkspaces(@CurrentUser() user: any) {
    return this.workspacesService.getUserWorkspaces(user.id);
  }

  /**
   * POST /workspaces - Create a new workspace
   */
  @Post()
  createWorkspace(@CurrentUser() user: any, @Body() createDto: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(user.id, createDto);
  }

  /**
   * GET /workspaces/:id - Get workspace details
   */
  @Get(':id')
  getWorkspace(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.getWorkspace(workspaceId, user.id);
  }

  /**
   * PUT /workspaces/:id - Update workspace
   */
  @Put(':id')
  updateWorkspace(
    @Param('id') workspaceId: string,
    @CurrentUser() user: any,
    @Body() updateDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.updateWorkspace(workspaceId, user.id, updateDto);
  }

  /**
   * DELETE /workspaces/:id - Archive workspace
   */
  @Delete(':id')
  deleteWorkspace(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.deleteWorkspace(workspaceId, user.id);
  }

  /**
   * GET /workspaces/:id/members - Get workspace members
   */
  @Get(':id/members')
  getWorkspaceMembers(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.getWorkspaceMembers(workspaceId, user.id);
  }

  /**
   * POST /workspaces/:id/members - Invite user to workspace
   */
  @Post(':id/members')
  inviteToWorkspace(
    @Param('id') workspaceId: string,
    @CurrentUser() user: any,
    @Body() inviteDto: InviteToWorkspaceDto,
  ) {
    return this.workspacesService.inviteToWorkspace(workspaceId, user.id, inviteDto);
  }

  /**
   * DELETE /workspaces/:id/members/:userId - Remove member from workspace
   */
  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') workspaceId: string,
    @Param('userId') memberUserId: string,
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.removeMember(workspaceId, user.id, memberUserId);
  }

  /**
   * POST /workspaces/:id/leave - Leave workspace
   */
  @Post(':id/leave')
  leaveWorkspace(@Param('id') workspaceId: string, @CurrentUser() user: any) {
    return this.workspacesService.leaveWorkspace(workspaceId, user.id);
  }
}
