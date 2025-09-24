import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { IServiceService } from 'src/domain/interfaces/service-service.interface';
import { IServiceRepositoryToken } from 'src/infraestructure/repositories/interfaces/service-repository.interface';

@Injectable()
export class ServiceService implements IServiceService {
  constructor(
    @Inject(IServiceRepositoryToken)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async getAll(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }

  async getById(id: number): Promise<Service> {
    return this.serviceRepository.findById(id);
  }
}
