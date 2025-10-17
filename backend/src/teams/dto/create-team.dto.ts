import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

/**
 * DTO for creating a new team
 */
export class CreateTeamDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
