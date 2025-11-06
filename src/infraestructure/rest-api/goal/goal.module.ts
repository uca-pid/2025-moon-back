import { Module } from '@nestjs/common';
import { GoalController } from './goal.controller';
import { IGoalServiceToken } from 'src/domain/interfaces/goal-service.interface';
import { GoalService } from 'src/domain/services/goal/goal.service';
import { GoalRepository } from 'src/infraestructure/repositories/goal.repository';
import { IGoalRepositoryToken } from 'src/infraestructure/repositories/interfaces/goal-repository.interface';

@Module({
  imports: [],
  controllers: [GoalController],
  providers: [
    { provide: IGoalServiceToken, useClass: GoalService },
    { provide: IGoalRepositoryToken, useClass: GoalRepository },
  ],
  exports: [],
})
export class GoalModule {}
