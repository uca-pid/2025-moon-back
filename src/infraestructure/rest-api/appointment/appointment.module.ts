import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { IAppointmentRepositoryToken } from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';
import { AppointmentRepository } from 'src/infraestructure/repositories/appointment.repository';
import { IAppointmentServiceToken } from 'src/domain/interfaces/appointment-service.interface';
import { AppointmentService } from 'src/domain/services/appointment.service';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    ConfigModule,
    ServiceModule,
  ],
  controllers: [AppointmentController],
  providers: [
    { provide: IAppointmentRepositoryToken, useClass: AppointmentRepository },
    { provide: IAppointmentServiceToken, useClass: AppointmentService },
  ],
})
export class AppointmentModule {}
