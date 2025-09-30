import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { IServiceRepository } from './interfaces/service-repository.interface';
import { Service } from '../entities/service/service.entity';

@Injectable()
export class ServiceRepository
  extends Repository<Service>
  implements IServiceRepository
{
  constructor(private dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }
  async findAll() {
    return this.find();
  }

  async findById(id: number) {
    const service = await this.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async findByIds(ids: number[]) {
    const services = await this.find({ where: { id: In(ids) } });
    if (services.length !== ids.length) {
      throw new NotFoundException('Some services not found');
    }
    return services;
  }
}
