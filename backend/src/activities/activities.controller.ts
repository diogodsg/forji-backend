import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityResponseDto, TimelineResponseDto } from './dto/activity-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ActivityType } from '@prisma/client';

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova atividade (1:1, Mentoria, Certificação) e ganhar XP' })
  @ApiResponse({
    status: 201,
    description: 'Atividade criada com sucesso e XP adicionado',
    type: ActivityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar atividade' })
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @CurrentUser() user: any,
  ): Promise<ActivityResponseDto> {
    return this.activitiesService.create(createActivityDto, user.userId);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Obter timeline de atividades com paginação' })
  @ApiQuery({ name: 'cycleId', required: false, description: 'Filtrar por ciclo' })
  @ApiQuery({ name: 'type', required: false, enum: ActivityType, description: 'Filtrar por tipo' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página (padrão: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Itens por página (padrão: 20)' })
  @ApiResponse({
    status: 200,
    description: 'Timeline de atividades',
    type: TimelineResponseDto,
  })
  async getTimeline(
    @CurrentUser() user: any,
    @Query('cycleId') cycleId?: string,
    @Query('type') type?: ActivityType,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<TimelineResponseDto> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 20;

    return this.activitiesService.findTimeline(
      user.userId,
      user.workspaceId,
      cycleId,
      type,
      pageNum,
      pageSizeNum,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas de atividades' })
  @ApiQuery({ name: 'cycleId', required: false, description: 'Filtrar por ciclo' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas de atividades',
  })
  async getStats(@CurrentUser() user: any, @Query('cycleId') cycleId?: string): Promise<any> {
    return this.activitiesService.getStats(user.userId, cycleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma atividade específica' })
  @ApiResponse({
    status: 200,
    description: 'Atividade retornada',
    type: ActivityResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Atividade não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para visualizar esta atividade' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<ActivityResponseDto> {
    return this.activitiesService.findOne(id, user.userId, user.workspaceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar atividade (própria pessoa ou gerente)' })
  @ApiResponse({ status: 200, description: 'Atividade deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Atividade não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para deletar esta atividade' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<{ message: string }> {
    await this.activitiesService.remove(id, user.userId, user.workspaceId);
    return { message: 'Atividade deletada com sucesso' };
  }
}
