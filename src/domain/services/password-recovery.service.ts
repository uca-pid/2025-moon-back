import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordRecoveryDto } from '../../infraestructure/dtos/users/password-recovery.dto';
import { ChangePasswordDto } from '../../infraestructure/dtos/users/change-password.dto';
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
import {
  type IRandomService,
  IRandomServiceToken,
} from 'src/infraestructure/repositories/interfaces/random-service.interface';
import {
  type IEmailService,
  IEmailServiceToken,
} from '../interfaces/email-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordRecoveryService implements IPasswordRecoveryService {
  constructor(
    @Inject(IUsersRepositoryToken) private readonly userRepo: IUsersRepository,
    @Inject(IUsersPasswordRecoveryRepositoryToken)
    private readonly passwordRecoveryRepo: IUsersPasswordRecoveryRepository,
    @Inject(IHashServiceToken) private readonly hashService: IHashService,
    @Inject(IRandomServiceToken) private readonly randomService: IRandomService,
    @Inject(IEmailServiceToken) private readonly emailService: IEmailService,
    private readonly configService: ConfigService,
  ) {}

  async request(dto: PasswordRecoveryDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    // if no user is found, just ignore request
    if (!user) return;

    const existing = await this.passwordRecoveryRepo.findLatestUnusedEmail(
      dto.email,
    );
    const tokenToUse = existing
      ? existing.token
      : await this.generateUniqueRandomToken();
    if (!existing) {
      await this.passwordRecoveryRepo.save({
        email: dto.email,
        token: tokenToUse,
      });
    }

    const baseUrl = this.configService.getOrThrow<string>(
      'FRONT_RECOVERY_PASSWORD_URL',
    );
    const url = `${baseUrl}?token=${tokenToUse}&email=${dto.email}`;
    await this.emailService.sendPasswordRecovery(url, dto.email);
  }

  private async generateUniqueRandomToken(): Promise<string> {
    const MAX_RETRIES = 10;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const token = this.randomService.randomString(32);
      const entity = await this.passwordRecoveryRepo.findByToken(token);
      const tokenAlreadyExists = entity !== null;
      if (!tokenAlreadyExists) return token;
    }
    throw new Error(
      'Failed to generate a unique password recovery token after maximum retries',
    );
  }

  async change(changePasswordDto: ChangePasswordDto) {
    const resetToken = await this.passwordRecoveryRepo.findValidToken(
      changePasswordDto.token,
      changePasswordDto.email,
    );
    if (!resetToken)
      throw new UnauthorizedException('Token inválido o ya utilizado');

    const user = await this.userRepo.findByEmail(changePasswordDto.email);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    user.hashedPassword = await this.hashService.hash(
      changePasswordDto.newPassword,
    );
    await this.userRepo.save(user);

    await this.passwordRecoveryRepo.markAsUsed(resetToken);
  }
}
