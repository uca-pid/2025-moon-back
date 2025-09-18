import { Service } from 'src/infraestructure/entities/service/service.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IServiceRepository extends IBaseRepository<Service> {
  findAll(): Promise<Service[]>;
  findById(id: number): Promise<Service>;
}

export const IServiceRepositoryToken = 'IServiceRepository';
