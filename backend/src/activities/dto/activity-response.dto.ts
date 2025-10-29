import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '@prisma/client';

export class OneOnOneResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'João Silva' })
  participantName: string;

  @ApiProperty({
    example: ['Implementação de feature X', 'Code review do projeto Y'],
    type: [String],
  })
  workingOn: string[];

  @ApiProperty({ example: 'Discussão produtiva sobre progresso do projeto' })
  generalNotes: string;

  @ApiProperty({ example: ['Boa comunicação', 'Proatividade'], type: [String] })
  positivePoints: string[];

  @ApiProperty({
    example: ['Melhorar documentação', 'Aumentar cobertura de testes'],
    type: [String],
  })
  improvementPoints: string[];

  @ApiProperty({ example: ['Revisar PRs pendentes', 'Iniciar estudo de GraphQL'], type: [String] })
  nextSteps: string[];
}

export class MentoringResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Maria Santos' })
  menteeName: string;

  @ApiProperty({ example: ['React Hooks', 'State Management', 'Testing'], type: [String] })
  topics: string[];

  @ApiProperty({ example: 30, required: false })
  progressFrom: number | null;

  @ApiProperty({ example: 60, required: false })
  progressTo: number | null;

  @ApiProperty({ example: 'Mentee compreendeu conceitos e criou exemplo prático', required: false })
  outcomes: string | null;

  @ApiProperty({
    example: ['Praticar com projeto pessoal', 'Revisar documentação'],
    type: [String],
  })
  nextSteps: string[];
}

export class CertificationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'AWS Certified Solutions Architect' })
  certificationName: string;

  @ApiProperty({ example: ['EC2', 'S3', 'Lambda', 'CloudFormation'], type: [String] })
  topics: string[];

  @ApiProperty({ example: 'Certificação obtida com 85% de acerto', required: false })
  outcomes: string | null;

  @ApiProperty({ example: 4, required: false })
  rating: number | null;

  @ApiProperty({
    example: ['Aplicar conhecimento em projeto real', 'Estudar advanced topics'],
    type: [String],
  })
  nextSteps: string[];
}

export class ActivityResponseDto {
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

  // Informações de level up para animações no frontend
  @ApiProperty({ example: false, required: false })
  leveledUp?: boolean;

  @ApiProperty({ example: 5, required: false })
  previousLevel?: number;

  @ApiProperty({ example: 6, required: false })
  newLevel?: number;

  @ApiProperty({ type: OneOnOneResponseDto, required: false })
  oneOnOne?: OneOnOneResponseDto;

  @ApiProperty({ type: MentoringResponseDto, required: false })
  mentoring?: MentoringResponseDto;

  @ApiProperty({ type: CertificationResponseDto, required: false })
  certification?: CertificationResponseDto;
}

export class TimelineResponseDto {
  @ApiProperty({ type: [ActivityResponseDto] })
  activities: ActivityResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  pageSize: number;

  @ApiProperty({ example: 45 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasMore: boolean;
}
