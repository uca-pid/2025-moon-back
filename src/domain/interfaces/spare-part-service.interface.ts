import { SparePart } from 'src/infraestructure/entities/spare-part/spare-part.entity';
import { PaginatedResultDto } from '../dtos/paginated-result.dto';
import { PaginatedQueryDto } from '../dtos/paginated-query.dto';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { CreateSparePartDto } from 'src/infraestructure/dtos/spare-part/create-spare-part.dto';
import { UpdateSparePartDto } from 'src/infraestructure/dtos/spare-part/update-spare-part.dto';

export interface ISparePartService {
  delete(part: SparePart): void;
  update(part: SparePart, dto: UpdateSparePartDto): Promise<SparePart>;
  create(dto: CreateSparePartDto, mechanic: User): Promise<SparePart>;
  getPaginated(
    query: PaginatedQueryDto,
    mechanic: User,
  ): Promise<PaginatedResultDto<SparePart>>;
  getById(id: number): Promise<SparePart>;
  getByIds(ids: number[]): Promise<SparePart[]>;
}

export const ISparePartServiceToken = 'ISparePartService';
