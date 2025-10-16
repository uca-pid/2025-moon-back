import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { IVehicleRepositoryToken } from 'src/infraestructure/repositories/interfaces/vehicle-repository.interface';
import { IVehicleServiceToken } from 'src/domain/interfaces/vehicle-service.interface';
import { VehicleService } from 'src/domain/services/vehicle/vehicle.service';
import { VehicleRepository } from 'src/infraestructure/repositories/vehicle.repository';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle]),
    ConfigModule,
    UsersModule,
    forwardRef(() => AppointmentModule),
  ],
  controllers: [VehicleController],
  providers: [
    { provide: IVehicleRepositoryToken, useClass: VehicleRepository },
    { provide: IVehicleServiceToken, useClass: VehicleService },
  ],
  exports: [IVehicleServiceToken],
})
export class VehicleModule {}
