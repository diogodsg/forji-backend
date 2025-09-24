import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from "class-validator";

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}

export enum TeamRoleDto {
  MEMBER = "MEMBER",
  MANAGER = "MANAGER",
}

export class AddMemberDto {
  @IsInt()
  teamId!: number;

  @IsInt()
  userId!: number;

  @IsOptional()
  @IsEnum(TeamRoleDto)
  role?: TeamRoleDto;
}

export class UpdateMemberRoleDto {
  @IsInt()
  teamId!: number;

  @IsInt()
  userId!: number;

  @IsEnum(TeamRoleDto)
  role!: TeamRoleDto;
}
