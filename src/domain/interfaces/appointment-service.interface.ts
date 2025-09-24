import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { User } from 'src/infraestructure/entities/user/user.entity';

export interface IAppointmentService {
  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getNextAppointmentsOfWorkshop(workshopId: number): Promise<Appointment[]>;
  create(
    user: JwtPayload,
    date: string,
    time: string,
    service: Service,
    workshop: User,
  ): Promise<Appointment>;
}
export const IAppointmentServiceToken = 'IAppointmentService';
