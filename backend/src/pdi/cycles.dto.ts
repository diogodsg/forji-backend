import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import {
  PdiMilestoneDto,
  PdiKeyResultDto,
  PdiCompetencyRecordDto,
} from "./pdi.dto";

export enum PdiCycleStatusDto {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
}

export class CreatePdiCycleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsEnum(PdiCycleStatusDto)
  status?: PdiCycleStatusDto;

  @IsArray()
  @IsString({ each: true })
  competencies!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdiMilestoneDto)
  milestones!: PdiMilestoneDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PdiKeyResultDto)
  krs?: PdiKeyResultDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdiCompetencyRecordDto)
  records!: PdiCompetencyRecordDto[];
}

export class UpdatePdiCycleDto {
  @IsOptional()
  @IsString()
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
  @IsEnum(PdiCycleStatusDto)
  status?: PdiCycleStatusDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competencies?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdiMilestoneDto)
  milestones?: PdiMilestoneDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PdiKeyResultDto)
  krs?: PdiKeyResultDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdiCompetencyRecordDto)
  records?: PdiCompetencyRecordDto[];
}
