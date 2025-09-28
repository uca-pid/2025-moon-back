import { Injectable } from '@nestjs/common';
import { IAddressService } from 'src/domain/services/address/address.service';
import { AddressDto } from '../dtos/address/address.dto';
import { PlacesClient } from '@googlemaps/places';
import { AddressDetailDto } from '../dtos/address/address-detail.dto';

@Injectable()
export class GoogleAddressService implements IAddressService {
  constructor(private readonly places: PlacesClient) {}

  public async autocomplete(input: string): Promise<AddressDto[]> {
    const [response] = await this.places.autocompletePlaces({
      input,
      regionCode: 'AR',
      languageCode: 'es',
    });
    if (!response || !response.suggestions) return [];
    return response.suggestions.map(({ placePrediction: pred }) => ({
      text: (pred?.text?.text as string) || '',
      placeId: pred?.placeId || '',
    }));
  }

  public async getAddressDetailByPlaceId(
    placeId: string,
  ): Promise<AddressDetailDto | null> {
    const [place] = await this.places.getPlace(
      {
        name: `places/${placeId}`,
      },
      {
        otherArgs: {
          headers: {
            'X-Goog-FieldMask':
              'id,displayName,formattedAddress,location,addressComponents',
          },
        },
      },
    );
    if (!place) return null;
    return {
      text: place.formattedAddress || '',
      placeId: place.id || '',
      location: place.location || null,
      addressComponents: place.addressComponents || [],
    };
  }
}
