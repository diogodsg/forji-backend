import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GamificationProfileResponseDto } from './dto/gamification-profile-response.dto';
import { BadgeResponseDto } from './dto/badge-response.dto';
import { AddXpDto } from './dto/add-xp.dto';
import { XpSource } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * GamificationController
 *
 * Controller responsável pelos endpoints de gamificação:
 * - GET /profile: Perfil de gamificação do usuário
 * - GET /badges: Badges disponíveis e conquistadas
 * - POST /xp: Adicionar XP (interno/admin)
 */
@ApiTags('Gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(
    private readonly gamificationService: GamificationService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * GET /api/gamification/profile
   *
   * Retorna o perfil completo de gamificação do usuário autenticado.
   * Inclui: level, XP, streak, badges, progresso até próximo nível.
   */
  @Get('profile')
  @ApiOperation({
    summary: 'Buscar perfil de gamificação',
    description:
      'Retorna o perfil completo de gamificação do usuário autenticado com nível, XP, streak e badges',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de gamificação retornado com sucesso',
    type: GamificationProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de gamificação não encontrado',
  })
  async getProfile(@CurrentUser() user: any): Promise<GamificationProfileResponseDto> {
    return this.gamificationService.getProfile(user.id, user.workspaceId);
  }

  /**
   * GET /api/gamification/profile/:userId
   *
   * Retorna o perfil de gamificação de qualquer usuário (para gestores visualizarem subordinados)
   */
  @Get('profile/:userId')
  @ApiOperation({
    summary: 'Buscar perfil de gamificação de outro usuário',
    description:
      'Retorna o perfil completo de gamificação de um usuário específico. Útil para gestores visualizarem dados de subordinados.',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'ID do usuário',
    example: 'clp4k5n8d0001ld0fh4qm7x8k',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de gamificação retornado com sucesso',
    type: GamificationProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de gamificação não encontrado',
  })
  async getProfileByUserId(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ): Promise<GamificationProfileResponseDto> {
    // Usar o workspace do usuário autenticado
    return this.gamificationService.getProfile(userId, user.workspaceId);
  }

  /**
   * GET /api/gamification/badges
   *
   * Lista todas as badges disponíveis no sistema, indicando
   * quais foram conquistadas pelo usuário e quais ainda estão bloqueadas.
   */
  @Get('badges')
  @ApiOperation({
    summary: 'Listar badges disponíveis',
    description:
      'Retorna todas as badges do sistema, indicando quais foram conquistadas e quais estão bloqueadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Badges listadas com sucesso',
    type: [BadgeResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de gamificação não encontrado',
  })
  async getBadges(@CurrentUser() user: any): Promise<BadgeResponseDto[]> {
    return this.gamificationService.getBadges(user.id, user.workspaceId);
  }

  /**
   * POST /api/gamification/xp/test
   *
   * Endpoint temporário para testar se as transações de XP estão sendo registradas
   */
  @Post('xp/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[TESTE] Adicionar XP de teste',
    description: 'Endpoint temporário para testar registro de transações de XP',
  })
  @ApiResponse({
    status: 200,
    description: 'XP de teste adicionado com sucesso',
    type: GamificationProfileResponseDto,
  })
  async testAddXP(@CurrentUser() user: any): Promise<GamificationProfileResponseDto> {
    return this.gamificationService.addXP({
      userId: user.id,
      workspaceId: user.workspaceId,
      xpAmount: 50,
      reason: 'Teste de transação XP',
      source: XpSource.MANUAL,
    });
  }

  /**
   * GET /api/gamification/xp/transactions
   *
   * Endpoint para visualizar as transações de XP do usuário
   */
  @Get('xp/transactions')
  @ApiOperation({
    summary: 'Listar transações de XP',
    description: 'Retorna o histórico de transações de XP do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Transações de XP retornadas com sucesso',
  })
  async getXpTransactions(@CurrentUser() user: any): Promise<any[]> {
    // Buscar perfil de gamificação do usuário
    const profile = await this.prisma.gamificationProfile.findUnique({
      where: {
        unique_user_workspace_gamification: {
          userId: user.id,
          workspaceId: user.workspaceId,
        },
      },
    });

    if (!profile) {
      return [];
    }

    // Buscar transações de XP
    return this.prisma.xpTransaction.findMany({
      where: {
        gamificationProfileId: profile.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Últimas 20 transações
    });
  }
}
