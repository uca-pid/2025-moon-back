import { Service } from 'src/infraestructure/entities/service/service.entity';

export interface IServiceService {
  getAll(): Promise<Service[]>;
  getById(id: number): Promise<Service>;
}

export const IServiceServiceToken = 'IServiceService';
