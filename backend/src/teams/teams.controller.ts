import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateTeamDto, UpdateTeamDto, AddMemberDto, UpdateMemberRoleDto } from './dto';
import { TeamStatus } from '@prisma/client';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * GET /teams - List all teams in workspace
   */
  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: TeamStatus,
    @Query('includeMembers') includeMembers?: string,
    @Query('includeMemberCount') includeMemberCount?: string,
  ) {
    return this.teamsService.findAll(
      user.workspaceId,
      status,
      includeMembers === 'true',
      includeMemberCount === 'true',
    );
  }

  /**
   * GET /teams/search - Search teams by name
   */
  @Get('search')
  search(@CurrentUser() user: any, @Query('q') query: string) {
    return this.teamsService.search(user.workspaceId, query);
  }

  /**
   * POST /teams - Create new team
   */
  @Post()
  create(@CurrentUser() user: any, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto, user.workspaceId);
  }

  /**
   * GET /teams/:id - Get team by ID
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Query('includeMembers') includeMembers?: string,
  ) {
    return this.teamsService.findOne(id, user.workspaceId, includeMembers === 'true');
  }

  /**
   * PATCH /teams/:id - Update team
   */
  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: any, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto, user.workspaceId);
  }

  /**
   * DELETE /teams/:id - Delete team (soft delete)
   */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.teamsService.remove(id, user.workspaceId);
  }

  /**
   * GET /teams/:id/members - Get team members
   */
  @Get(':id/members')
  getMembers(@Param('id') id: string, @CurrentUser() user: any) {
    return this.teamsService.getMembers(id, user.workspaceId);
  }

  /**
   * POST /teams/:id/members - Add member to team
   */
  @Post(':id/members')
  addMember(@Param('id') id: string, @CurrentUser() user: any, @Body() addMemberDto: AddMemberDto) {
    return this.teamsService.addMember(id, addMemberDto, user.workspaceId);
  }

  /**
   * PATCH /teams/:id/members/:userId - Update member role
   */
  @Patch(':id/members/:userId')
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
    @Body() updateRoleDto: UpdateMemberRoleDto,
  ) {
    return this.teamsService.updateMemberRole(id, userId, updateRoleDto, user.workspaceId);
  }

  /**
   * DELETE /teams/:id/members/:userId - Remove member from team
   */
  @Delete(':id/members/:userId')
  removeMember(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: any) {
    return this.teamsService.removeMember(id, userId, user.workspaceId);
  }
}
