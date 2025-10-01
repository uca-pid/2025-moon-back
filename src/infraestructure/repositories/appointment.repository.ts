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
    const appointments = await this.baseQueryBuilder()
      .andWhere('appointment.user_id = :userId', { userId })
      .getMany();
    return appointments;
  }

  async getNextAppointmentsOfWorkshop(
    workshopId: number,
  ): Promise<Appointment[]> {
    const appointments = await this.baseQueryBuilder()
      .andWhere('appointment.workshop_id = :workshopId', { workshopId })
      .getMany();
    return appointments;
  }

  private baseQueryBuilder() {
    const { today, nowTime } = this.getTodayAndNow();
    return (
      this.createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.services', 'services')
        .leftJoin('appointment.user', 'user')
        .leftJoin('appointment.workshop', 'workshop')
        .addSelect([
          'user.id',
          'user.fullName',
          'user.email',
          'workshop.id',
          'workshop.workshopName',
          'workshop.address',
          'workshop.addressLatitude',
          'workshop.addressLongitude',
        ])
        // future appointment
        .where(
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
    );
  }

  async createAppointment(
    entityData: CreateAppointmentData,
  ): Promise<Appointment> {
    const result = await this.save({
      date: entityData.date,
      time: entityData.time,
      user: { id: entityData.userId },
      services: entityData.serviceIds.map((id) => ({ id })),
      workshop: { id: entityData.workshopId },
    });
    const appointment = await this.baseQueryBuilder()
      .where('appointment.id = :id', { id: result.id })
      .getOne();
    if (!appointment) throw new Error('Appointment not found after creation');
    return appointment;
  }
}
