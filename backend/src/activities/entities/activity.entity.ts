import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '@prisma/client';

export class ActivityEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  cycleId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  userId: string;

  @ApiProperty({ enum: ActivityType, example: 'ONE_ON_ONE' })
  type: ActivityType;

  @ApiProperty({ example: '1:1 com João Silva - Q1 2025' })
  title: string;

  @ApiProperty({ example: 'Reunião de acompanhamento trimestral' })
  description: string | null;

  @ApiProperty({ example: 50 })
  xpEarned: number;

  @ApiProperty({ example: 60 })
  duration: number | null;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;
}
