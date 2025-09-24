
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/infraestructure/rest-api/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticateUserMiddleware } from 'src/infraestructure/rest-api/middleware/authenticate-user.middleware';
import { IJwtServiceToken } from './domain/interfaces/jwt-service.interface';
import { JwtService } from './infraestructure/services/jwt.service';
import { AppointmentModule } from './infraestructure/rest-api/appointment/appointment.module';
import { ServiceModule } from './infraestructure/rest-api/service/service.module';
import { createDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...createDataSource(configService).options,
      }),
    }),
    UsersModule,
    AppointmentModule,
    ServiceModule,
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
