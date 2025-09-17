import { Module } from '@nestjs/common';
import { UsersService } from 'src/domain/services/users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from 'src/infraestructure/repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infraestructure/entities/users/user.entity';
import { HashService } from 'src/infraestructure/services/hash.service';
import { JwtService } from 'src/infraestructure/services/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { PasswordRecoveryService } from 'src/domain/services/password-recovery.service';
import { UserPasswordRecoveryRepository } from 'src/infraestructure/repositories/password-recovery.repository';
import { IUsersServiceToken } from 'src/domain/interfaces/users-service.interface';
import { IJwtServiceToken } from 'src/domain/interfaces/jwt-service.interface';
import { IHashServiceToken } from 'src/domain/interfaces/hash-service.interface';
import { IUsersPasswordRecoveryRepositoryToken } from 'src/infraestructure/repositories/interfaces/users-password-recovery-repository.interface';
import { IUsersRepositoryToken } from 'src/infraestructure/repositories/interfaces/users-repository.interface';
import { IPasswordRecoveryServiceToken } from 'src/domain/interfaces/password-recovery-service.interface';
import { IRandomServiceToken } from 'src/infraestructure/repositories/interfaces/random-service.interface';
import { RandomService } from 'src/infraestructure/services/random.service';
import { IEmailServiceToken } from 'src/domain/interfaces/email-service.interface';
import { EmailService } from 'src/infraestructure/services/email.service';
import { UserPasswordRecovery } from 'src/infraestructure/entities/users/password-recovery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPasswordRecovery]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    { provide: IUsersRepositoryToken, useClass: UsersRepository },
    {
      provide: IPasswordRecoveryServiceToken,
      useClass: PasswordRecoveryService,
    },
    {
      provide: IUsersPasswordRecoveryRepositoryToken,
      useClass: UserPasswordRecoveryRepository,
    },
    { provide: IUsersServiceToken, useClass: UsersService },
    { provide: IJwtServiceToken, useClass: JwtService },
    { provide: IHashServiceToken, useClass: HashService },
    { provide: IRandomServiceToken, useClass: RandomService },
    { provide: IEmailServiceToken, useClass: EmailService },
  ],
})
export class UsersModule {}
