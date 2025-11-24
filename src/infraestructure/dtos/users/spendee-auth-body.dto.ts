import { IsNotEmpty, IsString } from 'class-validator';

export class SpendeeAuthBodyDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
