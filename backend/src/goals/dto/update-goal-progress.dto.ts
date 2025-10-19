import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class UpdateGoalProgressDto {
  @ApiProperty({
    description: 'Novo valor atual da meta',
    example: 12,
  })
  @IsNumber()
  @Min(0)
  newValue: number;

  @ApiProperty({
    description: 'Nota/comentário sobre a atualização',
    example: 'Fiz 3 PRs esta semana, incluindo refatoração do módulo de auth',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
