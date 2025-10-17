import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { TeamStatus } from '@prisma/client';

/**
 * DTO for updating a team
 */
export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus;
}
