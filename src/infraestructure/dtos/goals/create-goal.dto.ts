import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { GoalType } from 'src/infraestructure/entities/goals/goal-type.enum';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(GoalType)
  type: GoalType;

  @IsOptional()
  @IsNumber()
  serviceId?: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-MM-dd',
  })
  startDate: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in the format yyyy-MM-dd',
  })
  endDate: string;
}
