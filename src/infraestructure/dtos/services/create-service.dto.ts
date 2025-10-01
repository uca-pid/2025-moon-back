import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceSparePartDto)
  spareParts: ServiceSparePartDto[];
}

export class ServiceSparePartDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  sparePartId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
