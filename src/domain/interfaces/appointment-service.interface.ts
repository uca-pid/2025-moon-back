import { TimeRange } from 'src/infraestructure/dtos/appointment/get-workshop-appointment-range-query.dto';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import { DateFilter } from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';

export interface IAppointmentService {
  findById(id: number): Promise<Appointment>;
  findDetailsById(id: number): Promise<Appointment>;
  updateStatus(
    id: number,
    status: AppointmentStatus,
    user: JwtPayload,
  ): Promise<Appointment>;
  deletePendingAppointmentsOfVehicle(id: number): Promise<void>;
  getAppointmentsOfUser(
    userId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]>;
  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getNextAppointmentsOfWorkshop(
    workshopId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]>;
  getAppointmentsBySearch(
    workshopId: number,
    status?: AppointmentStatus,
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
  getWorkshopAppointmentRange(
    workshopId: number,
    timeRange: 'week' | 'two_weeks' | 'month',
  ): Promise<{ date: string; count: number }[]>;
}
export const IAppointmentServiceToken = 'IAppointmentService';
