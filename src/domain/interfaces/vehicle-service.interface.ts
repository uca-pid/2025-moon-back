import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';

export interface IVehicleService {
  create(
    user: JwtPayload,
    licensePlate: string,
    model: string,
    year: number,
    km: number,
  ): Promise<Vehicle>;
}

export const IVehicleServiceToken = 'IVehicleService';
