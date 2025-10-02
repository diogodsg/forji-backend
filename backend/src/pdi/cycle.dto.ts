import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { PdiCycleStatus } from "@prisma/client";

export class CreatePdiCycleDto {
  @IsString()
  @Length(2, 120)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string; // validação de coerência de datas será feita no service

  @IsArray()
  @IsString({ each: true })
  competencies: string[] = [];

  @IsOptional()
  krs?: any;

  @IsNotEmpty()
  milestones!: any; // estrutura já validada no frontend; manter flexível

  @IsNotEmpty()
  records!: any; // idem
}

export class UpdatePdiCycleDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competencies?: string[];

  @IsOptional()
  krs?: any;

  @IsOptional()
  milestones?: any;

  @IsOptional()
  records?: any;

  @IsOptional()
  @IsEnum(PdiCycleStatus)
  status?: PdiCycleStatus;

  @IsOptional()
  progressMeta?: any;
}

export class ChangeStatusDto {
  @IsEnum(PdiCycleStatus)
  status!: PdiCycleStatus;
}
