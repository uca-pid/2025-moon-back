import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  type IGoalService,
  IGoalServiceToken,
} from 'src/domain/interfaces/goal-service.interface';
import { AuthenticatedWorkshop } from '../decorators/authenticated-mechanic.decorator';
import { type JwtPayload } from 'src/domain/dtos/jwt-payload.interface';
import { CreateGoalDto } from 'src/infraestructure/dtos/goals/create-goal.dto';

@Controller('goals')
export class GoalController {
  constructor(
    @Inject(IGoalServiceToken) private readonly goalService: IGoalService,
  ) {}

  @Post()
  createGoal(
    @AuthenticatedWorkshop() mechanic: JwtPayload,
    @Body() dto: CreateGoalDto,
  ) {
    return this.goalService.create(mechanic, dto);
  }

  @Get()
  getGoals(@AuthenticatedWorkshop() mechanic: JwtPayload) {
    return this.goalService.getGoalsOfMechanic(mechanic.id);
  }
}
