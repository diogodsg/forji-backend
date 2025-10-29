import { ApiProperty } from '@nestjs/swagger';
import { CompetencyCategory } from '@prisma/client';

export class CompetencyResponseDto {
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

  @ApiProperty({ example: 75, description: 'Progresso no nível atual (0-100)' })
  currentProgress: number;

  @ApiProperty({ example: 600 })
  totalXP: number;

  @ApiProperty({ example: 62.5, description: 'Progresso total até o nível alvo (0-100)' })
  overallProgress?: number;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  updatedAt: Date;

  // Informações de XP e level-up (opcionais, apenas em operações que geram XP)
  @ApiProperty({ example: 133, description: 'XP ganho nesta operação', required: false })
  xpEarned?: number;

  @ApiProperty({ example: 133, description: 'XP recompensa por criar/atualizar', required: false })
  xpReward?: number;

  @ApiProperty({ example: true, description: 'Se houve level up', required: false })
  leveledUp?: boolean;

  @ApiProperty({ example: 4, description: 'Nível anterior', required: false })
  previousLevel?: number;

  @ApiProperty({ example: 5, description: 'Novo nível', required: false })
  newLevel?: number;
}

export class CompetencyUpdateHistoryDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 50 })
  previousProgress: number;

  @ApiProperty({ example: 100 })
  newProgress: number;

  @ApiProperty({ example: 'Completei certificação e 5 projetos práticos' })
  notes: string | null;

  @ApiProperty({ example: 'https://example.com/certificate.pdf' })
  evidenceUrl: string | null;

  @ApiProperty({ example: 300 })
  xpEarned: number;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  createdAt: Date;
}

export class CompetencyWithHistoryDto extends CompetencyResponseDto {
  @ApiProperty({ type: [CompetencyUpdateHistoryDto] })
  updates: CompetencyUpdateHistoryDto[];
}

export class PredefinedCompetencyDto {
  @ApiProperty({ example: 'React & TypeScript' })
  name: string;

  @ApiProperty({ example: 'Desenvolvimento de aplicações web modernas com React e TypeScript' })
  description: string;

  @ApiProperty({ enum: CompetencyCategory, example: 'TECHNICAL' })
  category: CompetencyCategory;
}
