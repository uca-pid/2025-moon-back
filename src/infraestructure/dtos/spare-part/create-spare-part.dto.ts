import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateSparePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  stock: number;
}
