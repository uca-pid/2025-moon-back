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

  private getTodayAndNow() {
    const today = new Date();
    const nowTime = today.toTimeString().slice(0, 8);
    return { today, nowTime };
  }
}
