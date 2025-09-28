import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Vehicle } from 'src/infraestructure/entities/vehicle/vehicle.entity';
import {
  CreateVehicleData,
  IVehicleRepository,
} from './interfaces/vehicle-repository.interface';

@Injectable()
export class VehicleRepository
  extends Repository<Vehicle>
  implements IVehicleRepository
{
  constructor(private dataSource: DataSource) {
    super(Vehicle, dataSource.createEntityManager());
  }

  //   async getVehiclesOfUser(userId: number): Promise<Vehicle[]> {
  //     return this.createQueryBuilder('vehicle')
  //       .leftJoinAndSelect('vehicle.user', 'user')
  //       .where('user.id = :userId', { userId })
  //       .getMany()
  //   }

  async createVehicle(entityData: CreateVehicleData): Promise<Vehicle> {
    const result = await this.save({
      licensePlate: entityData.licensePlate,
      model: entityData.model,
      year: entityData.year,
      km: entityData.km,
      user: { id: entityData.userId },
    });
    const vehicle = await this.createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.user', 'user')
      .where('vehicle.id = :id', { id: result.id })
      .getOne();

    if (!vehicle) {
      throw new Error('Vehicle not found after creation');
    }

    return vehicle;
  }
}
