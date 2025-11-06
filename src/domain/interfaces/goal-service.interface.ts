import { CreateGoalDto } from 'src/infraestructure/dtos/goals/create-goal.dto';
import { JwtPayload } from '../dtos/jwt-payload.interface';
import { GoalDto } from 'src/infraestructure/dtos/goals/goal.dto';

export interface IGoalService {
  getGoalsOfMechanic(id: number): Promise<GoalDto[]>;
  create(mechanic: JwtPayload, dto: CreateGoalDto): unknown;
}

export const IGoalServiceToken = 'IGoalServiceToken';
