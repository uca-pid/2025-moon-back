import { Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(IAppointmentRepositoryToken)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
    @Inject(ISparePartServiceToken)
    private readonly sparePartService: ISparePartService,
  ) {}

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
    dateFilter: DateFilter,
  ): Promise<Appointment[]> {
    return this.appointmentRepository.getAppointmentsOfWorkshop(
      workshopId,
      dateFilter,
    );
  }
}
