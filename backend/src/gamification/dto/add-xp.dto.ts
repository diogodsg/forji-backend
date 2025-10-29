import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { XpSource } from '@prisma/client';

/**
 * Add XP DTO
 *
 * DTO para adicionar XP ao perfil de um usuário.
 * Uso interno (chamado por outros serviços, não exposto publicamente).
 */
export class AddXpDto {
  @ApiProperty({
    description: 'ID do usuário que receberá XP',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID do workspace (perfil de gamificação é por workspace)',
    example: '550e8400-e29b-41d4-a716-446655440010',
  })
  @IsString()
  workspaceId: string;

  @ApiProperty({
    description: 'Quantidade de XP a adicionar',
    example: 50,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  xpAmount: number;

  @ApiProperty({
    description: 'Razão/origem do XP (ex: "1:1 completed", "goal_update")',
    example: 'one_on_one_completed',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: 'Fonte do XP para classificação na transação',
    example: 'ACTIVITY_ONE_ON_ONE',
    enum: XpSource,
    required: false,
  })
  @IsEnum(XpSource)
  @IsOptional()
  source?: XpSource;

  @ApiProperty({
    description: 'ID da entidade que gerou o XP (atividade, goal, etc.)',
    example: '550e8400-e29b-41d4-a716-446655440123',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  sourceId?: string;
}
