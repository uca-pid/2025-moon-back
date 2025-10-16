import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { IServiceService } from 'src/domain/interfaces/service-service.interface';
import { IServiceRepositoryToken } from 'src/infraestructure/repositories/interfaces/service-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { CreateServiceDto } from 'src/infraestructure/dtos/services/create-service.dto';
import { UpdateServiceDto } from 'src/infraestructure/dtos/services/update-service.dto';
import { ServiceStatusEnum } from 'src/infraestructure/entities/service/service.enum';
import {
  type ISparePartService,
  ISparePartServiceToken,
} from 'src/domain/interfaces/spare-part-service.interface';

@Injectable()
export class ServiceService implements IServiceService {
  constructor(
    @Inject(IServiceRepositoryToken)
    private readonly serviceRepository: IServiceRepository,
    @Inject(ISparePartServiceToken)
    private readonly sparePartService: ISparePartService,
  ) {}

  delete(entity: Service): Promise<void> {
    return this.serviceRepository.removeById(entity.id);
  }

  async create(dto: CreateServiceDto, mechanic: User): Promise<Service> {
    const service = await this.serviceRepository.save({
      name: dto.name,
      price: dto.price,
      mechanic: mechanic,
      status: ServiceStatusEnum.ACTIVE,
    });
    await this.sparePartService.assignSparePartsToService(
      service,
      dto.spareParts,
    );
    const entity = await this.serviceRepository.getById(service.id);
    if (!entity) {
      throw new Error('Service not found after creation');
    }
    return entity;
  }

  async update(dto: UpdateServiceDto, entity: Service): Promise<Service> {
    entity.name = dto.name;
    entity.price = dto.price;
    entity.status = ServiceStatusEnum.ACTIVE;
    const service = await this.serviceRepository.save(entity);
    await this.sparePartService.assignSparePartsToService(
      service,
      dto.spareParts,
    );

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

  async getRequestedServices(
    mechanic: User,
  ): Promise<(Service & { appointmentsCount: number })[]> {
    return await this.serviceRepository.findRequestedServices(mechanic.id);
  }

  async getServiceStatsByUser(
    userId: number,
  ): Promise<
    {
      serviceName: string;
      vehicles: { vehiclePlate: string; count: number; totalCost: number }[];
    }[]
  > {
    return this.serviceRepository.findServiceStatsByUserId(userId);
  }
}
