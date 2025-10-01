import { Service } from 'src/infraestructure/entities/service/service.entity';
import { PaginatedQueryDto } from '../dtos/paginated-query.dto';
import { PaginatedResultDto } from '../dtos/paginated-result.dto';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { CreateServiceDto } from 'src/infraestructure/dtos/services/create-service.dto';

export interface IServiceService {
  create(dto: CreateServiceDto, mechanic: User): unknown;
  getByMechanicId(mechanic: User): Promise<Service[]>;
  getPaginated(
    query: PaginatedQueryDto,
    mechanic: User,
  ): Promise<PaginatedResultDto<Service>>;
  getById(id: number): Promise<Service>;
  getByIds(ids: number[]): Promise<Service[]>;
}

export const IServiceServiceToken = 'IServiceService';
