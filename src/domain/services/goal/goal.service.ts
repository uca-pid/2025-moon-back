import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { IGoalService } from 'src/domain/interfaces/goal-service.interface';
import { CreateGoalDto } from 'src/infraestructure/dtos/goals/create-goal.dto';
import { GoalDto } from 'src/infraestructure/dtos/goals/goal.dto';
import {
  type IGoalRepository,
  IGoalRepositoryToken,
} from 'src/infraestructure/repositories/interfaces/goal-repository.interface';

@Injectable()
export class GoalService implements IGoalService {
  constructor(
    @Inject(IGoalRepositoryToken)
    private readonly goalRepository: IGoalRepository,
  ) {}

  getGoalsOfMechanic(id: number): Promise<GoalDto[]> {
    return this.goalRepository.getGoalsOfMechanic(id);
  }

  async create(mechanic: JwtPayload, dto: CreateGoalDto): Promise<void> {
    await this.goalRepository.createGoal(dto, mechanic.id);
  }
}
