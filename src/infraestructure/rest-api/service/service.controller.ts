import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import { PaginatedResultDto } from 'src/domain/dtos/paginated-result.dto';
import {
  IServiceServiceToken,
  type IServiceService,
} from 'src/domain/interfaces/service-service.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';
import { AuthenticatedWorkshop } from '../decorators/authenticated-mechanic.decorator';
import { User } from 'src/infraestructure/entities/user/user.entity';
import {
  type IUsersService,
  IUsersServiceToken,
} from 'src/domain/interfaces/users-service.interface';
import { CreateServiceDto } from 'src/infraestructure/dtos/services/create-service.dto';
import {
  type ISparePartService,
  ISparePartServiceToken,
} from 'src/domain/interfaces/spare-part-service.interface';

@Controller('services')
export class ServiceController {
  constructor(
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
    @Inject(IUsersServiceToken) private readonly usersService: IUsersService,
    @Inject(ISparePartServiceToken)
    private readonly sparePartService: ISparePartService,
  ) {}

  @Get()
  async getPaginated(
    @Query() query: PaginatedQueryDto,
    @AuthenticatedWorkshop() mechanic: User,
  ): Promise<PaginatedResultDto<Service>> {
    return this.serviceService.getPaginated(query, mechanic);
  }

  @Get('/mechanic/:id')
  async getByMechanic(@Param('id') id: number): Promise<Service[]> {
    const mechanic = await this.usersService.getWorkshopById(id);
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }
    return await this.serviceService.getByMechanicId(mechanic);
  }

  @Get('/:id')
  async getById(@Param('id') id: number): Promise<Service> {
    const response = await this.serviceService.getById(id);
    return response;
  }

  @Post()
  async create(
    @Body() dto: CreateServiceDto,
    @AuthenticatedWorkshop() mechanic: User,
  ): Promise<Service> {
    const sparePartIds = dto.spareParts.map((sp) => sp.sparePartId);
    const spareParts = await this.sparePartService.getByIds(sparePartIds);
    if (spareParts.length !== sparePartIds.length) {
      throw new NotFoundException('One or more spare parts not found');
    }
    if (spareParts.some((sp) => sp.mechanic.id !== mechanic.id)) {
      throw new UnauthorizedException(
        'One or more spare parts do not belong to the mechanic',
      );
    }
    return await this.serviceService.create(dto, mechanic);
  }
}
