import { Goal } from 'src/infraestructure/entities/goals/goal.entity';
import { IBaseRepository } from './base-repository.interface';
import { CreateGoalDto } from 'src/infraestructure/dtos/goals/create-goal.dto';
import { GoalDto } from 'src/infraestructure/dtos/goals/goal.dto';

export interface IGoalRepository extends IBaseRepository<Goal> {
  getGoalsOfMechanic(id: number): Promise<GoalDto[]>;
  createGoal(dto: CreateGoalDto, mechanicId: number): Promise<void>;
}

export const IGoalRepositoryToken = 'IGoalRepository';
