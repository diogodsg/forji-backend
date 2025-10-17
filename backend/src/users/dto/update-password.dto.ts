import { IsString, MinLength } from 'class-validator';

/**
 * DTO for updating password
 */
export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
