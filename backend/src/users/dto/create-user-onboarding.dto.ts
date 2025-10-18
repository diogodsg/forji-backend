import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

/**
 * DTO for creating a new user with onboarding setup (Admin only)
 * Allows setting manager, team, and workspace role in a single request
 */
export class CreateUserOnboardingDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string; // Optional - will generate if not provided

  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsEnum(WorkspaceRole)
  workspaceRole?: WorkspaceRole; // OWNER, ADMIN, MEMBER

  @IsOptional()
  @IsUUID()
  managerId?: string; // ID do gerente (manager) direto

  @IsOptional()
  @IsUUID()
  teamId?: string; // ID da equipe para adicionar o usuário
}
