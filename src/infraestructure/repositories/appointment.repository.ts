import { Injectable } from '@nestjs/common';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import {
  CreateAppointmentData,
  IAppointmentRepository,
} from './interfaces/appointment-repository.interface';

@Injectable()
export class AppointmentRepository
  extends Repository<Appointment>
  implements IAppointmentRepository
{
  constructor(private dataSource: DataSource) {
    super(Appointment, dataSource.createEntityManager());
  }
  private getTodayAndNow() {
    const today = new Date();
    const nowTime = today.toTimeString().slice(0, 8);
    return { today, nowTime };
  }

  async getNextAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    const { today, nowTime } = this.getTodayAndNow();
    return this.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.service', 'service')
      .where('appointment.user_id = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'appointment.date = :today AND appointment.time >= :nowTime',
            {
              today,
              nowTime,
            },
          ).orWhere('appointment.date > :today', { today });
        }),
      )
      .getMany();
  }

  async getNextAppointments(): Promise<Appointment[]> {
    const { today, nowTime } = this.getTodayAndNow();
    return this.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.service', 'service')
      .where('appointment.date = :today AND appointment.time >= :nowTime', {
        today,
        nowTime,
      })
      .orWhere('appointment.date > :today', { today })
      .getMany();
  }

  async createAppointment(
    entityData: CreateAppointmentData,
  ): Promise<Appointment> {
    return await this.save({
      date: entityData.date,
      time: entityData.time,
      user: { id: entityData.userId },
      service: { id: entityData.serviceId },
    });
  }
}
