import { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';

export interface IVehicleService {
  delete(vehicle: Vehicle): void;

  getById(id: number): Promise<Vehicle>;

  getVehiclesOfUser(userId: number): Promise<Vehicle[]>;

  create(
    user: JwtPayload,
    licensePlate: string,
    model: string,
    year: number,
    km: number,
  ): Promise<Vehicle>;

  updateVehicleOfUser(
    userId: number,
    vehicleId: number,
    updates: Partial<Pick<Vehicle, 'licensePlate' | 'model' | 'year' | 'km'>>,
  ): Promise<Vehicle>;
}

export const IVehicleServiceToken = 'IVehicleService';
