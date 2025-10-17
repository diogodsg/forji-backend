import { IsUUID, IsEnum } from 'class-validator';
import { TeamRole } from '@prisma/client';

/**
 * DTO for adding a member to a team
 */
export class AddMemberDto {
  @IsUUID()
  userId: string;

  @IsEnum(TeamRole)
  role: TeamRole;
}

/**
 * DTO for updating a team member's role
 */
export class UpdateMemberRoleDto {
  @IsEnum(TeamRole)
  role: TeamRole;
}
