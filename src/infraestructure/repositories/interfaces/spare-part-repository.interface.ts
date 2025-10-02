import { SparePart } from 'src/infraestructure/entities/spare-part/spare-part.entity';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import { IBaseRepository } from './base-repository.interface';

export interface CreateSparePartData {
  name: string;
  stock: number;
  mechanicId: number;
}

export interface ISparePartRepository extends IBaseRepository<SparePart> {
  getByIds(ids: number[]): Promise<SparePart[]>;
  getById(id: number): Promise<SparePart>;
  getPaginated(
    query: PaginatedQueryDto,
    mechanicId: number,
  ): Promise<PaginatedResultDto<SparePart>>;
  createSparePart(data: CreateSparePartData): Promise<SparePart>;
  blockServicesBySparePartId(id: number): Promise<void>;
  removeById(id: number): Promise<void>;
}

export const ISparePartRepositoryToken = 'ISparePartRepository';
