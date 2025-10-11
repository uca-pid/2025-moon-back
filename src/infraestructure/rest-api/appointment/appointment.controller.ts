import {
  Controller,
  Inject,
  Get,
  Post,
  NotFoundException,
  Body,
  Query,
  Put,
  Param,
  ParseIntPipe,
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
import { GetWorkshopAppointmentQueryDto } from 'src/infraestructure/dtos/appointment/get-workshop-appointment-query.dto';
import {
  type IVehicleService,
  IVehicleServiceToken,
} from 'src/domain/interfaces/vehicle-service.interface';
import { UpdateAppointmentStatusDto } from 'src/infraestructure/dtos/appointment/update-appointment.status.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(
    @Inject(IAppointmentServiceToken)
    private readonly appointmentService: IAppointmentService,
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
    @Inject(IUsersServiceToken)
    private readonly userService: IUsersService,
    @Inject(IVehicleServiceToken)
    private readonly vehicleService: IVehicleService,
  ) {}

  @Get('/user')
  getNextAppointmentsOfUser(@AuthenticatedUser() user: JwtPayload) {
    return this.appointmentService.getNextAppointmentsOfUser(user.id);
  }

  @Get()
  getNextAppointments(
    @AuthenticatedWorkshop() workshop: JwtPayload,
    @Query() query: GetWorkshopAppointmentQueryDto,
  ) {
    return this.appointmentService.getNextAppointmentsOfWorkshop(
      workshop.id,
      query.dateFilter,
    );
  }

  @Post()
  async createAppointment(
    @AuthenticatedUser() user: JwtPayload,
    @Body() dto: CreateAppointmentDto,
  ) {
    const services = await this.serviceService.getByIds(dto.serviceIds);
    if (!services || services.length !== dto.serviceIds.length) {
      throw new NotFoundException('Some services not found');
    }

    const workshop = await this.userService.getWorkshopById(dto.workshopId);
    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }

    const vehicle = await this.vehicleService.getById(dto.vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return this.appointmentService.create(
      user,
      dto.date,
      dto.time,
      services,
      workshop,
      vehicle,
    );
  }

  @Put('/:id/status')
  updateStatus(
    @AuthenticatedUser() user: JwtPayload,
    @Body() dto: UpdateAppointmentStatusDto,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.appointmentService.updateStatus(id, dto.status, user);
  }
}
