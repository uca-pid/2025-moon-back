import { Service } from 'src/infraestructure/entities/service/service.entity';
import { PaginatedQueryDto } from '../dtos/paginated-query.dto';
import { PaginatedResultDto } from '../dtos/paginated-result.dto';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { CreateServiceDto } from 'src/infraestructure/dtos/services/create-service.dto';

export interface IServiceService {
  getByIdWithMechanic(id: number): Promise<Service | null>;
  delete(entity: Service): Promise<void>;
  create(dto: CreateServiceDto, mechanic: User): Promise<Service>;
  update(dto: CreateServiceDto, entity: Service): Promise<Service>;
  getByMechanicId(mechanic: User): Promise<Service[]>;
  getPaginated(
    query: PaginatedQueryDto,
    mechanic: User,
  ): Promise<PaginatedResultDto<Service>>;
  getById(id: number): Promise<Service>;
  getByIds(ids: number[]): Promise<Service[]>;
  getRequestedServices(
    mechanic: User,
  ): Promise<(Service & { appointmentsCount: number })[]>;
}

export const IServiceServiceToken = 'IServiceService';
