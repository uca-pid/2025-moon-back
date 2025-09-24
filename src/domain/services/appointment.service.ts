import { Inject, Injectable } from '@nestjs/common';
import { IAppointmentService } from '../interfaces/appointment-service.interface';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import {
  type IAppointmentRepository,
  IAppointmentRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';
import { User } from 'src/infraestructure/entities/user/user.entity';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(IAppointmentRepositoryToken)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  create(
    user: JwtPayload,
    date: string,
    time: string,
    service: Service,
    workshop: User,
  ): Promise<Appointment> {
    return this.appointmentRepository.createAppointment({
      userId: user.id,
      date,
      time,
      serviceId: service.id,
      workshopId: workshop.id,
    });
  }

  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.getNextAppointmentsOfUser(userId);
  }

  getNextAppointmentsOfWorkshop(workshopId: number): Promise<Appointment[]> {
    return this.appointmentRepository.getNextAppointmentsOfWorkshop(workshopId);
  }
}
