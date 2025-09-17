import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPasswordRecoveryRepository } from './repositories/password-recovery.repository';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersRepository } from './repositories/users.repository';
import { HashService } from 'src/hash.service';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly UserRepo: UsersRepository,
    private readonly passwordRecoveryRepo: UserPasswordRecoveryRepository,
    private readonly hashService: HashService,
  ) {}

  async requestPasswordRecovery(passwordRecoveryDto: PasswordRecoveryDto) {
    const user = await this.UserRepo.findByEmail(passwordRecoveryDto.email);
    if (!user)
      throw new BadRequestException('No existe un usuario con ese email');

    const tokenEntity = await this.passwordRecoveryRepo.createToken(
      passwordRecoveryDto.email,
    );

    return { token: tokenEntity.token };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const resetToken = await this.passwordRecoveryRepo.findValidToken(
      changePasswordDto.token,
      changePasswordDto.email,
    );
    if (!resetToken)
      throw new BadRequestException('Token inválido o ya utilizado');

    const user = await this.UserRepo.findByEmail(changePasswordDto.email);
    if (!user) throw new BadRequestException('Usuario no encontrado');

    user.hashedPassword = await this.hashService.hash(
      changePasswordDto.newPassword,
    );
    await this.UserRepo.save(user);

    await this.passwordRecoveryRepo.markAsUsed(resetToken);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
