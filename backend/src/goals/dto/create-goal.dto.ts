import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { GoalType } from '@prisma/client';

export class CreateGoalDto {
  @ApiProperty({
    description: 'ID do ciclo ao qual a meta pertence',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({
    description: 'ID do usuário dono da meta',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID do workspace',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({
    description: 'Tipo da meta',
    enum: GoalType,
    example: 'INCREASE',
  })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty({
    description: 'Título da meta',
    example: 'Aumentar PRs mergeados',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da meta',
    example: 'Contribuir mais ativamente com code reviews e PRs',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Valor inicial da meta',
    example: 5,
  })
  @IsNumber()
  @Min(0)
  startValue: number;

  @ApiProperty({
    description: 'Valor alvo a ser atingido',
    example: 15,
  })
  @IsNumber()
  @Min(0)
  targetValue: number;

  @ApiProperty({
    description: 'Unidade de medida (ex: PRs, bugs, %, certificação)',
    example: 'PRs',
  })
  @IsString()
  @IsNotEmpty()
  unit: string;
}
