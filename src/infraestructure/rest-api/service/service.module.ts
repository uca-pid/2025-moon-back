import { Module } from '@nestjs/common';
import { ServiceService } from 'src/domain/services/service/service.service';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRepository } from 'src/infraestructure/repositories/service.repository';
import { IServiceRepositoryToken } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { IServiceServiceToken } from 'src/domain/interfaces/service-service.interface';
import { UsersModule } from '../users/users.module';
import { SparePartModule } from '../spare-part/spare-part.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), UsersModule, SparePartModule],
  controllers: [ServiceController],
  providers: [
    { provide: IServiceServiceToken, useClass: ServiceService },
    { provide: IServiceRepositoryToken, useClass: ServiceRepository },
  ],
  exports: [IServiceServiceToken],
})
export class ServiceModule {}
