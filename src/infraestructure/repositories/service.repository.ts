import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { IServiceRepository } from './interfaces/service-repository.interface';
import { Service } from '../entities/service/service.entity';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { ServiceSparePart } from '../entities/service/service-spare-part.entity';
import { ServiceStatusEnum } from '../entities/service/service.enum';

@Injectable()
export class ServiceRepository
  extends Repository<Service>
  implements IServiceRepository
{
  constructor(private dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  findByIdWithMechanic(id: number): Promise<Service | null> {
    return this.findOne({
      where: { id },
      relations: ['spareParts', 'spareParts.sparePart', 'mechanic'],
    });
  }

  async removeById(id: number): Promise<void> {
    await ServiceSparePart.delete({ service: { id } });
    const result = await this.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Service not found');
    }
    return;
  }
  getById(id: number): Promise<Service | null> {
    return this.findOne({
      where: { id },
      relations: ['spareParts', 'spareParts.sparePart'],
    });
  }

  async findByMechanicId(id: number): Promise<Service[]> {
    return this.createQueryBuilder('s')
      .leftJoinAndSelect('s.spareParts', 'ss')
      .leftJoinAndSelect('ss.sparePart', 'sp')
      .where('s.mechanicId = :id', { id })
      .andWhere('s.status = :status', { status: ServiceStatusEnum.ACTIVE })
      .andWhere('sp.stock >= ss.quantity')
      .getMany();
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
      relations: ['spareParts', 'spareParts.sparePart'],
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
    const services = await this.find({
      where: { id: In(ids) },
      relations: ['spareParts', 'spareParts.sparePart'],
    });
    if (services.length !== ids.length) {
      throw new NotFoundException('Some services not found');
    }
    return services;
  }
}
