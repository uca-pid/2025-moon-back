import { IExpenseTrackerServiceToken } from 'src/domain/interfaces/expense-tracker-service.interface';
import { SpendeeExpenseTrackerService } from './spendee-expense-tracker.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: IExpenseTrackerServiceToken,
      useClass: SpendeeExpenseTrackerService,
    },
  ],
  exports: [IExpenseTrackerServiceToken],
})
export class ExpenseTrackerModule {}
