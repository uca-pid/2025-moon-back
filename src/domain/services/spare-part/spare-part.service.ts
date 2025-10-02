import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import {
  ISparePartService,
  ReduceStockData,
} from 'src/domain/interfaces/spare-part-service.interface';
import { CreateSparePartDto } from 'src/infraestructure/dtos/spare-part/create-spare-part.dto';
import { UpdateSparePartDto } from 'src/infraestructure/dtos/spare-part/update-spare-part.dto';
import { SparePart } from 'src/infraestructure/entities/spare-part/spare-part.entity';
import { User } from 'src/infraestructure/entities/user/user.entity';
import {
  type ISparePartRepository,
  ISparePartRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/spare-part-repository.interface';

@Injectable()
export class SparePartService implements ISparePartService {
  constructor(
    @Inject(ISparePartRepositoryToken)
    private readonly repository: ISparePartRepository,
  ) {}

  getByIds(ids: number[]): Promise<SparePart[]> {
    return this.repository.getByIds(ids);
  }

  async delete(part: SparePart): Promise<void> {
    await this.repository.blockServicesBySparePartId(part.id);
    await this.repository.removeById(part.id);
  }

  async update(part: SparePart, dto: UpdateSparePartDto): Promise<SparePart> {
    part.name = dto.name;
    part.stock = dto.stock;
    await this.repository.save(part);
    // @ts-expect-error dont return mechanic so we don't expose user data
    return { ...part, mechanic: undefined };
  }
  create(dto: CreateSparePartDto, mechanic: User): Promise<SparePart> {
    return this.repository.createSparePart({
      ...dto,
      mechanicId: mechanic.id,
    });
  }

  getPaginated(
    query: PaginatedQueryDto,
    mechanic: User,
  ): Promise<PaginatedResultDto<SparePart>> {
    return this.repository.getPaginated(query, mechanic.id);
  }

  getById(id: number): Promise<SparePart> {
    return this.repository.getById(id);
  }

  async reduceStockFromSpareParts(
    stockChanges: ReduceStockData[],
  ): Promise<void> {
    const spareParts = await this.repository.getByIds(
      stockChanges.map((s) => s.sparePartId),
    );
    stockChanges.forEach(({ sparePartId, quantity }) => {
      const sparePart = spareParts.find((sp) => sp.id === sparePartId);
      if (!sparePart) {
        throw new BadRequestException(
          `Spare part with id ${sparePartId} not found`,
        );
      }
      const newStock = sparePart.stock - quantity;
      if (newStock < 0) {
        throw new BadRequestException(
          `Not enough stock for spare part with id ${sparePart.id}`,
        );
      }
      sparePart.stock = newStock;
    });
    await this.repository.save(spareParts);
  }
}
