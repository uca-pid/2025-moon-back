import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/infraestructure/rest-api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/infraestructure/entities/users/user.entity';
import { UserPasswordRecovery } from 'src/infraestructure/entities/users/password-recovery.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'estaller',
      entities: [User, UserPasswordRecovery],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
