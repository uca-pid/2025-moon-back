import { IsNotEmpty, IsString } from 'class-validator';

export class AutocompleteAddressQueryDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}
