import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';

export interface IClientDashboardService {
  getUpcomingAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getPastAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getServiceStatsByVehicle(userId: number): Promise<
    {
      serviceName: string;
      vehicles: { vehiclePlate: string; count: number; totalCost: number }[];
    }[]
  >;
}

export const IClientDashboardServiceToken = 'IClientDashboardService';
