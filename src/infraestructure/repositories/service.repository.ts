import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { IServiceRepository } from './interfaces/service-repository.interface';
import { Service } from '../entities/service/service.entity';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';

@Injectable()
export class ServiceRepository
  extends Repository<Service>
  implements IServiceRepository
{
  constructor(private dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  findByMechanicId(id: number): Promise<Service[]> {
    return this.find({ where: { mechanic: { id } } });
  }

  async findPaginated(
    query: PaginatedQueryDto,
    mechanicId: number,
  ): Promise<PaginatedResultDto<Service>> {
    const {
      page = 1,
      pageSize = 10,
      search,
      orderBy = 'id',
      orderDir = 'DESC',
    } = query;
    const skip = (page - 1) * pageSize;

    const [items, total] = await this.findAndCount({
      where: {
        mechanic: { id: mechanicId },
        ...(search && { name: ILike(`%${search}%`) }),
      },
      order: {
        [orderBy]: orderDir,
      },
      take: pageSize,
      skip,
    });

    return {
      data: items,
      total,
      page,
      pageSize,
      orderBy,
      orderDir,
    };
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
