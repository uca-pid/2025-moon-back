import { IsEnum } from 'class-validator';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
