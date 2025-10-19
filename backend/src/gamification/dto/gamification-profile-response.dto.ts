import { ApiProperty } from '@nestjs/swagger';
import { BadgeEntity } from '../entities/badge.entity';

/**
 * Gamification Profile Response DTO
 *
 * Retorna o perfil completo de gamificação do usuário.
 */
export class GamificationProfileResponseDto {
  @ApiProperty({
    description: 'ID do perfil de gamificação',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  userId: string;

  @ApiProperty({
    description: 'Nível atual do usuário',
    example: 12,
  })
  level: number;

  @ApiProperty({
    description: 'XP no nível atual',
    example: 2840,
  })
  currentXP: number;

  @ApiProperty({
    description: 'XP total acumulado',
    example: 15420,
  })
  totalXP: number;

  @ApiProperty({
    description: 'XP necessário para próximo nível',
    example: 3200,
  })
  nextLevelXP: number;

  @ApiProperty({
    description: 'Progresso até o próximo nível (0-100)',
    example: 68,
  })
  progressToNextLevel: number;

  @ApiProperty({
    description: 'Dias consecutivos com atividade',
    example: 7,
  })
  streak: number;

  @ApiProperty({
    description: 'Status do streak (ativo ou perdido)',
    example: 'active',
    enum: ['active', 'lost'],
  })
  streakStatus: 'active' | 'lost';

  @ApiProperty({
    description: 'Última atividade registrada',
    example: '2024-10-19T10:30:00.000Z',
  })
  lastActiveAt: Date;

  @ApiProperty({
    description: 'Badges conquistadas',
    type: [BadgeEntity],
  })
  badges: BadgeEntity[];

  @ApiProperty({
    description: 'Total de badges conquistadas',
    example: 3,
  })
  totalBadges: number;

  @ApiProperty({
    description: 'Ranking do usuário (futuro)',
    example: 42,
    nullable: true,
  })
  rank?: number | null;
}
