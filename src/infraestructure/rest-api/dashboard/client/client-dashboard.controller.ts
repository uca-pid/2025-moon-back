import { Controller, Inject, Get } from '@nestjs/common';
import { AuthenticatedUser } from '../../decorators/authenticated-user.decorator';
import type { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import {
  type IClientDashboardService,
  IClientDashboardServiceToken,
} from 'src/domain/interfaces/client-dashboard-service.interface';

@Controller('client/dashboard')
export class ClientDashboardController {
  constructor(
    @Inject(IClientDashboardServiceToken)
    private readonly dashboardService: IClientDashboardService,
  ) {}

  @Get('upcoming')
  async getUpcomingAppointments(@AuthenticatedUser() user: JwtPayload) {
    const appointments =
      await this.dashboardService.getUpcomingAppointmentsOfUser(user.id);

    return appointments.map((a) => ({
      id: a.id,
      date:
        a.date instanceof Date ? a.date.toISOString().split('T')[0] : a.date,
      time: a.time,
      workshopName: a.workshop?.workshopName ?? 'Taller no disponible',
      vehiclePlate: a.vehicle?.licensePlate,
      services: a.services.map((s) => s.name),
    }));
  }

  @Get('history')
  async getPastAppointments(@AuthenticatedUser() user: JwtPayload) {
    const appointments = await this.dashboardService.getPastAppointmentsOfUser(
      user.id,
    );

    return appointments.map((a) => ({
      id: a.id,
      date:
        a.date instanceof Date ? a.date.toISOString().split('T')[0] : a.date,
      time: a.time,
      workshopName: a.workshop?.workshopName ?? 'Taller no disponible',
      vehiclePlate: a.vehicle?.licensePlate,
      services: a.services.map((s) => s.name),
    }));
  }

  @Get('stats')
  async getServiceStats(@AuthenticatedUser() user: JwtPayload) {
    const stats = await this.dashboardService.getServiceStatsByVehicle(user.id);
    return stats;
  }
}
