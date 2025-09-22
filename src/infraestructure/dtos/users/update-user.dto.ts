import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsLatitude()
  addressLatitude?: number;

  @IsOptional()
  @IsLongitude()
  addressLongitude?: number;
}
