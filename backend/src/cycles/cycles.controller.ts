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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { CycleResponseDto, CycleStatsDto } from './dto/cycle-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CycleStatus } from '@prisma/client';
import { CyclesService } from './cycles.service';

@ApiTags('Cycles')
@ApiBearerAuth()
@Controller('cycles')
@UseGuards(JwtAuthGuard)
export class CyclesController {
  constructor(private readonly cyclesService: CyclesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo ciclo de PDI (própria pessoa ou gerente)' })
  @ApiResponse({ status: 201, description: 'Ciclo criado com sucesso', type: CycleResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou já existe ciclo ativo' })
  @ApiResponse({ status: 403, description: 'Sem permissão para criar ciclo' })
  async create(
    @Body() createCycleDto: CreateCycleDto,
    @CurrentUser() user: any,
  ): Promise<CycleResponseDto> {
    return this.cyclesService.create(createCycleDto, user.userId);
  }

  @Get('current')
  @ApiOperation({
    summary: 'Obter ciclo ativo do usuário atual (cria automaticamente se não existir)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ciclo ativo retornado ou criado',
    type: CycleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Nenhum ciclo ativo encontrado' })
  async getCurrentCycle(@CurrentUser() user: any): Promise<CycleResponseDto | null> {
    return this.cyclesService.getCurrentCycle(user.userId, user.workspaceId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ciclos do usuário com paginação' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: CycleStatus,
    description: 'Filtrar por status',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (padrão: 1)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciclos retornada',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/CycleResponseDto' } },
        total: { type: 'number', example: 5 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
      },
    },
  })
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: CycleStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.cyclesService.findAll(user.userId, user.workspaceId, status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um ciclo específico' })
  @ApiResponse({ status: 200, description: 'Ciclo retornado', type: CycleResponseDto })
  @ApiResponse({ status: 404, description: 'Ciclo não encontrado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para visualizar este ciclo' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<CycleResponseDto> {
    return this.cyclesService.findOne(id, user.userId, user.workspaceId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obter estatísticas completas do ciclo' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas', type: CycleStatsDto })
  @ApiResponse({ status: 404, description: 'Ciclo não encontrado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para visualizar este ciclo' })
  async getStats(@Param('id') id: string, @CurrentUser() user: any): Promise<CycleStatsDto> {
    return this.cyclesService.getStats(id, user.userId, user.workspaceId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ciclo (própria pessoa ou gerente)' })
  @ApiResponse({ status: 200, description: 'Ciclo atualizado', type: CycleResponseDto })
  @ApiResponse({ status: 404, description: 'Ciclo não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão para editar este ciclo' })
  async update(
    @Param('id') id: string,
    @Body() updateCycleDto: UpdateCycleDto,
    @CurrentUser() user: any,
  ): Promise<CycleResponseDto> {
    return this.cyclesService.update(id, updateCycleDto, user.userId, user.workspaceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar ciclo (própria pessoa ou gerente)' })
  @ApiResponse({ status: 200, description: 'Ciclo deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Ciclo não encontrado' })
  @ApiResponse({ status: 403, description: 'Sem permissão para deletar este ciclo' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<{ message: string }> {
    await this.cyclesService.remove(id, user.userId, user.workspaceId);
    return { message: 'Ciclo deletado com sucesso' };
  }
}
