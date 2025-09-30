import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';

export interface CreateVehicleData {
  userId: number;
  licensePlate: string;
  model: string;
  year: number;
  km: number;
}

export interface IVehicleRepository {
  getVehiclesOfUser(userId: number): Promise<Vehicle[]>;
  createVehicle(entityData: CreateVehicleData): Promise<Vehicle>;
}

export const IVehicleRepositoryToken = 'IVehicleRepository';
