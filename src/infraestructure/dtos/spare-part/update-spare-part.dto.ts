import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateSparePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  stock: number;
}
