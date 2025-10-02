import { AddressDto } from 'src/infraestructure/dtos/address/address.dto';

export interface IAddressService {
  autocomplete(input: string): Promise<AddressDto[]>;
  getAddressDetailByPlaceId(placeId: string): Promise<AddressDto | null>;
}

export const IAddressServiceToken = Symbol('IAddressService');
