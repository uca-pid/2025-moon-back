import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import { DateFilter } from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';

export interface IAppointmentService {
  updateStatus(
    id: number,
    status: AppointmentStatus,
    user: JwtPayload,
  ): Promise<Appointment>;
  deletePendingAppointmentsOfVehicle(id: number): Promise<void>;
  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getNextAppointmentsOfWorkshop(
    workshopId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]>;
  create(
    user: JwtPayload,
    date: string,
    time: string,
    services: Service[],
    workshop: User,
    vehicle: Vehicle,
  ): Promise<Appointment>;
}
export const IAppointmentServiceToken = 'IAppointmentService';
