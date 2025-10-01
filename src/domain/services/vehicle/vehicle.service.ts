import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import {
  type IVehicleRepository,
  IVehicleRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/vehicle-repository.interface';
import { IVehicleService } from 'src/domain/interfaces/vehicle-service.interface';

@Injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @Inject(IVehicleRepositoryToken)
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  getVehiclesOfUser(userId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.getVehiclesOfUser(userId);
  }

  create(
    user: JwtPayload,
    licensePlate: string,
    model: string,
    year: number,
    km: number,
  ): Promise<Vehicle> {
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

  delete(vehicle: Vehicle): void {
    this.vehicleRepository.delete(vehicle.id);
  }

  updateVehicleOfUser(
    userId: number,
    vehicleId: number,
    updates: Partial<Pick<Vehicle, 'licensePlate' | 'model' | 'year' | 'km'>>,
  ): Promise<Vehicle> {
    return this.vehicleRepository.updateVehicleOfUser({
      userId,
      vehicleId,
      ...updates,
    });
  }
}
