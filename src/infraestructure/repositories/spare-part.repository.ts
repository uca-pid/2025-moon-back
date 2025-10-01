import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSparePartData,
  ISparePartRepository,
} from './interfaces/spare-part-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { DataSource, Like, Repository } from 'typeorm';
import { SparePart } from '../entities/spare-part/spare-part.entity';

@Injectable()
export class SparePartRepository
  extends Repository<SparePart>
  implements ISparePartRepository
{
  constructor(private dataSource: DataSource) {
    super(SparePart, dataSource.createEntityManager());
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
      ? { ...defaultWhere, name: Like(`%${search}%`) }
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
}
