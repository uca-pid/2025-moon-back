import {
  Controller,
  Inject,
  Get,
  Post,
  NotFoundException,
  Body,
} from '@nestjs/common';
import {
  type IAppointmentService,
  IAppointmentServiceToken,
} from 'src/domain/interfaces/appointment-service.interface';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';
import type { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { AuthenticatedMechanic } from '../decorators/authenticated-mechanic.decorator';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { CreateAppointmentDto } from 'src/infraestructure/dtos/appointment/create-appointment.dto';
import {
  type IServiceService,
  IServiceServiceToken,
} from 'src/domain/interfaces/service-service.interface';

@Controller('appointments')
export class AppointmentController {
  constructor(
    @Inject(IAppointmentServiceToken)
    private readonly appointmentService: IAppointmentService,
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
  ) {}

  @Get('/user')
  getNextAppointmentsOfUser(@AuthenticatedUser() user: JwtPayload) {
    return this.appointmentService.getNextAppointmentsOfUser(user.id);
  }

  @Get()
  // will use mechanic in future, and we need the decorator to check the mechanic role
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNextAppointments(@AuthenticatedMechanic() _: JwtPayload) {
    return this.appointmentService.getNextAppointments();
  }

  @Post()
  async createAppointment(
    @AuthenticatedUser() user: JwtPayload,
    @Body() dto: CreateAppointmentDto,
  ) {
    const service = await this.serviceService.getById(dto.serviceId);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return this.appointmentService.create(user, dto.date, dto.time, service);
  }
}
