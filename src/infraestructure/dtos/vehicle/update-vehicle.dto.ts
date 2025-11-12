import { IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  licensePlate: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsNumber()
  @IsOptional()
  year: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  km: number;
}
