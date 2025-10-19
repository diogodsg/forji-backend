import { ApiProperty } from '@nestjs/swagger';
import { CycleStatus } from '@prisma/client';

export class CycleResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Q1 2025' })
  name: string;

  @ApiProperty({ example: 'Ciclo focado em desenvolvimento técnico e liderança' })
  description: string | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2025-03-31T23:59:59.999Z' })
  endDate: Date;

  @ApiProperty({ enum: CycleStatus, example: 'ACTIVE' })
  status: CycleStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  userId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  workspaceId: string;

  @ApiProperty({ example: 45, description: 'Dias restantes até o fim do ciclo' })
  daysRemaining?: number;

  @ApiProperty({ example: 67.5, description: 'Percentual de progresso do ciclo (0-100)' })
  progress?: number;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  updatedAt: Date;
}

export class CycleStatsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  cycleId: string;

  @ApiProperty({ example: 'Q1 2025' })
  cycleName: string;

  @ApiProperty({ example: 5 })
  totalGoals: number;

  @ApiProperty({ example: 3 })
  completedGoals: number;

  @ApiProperty({ example: 4 })
  totalCompetencies: number;

  @ApiProperty({ example: 8 })
  totalActivities: number;

  @ApiProperty({ example: 45 })
  daysRemaining: number;

  @ApiProperty({ example: 67.5 })
  cycleProgress: number;

  @ApiProperty({ example: 60.0, description: 'Progresso médio das metas' })
  averageGoalProgress: number;
}
