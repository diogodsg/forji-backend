import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  ValidateNested,
  IsArray,
  Max,
} from 'class-validator';

// DTOs específicos para atualização de cada tipo de atividade
export class UpdateOneOnOneDto {
  @ApiProperty({ example: 'João Silva', required: false })
  @IsString()
  @IsOptional()
  participantName?: string;

  @ApiProperty({
    example: ['Implementação de feature X', 'Code review do projeto Y'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  workingOn?: string[];

  @ApiProperty({ example: 'Discussão produtiva sobre progresso do projeto', required: false })
  @IsString()
  @IsOptional()
  generalNotes?: string;

  @ApiProperty({
    example: ['Boa comunicação', 'Proatividade'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  positivePoints?: string[];

  @ApiProperty({
    example: ['Melhorar documentação', 'Aumentar cobertura de testes'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  improvementPoints?: string[];

  @ApiProperty({
    example: ['Revisar PRs pendentes', 'Iniciar estudo de GraphQL'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  nextSteps?: string[];
}

export class UpdateMentoringDto {
  @ApiProperty({ example: 'Maria Santos', required: false })
  @IsString()
  @IsOptional()
  menteeName?: string;

  @ApiProperty({
    example: ['React Hooks', 'State Management', 'Testing'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];

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

  @ApiProperty({ example: 4, required: false, description: 'Avaliação da sessão (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}

export class UpdateCertificationDto {
  @ApiProperty({ example: 'AWS Solutions Architect', required: false })
  @IsString()
  @IsOptional()
  certificationName?: string;

  @ApiProperty({ example: ['AWS', 'Cloud', 'Architecture'], type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];

  @ApiProperty({ example: 'Certificação obtida com aproveitamento de 95%', required: false })
  @IsString()
  @IsOptional()
  outcomes?: string;

  @ApiProperty({ example: 4, required: false, description: 'Avaliação (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}

// DTO principal de atualização
export class UpdateActivityDto {
  @ApiProperty({ example: '1:1 Semanal com João', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Discussão sobre progresso e objetivos', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, required: false, description: 'Duração em minutos' })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiProperty({ type: UpdateOneOnOneDto, required: false })
  @ValidateNested()
  @Type(() => UpdateOneOnOneDto)
  @IsOptional()
  oneOnOneData?: UpdateOneOnOneDto;

  @ApiProperty({ type: UpdateMentoringDto, required: false })
  @ValidateNested()
  @Type(() => UpdateMentoringDto)
  @IsOptional()
  mentoringData?: UpdateMentoringDto;

  @ApiProperty({ type: UpdateCertificationDto, required: false })
  @ValidateNested()
  @Type(() => UpdateCertificationDto)
  @IsOptional()
  certificationData?: UpdateCertificationDto;
}
