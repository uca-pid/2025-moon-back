import { Module } from '@nestjs/common';
import { UsersModule } from './rest-api/users/users.module';
import { ServiceModule } from './rest-api/service/service.module';

@Module({
  imports: [UsersModule, ServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
