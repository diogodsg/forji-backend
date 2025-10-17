import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name', minLength: 2 })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'SecurePassword123', description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'Software Engineer', description: 'User position/role', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    example: 'Passionate about building great products',
    description: 'User bio',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
