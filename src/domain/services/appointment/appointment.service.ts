import { Inject, Injectable } from '@nestjs/common';
import { IAppointmentService } from 'src/domain/interfaces/appointment-service.interface';
import { Appointment } from 'src/infraestructure/entities/appointment/appointment.entity';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import {
  type IAppointmentRepository,
  IAppointmentRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';
import { User } from 'src/infraestructure/entities/user/user.entity';
import {
  type IServiceService,
  IServiceServiceToken,
} from 'src/domain/interfaces/service-service.interface';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(IAppointmentRepositoryToken)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
  ) {}

  async create(
    user: JwtPayload,
    date: string,
    time: string,
    services: Service[],
    workshop: User,
  ): Promise<Appointment> {
    const createdAppointment =
      await this.appointmentRepository.createAppointment({
        userId: user.id,
        date,
        time,
        serviceIds: services.map((service) => service.id),
        workshopId: workshop.id,
      });
    await this.reduceStockFromSpareParts(createdAppointment);
    return createdAppointment;
  }

  private async reduceStockFromSpareParts(appointment: Appointment) {
    const services = await this.serviceService.getByIds(
      appointment.services.map((s) => s.id),
    );
    await Promise.all(
      services.map(
        async (service) =>
          await Promise.all(
            service.spareParts.map(async (sp) => {
              sp.sparePart.stock -= sp.quantity;
              return await sp.sparePart.save();
            }),
          ),
      ),
    );
  }

  getNextAppointmentsOfUser(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.getNextAppointmentsOfUser(userId);
  }

  getNextAppointmentsOfWorkshop(workshopId: number): Promise<Appointment[]> {
    return this.appointmentRepository.getNextAppointmentsOfWorkshop(workshopId);
  }
}
