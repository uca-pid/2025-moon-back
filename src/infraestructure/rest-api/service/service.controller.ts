import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  IServiceServiceToken,
  type IServiceService,
} from 'src/domain/interfaces/service-service.interface';
import { Service } from 'src/infraestructure/entities/service/service.entity';

@Controller('service')
export class ServiceController {
  constructor(
    @Inject(IServiceServiceToken)
    private readonly serviceService: IServiceService,
  ) {}

  @Get('/all')
  async getAll(): Promise<Service[]> {
    const response = await this.serviceService.getAll();
    return response;
  }

  @Get('/:id')
  async getById(@Param('id') id: number): Promise<Service> {
    const response = await this.serviceService.getById(id);
    return response;
  }
}
