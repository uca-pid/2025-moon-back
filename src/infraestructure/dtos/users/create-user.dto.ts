import { UserRole } from 'src/infraestructure/entities/users/user-role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  password: string;

  @IsEnum(UserRole)
  userRole: UserRole;

  @IsOptional()
  @IsString()
  workshopName?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
