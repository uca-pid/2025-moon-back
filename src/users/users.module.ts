import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashService } from 'src/hash.service';
import { JwtService } from 'src/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { PasswordRecoveryService } from './password-recovery.service';
import { UserPasswordRecoveryRepository } from './repositories/password-recovery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    HashService,
    JwtService,
    PasswordRecoveryService,
    UserPasswordRecoveryRepository,
  ],
})
export class UsersModule {}
