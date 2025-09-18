import { IsNumber, IsString, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-MM-dd',
  })
  date: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'time must be in the format HH:mm e.g. 14:30',
  })
  time: string;

  @IsNumber()
  serviceId: number;
}
