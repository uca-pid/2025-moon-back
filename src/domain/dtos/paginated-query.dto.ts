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

  @IsOptional()
  @IsString()
  @Matches(/^(ASC|DESC)$/i, {
    message: 'order must be either ASC or DESC',
  })
  orderDir?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  orderBy?: string = 'id';
}
