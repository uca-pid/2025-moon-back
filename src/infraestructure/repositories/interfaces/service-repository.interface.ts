import { Service } from 'src/infraestructure/entities/service/service.entity';
import { IBaseRepository } from './base-repository.interface';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';

export interface IServiceRepository extends IBaseRepository<Service> {
  findByMechanicId(id: number): Promise<Service[]>;
  findPaginated(
    query: PaginatedQueryDto,
    mechanicId: number,
  ): Promise<PaginatedResultDto<Service>>;
  findAll(): Promise<Service[]>;
  findById(id: number): Promise<Service>;
  findByIds(ids: number[]): Promise<Service[]>;
}

export const IServiceRepositoryToken = 'IServiceRepository';
