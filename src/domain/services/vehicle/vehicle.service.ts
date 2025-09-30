// src/application/services/vehicle.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import * as vehicleRepositoryInterface from 'src/infraestructure/repositories/interfaces/vehicle-repository.interface';

@Injectable()
export class VehicleService {
  constructor(
    @Inject(vehicleRepositoryInterface.IVehicleRepositoryToken)
    private readonly vehicleRepository: vehicleRepositoryInterface.IVehicleRepository,
  ) {}

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

  getVehiclesOfUser(userId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.getVehiclesOfUser(userId);
  }
}
