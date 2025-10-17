import { IsString, IsEmail, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';

/**
 * DTO for creating a new user (Admin only)
 */
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
