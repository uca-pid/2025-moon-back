import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';

export class PaginatedQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Format: field,order (e.g., name,asc or createdAt,desc etc)
   */
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+,(asc|desc)$/)
  order?: string;
}
