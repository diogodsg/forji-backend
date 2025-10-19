import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { GoalResponseDto, GoalWithHistoryDto } from './dto/goal-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GoalStatus } from '@prisma/client';

@ApiTags('Goals')
@ApiBearerAuth()
@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova meta (própria pessoa ou gerente)' })
  @ApiResponse({ status: 201, description: 'Meta criada com sucesso', type: GoalResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar meta' })
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @CurrentUser() user: any,
  ): Promise<GoalResponseDto> {
    return this.goalsService.create(createGoalDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as metas do usuário' })
  @ApiQuery({ name: 'cycleId', required: false, description: 'Filtrar por ciclo' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: GoalStatus,
    description: 'Filtrar por status',
  })
  @ApiResponse({ status: 200, description: 'Lista de metas', type: [GoalResponseDto] })
  async findAll(
    @CurrentUser() user: any,
    @Query('cycleId') cycleId?: string,
    @Query('status') status?: GoalStatus,
  ): Promise<GoalResponseDto[]> {
    return this.goalsService.findAll(user.userId, user.workspaceId, cycleId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma meta específica' })
  @ApiResponse({ status: 200, description: 'Meta retornada', type: GoalResponseDto })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para visualizar esta meta' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<GoalResponseDto> {
    return this.goalsService.findOne(id, user.userId, user.workspaceId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Obter meta com histórico completo de atualizações' })
  @ApiResponse({ status: 200, description: 'Meta com histórico', type: GoalWithHistoryDto })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para visualizar esta meta' })
  async findOneWithHistory(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<GoalWithHistoryDto> {
    return this.goalsService.findOneWithHistory(id, user.userId, user.workspaceId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar meta (própria pessoa ou gerente)' })
  @ApiResponse({ status: 200, description: 'Meta atualizada', type: GoalResponseDto })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar esta meta' })
  async update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @CurrentUser() user: any,
  ): Promise<GoalResponseDto> {
    return this.goalsService.update(id, updateGoalDto, user.userId, user.workspaceId);
  }

  @Patch(':id/progress')
  @ApiOperation({
    summary: 'Atualizar progresso da meta e ganhar XP (própria pessoa ou gerente)',
  })
  @ApiResponse({
    status: 200,
    description: 'Progresso atualizado e XP adicionado',
    type: GoalResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para atualizar esta meta' })
  async updateProgress(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateGoalProgressDto,
    @CurrentUser() user: any,
  ): Promise<GoalResponseDto> {
    return this.goalsService.updateProgress(id, updateProgressDto, user.userId, user.workspaceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar meta (própria pessoa ou gerente)' })
  @ApiResponse({ status: 200, description: 'Meta deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para deletar esta meta' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<{ message: string }> {
    await this.goalsService.remove(id, user.userId, user.workspaceId);
    return { message: 'Meta deletada com sucesso' };
  }
}
