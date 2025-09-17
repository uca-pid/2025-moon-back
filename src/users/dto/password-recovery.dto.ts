import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PasswordRecoveryDto {
  @IsEmail()
  email: string;
}
