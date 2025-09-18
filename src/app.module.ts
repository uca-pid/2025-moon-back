import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/infraestructure/rest-api/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticateUserMiddleware } from 'src/infraestructure/rest-api/middleware/authenticate-user.middleware';
import { User } from 'src/infraestructure/entities/users/user.entity';
import { UserPasswordRecovery } from 'src/infraestructure/entities/users/password-recovery.entity';
import { IJwtServiceToken } from './domain/interfaces/jwt-service.interface';
import { JwtService } from './infraestructure/services/jwt.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'estaller'),
        entities: [User, UserPasswordRecovery],
        synchronize:
          configService.get<string>('NODE_ENV', 'development') !== 'production',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: IJwtServiceToken,
      useClass: JwtService,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateUserMiddleware).forRoutes('*');
  }
}
