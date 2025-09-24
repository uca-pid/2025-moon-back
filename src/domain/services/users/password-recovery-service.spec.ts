import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRecoveryService } from './password-recovery.service';
import { ChangePasswordDto } from 'src/infraestructure/dtos/users/change-password.dto';
import { UnauthorizedException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import {
  IUsersRepository,
  IUsersRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/users-repository.interface';
import {
  IUsersPasswordRecoveryRepository,
  IUsersPasswordRecoveryRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/users-password-recovery-repository.interface';
import {
  IHashService,
  IHashServiceToken,
} from 'src/domain/interfaces/hash-service.interface';
import {
  IRandomService,
  IRandomServiceToken,
} from 'src/infraestructure/repositories/interfaces/random-service.interface';
import {
  IEmailService,
  IEmailServiceToken,
} from 'src/domain/interfaces/email-service.interface';
import { ConfigService } from '@nestjs/config';

describe('PasswordRecoveryService', () => {
  let service: PasswordRecoveryService;
  let userRepo: DeepMockProxy<IUsersRepository>;
  let passwordRecoveryRepo: DeepMockProxy<IUsersPasswordRecoveryRepository>;
  let hashService: DeepMockProxy<IHashService>;
  let randomService: DeepMockProxy<IRandomService>;
  let emailService: DeepMockProxy<IEmailService>;
  let configService: DeepMockProxy<ConfigService>;

  beforeEach(async () => {
    userRepo = mockDeep<IUsersRepository>();
    passwordRecoveryRepo = mockDeep<IUsersPasswordRecoveryRepository>();
    hashService = mockDeep<IHashService>();
    randomService = mockDeep<IRandomService>();
    emailService = mockDeep<IEmailService>();
    configService = mockDeep<ConfigService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordRecoveryService,
        { provide: IUsersRepositoryToken, useValue: userRepo },
        {
          provide: IUsersPasswordRecoveryRepositoryToken,
          useValue: passwordRecoveryRepo,
        },
        { provide: IHashServiceToken, useValue: hashService },
        { provide: IRandomServiceToken, useValue: randomService },
        { provide: IEmailServiceToken, useValue: emailService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(PasswordRecoveryService);
  });

  describe('request', () => {
    it('should do nothing if user does not exist', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(
        service.request({ email: 'notfound@mail.com' }),
      ).resolves.toBeUndefined();
      expect(passwordRecoveryRepo.findLatestUnusedEmail).not.toHaveBeenCalled();
    });

    it('should use existing unused token if present', async () => {
      userRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'a@mail.com',
      } as any);
      passwordRecoveryRepo.findLatestUnusedEmail.mockResolvedValue({
        token: 'existing-token',
      } as any);
      configService.getOrThrow.mockReturnValue('http://frontend/recover');
      await service.request({ email: 'a@mail.com' });
      expect(emailService.sendPasswordRecovery).toHaveBeenCalledWith(
        expect.stringContaining('existing-token'),
        'a@mail.com',
      );
      expect(passwordRecoveryRepo.save).not.toHaveBeenCalled();
    });

    it('should generate and save a new token if none exists', async () => {
      userRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'b@mail.com',
      } as any);
      passwordRecoveryRepo.findLatestUnusedEmail.mockResolvedValue(null);
      randomService.randomString.mockReturnValue('new-token');
      passwordRecoveryRepo.findByToken.mockResolvedValue(null);
      configService.getOrThrow.mockReturnValue('http://frontend/recover');
      await service.request({ email: 'b@mail.com' });
      expect(passwordRecoveryRepo.save).toHaveBeenCalledWith({
        email: 'b@mail.com',
        token: 'new-token',
      });
      expect(emailService.sendPasswordRecovery).toHaveBeenCalledWith(
        expect.stringContaining('new-token'),
        'b@mail.com',
      );
    });

    it('should throw if unique token cannot be generated', async () => {
      userRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'c@mail.com',
      } as any);
      passwordRecoveryRepo.findLatestUnusedEmail.mockResolvedValue(null);
      randomService.randomString.mockReturnValue('dup-token');
      passwordRecoveryRepo.findByToken.mockResolvedValue({
        token: 'dup-token',
      } as any);
      configService.getOrThrow.mockReturnValue('http://frontend/recover');
      await expect(service.request({ email: 'c@mail.com' })).rejects.toThrow(
        'Failed to generate a unique password recovery token after maximum retries',
      );
    });
  });

  describe('change', () => {
    const changePasswordDto: ChangePasswordDto = {
      token: 'valid-token',
      email: 'user@mail.com',
      newPassword: 'newpass123',
    };

    it('should throw if token is invalid or used', async () => {
      passwordRecoveryRepo.findValidToken.mockResolvedValue(null);
      await expect(service.change(changePasswordDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if user is not found', async () => {
      passwordRecoveryRepo.findValidToken.mockResolvedValue({
        token: 'valid-token',
      } as any);
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(service.change(changePasswordDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should hash new password, save user, and mark token as used', async () => {
      passwordRecoveryRepo.findValidToken.mockResolvedValue({
        token: 'valid-token',
      } as any);

      const user: any = {
        id: 1,
        email: 'user@mail.com',
        hashedPassword: 'old',
      };
      userRepo.findByEmail.mockResolvedValue(user);
      hashService.hash.mockResolvedValue('hashed-new');
      await service.change(changePasswordDto);
      expect(hashService.hash).toHaveBeenCalledWith('newpass123');
      expect(userRepo.save).toHaveBeenCalledWith({
        ...user,
        hashedPassword: 'hashed-new',
      });
      expect(passwordRecoveryRepo.markAsUsed).toHaveBeenCalledWith({
        token: 'valid-token',
      });
    });
  });
});
