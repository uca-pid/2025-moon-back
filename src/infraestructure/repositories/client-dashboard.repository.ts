import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Brackets } from 'typeorm';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { IClientDashboardRepository } from './interfaces/client-dashboard-repository.interface';

@Injectable()
export class ClientDashboardRepository
  extends Repository<Appointment>
  implements IClientDashboardRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(Appointment, dataSource.createEntityManager());
  }

  async getUpcomingAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    const qb = this.baseQueryBuilder();
    const { today, nowTime } = this.getTodayAndNow();

    return qb
      .andWhere('appointment.user_id = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('appointment.date > :today', { today }).orWhere(
            'appointment.date = :today AND appointment.time >= :nowTime',
            { today, nowTime },
          );
        }),
      )
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.time', 'ASC')
      .getMany();
  }

  async getPastAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    const qb = this.baseQueryBuilder();
    const { today, nowTime } = this.getTodayAndNow();

    return qb
      .andWhere('appointment.user_id = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('appointment.date < :today', { today }).orWhere(
            'appointment.date = :today AND appointment.time < :nowTime',
            { today, nowTime },
          );
        }),
      )
      .orderBy('appointment.date', 'DESC')
      .addOrderBy('appointment.time', 'DESC')
      .getMany();
  }

  private baseQueryBuilder() {
    return this.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.services', 'services')
      .leftJoinAndSelect('appointment.vehicle', 'vehicle')
      .leftJoinAndSelect('appointment.workshop', 'workshop')
      .leftJoinAndSelect('appointment.user', 'user')
      .addSelect([
        'user.id',
        'user.fullName',
        'user.email',
        'workshop.id',
        'workshop.workshopName',
        'workshop.address',
        'vehicle.id',
        'vehicle.licensePlate',
        'vehicle.model',
      ]);
  }
  async getServiceStatsByVehicle(userId: number) {
    const rawData = await this.createQueryBuilder('appointment')
      .leftJoin('appointment.services', 'service')
      .leftJoin('appointment.vehicle', 'vehicle')
      .select('service.name', 'serviceName')
      .addSelect('vehicle.licensePlate', 'vehiclePlate')
      .addSelect('COUNT(appointment.id)', 'count')
      .addSelect('SUM(service.price)', 'totalCost')
      .where('appointment.user_id = :userId', { userId })
      .groupBy('service.name')
      .addGroupBy('vehicle.licensePlate')
      .getRawMany();

    const grouped = rawData.reduce((acc, row) => {
      const service = acc.find((s) => s.serviceName === row.serviceName);
      if (service) {
        service.vehicles.push({
          vehiclePlate: row.vehiclePlate,
          count: Number(row.count),
          totalCost: Number(row.totalCost),
        });
      } else {
        acc.push({
          serviceName: row.serviceName,
          vehicles: [
            {
              vehiclePlate: row.vehiclePlate,
              count: Number(row.count),
              totalCost: Number(row.totalCost),
            },
          ],
        });
      }
      return acc;
    }, []);

    return grouped;
  }

  private getTodayAndNow() {
    const today = new Date();
    const nowTime = today.toTimeString().slice(0, 8);
    return { today, nowTime };
  }
}
