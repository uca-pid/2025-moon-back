import { UserRole } from 'src/infraestructure/entities/users/user-role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
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
