import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsBoolean,
  IsISO8601,
  ArrayNotEmpty,
} from "class-validator";

export class PdiTaskDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsBoolean()
  done?: boolean;
}

export class CreateTaskDto {
  @IsString()
  title!: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  done?: boolean;
}

export class PdiMilestoneDto {
  @IsString()
  id!: string;

  @IsISO8601()
  date!: string;

  @IsString()
  title!: string;

  @IsString()
  summary!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  improvements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  positives?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resources?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PdiTaskDto)
  tasks?: PdiTaskDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestions?: string[];
}

export class CreateMilestoneDto {
  @IsISO8601()
  date!: string;

  @IsString()
  title!: string;

  @IsString()
  summary!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  improvements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  positives?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resources?: string[];
}

export class UpdateMilestoneDto {
  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  improvements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  positives?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resources?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdiTaskDto)
  tasks?: PdiTaskDto[];
}

export class PdiKeyResultDto {
  @IsString()
  id!: string;

  @IsString()
  description!: string;

  @IsString()
  successCriteria!: string;

  @IsOptional()
  @IsString()
  currentStatus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  improvementActions?: string[];
}

export class CreateKeyResultDto {
  @IsString()
  description!: string;

  @IsString()
  successCriteria!: string;
}

export class UpdateKeyResultDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  successCriteria?: string;

  @IsOptional()
  @IsString()
  currentStatus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  improvementActions?: string[];
}

export class PdiCompetencyRecordDto {
  @IsString()
  area!: string;
}

export class PdiPlanDto {
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

export class PartialPdiPlanDto {
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

export class BulkCompetenciesDto {
  @ArrayNotEmpty()
  @IsString({ each: true })
  competencies!: string[];
}
