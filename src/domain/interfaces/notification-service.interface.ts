import { JwtPayload } from '../dtos/jwt-payload.interface';

export interface INotificationService {
  getAllNotifications(user: JwtPayload): Promise<any[]>;
  markAsRead(user: JwtPayload, notificationId: number): Promise<void>;
}

export const INotificationServiceToken = 'INotificationService';
