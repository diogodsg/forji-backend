import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ManagementRuleType } from '@prisma/client';

export class CreateRuleDto {
  @IsEnum(ManagementRuleType)
  @IsNotEmpty()
  type: ManagementRuleType;

  @IsString()
  @IsNotEmpty()
  managerId: string;

  @IsString()
  @IsOptional()
  subordinateId?: string;

  @IsString()
  @IsOptional()
  teamId?: string;
}
