import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { IServiceService } from 'src/domain/interfaces/service-service.interface';
import { IServiceRepositoryToken } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { CreateServiceDto } from 'src/infraestructure/dtos/services/create-service.dto';
import { ServiceSparePart } from 'src/infraestructure/entities/service/service-spare-part.entity';

@Injectable()
export class ServiceService implements IServiceService {
  constructor(
    @Inject(IServiceRepositoryToken)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async create(dto: CreateServiceDto, mechanic: User): Promise<Service> {
    const service = await this.serviceRepository.save({
      name: dto.name,
      price: dto.price,
      mechanic: mechanic,
    });
    await ServiceSparePart.save(
      dto.spareParts.map((sp) => ({
        service: { id: service.id },
        sparePartId: sp.sparePartId,
        quantity: sp.quantity,
      })),
    );
    return service;
  }

  getByMechanicId(mechanic: User): Promise<Service[]> {
    return this.serviceRepository.findByMechanicId(mechanic.id);
  }

  getPaginated(
    query: PaginatedQueryDto,
    mechanic: User,
  ): Promise<PaginatedResultDto<Service>> {
    return this.serviceRepository.findPaginated(query, mechanic.id);
  }

  async getAll(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }

  async getById(id: number): Promise<Service> {
    return this.serviceRepository.findById(id);
  }

  async getByIds(ids: number[]): Promise<Service[]> {
    return this.serviceRepository.findByIds(ids);
  }
}
