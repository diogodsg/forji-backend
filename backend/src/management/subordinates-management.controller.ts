import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ManagerGuard } from './guards/manager.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CyclesService } from '../cycles/cycles.service';
import { GoalsService } from '../goals/goals.service';
import { CompetenciesService } from '../competencies/competencies.service';
import { ActivitiesService } from '../activities/activities.service';
import { CycleResponseDto } from '../cycles/dto/cycle-response.dto';
import { GoalResponseDto } from '../goals/dto/goal-response.dto';
import { CompetencyResponseDto } from '../competencies/dto/competency-response.dto';

/**
 * Subordinates Management Controller
 *
 * Endpoints para gestores acessarem dados de PDI de seus subordinados
 */
@ApiTags('Management - Subordinates')
@ApiBearerAuth()
@Controller('management/subordinates')
@UseGuards(JwtAuthGuard)
export class SubordinatesManagementController {
  constructor(
    private readonly cyclesService: CyclesService,
    private readonly goalsService: GoalsService,
    private readonly competenciesService: CompetenciesService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  /**
   * GET /management/subordinates/:subordinateId/cycles/current
   * Obter ciclo ativo do subordinado
   */
  @Get(':subordinateId/cycles/current')
  @UseGuards(ManagerGuard)
  @ApiOperation({
    summary: 'Obter ciclo ativo do subordinado',
    description:
      'Retorna o ciclo de desenvolvimento ativo do subordinado. Requer que o usuário seja gestor do subordinado.',
  })
  @ApiParam({
    name: 'subordinateId',
    description: 'ID do subordinado',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Ciclo ativo retornado',
    type: CycleResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não é gestor do subordinado',
  })
  @ApiResponse({
    status: 404,
    description: 'Ciclo não encontrado',
  })
  async getSubordinateCycle(
    @Param('subordinateId') subordinateId: string,
    @CurrentUser() user: any,
  ): Promise<CycleResponseDto | null> {
    console.log(`🔍 Gestor ${user.userId} buscando ciclo do subordinado ${subordinateId}`);
    return this.cyclesService.getCurrentCycle(subordinateId, user.workspaceId);
  }

  /**
   * GET /management/subordinates/:subordinateId/goals
   * Listar metas do subordinado
   */
  @Get(':subordinateId/goals')
  @UseGuards(ManagerGuard)
  @ApiOperation({
    summary: 'Listar metas do subordinado',
    description:
      'Retorna todas as metas do subordinado. Requer que o usuário seja gestor do subordinado.',
  })
  @ApiParam({
    name: 'subordinateId',
    description: 'ID do subordinado',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de metas retornada',
    type: [GoalResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não é gestor do subordinado',
  })
  async getSubordinateGoals(
    @Param('subordinateId') subordinateId: string,
    @Query('cycleId') cycleId?: string,
    @CurrentUser() user?: any,
  ): Promise<GoalResponseDto[]> {
    console.log(`🎯 Gestor ${user.userId} buscando metas do subordinado ${subordinateId}`);

    // Se não foi especificado um cycleId, buscar o ciclo ativo do subordinado
    let targetCycleId = cycleId;
    if (!targetCycleId) {
      const cycle = await this.cyclesService.getCurrentCycle(subordinateId, user.workspaceId);
      if (cycle) {
        targetCycleId = cycle.id;
      }
    }

    return this.goalsService.findAll(subordinateId, user.workspaceId, targetCycleId);
  }

  /**
   * GET /management/subordinates/:subordinateId/competencies
   * Listar competências do subordinado
   */
  @Get(':subordinateId/competencies')
  @UseGuards(ManagerGuard)
  @ApiOperation({
    summary: 'Listar competências do subordinado',
    description:
      'Retorna todas as competências do subordinado. Requer que o usuário seja gestor do subordinado.',
  })
  @ApiParam({
    name: 'subordinateId',
    description: 'ID do subordinado',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de competências retornada',
    type: [CompetencyResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não é gestor do subordinado',
  })
  async getSubordinateCompetencies(
    @Param('subordinateId') subordinateId: string,
    @Query('cycleId') cycleId?: string,
    @CurrentUser() user?: any,
  ): Promise<CompetencyResponseDto[]> {
    console.log(`🧠 Gestor ${user.userId} buscando competências do subordinado ${subordinateId}`);

    // Se não foi especificado um cycleId, buscar o ciclo ativo do subordinado
    let targetCycleId = cycleId;
    if (!targetCycleId) {
      const cycle = await this.cyclesService.getCurrentCycle(subordinateId, user.workspaceId);
      if (cycle) {
        targetCycleId = cycle.id;
      }
    }

    return this.competenciesService.findAll(subordinateId, user.workspaceId, targetCycleId);
  }

  /**
   * GET /management/subordinates/:subordinateId/activities
   * Listar atividades do subordinado
   */
  @Get(':subordinateId/activities')
  @UseGuards(ManagerGuard)
  @ApiOperation({
    summary: 'Listar atividades do subordinado',
    description:
      'Retorna timeline de atividades do subordinado. Requer que o usuário seja gestor do subordinado.',
  })
  @ApiParam({
    name: 'subordinateId',
    description: 'ID do subordinado',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Timeline de atividades retornada',
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não é gestor do subordinado',
  })
  async getSubordinateActivities(
    @Param('subordinateId') subordinateId: string,
    @Query('cycleId') cycleId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @CurrentUser() user?: any,
  ) {
    console.log(`📋 Gestor ${user.userId} buscando atividades do subordinado ${subordinateId}`);

    // Se não foi especificado um cycleId, buscar o ciclo ativo do subordinado
    let targetCycleId = cycleId;
    if (!targetCycleId) {
      const cycle = await this.cyclesService.getCurrentCycle(subordinateId, user.workspaceId);
      if (cycle) {
        targetCycleId = cycle.id;
      }
    }

    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 20;

    return this.activitiesService.findTimeline(
      subordinateId,
      user.workspaceId,
      targetCycleId,
      undefined, // type
      pageNum,
      pageSizeNum,
    );
  }
}
