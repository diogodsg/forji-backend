import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { CycleStatus } from '@prisma/client';

export class UpdateCycleDto {
  @ApiProperty({
    description: 'Nome do ciclo',
    example: 'Q1 2025 - Atualizado',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descrição do ciclo',
    example: 'Foco em soft skills e certificações',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Data de início do ciclo (ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Data de fim do ciclo (ISO 8601)',
    example: '2025-03-31T23:59:59.999Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Status do ciclo',
    enum: CycleStatus,
    example: 'ACTIVE',
    required: false,
  })
  @IsEnum(CycleStatus)
  @IsOptional()
  status?: CycleStatus;
}
