import { ApiProperty } from '@nestjs/swagger';
import { GoalType, GoalStatus } from '@prisma/client';

export class GoalResponseDto {
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

  @ApiProperty({ example: 80.0, description: 'Percentual de progresso (0-100)' })
  progress?: number;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  updatedAt: Date;

  // Controle de atualização semanal
  @ApiProperty({ example: true, description: 'Pode atualizar agora?', required: false })
  canUpdateNow?: boolean;

  @ApiProperty({
    example: '2025-11-04T10:30:00.000Z',
    description: 'Próxima data disponível para atualização (ISO string)',
    required: false,
  })
  nextUpdateDate?: string;

  // Informações de XP e level-up (opcionais, apenas em operações que geram XP)
  @ApiProperty({ example: 25, description: 'XP ganho nesta operação', required: false })
  xpEarned?: number;

  @ApiProperty({
    example: 25,
    description: 'XP recompensa por completar/progredir',
    required: false,
  })
  xpReward?: number;

  @ApiProperty({ example: true, description: 'Se houve level up', required: false })
  leveledUp?: boolean;

  @ApiProperty({ example: 4, description: 'Nível anterior', required: false })
  previousLevel?: number;

  @ApiProperty({ example: 5, description: 'Novo nível', required: false })
  newLevel?: number;
}

export class GoalUpdateHistoryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 8 })
  previousValue: number | null;

  @ApiProperty({ example: 12 })
  newValue: number | null;

  @ApiProperty({ example: 'Fiz 3 PRs esta semana' })
  notes: string | null;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  createdAt: Date;
}

export class GoalWithHistoryDto extends GoalResponseDto {
  @ApiProperty({ type: [GoalUpdateHistoryDto] })
  updates: GoalUpdateHistoryDto[];
}
