import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';

export interface IClientDashboardRepository {
  getUpcomingAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getPastAppointmentsOfUser(userId: number): Promise<Appointment[]>;
}

export const IClientDashboardRepositoryToken = 'IClientDashboardRepository';
