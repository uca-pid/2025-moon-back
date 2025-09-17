import { ChangePasswordDto } from 'src/infraestructure/dtos/users/change-password.dto';
import { PasswordRecoveryDto } from 'src/infraestructure/dtos/users/password-recovery.dto';

export interface IPasswordRecoveryService {
  request(passwordRecoveryDto: PasswordRecoveryDto): Promise<{ token: string }>;
  change(changePasswordDto: ChangePasswordDto): Promise<void>;
}

export const IPasswordRecoveryServiceToken = 'PasswordRecoveryService';
