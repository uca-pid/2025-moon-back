import { Module } from '@nestjs/common';
import { UsersService } from 'src/domain/services/users/users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from 'src/infraestructure/repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { UserReview } from 'src/infraestructure/entities/user/user-review.entity';
import { HashService } from 'src/infraestructure/services/hash.service';
import { JwtService } from 'src/infraestructure/services/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { PasswordRecoveryService } from 'src/domain/services/users/password-recovery.service';
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
import { UserPasswordRecovery } from 'src/infraestructure/entities/user/password-recovery.entity';
import { UserReviewService } from 'src/domain/services/users/user-review.service';
import { IUserReviewServiceToken } from 'src/domain/interfaces/user-review.interface';
import { UserReviewRepository } from 'src/infraestructure/repositories/user-review.repository';
import { IUserReviewRepositoryToken } from 'src/infraestructure/repositories/interfaces/user-review.repository.interface';
import { IUsersTokenRepositoryToken } from 'src/infraestructure/repositories/interfaces/users-token-repository.interface';
import { UsersTokenRepository } from 'src/infraestructure/repositories/users-token.repository';
import { ExpenseTrackerModule } from 'src/infraestructure/services/expense-tracker/expense-tracker.module';
import { IUsersTokenServiceToken } from 'src/domain/interfaces/users-token-service.interface';
import { UsersTokenService } from 'src/domain/services/users/users-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPasswordRecovery, UserReview]),
    ConfigModule,
    ExpenseTrackerModule,
  ],
  exports: [IUsersServiceToken, IUsersTokenServiceToken],
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
    { provide: IUserReviewRepositoryToken, useClass: UserReviewRepository },
    { provide: IUserReviewServiceToken, useClass: UserReviewService },
    { provide: IUsersTokenRepositoryToken, useClass: UsersTokenRepository },
    { provide: IUsersTokenServiceToken, useClass: UsersTokenService },
  ],
})
export class UsersModule {}
