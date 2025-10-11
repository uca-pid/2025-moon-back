import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAppointmentService } from 'src/domain/interfaces/appointment-service.interface';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import {
  DateFilter,
  type IAppointmentRepository,
  IAppointmentRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';
import { User } from 'src/infraestructure/entities/user/user.entity';
import {
  type IServiceService,
  IServiceServiceToken,
} from 'src/domain/interfaces/service-service.interface';
import {
  type ISparePartService,
  ISparePartServiceToken,
} from 'src/domain/interfaces/spare-part-service.interface';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import { AppointmentStatus } from 'src/infraestructure/entities/appointment/appointment-status.enum';
import { UserRole } from 'src/infraestructure/entities/user/user-role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APPOINTMENT_EVENTS } from 'src/domain/events/appointments/appointment-events';
import { AppointmentStatusChangedEvent } from 'src/domain/events/appointments/appointment-status-changed-event';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(IAppointmentRepositoryToken)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
    @Inject(ISparePartServiceToken)
    private readonly sparePartService: ISparePartService,
    private eventEmitter: EventEmitter2,
  ) {}

  async updateStatus(
    appointmentId: number,
    newStatus: AppointmentStatus,
    user: JwtPayload,
  ): Promise<Appointment> {
    // This is the normal flow a appointment should follow and be cancelled ony if its pending or confirmed
    // by the user or the mechanic
    // PENDING -> CONFIRMED -> IN_SERVICE -> SERVICE_COMPLETED -> COMPLETED
    const cancellableStatuses = [
      AppointmentStatus.PENDING,
      AppointmentStatus.CONFIRMED,
    ];
    const defaultStatusFlow = [
      AppointmentStatus.PENDING,
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.IN_SERVICE,
      AppointmentStatus.SERVICE_COMPLETED,
      AppointmentStatus.COMPLETED,
    ];
    const appointment =
      await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (
      appointment.user.id !== user.id &&
      appointment.workshop.id !== user.id
    ) {
      throw new UnauthorizedException(
        'Not authorized to update this appointment',
      );
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled appointment');
    }

    if (
      newStatus !== AppointmentStatus.CANCELLED &&
      user.userRole !== UserRole.MECHANIC
    ) {
      throw new UnauthorizedException(
        'Only mechanics can update the status except to CANCELLED',
      );
    }

    if (
      newStatus === AppointmentStatus.CANCELLED &&
      !cancellableStatuses.includes(appointment.status)
    ) {
      throw new BadRequestException(
        `Cannot cancel this appointment. Appointments can only be cancelled when in one of the following statuses: ${cancellableStatuses.join(', ')}.`,
      );
    }

    const currentStatusIndex = defaultStatusFlow.indexOf(appointment.status);
    const newStatusIndex = defaultStatusFlow.indexOf(newStatus);
    if (
      newStatus !== AppointmentStatus.CANCELLED &&
      newStatusIndex !== currentStatusIndex + 1
    ) {
      throw new BadRequestException('Invalid status transition');
    }

    appointment.status = newStatus;
    await this.appointmentRepository.save(appointment);

    this.eventEmitter.emit(
      APPOINTMENT_EVENTS.STATUS_CHANGED,
      new AppointmentStatusChangedEvent(appointment, user),
    );
    return appointment;
  }

  deletePendingAppointmentsOfVehicle(id: number): Promise<void> {
    return this.appointmentRepository.deletePendingAppointmentsOfVehicle(id);
  }

  async create(
    user: JwtPayload,
    date: string,
    time: string,
    services: Service[],
    workshop: User,
    vehicle: Vehicle,
  ): Promise<Appointment> {
    const createdAppointment =
      await this.appointmentRepository.createAppointment({
        userId: user.id,
        date,
        time,
        serviceIds: services.map((service) => service.id),
        workshopId: workshop.id,
        vehicleId: vehicle.id,
      });
    await this.reduceStockFromSpareParts(createdAppointment);
    console.log(user);
    this.eventEmitter.emit(
      APPOINTMENT_EVENTS.STATUS_CHANGED,
      new AppointmentStatusChangedEvent(createdAppointment, user),
    );
    return createdAppointment;
  }

  private async reduceStockFromSpareParts(appointment: Appointment) {
    const services = await this.serviceService.getByIds(
      appointment.services.map((s) => s.id),
    );
    const sparePartsNeeded = this.calculateSparePartsNeeded(services);
    await this.sparePartService.reduceStockFromSpareParts(sparePartsNeeded);
  }

  private calculateSparePartsNeeded(services: Service[]) {
    const sparePartsMap = new Map<number, number>();
    const allSpareParts = services.flatMap((s) => s.spareParts);
    allSpareParts.forEach((sparePart) => {
      const currentQty = sparePartsMap.get(sparePart.sparePartId) || 0;
      sparePartsMap.set(sparePart.sparePartId, currentQty + sparePart.quantity);
    });

    return Array.from(sparePartsMap.entries()).map(
      ([sparePartId, quantity]) => ({ sparePartId, quantity }),
    );
  }

  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.getNextAppointmentsOfUser(userId);
  }

  getNextAppointmentsOfWorkshop(
    workshopId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]> {
    return this.appointmentRepository.getAppointmentsOfWorkshop(
      workshopId,
      dateFilter,
    );
  }

  getAppointmentsOfUser(
    userId: number,
    dateFilter?: DateFilter,
  ): Promise<Appointment[]> {
    return this.appointmentRepository.getAppointmentsOfUser(userId, dateFilter);
  }
}
