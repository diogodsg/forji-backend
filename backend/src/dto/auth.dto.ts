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
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  githubId?: string | null;

  @IsOptional()
  @IsString()
  position?: string;
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
  position?: string;
  bio?: string;
  isAdmin!: boolean;
  isManager!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  githubId?: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class AdminChangePasswordDto {
  @IsInt()
  userId!: number;

  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string; // Se não fornecido, gera automaticamente
}
