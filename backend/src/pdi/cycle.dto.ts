import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
// O enum PdiCycleStatus será gerado pelo Prisma Client após `prisma generate`.
// Para evitar erro de compilação antes da geração, usamos uma duplicação leve do enum.
export enum PdiCycleStatusDtoMirror {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

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
  @IsEnum(PdiCycleStatusDtoMirror)
  status?: PdiCycleStatusDtoMirror;

  @IsOptional()
  progressMeta?: any;
}

export class ChangeStatusDto {
  @IsEnum(PdiCycleStatusDtoMirror)
  status!: PdiCycleStatusDtoMirror;
}
