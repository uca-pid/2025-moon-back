import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';

export class AppointmentStatusChangedEvent {
  appointment: Appointment;
  triggeredBy: JwtPayload;
  constructor(appointment: Appointment, triggeredBy: JwtPayload) {
    this.appointment = appointment;
    this.triggeredBy = triggeredBy;
  }

  getMessage(): string {
    const statusToMessage = {
      [AppointmentStatus.PENDING]: `⏳ Se creo el turno #${this.appointment.id}.`,
      [AppointmentStatus.CONFIRMED]: '✅ Tu turno ha sido confirmado.',
      [AppointmentStatus.IN_SERVICE]: '🛠️ Tu auto está en servicio.',
      [AppointmentStatus.SERVICE_COMPLETED]:
        '🎉 El servicio de tu auto ha finalizado.',
      [AppointmentStatus.COMPLETED]: '🏁 Tu turno ha sido completado.',
      [AppointmentStatus.CANCELLED]: `❌ El turno #${this.appointment.id} ha sido cancelado.`,
    };
    const message = statusToMessage[this.appointment.status];
    return message;
  }

  getUserToNotify() {
    return this.appointment.user.id === this.triggeredBy.id
      ? this.appointment.workshop
      : this.appointment.user;
  }
}
