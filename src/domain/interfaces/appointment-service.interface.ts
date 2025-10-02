import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { DateFilter } from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';

export interface IAppointmentService {
  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getNextAppointmentsOfWorkshop(
    workshopId: number,
    dateFilter: DateFilter,
  ): Promise<Appointment[]>;
  create(
    user: JwtPayload,
    date: string,
    time: string,
    services: Service[],
    workshop: User,
  ): Promise<Appointment>;
}
export const IAppointmentServiceToken = 'IAppointmentService';
