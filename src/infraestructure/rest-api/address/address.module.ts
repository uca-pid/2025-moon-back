import { PlacesClient } from '@googlemaps/places';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleAddressService } from 'src/infraestructure/services/google-address.service';
import { AddressController } from './address.controller';
import { IAddressServiceToken } from 'src/domain/services/address/address.service';

@Module({
  imports: [ConfigModule],
  controllers: [AddressController],
  providers: [
    GoogleAddressService,
    {
      provide: PlacesClient,
      useFactory: (config: ConfigService) =>
        new PlacesClient({
          apiKey: config.get<string>('GOOGLE_PLACES_API_KEY'),
        }),
      inject: [ConfigService],
    },
    {
      provide: IAddressServiceToken,
      useClass: GoogleAddressService,
    },
  ],
})
export class AddressModule {}
