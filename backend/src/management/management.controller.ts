import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseBoolPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ManagementService } from './management.service';
import { CreateRuleDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ManagementRuleType } from '@prisma/client';

interface JwtPayload {
  sub: string;
  email: string;
  workspaceId: string;
  workspaceRole: string;
}

@ApiTags('management')
@Controller('management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  /**
   * GET /management/test
   * Test endpoint
   */
  @Get('test')
  async test() {
    return { message: 'Management module is working!' };
  }

  /**
   * GET /management/subordinates
   * Get all subordinates for the current user
   */
  @Get('subordinates')
  async getMySubordinates(
    @CurrentUser() user: any,
    @Query('includeTeamMembers', new ParseBoolPipe({ optional: true }))
    includeTeamMembers = false,
  ) {
    return this.managementService.getMySubordinates(user.id, user.workspaceId, includeTeamMembers);
  }

  /**
   * GET /management/managers/:userId
   * Get all managers for a specific user (both direct and through teams)
   */
  @Get('managers/:userId')
  async getUserManagers(@CurrentUser() user: JwtPayload, @Param('userId') userId: string) {
    return this.managementService.getUserManagers(userId, user.workspaceId);
  }

  /**
   * GET /management/subordinates/:userId
   * Get all subordinates for a specific user (admin only)
   */
  @Get('subordinates/:userId')
  async getUserSubordinates(
    @CurrentUser() user: JwtPayload,
    @Param('userId') userId: string,
    @Query('includeTeamMembers', new ParseBoolPipe({ optional: true }))
    includeTeamMembers = false,
  ) {
    return this.managementService.getMySubordinates(userId, user.workspaceId, includeTeamMembers);
  }

  /**
   * GET /management/teams
   * Get all teams managed by the current user
   */
  @Get('teams')
  async getMyTeams(@CurrentUser() user: JwtPayload) {
    return this.managementService.getMyTeams(user.sub, user.workspaceId);
  }

  /**
   * GET /management/rules
   * Get all management rules (admin only)
   */
  @Get('rules')
  async getAllRules(
    @CurrentUser() user: JwtPayload,
    @Query('managerId') managerId?: string,
    @Query('type', new ParseEnumPipe(ManagementRuleType, { optional: true }))
    type?: ManagementRuleType,
  ) {
    return this.managementService.getAllRules(
      user.workspaceId,
      user.workspaceRole as any,
      managerId,
      type,
    );
  }

  /**
   * POST /management/rules
   * Create a new management rule (admin only)
   */
  @Post('rules')
  async createRule(@CurrentUser() user: JwtPayload, @Body() createRuleDto: CreateRuleDto) {
    return this.managementService.createRule(user.workspaceId, createRuleDto);
  }

  /**
   * DELETE /management/rules/:id
   * Delete a management rule
   */
  @Delete('rules/:id')
  async deleteRule(@CurrentUser() user: JwtPayload, @Param('id') ruleId: string) {
    return this.managementService.deleteRule(ruleId);
  }

  /**
   * GET /management/check/:userId
   * Check if a user is managed by the current user
   */
  @Get('check/:userId')
  async checkIfManaged(@CurrentUser() user: JwtPayload, @Param('userId') userId: string) {
    const isManaged = await this.managementService.isUserManagedBy(
      userId,
      user.sub,
      user.workspaceId,
    );
    return { isManaged };
  }
}
