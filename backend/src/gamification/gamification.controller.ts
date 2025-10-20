import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GamificationProfileResponseDto } from './dto/gamification-profile-response.dto';
import { BadgeResponseDto } from './dto/badge-response.dto';
import { AddXpDto } from './dto/add-xp.dto';

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
  constructor(private readonly gamificationService: GamificationService) {}

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
}
