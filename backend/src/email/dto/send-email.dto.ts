import { IsEmail, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { EmailType } from '../interfaces/email.interface';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsEnum(EmailType)
  type: EmailType;

  @IsObject()
  @IsOptional()
  data?: any;
}
