import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { CompetencyCategory } from '@prisma/client';

export class UpdateCompetencyDto {
  @ApiProperty({
    description: 'Nome da competência',
    example: 'React & TypeScript',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Categoria da competência',
    enum: CompetencyCategory,
    example: 'TECHNICAL',
    required: false,
  })
  @IsEnum(CompetencyCategory)
  @IsOptional()
  category?: CompetencyCategory;

  @ApiProperty({
    description: 'Nível alvo (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  targetLevel?: number;
}
