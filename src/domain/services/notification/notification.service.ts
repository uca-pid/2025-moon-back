import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { APPOINTMENT_EVENTS } from 'src/domain/events/appointments/appointment-events';
import { AppointmentStatusChangedEvent } from 'src/domain/events/appointments/appointment-status-changed-event';
import { INotificationService } from 'src/domain/interfaces/notification-service.interface';
import {
  INotificationRepositoryToken,
  type INotificationRepository,
} from 'src/infraestructure/repositories/interfaces/notification-repository.interface';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject(INotificationRepositoryToken)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  getAllNotifications(user: JwtPayload): Promise<any[]> {
    return this.notificationRepository.findUserNotifications(user.id);
  }

  async markAsRead(user: JwtPayload, notificationId: number): Promise<void> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user.id !== user.id) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.notificationRepository.markAsRead(notificationId);
  }

  @OnEvent(APPOINTMENT_EVENTS.STATUS_CHANGED)
  async createNotification(event: AppointmentStatusChangedEvent) {
    const message = event.getMessage();
    const userToNotify = event.getUserToNotify();
    if (!message) return;

    await this.notificationRepository.save({
      user: { id: userToNotify.id },
      message,
    });
  }
}
