import { Inject, Injectable } from '@nestjs/common';
import { IClientDashboardService } from 'src/domain/interfaces/client-dashboard-service.interface';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import {
  type IClientDashboardRepository,
  IClientDashboardRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/client-dashboard-repository.interface';

@Injectable()
export class ClientDashboardService implements IClientDashboardService {
  constructor(
    @Inject(IClientDashboardRepositoryToken)
    private readonly clientDashboardRepository: IClientDashboardRepository,
  ) {}
  getUpcomingAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    return this.clientDashboardRepository.getUpcomingAppointmentsOfUser(userId);
  }

  getPastAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    return this.clientDashboardRepository.getPastAppointmentsOfUser(userId);
  }

  async getServiceStatsByVehicle(userId: number) {
    return this.clientDashboardRepository.getServiceStatsByVehicle(userId);
  }
}
