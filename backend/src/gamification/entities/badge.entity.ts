import { ApiProperty } from '@nestjs/swagger';
import { BadgeType } from '@prisma/client';

/**
 * Badge Entity
 *
 * Representa uma conquista desbloqueada pelo usuário.
 */
export class BadgeEntity {
  @ApiProperty({
    description: 'ID único da badge',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ID do perfil de gamificação',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  gamificationProfileId: string;

  @ApiProperty({
    description: 'Tipo da badge',
    enum: BadgeType,
    example: BadgeType.STREAK_7,
  })
  type: BadgeType;

  @ApiProperty({
    description: 'Nome da badge',
    example: '7 Dias de Fogo 🔥',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição da conquista',
    example: 'Manteve streak de 7 dias consecutivos',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Data em que a badge foi conquistada',
    example: '2024-10-12T08:00:00.000Z',
  })
  earnedAt: Date;
}
