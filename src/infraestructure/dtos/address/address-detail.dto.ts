import { google } from '@googlemaps/places/build/protos/protos';

export class AddressDetailDto {
  text: string;
  placeId: string;
  location: google.type.ILatLng | null | undefined;
  addressComponents?: {
    types?: string[] | null;
    longText?: string | null;
    shortText?: string | null;
  }[];
}
