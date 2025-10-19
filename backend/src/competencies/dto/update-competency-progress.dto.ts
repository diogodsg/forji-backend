import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateCompetencyProgressDto {
  @ApiProperty({
    description: 'Novo percentual de progresso no nível atual (0-100)',
    example: 75.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercentage: number;

  @ApiProperty({
    description: 'Nota/comentário sobre a atualização',
    example: 'Concluí curso avançado de TypeScript e implementei 3 features complexas',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
