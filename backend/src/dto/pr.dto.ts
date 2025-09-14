import {
  IsOptional,
  IsString,
  IsInt,
  IsEnum,
  IsISO8601,
  IsNumber,
  Min,
  IsPositive,
} from "class-validator";

// Minimal enum mirror (avoid importing generated Prisma types directly into DTO layer)
export enum PrStateDtoEnum {
  open = "open",
  closed = "closed",
  merged = "merged",
}

export class UpsertPullRequestDto {
  @IsInt()
  @IsPositive()
  id!: number; // GitHub numeric id (BigInt representable)

  @IsOptional()
  @IsInt()
  number?: number;

  @IsOptional()
  @IsString()
  node_id?: string;

  @IsOptional()
  @IsString()
  user?: string; // github login

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  repo?: string; // org/repo

  @IsOptional()
  @IsEnum(PrStateDtoEnum)
  state?: PrStateDtoEnum;

  // Dates as ISO strings
  @IsOptional()
  @IsString()
  created_at?: string;
  @IsOptional()
  @IsString()
  updated_at?: string;
  @IsOptional()
  @IsString()
  closed_at?: string;
  @IsOptional()
  @IsString()
  merged_at?: string;
  @IsOptional()
  @IsString()
  last_reviewed_at?: string;

  @IsOptional()
  @IsString()
  review_text?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_additions?: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_deletions?: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_changes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  files_changed?: number;

  @IsOptional()
  @IsInt()
  ownerUserId?: number;
}
