import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsGreaterThanZero } from 'src/infraestructure/rest-api/decorators/is-greater-than-zero-decorator';
export class CreateSparePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsGreaterThanZero()
  stock: number;
}
