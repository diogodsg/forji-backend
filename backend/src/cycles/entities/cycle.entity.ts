import { ApiProperty } from '@nestjs/swagger';
import { CycleStatus } from '@prisma/client';

export class CycleEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Q1 2025' })
  name: string;

  @ApiProperty({ example: 'Ciclo focado em desenvolvimento técnico e liderança' })
  description: string | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2025-03-31T23:59:59.999Z' })
  endDate: Date;

  @ApiProperty({ enum: CycleStatus, example: 'ACTIVE' })
  status: CycleStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  userId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  workspaceId: string;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T14:00:00.000Z' })
  updatedAt: Date;
}
