import { IsEnum, IsOptional } from 'class-validator';
import { DateFilter } from 'src/infraestructure/repositories/interfaces/appointment-repository.interface';

export class GetWorkshopAppointmentQueryDto {
  @IsEnum(DateFilter)
  @IsOptional()
  dateFilter?: DateFilter;
}
