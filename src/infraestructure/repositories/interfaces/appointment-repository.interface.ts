import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';

export interface CreateAppointmentData {
  userId: number;
  date: string;
  time: string;
  serviceIds: number[];
  workshopId: number;
  vehicleId: number;
}

export enum DateFilter {
  PAST = 'past',
  TODAY = 'today',
  FUTURE = 'future',
}

export interface IAppointmentRepository {
  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getAppointmentsOfWorkshop(
    workshopId: number,
    dateFilter: DateFilter,
  ): Promise<Appointment[]>;
  createAppointment(entityData: CreateAppointmentData): Promise<Appointment>;
}

export const IAppointmentRepositoryToken = 'IAppointmentRepository';
