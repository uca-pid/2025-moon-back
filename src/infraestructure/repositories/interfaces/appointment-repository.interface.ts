import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';

export interface CreateAppointmentData {
  userId: number;
  date: string;
  time: string;
  serviceId: number;
}

export interface IAppointmentRepository {
  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]>;
  getNextAppointments(): Promise<Appointment[]>;
  createAppointment(entityData: CreateAppointmentData): Promise<Appointment>;
}

export const IAppointmentRepositoryToken = 'IAppointmentRepository';
