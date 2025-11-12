import { IsNumber, IsPositive } from 'class-validator';

export class CreateEntryDto {
  @IsNumber()
  sparePartId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
