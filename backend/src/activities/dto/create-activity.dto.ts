import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  Max,
  IsDateString,
} from 'class-validator';
import { ActivityType } from '@prisma/client';

// DTOs específicos para cada tipo de atividade
export class CreateOneOnOneDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  participantId: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  participantName: string;

  @ApiProperty({
    example: '2025-10-25T14:00:00Z',
    description: 'Data de realização do 1:1',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @ApiProperty({
    example: ['Implementação de feature X', 'Code review do projeto Y'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  workingOn: string[];

  @ApiProperty({ example: 'Discussão produtiva sobre progresso do projeto' })
  @IsString()
  @IsNotEmpty()
  generalNotes: string;

  @ApiProperty({
    example: ['Boa comunicação', 'Proatividade'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  positivePoints: string[];

  @ApiProperty({
    example: ['Melhorar documentação', 'Aumentar cobertura de testes'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  improvementPoints: string[];

  @ApiProperty({
    example: ['Revisar PRs pendentes', 'Iniciar estudo de GraphQL'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  nextSteps: string[];
}

export class CreateMentoringDto {
  @ApiProperty({ example: 'Maria Santos' })
  @IsString()
  @IsNotEmpty()
  menteeName: string;

  @ApiProperty({ example: ['React Hooks', 'State Management', 'Testing'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  topics: string[];

  @ApiProperty({ example: 30, required: false, description: 'Progresso inicial (%)' })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressFrom?: number;

  @ApiProperty({ example: 60, required: false, description: 'Progresso final (%)' })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressTo?: number;

  @ApiProperty({ example: 'Mentee compreendeu conceitos e criou exemplo prático', required: false })
  @IsString()
  @IsOptional()
  outcomes?: string;

  @ApiProperty({
    example: ['Praticar com projeto pessoal', 'Revisar documentação'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  nextSteps: string[];
}

export class CreateCertificationDto {
  @ApiProperty({ example: 'AWS Certified Solutions Architect' })
  @IsString()
  @IsNotEmpty()
  certificationName: string;

  @ApiProperty({ example: ['EC2', 'S3', 'Lambda', 'CloudFormation'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  topics: string[];

  @ApiProperty({ example: 'Certificação obtida com 85% de acerto', required: false })
  @IsString()
  @IsOptional()
  outcomes?: string;

  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 5,
    required: false,
    description: 'Avaliação 1-5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({
    example: ['Aplicar conhecimento em projeto real', 'Estudar advanced topics'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  nextSteps: string[];
}

export class CreateActivityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ActivityType, example: 'ONE_ON_ONE' })
  @IsEnum(ActivityType)
  @IsNotEmpty()
  type: ActivityType;

  @ApiProperty({ example: '1:1 com João Silva - Q1 2025' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Reunião de acompanhamento trimestral', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, required: false, description: 'Duração em minutos' })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  // Dados específicos por tipo (apenas um deve ser preenchido)
  @ApiProperty({ type: CreateOneOnOneDto, required: false })
  @ValidateNested()
  @Type(() => CreateOneOnOneDto)
  @IsOptional()
  oneOnOneData?: CreateOneOnOneDto;

  @ApiProperty({ type: CreateMentoringDto, required: false })
  @ValidateNested()
  @Type(() => CreateMentoringDto)
  @IsOptional()
  mentoringData?: CreateMentoringDto;

  @ApiProperty({ type: CreateCertificationDto, required: false })
  @ValidateNested()
  @Type(() => CreateCertificationDto)
  @IsOptional()
  certificationData?: CreateCertificationDto;
}
