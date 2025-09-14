import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
} from "class-validator";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class AdminCreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  githubId?: string | null;
}

export class SetGithubIdDto {
  @IsInt()
  userId!: number;

  @IsOptional()
  @IsString()
  githubId?: string | null;
}

export class DeleteUserDto {
  @IsInt()
  userId!: number;
}

export class SetAdminDto {
  @IsInt()
  userId!: number;

  @IsBoolean()
  isAdmin!: boolean;
}

export class RelationDto {
  @IsInt()
  userId!: number;

  @IsInt()
  managerId!: number;
}

export class UserProfileDto {
  id!: string | number;
  email!: string;
  name!: string;
  githubId?: string | null;
  isAdmin!: boolean;
  isManager!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
