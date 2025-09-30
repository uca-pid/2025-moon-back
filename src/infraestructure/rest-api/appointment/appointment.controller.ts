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
import { AuthenticatedWorkshop } from '../decorators/authenticated-mechanic.decorator';
import { CreateAppointmentDto } from 'src/infraestructure/dtos/appointment/create-appointment.dto';
import {
  type IServiceService,
  IServiceServiceToken,
} from 'src/domain/interfaces/service-service.interface';
import {
  type IUsersService,
  IUsersServiceToken,
} from 'src/domain/interfaces/users-service.interface';

@Controller('appointments')
export class AppointmentController {
  constructor(
    @Inject(IAppointmentServiceToken)
    private readonly appointmentService: IAppointmentService,
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
    @Inject(IUsersServiceToken)
    private readonly userService: IUsersService,
  ) {}

  @Get('/user')
  getNextAppointmentsOfUser(@AuthenticatedUser() user: JwtPayload) {
    return this.appointmentService.getNextAppointmentsOfUser(user.id);
  }

  @Get()
  getNextAppointments(@AuthenticatedWorkshop() workshop: JwtPayload) {
    return this.appointmentService.getNextAppointmentsOfWorkshop(workshop.id);
  }

  @Post()
  async createAppointment(
    @AuthenticatedUser() user: JwtPayload,
    @Body() dto: CreateAppointmentDto,
  ) {
    const services = await Promise.all(
      dto.serviceIds.map(async (serviceId) => {
        const service = await this.serviceService.getById(serviceId);
        if (!service) {
          throw new NotFoundException('Service not found');
        }
        return service;
      }),
    );

    const workshop = await this.userService.getWorkshopById(dto.workshopId);
    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }

    return this.appointmentService.create(
      user,
      dto.date,
      dto.time,
      services,
      workshop,
    );
  }
}
