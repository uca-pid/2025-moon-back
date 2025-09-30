import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import {
  type IAddressService,
  IAddressServiceToken,
} from 'src/domain/services/address/address.service';
import { AddressDto } from 'src/infraestructure/dtos/address/address.dto';
import { AutocompleteAddressQueryDto } from 'src/infraestructure/dtos/address/autocomplete-address-query.dto';

@Controller('addresses')
export class AddressController {
  constructor(
    @Inject(IAddressServiceToken)
    private readonly addressService: IAddressService,
  ) {}

  @Get('autocomplete')
  public async autocomplete(
    @Query() query: AutocompleteAddressQueryDto,
  ): Promise<AddressDto[]> {
    return this.addressService.autocomplete(query.input);
  }

  @Get(':placeId')
  public async detail(@Param('placeId') placeId: string): Promise<AddressDto> {
    const place = await this.addressService.getAddressDetailByPlaceId(placeId);
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }
}
