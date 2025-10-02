import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSparePartData,
  ISparePartRepository,
} from './interfaces/spare-part-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { SparePart } from '../entities/spare-part/spare-part.entity';
import { Service } from '../entities/service/service.entity';
import { ServiceStatusEnum } from '../entities/service/service.enum';
import { ServiceSparePart } from '../entities/service/service-spare-part.entity';

@Injectable()
export class SparePartRepository
  extends Repository<SparePart>
  implements ISparePartRepository
{
  constructor(private dataSource: DataSource) {
    super(SparePart, dataSource.createEntityManager());
  }

  getByIds(ids: number[]): Promise<SparePart[]> {
    return this.find({ where: { id: In(ids) }, relations: ['mechanic'] });
  }

  async getById(id: number): Promise<SparePart> {
    const part = await this.findOne({ where: { id }, relations: ['mechanic'] });
    if (!part) {
      throw new NotFoundException('Spare part not found');
    }
    return part;
  }

  async createSparePart(data: CreateSparePartData): Promise<SparePart> {
    return this.save({
      name: data.name,
      stock: data.stock,
      mechanic: { id: data.mechanicId },
    });
  }

  async getPaginated(
    query: PaginatedQueryDto,
    mechanicId: number,
  ): Promise<PaginatedResultDto<SparePart>> {
    const {
      page = 1,
      pageSize = 10,
      search,
      orderDir = 'DESC',
      orderBy = 'id',
    } = query;
    const defaultWhere = {
      mechanic: { id: mechanicId },
    };
    const where = search
      ? { ...defaultWhere, name: ILike(`%${search}%`) }
      : defaultWhere;
    const [data, total] = await this.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      order: {
        [orderBy]: orderDir,
      },
    });
    return { data, total, page, pageSize, orderBy, orderDir };
  }

  async blockServicesBySparePartId(id: number): Promise<void> {
    await this.manager
      .createQueryBuilder()
      .update(Service)
      .set({ status: ServiceStatusEnum.BLOCKED })
      .where(() => {
        const subQuery = this.manager
          .createQueryBuilder()
          .select('ssp.serviceId')
          .from(ServiceSparePart, 'ssp')
          .where('ssp.sparePartId = :id')
          .getQuery();
        return `id IN (${subQuery})`;
      })
      .setParameter('id', id)
      .execute();
  }

  async removeById(id: number): Promise<void> {
    await ServiceSparePart.delete({ sparePartId: id });
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Spare part not found');
    }
  }
}
