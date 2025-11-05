import { IsEnum, IsOptional } from 'class-validator';

export enum TimeRange {
  WEEK = 'week',
  TWO_WEEKS = 'two_weeks',
  MONTH = 'month',
}

export class GetWorkshopAppointmentRangeQueryDto {
  @IsOptional()
  @IsEnum(TimeRange, { message: 'timeRange must be week, two_weeks or month' })
  timeRange: TimeRange = TimeRange.WEEK;
}
