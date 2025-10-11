import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { ClientDashboardController } from './client-dashboard.controller';
import { IClientDashboardServiceToken } from 'src/domain/interfaces/client-dashboard-service.interface';
import { ClientDashboardService } from 'src/domain/services/dashboard/client/client-dashboard.service';
import { IClientDashboardRepositoryToken } from 'src/infraestructure/repositories/interfaces/client-dashboard-repository.interface';
import { ClientDashboardRepository } from 'src/infraestructure/repositories/client-dashboard.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), ConfigModule],
  controllers: [ClientDashboardController],
  providers: [
    {
      provide: IClientDashboardRepositoryToken,
      useClass: ClientDashboardRepository,
    },
    { provide: IClientDashboardServiceToken, useClass: ClientDashboardService },
  ],
  exports: [IClientDashboardServiceToken],
})
export class ClientDashboardModule {}
