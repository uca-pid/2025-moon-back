import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateVehicleDto } from '../../dtos/vehicle/create-vehicle.dto';
import {
  type IVehicleService,
  IVehicleServiceToken,
} from 'src/domain/interfaces/vehicle-service.interface';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';
import type { JwtPayload } from 'src/infraestructure/dtos/shared/jwt-payload.interface';

@Controller('vehicle')
export class VehicleController {
  constructor(
    @Inject(IVehicleServiceToken)
    private readonly vehicleService: IVehicleService,
  ) {}

  @Post()
  create(@AuthenticatedUser() user: JwtPayload, @Body() dto: CreateVehicleDto) {
    return this.vehicleService.create(
      user,
      dto.licensePlate,
      dto.model,
      dto.year,
      dto.km,
    );
  }
}
