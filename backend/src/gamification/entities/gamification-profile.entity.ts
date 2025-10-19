import { ApiProperty } from '@nestjs/swagger';

/**
 * GamificationProfile Entity
 *
 * Representa o perfil de gamificação de um usuário com XP, nível, streak e badges.
 */
export class GamificationProfileEntity {
  @ApiProperty({
    description: 'ID único do perfil de gamificação',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário dono do perfil',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  userId: string;

  @ApiProperty({
    description: 'Nível atual do usuário',
    example: 12,
    minimum: 1,
  })
  level: number;

  @ApiProperty({
    description: 'XP no nível atual (reseta ao subir de nível)',
    example: 2840,
    minimum: 0,
  })
  currentXP: number;

  @ApiProperty({
    description: 'XP total acumulado (nunca diminui)',
    example: 15420,
    minimum: 0,
  })
  totalXP: number;

  @ApiProperty({
    description: 'XP necessário para próximo nível',
    example: 3200,
    minimum: 0,
  })
  nextLevelXP: number;

  @ApiProperty({
    description: 'Progresso até o próximo nível (0-100)',
    example: 68,
    minimum: 0,
    maximum: 100,
  })
  progressToNextLevel: number;

  @ApiProperty({
    description: 'Dias consecutivos com atividade',
    example: 7,
    minimum: 0,
  })
  streak: number;

  @ApiProperty({
    description: 'Última vez que o usuário teve atividade',
    example: '2024-10-19T10:30:00.000Z',
  })
  lastActiveAt: Date;

  @ApiProperty({
    description: 'Badges conquistadas pelo usuário',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  badges?: any[];

  @ApiProperty({
    description: 'Data de criação do perfil',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de última atualização',
    example: '2024-10-19T10:30:00.000Z',
  })
  updatedAt: Date;
}
