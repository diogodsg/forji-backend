import { ApiProperty } from '@nestjs/swagger';
import { GoalType, GoalStatus } from '@prisma/client';

export class GoalEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  cycleId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  userId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174003' })
  workspaceId: string;

  @ApiProperty({ enum: GoalType, example: 'INCREASE' })
  type: GoalType;

  @ApiProperty({ example: 'Aumentar PRs mergeados' })
  title: string;

  @ApiProperty({ example: 'Contribuir mais ativamente com code reviews e PRs' })
  description: string | null;

  @ApiProperty({ example: 5 })
  startValue: number | null;

  @ApiProperty({ example: 12 })
  currentValue: number | null;

  @ApiProperty({ example: 15 })
  targetValue: number | null;

  @ApiProperty({ example: 'PRs' })
  unit: string;

  @ApiProperty({ enum: GoalStatus, example: 'IN_PROGRESS' })
  status: GoalStatus;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  updatedAt: Date;
}
