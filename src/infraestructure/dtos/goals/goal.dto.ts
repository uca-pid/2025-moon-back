import { GoalType } from 'src/infraestructure/entities/goals/goal-type.enum';

export interface GoalDto {
  id: number;
  label: string;
  type: GoalType;
  quantity: number;
  actual: number;
  startDate: string;
  endDate: string;
}
