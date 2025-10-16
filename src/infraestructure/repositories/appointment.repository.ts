import { Injectable } from '@nestjs/common';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import {
  CreateAppointmentData,
  DateFilter,
  IAppointmentRepository,
} from './interfaces/appointment-repository.interface';
import { SelectQueryBuilder } from 'typeorm/browser';
import { AppointmentStatus } from '../entities/appointment/appointment-status.enum';

@Injectable()
export class AppointmentRepository
  extends Repository<Appointment>
  implements IAppointmentRepository
{
  constructor(private dataSource: DataSource) {
    super(Appointment, dataSource.createEntityManager());
  }

  async getNextAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    const qb = this.baseQueryBuilder();
    const appointments = this.addFutureAppointmentCondition(qb)
      .andWhere('appointment.user_id = :userId', { userId })
      .getMany();
    return appointments;
  }

  findById(id: number): Promise<Appointment | null> {
    return this.findOne({ where: { id }, relations: ['user', 'workshop'] });
  }

  async deletePendingAppointmentsOfVehicle(id: number): Promise<void> {
    const { today, nowTime } = this.getTodayAndNow();
    await this.createQueryBuilder()
      .delete()
      .from(Appointment)
      .where('vehicle_id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('date > :today', { today }).orWhere(
            'date = :today AND time >= :nowTime',
            { today, nowTime },
          );
        }),
      )
      .execute();
  }
  getAppointmentsOfWorkshop(
    workshopId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]> {
    let qb = this.baseQueryBuilder();
    if (dateFilter) {
      qb = this.addDateFilterCondition(qb, dateFilter);
    }
    const appointments = qb
      .andWhere('appointment.workshop_id = :workshopId', { workshopId })
      .getMany();
    return appointments;
  }

  getAppointmentsBySearch(
    workshopId: number,
    status?: AppointmentStatus,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]> {
    let qb = this.baseQueryBuilder();
    if (dateFilter) {
      qb = this.addDateFilterCondition(qb, dateFilter);
    }
    if (status) {
      qb.andWhere('appointment.status = :status', { status });
    }
    return qb
      .andWhere('appointment.workshop_id = :workshopId', { workshopId })
      .getMany();
  }

  private addDateFilterCondition(
    qb: SelectQueryBuilder<Appointment>,
    dateFilter: DateFilter,
  ) {
    const { today, nowTime } = this.getTodayAndNow();
    switch (dateFilter) {
      case DateFilter.PAST:
        qb.andWhere(
          'appointment.date < :today OR (appointment.date = :today AND appointment.time < :nowTime)',
          {
            today,
            nowTime,
          },
        );
        break;
      case DateFilter.TODAY:
        qb.andWhere(
          'appointment.date = :today AND appointment.time >= :nowTime',
          {
            today: today,
            nowTime,
          },
        );
        break;
      case DateFilter.FUTURE:
        qb.andWhere('appointment.date > :today', { today });
        break;
      default:
        break;
    }
    return qb;
  }

  private getTodayAndNow() {
    const today = new Date();
    const nowTime = today.toTimeString().slice(0, 8);
    return { today, nowTime };
  }

  async getAppointmentsOfUser(
    userId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]> {
    let qb = this.baseQueryBuilder();

    if (dateFilter) {
      qb = this.addDateFilterCondition(qb, dateFilter);
    }

    const appointments = qb
      .andWhere('appointment.user_id = :userId', { userId })
      .getMany();

    return appointments;
  }

  addFutureAppointmentCondition(qb: SelectQueryBuilder<Appointment>) {
    const { today, nowTime } = this.getTodayAndNow();
    return qb.andWhere(
      new Brackets((qb) => {
        qb.where('appointment.date = :today AND appointment.time >= :nowTime', {
          today,
          nowTime,
        }).orWhere('appointment.date > :today', { today });
      }),
    );
  }

  private baseQueryBuilder() {
    return this.createQueryBuilder('appointment')
      .withDeleted()
      .leftJoinAndSelect('appointment.services', 'services')
      .leftJoin('appointment.user', 'user')
      .leftJoin('appointment.workshop', 'workshop')
      .leftJoinAndSelect('appointment.vehicle', 'vehicle')
      .addSelect([
        'user.id',
        'user.fullName',
        'user.email',
        'workshop.id',
        'workshop.workshopName',
        'workshop.address',
        'workshop.email',
        'workshop.addressLatitude',
        'workshop.addressLongitude',
      ]);
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
      vehicle: { id: entityData.vehicleId },
    });
    const appointment = await this.baseQueryBuilder()
      .where('appointment.id = :id', { id: result.id })
      .getOne();
    if (!appointment) throw new Error('Appointment not found after creation');
    return appointment;
  }
}
