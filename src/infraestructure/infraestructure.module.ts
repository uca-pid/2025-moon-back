import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './rest-api/users/users.module';
import { ServiceModule } from './rest-api/service/service.module';
import { AddressModule } from './rest-api/address/address.module';
import { AppointmentModule } from './rest-api/appointment/appointment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDataSource } from 'src/data-source';
import { AuthenticateUserMiddleware } from './rest-api/middleware/authenticate-user.middleware';
import { IJwtServiceToken } from 'src/domain/interfaces/jwt-service.interface';
import { JwtService } from './services/jwt.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    ServiceModule,
    AddressModule,
    AppointmentModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...createDataSource(configService).options,
      }),
    }),
  ],
  controllers: [],
  providers: [{ provide: IJwtServiceToken, useClass: JwtService }],
})
export class InfraestructureModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticateUserMiddleware).forRoutes('*');
  }
}
