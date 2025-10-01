import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { IServiceService } from 'src/domain/interfaces/service-service.interface';
import { IServiceRepositoryToken } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { User } from 'src/infraestructure/entities/user/user.entity';
import {
  CreateServiceDto,
  ServiceSparePartDto,
} from 'src/infraestructure/dtos/services/create-service.dto';
import { ServiceSparePart } from 'src/infraestructure/entities/service/service-spare-part.entity';
import { UpdateServiceDto } from 'src/infraestructure/dtos/services/update-service.dto';

@Injectable()
export class ServiceService implements IServiceService {
  constructor(
    @Inject(IServiceRepositoryToken)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  delete(entity: Service): Promise<void> {
    return this.serviceRepository.removeById(entity.id);
  }

  async create(dto: CreateServiceDto, mechanic: User): Promise<Service> {
    const service = await this.serviceRepository.save({
      name: dto.name,
      price: dto.price,
      mechanic: mechanic,
    });
    await this.saveServiceSpareParts(service, dto.spareParts);
    const entity = await this.serviceRepository.getById(service.id);
    if (!entity) {
      throw new Error('Service not found after creation');
    }
    return entity;
  }

  private async saveServiceSpareParts(
    service: Service,
    dtos: ServiceSparePartDto[],
  ) {
    await ServiceSparePart.save(
      dtos.map((sp) => ({
        service: { id: service.id },
        sparePart: { id: sp.sparePartId },
        quantity: sp.quantity,
      })) as ServiceSparePart[],
    );
  }

  async update(dto: UpdateServiceDto, entity: Service): Promise<Service> {
    entity.name = dto.name;
    entity.price = dto.price;
    const service = await this.serviceRepository.save(entity);
    await this.saveServiceSpareParts(service, dto.spareParts);

    const savedEntity = await this.serviceRepository.getById(service.id);
    if (!savedEntity) {
      throw new Error('Service not found after creation');
    }
    return savedEntity;
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

  async getByIdWithMechanic(id: number): Promise<Service | null> {
    return this.serviceRepository.findByIdWithMechanic(id);
  }

  async getByIds(ids: number[]): Promise<Service[]> {
    return this.serviceRepository.findByIds(ids);
  }
}
