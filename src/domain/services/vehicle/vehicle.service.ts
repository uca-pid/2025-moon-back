import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import {
  type IVehicleRepository,
  IVehicleRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/vehicle-repository.interface';
import { IVehicleService } from 'src/domain/interfaces/vehicle-service.interface';
import {
  type IAppointmentService,
  IAppointmentServiceToken,
} from 'src/domain/interfaces/appointment-service.interface';

@Injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @Inject(IVehicleRepositoryToken)
    private readonly vehicleRepository: IVehicleRepository,
    @Inject(IAppointmentServiceToken)
    private readonly appointmentService: IAppointmentService,
  ) {}

  private async validateLicensePlate(licensePlate: string): Promise<void> {
    const vehicle =
      await this.vehicleRepository.getByLicensePlate(licensePlate);
    if (vehicle) {
      throw new BadRequestException('License plate already exists');
    }
  }

  getVehiclesOfUser(userId: number) {
    return this.vehicleRepository.getVehiclesOfUser(userId);
  }

  async create(
    user: JwtPayload,
    licensePlate: string,
    model: string,
    year: number,
    km: number,
  ): Promise<Vehicle> {
    await this.validateLicensePlate(licensePlate);
    return this.vehicleRepository.createVehicle({
      userId: user.id,
      licensePlate,
      model,
      year,
      km,
    });
  }

  getById(id: number): Promise<Vehicle> {
    return this.vehicleRepository.getById(id);
  }

  async delete(vehicle: Vehicle): Promise<void> {
    await this.appointmentService.deletePendingAppointmentsOfVehicle(
      vehicle.id,
    );
    await this.vehicleRepository.softDelete(vehicle.id);
  }

  async updateVehicleOfUser(
    userId: number,
    vehicleId: number,
    updates: Partial<Pick<Vehicle, 'licensePlate' | 'model' | 'year' | 'km'>>,
  ): Promise<Vehicle> {
    if (updates.licensePlate) {
      await this.validateLicensePlate(updates.licensePlate);
    }
    return this.vehicleRepository.updateVehicleOfUser({
      userId,
      vehicleId,
      ...updates,
    });
  }

  getByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return this.vehicleRepository.getByLicensePlate(licensePlate);
  }
}
