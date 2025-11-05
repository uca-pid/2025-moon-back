import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { UpdateServiceDto } from 'src/infraestructure/dtos/services/update-service.dto';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';
import type { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';

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
    return await this.serviceService.getPaginated(query, mechanic);
  }

  @Get('/requested-services')
  async getRequestedServices(
    @AuthenticatedWorkshop() mechanic: User,
  ): Promise<Service[]> {
    return await this.serviceService.getRequestedServices(mechanic);
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
    await this.validateSpareParts(dto, mechanic);
    return await this.serviceService.create(dto, mechanic);
  }

  private async validateSpareParts(
    dto: CreateServiceDto | UpdateServiceDto,
    mechanic: User,
  ): Promise<void> {
    const sparePartIds = dto.spareParts.map((sp) => sp.sparePartId);

    const duplicates = sparePartIds.filter(
      (id, idx) => sparePartIds.indexOf(id) !== idx,
    );
    if (duplicates.length > 0) {
      throw new BadRequestException('Duplicated spare parts detected');
    }

    const spareParts = await this.sparePartService.getByIds(sparePartIds);
    if (spareParts.length !== sparePartIds.length) {
      throw new NotFoundException('One or more spare parts not found');
    }
    if (spareParts.some((sp) => sp.mechanic.id !== mechanic.id)) {
      throw new UnauthorizedException(
        'One or more spare parts do not belong to the mechanic',
      );
    }
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: CreateServiceDto,
    @AuthenticatedWorkshop() mechanic: User,
  ): Promise<Service> {
    await this.validateSpareParts(dto, mechanic);
    const entity = await this.serviceService.getByIdWithMechanic(id);
    if (!entity || entity.mechanic.id !== mechanic.id) {
      throw new NotFoundException('Service not found');
    }

    return await this.serviceService.update(dto, entity);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: number,
    @AuthenticatedWorkshop() mechanic: User,
  ): Promise<void> {
    const entity = await this.serviceService.getByIdWithMechanic(id);
    if (!entity || entity.mechanic.id !== mechanic.id) {
      throw new NotFoundException('Service not found');
    }
    if (entity.mechanic.id !== mechanic.id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this service',
      );
    }
    await this.serviceService.delete(entity);
  }

  @Get('/stats/user')
  async getServiceStatsByUser(@AuthenticatedUser() user: JwtPayload) {
    return this.serviceService.getServiceStatsByUser(user.id);
  }

  @Get('/stats/mechanic/growth')
  async getTopGrowingServices(
    @AuthenticatedWorkshop() mechanic: User,
    @Query('days') days?: number,
  ) {
    return await this.serviceService.getTopGrowingServices(
      mechanic.id,
      Number(days) || 30,
    );
  }
}
