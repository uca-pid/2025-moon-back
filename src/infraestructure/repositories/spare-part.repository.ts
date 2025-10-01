import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSparePartData,
  ISparePartRepository,
} from './interfaces/spare-part-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { SparePart } from '../entities/spare-part/spare-part.entity';
import { ServiceSparePartDto } from '../dtos/services/create-service.dto';
import { Service } from '../entities/service/service.entity';
import { ServiceSparePart } from '../entities/service/service-spare-part.entity';

@Injectable()
export class SparePartRepository
  extends Repository<SparePart>
  implements ISparePartRepository
{
  constructor(private dataSource: DataSource) {
    super(SparePart, dataSource.createEntityManager());
  }

  async assignSparePartsToService(
    service: Service,
    dtos: ServiceSparePartDto[],
  ): Promise<void> {
    if (service.spareParts && service.spareParts.length > 0) {
      await this.removeOldSparePartsFromService(service, dtos);
    }
    await ServiceSparePart.save(
      dtos.map((sp) => ({
        service: { id: service.id },
        sparePart: { id: sp.sparePartId },
        quantity: sp.quantity,
      })) as ServiceSparePart[],
    );
  }

  private async removeOldSparePartsFromService(
    service: Service,
    dtos: ServiceSparePartDto[],
  ): Promise<void> {
    const actualIds = service.spareParts.map((sp) => sp.sparePartId);
    const updatedIds = dtos.map((sp) => sp.sparePartId);
    const toRemoveIds = actualIds.filter((id) => !updatedIds.includes(id));
    const entitiesToRemove = await ServiceSparePart.find({
      where: { sparePartId: In(toRemoveIds), serviceId: service.id },
    });
    await ServiceSparePart.remove(entitiesToRemove);
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
}
