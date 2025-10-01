import {
  IsArray,
  IsNotEmpty,
  IsNumber,
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
  @IsNumber()
  sparePartId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
