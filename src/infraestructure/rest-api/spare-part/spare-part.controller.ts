import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PaginatedQueryDto } from 'src/domain/dtos/paginated-query.dto';
import {
  type ISparePartService,
  ISparePartServiceToken,
} from 'src/domain/interfaces/spare-part-service.interface';
import { AuthenticatedWorkshop } from '../decorators/authenticated-mechanic.decorator';
import { User } from 'src/infraestructure/entities/user/user.entity';
import { CreateSparePartDto } from 'src/infraestructure/dtos/spare-part/create-spare-part.dto';
import { UpdateSparePartDto } from 'src/infraestructure/dtos/spare-part/update-spare-part.dto';
import { CreateEntryDto } from 'src/infraestructure/dtos/spare-part/create-entry-body.dto';
import { type JwtPayload } from 'src/domain/dtos/jwt-payload.interface';

@Controller('spare-parts')
export class SparePartController {
  constructor(
    @Inject(ISparePartServiceToken)
    private readonly sparePartService: ISparePartService,
  ) {}

  @Get()
  getPaginated(
    @Query() query: PaginatedQueryDto,
    @AuthenticatedWorkshop() mechanic: User,
  ) {
    return this.sparePartService.getPaginated(query, mechanic);
  }

  @Post()
  create(
    @Body() dto: CreateSparePartDto,
    @AuthenticatedWorkshop() mechanic: User,
  ) {
    return this.sparePartService.create(dto, mechanic);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateSparePartDto,
    @AuthenticatedWorkshop() mechanic: User,
  ) {
    const part = await this.sparePartService.getById(id);
    if (part.mechanic.id !== mechanic.id) {
      throw new UnauthorizedException(
        'You do not have permission to update this spare part',
      );
    }
    return this.sparePartService.update(part, dto);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: number,
    @AuthenticatedWorkshop() mechanic: User,
  ) {
    const part = await this.sparePartService.getById(id);
    if (part.mechanic.id !== mechanic.id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this spare part',
      );
    }
    return this.sparePartService.delete(part);
  }

  @Get('/:id')
  async getById(
    @Param('id') id: number,
    @AuthenticatedWorkshop() mechanic: User,
  ) {
    const part = await this.sparePartService.getById(id);
    if (part.mechanic.id !== mechanic.id) {
      throw new UnauthorizedException(
        'You do not have permission to view this spare part',
      );
    }
    // @ts-expect-error dont return mechanic so we don't expose user data
    part.mechanic = undefined;
    return part;
  }

  @Post('/entry')
  async createEntry(
    @Body() createEntryBody: CreateEntryDto[],
    @AuthenticatedWorkshop() mechanic: JwtPayload,
  ) {
    await this.sparePartService.createEntry(createEntryBody, mechanic);
  }
}
