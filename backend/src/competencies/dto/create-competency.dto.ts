import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsInt, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { CompetencyCategory } from '@prisma/client';

export class CreateCompetencyDto {
  @ApiProperty({
    description: 'ID do ciclo ao qual a competência pertence',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({
    description: 'ID do usuário dono da competência',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Nome da competência',
    example: 'React & TypeScript',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Categoria da competência',
    enum: CompetencyCategory,
    example: 'TECHNICAL',
  })
  @IsEnum(CompetencyCategory)
  @IsNotEmpty()
  category: CompetencyCategory;

  @ApiProperty({
    description: 'Nível atual da competência (1-5)',
    example: 2,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  currentLevel: number;

  @ApiProperty({
    description: 'Nível alvo a ser atingido (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  targetLevel: number;
}
