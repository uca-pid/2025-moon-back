import { Inject, Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { ISparePartService } from 'src/domain/interfaces/spare-part-service.interface';
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

  delete(part: SparePart): void {
    this.repository.delete(part.id);
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
}
