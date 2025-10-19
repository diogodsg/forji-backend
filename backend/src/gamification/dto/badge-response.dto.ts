import { ApiProperty } from '@nestjs/swagger';
import { BadgeType } from '@prisma/client';

/**
 * Badge Response DTO
 *
 * Retorna informações de uma badge.
 */
export class BadgeResponseDto {
  @ApiProperty({
    description: 'ID da badge',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

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
    description: 'Descrição da badge',
    example: 'Manteve streak de 7 dias consecutivos',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Data de conquista',
    example: '2024-10-12T08:00:00.000Z',
  })
  earnedAt: Date;

  @ApiProperty({
    description: 'Badge foi conquistada pelo usuário',
    example: true,
  })
  earned: boolean;
}
