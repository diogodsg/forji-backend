import { IsUUID, IsEnum } from 'class-validator';

export class SwitchWorkspaceDto {
  @IsUUID()
  workspaceId: string;
}

export enum WorkspaceRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class InviteToWorkspaceDto {
  @IsUUID()
  userId: string;

  @IsEnum(WorkspaceRole)
  role: WorkspaceRole;
}
