import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { INotificationRepositoryToken } from 'src/infraestructure/repositories/interfaces/notification-repository.interface';
import { NotificationRepository } from 'src/infraestructure/repositories/notification.repository';
import { INotificationServiceToken } from 'src/domain/interfaces/notification-service.interface';
import { NotificationService } from 'src/domain/services/notification/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [
    { provide: INotificationRepositoryToken, useClass: NotificationRepository },
    { provide: INotificationServiceToken, useClass: NotificationService },
  ],
})
export class NotificationModule {}
