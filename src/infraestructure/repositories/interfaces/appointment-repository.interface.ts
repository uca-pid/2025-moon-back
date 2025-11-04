import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { IBaseRepository } from './base-repository.interface';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';

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

export interface IAppointmentRepository extends IBaseRepository<Appointment> {
  findById(id: number): Promise<Appointment | null>;
  findDetailsById(id: number): Promise<Appointment | null>;
  deletePendingAppointmentsOfVehicle(id: number): Promise<void>;
  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getAppointmentsOfWorkshop(
    workshopId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]>;
  getAppointmentsBySearch(
    workshopId: number,
    status?: AppointmentStatus,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]>;
  getAppointmentsOfUser(
    user_id: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]>;
  createAppointment(entityData: CreateAppointmentData): Promise<Appointment>;
}

export const IAppointmentRepositoryToken = 'IAppointmentRepository';
