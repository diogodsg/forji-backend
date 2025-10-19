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
import { CompetenciesService } from './competencies.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { UpdateCompetencyProgressDto } from './dto/update-competency-progress.dto';
import {
  CompetencyResponseDto,
  CompetencyWithHistoryDto,
  PredefinedCompetencyDto,
} from './dto/competency-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CompetencyCategory } from '@prisma/client';

@ApiTags('Competencies')
@ApiBearerAuth()
@Controller('competencies')
@UseGuards(JwtAuthGuard)
export class CompetenciesController {
  constructor(private readonly competenciesService: CompetenciesService) {}

  @Get('library')
  @ApiOperation({ summary: 'Obter biblioteca de competências predefinidas' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: CompetencyCategory,
    description: 'Filtrar por categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de competências predefinidas',
    type: [PredefinedCompetencyDto],
  })
  async getPredefinedCompetencies(
    @Query('category') category?: CompetencyCategory,
  ): Promise<PredefinedCompetencyDto[]> {
    return this.competenciesService.getPredefinedCompetencies(category);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova competência (própria pessoa ou gerente)' })
  @ApiResponse({
    status: 201,
    description: 'Competência criada com sucesso',
    type: CompetencyResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar competência' })
  async create(
    @Body() createCompetencyDto: CreateCompetencyDto,
    @CurrentUser() user: any,
  ): Promise<CompetencyResponseDto> {
    return this.competenciesService.create(createCompetencyDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as competências do usuário' })
  @ApiQuery({ name: 'cycleId', required: false, description: 'Filtrar por ciclo' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: CompetencyCategory,
    description: 'Filtrar por categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de competências',
    type: [CompetencyResponseDto],
  })
  async findAll(
    @CurrentUser() user: any,
    @Query('cycleId') cycleId?: string,
    @Query('category') category?: CompetencyCategory,
  ): Promise<CompetencyResponseDto[]> {
    return this.competenciesService.findAll(user.userId, user.workspaceId, cycleId, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma competência específica' })
  @ApiResponse({
    status: 200,
    description: 'Competência retornada',
    type: CompetencyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Competência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para visualizar esta competência' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<CompetencyResponseDto> {
    return this.competenciesService.findOne(id, user.userId, user.workspaceId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Obter competência com histórico completo de evoluções' })
  @ApiResponse({
    status: 200,
    description: 'Competência com histórico',
    type: CompetencyWithHistoryDto,
  })
  @ApiResponse({ status: 404, description: 'Competência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para visualizar esta competência' })
  async findOneWithHistory(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<CompetencyWithHistoryDto> {
    return this.competenciesService.findOneWithHistory(id, user.userId, user.workspaceId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar competência (própria pessoa ou gerente)' })
  @ApiResponse({ status: 200, description: 'Competência atualizada', type: CompetencyResponseDto })
  @ApiResponse({ status: 404, description: 'Competência não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar esta competência' })
  async update(
    @Param('id') id: string,
    @Body() updateCompetencyDto: UpdateCompetencyDto,
    @CurrentUser() user: any,
  ): Promise<CompetencyResponseDto> {
    return this.competenciesService.update(id, updateCompetencyDto, user.userId, user.workspaceId);
  }

  @Patch(':id/progress')
  @ApiOperation({
    summary:
      'Atualizar progresso da competência e subir de nível automaticamente (própria pessoa ou gerente)',
  })
  @ApiResponse({
    status: 200,
    description: 'Progresso atualizado, pode ter subido de nível e ganho XP',
    type: CompetencyResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Competência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para atualizar esta competência' })
  async updateProgress(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateCompetencyProgressDto,
    @CurrentUser() user: any,
  ): Promise<CompetencyResponseDto> {
    return this.competenciesService.updateProgress(
      id,
      updateProgressDto,
      user.userId,
      user.workspaceId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar competência (própria pessoa ou gerente)' })
  @ApiResponse({ status: 200, description: 'Competência deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Competência não encontrada' })
  @ApiResponse({ status: 403, description: 'Sem permissão para deletar esta competência' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<{ message: string }> {
    await this.competenciesService.remove(id, user.userId, user.workspaceId);
    return { message: 'Competência deletada com sucesso' };
  }
}
