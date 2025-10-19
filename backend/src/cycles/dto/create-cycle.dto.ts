import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class CreateCycleDto {
  @ApiProperty({
    description: 'Nome do ciclo (ex: "Q1 2025", "Trimestre 1")',
    example: 'Q1 2025',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição/objetivo do ciclo',
    example: 'Ciclo focado em desenvolvimento técnico e liderança',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Data de início do ciclo (ISO 8601)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Data de fim do ciclo (ISO 8601)',
    example: '2025-03-31T23:59:59.999Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'ID do usuário ao qual o ciclo pertence',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID do workspace',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;
}
