import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PasswordRecoveryDto } from '../../infraestructure/dtos/users/password-recovery.dto';
import { ChangePasswordDto } from '../../infraestructure/dtos/users/change-password.dto';
import * as crypto from 'crypto';
import { IPasswordRecoveryService } from '../interfaces/password-recovery-service.interface';
import {
  IUsersRepositoryToken,
  type IUsersRepository,
} from 'src/infraestructure/repositories/interfaces/users-repository.interface';
import {
  IHashServiceToken,
  type IHashService,
} from '../interfaces/hash-service.interface';
import {
  IUsersPasswordRecoveryRepositoryToken,
  type IUsersPasswordRecoveryRepository,
} from 'src/infraestructure/repositories/interfaces/users-password-recovery-repository.interface';

@Injectable()
export class PasswordRecoveryService implements IPasswordRecoveryService {
  constructor(
    @Inject(IUsersRepositoryToken) private readonly userRepo: IUsersRepository,
    @Inject(IUsersRepositoryToken)
    @Inject(IUsersPasswordRecoveryRepositoryToken)
    private readonly passwordRecoveryRepo: IUsersPasswordRecoveryRepository,
    @Inject(IHashServiceToken) private readonly hashService: IHashService,
  ) {}

  async request(passwordRecoveryDto: PasswordRecoveryDto) {
    const user = await this.userRepo.findByEmail(passwordRecoveryDto.email);
    if (!user)
      throw new BadRequestException('No existe un usuario con ese email');

    const tokenEntity = await this.passwordRecoveryRepo.save({
      email: passwordRecoveryDto.email,
      //TODO: move this logic to random service
      token: crypto.randomBytes(32).toString('hex'),
    });

    return { token: tokenEntity.token };
  }

  async change(changePasswordDto: ChangePasswordDto) {
    const resetToken = await this.passwordRecoveryRepo.findValidToken(
      changePasswordDto.token,
      changePasswordDto.email,
    );
    if (!resetToken)
      throw new BadRequestException('Token inválido o ya utilizado');

    const user = await this.userRepo.findByEmail(changePasswordDto.email);
    if (!user) throw new BadRequestException('Usuario no encontrado');

    user.hashedPassword = await this.hashService.hash(
      changePasswordDto.newPassword,
    );
    await this.userRepo.save(user);

    await this.passwordRecoveryRepo.markAsUsed(resetToken);
  }
}
