import { ApiProperty } from '@nestjs/swagger';
import { CompetencyCategory } from '@prisma/client';

export class CompetencyEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  cycleId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  userId: string;

  @ApiProperty({ example: 'React & TypeScript' })
  name: string;

  @ApiProperty({ enum: CompetencyCategory, example: 'TECHNICAL' })
  category: CompetencyCategory;

  @ApiProperty({ example: 2 })
  currentLevel: number;

  @ApiProperty({ example: 4 })
  targetLevel: number;

  @ApiProperty({ example: 75 })
  currentProgress: number;

  @ApiProperty({ example: 600 })
  totalXP: number;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  updatedAt: Date;
}
