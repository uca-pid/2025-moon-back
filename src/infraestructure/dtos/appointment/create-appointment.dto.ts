import { IsArray, IsNumber, IsString, Matches } from 'class-validator';
import { IsNotPastDate } from 'src/infraestructure/rest-api/decorators/is-not-past-date.decorator';

export class CreateAppointmentDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-MM-dd',
  })
  @IsNotPastDate()
  date: string;

  @IsString()
  @Matches(/^((0[8-9]|1[0-6]):[0-5]\d|17:00)$/, {
    message: 'time must be in the format HH:mm and between 08:00 and 17:00',
  })
  time: string;

  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds: number[];

  @IsNumber()
  workshopId: number;

  @IsNumber()
  vehicleId: number;
}
