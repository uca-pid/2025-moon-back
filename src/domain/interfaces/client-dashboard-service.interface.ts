import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';

export interface IClientDashboardService {
  getUpcomingAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getPastAppointmentsOfUser(userId: number): Promise<Appointment[]>;
}

export const IClientDashboardServiceToken = 'IClientDashboardService';
