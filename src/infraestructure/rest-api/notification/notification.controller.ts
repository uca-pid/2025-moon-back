import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  type INotificationService,
  INotificationServiceToken,
} from 'src/domain/interfaces/notification-service.interface';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';
import { type JwtPayload } from 'src/domain/dtos/jwt-payload.interface';

@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(INotificationServiceToken)
    private readonly notificationService: INotificationService,
  ) {}

  @Get()
  getNotifications(@AuthenticatedUser() user: JwtPayload) {
    return this.notificationService.getAllNotifications(user);
  }

  @Put(':id/read')
  markNotificationAsRead(
    @Param('id', new ParseIntPipe()) id: number,
    @AuthenticatedUser() user: JwtPayload,
  ) {
    return this.notificationService.markAsRead(user, id);
  }
}
