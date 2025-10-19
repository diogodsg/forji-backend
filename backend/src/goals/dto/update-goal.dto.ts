import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { GoalStatus, GoalType } from '@prisma/client';

export class UpdateGoalDto {
  @ApiProperty({
    description: 'Tipo da meta',
    enum: GoalType,
    example: 'INCREASE',
    required: false,
  })
  @IsEnum(GoalType)
  @IsOptional()
  type?: GoalType;

  @ApiProperty({
    description: 'Título da meta',
    example: 'Aumentar PRs mergeados',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Descrição da meta',
    example: 'Contribuir mais com code reviews',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Valor alvo',
    example: 20,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  targetValue?: number;

  @ApiProperty({
    description: 'Unidade de medida',
    example: 'PRs',
    required: false,
  })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({
    description: 'Status da meta',
    enum: GoalStatus,
    example: 'IN_PROGRESS',
    required: false,
  })
  @IsEnum(GoalStatus)
  @IsOptional()
  status?: GoalStatus;
}
