import { Notification } from 'src/infraestructure/entities/notification/notification.entity';
import { IBaseRepository } from './base-repository.interface';

export interface INotificationRepository extends IBaseRepository<Notification> {
  findUserNotifications(id: number): Promise<Notification[]>;
  findById(notificationId: number): Promise<Notification | null>;
  markAsRead(notificationId: number): Promise<void>;
}

export const INotificationRepositoryToken = 'INotificationRepository';
